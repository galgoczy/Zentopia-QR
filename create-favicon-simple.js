#!/usr/bin/env node

// Simple QR Code favicon generator
// Creates a minimal QR code for "Hi" using pure Node.js (no dependencies)

const fs = require('fs');

// QR Code pattern for "Hi" (simplified 21x21 version)
// This is a pre-calculated QR code matrix for the text "Hi"
const qrPattern = [
    [1,1,1,1,1,1,1,0,1,1,0,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,0,0,1,1,0,1],
    [0,0,1,0,0,1,0,1,1,0,1,0,1,0,1,1,0,0,1,1,0],
    [1,0,1,1,1,1,1,1,0,1,0,1,0,1,0,0,1,1,0,1,1],
    [0,1,0,1,0,0,0,1,1,0,1,0,1,1,1,0,1,0,1,0,0],
    [1,0,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,1,0,1,0,1,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,0,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,0,0,0,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,1,0,1,1,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,0,1,0,1,0,1]
];

function createPNG(size, filename) {
    const moduleSize = Math.floor(size / 21);
    const actualSize = moduleSize * 21;

    // Create PNG in memory using a simple approach
    // For a real implementation, we'd use a proper PNG encoder
    // But for simplicity, we'll create an SVG instead and document conversion

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${actualSize}" height="${actualSize}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${actualSize}" height="${actualSize}" fill="white"/>
`;

    for (let row = 0; row < 21; row++) {
        for (let col = 0; col < 21; col++) {
            if (qrPattern[row][col] === 1) {
                const x = col * moduleSize;
                const y = row * moduleSize;
                svg += `    <rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>\n`;
            }
        }
    }

    svg += '</svg>';

    const svgFilename = filename.replace('.png', '.svg');
    fs.writeFileSync(svgFilename, svg);
    console.log(`✅ Generated: ${svgFilename} (${actualSize}x${actualSize})`);

    return svgFilename;
}

console.log('🎨 Generating QR code favicons with text: "Hi"\n');

const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' }
];

sizes.forEach(({ size, name }) => {
    createPNG(size, name);
});

console.log('\n✅ SVG favicons generated!');
console.log('\n📝 To convert to PNG:');
console.log('   Open each .svg file in a browser');
console.log('   Take a screenshot or use an online converter');
console.log('   Or use ImageMagick: convert favicon-32x32.svg favicon-32x32.png');
console.log('\n💡 Or just use the SVG files - modern browsers support them as favicons!');
