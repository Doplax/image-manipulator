"use client";

import { Sparkles, ZoomIn, Wand2, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageStore } from "@/store/imageStore";
import type { UpscaleMode } from "@/app/api/upscale/route";
import { useState } from "react";

const MODES: {
  value: UpscaleMode;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}[] = [
  {
    value: "improve",
    label: "Mejorar calidad",
    description: "Ajuste automático de color, contraste y nitidez mediante IA.",
    icon: <Sparkles size={18} />,
  },
  {
    value: "upscale",
    label: "Super-resolución ×2",
    description: "Duplica la resolución manteniendo nitidez máxima con IA.",
    icon: <ZoomIn size={18} />,
    badge: "1 crédito",
  },
  {
    value: "restore",
    label: "Restaurar foto",
    description: "Elimina artefactos, ruido y deterioro de fotos antiguas.",
    icon: <Wand2 size={18} />,
    badge: "1 crédito",
  },
];

export default function UpscalePanel() {
  const { upscaleMode, setUpscaleMode } = useImageStore();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-default-400 mb-3">
          Modo de mejora
        </p>
        <div className="space-y-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setUpscaleMode(m.value)}
              className={cn(
                "w-full flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-150",
                upscaleMode === m.value
                  ? "border-emerald-500/60 bg-emerald-500/10"
                  : "border-default-200 dark:border-gray-700 hover:border-default-400 dark:hover:border-gray-500 bg-default-50 dark:bg-gray-900/50"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  upscaleMode === m.value
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-default-100 dark:bg-gray-800 text-default-500"
                )}
              >
                {m.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{m.label}</span>
                  {m.badge && (
                    <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-default-400 mt-0.5 leading-relaxed">{m.description}</p>
              </div>
              <span
                className={cn(
                  "mt-1 h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
                  upscaleMode === m.value
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-default-300 dark:border-gray-600"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-default-200 dark:border-gray-800 bg-default-50 dark:bg-gray-900/50 px-4 py-3 space-y-1">
        <p className="text-xs font-semibold text-default-500">Procesado vía Cloudinary AI</p>
        <p className="text-xs text-default-400 leading-relaxed">
          La imagen se sube temporalmente, se procesa y se elimina del servidor automáticamente.{" "}
          Plan gratuito: 25 créditos/mes.
        </p>
      </div>
    </div>
  );
}

// ─── Botones de acción (se renderizan debajo del preview en ToolLayout) ───────

export function UpscaleProcessButton() {
  const {
    selectedImage,
    setProcessing,
    setProcessedUrl,
    isProcessing,
    processedUrl,
    upscaleMode,
  } = useImageStore();
  const [progress, setProgress] = useState<string | null>(null);

  if (!selectedImage) return null;

  const handleProcess = async () => {
    setProcessing(true);
    setProcessedUrl(null);
    setProgress("Subiendo imagen a Cloudinary...");

    try {
      const res = await fetch(selectedImage.dataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("image", blob, selectedImage.name);
      formData.append("mode", upscaleMode);

      setProgress("Aplicando mejora con IA...");

      const response = await fetch("/api/upscale", { method: "POST", body: formData });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al procesar la imagen");
      }

      const resultBlob = await response.blob();
      setProcessedUrl(URL.createObjectURL(resultBlob));
    } catch (error) {
      console.error("[UpscaleProcessButton]", error);
      alert(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const baseName = selectedImage.originalName.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = `${baseName}-${upscaleMode}.png`;
    link.click();
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleProcess}
        disabled={isProcessing}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {progress ?? "Procesando..."}
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Mejorar imagen
          </>
        )}
      </button>

      {processedUrl && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-sky-500 active:scale-[0.98]"
        >
          <Download size={18} />
          Descargar
        </button>
      )}
    </div>
  );
}
