"use client";

import { useImageStore } from "@/store/imageStore";
import Dashboard from "@/components/Dashboard";
import ResizeTool from "@/components/tools/ResizeTool";
import ConvertTool from "@/components/tools/ConvertTool";
import BackgroundTool from "@/components/tools/BackgroundTool";
import UpscaleTool from "@/components/tools/UpscaleTool";

export default function AppShell() {
  const { view, activeTool } = useImageStore();

  if (view === "tool") {
    if (activeTool === "resize") return <ResizeTool />;
    if (activeTool === "convert") return <ConvertTool />;
    if (activeTool === "background") return <BackgroundTool />;
    if (activeTool === "upscale") return <UpscaleTool />;
  }

  return <Dashboard />;
}
