"use client";

import { Sparkles } from "lucide-react";
import ToolLayout from "@/components/ui/ToolLayout";
import UpscalePanel, { UpscaleProcessButton } from "@/components/panels/UpscalePanel";

export default function UpscaleTool() {
  return (
    <ToolLayout
      title="Mejorar con IA"
      description="Super-resolución, mejora de calidad y restauración de fotos vía Cloudinary AI"
      icon={<Sparkles size={18} />}
      accentColor="emerald"
      controlPanel={<UpscalePanel />}
      processButton={<UpscaleProcessButton />}
    />
  );
}
