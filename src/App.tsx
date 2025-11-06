import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  QrCode,
  Link as LinkIcon,
  MessageSquare,
  User,
  Download,
  Copy,
  Check,
  Wifi,
  X
} from 'lucide-react';

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
    wifiOpen: 'Open',
    wifiWpa: 'WPA/WPA2',
    wifiWep: 'WEP',
    wifiInformation: 'WiFi Information',
    networkNamePlaceholder: 'My WiFi Network',
    passwordPlaceholder: 'Enter WiFi password',
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
    captionBold: 'Bold Text'
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
    wifiOpen: 'Abierta',
    wifiWpa: 'WPA/WPA2',
    wifiWep: 'WEP',
    wifiInformation: 'Información WiFi',
    networkNamePlaceholder: 'Mi Red WiFi',
    passwordPlaceholder: 'Ingresa contraseña WiFi',
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
    captionBold: 'Texto en Negrita'
  }
} as const;

type TranslationKey = keyof (typeof TRANSLATIONS)['en-US'];

type TabId = 'url' | 'text' | 'contact' | 'wifi';
type ModuleStyle = 'square' | 'round';
type CornerStyle = 'square' | 'rounded';
type LogoSize = 'small' | 'large';
type CaptionSize = 'small' | 'large' | 'extraLarge';
type ActiveModal = 'terms' | 'privacy' | 'contact' | null;

type ContactInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
  url: string;
};

type WifiInfo = {
  ssid: string;
  password: string;
  security: 'Open' | 'WPA' | 'WEP';
  hidden: boolean;
};

type CustomizationState = {
  codeColor: string;
  backgroundColor: string;
  cornerStyle: CornerStyle;
  borderColor: string;
  caption: string;
  showCaption: boolean;
  cornerSquareColor: string;
  moduleStyle: ModuleStyle;
  centerLogo: string | null;
  logoSize: LogoSize;
  captionSize: CaptionSize;
  captionBold: boolean;
};

declare global {
  interface Window {
    QRious?: any;
  }
}

const APP_LOCALE = import.meta.env.VITE_APP_LOCALE ?? '';

const findMatchingLocale = (locale: string): keyof typeof TRANSLATIONS => {
  if (locale in TRANSLATIONS) {
    return locale as keyof typeof TRANSLATIONS;
  }

  const [language] = locale.split('-');
  const match = (Object.keys(TRANSLATIONS) as Array<keyof typeof TRANSLATIONS>).find((key) =>
    key.startsWith(`${language}-`)
  );

  return match ?? 'en-US';
};

const getLocale = (): keyof typeof TRANSLATIONS => {
  if (typeof navigator === 'undefined') {
    return 'en-US';
  }

  const browserLocale = navigator.languages?.[0] ?? navigator.language ?? 'en-US';
  return APP_LOCALE ? findMatchingLocale(APP_LOCALE) : findMatchingLocale(browserLocale);
};

const useTranslations = () => {
  const locale = useMemo(getLocale, []);
  return React.useCallback(
    (key: TranslationKey): string => TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS['en-US'][key] ?? key,
    [locale]
  );
};

const defaultContactInfo: ContactInfo = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  organization: '',
  url: ''
};

const defaultWifiInfo: WifiInfo = {
  ssid: '',
  password: '',
  security: 'WPA',
  hidden: false
};

const defaultCustomization: CustomizationState = {
  codeColor: '#000000',
  backgroundColor: '#ffffff',
  cornerStyle: 'square',
  borderColor: '#000000',
  caption: '',
  showCaption: false,
  cornerSquareColor: '#000000',
  moduleStyle: 'square',
  centerLogo: null,
  logoSize: 'small',
  captionSize: 'small',
  captionBold: false
};

