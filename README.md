# Zentopia QR Code Generator

A modern QR code generator for Zentopia Labs built with React, TypeScript, Vite, and Tailwind CSS. The application supports URLs, free-form text, contact vCards, WiFi credentials, and advanced styling customizations including captions and embedded logos.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at the address printed in the terminal (typically `http://localhost:5173`).

## Building for Production

```bash
npm run build
```

This command runs TypeScript type checking and produces a production build in the `dist` folder.

## Previewing the Production Build

```bash
npm run preview
```

## Environment Variables

The interface language can be overridden with the `VITE_APP_LOCALE` environment variable (e.g., `en-US` or `es-ES`). When unset, the app defaults to the browser locale.

```bash
VITE_APP_LOCALE=es-ES npm run dev
```
