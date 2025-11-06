import { createQRCode, QRErrorCorrectionLevel } from './qrcode.js';

const TRANSLATIONS = {
  'en-US': {
    appTitle: 'QR Code Generator',
    appDescription: 'Generate QR codes for URLs, text, contact information, and WiFi',
    urlTab: 'URL',
    textTab: 'Text',
    contactTab: 'Contact',
    wifiTab: 'WiFi',
    enterUrl: 'Enter URL',
    enterText: 'Enter Text',
    contactInformation: 'Contact Information',
    wifiInformation: 'WiFi Information',
    websiteUrl: 'Website URL',
    urlPlaceholder: 'example.com or https://example.com',
    urlHelp: "Enter a website URL. If you don't include http://, we'll add https:// automatically.",
    textContent: 'Text Content',
    textPlaceholder: 'Enter any text to generate QR code...',
    firstName: 'First Name',
    firstNamePlaceholder: 'John',
    lastName: 'Last Name',
    lastNamePlaceholder: 'Doe',
    phoneNumber: 'Phone Number',
    phonePlaceholder: '+1 (555) 123-4567',
    emailAddress: 'Email Address',
    emailPlaceholder: 'john.doe@example.com',
    organization: 'Organization',
    organizationPlaceholder: 'Company Name',
    website: 'Website',
    websitePlaceholder: 'https://example.com',
    clearAllFields: 'Clear All Fields',
    generatedQrCode: 'Generated QR Code',
    scanQrCode: 'Scan this QR code with your device',
    fillFormPrompt: 'Fill in the form to generate your QR code',
    downloadPng: 'Download PNG',
    downloadSvg: 'Download SVG',
    copyData: 'Copy Data',
    copied: 'Copied!',
    qrCodeData: 'QR Code Data:',
    footerText: 'Generate QR codes instantly • No data stored • Free to use',
    qrCodeAlt: 'Generated QR Code',
    wifiNetworkName: 'Network Name (SSID)',
    wifiPassword: 'Password',
    wifiSecurity: 'Security Type',
    wifiHidden: 'Hidden Network',
    networkNamePlaceholder: 'My WiFi Network',
    passwordPlaceholder: 'Enter WiFi password',
    wifiOpen: 'Open',
    wifiWpa: 'WPA/WPA2',
    wifiWep: 'WEP',
    customization: 'Customization',
    codeColor: 'Code Color',
    backgroundColor: 'Background Color',
    cornerStyle: 'Corner Style',
    squareCorners: 'Square',
    roundedCorners: 'Rounded',
    borderColor: 'Border Color',
    cornerSquareColor: 'Corner Square Color',
    moduleStyle: 'Module Style',
    squareModules: 'Square',
    roundModules: 'Round Dots',
    centerLogo: 'Center Logo',
    uploadLogo: 'Upload Logo',
    logoUploaded: 'Logo uploaded',
    logoSize: 'Logo Size',
    logoSmall: 'Small (55px)',
    logoLarge: 'Large (79px)',
    removeLogo: 'Remove Logo',
    caption: 'Caption',
    captionPlaceholder: 'Enter caption text...',
    showCaption: 'Show Caption',
    captionSize: 'Caption Size',
    captionSmall: 'Normal',
    captionLarge: 'Large',
    captionExtraLarge: 'Extra Large',
    captionBold: 'Bold Text',
    termsTitle: 'Terms of Use',
    privacyTitle: 'Privacy Policy',
    contactTitle: 'Contact Us'
  },
  'es-ES': {
    appTitle: 'Generador de Códigos QR',
    appDescription: 'Genera códigos QR para URLs, texto, información de contacto y WiFi',
    urlTab: 'URL',
    textTab: 'Texto',
    contactTab: 'Contacto',
    wifiTab: 'WiFi',
    enterUrl: 'Ingresa URL',
    enterText: 'Ingresa Texto',
    contactInformation: 'Información de Contacto',
    wifiInformation: 'Información WiFi',
    websiteUrl: 'URL del Sitio Web',
    urlPlaceholder: 'ejemplo.com o https://ejemplo.com',
    urlHelp: 'Ingresa una URL de sitio web. Si no incluyes http://, agregaremos https:// automáticamente.',
    textContent: 'Contenido de Texto',
    textPlaceholder: 'Ingresa cualquier texto para generar código QR...',
    firstName: 'Nombre',
    firstNamePlaceholder: 'Juan',
    lastName: 'Apellido',
    lastNamePlaceholder: 'Pérez',
    phoneNumber: 'Número de Teléfono',
    phonePlaceholder: '+1 (555) 123-4567',
    emailAddress: 'Dirección de Correo',
    emailPlaceholder: 'juan.perez@ejemplo.com',
    organization: 'Organización',
    organizationPlaceholder: 'Nombre de la Empresa',
    website: 'Sitio Web',
    websitePlaceholder: 'https://ejemplo.com',
    clearAllFields: 'Limpiar Todos los Campos',
    generatedQrCode: 'Código QR Generado',
    scanQrCode: 'Escanea este código QR con tu dispositivo',
    fillFormPrompt: 'Completa el formulario para generar tu código QR',
    downloadPng: 'Descargar PNG',
    downloadSvg: 'Descargar SVG',
    copyData: 'Copiar Datos',
    copied: '¡Copiado!',
    qrCodeData: 'Datos del Código QR:',
    footerText: 'Genera códigos QR al instante • No se almacenan datos • Gratis',
    qrCodeAlt: 'Código QR Generado',
    wifiNetworkName: 'Nombre de Red (SSID)',
    wifiPassword: 'Contraseña',
    wifiSecurity: 'Tipo de Seguridad',
    wifiHidden: 'Red Oculta',
    networkNamePlaceholder: 'Mi Red WiFi',
    passwordPlaceholder: 'Ingresa contraseña WiFi',
    wifiOpen: 'Abierta',
    wifiWpa: 'WPA/WPA2',
    wifiWep: 'WEP',
    customization: 'Personalización',
    codeColor: 'Color del Código',
    backgroundColor: 'Color de Fondo',
    cornerStyle: 'Estilo de Esquinas',
    squareCorners: 'Cuadradas',
    roundedCorners: 'Redondeadas',
    borderColor: 'Color del Borde',
    cornerSquareColor: 'Color de Esquinas',
    moduleStyle: 'Estilo de Módulos',
    squareModules: 'Cuadrados',
    roundModules: 'Puntos Redondos',
    centerLogo: 'Logo Central',
    uploadLogo: 'Subir Logo',
    logoUploaded: 'Logo cargado',
    logoSize: 'Tamaño del Logo',
    logoSmall: 'Pequeño (55px)',
    logoLarge: 'Grande (79px)',
    removeLogo: 'Quitar Logo',
    caption: 'Pie de Foto',
    captionPlaceholder: 'Ingresa texto del pie...',
    showCaption: 'Mostrar Pie de Foto',
    captionSize: 'Tamaño del Pie',
    captionSmall: 'Normal',
    captionLarge: 'Grande',
    captionExtraLarge: 'Extra Grande',
    captionBold: 'Texto en Negrita',
    termsTitle: 'Términos de Uso',
    privacyTitle: 'Política de Privacidad',
    contactTitle: 'Contáctanos'
  }
};

