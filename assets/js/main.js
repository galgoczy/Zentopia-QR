import { detectLocale, createTranslator, applyTranslations } from './i18n.js';
import { renderPreview, buildEmptyState } from './render.js';
import { downloadPng, downloadSvg } from './download.js';

const DEFAULT_CUSTOMIZATION = {
  codeColor: '#000000',
  backgroundColor: '#ffffff',
  cornerSquareColor: '#000000',
  borderColor: '#000000',
  cornerStyle: 'square',
  moduleStyle: 'square',
  centerLogo: null,
  logoSize: 'small',
  caption: '',
  showCaption: false,
  captionSize: 'normal',
  captionBold: false
};

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
    website: ''
  },
  wifi: {
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false
  },
  customization: { ...DEFAULT_CUSTOMIZATION },
  qrData: '',
  matrix: null
};

const locale = detectLocale(document.documentElement.getAttribute('data-app-locale'));
const t = createTranslator(locale);
applyTranslations(document, t);
document.documentElement.lang = locale;

const formGroups = Array.from(document.querySelectorAll('.form__group'));
const tabs = Array.from(document.querySelectorAll('.tabs__button'));
const previewContainer = document.getElementById('qr-preview');
const dataOutput = document.getElementById('qr-data');
const copyButton = document.getElementById('copy-data');
const downloadPngButton = document.getElementById('download-png');
const downloadSvgButton = document.getElementById('download-svg');
const clearButton = document.getElementById('clear-button');
const footerYear = document.getElementById('footer-year');
footerYear.textContent = new Date().getFullYear();

const modalRoot = document.getElementById('modal');
const modalTitle = modalRoot.querySelector('.modal__title');
const modalBody = modalRoot.querySelector('.modal__body');

const MODAL_CONTENT = {
  terms: `
    <h1>Terms of Use</h1>
    <p><strong>Effective Date:</strong> January 31, 2025<br><strong>Last Updated:</strong> January 31, 2025</p>
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing and using the QR Code Generator service provided by Zentopia Labs (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you accept and agree to be bound by these terms.</p>
    <h2>2. Description of Service</h2>
    <p>Our QR Code Generator is a free, browser-based tool that lets you create QR codes for URLs, text, contact details, and WiFi access. All generation happens locally on your device.</p>
    <h2>3. User Responsibilities</h2>
    <ul>
      <li>Use the service only for lawful purposes.</li>
      <li>Avoid generating QR codes that contain illegal, harmful, or offensive content.</li>
      <li>Ensure you have the right to use any logos or imagery you upload.</li>
    </ul>
    <h2>4. Privacy and Data</h2>
    <ul>
      <li>No information you enter is stored or transmitted.</li>
      <li>We do not run analytics or tracking scripts.</li>
      <li>Your QR content lives only in your browser.</li>
    </ul>
    <h2>5. Disclaimer</h2>
    <p>The service is provided &ldquo;as is&rdquo; without warranties. We do not guarantee availability or fitness for a particular purpose.</p>
    <h2>6. Contact</h2>
    <p>Questions? Reach out at labs[at]zentopia[dot]io.</p>
  `,
  privacy: `
    <h1>Privacy Policy</h1>
    <p><strong>Last Updated:</strong> January 31, 2025</p>
    <p>We believe privacy should be the default. The QR Code Studio does not store, transmit, or analyze any of the data you provide.</p>
    <h2>How the service works</h2>
    <ul>
      <li>All QR rendering happens directly in your browser.</li>
      <li>No QR content or uploaded logos leave your device.</li>
      <li>We do not set cookies or track usage.</li>
    </ul>
    <h2>Uploaded logos</h2>
    <p>Logos are processed in-memory in your browser and are discarded when you refresh or close the page.</p>
    <h2>Contact</h2>
    <p>Email us at labs[at]zentopia[dot]io with any questions.</p>
  `,
  contact: `
    <h1>Contact Zentopia Labs</h1>
    <p>We love hearing from builders and curious minds. Drop us a note and we&rsquo;ll get back to you.</p>
    <h2>Email</h2>
    <p><strong>labs[at]zentopia[dot]io</strong></p>
    <h2>What we can help with</h2>
    <ul>
      <li>Bug reports or performance issues</li>
      <li>Feature ideas and integrations</li>
      <li>Commercial or partnership inquiries</li>
    </ul>
    <h2>Response times</h2>
    <ul>
      <li><strong>Urgent support:</strong> within 24 hours</li>
      <li><strong>General questions:</strong> within 48 hours</li>
      <li><strong>Business inquiries:</strong> within 72 hours</li>
    </ul>
  `
};

