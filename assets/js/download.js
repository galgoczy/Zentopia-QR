import { buildDownloadCanvas, captionMetrics } from './render.js';

export async function downloadPng(matrix, customization, filenameBase) {
  if (!matrix) return;
  const canvas = await buildDownloadCanvas(matrix, customization, { scale: 3 });
  const link = document.createElement('a');
  link.download = `${filenameBase}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.append(link);
  link.click();
  link.remove();
}

export function downloadSvg(matrix, customization, filenameBase) {
  if (!matrix) return;
  const svgMarkup = createSvgMarkup(matrix, customization);
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filenameBase}-${Date.now()}.svg`;
  link.href = url;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function createSvgMarkup(matrix, customization) {
  const baseSize = 360;
  const borderWidth = 16;
  const framePadding = 32;
  const extraMargin = 24;
  const moduleSize = Math.floor((baseSize - 24) / matrix.moduleCount);
  const drawSize = moduleSize * matrix.moduleCount;
  const margin = Math.floor((baseSize - drawSize) / 2);
  const innerX = extraMargin + borderWidth + framePadding + margin;
  const innerY = extraMargin + borderWidth + framePadding + margin;
  const caption = captionMetrics(customization);
  const totalWidth = baseSize + (borderWidth + framePadding + extraMargin) * 2;
  const totalHeight = baseSize + (borderWidth + framePadding + extraMargin) * 2 + (caption.height || 0);

  const elements = [];
  elements.push(`<rect width="${totalWidth}" height="${totalHeight}" fill="#ffffff" />`);

  const borderRadius = customization.cornerStyle === 'rounded' ? 28 : 10;
  const frameRadius = customization.cornerStyle === 'rounded' ? 18 : 6;

  elements.push(`<rect x="${extraMargin}" y="${extraMargin}" width="${totalWidth - extraMargin * 2}" height="${totalHeight - extraMargin * 2 - (caption.height || 0)}" rx="${borderRadius}" ry="${borderRadius}" fill="${customization.borderColor}" />`);
  elements.push(`<rect x="${extraMargin + borderWidth}" y="${extraMargin + borderWidth}" width="${totalWidth - (extraMargin + borderWidth) * 2}" height="${totalHeight - (extraMargin + borderWidth) * 2 - (caption.height || 0)}" rx="${frameRadius}" ry="${frameRadius}" fill="#ffffff" />`);

  const { moduleCount, modules } = matrix;
  let index = 0;
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!modules[index++]) continue;
      const isFinder = row <= 6 && col <= 6 || row <= 6 && col >= moduleCount - 7 || row >= moduleCount - 7 && col <= 6;
      const fill = isFinder ? customization.cornerSquareColor : customization.codeColor;
      const x = innerX + col * moduleSize;
      const y = innerY + row * moduleSize;
      if (!isFinder && customization.moduleStyle === 'round') {
        const radius = (moduleSize / 2) * 0.88;
        elements.push(`<circle cx="${x + moduleSize / 2}" cy="${y + moduleSize / 2}" r="${radius}" fill="${fill}" />`);
      } else {
        elements.push(`<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${fill}" />`);
      }
    }
  }

  if (customization.centerLogo) {
    const logoTarget = customization.logoSize === 'large' ? 79 : 55;
    const maxLogo = Math.min(drawSize * 0.35, logoTarget);
    const padding = Math.max(4, Math.round(maxLogo * 0.08));
    const logoX = innerX + drawSize / 2 - maxLogo / 2;
    const logoY = innerY + drawSize / 2 - maxLogo / 2;
    elements.push(`<rect x="${logoX - padding}" y="${logoY - padding}" width="${maxLogo + padding * 2}" height="${maxLogo + padding * 2}" fill="${customization.backgroundColor}" />`);
    elements.push(`<image href="${customization.centerLogo}" x="${logoX}" y="${logoY}" width="${maxLogo}" height="${maxLogo}" />`);
  }

  if (caption.height) {
    const baseline = totalHeight - caption.height / 2;
    elements.push(`<text x="${totalWidth / 2}" y="${baseline}" fill="#374151" font-family="Inter, system-ui, sans-serif" font-size="${caption.fontSize}" font-weight="${caption.fontWeight}" text-anchor="middle">${escapeXml(caption.text)}</text>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">${elements.join('')}</svg>`;
}

function escapeXml(text) {
  return text.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[ch]);
}