const QRCodeGenerator: React.FC = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<TabId>('url');
  const [qrData, setQrData] = useState('');
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [wifiInfo, setWifiInfo] = useState<WifiInfo>(defaultWifiInfo);
  const [customization, setCustomization] = useState<CustomizationState>(defaultCustomization);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [activeModal]);

  const generateFallbackQR = (text: string) => {
    if (!qrContainerRef.current) return;

    qrContainerRef.current.innerHTML = '';

    const container = document.createElement('div');
    container.className = `inline-block bg-white shadow-lg ${
      customization.cornerStyle === 'rounded' ? 'rounded-2xl' : 'rounded-none'
    }`;
    container.style.border = `6px solid ${customization.borderColor}`;
    container.style.padding = '12px';

    const img = document.createElement('img');
    const encodedData = encodeURIComponent(text);
    const bgColor = customization.backgroundColor.replace('#', '');
    const fgColor = customization.codeColor.replace('#', '');
    img.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodedData}&choe=UTF-8&chco=${fgColor}&chf=bg,s,${bgColor}`;
    img.alt = t('qrCodeAlt');
    img.className = `w-full h-auto ${
      customization.cornerStyle === 'rounded' ? 'rounded-lg' : 'rounded-none'
    }`;
    img.style.maxWidth = '300px';
    img.style.height = 'auto';
    img.style.display = 'block';

    img.onerror = () => {
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&margin=10&color=${
        customization.codeColor.replace('#', '')
      }&bgcolor=${customization.backgroundColor.replace('#', '')}`;
    };

    container.appendChild(img);
    qrContainerRef.current.appendChild(container);

    if (customization.showCaption && customization.caption) {
      const captionDiv = document.createElement('div');
      captionDiv.textContent = customization.caption;

      let fontSizeClass: string;
      if (customization.captionSize === 'small') {
        fontSizeClass = 'text-lg';
      } else if (customization.captionSize === 'large') {
        fontSizeClass = 'text-xl';
      } else {
        fontSizeClass = 'text-4xl';
      }

      const fontWeight = customization.captionBold ? 'font-bold' : 'font-medium';
      captionDiv.className = `text-center ${fontSizeClass} ${fontWeight} text-gray-700 mt-4 px-2`;
      qrContainerRef.current.appendChild(captionDiv);
    }
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: string
  ) => {
    ctx.fillStyle = fillColor;
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
  };

  const drawRoundedRectPath = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
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
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  const applyCenterLogo = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!customization.centerLogo) return;

    const logoImg = new Image();
    logoImg.onload = () => {
      const logoPixelSize = customization.logoSize === 'small' ? 55 : 79;
      const x = (canvas.width - logoPixelSize) / 2;
      const y = (canvas.height - logoPixelSize) / 2;

      const padding = 3;
      ctx.fillStyle = customization.backgroundColor;
      ctx.fillRect(
        Math.floor(x - padding),
        Math.floor(y - padding),
        Math.ceil(logoPixelSize + padding * 2),
        Math.ceil(logoPixelSize + padding * 2)
      );

      ctx.drawImage(
        logoImg,
        Math.floor(x),
        Math.floor(y),
        Math.ceil(logoPixelSize),
        Math.ceil(logoPixelSize)
      );
    };
    logoImg.src = customization.centerLogo;
  };

  const applyCornerSquareCustomization = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    if (customization.cornerSquareColor === customization.codeColor) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const originalColor = hexToRgb(customization.codeColor);
    const newColor = hexToRgb(customization.cornerSquareColor);

    if (!originalColor || !newColor) return;

    const moduleSize = Math.floor(canvas.width / 25);
    const cornerSize = moduleSize * 7;
    const tolerance = 30;

    const cornerAreas = [
      { x: 0, y: 0, width: cornerSize, height: cornerSize },
      { x: canvas.width - cornerSize, y: 0, width: cornerSize, height: cornerSize },
      { x: 0, y: canvas.height - cornerSize, width: cornerSize, height: cornerSize }
    ];

    const colorsMatch = (
      r1: number,
      g1: number,
      b1: number,
      r2: number,
      g2: number,
      b2: number,
      toleranceValue: number
    ) =>
      Math.abs(r1 - r2) <= toleranceValue &&
      Math.abs(g1 - g2) <= toleranceValue &&
      Math.abs(b1 - b2) <= toleranceValue;

    cornerAreas.forEach((corner) => {
      for (let y = corner.y; y < corner.y + corner.height && y < canvas.height; y += 1) {
        for (let x = corner.x; x < corner.x + corner.width && x < canvas.width; x += 1) {
          const pixelIndex = (y * canvas.width + x) * 4;
          const r = data[pixelIndex];
          const g = data[pixelIndex + 1];
          const b = data[pixelIndex + 2];

          if (colorsMatch(r, g, b, originalColor.r, originalColor.g, originalColor.b, tolerance)) {
            data[pixelIndex] = newColor.r;
            data[pixelIndex + 1] = newColor.g;
            data[pixelIndex + 2] = newColor.b;
          }
        }
      }
    });

    ctx.putImageData(imageData, 0, 0);
  };

  const applyRoundModules = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const moduleSize = Math.floor(canvas.width / 25);

    const cornerSize = moduleSize * 7;
    const cornerAreas = [
      { x: 0, y: 0, width: cornerSize, height: cornerSize },
      { x: canvas.width - cornerSize, y: 0, width: cornerSize, height: cornerSize },
      { x: 0, y: canvas.height - cornerSize, width: cornerSize, height: cornerSize }
    ];

    const isInCornerArea = (x: number, y: number) =>
      cornerAreas.some(
        (corner) =>
          x >= corner.x &&
          x < corner.x + corner.width &&
          y >= corner.y &&
          y < corner.y + corner.height
      );

    ctx.fillStyle = customization.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cornerColor =
      customization.cornerSquareColor !== customization.codeColor
        ? customization.cornerSquareColor
        : customization.codeColor;

    ctx.fillStyle = cornerColor;
    cornerAreas.forEach((corner) => {
      for (let y = corner.y; y < corner.y + corner.height; y += moduleSize) {
        for (let x = corner.x; x < corner.x + corner.width; x += moduleSize) {
          const centerX = Math.min(x + Math.floor(moduleSize / 2), canvas.width - 1);
          const centerY = Math.min(y + Math.floor(moduleSize / 2), canvas.height - 1);
          const pixelIndex = (centerY * canvas.width + centerX) * 4;
          const r = data[pixelIndex];
          const g = data[pixelIndex + 1];
          const b = data[pixelIndex + 2];

          if (r < 128 && g < 128 && b < 128) {
            ctx.fillRect(x, y, moduleSize, moduleSize);
          }
        }
      }
    });

    ctx.fillStyle = customization.codeColor;
    for (let y = 0; y < canvas.height; y += moduleSize) {
      for (let x = 0; x < canvas.width; x += moduleSize) {
        if (isInCornerArea(x, y)) continue;

        const centerX = Math.min(x + Math.floor(moduleSize / 2), canvas.width - 1);
        const centerY = Math.min(y + Math.floor(moduleSize / 2), canvas.height - 1);
        const pixelIndex = (centerY * canvas.width + centerX) * 4;
        const r = data[pixelIndex];
        const g = data[pixelIndex + 1];
        const b = data[pixelIndex + 2];

        if (r < 128 && g < 128 && b < 128) {
          ctx.beginPath();
          ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  };

  const applyAdvancedCustomizations = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      if (customization.moduleStyle === 'round') {
        applyRoundModules(ctx, canvas);
      }

      if (customization.cornerSquareColor !== customization.codeColor) {
        applyCornerSquareCustomization(ctx, canvas);
      }

      if (customization.centerLogo) {
        applyCenterLogo(ctx, canvas);
      }
    } catch (error) {
      console.error('Advanced customization failed:', error);
    }
  };

  const createQR = (text: string) => {
    if (!qrContainerRef.current || !text.trim()) return;

    qrContainerRef.current.innerHTML = '';

    const container = document.createElement('div');
    container.className = `inline-block bg-white shadow-lg ${
      customization.cornerStyle === 'rounded' ? 'rounded-2xl' : 'rounded-none'
    }`;
    container.style.border = `6px solid ${customization.borderColor}`;
    container.style.padding = '12px';

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    try {
      const qr = new window.QRious({
        element: canvas,
        value: text,
        size: 300,
        background: customization.backgroundColor,
        foreground: customization.codeColor,
        level: 'M'
      });

      void qr;
    } catch (error) {
      console.error('Error creating QR code:', error);
      generateFallbackQR(text);
      return;
    }

    canvas.className = `w-full h-auto ${
      customization.cornerStyle === 'rounded' ? 'rounded-lg' : 'rounded-none'
    }`;
    canvas.style.maxWidth = '300px';
    canvas.style.height = 'auto';
    canvas.style.display = 'block';

    if (customization.cornerStyle === 'rounded') {
      canvas.style.borderRadius = '8px';
    }

    qrContainerRef.current.appendChild(container);

    window.setTimeout(() => {
      if (canvas) {
        applyAdvancedCustomizations(canvas);
      }
    }, 100);

    if (customization.showCaption && customization.caption) {
      const captionDiv = document.createElement('div');
      captionDiv.textContent = customization.caption;

      let fontSizeClass: string;
      if (customization.captionSize === 'small') {
        fontSizeClass = 'text-lg';
      } else if (customization.captionSize === 'large') {
        fontSizeClass = 'text-xl';
      } else {
        fontSizeClass = 'text-4xl';
      }

      const fontWeight = customization.captionBold ? 'font-bold' : 'font-medium';
      captionDiv.className = `text-center ${fontSizeClass} ${fontWeight} text-gray-700 mt-4 px-2`;
      qrContainerRef.current.appendChild(captionDiv);
    }
  };

  const generateQRCode = async (text: string) => {
    if (typeof window === 'undefined' || !qrContainerRef.current) return;

    if (!text.trim()) {
      qrContainerRef.current.innerHTML = '';
      return;
    }

    try {
      if (!window.QRious) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load QRious library'));
          document.head.appendChild(script);
        });
      }

      createQR(text);
    } catch (error) {
      console.error('Error loading QR library:', error);
      generateFallbackQR(text);
    }
  };

  const formatUrl = (url: string) => {
    if (!url.trim()) return '';
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const generateVCard = (contact: ContactInfo) => `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organization}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.url}
END:VCARD`;

  const generateWifiConfig = (wifi: WifiInfo) => {
    const security = wifi.security === 'Open' ? 'nopass' : wifi.security;
    const hidden = wifi.hidden ? 'true' : 'false';
    return `WIFI:T:${security};S:${wifi.ssid};P:${wifi.password};H:${hidden};`;
  };

  useEffect(() => {
    let data = '';

    switch (activeTab) {
      case 'url':
        data = formatUrl(urlInput);
        break;
      case 'text':
        data = textInput;
        break;
      case 'contact':
        if (contactInfo.firstName || contactInfo.lastName || contactInfo.phone || contactInfo.email) {
          data = generateVCard(contactInfo);
        }
        break;
      case 'wifi':
        if (wifiInfo.ssid) {
          data = generateWifiConfig(wifiInfo);
        }
        break;
      default:
        data = '';
    }

    setQrData(data);
    void generateQRCode(data);
  }, [activeTab, contactInfo, textInput, urlInput, wifiInfo, customization]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setCustomization((prev) => ({ ...prev, centerLogo: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setCustomization((prev) => ({ ...prev, centerLogo: null }));
  };

  const copyToClipboard = async () => {
    if (!qrData) return;

    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const resetForm = () => {
    setUrlInput('');
    setTextInput('');
    setContactInfo(defaultContactInfo);
    setWifiInfo(defaultWifiInfo);
    setCustomization(defaultCustomization);
    setActiveModal(null);
    setQrData('');
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
    }
  };

  const downloadQRCode = (format: 'png' | 'svg') => {
    if (!qrData) {
      console.warn('No QR data available');
      return;
    }

    if (format === 'svg') {
      downloadSVG();
      return;
    }

    const canvas = qrContainerRef.current?.querySelector('canvas');
    const img = qrContainerRef.current?.querySelector('img');

    if (canvas) {
      try {
        const downloadCanvas = document.createElement('canvas');
        const downloadCtx = downloadCanvas.getContext('2d');
        if (!downloadCtx) throw new Error('Failed to get download canvas context');

        const scaleFactor = 3;
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

        const scaledCanvasWidth = canvas.width * scaleFactor;
        const scaledCanvasHeight = canvas.height * scaleFactor;
        const totalWidth = scaledCanvasWidth + (borderWidth + padding + extraMargin) * 2;
        const totalHeight =
          scaledCanvasHeight + (borderWidth + padding + extraMargin) * 2 + captionHeight;

        downloadCanvas.width = totalWidth;
        downloadCanvas.height = totalHeight;
        downloadCtx.imageSmoothingEnabled = false;
        downloadCtx.fillStyle = '#ffffff';
        downloadCtx.fillRect(0, 0, totalWidth, totalHeight);

        const borderX = extraMargin;
        const borderY = extraMargin;
        const borderW = totalWidth - extraMargin * 2;
        const borderH = totalHeight - extraMargin * 2 - captionHeight;

        if (customization.cornerStyle === 'rounded') {
          drawRoundedRect(
            downloadCtx,
            borderX,
            borderY,
            borderW,
            borderH,
            16 * scaleFactor,
            customization.borderColor
          );
          drawRoundedRect(
            downloadCtx,
            borderX + borderWidth,
            borderY + borderWidth,
            borderW - borderWidth * 2,
            borderH - borderWidth * 2,
            8 * scaleFactor,
            '#ffffff'
          );
        } else {
          downloadCtx.fillStyle = customization.borderColor;
          downloadCtx.fillRect(borderX, borderY, borderW, borderH);
          downloadCtx.fillStyle = '#ffffff';
          downloadCtx.fillRect(
            borderX + borderWidth,
            borderY + borderWidth,
            borderW - borderWidth * 2,
            borderH - borderWidth * 2
          );
        }

        const qrX = extraMargin + borderWidth + padding;
        const qrY = extraMargin + borderWidth + padding;

        if (customization.cornerStyle === 'rounded') {
          downloadCtx.save();
          drawRoundedRectPath(downloadCtx, qrX, qrY, scaledCanvasWidth, scaledCanvasHeight, 8 * scaleFactor);
          downloadCtx.clip();
          downloadCtx.drawImage(canvas, qrX, qrY, scaledCanvasWidth, scaledCanvasHeight);
          downloadCtx.restore();
        } else {
          downloadCtx.drawImage(canvas, qrX, qrY, scaledCanvasWidth, scaledCanvasHeight);
        }

        if (customization.showCaption && customization.caption) {
          let fontSize: number;
          let captionY: number;
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

          const fontWeight = customization.captionBold ? 'bold' : 'normal';
          downloadCtx.fillStyle = '#374151';
          downloadCtx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, sans-serif`;
          downloadCtx.textAlign = 'center';
          downloadCtx.fillText(customization.caption, totalWidth / 2, captionY);
        }

        const link = document.createElement('a');
        link.download = `qr-code-${activeTab}-${Date.now()}.png`;
        link.href = downloadCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Enhanced PNG download failed:', error);
        alert('PNG download failed. Please try again or use a different browser.');
      }
      return;
    }

    if (img) {
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}-${Date.now()}.png`;
      link.href = img.src;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    alert('No QR code found to download. Please generate a QR code first.');
  };

  const generateSVGQRCode = (text: string) => {
    const size = 300;
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
    const cornerRadius = customization.cornerStyle === 'rounded' ? 16 : 0;
    const innerRadius = customization.cornerStyle === 'rounded' ? 8 : 0;

    const canvas = qrContainerRef.current?.querySelector('canvas');
    const qrDataURL = canvas?.toDataURL('image/png') ?? '';
    const fontWeight = customization.captionBold ? 'bold' : 'normal';

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${totalWidth}" height="${totalHeight}" fill="#ffffff"/>
  <rect x="${extraMargin}" y="${extraMargin}" width="${totalWidth - extraMargin * 2}" height="${
      totalHeight - extraMargin * 2 - captionHeight
    }" fill="${customization.borderColor}" rx="${cornerRadius}" ry="${cornerRadius}"/>
  <rect x="${extraMargin + borderWidth}" y="${extraMargin + borderWidth}" width="${
      totalWidth - (extraMargin + borderWidth) * 2
    }" height="${totalHeight - (extraMargin + borderWidth) * 2 - captionHeight}" fill="#ffffff" rx="${innerRadius}" ry="${innerRadius}"/>
  ${qrDataURL ? `<image x="${extraMargin + borderWidth + padding}" y="${
      extraMargin + borderWidth + padding
    }" width="${size}" height="${size}" href="${qrDataURL}" ${
      customization.cornerStyle === 'rounded' ? `style="clip-path: inset(0 round ${innerRadius}px)"` : ''
    }/>` : ''}
  ${
    customization.showCaption && customization.caption
      ? `<text x="${totalWidth / 2}" y="${totalHeight - captionHeight / 3}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" fill="#374151">${customization.caption}</text>`
      : ''
  }
</svg>`;
  };

  const downloadSVG = () => {
    if (!qrData) return;

    try {
      const svgContent = generateSVGQRCode(qrData);
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}-${Date.now()}.svg`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('SVG download failed:', error);
      alert('SVG download failed. Please try the PNG download instead.');
    }
  };

  const tabs: Array<{ id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'url', label: t('urlTab'), icon: LinkIcon },
    { id: 'text', label: t('textTab'), icon: MessageSquare },
    { id: 'contact', label: t('contactTab'), icon: User },
    { id: 'wifi', label: t('wifiTab'), icon: Wifi }
  ];

  const getModalContent = (type: Exclude<ActiveModal, null>) => {
    switch (type) {
      case 'terms':
        return (
          <div className="prose max-w-none">
            <h1>Terms of Use</h1>
            <p>
              <strong>Effective Date:</strong> January 31, 2025
              <br />
              <strong>Last Updated:</strong> January 31, 2025
            </p>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the QR Code Generator service provided by Zentopia Labs ('we,' 'us,' or 'our'),
              you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
            <h2>2. Description of Service</h2>
            <p>
              Our QR Code Generator is a free, web-based tool that allows users to create QR codes for various purposes
              including URLs, text, contact information, and WiFi credentials. The service operates entirely in your
              browser with no data storage on our servers.
            </p>
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
              <li>
                <strong>No Data Storage:</strong> We do not store, collect, or transmit any of your personal data or QR
                code content
              </li>
              <li>All QR code generation happens locally in your browser</li>
              <li>No cookies are used for tracking purposes</li>
            </ul>
            <h2>5. Disclaimer of Warranties</h2>
            <p>
              The service is provided on an 'as is' and 'as available' basis. We make no warranties regarding the
              service's availability, reliability, or functionality.
            </p>
            <h2>6. Contact Information</h2>
            <p>
              For questions about these Terms of Use, please contact us at: labs[at]zentopia[dot]io
            </p>
          </div>
        );
      case 'privacy':
        return (
          <div className="prose max-w-none">
            <h1>Privacy Policy</h1>
            <p>
              <strong>Last Updated:</strong> January 31, 2025
            </p>
            <h2>Our Commitment to Privacy</h2>
            <p>
              At Zentopia Labs, we are committed to protecting your privacy. This Privacy Policy explains how our QR
              Code Generator service handles (or more accurately, doesn't handle) your personal information.
            </p>
            <h2>The Simple Truth: We Don't Store Your Data</h2>
            <p>
              <strong>No Data Stored • No Data Collected • No Data Transmitted</strong>
            </p>
            <p>
              Our QR Code Generator operates with a fundamental privacy-by-design principle: we don't store any of your
              data, anywhere, ever.
            </p>
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
              <li>
                <strong>Personal Information:</strong> No names, email addresses, or contact details
              </li>
              <li>
                <strong>QR Code Content:</strong> No URLs, text, contact info, or WiFi passwords
              </li>
              <li>
                <strong>Usage Data:</strong> No analytics on what types of QR codes you create
              </li>
              <li>
                <strong>Device Information:</strong> No device fingerprinting or hardware identification
              </li>
              <li>
                <strong>Location Data:</strong> No geographic or IP-based location tracking
              </li>
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
          </div>
        );
      case 'contact':
        return (
          <div className="prose max-w-none">
            <h1>Contact Us</h1>
            <p>
              We'd love to hear from you! Whether you have questions, feedback, or need support, we're here to help.
            </p>
            <h2>Get in Touch</h2>
            <h3>Email Support</h3>
            <p>
              <strong>Primary Contact:</strong> labs[at]zentopia[dot]io
            </p>
            <p>
              <em>Please replace [at] with @ and [dot] with . when sending your email</em>
            </p>
            <h3>Website</h3>
            <p>
              Visit our main website: <strong>zentopia.io</strong>
            </p>
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
              <li>
                <strong>Urgent technical issues:</strong> 24 hours
              </li>
              <li>
                <strong>General inquiries:</strong> 48 hours
              </li>
              <li>
                <strong>Business inquiries:</strong> 72 hours
              </li>
            </ul>
            <h2>Frequently Asked Questions</h2>
            <h3>Is the service really free?</h3>
            <p>Yes! Our QR Code Generator is completely free to use with no hidden costs, subscriptions, or premium tiers.</p>
            <h3>Do you store my data?</h3>
            <p>No. All QR code generation happens in your browser. We never see or store your data.</p>
            <h3>Can I use this for commercial purposes?</h3>
            <p>Yes, you can use the generated QR codes for both personal and commercial purposes.</p>
          </div>
        );
      default:
        return <div>Content not found</div>;
    }
  };

  const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            QR Code Generator - Zentopia Labs
          </h1>
          <p className="text-gray-600 text-lg">{t('appDescription')}</p>
        </div>

        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-8 text-center hidden">
          <div className="text-gray-500 text-sm mb-2">Advertisement</div>
          <div className="bg-white rounded p-4 min-h-[100px] flex items-center justify-center">
            <span className="text-gray-400 text-xs">728x90 AdSense Banner</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {activeTab === 'url' && t('enterUrl')}
                  {activeTab === 'text' && t('enterText')}
                  {activeTab === 'contact' && t('contactInformation')}
                  {activeTab === 'wifi' && t('wifiInformation')}
                </h2>

                {activeTab === 'url' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="urlInput">
                      {t('websiteUrl')}
                    </label>
                    <input
                      id="urlInput"
                      type="url"
                      value={urlInput}
                      onChange={(event) => setUrlInput(event.target.value)}
                      placeholder={t('urlPlaceholder')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('urlHelp')}</p>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="textInput">
                      {t('textContent')}
                    </label>
                    <textarea
                      id="textInput"
                      value={textInput}
                      onChange={(event) => setTextInput(event.target.value)}
                      placeholder={t('textPlaceholder')}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="firstName">
                          {t('firstName')}
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={contactInfo.firstName}
                          onChange={(event) =>
                            setContactInfo((prev) => ({ ...prev, firstName: event.target.value }))
                          }
                          placeholder={t('firstNamePlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lastName">
                          {t('lastName')}
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={contactInfo.lastName}
                          onChange={(event) =>
                            setContactInfo((prev) => ({ ...prev, lastName: event.target.value }))
                          }
                          placeholder={t('lastNamePlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                        {t('phoneNumber')}
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(event) =>
                          setContactInfo((prev) => ({ ...prev, phone: event.target.value }))
                        }
                        placeholder={t('phonePlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                        {t('emailAddress')}
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={(event) =>
                          setContactInfo((prev) => ({ ...prev, email: event.target.value }))
                        }
                        placeholder={t('emailPlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="organization">
                        {t('organization')}
                      </label>
                      <input
                        id="organization"
                        type="text"
                        value={contactInfo.organization}
                        onChange={(event) =>
                          setContactInfo((prev) => ({ ...prev, organization: event.target.value }))
                        }
                        placeholder={t('organizationPlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contactWebsite">
                        {t('website')}
                      </label>
                      <input
                        id="contactWebsite"
                        type="url"
                        value={contactInfo.url}
                        onChange={(event) =>
                          setContactInfo((prev) => ({ ...prev, url: event.target.value }))
                        }
                        placeholder={t('websitePlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'wifi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ssid">
                        {t('wifiNetworkName')}
                      </label>
                      <input
                        id="ssid"
                        type="text"
                        value={wifiInfo.ssid}
                        onChange={(event) =>
                          setWifiInfo((prev) => ({ ...prev, ssid: event.target.value }))
                        }
                        placeholder={t('networkNamePlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="wifiPassword">
                        {t('wifiPassword')}
                      </label>
                      <input
                        id="wifiPassword"
                        type="password"
                        value={wifiInfo.password}
                        onChange={(event) =>
                          setWifiInfo((prev) => ({ ...prev, password: event.target.value }))
                        }
                        placeholder={t('passwordPlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="wifiSecurity">
                        {t('wifiSecurity')}
                      </label>
                      <select
                        id="wifiSecurity"
                        value={wifiInfo.security}
                        onChange={(event) =>
                          setWifiInfo((prev) => ({ ...prev, security: event.target.value as WifiInfo['security'] }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="Open">{t('wifiOpen')}</option>
                        <option value="WPA">{t('wifiWpa')}</option>
                        <option value="WEP">{t('wifiWep')}</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="hidden"
                        type="checkbox"
                        checked={wifiInfo.hidden}
                        onChange={(event) =>
                          setWifiInfo((prev) => ({ ...prev, hidden: event.target.checked }))
                        }
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <label htmlFor="hidden" className="ml-2 text-sm font-medium text-gray-700">
                        {t('wifiHidden')}
                      </label>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  {t('clearAllFields')}
                </button>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('customization')}</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="codeColor">
                        {t('codeColor')}
                      </label>
                      <input
                        id="codeColor"
                        type="color"
                        value={customization.codeColor}
                        onChange={(event) =>
                          setCustomization((prev) => ({ ...prev, codeColor: event.target.value }))
                        }
                        className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="backgroundColor">
                        {t('backgroundColor')}
                      </label>
                      <input
                        id="backgroundColor"
                        type="color"
                        value={customization.backgroundColor}
                        onChange={(event) =>
                          setCustomization((prev) => ({ ...prev, backgroundColor: event.target.value }))
                        }
                        className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="cornerSquareColor">
                        {t('cornerSquareColor')}
                      </label>
                      <input
                        id="cornerSquareColor"
                        type="color"
                        value={customization.cornerSquareColor}
                        onChange={(event) =>
                          setCustomization((prev) => ({ ...prev, cornerSquareColor: event.target.value }))
                        }
                        className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="borderColor">
                        {t('borderColor')}
                      </label>
                      <input
                        id="borderColor"
                        type="color"
                        value={customization.borderColor}
                        onChange={(event) =>
                          setCustomization((prev) => ({ ...prev, borderColor: event.target.value }))
                        }
                        className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="cornerStyle">
                      {t('cornerStyle')}
                    </label>
                    <select
                      id="cornerStyle"
                      value={customization.cornerStyle}
                      onChange={(event) =>
                        setCustomization((prev) => ({ ...prev, cornerStyle: event.target.value as CornerStyle }))
                      }
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="square">{t('squareCorners')}</option>
                      <option value="rounded">{t('roundedCorners')}</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="moduleStyle">
                      {t('moduleStyle')}
                    </label>
                    <select
                      id="moduleStyle"
                      value={customization.moduleStyle}
                      onChange={(event) =>
                        setCustomization((prev) => ({ ...prev, moduleStyle: event.target.value as ModuleStyle }))
                      }
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="square">{t('squareModules')}</option>
                      <option value="round">{t('roundModules')}</option>
                    </select>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">{t('centerLogo')}</h4>

                    {!customization.centerLogo ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="logoUpload">
                          {t('uploadLogo')}
                        </label>
                        <input
                          id="logoUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Logo uploaded</span>
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                          >
                            {t('removeLogo')}
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="logoSize">
                            {t('logoSize')}
                          </label>
                          <select
                            id="logoSize"
                            value={customization.logoSize}
                            onChange={(event) =>
                              setCustomization((prev) => ({ ...prev, logoSize: event.target.value as LogoSize }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="small">{t('logoSmall')}</option>
                            <option value="large">{t('logoLarge')}</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <input
                        id="showCaption"
                        type="checkbox"
                        checked={customization.showCaption}
                        onChange={(event) =>
                          setCustomization((prev) => ({ ...prev, showCaption: event.target.checked }))
                        }
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <label htmlFor="showCaption" className="ml-2 text-sm font-medium text-gray-700">
                        {t('showCaption')}
                      </label>
                    </div>

                    {customization.showCaption && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={customization.caption}
                          onChange={(event) =>
                            setCustomization((prev) => ({ ...prev, caption: event.target.value }))
                          }
                          placeholder={t('captionPlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="captionSize">
                              {t('captionSize')}
                            </label>
                            <select
                              id="captionSize"
                              value={customization.captionSize}
                              onChange={(event) =>
                                setCustomization((prev) => ({
                                  ...prev,
                                  captionSize: event.target.value as CaptionSize
                                }))
                              }
                              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="small">{t('captionSmall')}</option>
                              <option value="large">{t('captionLarge')}</option>
                              <option value="extraLarge">{t('captionExtraLarge')}</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="captionBold">
                              {t('captionBold')}
                            </label>
                            <div className="flex items-center h-8">
                              <input
                                id="captionBold"
                                type="checkbox"
                                checked={customization.captionBold}
                                onChange={(event) =>
                                  setCustomization((prev) => ({ ...prev, captionBold: event.target.checked }))
                                }
                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                              />
                              <label htmlFor="captionBold" className="ml-2 text-sm text-gray-700">
                                Bold
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">{t('generatedQrCode')}</h2>

                <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-sm">
                  {qrData ? (
                    <div className="text-center">
                      <div ref={qrContainerRef} className="flex flex-col justify-center items-center" />
                      <p className="text-sm text-gray-600 mt-4">{t('scanQrCode')}</p>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">{t('fillFormPrompt')}</p>
                    </div>
                  )}
                </div>

                {qrData && (
                  <div className="flex flex-col gap-4 w-full max-w-sm">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          downloadQRCode('png');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg cursor-pointer text-sm"
                        style={{ pointerEvents: 'auto', zIndex: 10 }}
                      >
                        <Download className="w-4 h-4 pointer-events-none" />
                        <span className="pointer-events-none">{t('downloadPng')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          downloadQRCode('svg');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg cursor-pointer text-sm"
                        style={{ pointerEvents: 'auto', zIndex: 10 }}
                      >
                        <Download className="w-4 h-4 pointer-events-none" />
                        <span className="pointer-events-none">{t('downloadSvg')}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        copyToClipboard();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium cursor-pointer"
                      style={{ pointerEvents: 'auto', zIndex: 10 }}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600 pointer-events-none" />
                          <span className="pointer-events-none">{t('copied')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 pointer-events-none" />
                          <span className="pointer-events-none">{t('copyData')}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {qrData && (
                  <div className="w-full max-w-sm">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{t('qrCodeData')}</h3>
                    <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-words">{qrData}</pre>
                    </div>
                  </div>
                )}

                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 w-full max-w-sm text-center mt-6 hidden">
                  <div className="text-gray-500 text-xs mb-2">Advertisement</div>
                  <div className="bg-white rounded p-3 min-h-[200px] flex items-center justify-center">
                    <span className="text-gray-400 text-xs">250x250 AdSense Square</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 mt-8 mb-8 text-center hidden">
          <div className="text-gray-500 text-sm mb-2">Advertisement</div>
          <div className="bg-white rounded p-4 min-h-[250px] flex items-center justify-center">
            <span className="text-gray-400 text-xs">300x250 AdSense Rectangle</span>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm space-y-3">
          <p>{t('footerText')}</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Terms of Use
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('contact')}
              className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Contact
            </button>
          </div>
          <p>
            © 2025{' '}
            <a
              href="https://zentopia.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Zentopia Labs
            </a>{' '}
            - All rights reserved
          </p>
        </div>

        <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Terms of Use">
          {activeModal === 'terms' && getModalContent('terms')}
        </Modal>

        <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy Policy">
          {activeModal === 'privacy' && getModalContent('privacy')}
        </Modal>

        <Modal isOpen={activeModal === 'contact'} onClose={() => setActiveModal(null)} title="Contact Us">
          {activeModal === 'contact' && getModalContent('contact')}
        </Modal>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
