/*
 * QR Code Generator - Byte mode implementation derived from
 * the algorithm described in ISO/IEC 18004:2015.
 *
 * The structure of this module is inspired by open source
 * implementations such as Kazuhiko Arase's "qrcode-generator"
 * (MIT license). The code here is an original re-implementation
 * crafted for the Zentopia Labs project so that we can ship a
 * completely self-contained QR experience without external
 * dependencies.
 */

const QRMode = {
  NUMERIC: 1,
  ALPHA_NUM: 2,
  BYTE: 4
};

const QRErrorCorrectionLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2
};

const QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
};

const GLOG_TABLE = new Array(256);
const GEXP_TABLE = new Array(256);

(function initGaloisTables() {
  let x = 1;
  for (let i = 0; i < 256; i++) {
    GEXP_TABLE[i] = x;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
  for (let i = 0; i < 255; i++) {
    GLOG_TABLE[GEXP_TABLE[i]] = i;
  }
})();

function glog(n) {
  if (n < 1) {
    throw new Error(`glog(${n})`);
  }
  return GLOG_TABLE[n];
}

function gexp(n) {
  while (n < 0) {
    n += 255;
  }
  while (n >= 256) {
    n -= 255;
  }
  return GEXP_TABLE[n];
}

const QR_POLY_CACHE = new Map();

function getErrorCorrectPolynomial(errorCorrectLength) {
  if (QR_POLY_CACHE.has(errorCorrectLength)) {
    return QR_POLY_CACHE.get(errorCorrectLength);
  }
  let poly = new QRPolynomial([1], 0);
  for (let i = 0; i < errorCorrectLength; i++) {
    poly = poly.multiply(new QRPolynomial([1, gexp(i)], 0));
  }
  QR_POLY_CACHE.set(errorCorrectLength, poly);
  return poly;
}

class QRPolynomial {
  constructor(num, shift) {
    if (!Array.isArray(num)) {
      throw new Error('QRPolynomial expects an array');
    }
    let offset = 0;
    while (offset < num.length && num[offset] === 0) {
      offset++;
    }
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset];
    }
    for (let i = num.length - offset; i < this.num.length; i++) {
      this.num[i] = 0;
    }
  }

  get length() {
    return this.num.length;
  }

  get(index) {
    return this.num[index];
  }

  multiply(e) {
    const num = new Array(this.length + e.length - 1).fill(0);
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < e.length; j++) {
        num[i + j] ^= gexp(glog(this.get(i)) + glog(e.get(j)));
      }
    }
    return new QRPolynomial(num, 0);
  }

  mod(e) {
    if (this.length - e.length < 0) {
      return this;
    }
    const ratio = glog(this.get(0)) - glog(e.get(0));
    const num = this.num.slice();
    for (let i = 0; i < e.length; i++) {
      num[i] ^= gexp(glog(e.get(i)) + ratio);
    }
    return new QRPolynomial(num, 0).mod(e);
  }
}