const htmlElement = document.documentElement;
const appLocale = htmlElement.dataset.appLocale || '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';

function findMatchingLocale(locale) {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(`${lang}-`));
  return match || 'en-US';
}

const locale = appLocale !== '{{APP_LOCALE}}' ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);

function t(key) {
  return TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;
}

const placeholders = new Map([
  ['url-input', 'urlPlaceholder'],
  ['text-input', 'textPlaceholder'],
  ['contact-first', 'firstNamePlaceholder'],
  ['contact-last', 'lastNamePlaceholder'],
  ['contact-phone', 'phonePlaceholder'],
  ['contact-email', 'emailPlaceholder'],
  ['contact-organization', 'organizationPlaceholder'],
  ['contact-url', 'websitePlaceholder'],
  ['wifi-password', 'passwordPlaceholder'],
  ['wifi-ssid', 'networkNamePlaceholder'],
  ['caption-text', 'captionPlaceholder']
]);

const state = {
  activeTab: 'url',
  url: '',
  text: '',
  contact: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  },
  wifi: {
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false
  },
  customization: {
    codeColor: '#000000',
    backgroundColor: '#ffffff',
    cornerStyle: 'square',
    borderColor: '#000000',
    cornerSquareColor: '#000000',
    moduleStyle: 'square',
    centerLogo: null,
    logoSize: 'small',
    showCaption: false,
    caption: '',
    captionSize: 'small',
    captionBold: false
  },
  qrData: '',
  copied: false
};

let renderTimeoutId = null;
let lastRenderSignature = '';
let pendingRenderSignature = '';
let pendingRenderData = '';

const elements = {
  tabButtons: Array.from(document.querySelectorAll('.tab-button')),
  formTitle: document.getElementById('form-title'),
  formGroups: Array.from(document.querySelectorAll('.form-group')),
  urlInput: document.getElementById('url-input'),
  textInput: document.getElementById('text-input'),
  contactFirst: document.getElementById('contact-first'),
  contactLast: document.getElementById('contact-last'),
  contactPhone: document.getElementById('contact-phone'),
  contactEmail: document.getElementById('contact-email'),
  contactOrganization: document.getElementById('contact-organization'),
  contactUrl: document.getElementById('contact-url'),
  wifiSsid: document.getElementById('wifi-ssid'),
  wifiPassword: document.getElementById('wifi-password'),
  wifiSecurity: document.getElementById('wifi-security'),
  wifiHidden: document.getElementById('wifi-hidden'),
  resetButton: document.getElementById('reset-button'),
  colorCode: document.getElementById('color-code'),
  colorBackground: document.getElementById('color-background'),
  colorCorner: document.getElementById('color-corner'),
  colorBorder: document.getElementById('color-border'),
  cornerStyle: document.getElementById('corner-style'),
  moduleStyle: document.getElementById('module-style'),
  logoInput: document.getElementById('logo-input'),
  logoActions: document.getElementById('logo-actions'),
  logoUploadSection: document.getElementById('logo-upload-section'),
  removeLogo: document.getElementById('remove-logo'),
  logoSize: document.getElementById('logo-size'),
  captionToggle: document.getElementById('caption-toggle'),
  captionSettings: document.getElementById('caption-settings'),
  captionText: document.getElementById('caption-text'),
  captionSize: document.getElementById('caption-size'),
  captionBold: document.getElementById('caption-bold'),
  qrContainer: document.getElementById('qr-container'),
  qrPlaceholder: document.getElementById('qr-placeholder'),
  qrContent: document.getElementById('qr-content'),
  actions: document.getElementById('actions'),
  copyButton: document.getElementById('copy-data'),
  copyLabel: document.getElementById('copy-label'),
  downloadPng: document.getElementById('download-png'),
  downloadSvg: document.getElementById('download-svg'),
  qrDataBlock: document.getElementById('qr-data-block'),
  qrData: document.getElementById('qr-data'),
  modalRoot: document.getElementById('modal-root'),
  modalTemplate: document.getElementById('modal-template')
};

