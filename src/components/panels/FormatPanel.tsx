"use client";

import { useImageStore } from "@/store/imageStore";
import { cn } from "@/lib/utils";
import type { OutputFormat } from "@/types/image";
import { useState } from "react";
import { Palette, Download, Loader2 } from "lucide-react";

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

// ─── Botón de conversión ──────────────────────────────────────────────────────

export function ConvertProcessButton() {
  const {
    selectedImage,
    options,
    isProcessing,
    processedUrl,
    setProcessing,
    setProcessedUrl,
  } = useImageStore();

  const [progress, setProgress] = useState<string | null>(null);

  if (!selectedImage) return null;

  const format = options.convert.format;

  const handleConvert = async () => {
    setProcessing(true);
    setProcessedUrl(null);
    setProgress("Convirtiendo imagen...");

    try {
      const res = await fetch(selectedImage.dataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("image", blob, selectedImage.name);
      formData.append(
        "options",
        JSON.stringify({
          resize: {},
          convert: { format, quality: options.convert.quality },
          removeBackground: false,
        })
      );

      const response = await fetch("/api/process", { method: "POST", body: formData });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al convertir la imagen");
      }

      const resultBlob = await response.blob();
      setProcessedUrl(URL.createObjectURL(resultBlob));
    } catch (error) {
      console.error("[ConvertProcessButton]", error);
      alert(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const handleDownload = () => {
    if (!processedUrl || !selectedImage) return;
    const baseName = selectedImage.originalName.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = `${baseName}.${format === "jpg" ? "jpg" : format}`;
    link.click();
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleConvert}
        disabled={isProcessing}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {progress ?? "Convirtiendo..."}
          </>
        ) : (
          <>
            <Palette size={18} />
            Convertir a {format.toUpperCase()}
          </>
        )}
      </button>

      {processedUrl && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500 active:scale-[0.98]"
        >
          <Download size={18} />
          Descargar
        </button>
      )}
    </div>
  );
}
