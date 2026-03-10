# Image Manipulator - Copilot Instructions

## Project Overview
A fullstack Next.js 16 image manipulation app optimized for Vercel deployment.

## Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Server-side image processing**: Sharp (Node.js API routes)
- **Client-side background removal**: @imgly/background-removal (WASM/AI)
- **Drag & Drop**: react-dropzone
- **Icons**: lucide-react

## Architecture
- `src/app/page.tsx` — Main page (Server Component shell, client children)
- `src/app/api/process/route.ts` — Image processing API (resize + format convert)
- `src/components/` — All UI components (client-side)
- `src/store/imageStore.ts` — Zustand global state
- `src/types/image.ts` — TypeScript types
- `src/lib/utils.ts` — Utility functions

## Features
1. Drag & drop multiple images (react-dropzone)
2. Image gallery with selection
3. Resize with aspect ratio control
4. Background removal via AI (client-side WASM, no API cost)
5. Format conversion: PNG, JPG, WebP, AVIF, TIFF
6. Quality control for lossy formats
7. Side-by-side preview (original vs processed)
8. One-click download

## Coding Conventions
- All interactive components use `"use client"` directive
- Page components are Server Components
- Use `cn()` utility for conditional class names
- API routes use `export const runtime = "nodejs"`
- Sharp is server-only (listed in `serverExternalPackages`)
