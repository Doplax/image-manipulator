import { ImageIcon, Github, Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <ImageIcon size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">Image Manipulator</h1>
            <p className="text-xs text-gray-500 leading-none mt-0.5">
              Redimensiona · Quita fondos · Convierte
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400">
            <Zap size={12} className="text-amber-400" />
            Next.js 16 · Vercel Ready
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            <Github size={14} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
