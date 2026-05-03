# QR Code Generator

A polished Vite React app for creating custom QR codes with configurable content, colors, dot styles, finder markers, logo treatment, quiet zone, error correction, export sizing, and PNG/JPEG/WEBP downloads.

## Features

- Responsive dark interface with a live QR preview.
- Standard color palette plus custom color picker for QR styling.
- Dot, finder frame, and finder center shape presets.
- Logo upload with size and opacity controls.
- Adjustable quiet zone, export size, error correction level, file name, and download format.
- Client-side generation and export; no backend required.

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS
- Framer Motion
- react-colorful
- qrcode-generator

## Getting Started

Prerequisites:

- Node.js `^20.19.0` or `>=22.12.0`
- npm `>=10`

Install dependencies:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Configuration

The app reads these optional environment variables:

```env
VITE_APP_TITLE=QR Studio
VITE_DEFAULT_URL=https://example.com
VITE_LOGO_URL=
PORT=5173
```

`VITE_LOGO_URL` can point to a hosted image or a public asset such as `/logo.png`.

## Quality Checks

Run linting:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

## Publishing

The production build outputs static files to `dist/`. Deploy that directory to any static host such as Netlify, Vercel, Cloudflare Pages, GitHub Pages, or an S3-compatible bucket.

Local `.env` files, `node_modules`, and build output are intentionally ignored from git. Keep `.env.example` updated when configuration changes.
