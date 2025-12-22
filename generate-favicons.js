#!/usr/bin/env node

// Simple favicon generator for QR Code Generator
// Generates QR code favicons with "Hi" text

const https = require('https');
const fs = require('fs');
const path = require('path');

const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' }
];

const text = 'Hi';

console.log('🎨 Generating QR code favicons with text: "Hi"\n');

function downloadImage(size, filename) {
    return new Promise((resolve, reject) => {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=0`;

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filename);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`✅ Generated: ${filename} (${size}x${size})`);
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(filename, () => {});
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function generateAll() {
    try {
        for (const { size, name } of sizes) {
            await downloadImage(size, name);
        }
        console.log('\n🎉 All favicons generated successfully!');
        console.log('   Files created:');
        sizes.forEach(({ name }) => {
            console.log(`   - ${name}`);
        });
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

generateAll();