const RS_BLOCK_TABLE = {
  1: {
    [QRErrorCorrectionLevel.L]: [1, 26, 19],
    [QRErrorCorrectionLevel.M]: [1, 26, 16],
    [QRErrorCorrectionLevel.Q]: [1, 26, 13],
    [QRErrorCorrectionLevel.H]: [1, 26, 9]
  },
  2: {
    [QRErrorCorrectionLevel.L]: [1, 44, 34],
    [QRErrorCorrectionLevel.M]: [1, 44, 28],
    [QRErrorCorrectionLevel.Q]: [1, 44, 22],
    [QRErrorCorrectionLevel.H]: [1, 44, 16]
  },
  3: {
    [QRErrorCorrectionLevel.L]: [1, 70, 55],
    [QRErrorCorrectionLevel.M]: [1, 70, 44],
    [QRErrorCorrectionLevel.Q]: [2, 35, 17],
    [QRErrorCorrectionLevel.H]: [2, 35, 13]
  },
  4: {
    [QRErrorCorrectionLevel.L]: [1, 100, 80],
    [QRErrorCorrectionLevel.M]: [2, 50, 32],
    [QRErrorCorrectionLevel.Q]: [2, 50, 24],
    [QRErrorCorrectionLevel.H]: [4, 25, 9]
  },
  5: {
    [QRErrorCorrectionLevel.L]: [1, 134, 108],
    [QRErrorCorrectionLevel.M]: [2, 67, 43],
    [QRErrorCorrectionLevel.Q]: [2, 33, 15, 2, 34, 16],
    [QRErrorCorrectionLevel.H]: [2, 33, 11, 2, 34, 12]
  },
  6: {
    [QRErrorCorrectionLevel.L]: [2, 86, 68],
    [QRErrorCorrectionLevel.M]: [4, 43, 27],
    [QRErrorCorrectionLevel.Q]: [4, 43, 19],
    [QRErrorCorrectionLevel.H]: [4, 43, 15]
  },
  7: {
    [QRErrorCorrectionLevel.L]: [2, 98, 78],
    [QRErrorCorrectionLevel.M]: [4, 49, 31],
    [QRErrorCorrectionLevel.Q]: [2, 32, 14, 4, 33, 15],
    [QRErrorCorrectionLevel.H]: [4, 39, 13, 1, 40, 14]
  },
  8: {
    [QRErrorCorrectionLevel.L]: [2, 121, 97],
    [QRErrorCorrectionLevel.M]: [2, 60, 38, 2, 61, 39],
    [QRErrorCorrectionLevel.Q]: [4, 40, 18, 2, 41, 19],
    [QRErrorCorrectionLevel.H]: [4, 40, 14, 2, 41, 15]
  },
  9: {
    [QRErrorCorrectionLevel.L]: [2, 146, 116],
    [QRErrorCorrectionLevel.M]: [3, 58, 36, 2, 59, 37],
    [QRErrorCorrectionLevel.Q]: [4, 36, 16, 4, 37, 17],
    [QRErrorCorrectionLevel.H]: [4, 36, 12, 4, 37, 13]
  },
  10: {
    [QRErrorCorrectionLevel.L]: [2, 86, 68, 2, 87, 69],
    [QRErrorCorrectionLevel.M]: [4, 69, 43, 1, 70, 44],
    [QRErrorCorrectionLevel.Q]: [6, 43, 19, 2, 44, 20],
    [QRErrorCorrectionLevel.H]: [6, 43, 15, 2, 44, 16]
  },
  11: {
    [QRErrorCorrectionLevel.L]: [4, 101, 81],
    [QRErrorCorrectionLevel.M]: [1, 80, 50, 4, 81, 51],
    [QRErrorCorrectionLevel.Q]: [4, 50, 22, 4, 51, 23],
    [QRErrorCorrectionLevel.H]: [3, 36, 12, 8, 37, 13]
  },
  12: {
    [QRErrorCorrectionLevel.L]: [2, 116, 92, 2, 117, 93],
    [QRErrorCorrectionLevel.M]: [6, 58, 36, 2, 59, 37],
    [QRErrorCorrectionLevel.Q]: [4, 46, 20, 6, 47, 21],
    [QRErrorCorrectionLevel.H]: [7, 42, 14, 4, 43, 15]
  },
  13: {
    [QRErrorCorrectionLevel.L]: [4, 133, 107],
    [QRErrorCorrectionLevel.M]: [8, 59, 37, 1, 60, 38],
    [QRErrorCorrectionLevel.Q]: [8, 44, 20, 4, 45, 21],
    [QRErrorCorrectionLevel.H]: [12, 33, 11, 4, 34, 12]
  },
  14: {
    [QRErrorCorrectionLevel.L]: [3, 145, 115, 1, 146, 116],
    [QRErrorCorrectionLevel.M]: [4, 64, 40, 5, 65, 41],
    [QRErrorCorrectionLevel.Q]: [11, 36, 16, 5, 37, 17],
    [QRErrorCorrectionLevel.H]: [11, 36, 12, 5, 37, 13]
  }
};

function getRSBlocks(typeNumber, errorCorrectionLevel) {
  const versionInfo = RS_BLOCK_TABLE[typeNumber];
  if (!versionInfo) {
    throw new Error(`No RS block table for type ${typeNumber}`);
  }
  const rsBlock = versionInfo[errorCorrectionLevel];
  if (!rsBlock) {
    throw new Error(`No RS block for type ${typeNumber}`);
  }
  const list = [];
  for (let i = 0; i < rsBlock.length; i += 3) {
    const count = rsBlock[i];
    const totalCount = rsBlock[i + 1];
    const dataCount = rsBlock[i + 2];
    for (let j = 0; j < count; j++) {
      list.push(new QRRSBlock(totalCount, dataCount));
    }
  }
  return list;
}

