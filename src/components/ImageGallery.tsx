"use client";

import Image from "next/image";
import { X, Check } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { useImageStore } from "@/store/imageStore";
import type { ImageFile } from "@/types/image";

export default function ImageGallery() {
  const { images, selectedImage, removeImage, selectImage } = useImageStore();

  if (images.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
        Imágenes cargadas ({images.length})
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            isSelected={selectedImage?.id === image.id}
            onSelect={() => selectImage(selectedImage?.id === image.id ? null : image)}
            onRemove={() => removeImage(image.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ImageCard({
  image,
  isSelected,
  onSelect,
  onRemove,
}: {
  image: ImageFile;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-150",
        isSelected
          ? "border-violet-500 shadow-lg shadow-violet-500/20"
          : "border-gray-800 hover:border-gray-600"
      )}
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-gray-900">
        <Image
          src={image.dataUrl}
          alt={image.name}
          fill
          className="object-cover"
          sizes="200px"
          unoptimized
        />
        {/* Checkerboard pattern for transparency hint */}
        <div className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage:
              "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%)",
            backgroundSize: "16px 16px",
          }}
        />
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500">
          <Check size={12} />
        </div>
      )}

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600 hover:text-white"
        title="Eliminar"
      >
        <X size={12} />
      </button>

      {/* File info */}
      <div className="bg-gray-900 px-2 py-1.5">
        <p className="truncate text-xs font-medium text-gray-200">{image.name}</p>
        <p className="text-xs text-gray-500">
          {image.width && image.height
            ? `${image.width}×${image.height} · `
            : ""}
          {formatFileSize(image.size)}
        </p>
      </div>
    </div>
  );
}
