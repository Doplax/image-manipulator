"use client";

import { Sparkles } from "lucide-react";
import ToolLayout from "@/components/ui/ToolLayout";
import UpscalePanel from "@/components/panels/UpscalePanel";

export default function UpscaleTool() {
  return (
    <ToolLayout
      title="Mejorar con IA"
      description="Super-resolución, mejora de calidad y restauración de fotos via Cloudinary AI"
      icon={<Sparkles size={18} />}
      accentColor="emerald"
      controlPanel={<UpscalePanel />}
      hideProcessButton
    />
  );
}