class QRRSBlock {
  constructor(totalCount, dataCount) {
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }
}

function getBCHDigit(data) {
  let digit = 0;
  while (data !== 0) {
    digit++;
    data >>>= 1;
  }
  return digit;
}

const QRUtil = {
  PATTERN_POSITION_TABLE: [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90]
  ],

  getBCHTypeInfo(data) {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(0x537) >= 0) {
      d ^= 0x537 << (getBCHDigit(d) - getBCHDigit(0x537) - 1);
    }
    return ((data << 10) | d) ^ 0x5412;
  },

  getBCHTypeNumber(data) {
    let d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(0x1f25) >= 0) {
      d ^= 0x1f25 << (getBCHDigit(d) - getBCHDigit(0x1f25) - 1);
    }
    return (data << 12) | d;
  },

  getPatternPosition(typeNumber) {
    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
  },

  getMask(maskPattern, i, j) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return (i + j) % 2 === 0;
      case QRMaskPattern.PATTERN001:
        return i % 2 === 0;
      case QRMaskPattern.PATTERN010:
        return j % 3 === 0;
      case QRMaskPattern.PATTERN011:
        return (i + j) % 3 === 0;
      case QRMaskPattern.PATTERN100:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case QRMaskPattern.PATTERN101:
        return ((i * j) % 2) + ((i * j) % 3) === 0;
      case QRMaskPattern.PATTERN110:
        return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
      case QRMaskPattern.PATTERN111:
        return (((i + j) % 2) + ((i * j) % 3)) % 2 === 0;
      default:
        return false;
    }
  },

  getLostPoint(qrCode) {
    const moduleCount = qrCode.moduleCount;
    let lostPoint = 0;

    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        let sameCount = 0;
        const dark = qrCode.isDark(row, col);
        for (let r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) continue;
          for (let c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c) continue;
            if (r === 0 && c === 0) continue;
            if (dark === qrCode.isDark(row + r, col + c)) sameCount++;
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }

    for (let row = 0; row < moduleCount - 1; row++) {
      for (let col = 0; col < moduleCount - 1; col++) {
        const count =
          (qrCode.isDark(row, col) ? 1 : 0) +
          (qrCode.isDark(row + 1, col) ? 1 : 0) +
          (qrCode.isDark(row, col + 1) ? 1 : 0) +
          (qrCode.isDark(row + 1, col + 1) ? 1 : 0);
        if (count === 0 || count === 4) {
          lostPoint += 3;
        }
      }
    }

    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount - 6; col++) {
        if (
          qrCode.isDark(row, col) &&
          !qrCode.isDark(row, col + 1) &&
          qrCode.isDark(row, col + 2) &&
          qrCode.isDark(row, col + 3) &&
          qrCode.isDark(row, col + 4) &&
          !qrCode.isDark(row, col + 5) &&
          qrCode.isDark(row, col + 6)
        ) {
          lostPoint += 40;
        }
      }
    }

    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount - 6; row++) {
        if (
          qrCode.isDark(row, col) &&
          !qrCode.isDark(row + 1, col) &&
          qrCode.isDark(row + 2, col) &&
          qrCode.isDark(row + 3, col) &&
          qrCode.isDark(row + 4, col) &&
          !qrCode.isDark(row + 5, col) &&
          qrCode.isDark(row + 6, col)
        ) {
          lostPoint += 40;
        }
      }
    }

    let darkCount = 0;
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount; row++) {
        if (qrCode.isDark(row, col)) {
          darkCount++;
        }
      }
    }

    const ratio = Math.abs((darkCount * 100) / (moduleCount * moduleCount) - 50) / 5;
    lostPoint += ratio * 10;

    return lostPoint;
  }
};

class QRBitBuffer {
  constructor() {
    this.buffer = [];
    this.length = 0;
  }

  get(index) {
    const bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
  }

  put(num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    }
    this.length++;
  }
}

class QR8bitByte {
  constructor(data) {
    this.mode = QRMode.BYTE;
    this.data = new TextEncoder().encode(data);
  }

  getLength() {
    return this.data.length;
  }

  write(buffer) {
    for (let i = 0; i < this.data.length; i++) {
      buffer.put(this.data[i], 8);
    }
  }
}

