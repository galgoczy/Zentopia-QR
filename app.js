// QR Code Generator App for zentopia Labs
// Comprehensive QR code generation with customization

class ZentopiaQRGenerator {
    constructor() {
        this.currentTab = 'url';
        this.qrData = '';
        this.settings = {
            moduleColor: '#000000',
            bgColor: '#FFFFFF',
            cornerColor: '#6366f1',
            frameColor: '#000000',
            moduleStyle: 'square',
            frameStyle: 'square',
            logoImage: null,
            logoSize: 17,
            caption: ''
        };

        this.canvas = document.getElementById('qrCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.qrMatrix = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateQRCode();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Color inputs
        document.getElementById('moduleColor').addEventListener('input', (e) => {
            this.settings.moduleColor = e.target.value;
            document.getElementById('moduleColorValue').textContent = e.target.value;
            this.generateQRCode();
        });

        document.getElementById('bgColor').addEventListener('input', (e) => {
            this.settings.bgColor = e.target.value;
            document.getElementById('bgColorValue').textContent = e.target.value;
            this.generateQRCode();
        });

        document.getElementById('cornerColor').addEventListener('input', (e) => {
            this.settings.cornerColor = e.target.value;
            document.getElementById('cornerColorValue').textContent = e.target.value;
            this.generateQRCode();
        });

        document.getElementById('frameColor').addEventListener('input', (e) => {
            this.settings.frameColor = e.target.value;
            document.getElementById('frameColorValue').textContent = e.target.value;
            this.generateQRCode();
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
            document.getElementById('captionDisplay').textContent = e.target.value;
        });

        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateQRCode();
        });

