"use client";

import { useState } from "react";
import { Wand2, Download, Loader2 } from "lucide-react";
import { useImageStore } from "@/store/imageStore";
import { dataUrlToBlob } from "@/lib/utils";
import { removeBackground } from "@imgly/background-removal";

export default function ProcessButton() {
  const {
    selectedImage,
    options,
    isProcessing,
    processedUrl,
    setProcessing,
    setProcessedUrl,
  } = useImageStore();

  const [progress, setProgress] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!selectedImage) return;
    setProcessing(true);
    setProcessedUrl(null);

    try {
      let imageBlob: Blob;

      // Step 1: Background removal (client-side AI)
      if (options.removeBackground) {
        setProgress("Eliminando fondo con IA...");
        const sourceBlob = dataUrlToBlob(selectedImage.dataUrl);
        imageBlob = await removeBackground(sourceBlob, {
          progress: (key: string, current: number, total: number) => {
            if (key === "compute:inference") {
              setProgress(`Procesando IA: ${Math.round((current / total) * 100)}%`);
            }
          },
        });
      } else {
        imageBlob = dataUrlToBlob(selectedImage.dataUrl);
      }

      // Step 2: Server-side processing (resize + format conversion)
      setProgress("Aplicando transformaciones...");
      const formData = new FormData();
      formData.append("image", imageBlob, selectedImage.name);
      formData.append(
        "options",
        JSON.stringify({
          resize: options.resize,
          convert: {
            format: options.removeBackground ? "png" : options.convert.format,
            quality: options.convert.quality,
          },
          removeBackground: false, // already handled client-side
        })
      );

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al procesar la imagen");
      }

      const resultBlob = await response.blob();
      const url = URL.createObjectURL(resultBlob);
      setProcessedUrl(url);
    } catch (error) {
      console.error("Processing error:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const handleDownload = () => {
    if (!processedUrl || !selectedImage) return;
    const format = options.removeBackground ? "png" : options.convert.format;
    const baseName = selectedImage.originalName.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = `${baseName}-processed.${format}`;
    link.click();
  };

  if (!selectedImage) return null;

  return (
    <div className="flex gap-3">
      <button
        onClick={handleProcess}
        disabled={isProcessing}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {progress ?? "Procesando..."}
          </>
        ) : (
          <>
            <Wand2 size={18} />
            Procesar imagen
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
