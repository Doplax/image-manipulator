"use client";

import { Eraser } from "lucide-react";
import ToolLayout from "@/components/ui/ToolLayout";
import BackgroundPanel from "@/components/panels/BackgroundPanel";
import { useImageStore } from "@/store/imageStore";
import { useEffect } from "react";

export default function BackgroundTool() {
  const setRemoveBackground = useImageStore((s) => s.setRemoveBackground);

  // Activar removeBackground automáticamente al entrar a esta herramienta
  useEffect(() => {
    setRemoveBackground(true);
    return () => setRemoveBackground(false);
  }, [setRemoveBackground]);

  return (
    <ToolLayout
      title="Eliminar fondo con IA"
      description="Elimina el fondo de tus imágenes de forma automática usando WASM en el navegador"
      icon={<Eraser size={18} />}
      accentColor="emerald"
      controlPanel={<BackgroundPanel />}
    />
  );
}
