"use client";

import { useImageStore } from "@/store/imageStore";
import type { ManipulationOptions } from "@/types/image";

const FIT_OPTIONS: { value: ManipulationOptions["resize"]["fit"]; label: string }[] = [
  { value: "inside", label: "Dentro" },
  { value: "cover", label: "Cubrir" },
  { value: "contain", label: "Contener" },
  { value: "fill", label: "Rellenar" },
  { value: "outside", label: "Fuera" },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-default-400 mb-1">{children}</label>
  );
}

export default function ResizePanel() {
  const {
    selectedImage,
    options,
    setResizeWidth,
    setResizeHeight,
    setMaintainAspectRatio,
    setResizeFit,
  } = useImageStore();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Ancho (px)</Label>
          <input
            type="number"
            min={1}
            max={8000}
            placeholder={selectedImage?.width?.toString() ?? "auto"}
            value={options.resize.width ?? ""}
            onChange={(e) =>
              setResizeWidth(e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="w-full rounded-xl border border-default-200 dark:border-gray-700 bg-default-100 dark:bg-gray-800 px-3 py-2 text-sm text-foreground placeholder:text-default-400 focus:border-violet-500 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <Label>Alto (px)</Label>
          <input
            type="number"
            min={1}
            max={8000}
            placeholder={selectedImage?.height?.toString() ?? "auto"}
            value={options.resize.height ?? ""}
            onChange={(e) =>
              setResizeHeight(e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="w-full rounded-xl border border-default-200 dark:border-gray-700 bg-default-100 dark:bg-gray-800 px-3 py-2 text-sm text-foreground placeholder:text-default-400 focus:border-violet-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={options.resize.maintainAspectRatio}
          onChange={(e) => setMaintainAspectRatio(e.target.checked)}
          className="h-4 w-4 rounded border-gray-600 bg-gray-800 accent-violet-500"
        />
        <span className="text-sm text-default-500">Mantener proporción</span>
      </label>

      <div>
        <Label>Modo de ajuste</Label>
        <select
          value={options.resize.fit}
          onChange={(e) =>
            setResizeFit(e.target.value as ManipulationOptions["resize"]["fit"])
          }
          className="w-full rounded-xl border border-default-200 dark:border-gray-700 bg-default-100 dark:bg-gray-800 px-3 py-2 text-sm text-foreground focus:border-violet-500 focus:outline-none transition-colors"
        >
          {FIT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