function applyTranslations() {
  document.documentElement.lang = locale;
  document.querySelectorAll('[data-i18n]').forEach(node => {
    const key = node.getAttribute('data-i18n');
    if (!key) return;
    node.textContent = t(key);
  });

  placeholders.forEach((key, id) => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute('placeholder', t(key));
    }
  });

  elements.resetButton.textContent = t('clearAllFields');
}

function formatUrl(url) {
  if (!url.trim()) return '';
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url.trim()}`;
  }
  return url.trim();
}

function generateVCard(contact) {
  return `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.firstName} ${contact.lastName}\nN:${contact.lastName};${contact.firstName};;;\nORG:${contact.organization}\nTEL:${contact.phone}\nEMAIL:${contact.email}\nURL:${contact.url}\nEND:VCARD`;
}

function generateWifiConfig(wifi) {
  const security = wifi.security === 'Open' ? 'nopass' : wifi.security;
  const hidden = wifi.hidden ? 'true' : 'false';
  return `WIFI:T:${security};S:${wifi.ssid};P:${wifi.password};H:${hidden};`;
}

function updateFormTitle() {
  switch (state.activeTab) {
    case 'url':
      elements.formTitle.textContent = t('enterUrl');
      break;
    case 'text':
      elements.formTitle.textContent = t('enterText');
      break;
    case 'contact':
      elements.formTitle.textContent = t('contactInformation');
      break;
    case 'wifi':
      elements.formTitle.textContent = t('wifiInformation');
      break;
    default:
      elements.formTitle.textContent = '';
  }
}

function updateFormVisibility() {
  elements.formGroups.forEach(group => {
    const section = group.getAttribute('data-section');
    group.classList.toggle('active', section === state.activeTab);
  });
}

function updateTabButtons() {
  elements.tabButtons.forEach(button => {
    const tab = button.getAttribute('data-tab');
    button.classList.toggle('active', tab === state.activeTab);
    button.setAttribute('aria-selected', tab === state.activeTab ? 'true' : 'false');
  });
}

function buildRenderSignature(data) {
  const customization = state.customization;
  const logoSignature = customization.centerLogo
    ? `${customization.centerLogo.length}-${customization.centerLogo.slice(-16)}`
    : 'no-logo';
  return [
    data,
    customization.codeColor,
    customization.backgroundColor,
    customization.cornerSquareColor,
    customization.borderColor,
    customization.cornerStyle,
    customization.moduleStyle,
    customization.logoSize,
    customization.showCaption ? '1' : '0',
    customization.caption,
    customization.captionSize,
    customization.captionBold ? '1' : '0',
    logoSignature
  ].join('|');
}

function scheduleRender() {
  if (renderTimeoutId) {
    clearTimeout(renderTimeoutId);
  }
  renderTimeoutId = window.setTimeout(() => {
    renderTimeoutId = null;
    if (!pendingRenderSignature) {
      return;
    }
    if (pendingRenderSignature === lastRenderSignature) {
      pendingRenderSignature = '';
      pendingRenderData = '';
      return;
    }
    if (!pendingRenderData) {
      clearQRCode();
      lastRenderSignature = '';
      pendingRenderSignature = '';
      pendingRenderData = '';
      return;
    }
    renderQRCode(pendingRenderData);
    lastRenderSignature = pendingRenderSignature;
    pendingRenderSignature = '';
    pendingRenderData = '';
  }, 75);
}

function computeQrData() {
  switch (state.activeTab) {
    case 'url':
      return formatUrl(state.url);
    case 'text':
      return state.text;
    case 'contact':
      if (state.contact.firstName || state.contact.lastName || state.contact.phone || state.contact.email) {
        return generateVCard(state.contact);
      }
      return '';
    case 'wifi':
      if (state.wifi.ssid) {
        return generateWifiConfig(state.wifi);
      }
      return '';
    default:
      return '';
  }
}

function clearQRCode() {
  elements.qrContainer.innerHTML = '';
  elements.qrPlaceholder.classList.remove('hidden');
  elements.qrContent.classList.add('hidden');
  elements.actions.classList.add('hidden');
  elements.qrDataBlock.classList.add('hidden');
}

function applyRoundedModules(ctx, qr, canvasSize, cellSize, margin, cornerColor, codeColor, moduleStyle) {
  if (moduleStyle !== 'round') {
    return;
  }
  const moduleCount = qr.moduleCount;
  const radius = cellSize * 0.45;
  ctx.fillStyle = codeColor;
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = state.customization.backgroundColor;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: moduleCount - 7 },
    { row: moduleCount - 7, col: 0 }
  ];

  const isInCorner = (row, col) => {
    return corners.some(corner => row >= corner.row && row < corner.row + 7 && col >= corner.col && col < corner.col + 7);
  };

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!qr.isDark(row, col)) continue;
      const x = margin + col * cellSize + cellSize / 2;
      const y = margin + row * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.fillStyle = isInCorner(row, col) ? cornerColor : codeColor;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawSquareModules(ctx, qr, cellSize, margin, cornerColor, codeColor) {
  const moduleCount = qr.moduleCount;
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: moduleCount - 7 },
    { row: moduleCount - 7, col: 0 }
  ];

  const isInCorner = (row, col) => {
    return corners.some(corner => row >= corner.row && row < corner.row + 7 && col >= corner.col && col < corner.col + 7);
  };

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!qr.isDark(row, col)) continue;
      const x = margin + col * cellSize;
      const y = margin + row * cellSize;
      ctx.fillStyle = isInCorner(row, col) ? cornerColor : codeColor;
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
}

function renderQRCode(data) {
  if (!data) {
    clearQRCode();
    return;
  }

  const { customization } = state;
  const size = 300;
  const { canvas, qr } = createQRCode(data, {
    size,
    errorCorrectionLevel: QRErrorCorrectionLevel.M,
    color: customization.codeColor,
    background: customization.backgroundColor
  });

  const ctx = canvas.getContext('2d');
  const moduleCount = qr.moduleCount;
  const cellSize = Math.floor(size / moduleCount);
  const margin = Math.floor((size - cellSize * moduleCount) / 2);

  ctx.fillStyle = customization.backgroundColor;
  ctx.fillRect(0, 0, size, size);

  if (customization.moduleStyle === 'round') {
    applyRoundedModules(ctx, qr, size, cellSize, margin, customization.cornerSquareColor, customization.codeColor, customization.moduleStyle);
  } else {
    drawSquareModules(ctx, qr, cellSize, margin, customization.cornerSquareColor, customization.codeColor);
  }

  if (customization.centerLogo) {
    const logoImg = new Image();
    const logoPixelSize = customization.logoSize === 'small' ? 55 : 79;
    const padding = 3;
    logoImg.onload = () => {
      const drawCtx = canvas.getContext('2d');
      const x = (size - logoPixelSize) / 2;
      const y = (size - logoPixelSize) / 2;
      drawCtx.fillStyle = customization.backgroundColor;
      drawCtx.fillRect(x - padding, y - padding, logoPixelSize + padding * 2, logoPixelSize + padding * 2);
      drawCtx.drawImage(logoImg, x, y, logoPixelSize, logoPixelSize);
      updateContainer(canvas);
    };
    logoImg.onerror = () => {
      console.warn('Failed to load center logo');
      updateContainer(canvas);
    };
    logoImg.src = customization.centerLogo;
  } else {
    updateContainer(canvas);
  }

  function updateContainer(renderCanvas) {
    elements.qrContainer.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = customization.cornerStyle === 'rounded' ? 'inline-block bg-white shadow-lg rounded-2xl' : 'inline-block bg-white shadow-lg';
    wrapper.style.border = `6px solid ${customization.borderColor}`;
    wrapper.style.padding = '12px';
    wrapper.style.backgroundColor = '#ffffff';

    if (customization.cornerStyle === 'rounded') {
      renderCanvas.style.borderRadius = '12px';
    } else {
      renderCanvas.style.borderRadius = '0';
    }

    renderCanvas.style.width = '100%';
    renderCanvas.style.height = 'auto';
    renderCanvas.style.maxWidth = '300px';
    renderCanvas.setAttribute('aria-label', t('qrCodeAlt'));
    wrapper.appendChild(renderCanvas);
    elements.qrContainer.appendChild(wrapper);

    if (customization.showCaption && customization.caption) {
      const caption = document.createElement('div');
      caption.textContent = customization.caption;
      caption.className = 'text-center text-gray-700 mt-4 px-2';
      caption.style.fontWeight = customization.captionBold ? '700' : '500';
      if (customization.captionSize === 'small') {
        caption.style.fontSize = '1.125rem';
      } else if (customization.captionSize === 'large') {
        caption.style.fontSize = '1.25rem';
      } else {
        caption.style.fontSize = '2rem';
      }
      elements.qrContainer.appendChild(caption);
    }

    elements.qrPlaceholder.classList.add('hidden');
    elements.qrContent.classList.remove('hidden');
    elements.actions.classList.remove('hidden');
    elements.qrDataBlock.classList.remove('hidden');
    elements.qrData.textContent = data;
  }
}

function updateStateAndRender() {
  const nextData = computeQrData();
  const nextSignature = nextData ? buildRenderSignature(nextData) : '';
  const hadData = Boolean(state.qrData);

  state.qrData = nextData;

  if (!nextData) {
    pendingRenderData = '';
    pendingRenderSignature = '';
    if (renderTimeoutId) {
      clearTimeout(renderTimeoutId);
      renderTimeoutId = null;
    }
    if (lastRenderSignature || hadData) {
      clearQRCode();
    }
    lastRenderSignature = '';
    return;
  }

  if (nextSignature === lastRenderSignature && !pendingRenderSignature) {
    return;
  }

  pendingRenderData = nextData;
  pendingRenderSignature = nextSignature;
  scheduleRender();
}

function resetState() {
  state.url = '';
  state.text = '';
  state.contact = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  };
  state.wifi = {
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false
  };
  state.customization = {
    codeColor: '#000000',
    backgroundColor: '#ffffff',
    cornerStyle: 'square',
    borderColor: '#000000',
    cornerSquareColor: '#000000',
    moduleStyle: 'square',
    centerLogo: null,
    logoSize: 'small',
    showCaption: false,
    caption: '',
    captionSize: 'small',
    captionBold: false
  };
  state.qrData = '';
  pendingRenderData = '';
  pendingRenderSignature = '';
  lastRenderSignature = '';
  if (renderTimeoutId) {
    clearTimeout(renderTimeoutId);
    renderTimeoutId = null;
  }

  elements.urlInput.value = '';
  elements.textInput.value = '';
  elements.contactFirst.value = '';
  elements.contactLast.value = '';
  elements.contactPhone.value = '';
  elements.contactEmail.value = '';
  elements.contactOrganization.value = '';
  elements.contactUrl.value = '';
  elements.wifiSsid.value = '';
  elements.wifiPassword.value = '';
  elements.wifiSecurity.value = 'WPA';
  elements.wifiHidden.checked = false;

  elements.colorCode.value = '#000000';
  elements.colorBackground.value = '#ffffff';
  elements.colorCorner.value = '#000000';
  elements.colorBorder.value = '#000000';
  elements.cornerStyle.value = 'square';
  elements.moduleStyle.value = 'square';
  elements.captionToggle.checked = false;
  elements.captionSettings.classList.add('hidden');
  elements.captionText.value = '';
  elements.captionSize.value = 'small';
  elements.captionBold.checked = false;
  elements.logoInput.value = '';
  toggleLogoUI(false);

  clearQRCode();
}

function toggleLogoUI(hasLogo) {
  if (hasLogo) {
    elements.logoActions.classList.remove('hidden');
    elements.logoUploadSection.classList.add('hidden');
  } else {
    elements.logoActions.classList.add('hidden');
    elements.logoUploadSection.classList.remove('hidden');
  }
}

function handleLogoUpload(event) {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) {
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    state.customization.centerLogo = e.target.result;
    toggleLogoUI(true);
    updateStateAndRender();
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  state.customization.centerLogo = null;
  elements.logoInput.value = '';
  toggleLogoUI(false);
  updateStateAndRender();
}

async function copyToClipboard() {
  if (!state.qrData) return;
  try {
    await navigator.clipboard.writeText(state.qrData);
    state.copied = true;
    elements.copyLabel.textContent = t('copied');
    elements.copyButton.classList.add('copied');
    setTimeout(() => {
      state.copied = false;
      elements.copyLabel.textContent = t('copyData');
      elements.copyButton.classList.remove('copied');
    }, 2000);
  } catch (error) {
    console.error('Failed to copy QR data', error);
  }
}

function drawDownloadCanvas(scaleFactor = 3) {
  const displayCanvas = elements.qrContainer.querySelector('canvas');
  if (!displayCanvas) {
    return null;
  }
  const { customization } = state;
  const baseSize = displayCanvas.width;
  const downloadCanvas = document.createElement('canvas');
  const ctx = downloadCanvas.getContext('2d');

  const borderWidth = 6 * scaleFactor;
  const padding = 12 * scaleFactor;
  const extraMargin = 10 * scaleFactor;
  let captionHeight = 0;
  if (customization.showCaption && customization.caption) {
    if (customization.captionSize === 'small') {
      captionHeight = 45 * scaleFactor;
    } else if (customization.captionSize === 'large') {
      captionHeight = 55 * scaleFactor;
    } else {
      captionHeight = 75 * scaleFactor;
    }
  }

  const scaledSize = baseSize * scaleFactor;
  const totalWidth = scaledSize + (borderWidth + padding + extraMargin) * 2;
  const totalHeight = scaledSize + (borderWidth + padding + extraMargin) * 2 + captionHeight;

  downloadCanvas.width = totalWidth;
  downloadCanvas.height = totalHeight;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  const borderX = extraMargin;
  const borderY = extraMargin;
  const borderW = totalWidth - extraMargin * 2;
  const borderH = totalHeight - extraMargin * 2 - captionHeight;

  ctx.fillStyle = customization.borderColor;
  if (customization.cornerStyle === 'rounded') {
    drawRoundedRect(ctx, borderX, borderY, borderW, borderH, 16 * scaleFactor, customization.borderColor);
    drawRoundedRect(ctx, borderX + borderWidth, borderY + borderWidth, borderW - borderWidth * 2, borderH - borderWidth * 2, 8 * scaleFactor, '#ffffff');
  } else {
    ctx.fillRect(borderX, borderY, borderW, borderH);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(borderX + borderWidth, borderY + borderWidth, borderW - borderWidth * 2, borderH - borderWidth * 2);
  }

  const qrX = extraMargin + borderWidth + padding;
  const qrY = extraMargin + borderWidth + padding;

  ctx.save();
  if (customization.cornerStyle === 'rounded') {
    drawRoundedRectPath(ctx, qrX, qrY, scaledSize, scaledSize, 8 * scaleFactor);
    ctx.clip();
  }
  ctx.drawImage(displayCanvas, qrX, qrY, scaledSize, scaledSize);
  ctx.restore();

  if (customization.showCaption && customization.caption) {
    let fontSize;
    let captionY;
    if (customization.captionSize === 'small') {
      fontSize = 18 * scaleFactor;
      captionY = totalHeight - 25 * scaleFactor;
    } else if (customization.captionSize === 'large') {
      fontSize = 25 * scaleFactor;
      captionY = totalHeight - 20 * scaleFactor;
    } else {
      fontSize = 40 * scaleFactor;
      captionY = totalHeight - 15 * scaleFactor;
    }
    ctx.fillStyle = '#374151';
    ctx.font = `${customization.captionBold ? '700' : '500'} ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(customization.caption, totalWidth / 2, captionY);
  }

  return downloadCanvas;
}

