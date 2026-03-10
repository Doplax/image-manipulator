"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";
import { cn, fileToImageFile } from "@/lib/utils";
import { useImageStore } from "@/store/imageStore";

const ACCEPTED_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/bmp": [".bmp"],
  "image/tiff": [".tiff", ".tif"],
  "image/avif": [".avif"],
};

export default function DropZone() {
  const addImages = useImageStore((s) => s.addImages);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const imageFiles = await Promise.all(acceptedFiles.map(fileToImageFile));
      addImages(imageFiles);
    },
    [addImages]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: true,
    maxSize: 25 * 1024 * 1024, // 25 MB
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 transition-all duration-200 cursor-pointer select-none",
        isDragActive && !isDragReject
          ? "border-violet-400 bg-violet-500/10 scale-[1.01]"
          : isDragReject
          ? "border-red-400 bg-red-500/10"
          : "border-gray-700 bg-gray-900/50 hover:border-gray-500 hover:bg-gray-900"
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
          isDragActive && !isDragReject
            ? "bg-violet-500/20 text-violet-400"
            : isDragReject
            ? "bg-red-500/20 text-red-400"
            : "bg-gray-800 text-gray-400"
        )}
      >
        {isDragActive ? (
          <ImageIcon size={32} />
        ) : (
          <Upload size={32} />
        )}
      </div>

      <div className="text-center">
        {isDragReject ? (
          <p className="text-red-400 font-medium">Formato no soportado</p>
        ) : isDragActive ? (
          <p className="text-violet-400 font-medium text-lg">¡Suelta las imágenes aquí!</p>
        ) : (
          <>
            <p className="text-gray-200 font-semibold text-lg">
              Arrastra tus imágenes aquí
            </p>
            <p className="text-gray-500 text-sm mt-1">
              o haz clic para seleccionar archivos
            </p>
          </>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {["PNG", "JPG", "WEBP", "AVIF", "TIFF", "GIF", "BMP"].map((fmt) => (
          <span
            key={fmt}
            className="rounded-md bg-gray-800 px-2 py-0.5 text-xs font-mono text-gray-400"
          >
            {fmt}
          </span>
        ))}
      </div>

      <p className="text-gray-600 text-xs">Máximo 25 MB por imagen</p>
    </div>
  );
}