let renderTimeout = null;
let renderToken = 0;

function requestRender() {
  if (renderTimeout) {
    clearTimeout(renderTimeout);
  }
  renderTimeout = setTimeout(() => {
    renderTimeout = null;
    updatePreview();
  }, 160);
}

function setActiveTab(tab) {
  state.activeTab = tab;
  tabs.forEach((button) => {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle('tabs__button--active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });
  formGroups.forEach((group) => {
    group.classList.toggle('form__group--hidden', group.dataset.view !== tab);
  });
  requestRender();
}

function formatUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function buildVCard(contact) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0'
  ];
  const fullName = `${contact.firstName} ${contact.lastName}`.trim();
  if (fullName) {
    lines.push(`FN:${fullName}`);
    lines.push(`N:${contact.lastName};${contact.firstName};;;`);
  }
  if (contact.organization) lines.push(`ORG:${contact.organization}`);
  if (contact.phone) lines.push(`TEL:${contact.phone}`);
  if (contact.email) lines.push(`EMAIL:${contact.email}`);
  if (contact.website) lines.push(`URL:${formatUrl(contact.website)}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

function buildWifiString(wifi) {
  if (!wifi.ssid.trim()) return '';
  const type = wifi.security === 'nopass' ? 'nopass' : wifi.security;
  const password = wifi.security === 'nopass' ? '' : wifi.password;
  return `WIFI:T:${type};S:${escapeWifiField(wifi.ssid)};P:${escapeWifiField(password)};H:${wifi.hidden ? 'true' : 'false'};`;
}

function escapeWifiField(value) {
  return String(value ?? '').replace(/([\\;,":])/g, '\\$1');
}

function computeQrData() {
  switch (state.activeTab) {
    case 'url':
      return formatUrl(state.url);
    case 'text':
      return state.text;
    case 'contact':
      return buildVCard(state.contact);
    case 'wifi':
      return buildWifiString(state.wifi);
    default:
      return '';
  }
}

async function updatePreview() {
  const data = computeQrData();
  state.qrData = data;
  dataOutput.textContent = data || '';
  copyButton.disabled = !data;
  downloadPngButton.disabled = !data;
  downloadSvgButton.disabled = !data;

  const token = ++renderToken;

  if (!data) {
    state.matrix = null;
    previewContainer.innerHTML = '';
    const empty = buildEmptyState({ fillFormText: t('fillFormPrompt') });
    previewContainer.append(empty);
    return;
  }

  try {
    const customization = { ...state.customization, fillFormText: t('fillFormPrompt') };
    const result = await renderPreview(data, customization);
    if (token !== renderToken) return;
    previewContainer.innerHTML = '';
    previewContainer.append(result.wrapper);
    state.matrix = result.matrix;
  } catch (error) {
    console.error('Failed to render QR preview', error);
  }
}

function resetState() {
  state.url = '';
  state.text = '';
  state.contact = { firstName: '', lastName: '', phone: '', email: '', organization: '', website: '' };
  state.wifi = { ssid: '', password: '', security: 'WPA', hidden: false };
  state.customization = { ...DEFAULT_CUSTOMIZATION };
  document.querySelector('form').reset();
  toggleLogoControls(false);
  requestRender();
}

function toggleLogoControls(enabled) {
  document.getElementById('logo-size').disabled = !enabled;
  document.getElementById('remove-logo').disabled = !enabled;
}

document.getElementById('url-input').addEventListener('input', (e) => {
  state.url = e.target.value;
  requestRender();
});

document.getElementById('text-input').addEventListener('input', (e) => {
  state.text = e.target.value;
  requestRender();
});

['first-name', 'last-name', 'phone', 'email', 'organization', 'contact-url'].forEach((id) => {
  document.getElementById(id).addEventListener('input', (e) => {
    const key = ({
      'first-name': 'firstName',
      'last-name': 'lastName',
      phone: 'phone',
      email: 'email',
      organization: 'organization',
      'contact-url': 'website'
    })[id];
    state.contact[key] = e.target.value;
    requestRender();
  });
});

document.getElementById('ssid').addEventListener('input', (e) => {
  state.wifi.ssid = e.target.value;
  requestRender();
});

document.getElementById('wifi-password').addEventListener('input', (e) => {
  state.wifi.password = e.target.value;
  requestRender();
});

document.getElementById('wifi-security').addEventListener('change', (e) => {
  state.wifi.security = e.target.value;
  requestRender();
});

document.getElementById('wifi-hidden').addEventListener('change', (e) => {
  state.wifi.hidden = e.target.checked;
  requestRender();
});

['code-color', 'background-color', 'corner-color', 'border-color'].forEach((id) => {
  document.getElementById(id).addEventListener('input', (e) => {
    const key = ({
      'code-color': 'codeColor',
      'background-color': 'backgroundColor',
      'corner-color': 'cornerSquareColor',
      'border-color': 'borderColor'
    })[id];
    state.customization[key] = e.target.value;
    requestRender();
  });
});

document.getElementById('corner-style').addEventListener('change', (e) => {
  state.customization.cornerStyle = e.target.value;
  requestRender();
});

document.getElementById('module-style').addEventListener('change', (e) => {
  state.customization.moduleStyle = e.target.value;
  requestRender();
});

document.getElementById('logo-size').addEventListener('change', (e) => {
  state.customization.logoSize = e.target.value;
  requestRender();
});

document.getElementById('caption-text').addEventListener('input', (e) => {
  state.customization.caption = e.target.value;
  requestRender();
});

document.getElementById('show-caption').addEventListener('change', (e) => {
  state.customization.showCaption = e.target.checked;
  requestRender();
});

document.getElementById('caption-size').addEventListener('change', (e) => {
  state.customization.captionSize = e.target.value;
  requestRender();
});

document.getElementById('caption-bold').addEventListener('change', (e) => {
  state.customization.captionBold = e.target.checked;
  requestRender();
});

document.getElementById('logo-upload').addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) {
    state.customization.centerLogo = null;
    toggleLogoControls(false);
    return requestRender();
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    state.customization.centerLogo = e.target.result;
    toggleLogoControls(true);
    requestRender();
  };
  reader.readAsDataURL(file);
});

document.getElementById('remove-logo').addEventListener('click', () => {
  state.customization.centerLogo = null;
  document.getElementById('logo-upload').value = '';
  toggleLogoControls(false);
  requestRender();
});

clearButton.addEventListener('click', resetState);

copyButton.addEventListener('click', async () => {
  if (!state.qrData) return;
  try {
    await navigator.clipboard.writeText(state.qrData);
    copyButton.classList.add('button--copied');
    copyButton.lastElementChild.textContent = t('copied');
    setTimeout(() => {
      copyButton.classList.remove('button--copied');
      copyButton.lastElementChild.textContent = t('copyData');
    }, 1800);
  } catch (error) {
    console.error('Copy failed', error);
  }
});

downloadPngButton.addEventListener('click', async () => {
  if (!state.matrix) return;
  await downloadPng(state.matrix, state.customization, state.activeTab);
});

downloadSvgButton.addEventListener('click', () => {
  if (!state.matrix) return;
  downloadSvg(state.matrix, state.customization, state.activeTab);
});

tabs.forEach((button) => {
  button.addEventListener('click', () => setActiveTab(button.dataset.tab));
});

Array.from(document.querySelectorAll('[data-modal]')).forEach((trigger) => {
  trigger.addEventListener('click', () => openModal(trigger.dataset.modal));
});

Array.from(modalRoot.querySelectorAll('[data-dismiss="modal"]')).forEach((dismiss) => {
  dismiss.addEventListener('click', closeModal);
});

modalRoot.addEventListener('click', (event) => {
  if (event.target === modalRoot.querySelector('.modal__backdrop')) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalRoot.getAttribute('aria-hidden') === 'false') {
    closeModal();
  }
});

function openModal(key) {
  const content = MODAL_CONTENT[key];
  if (!content) return;
  modalTitle.textContent = t(`${key}Title`) || key;
  modalBody.innerHTML = content;
  modalRoot.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalRoot.setAttribute('aria-hidden', 'true');
  modalBody.innerHTML = '';
  document.body.style.overflow = '';
}

setActiveTab(state.activeTab);
requestRender();
