"use client";

import { useImageStore } from "@/store/imageStore";

export default function BackgroundPanel() {
  const { options, setRemoveBackground } = useImageStore();

  return (
    <div className="space-y-4">
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={options.removeBackground}
          onChange={(e) => setRemoveBackground(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-800 accent-emerald-500"
        />
        <div className="space-y-1">
          <span className="text-sm font-medium text-foreground">Activar eliminación de fondo</span>
          <p className="text-xs text-default-500 leading-relaxed">
            Procesado en el navegador con{" "}
            <span className="text-emerald-400 font-medium">@imgly/background-removal</span>{" "}
            — sin coste de API.
          </p>
        </div>
      </label>

      {options.removeBackground && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 space-y-1">
          <p className="text-xs font-semibold text-amber-400">⚡ Primera ejecución</p>
          <p className="text-xs text-amber-300/80 leading-relaxed">
            El primer uso descarga el modelo de IA (~50 MB). El resultado se exportará en{" "}
            <strong>PNG</strong> para conservar la transparencia.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-default-200 dark:border-gray-800 bg-default-50 dark:bg-gray-900/50 px-4 py-3 space-y-2">
        <p className="text-xs font-semibold text-default-600">¿Cómo funciona?</p>
        <ul className="text-xs text-default-400 space-y-1 leading-relaxed">
          <li>1. Sube la imagen con el fondo a eliminar</li>
          <li>2. El modelo de IA detecta el sujeto automáticamente</li>
          <li>3. Descarga el resultado en PNG transparente</li>
        </ul>
      </div>
    </div>
  );
}
