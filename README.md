# 🖼️ Image Manipulator

> Fullstack image manipulation app built with **Next.js 16**, optimized for **Vercel** deployment.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Vercel Ready](https://img.shields.io/badge/Vercel-Ready-000?logo=vercel)

## ✨ Features

| Feature | Technology |
|---|---|
| 🖱️ Drag & drop images | `react-dropzone` |
| 📐 Resize with aspect ratio | `sharp` (server-side) |
| 🪄 Background removal (AI) | `@imgly/background-removal` (WASM, client-side) |
| 🎨 Format conversion | `sharp` — PNG, JPG, WebP, AVIF, TIFF |
| 📊 Quality control | Range slider for lossy formats |
| 👁️ Side-by-side preview | Original vs processed |
| ⬇️ One-click download | Browser Blob API |

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/process/route.ts    # Image processing API (sharp)
│   ├── page.tsx                # Main page (Server Component)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── DropZone.tsx            # Drag & drop zone
│   ├── ImageGallery.tsx        # Thumbnail grid
│   ├── ControlPanel.tsx        # Resize / format / quality options
│   ├── PreviewPanel.tsx        # Before/after preview
│   └── ProcessButton.tsx       # Process + download actions
├── store/
│   └── imageStore.ts           # Zustand global state
├── types/
│   └── image.ts                # TypeScript types
└── lib/
    └── utils.ts                # cn(), formatFileSize(), fileToImageFile()
```

## 🚢 Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/image-manipulator)

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Deploy — zero config needed

## 📦 Stack

- **Next.js 16** — App Router, Server Components
- **TypeScript 5** — Full type safety
- **Tailwind CSS v4** — Utility-first styling
- **Zustand** — Lightweight global state
- **Sharp** — High-performance server-side image processing
- **@imgly/background-removal** — Client-side AI background removal (WASM)
- **react-dropzone** — Drag & drop file handling
- **lucide-react** — Icons

## 📝 Notes

- Background removal uses a WASM model (~50 MB downloaded on first use, cached by browser)
- Maximum upload size: 25 MB per image
- Sharp runs exclusively on the server (Node.js API route)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
