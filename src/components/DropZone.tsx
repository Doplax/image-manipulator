"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardBody, Chip } from "@heroui/react";
import { UploadCloud, ImageIcon } from "lucide-react";
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

const FORMATS = ["PNG", "JPG", "WebP", "AVIF", "TIFF", "GIF", "BMP"];

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
    maxSize: 25 * 1024 * 1024,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "cursor-pointer transition-all duration-200 border-2 border-dashed",
        isDragActive && !isDragReject
          ? "border-primary bg-primary/5 scale-[1.005]"
          : isDragReject
          ? "border-danger bg-danger/5"
          : "border-default-300 hover:border-default-500 hover:bg-default-100/50"
      )}
      shadow="none"
    >
      <CardBody className="flex flex-col items-center justify-center gap-5 py-14 px-6">
        <input {...getInputProps()} />

        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
            isDragActive && !isDragReject
              ? "bg-primary/15 text-primary"
              : isDragReject
              ? "bg-danger/15 text-danger"
              : "bg-default-100 text-default-500"
          )}
        >
          {isDragActive ? (
            <ImageIcon size={30} />
          ) : (
            <UploadCloud size={30} />
          )}
        </div>

        <div className="text-center">
          {isDragReject ? (
            <p className="text-danger font-semibold">Formato no soportado</p>
          ) : isDragActive ? (
            <p className="text-primary font-semibold text-lg">¡Suelta las imágenes aquí!</p>
          ) : (
            <>
              <p className="font-semibold text-foreground text-lg">
                Arrastra tus imágenes aquí
              </p>
              <p className="text-default-400 text-sm mt-1">
                o <span className="text-primary cursor-pointer underline underline-offset-2">haz clic para explorar</span>
              </p>
            </>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {FORMATS.map((fmt) => (
            <Chip key={fmt} size="sm" variant="flat" className="text-xs font-mono">
              {fmt}
            </Chip>
          ))}
        </div>

        <p className="text-default-400 text-xs">Máximo 25 MB por imagen</p>
      </CardBody>
    </Card>
  );
}
