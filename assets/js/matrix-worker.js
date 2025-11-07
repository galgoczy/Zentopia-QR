import { generateQRCodeMatrix } from './qr/encoder.js';

let workerInstance = null;
let fallbackToMainThread = false;
let jobId = 0;
const pendingJobs = new Map();

function terminateWorker(reason) {
  if (!workerInstance) {
    return;
  }
  workerInstance.terminate();
  workerInstance = null;
  pendingJobs.forEach(({ reject, timeoutId }) => {
    clearTimeout(timeoutId);
    reject(new Error(reason || 'Matrix worker terminated'));
  });
  pendingJobs.clear();
}

function createWorker() {
  if (fallbackToMainThread) {
    return null;
  }
  try {
    const worker = new Worker(new URL('./workers/matrix.worker.js', import.meta.url), {
      type: 'module'
    });

    worker.onmessage = (event) => {
      const { id, type, moduleCount, version, buffer, error } = event.data || {};
      if (!id || !pendingJobs.has(id)) {
        return;
      }
      const job = pendingJobs.get(id);
      pendingJobs.delete(id);
      clearTimeout(job.timeoutId);

      if (type === 'encode-result' && buffer instanceof ArrayBuffer) {
        job.resolve({ moduleCount, version, modules: new Uint8Array(buffer) });
      } else if (type === 'encode-error') {
        job.reject(new Error(error || 'Matrix worker reported an error'));
      } else {
        job.reject(new Error('Matrix worker returned an unknown response'));
      }
    };

    worker.onerror = (event) => {
      console.error('Matrix worker encountered an error', event.message || event);
      fallbackToMainThread = true;
      terminateWorker('Matrix worker crashed');
    };

    return worker;
  } catch (error) {
    console.warn('Unable to initialise matrix worker, using main-thread encoding', error);
    fallbackToMainThread = true;
    return null;
  }
}

export function generateMatrix(data) {
  if (!data) {
    return Promise.resolve(null);
  }

  if (fallbackToMainThread) {
    return Promise.resolve(generateQRCodeMatrix(data));
  }

  if (!workerInstance) {
    workerInstance = createWorker();
  }

  if (!workerInstance) {
    return Promise.resolve(generateQRCodeMatrix(data));
  }

  const id = ++jobId;

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      pendingJobs.delete(id);
      reject(new Error('Matrix worker timed out'));
    }, 5000);

    pendingJobs.set(id, { resolve, reject, timeoutId });

    try {
      workerInstance.postMessage({
        type: 'encode',
        id,
        payload: { data }
      });
    } catch (error) {
      clearTimeout(timeoutId);
      pendingJobs.delete(id);
      reject(error);
    }
  }).catch((error) => {
    console.warn('Matrix worker failed, falling back to synchronous encoding', error);
    fallbackToMainThread = true;
    terminateWorker('Switching to main-thread encoding');
    return generateQRCodeMatrix(data);
  });
}