        // Input fields - auto generate on change
        const autoGenFields = ['urlInput', 'textInput', 'contactName', 'contactEmail',
                               'contactPhone', 'contactOrg', 'wifiSsid', 'wifiPassword', 'wifiSecurity'];
        autoGenFields.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.generateQRCode());
            }
        });

        // Download buttons
        document.getElementById('downloadPng').addEventListener('click', () => this.downloadPNG());
        document.getElementById('downloadSvg').addEventListener('click', () => this.downloadSVG());

        // Privacy policy modal
        document.getElementById('privacyLink').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Privacy Policy\n\n' +
                  'The zentopia Labs QR code generator does not collect or store personal data. ' +
                  'All QR code generation happens in your browser, data is not transmitted to any server. ' +
                  'We use Google Analytics to collect anonymous usage statistics to improve the service.\n\n' +
                  'zentopia Labs © 2025');
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

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

    generateQRCode() {
        this.qrData = this.getQRData();

        if (!this.qrData) {
            return;
        }

        try {
            // Use qrcode-generator library
            const typeNumber = 0; // Auto-detect
            const errorCorrectionLevel = 'H'; // High error correction for logo support
            const qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(this.qrData);
            qr.make();

            this.qrMatrix = qr;
            this.drawCustomQR();
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    }

    drawCustomQR() {
        if (!this.qrMatrix) return;

        const moduleCount = this.qrMatrix.getModuleCount();
        const size = 900; // High quality output
        const frameBorder = 40; // Border for the frame
        const padding = 80;
        const qrSize = size - padding * 2;
        const cellSize = qrSize / moduleCount;

        this.canvas.width = size;
        this.canvas.height = size;

        const ctx = this.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Background
        ctx.fillStyle = this.settings.bgColor;
        ctx.fillRect(0, 0, size, size);

        // Draw frame border around QR code
        const frameMargin = 20;
        const frameX = frameMargin;
        const frameY = frameMargin;
        const frameSize = size - frameMargin * 2;

        ctx.strokeStyle = this.settings.frameColor;
        ctx.lineWidth = 24;

        if (this.settings.frameStyle === 'rounded') {
            this.drawRoundedRectStroke(ctx, frameX, frameY, frameSize, frameSize, 30);
        } else {
            ctx.strokeRect(frameX, frameY, frameSize, frameSize);
        }

        // Draw QR code modules
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (this.qrMatrix.isDark(row, col)) {
                    const x = padding + col * cellSize;
                    const y = padding + row * cellSize;

                    // Check if this is a corner position indicator
                    const isCorner = this.isCornerModule(row, col, moduleCount);

                    // Skip drawing individual modules in corners, we'll draw them as unified blocks
                    if (isCorner) continue;

                    ctx.fillStyle = this.settings.moduleColor;

                    // Draw based on module style
                    if (this.settings.moduleStyle === 'dot') {
                        // Draw circular modules
                        ctx.beginPath();
                        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.45, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (this.settings.moduleStyle === 'rounded') {
                        // Draw rounded modules
                        this.drawRoundedRect(ctx, x, y, cellSize * 0.9, cellSize * 0.9, cellSize * 0.2, ctx.fillStyle);
                    } else {
                        // Draw square modules
                        ctx.fillRect(x, y, cellSize * 0.95, cellSize * 0.95);
                    }
                }
            }
        }

        // Draw corner position detection patterns as unified blocks
        this.drawCornerPatterns(ctx, padding, cellSize, moduleCount);

        // Draw logo if present
        if (this.settings.logoImage) {
            this.drawLogo(ctx, size, moduleCount, cellSize, padding);
        }
    }

    isCornerModule(row, col, moduleCount) {
        // Position detection patterns are in three corners
        const cornerSize = 7;

        // Top-left corner
        if (row < cornerSize && col < cornerSize) return true;

        // Top-right corner
        if (row < cornerSize && col >= moduleCount - cornerSize) return true;

        // Bottom-left corner
        if (row >= moduleCount - cornerSize && col < cornerSize) return true;

        return false;
    }

    drawCornerPatterns(ctx, padding, cellSize, moduleCount) {
        const cornerSize = 7 * cellSize;
        const corners = [
            { x: padding, y: padding }, // Top-left
            { x: padding + (moduleCount - 7) * cellSize, y: padding }, // Top-right
            { x: padding, y: padding + (moduleCount - 7) * cellSize } // Bottom-left
        ];

        corners.forEach(corner => {
            ctx.fillStyle = this.settings.cornerColor;

            // Outer square (7x7)
            ctx.fillRect(corner.x, corner.y, cornerSize, cornerSize);

            // Inner white square (5x5, leaving 1 module border)
            ctx.fillStyle = this.settings.bgColor;
            ctx.fillRect(
                corner.x + cellSize,
                corner.y + cellSize,
                5 * cellSize,
                5 * cellSize
            );

            // Center square (3x3, leaving 1 module white border)
            ctx.fillStyle = this.settings.cornerColor;
            ctx.fillRect(
                corner.x + 2 * cellSize,
                corner.y + 2 * cellSize,
                3 * cellSize,
                3 * cellSize
            );
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
        ctx.stroke();
    }

    drawLogo(ctx, canvasSize, moduleCount, cellSize, canvasPadding) {
        const logoSize = (canvasSize * this.settings.logoSize) / 100;
        const x = (canvasSize - logoSize) / 2;
        const y = (canvasSize - logoSize) / 2;

        // Calculate which modules to clear for the logo
        const centerModule = Math.floor(moduleCount / 2);
        const logoModuleSize = Math.ceil(logoSize / cellSize / 2);

        // Clear the modules where the logo will be
        ctx.fillStyle = this.settings.bgColor;
        const clearSize = logoModuleSize * 2 * cellSize + cellSize;
        const clearX = canvasPadding + (centerModule - logoModuleSize) * cellSize;
        const clearY = canvasPadding + (centerModule - logoModuleSize) * cellSize;

        if (this.settings.moduleStyle === 'rounded' || this.settings.moduleStyle === 'dot') {
            this.drawRoundedRect(ctx, clearX - 10, clearY - 10,
                                clearSize + 20, clearSize + 20, 20, this.settings.bgColor);
        } else {
            ctx.fillRect(clearX - 10, clearY - 10, clearSize + 20, clearSize + 20);
        }

        // Draw logo
        if (this.settings.moduleStyle === 'rounded' || this.settings.moduleStyle === 'dot') {
            // Clip to rounded rectangle
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
        // Create high-res version with caption
        const captionText = this.settings.caption;
        const captionHeight = captionText ? 80 : 0;
        const totalHeight = 900 + captionHeight;

        const downloadCanvas = document.createElement('canvas');
        downloadCanvas.width = 900;
        downloadCanvas.height = totalHeight;
        const downloadCtx = downloadCanvas.getContext('2d');

        // Fill background
        downloadCtx.fillStyle = this.settings.bgColor;
        downloadCtx.fillRect(0, 0, 900, totalHeight);

        // Copy current QR canvas
        downloadCtx.drawImage(this.canvas, 0, 0);

        // Draw caption if exists
        if (captionText) {
            downloadCtx.fillStyle = '#000000';
            downloadCtx.font = 'bold 32px Arial, sans-serif';
            downloadCtx.textAlign = 'center';
            downloadCtx.textBaseline = 'middle';
            downloadCtx.fillText(captionText, 450, 900 + captionHeight / 2);
        }

        // Convert to blob and download
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
        // Generate SVG representation
        const size = 900;
        const captionText = this.settings.caption;
        const captionHeight = captionText ? 80 : 0;
        const totalHeight = size + captionHeight;

        let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <pattern id="qrPattern" x="0" y="0" width="1" height="1">
            <image x="0" y="0" width="${size}" height="${size}" xlink:href="${this.canvas.toDataURL()}" />
        </pattern>
    </defs>
`;

        // Background
        svg += `    <rect width="${size}" height="${totalHeight}" fill="${this.settings.bgColor}"/>\n`;

        // QR Code
        svg += `    <rect x="0" y="0" width="${size}" height="${size}" fill="url(#qrPattern)"/>\n`;

        // Caption
        if (captionText) {
            // Escape XML special characters
            const escapedText = captionText
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');

            svg += `    <text x="${size / 2}" y="${size + captionHeight / 2}" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#000000">${escapedText}</text>\n`;
        }

        svg += `</svg>`;

        // Download SVG
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
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ZentopiaQRGenerator();
});
