import { generateQRCodeMatrix, QRErrorCorrectionLevel } from './qrcode.js';

self.addEventListener('message', event => {
  const payload = event.data || {};
  const { id, data } = payload;
  if (typeof id !== 'number' || typeof data !== 'string') {
    return;
  }

  try {
    const { moduleCount, modules } = generateQRCodeMatrix(data, {
      errorCorrectionLevel: QRErrorCorrectionLevel.M
    });
    const matrix = modules.slice();
    self.postMessage(
      {
        id,
        success: true,
        moduleCount,
        modules: matrix
      },
      [matrix.buffer]
    );
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error?.message || String(error)
    });
  }
});