class QRCode {
  constructor(typeNumber, errorCorrectionLevel = QRErrorCorrectionLevel.M) {
    this.typeNumber = typeNumber;
    this.errorCorrectionLevel = errorCorrectionLevel;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = [];
  }

  addData(data) {
    this.dataList.push(new QR8bitByte(data));
    this.dataCache = null;
  }

  isDark(row, col) {
    if (!this.modules || row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      return false;
    }
    return this.modules[row][col];
  }

  make() {
    if (this.typeNumber < 1) {
      this.typeNumber = this.#getBestTypeNumber();
    }
    this.#makeImpl(false, this.#getBestMaskPattern());
  }

  #getBestTypeNumber() {
    for (let typeNumber = 1; typeNumber <= 40; typeNumber++) {
      const rsBlocks = getRSBlocks(typeNumber, this.errorCorrectionLevel);
      const totalDataCount = rsBlocks.reduce((sum, block) => sum + block.dataCount, 0);
      const buffer = new QRBitBuffer();
      for (const data of this.dataList) {
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), QRCode.#getLengthInBits(data.mode, typeNumber));
        data.write(buffer);
      }
      if (buffer.length <= totalDataCount * 8) {
        return typeNumber;
      }
    }
    throw new Error('Too much data for QR code');
  }

  #makeImpl(test, maskPattern) {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = new Array(this.moduleCount);
    for (let row = 0; row < this.moduleCount; row++) {
      this.modules[row] = new Array(this.moduleCount).fill(null);
    }

    this.#setupPositionProbePattern(0, 0);
    this.#setupPositionProbePattern(this.moduleCount - 7, 0);
    this.#setupPositionProbePattern(0, this.moduleCount - 7);
    this.#setupPositionAdjustPattern();
    this.#setupTimingPattern();
    this.#setupTypeInfo(test, maskPattern);

    if (this.typeNumber >= 7) {
      this.#setupTypeNumber(test);
    }

    if (!this.dataCache) {
      this.dataCache = QRCode.#createData(this.typeNumber, this.errorCorrectionLevel, this.dataList);
    }

    this.#mapData(this.dataCache, maskPattern);
  }

  #setupPositionProbePattern(row, col) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;
        if ((0 <= r && r <= 6 && (c === 0 || c === 6)) || (0 <= c && c <= 6 && (r === 0 || r === 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  }

  #setupTimingPattern() {
    for (let i = 0; i < this.moduleCount; i++) {
      if (this.modules[6][i] === null) {
        this.modules[6][i] = i % 2 === 0;
      }
      if (this.modules[i][6] === null) {
        this.modules[i][6] = i % 2 === 0;
      }
    }
  }

  #setupPositionAdjustPattern() {
    const pos = QRUtil.getPatternPosition(this.typeNumber);
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (this.modules[row][col] !== null) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            this.modules[row + r][col + c] =
              r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0);
          }
        }
      }
    }
  }

  #setupTypeNumber(test) {
    const bits = QRUtil.getBCHTypeNumber(this.typeNumber);
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >>> i) & 1) === 1;
      this.modules[Math.floor(i / 3)][(i % 3) + this.moduleCount - 8 - 3] = mod;
      this.modules[(i % 3) + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  }

  #setupTypeInfo(test, maskPattern) {
    const data = (this.errorCorrectionLevel << 3) | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);

    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >>> i) & 1) === 1;
      if (i < 6) {
        this.modules[i][8] = mod;
      } else if (i < 8) {
        this.modules[i + 1][8] = mod;
      } else {
        this.modules[this.moduleCount - 15 + i][8] = mod;
      }
    }

    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >>> i) & 1) === 1;
      if (i < 8) {
        this.modules[8][this.moduleCount - i - 1] = mod;
      } else if (i < 9) {
        this.modules[8][15 - i - 1] = mod;
      } else {
        this.modules[8][15 - i - 1] = mod;
      }
    }

    this.modules[this.moduleCount - 8][8] = !test;
  }

  #mapData(data, maskPattern) {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 0;
    let byteIndex = 0;

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] === null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> (7 - bitIndex)) & 1) === 1;
            }
            const mask = QRUtil.getMask(maskPattern, row, col - c);
            if (mask) {
              dark = !dark;
            }
            this.modules[row][col - c] = dark;
            bitIndex++;
            if (bitIndex === 8) {
              byteIndex++;
              bitIndex = 0;
            }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }

  #getBestMaskPattern() {
    let minLostPoint = Infinity;
    let bestPattern = 0;
    for (let pattern = 0; pattern < 8; pattern++) {
      this.#makeImpl(true, pattern);
      const lostPoint = QRUtil.getLostPoint(this);
      if (lostPoint < minLostPoint) {
        minLostPoint = lostPoint;
        bestPattern = pattern;
      }
    }
    return bestPattern;
  }

  static #createData(typeNumber, errorCorrectionLevel, dataList) {
    const rsBlocks = getRSBlocks(typeNumber, errorCorrectionLevel);
    const buffer = new QRBitBuffer();

    for (const data of dataList) {
      buffer.put(data.mode, 4);
      buffer.put(data.getLength(), QRCode.#getLengthInBits(data.mode, typeNumber));
      data.write(buffer);
    }

    let totalDataCount = 0;
    rsBlocks.forEach(block => {
      totalDataCount += block.dataCount;
    });

    if (buffer.length > totalDataCount * 8) {
      throw new Error('Code length overflow');
    }

    if (buffer.length + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }

    while (buffer.length % 8 !== 0) {
      buffer.putBit(false);
    }

    const paddingBytes = [0xec, 0x11];
    let i = 0;
    while (buffer.length / 8 < totalDataCount) {
      buffer.put(paddingBytes[i % 2], 8);
      i++;
    }

    return QRCode.#createBytes(buffer, rsBlocks);
  }

  static #createBytes(buffer, rsBlocks) {
    let offset = 0;
    const maxDcCount = Math.max(...rsBlocks.map(block => block.dataCount));
    const maxEcCount = Math.max(...rsBlocks.map(block => block.totalCount - block.dataCount));

    const dcdata = rsBlocks.map(block => new Array(block.dataCount));
    const ecdata = rsBlocks.map(block => new Array(block.totalCount - block.dataCount));

    for (let r = 0; r < rsBlocks.length; r++) {
      for (let i = 0; i < rsBlocks[r].dataCount; i++) {
        dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      }
      offset += rsBlocks[r].dataCount;
      const rsPoly = getErrorCorrectPolynomial(ecdata[r].length);
      const rawPoly = new QRPolynomial(dcdata[r], rsPoly.length - 1);
      const modPoly = rawPoly.mod(rsPoly);
      for (let i = 0; i < ecdata[r].length; i++) {
        const modIndex = i + modPoly.length - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
      }
    }

    const totalCodeCount = rsBlocks.reduce((sum, block) => sum + block.totalCount, 0);
    const data = new Array(totalCodeCount);
    let index = 0;

    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data[index++] = dcdata[r][i];
        }
      }
    }

    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data[index++] = ecdata[r][i];
        }
      }
    }

    return data;
  }

  static #getLengthInBits(mode, type) {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.NUMERIC:
          return 10;
        case QRMode.ALPHA_NUM:
          return 9;
        case QRMode.BYTE:
          return 8;
        default:
          throw new Error('mode:' + mode);
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.NUMERIC:
          return 12;
        case QRMode.ALPHA_NUM:
          return 11;
        case QRMode.BYTE:
          return 16;
        default:
          throw new Error('mode:' + mode);
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.NUMERIC:
          return 14;
        case QRMode.ALPHA_NUM:
          return 13;
        case QRMode.BYTE:
          return 16;
        default:
          throw new Error('mode:' + mode);
      }
    } else {
      throw new Error('type:' + type);
    }
  }
}

export function createQRCode(data, options = {}) {
  const {
    errorCorrectionLevel = QRErrorCorrectionLevel.M,
    size = 256,
    color = '#000000',
    background = '#ffffff'
  } = options;

  const qr = new QRCode(-1, errorCorrectionLevel);
  qr.addData(data);
  qr.make();

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);

  const cells = qr.moduleCount;
  const cellSize = Math.floor(size / cells);
  const margin = Math.floor((size - cellSize * cells) / 2);

  ctx.fillStyle = color;

  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      if (qr.isDark(row, col)) {
        const x = margin + col * cellSize;
        const y = margin + row * cellSize;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }

  return { canvas, qr };
}

export { QRErrorCorrectionLevel };
