"use client";

import { ZoomIn, Palette, Eraser, Sparkles } from "lucide-react";
import ToolCard from "@/components/ui/ToolCard";
import { useImageStore } from "@/store/imageStore";
import type { ToolId } from "@/store/imageStore";

const TOOLS: {
  id: ToolId;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: "violet" | "emerald" | "amber" | "sky";
  accentColor: "violet" | "emerald" | "amber" | "sky";
}[] = [
  {
    id: "resize",
    icon: <ZoomIn size={22} />,
    title: "Redimensionar",
    description:
      "Cambia el ancho y alto de tus imágenes. Soporta múltiples modos de ajuste y mantiene la proporción automáticamente.",
    accentColor: "violet",
  },
  {
    id: "convert",
    icon: <Palette size={22} />,
    title: "Convertir formato",
    description:
      "Exporta a PNG, JPG, WebP, AVIF o TIFF con control de calidad. Ideal para optimizar imágenes para la web.",
    accentColor: "sky",
  },
  {
    id: "background",
    icon: <Eraser size={22} />,
    title: "Eliminar fondo",
    description:
      "Elimina el fondo de tus imágenes con IA directamente en el navegador. Sin coste de API, privado y rápido.",
    badge: "IA local",
    badgeColor: "emerald",
    accentColor: "emerald",
  },
  {
    id: "upscale",
    icon: <Sparkles size={22} />,
    title: "Mejorar con IA",
    description:
      "Super-resolución ×2, mejora automática de calidad y restauración de fotos antiguas vía Cloudinary AI.",
    badge: "Cloudinary",
    badgeColor: "amber",
    accentColor: "amber",
  },
];

export default function Dashboard() {
  const navigateTo = useImageStore((s) => s.navigateTo);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-default-200 dark:border-gray-800 bg-default-50 dark:bg-gray-900 px-4 py-1.5 text-xs text-default-500">
          <Sparkles size={12} className="text-violet-400" />
          Procesamiento en servidor y navegador
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
          Manipula tus{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            imágenes
          </span>
        </h1>
        <p className="text-default-500 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
          Elige la herramienta que necesitas, sube tu imagen y descarga el resultado al instante.
        </p>
      </div>

      {/* Tools grid */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-default-400 mb-4">
          Herramientas disponibles
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              badge={tool.badge}
              badgeColor={tool.badgeColor}
              accentColor={tool.accentColor}
              onClick={() => navigateTo(tool.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="grid gap-3 sm:grid-cols-3 text-center">
        {[
          { label: "Sin límite de uso", desc: "Procesa todas las imágenes que necesites" },
          { label: "Privacidad total", desc: "La IA de eliminación de fondo corre en tu navegador" },
          { label: "Open source", desc: "Next.js 16 · Sharp · @imgly/background-removal" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-default-200 dark:border-gray-800 bg-default-50 dark:bg-gray-900 px-4 py-5 space-y-1"
          >
            <p className="text-sm font-semibold text-foreground">{item.label}</p>
            <p className="text-xs text-default-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
