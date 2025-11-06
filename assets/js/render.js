import { generateQRCodeMatrix } from './qr/encoder.js';

export async function renderPreview(data, customization) {
  if (!data) {
    return { wrapper: buildEmptyState(customization), canvas: null, matrix: null };
  }

  const matrix = generateQRCodeMatrix(data);
  const baseSize = 320;
  const scale = Math.min(2, window.devicePixelRatio || 1);
  const { canvas, ctx } = createCanvas(baseSize, scale);
  const metrics = drawMatrix(ctx, baseSize, matrix, customization);
  await applyCenterLogo(ctx, baseSize, customization, metrics);

  const frame = buildFrame(canvas, customization);
  const wrapper = document.createElement('div');
  wrapper.className = 'qr-wrapper';
  wrapper.append(frame);

  if (customization.showCaption && customization.caption.trim()) {
    const caption = document.createElement('div');
    caption.className = 'qr-caption';
    caption.textContent = customization.caption.trim();
    caption.style.fontWeight = customization.captionBold ? '700' : '600';
    caption.style.fontSize = captionFontSize(customization.captionSize);
    wrapper.append(caption);
  }

  return { wrapper, canvas, matrix, metrics, baseSize };
}

export function buildEmptyState(customization) {
  const frame = document.createElement('div');
  frame.className = 'qr-empty';
  frame.innerHTML = `
    <div class="qr-empty__icon" aria-hidden="true">🌀</div>
    <p>${customization.fillFormText || 'Fill in the form to generate your QR code'}</p>
  `;
  return frame;
}

export function createCanvas(size, scale = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(size * scale));
  canvas.height = Math.max(1, Math.round(size * scale));
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

export function drawMatrix(ctx, size, matrix, customization) {
  const { moduleCount, modules } = matrix;
  const cellSize = Math.max(1, Math.floor((size - 24) / moduleCount));
  const drawSize = cellSize * moduleCount;
  const margin = Math.floor((size - drawSize) / 2);

  ctx.fillStyle = customization.backgroundColor;
  ctx.fillRect(0, 0, size, size);

  let index = 0;
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!modules[index++]) continue;
      const isFinder = isFinderModule(row, col, moduleCount);
      const fill = isFinder ? customization.cornerSquareColor : customization.codeColor;
      ctx.fillStyle = fill;
      const x = margin + col * cellSize;
      const y = margin + row * cellSize;

      if (!isFinder && customization.moduleStyle === 'round') {
        const radius = (cellSize / 2) * 0.88;
        ctx.beginPath();
        ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }

  return { cellSize, margin, drawSize, moduleCount };
}

export async function applyCenterLogo(ctx, size, customization, metrics) {
  if (!customization.centerLogo) return;
  const { drawSize } = metrics;
  const logoTarget = customization.logoSize === 'large' ? 79 : 55;
  const maxLogo = Math.min(drawSize * 0.35, logoTarget);
  const padding = Math.max(4, Math.round(maxLogo * 0.08));
  const logoSize = maxLogo;
  const x = (size - logoSize) / 2;
  const y = (size - logoSize) / 2;

  await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = customization.backgroundColor;
      ctx.fillRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2);
      ctx.drawImage(img, x, y, logoSize, logoSize);
      resolve();
    };
    img.onerror = resolve;
    img.src = customization.centerLogo;
  });
}

function buildFrame(canvas, customization) {
  const frame = document.createElement('div');
  frame.className = 'qr-frame';
  frame.style.border = `6px solid ${customization.borderColor}`;
  frame.style.borderRadius = customization.cornerStyle === 'rounded' ? '26px' : '16px';
  frame.style.background = '#ffffff';
  frame.style.padding = '14px';
  frame.style.display = 'inline-flex';
  frame.style.boxShadow = '0 26px 64px -38px rgba(15, 23, 42, 0.55)';
  frame.append(canvas);
  canvas.style.borderRadius = customization.cornerStyle === 'rounded' ? '18px' : '8px';
  return frame;
}

function captionFontSize(size) {
  switch (size) {
    case 'large':
      return '1.35rem';
    case 'xlarge':
      return '1.6rem';
    default:
      return '1.1rem';
  }
}

function isFinderModule(row, col, moduleCount) {
  const max = moduleCount - 7;
  if (row <= 6 && col <= 6) return true;
  if (row <= 6 && col >= max) return true;
  if (row >= max && col <= 6) return true;
  return false;
}

export function captionMetrics(customization) {
  if (!customization.showCaption || !customization.caption.trim()) {
    return { height: 0, fontSize: 0, fontWeight: '600' };
  }
  const fontSize = customization.captionSize === 'large' ? 28 : customization.captionSize === 'xlarge' ? 40 : 22;
  return {
    height: customization.captionSize === 'xlarge' ? 110 : customization.captionSize === 'large' ? 80 : 60,
    fontSize,
    fontWeight: customization.captionBold ? '700' : '600',
    text: customization.caption.trim()
  };
}

export function buildDownloadCanvas(matrix, customization, options = {}) {
  const baseSize = options.baseSize || 360;
  const borderWidth = 16;
  const framePadding = 32;
  const extraMargin = 24;
  const caption = captionMetrics(customization);
  const totalWidth = baseSize + (borderWidth + framePadding + extraMargin) * 2;
  const totalHeight = baseSize + (borderWidth + framePadding + extraMargin) * 2 + (caption.height || 0);
  const scale = options.scale || 3;

  const { canvas, ctx } = createCanvas(totalWidth, scale);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  const frameX = extraMargin;
  const frameY = extraMargin;
  const frameW = totalWidth - extraMargin * 2;
  const frameH = totalHeight - extraMargin * 2 - (caption.height || 0);
  drawRoundedRect(ctx, frameX, frameY, frameW, frameH, customization.cornerStyle === 'rounded' ? 28 : 10, customization.borderColor);
  drawRoundedRect(ctx, frameX + borderWidth, frameY + borderWidth, frameW - borderWidth * 2, frameH - borderWidth * 2, customization.cornerStyle === 'rounded' ? 18 : 6, '#ffffff');

  const innerSize = baseSize;
  const innerX = extraMargin + borderWidth + framePadding;
  const innerY = extraMargin + borderWidth + framePadding;
  const innerCanvas = document.createElement('canvas');
  innerCanvas.width = innerSize;
  innerCanvas.height = innerSize;
  const innerCtx = innerCanvas.getContext('2d');
  innerCtx.imageSmoothingEnabled = false;

  const metrics = drawMatrix(innerCtx, innerSize, matrix, customization);
  return applyCenterLogo(innerCtx, innerSize, customization, metrics).then(() => {
    ctx.drawImage(innerCanvas, innerX, innerY, innerSize, innerSize);

    if (caption.height) {
      ctx.fillStyle = '#374151';
      ctx.font = `${caption.fontWeight} ${caption.fontSize}px 'Inter', system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(caption.text, totalWidth / 2, totalHeight - caption.height / 2);
    }

    return canvas;
  });
}

export function drawRoundedRect(ctx, x, y, width, height, radius, color) {
  const r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}
