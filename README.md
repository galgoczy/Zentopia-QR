# Zentopia QR Code Generator

A fully client-side QR code generator for Zentopia Labs that runs without any build tooling or external package installs. The app supports URLs, free-form text, contact vCards, and WiFi credentials while offering extensive styling controls such as custom colors, rounded modules, embedded logos, and captions.

## Features

- Locale-aware interface with English and Spanish translations detected from the browser.
- Multiple QR content types: URL, text, contact (vCard), and WiFi network credentials.
- Advanced presentation controls including module shape, finder color, border style, captions, and center logos.
- High-resolution PNG and SVG export plus one-click data copy.
- Privacy-friendly: all work happens in the browser—no data is sent to a server.

## Running the app locally

No dependency installation is required. Serve the project directory with any static file server. For example, using Python:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser. The interface will automatically render once the page loads.

## Locale override

The page defaults to the browser locale. To force a specific language, update the `data-app-locale` attribute on the `<html>` tag inside `index.html` (e.g., `data-app-locale="es-ES"`). Leave the placeholder `{{APP_LOCALE}}` intact if you want runtime detection.

## Project structure

```
├── assets
│   ├── css
│   │   └── main.css        # Custom layout, typography, and component styling
│   └── js
│       ├── i18n.js         # Translation bundles and helpers
│       ├── main.js         # UI state management and event wiring
│       ├── render.js       # Canvas/SVG rendering utilities
│       ├── download.js     # Export helpers for PNG and SVG assets
│       └── qr
│           └── encoder.js  # Self-contained QR code encoder
└── index.html              # Application shell and semantic markup
```

## Browser support

The generator targets modern evergreen browsers with ES modules support. All functionality (including canvas exports and clipboard actions) runs entirely client-side with no external dependencies.
