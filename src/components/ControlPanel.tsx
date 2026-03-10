"use client";

import { useState } from "react";
import { Settings, ZoomIn, Palette, Eraser, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageStore } from "@/store/imageStore";
import type { ManipulationOptions, OutputFormat } from "@/types/image";

const OUTPUT_FORMATS: { value: OutputFormat; label: string; desc: string }[] = [
  { value: "png", label: "PNG", desc: "Sin pérdida, transparencia" },
  { value: "jpg", label: "JPG", desc: "Alta compatibilidad" },
  { value: "webp", label: "WebP", desc: "Web optimizado" },
  { value: "avif", label: "AVIF", desc: "Máxima compresión" },
  { value: "tiff", label: "TIFF", desc: "Alta calidad" },
];

const FIT_OPTIONS: { value: ManipulationOptions["resize"]["fit"]; label: string }[] = [
  { value: "inside", label: "Dentro" },
  { value: "cover", label: "Cubrir" },
  { value: "contain", label: "Contener" },
  { value: "fill", label: "Rellenar" },
  { value: "outside", label: "Fuera" },
];

function Section({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-200 hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="px-4 pb-4 pt-1 space-y-3">{children}</div>}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-gray-400 mb-1">{children}</label>
  );
}

export default function ControlPanel() {
  const {
    selectedImage,
    options,
    setResizeWidth,
    setResizeHeight,
    setMaintainAspectRatio,
    setResizeFit,
    setOutputFormat,
    setQuality,
    setRemoveBackground,
    resetOptions,
  } = useImageStore();

  if (!selectedImage) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-800 p-8 text-center">
        <Settings size={32} className="text-gray-700" />
        <p className="text-sm text-gray-600">
          Selecciona una imagen para ver las opciones de edición
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <Settings size={16} /> Opciones de edición
        </h2>
        <button
          onClick={resetOptions}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Resetear
        </button>
      </div>

      {/* Resize */}
      <Section title="Redimensionar" icon={<ZoomIn size={16} />}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Ancho (px)</Label>
            <input
              type="number"
              min={1}
              max={8000}
              placeholder={selectedImage.width?.toString() ?? "auto"}
              value={options.resize.width ?? ""}
              onChange={(e) =>
                setResizeWidth(e.target.value ? parseInt(e.target.value) : undefined)
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-600 focus:border-violet-500 focus:outline-none"
            />
          </div>
          <div>
            <Label>Alto (px)</Label>
            <input
              type="number"
              min={1}
              max={8000}
              placeholder={selectedImage.height?.toString() ?? "auto"}
              value={options.resize.height ?? ""}
              onChange={(e) =>
                setResizeHeight(e.target.value ? parseInt(e.target.value) : undefined)
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-600 focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="aspect-ratio"
            type="checkbox"
            checked={options.resize.maintainAspectRatio}
            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
            className="h-4 w-4 rounded border-gray-600 bg-gray-800 accent-violet-500"
          />
          <label htmlFor="aspect-ratio" className="text-xs text-gray-400 cursor-pointer">
            Mantener proporción
          </label>
        </div>

        <div>
          <Label>Modo de ajuste</Label>
          <select
            value={options.resize.fit}
            onChange={(e) =>
              setResizeFit(e.target.value as ManipulationOptions["resize"]["fit"])
            }
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-violet-500 focus:outline-none"
          >
            {FIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </Section>

      {/* Background Removal */}
      <Section title="Quitar fondo" icon={<Eraser size={16} />}>
        <div className="flex items-start gap-3">
          <input
            id="remove-bg"
            type="checkbox"
            checked={options.removeBackground}
            onChange={(e) => setRemoveBackground(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-800 accent-violet-500"
          />
          <label htmlFor="remove-bg" className="text-xs text-gray-400 cursor-pointer leading-relaxed">
            Eliminar fondo con IA (procesado en el navegador con{" "}
            <span className="text-violet-400">@imgly/background-removal</span>)
          </label>
        </div>
        {options.removeBackground && (
          <p className="rounded-lg bg-amber-900/30 border border-amber-800/50 px-3 py-2 text-xs text-amber-300">
            ⚡ El primer uso descarga el modelo de IA (~50 MB). El resultado se exportará en PNG para preservar la transparencia.
          </p>
        )}
      </Section>

      {/* Format & Quality */}
      <Section title="Formato de salida" icon={<Palette size={16} />}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {OUTPUT_FORMATS.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => setOutputFormat(fmt.value)}
              title={fmt.desc}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-mono font-semibold transition-all",
                options.convert.format === fmt.value
                  ? "border-violet-500 bg-violet-500/20 text-violet-300"
                  : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-200"
              )}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {options.convert.format !== "png" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Calidad</Label>
              <span className="text-xs text-violet-400 font-mono">{options.convert.quality}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={options.convert.quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Menor peso</span>
              <span>Mayor calidad</span>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
