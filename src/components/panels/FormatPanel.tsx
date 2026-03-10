"use client";

import { useImageStore } from "@/store/imageStore";
import { cn } from "@/lib/utils";
import type { OutputFormat } from "@/types/image";

const OUTPUT_FORMATS: { value: OutputFormat; label: string; desc: string }[] = [
  { value: "png", label: "PNG", desc: "Sin pérdida, transparencia" },
  { value: "jpg", label: "JPG", desc: "Alta compatibilidad" },
  { value: "webp", label: "WebP", desc: "Web optimizado" },
  { value: "avif", label: "AVIF", desc: "Máxima compresión" },
  { value: "tiff", label: "TIFF", desc: "Alta calidad" },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-default-400 mb-1">{children}</label>
  );
}

export default function FormatPanel() {
  const { options, setOutputFormat, setQuality } = useImageStore();

  return (
    <div className="space-y-4">
      <div>
        <Label>Formato de salida</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {OUTPUT_FORMATS.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => setOutputFormat(fmt.value)}
              title={fmt.desc}
              className={cn(
                "rounded-xl border px-2 py-2.5 text-xs font-mono font-semibold transition-all",
                options.convert.format === fmt.value
                  ? "border-sky-500 bg-sky-500/15 text-sky-400"
                  : "border-default-200 dark:border-gray-700 bg-default-100 dark:bg-gray-800 text-default-500 hover:border-default-400 hover:text-foreground"
              )}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {options.convert.format !== "png" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Calidad</Label>
            <span className="text-xs text-sky-400 font-mono font-semibold">{options.convert.quality}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={options.convert.quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-xs text-default-400 mt-1">
            <span>Menor peso</span>
            <span>Mayor calidad</span>
          </div>
        </div>
      )}
    </div>
  );
}
