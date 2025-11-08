// QR Code Generator App for zentopia Labs - Modern Version
// Comprehensive QR code generation with customization and modern UX

class ZentopiaQRGenerator {
    constructor() {
        this.currentTab = 'url';
        this.qrData = '';
        this.settings = {
            moduleColor: '#000000',
            bgColor: '#FFFFFF',
            cornerColor: '#06b6d4',
            frameColor: '#000000',
            moduleStyle: 'square',
            frameStyle: 'square',
            logoImage: null,
            logoSize: 17,
            caption: '',
            captionSize: 'small'
        };

        this.canvas = document.getElementById('qrCanvas');
        this.heroCanvas = document.getElementById('heroQrCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.heroCtx = this.heroCanvas.getContext('2d');
        this.qrMatrix = null;
        this.debounceTimer = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateQRCode();
        this.generateHeroQR();
    }

    // Debounce function for input
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
        };
    }

    setupEventListeners() {
        // Tab switching for QR types
        document.querySelectorAll('.qr-type-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Color inputs
        ['moduleColor', 'bgColor', 'cornerColor', 'frameColor'].forEach(colorId => {
            document.getElementById(colorId).addEventListener('input', () => {
                this.settings[colorId] = document.getElementById(colorId).value;
                this.generateQRCode();
            });
        });

        // Module style
        document.querySelectorAll('input[name="moduleStyle"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.moduleStyle = e.target.value;
                this.generateQRCode();
            });
        });

        // Frame style
        document.querySelectorAll('input[name="frameStyle"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.frameStyle = e.target.value;
                this.generateQRCode();
            });
        });

        // Logo upload
        document.getElementById('logoUpload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                document.getElementById('logoFileName').textContent = file.name;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        this.settings.logoImage = img;
                        // Show logo preview
                        document.getElementById('logoPreview').classList.remove('hidden');
                        document.getElementById('logoPreviewImg').src = event.target.result;
                        this.generateQRCode();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Logo size
        document.querySelectorAll('input[name="logoSize"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.logoSize = parseInt(e.target.value);
                this.generateQRCode();
            });
        });

        // Caption
        document.getElementById('captionInput').addEventListener('input', (e) => {
            this.settings.caption = e.target.value;
            this.updateCaptionDisplay();
        });

        // Caption size
        document.querySelectorAll('input[name="captionSize"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.captionSize = e.target.value;
                this.updateCaptionDisplay();
            });
        });

        // Input fields with debounce for URL
        const debouncedGenerate = this.debounce(() => {
            this.validateAndGenerate();
        }, 300);

        document.getElementById('urlInput').addEventListener('input', debouncedGenerate);

        // Other input fields - auto generate
        const autoGenFields = ['textInput', 'contactName', 'contactEmail',
                               'contactPhone', 'contactOrg', 'wifiSsid', 'wifiPassword', 'wifiSecurity'];
        autoGenFields.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.generateQRCode());
            }
        });

        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.validateAndGenerate();
        });

        // Download buttons
        document.getElementById('downloadPng').addEventListener('click', () => this.downloadPNG());
        document.getElementById('downloadSvg').addEventListener('click', () => this.downloadSVG());

        // Privacy policy
        document.getElementById('privacyLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPrivacyPolicy();
        });
    }

    validateAndGenerate() {
        // Validate URL if on URL tab
        if (this.currentTab === 'url') {
            const urlInput = document.getElementById('urlInput');
            const urlError = document.getElementById('urlError');
            const url = urlInput.value.trim();

            if (url && !this.isValidURL(url)) {
                urlError.classList.remove('hidden');
                urlInput.classList.add('border-red-500');
                return;
            } else {
                urlError.classList.add('hidden');
                urlInput.classList.remove('border-red-500');
            }
        }

        this.generateQRCode();
    }

    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.qr-type-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');

        this.currentTab = tabName;
        this.generateQRCode();
    }

    getQRData() {
        let data = '';

        switch(this.currentTab) {
            case 'url':
                data = document.getElementById('urlInput').value || 'https://zentopia.io';
                break;

            case 'text':
                data = document.getElementById('textInput').value || 'Hello from zentopia Labs!';
                break;

            case 'contact':
                const name = document.getElementById('contactName').value;
                const email = document.getElementById('contactEmail').value;
                const phone = document.getElementById('contactPhone').value;
                const org = document.getElementById('contactOrg').value;

                // vCard format
                data = 'BEGIN:VCARD\n';
                data += 'VERSION:3.0\n';
                if (name) data += `FN:${name}\n`;
                if (org) data += `ORG:${org}\n`;
                if (email) data += `EMAIL:${email}\n`;
                if (phone) data += `TEL:${phone}\n`;
                data += 'END:VCARD';
                break;

            case 'wifi':
                const ssid = document.getElementById('wifiSsid').value;
                const password = document.getElementById('wifiPassword').value;
                const security = document.getElementById('wifiSecurity').value;

                // WiFi QR format
                data = `WIFI:T:${security};S:${ssid};P:${password};;`;
                break;
        }

        return data;
    }

    showLoading(show) {
        const btnText = document.getElementById('generateBtnText');
        const btnLoading = document.getElementById('generateBtnLoading');

        if (show) {
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
        } else {
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    }

    enableDownload(enable) {
        const pngBtn = document.getElementById('downloadPng');
        const svgBtn = document.getElementById('downloadSvg');
        const successMsg = document.getElementById('successMessage');

        if (enable) {
            pngBtn.disabled = false;
            svgBtn.disabled = false;
            successMsg.classList.remove('hidden');
        } else {
            pngBtn.disabled = true;
            svgBtn.disabled = true;
            successMsg.classList.add('hidden');
        }
    }

    generateQRCode() {
        this.qrData = this.getQRData();

        if (!this.qrData) {
            this.enableDownload(false);
            return;
        }

        try {
            this.showLoading(true);

            // Use qrcode-generator library
            const typeNumber = 0; // Auto-detect
            const errorCorrectionLevel = 'H'; // High error correction for logo support
            const qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(this.qrData);
            qr.make();

            this.qrMatrix = qr;
            this.drawCustomQR(this.canvas, this.ctx);

            setTimeout(() => {
                this.showLoading(false);
                this.enableDownload(true);
            }, 200);
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showLoading(false);
            this.enableDownload(false);
        }
    }

    generateHeroQR() {
        try {
            const qr = qrcode(0, 'H');
            qr.addData('https://qrcode.zentopia.io');
            qr.make();

            const moduleCount = qr.getModuleCount();
            const cellSize = 300 / moduleCount;

            this.heroCtx.fillStyle = '#FFFFFF';
            this.heroCtx.fillRect(0, 0, 300, 300);

            for (let row = 0; row < moduleCount; row++) {
                for (let col = 0; col < moduleCount; col++) {
                    if (qr.isDark(row, col)) {
                        const x = col * cellSize;
                        const y = row * cellSize;
                        this.heroCtx.fillStyle = '#06b6d4';
                        this.heroCtx.fillRect(x, y, cellSize * 0.95, cellSize * 0.95);
                    }
                }
            }
        } catch (error) {
            console.error('Error generating hero QR:', error);
        }
    }

    drawCustomQR(canvas, ctx) {
        if (!this.qrMatrix) return;

        const moduleCount = this.qrMatrix.getModuleCount();
        const size = 900;
        const padding = 80;
        const qrSize = size - padding * 2;
        const cellSize = qrSize / moduleCount;

        canvas.width = size;
        canvas.height = size;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Background
        ctx.fillStyle = this.settings.bgColor;
        ctx.fillRect(0, 0, size, size);

        // Draw frame border (if not "none")
        if (this.settings.frameStyle !== 'none') {
            const frameMargin = 5;
            const frameThickness = 43; // 20% thicker than before (36px * 1.2)
            const frameX = frameMargin;
            const frameY = frameMargin;
            const frameSize = size - frameMargin * 2;

            ctx.strokeStyle = this.settings.frameColor;
            ctx.lineWidth = frameThickness;

            if (this.settings.frameStyle === 'rounded') {
                // Beautifully rounded frame with smooth corners
                const cornerRadius = 60;
                this.drawRoundedRectStroke(ctx, frameX, frameY, frameSize, frameSize, cornerRadius);
            } else {
                ctx.strokeRect(frameX, frameY, frameSize, frameSize);
            }
        }

        // Draw QR code modules
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (this.qrMatrix.isDark(row, col)) {
                    const x = padding + col * cellSize;
                    const y = padding + row * cellSize;

                    const isCorner = this.isCornerModule(row, col, moduleCount);
                    if (isCorner) continue;

                    ctx.fillStyle = this.settings.moduleColor;

                    if (this.settings.moduleStyle === 'dot') {
                        ctx.beginPath();
                        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.45, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (this.settings.moduleStyle === 'rounded') {
                        this.drawRoundedRect(ctx, x, y, cellSize * 0.9, cellSize * 0.9, cellSize * 0.2, ctx.fillStyle);
                    } else {
                        // Square modules - seamless, no gaps
                        ctx.fillRect(x, y, cellSize, cellSize);
                    }
                }
            }
        }

        // Draw corner patterns
        this.drawCornerPatterns(ctx, padding, cellSize, moduleCount);

        // Draw logo if present
        if (this.settings.logoImage) {
            this.drawLogo(ctx, size, moduleCount, cellSize, padding);
        }
    }

    isCornerModule(row, col, moduleCount) {
        const cornerSize = 7;
        if (row < cornerSize && col < cornerSize) return true;
        if (row < cornerSize && col >= moduleCount - cornerSize) return true;
        if (row >= moduleCount - cornerSize && col < cornerSize) return true;
        return false;
    }

    drawCornerPatterns(ctx, padding, cellSize, moduleCount) {
        const cornerSize = 7 * cellSize;
        const corners = [
            { x: padding, y: padding },
            { x: padding + (moduleCount - 7) * cellSize, y: padding },
            { x: padding, y: padding + (moduleCount - 7) * cellSize }
        ];

        const isRounded = this.settings.frameStyle === 'rounded';
        const radius = isRounded ? cellSize * 0.5 : 0;

        corners.forEach(corner => {
            ctx.fillStyle = this.settings.cornerColor;

            if (isRounded) {
                // Outer rounded square
                this.drawRoundedRect(ctx, corner.x, corner.y, cornerSize, cornerSize, radius, this.settings.cornerColor);
            } else {
                ctx.fillRect(corner.x, corner.y, cornerSize, cornerSize);
            }

            // Inner white square
            ctx.fillStyle = this.settings.bgColor;
            if (isRounded) {
                this.drawRoundedRect(ctx, corner.x + cellSize, corner.y + cellSize, 5 * cellSize, 5 * cellSize, radius * 0.7, this.settings.bgColor);
            } else {
                ctx.fillRect(corner.x + cellSize, corner.y + cellSize, 5 * cellSize, 5 * cellSize);
            }

            // Center square
            ctx.fillStyle = this.settings.cornerColor;
            if (isRounded) {
                this.drawRoundedRect(ctx, corner.x + 2 * cellSize, corner.y + 2 * cellSize, 3 * cellSize, 3 * cellSize, radius * 0.5, this.settings.cornerColor);
            } else {
                ctx.fillRect(corner.x + 2 * cellSize, corner.y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
            }
        });
    }

    drawRoundedRect(ctx, x, y, width, height, radius, color) {
        ctx.fillStyle = color;
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

    drawRoundedRectStroke(ctx, x, y, width, height, radius) {
        // Draw rounded rectangle frame using arc() for perfect circular corners
        ctx.save();

        ctx.beginPath();
        // Start from top-left corner (after the radius)
        ctx.moveTo(x + radius, y);
        // Top edge to top-right corner
        ctx.lineTo(x + width - radius, y);
        // Top-right corner (arc from 270° to 0°)
        ctx.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0);
        // Right edge to bottom-right corner
        ctx.lineTo(x + width, y + height - radius);
        // Bottom-right corner (arc from 0° to 90°)
        ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
        // Bottom edge to bottom-left corner
        ctx.lineTo(x + radius, y + height);
        // Bottom-left corner (arc from 90° to 180°)
        ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
        // Left edge to top-left corner
        ctx.lineTo(x, y + radius);
        // Top-left corner (arc from 180° to 270°)
        ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
        ctx.closePath();

        ctx.stroke();
        ctx.restore();
    }

    drawLogo(ctx, canvasSize, moduleCount, cellSize, canvasPadding) {
        const logoSize = (canvasSize * this.settings.logoSize) / 100;
        const x = (canvasSize - logoSize) / 2;
        const y = (canvasSize - logoSize) / 2;

        const centerModule = Math.floor(moduleCount / 2);
        const logoModuleSize = Math.ceil(logoSize / cellSize / 2);

        ctx.fillStyle = this.settings.bgColor;
        const clearSize = logoModuleSize * 2 * cellSize + cellSize;
        const clearX = canvasPadding + (centerModule - logoModuleSize) * cellSize;
        const clearY = canvasPadding + (centerModule - logoModuleSize) * cellSize;

        if (this.settings.moduleStyle === 'rounded' || this.settings.moduleStyle === 'dot') {
            this.drawRoundedRect(ctx, clearX - 10, clearY - 10, clearSize + 20, clearSize + 20, 20, this.settings.bgColor);
        } else {
            ctx.fillRect(clearX - 10, clearY - 10, clearSize + 20, clearSize + 20);
        }

        if (this.settings.moduleStyle === 'rounded' || this.settings.moduleStyle === 'dot') {
            ctx.save();
            ctx.beginPath();
            const logoRadius = 15;
            ctx.moveTo(x + logoRadius, y);
            ctx.lineTo(x + logoSize - logoRadius, y);
            ctx.quadraticCurveTo(x + logoSize, y, x + logoSize, y + logoRadius);
            ctx.lineTo(x + logoSize, y + logoSize - logoRadius);
            ctx.quadraticCurveTo(x + logoSize, y + logoSize, x + logoSize - logoRadius, y + logoSize);
            ctx.lineTo(x + logoRadius, y + logoSize);
            ctx.quadraticCurveTo(x, y + logoSize, x, y + logoSize - logoRadius);
            ctx.lineTo(x, y + logoRadius);
            ctx.quadraticCurveTo(x, y, x + logoRadius, y);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.settings.logoImage, x, y, logoSize, logoSize);
            ctx.restore();
        } else {
            ctx.drawImage(this.settings.logoImage, x, y, logoSize, logoSize);
        }
    }

    downloadPNG() {
        const captionText = this.settings.caption;
        const isLarge = this.settings.captionSize === 'large';
        const captionHeight = captionText ? (isLarge ? 140 : 80) : 0;
        const totalHeight = 900 + captionHeight;

        const downloadCanvas = document.createElement('canvas');
        downloadCanvas.width = 900;
        downloadCanvas.height = totalHeight;
        const downloadCtx = downloadCanvas.getContext('2d');

        downloadCtx.fillStyle = this.settings.bgColor;
        downloadCtx.fillRect(0, 0, 900, totalHeight);

        downloadCtx.drawImage(this.canvas, 0, 0);

        if (captionText) {
            downloadCtx.fillStyle = '#000000';
            // Font sizes adjusted to match preview visual appearance (900px / 350px ratio)
            const fontSize = isLarge ? 124 : 62;
            downloadCtx.font = `bold ${fontSize}px Arial, sans-serif`;
            downloadCtx.textAlign = 'center';
            downloadCtx.textBaseline = 'middle';
            downloadCtx.fillText(captionText, 450, 900 + captionHeight / 2);
        }

        downloadCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zentopia-qrcode-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    downloadSVG() {
        const size = 900;
        const captionText = this.settings.caption;
        const isLarge = this.settings.captionSize === 'large';
        const captionHeight = captionText ? (isLarge ? 140 : 80) : 0;
        const totalHeight = size + captionHeight;

        let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <pattern id="qrPattern" x="0" y="0" width="1" height="1">
            <image x="0" y="0" width="${size}" height="${size}" xlink:href="${this.canvas.toDataURL()}" />
        </pattern>
    </defs>
`;

        svg += `    <rect width="${size}" height="${totalHeight}" fill="${this.settings.bgColor}"/>\n`;
        svg += `    <rect x="0" y="0" width="${size}" height="${size}" fill="url(#qrPattern)"/>\n`;

        if (captionText) {
            const escapedText = captionText
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');

            // Font sizes adjusted to match preview visual appearance (900px / 350px ratio)
            const fontSize = isLarge ? 124 : 62;
            svg += `    <text x="${size / 2}" y="${size + captionHeight / 2}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#000000">${escapedText}</text>\n`;
        }

        svg += `</svg>`;

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zentopia-qrcode-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    updateCaptionDisplay() {
        const captionDisplay = document.getElementById('captionDisplay');
        captionDisplay.textContent = this.settings.caption;

        // Update font size to match export styling better
        if (this.settings.captionSize === 'large') {
            captionDisplay.style.fontSize = '3rem'; // 48px - closer to 64px export
            captionDisplay.style.fontWeight = 'bold';
        } else {
            captionDisplay.style.fontSize = '1.5rem'; // 24px - closer to 32px export
            captionDisplay.style.fontWeight = '600';
        }
    }

    showPrivacyPolicy() {
        alert('Privacy Policy\n\n' +
              'The zentopia Labs QR code generator does not collect or store personal data. ' +
              'All QR code generation happens in your browser, data is not transmitted to any server. ' +
              'We use Google Analytics to collect anonymous usage statistics to improve the service.\n\n' +
              'zentopia Labs © 2025');
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ZentopiaQRGenerator();
    initFeedbackForm();
});

// ========================================
// Feedback Form Management
// ========================================

function initFeedbackForm() {
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-Y2DjuaRLXLTsQqOeu5ZUHZgSxjCv5A1nGqU_ZSnN3Ms3H30yCo4IBTn2lL8x6QvNFA/exec';

    // State
    let selectedCategory = '';

    // Elements
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackText = document.getElementById('feedbackText');
    const feedbackEmail = document.getElementById('feedbackEmail');
    const charCounter = document.getElementById('charCounter');
    const submitBtn = document.getElementById('feedbackSubmit');
    const submitText = document.getElementById('feedbackSubmitText');
    const sendIcon = document.getElementById('feedbackSendIcon');
    const spinner = document.getElementById('feedbackSpinner');
    const successMsg = document.getElementById('feedbackSuccess');
    const errorMsg = document.getElementById('feedbackError');
    const categoryButtons = document.querySelectorAll('.feedback-category');

    // Character counter handler
    feedbackText.addEventListener('input', (e) => {
        const text = e.target.value;
        const count = text.length;
        charCounter.textContent = `${count} / 500 characters`;

        // Update counter color
        if (count >= 500) {
            charCounter.classList.remove('text-gray-400', 'text-orange-500');
            charCounter.classList.add('text-red-500');
        } else if (count >= 450) {
            charCounter.classList.remove('text-gray-400', 'text-red-500');
            charCounter.classList.add('text-orange-500');
        } else {
            charCounter.classList.remove('text-orange-500', 'text-red-500');
            charCounter.classList.add('text-gray-400');
        }

        // Enable/disable submit button
        submitBtn.disabled = count < 10;
    });

    // Category selection handler
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Toggle selection
            if (selectedCategory === category) {
                // Deselect
                selectedCategory = '';
                btn.classList.remove('border-cyan-500', 'text-cyan-700', 'bg-cyan-50');
                btn.classList.add('border-gray-300', 'text-gray-600', 'bg-white');
            } else {
                // Deselect all first
                categoryButtons.forEach(b => {
                    b.classList.remove('border-cyan-500', 'text-cyan-700', 'bg-cyan-50');
                    b.classList.add('border-gray-300', 'text-gray-600', 'bg-white');
                });

                // Select this one
                selectedCategory = category;
                btn.classList.remove('border-gray-300', 'text-gray-600', 'bg-white');
                btn.classList.add('border-cyan-500', 'text-cyan-700', 'bg-cyan-50');
            }
        });
    });

    // Form submit handler
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const feedback = feedbackText.value.trim();
        const email = feedbackEmail.value.trim();

        // Validation
        if (feedback.length < 10) {
            alert('Please write at least 10 characters');
            return;
        }

        if (feedback.length > 500) {
            alert('Feedback is too long (max 500 characters)');
            return;
        }

        // Email validation (if provided)
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Hide previous messages
        successMsg.classList.add('hidden');
        errorMsg.classList.add('hidden');

        // Show loading state
        submitBtn.disabled = true;
        sendIcon.classList.add('hidden');
        spinner.classList.remove('hidden');
        submitText.textContent = 'Sending...';

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    feedback: feedback,
                    email: email || 'Not provided',
                    category: selectedCategory || 'Not specified',
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                })
            });

            // Success (no-cors mode doesn't allow reading response)
            successMsg.classList.remove('hidden');

            // Reset form
            feedbackText.value = '';
            feedbackEmail.value = '';
            charCounter.textContent = '0 / 500 characters';
            charCounter.classList.remove('text-orange-500', 'text-red-500');
            charCounter.classList.add('text-gray-400');

            // Deselect category
            categoryButtons.forEach(b => {
                b.classList.remove('border-cyan-500', 'text-cyan-700', 'bg-cyan-50');
                b.classList.add('border-gray-300', 'text-gray-600', 'bg-white');
            });
            selectedCategory = '';

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 5000);

        } catch (error) {
            console.error('Feedback submission error:', error);
            errorMsg.classList.remove('hidden');

            // Auto-hide error message after 5 seconds
            setTimeout(() => {
                errorMsg.classList.add('hidden');
            }, 5000);
        } finally {
            // Reset button state
            sendIcon.classList.remove('hidden');
            spinner.classList.add('hidden');
            submitText.textContent = 'Send Feedback';
            submitBtn.disabled = feedbackText.value.trim().length < 10;
        }
    });
}
