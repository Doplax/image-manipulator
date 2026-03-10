"use client";

import Image from "next/image";
import { ArrowRight, ImageIcon } from "lucide-react";
import { useImageStore } from "@/store/imageStore";

export default function PreviewPanel() {
  const { selectedImage, processedUrl, options } = useImageStore();

  if (!selectedImage) return null;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <ImageIcon size={16} /> Vista previa
        </h3>
        {processedUrl && (
          <span className="rounded-full bg-emerald-900/40 border border-emerald-700/50 px-2 py-0.5 text-xs text-emerald-400 font-medium">
            ✓ Listo
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Original */}
          <div className="flex-1">
            <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Original
            </p>
            <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-square">
              <Image
                src={selectedImage.dataUrl}
                alt="Original"
                fill
                className="object-contain"
                sizes="300px"
                unoptimized
              />
              {/* Checkerboard */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  backgroundImage:
                    "repeating-conic-gradient(#555 0% 25%, #333 0% 50%)",
                  backgroundSize: "16px 16px",
                }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-500 space-y-0.5">
              <p className="truncate font-medium text-gray-400">{selectedImage.originalName}</p>
              {selectedImage.width && selectedImage.height && (
                <p>{selectedImage.width} × {selectedImage.height} px</p>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center self-center sm:pt-8">
            <ArrowRight size={20} className="text-gray-600 rotate-90 sm:rotate-0" />
          </div>

          {/* Processed */}
          <div className="flex-1">
            <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resultado
            </p>
            <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-square">
              {processedUrl ? (
                <Image
                  src={processedUrl}
                  alt="Processed"
                  fill
                  className="object-contain"
                  sizes="300px"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-gray-600 text-center px-4">
                    Haz clic en &quot;Procesar imagen&quot; para ver el resultado
                  </p>
                </div>
              )}
              {/* Checkerboard */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  backgroundImage:
                    "repeating-conic-gradient(#555 0% 25%, #333 0% 50%)",
                  backgroundSize: "16px 16px",
                }}
              />
            </div>
            {processedUrl && (
              <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                <p className="font-medium text-emerald-400">Imagen procesada</p>
                <p>
                  Formato: <span className="font-mono text-gray-300">
                    {options.removeBackground ? "PNG" : options.convert.format.toUpperCase()}
                  </span>
                  {!options.removeBackground && options.convert.format !== "png" && (
                    <> · Calidad: <span className="font-mono text-gray-300">{options.convert.quality}%</span></>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
