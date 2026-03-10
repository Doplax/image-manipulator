"use client";

import { ZoomIn } from "lucide-react";
import ToolLayout from "@/components/ui/ToolLayout";
import ResizePanel from "@/components/panels/ResizePanel";

export default function ResizeTool() {
  return (
    <ToolLayout
      title="Redimensionar imagen"
      description="Cambia el tamaño manteniendo o ignorando la proporción original"
      icon={<ZoomIn size={18} />}
      accentColor="violet"
      controlPanel={<ResizePanel />}
    />
  );
}
