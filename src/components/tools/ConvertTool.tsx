"use client";

import { Palette } from "lucide-react";
import ToolLayout from "@/components/ui/ToolLayout";
import FormatPanel, { ConvertProcessButton } from "@/components/panels/FormatPanel";

export default function ConvertTool() {
  return (
    <ToolLayout
      title="Convertir formato"
      description="Convierte entre PNG, JPG, WebP, AVIF y TIFF con control de calidad"
      icon={<Palette size={18} />}
      accentColor="sky"
      controlPanel={<FormatPanel />}
      processButton={<ConvertProcessButton />}
    />
  );
}
