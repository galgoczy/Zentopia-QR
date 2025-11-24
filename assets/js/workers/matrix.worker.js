import { generateQRCodeMatrix } from '../qr/encoder.js';

self.addEventListener('message', (event) => {
  const { type, id, payload } = event.data || {};
  if (type !== 'encode' || !id) {
    return;
  }

  try {
    const data = payload?.data ?? '';
    if (typeof data !== 'string' || data.length === 0) {
      self.postMessage({ type: 'encode-error', id, error: 'No data provided' });
      return;
    }

    const { moduleCount, modules, version } = generateQRCodeMatrix(data);
    self.postMessage(
      {
        type: 'encode-result',
        id,
        moduleCount,
        version,
        buffer: modules.buffer
      },
      [modules.buffer]
    );
  } catch (error) {
    self.postMessage({
      type: 'encode-error',
      id,
      error: error instanceof Error ? error.message : 'Unknown worker error'
    });
  }
});