function downloadPNG() {
  if (!state.qrData) return;
  const canvas = drawDownloadCanvas(3);
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `qr-code-${state.activeTab}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function downloadSVG() {
  if (!state.qrData) return;
  const canvas = elements.qrContainer.querySelector('canvas');
  if (!canvas) return;

  const svgParts = [];
  const { customization } = state;
  const size = canvas.width;
  const borderWidth = 6;
  const padding = 12;
  const extraMargin = 10;
  let captionHeight = 0;
  let fontSize = 18;
  if (customization.showCaption && customization.caption) {
    if (customization.captionSize === 'small') {
      captionHeight = 45;
      fontSize = 18;
    } else if (customization.captionSize === 'large') {
      captionHeight = 55;
      fontSize = 25;
    } else {
      captionHeight = 75;
      fontSize = 40;
    }
  }
  const totalWidth = size + (borderWidth + padding + extraMargin) * 2;
  const totalHeight = size + (borderWidth + padding + extraMargin) * 2 + captionHeight;

  const imageData = canvas.toDataURL('image/png');

  svgParts.push('<?xml version="1.0" encoding="UTF-8"?>');
  svgParts.push(`<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg">`);
  svgParts.push('<rect width="100%" height="100%" fill="#ffffff"/>');

  const borderX = extraMargin;
  const borderY = extraMargin;
  const borderW = totalWidth - extraMargin * 2;
  const borderH = totalHeight - extraMargin * 2 - captionHeight;

  const cornerRadius = customization.cornerStyle === 'rounded' ? 16 : 0;
  const innerRadius = customization.cornerStyle === 'rounded' ? 8 : 0;

  svgParts.push(`<rect x="${borderX}" y="${borderY}" width="${borderW}" height="${borderH}" fill="${customization.borderColor}" rx="${cornerRadius}" ry="${cornerRadius}"/>`);
  svgParts.push(`<rect x="${borderX + borderWidth}" y="${borderY + borderWidth}" width="${borderW - borderWidth * 2}" height="${borderH - borderWidth * 2}" fill="#ffffff" rx="${innerRadius}" ry="${innerRadius}"/>`);

  const qrX = borderX + borderWidth + padding;
  const qrY = borderY + borderWidth + padding;

  svgParts.push(`<image x="${qrX}" y="${qrY}" width="${size}" height="${size}" href="${imageData}"/>`);

  if (customization.showCaption && customization.caption) {
    svgParts.push(`<text x="${totalWidth / 2}" y="${totalHeight - captionHeight / 3}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="${customization.captionBold ? '700' : '500'}" fill="#374151">${escapeXml(customization.caption)}</text>`);
  }

  svgParts.push('</svg>');

  const blob = new Blob([svgParts.join('\n')], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `qr-code-${state.activeTab}-${Date.now()}.svg`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function drawRoundedRect(ctx, x, y, width, height, radius, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawRoundedRectPath(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function openModal(type) {
  const modalContent = getModalContent(type);
  if (!modalContent) return;

  const fragment = elements.modalTemplate.content.cloneNode(true);
  const backdrop = fragment.querySelector('[data-modal-backdrop]');
  const modal = fragment.querySelector('.modal');
  const titleEl = fragment.querySelector('.modal-title');
  const bodyEl = fragment.querySelector('.modal-body');
  const closeButton = fragment.querySelector('[data-modal-close]');

  titleEl.textContent = t(`${type}Title`);
  bodyEl.innerHTML = modalContent;

  const closeModal = () => {
    backdrop.remove();
    document.removeEventListener('keydown', escListener);
  };

  function escListener(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  closeButton.addEventListener('click', closeModal);
  backdrop.addEventListener('click', event => {
    if (event.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', escListener);
  elements.modalRoot.appendChild(fragment);
}

function getModalContent(type) {
  switch (type) {
    case 'terms':
      return `
        <div class="prose max-w-none">
          <h1>Terms of Use</h1>
          <p><strong>Effective Date:</strong> January 31, 2025<br/><strong>Last Updated:</strong> January 31, 2025</p>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the QR Code Generator service provided by Zentopia Labs ("we", "us", or "our"), you accept and agree to be bound by the terms and provisions of this agreement.</p>
          <h2>2. Description of Service</h2>
          <p>Our QR Code Generator is a free, web-based tool that allows users to create QR codes for various purposes including URLs, text, contact information, and WiFi credentials. The service operates entirely in your browser with no data storage on our servers.</p>
          <h2>3. User Responsibilities</h2>
          <h3>3.1 Appropriate Use</h3>
          <ul>
            <li>You agree to use the service only for lawful purposes</li>
            <li>You will not generate QR codes containing illegal, harmful, or offensive content</li>
            <li>You are responsible for ensuring you have the right to use any logos or images uploaded to the service</li>
          </ul>
          <h3>3.2 Content Accuracy</h3>
          <ul>
            <li>You are solely responsible for the accuracy and appropriateness of the content encoded in your QR codes</li>
            <li>We do not verify or validate the content of generated QR codes</li>
          </ul>
          <h2>4. Privacy and Data</h2>
          <ul>
            <li><strong>No Data Storage:</strong> We do not store, collect, or transmit any of your personal data or QR code content</li>
            <li>All QR code generation happens locally in your browser</li>
            <li>No cookies are used for tracking purposes</li>
          </ul>
          <h2>5. Disclaimer of Warranties</h2>
          <p>The service is provided on an "as is" and "as available" basis. We make no warranties regarding the service's availability, reliability, or functionality.</p>
          <h2>6. Contact Information</h2>
          <p>For questions about these Terms of Use, please contact us at: labs[at]zentopia[dot]io</p>
        </div>`;
    case 'privacy':
      return `
        <div class="prose max-w-none">
          <h1>Privacy Policy</h1>
          <p><strong>Last Updated:</strong> January 31, 2025</p>
          <h2>Our Commitment to Privacy</h2>
          <p>At Zentopia Labs, we are committed to protecting your privacy. This Privacy Policy explains how our QR Code Generator service handles (or more accurately, doesn't handle) your personal information.</p>
          <h2>The Simple Truth: We Don't Store Your Data</h2>
          <p><strong>No Data Stored • No Data Collected • No Data Transmitted</strong></p>
          <p>Our QR Code Generator operates with a fundamental privacy-by-design principle: we don't store any of your data, anywhere, ever.</p>
          <h2>How Our Service Works</h2>
          <h3>1. Local Processing Only</h3>
          <ul>
            <li>All QR code generation happens directly in your web browser</li>
            <li>Your text, URLs, contact information, and WiFi credentials never leave your device</li>
            <li>The processing is done using JavaScript code that runs locally on your computer</li>
          </ul>
          <h3>2. No Server Communication</h3>
          <ul>
            <li>Once the webpage loads, no further communication with our servers occurs</li>
            <li>Your QR code content is never transmitted to us</li>
            <li>We cannot see what QR codes you generate</li>
          </ul>
          <h2>What We Don't Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> No names, email addresses, or contact details</li>
            <li><strong>QR Code Content:</strong> No URLs, text, contact info, or WiFi passwords</li>
            <li><strong>Usage Data:</strong> No analytics on what types of QR codes you create</li>
            <li><strong>Device Information:</strong> No device fingerprinting or hardware identification</li>
            <li><strong>Location Data:</strong> No geographic or IP-based location tracking</li>
          </ul>
          <h2>Your Uploaded Images (Logos)</h2>
          <p>When you upload a logo for your QR code:</p>
          <ul>
            <li>The image is processed entirely in your browser</li>
            <li>The image is never uploaded to our servers</li>
            <li>It exists only in your browser's temporary memory</li>
            <li>It's automatically deleted when you refresh or close the page</li>
          </ul>
          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy: labs[at]zentopia[dot]io</p>
        </div>`;
    case 'contact':
      return `
        <div class="prose max-w-none">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you! Whether you have questions, feedback, or need support, we're here to help.</p>
          <h2>Get in Touch</h2>
          <h3>Email Support</h3>
          <p><strong>Primary Contact:</strong> labs[at]zentopia[dot]io</p>
          <p><em>Please replace [at] with @ and [dot] with . when sending your email</em></p>
          <h3>Website</h3>
          <p>Visit our main website: <strong>zentopia.io</strong></p>
          <h2>What We Can Help With</h2>
          <h3>🛠️ Technical Support</h3>
          <ul>
            <li>Issues with QR code generation</li>
            <li>Browser compatibility problems</li>
            <li>Feature requests and suggestions</li>
            <li>Bug reports</li>
          </ul>
          <h3>💼 Business Inquiries</h3>
          <ul>
            <li>Partnership opportunities</li>
            <li>Custom development requests</li>
            <li>Licensing questions</li>
            <li>Commercial use clarifications</li>
          </ul>
          <h2>Response Times</h2>
          <p>We aim to respond to all inquiries within:</p>
          <ul>
            <li><strong>Urgent technical issues:</strong> 24 hours</li>
            <li><strong>General inquiries:</strong> 48 hours</li>
            <li><strong>Business inquiries:</strong> 72 hours</li>
          </ul>
          <h2>Frequently Asked Questions</h2>
          <h3>Is the service really free?</h3>
          <p>Yes! Our QR Code Generator is completely free to use with no hidden costs, subscriptions, or premium tiers.</p>
          <h3>Do you store my data?</h3>
          <p>No. All QR code generation happens in your browser. We never see or store your data.</p>
          <h3>Can I use this for commercial purposes?</h3>
          <p>Yes, you can use the generated QR codes for both personal and commercial purposes.</p>
        </div>`;
    default:
      return null;
  }
}

function initializeEvents() {
  elements.tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.activeTab = button.getAttribute('data-tab');
      updateTabButtons();
      updateFormTitle();
      updateFormVisibility();
      updateStateAndRender();
    });
  });

  elements.urlInput.addEventListener('input', event => {
    state.url = event.target.value;
    updateStateAndRender();
  });

  elements.textInput.addEventListener('input', event => {
    state.text = event.target.value;
    updateStateAndRender();
  });

  elements.contactFirst.addEventListener('input', event => {
    state.contact.firstName = event.target.value;
    updateStateAndRender();
  });
  elements.contactLast.addEventListener('input', event => {
    state.contact.lastName = event.target.value;
    updateStateAndRender();
  });
  elements.contactPhone.addEventListener('input', event => {
    state.contact.phone = event.target.value;
    updateStateAndRender();
  });
  elements.contactEmail.addEventListener('input', event => {
    state.contact.email = event.target.value;
    updateStateAndRender();
  });
  elements.contactOrganization.addEventListener('input', event => {
    state.contact.organization = event.target.value;
    updateStateAndRender();
  });
  elements.contactUrl.addEventListener('input', event => {
    state.contact.url = event.target.value;
    updateStateAndRender();
  });

  elements.wifiSsid.addEventListener('input', event => {
    state.wifi.ssid = event.target.value;
    updateStateAndRender();
  });
  elements.wifiPassword.addEventListener('input', event => {
    state.wifi.password = event.target.value;
    updateStateAndRender();
  });
  elements.wifiSecurity.addEventListener('change', event => {
    state.wifi.security = event.target.value;
    updateStateAndRender();
  });
  elements.wifiHidden.addEventListener('change', event => {
    state.wifi.hidden = event.target.checked;
    updateStateAndRender();
  });

  elements.resetButton.addEventListener('click', event => {
    event.preventDefault();
    resetState();
  });

  elements.colorCode.addEventListener('change', event => {
    state.customization.codeColor = event.target.value;
    updateStateAndRender();
  });
  elements.colorBackground.addEventListener('change', event => {
    state.customization.backgroundColor = event.target.value;
    updateStateAndRender();
  });
  elements.colorCorner.addEventListener('change', event => {
    state.customization.cornerSquareColor = event.target.value;
    updateStateAndRender();
  });
  elements.colorBorder.addEventListener('change', event => {
    state.customization.borderColor = event.target.value;
    updateStateAndRender();
  });
  elements.cornerStyle.addEventListener('change', event => {
    state.customization.cornerStyle = event.target.value;
    updateStateAndRender();
  });
  elements.moduleStyle.addEventListener('change', event => {
    state.customization.moduleStyle = event.target.value;
    updateStateAndRender();
  });
  elements.logoSize.addEventListener('change', event => {
    state.customization.logoSize = event.target.value;
    updateStateAndRender();
  });

  elements.captionToggle.addEventListener('change', event => {
    state.customization.showCaption = event.target.checked;
    elements.captionSettings.classList.toggle('hidden', !event.target.checked);
    updateStateAndRender();
  });
  elements.captionText.addEventListener('input', event => {
    state.customization.caption = event.target.value;
    updateStateAndRender();
  });
  elements.captionSize.addEventListener('change', event => {
    state.customization.captionSize = event.target.value;
    updateStateAndRender();
  });
  elements.captionBold.addEventListener('change', event => {
    state.customization.captionBold = event.target.checked;
    updateStateAndRender();
  });

  elements.logoInput.addEventListener('change', handleLogoUpload);
  elements.removeLogo.addEventListener('click', event => {
    event.preventDefault();
    removeLogo();
  });

  elements.copyButton.addEventListener('click', event => {
    event.preventDefault();
    copyToClipboard();
  });
  elements.downloadPng.addEventListener('click', event => {
    event.preventDefault();
    downloadPNG();
  });
  elements.downloadSvg.addEventListener('click', event => {
    event.preventDefault();
    downloadSVG();
  });

  document.querySelectorAll('.footer-link').forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.getAttribute('data-modal');
      openModal(modal);
    });
  });
}

function boot() {
  applyTranslations();
  updateTabButtons();
  updateFormVisibility();
  updateFormTitle();
  initializeEvents();
}

boot();
