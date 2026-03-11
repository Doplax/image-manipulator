"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import { useImageStore } from "@/store/imageStore";
import DropZone from "@/components/DropZone";
import ImageGallery from "@/components/ImageGallery";
import PreviewPanel from "@/components/PreviewPanel";
import ProcessButton from "@/components/ProcessButton";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor?: "violet" | "emerald" | "sky";
  /** Panel de controles específico de la herramienta */
  controlPanel: React.ReactNode;
  /** Oculta el ProcessButton genérico (cuando el panel tiene sus propios controles) */
  hideProcessButton?: boolean;
}

const accentTitle = {
  violet: "from-violet-400 to-fuchsia-400",
  emerald: "from-emerald-400 to-teal-400",
  sky: "from-sky-400 to-blue-400",
};

export default function ToolLayout({
  title,
  description,
  icon,
  accentColor = "violet",
  controlPanel,
  hideProcessButton = false,
}: ToolLayoutProps) {
  const { navigateToDashboard, resetOptions } = useImageStore();

  const handleBack = () => {
    resetOptions();
    navigateToDashboard();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 rounded-xl border border-default-200 dark:border-gray-800 bg-default-50 dark:bg-gray-900 px-3 py-2 text-sm text-default-500 hover:text-foreground hover:border-default-400 transition-all"
        >
          <ArrowLeft size={14} />
          Volver
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-default-100 dark:bg-gray-800 text-foreground">
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className={`text-lg font-bold bg-gradient-to-r ${accentTitle[accentColor]} bg-clip-text text-transparent`}>
              {title}
            </h2>
            <p className="text-xs text-default-400 truncate">{description}</p>
          </div>
        </div>

        <button
          onClick={resetOptions}
          className="hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-default-400 hover:text-default-600 hover:bg-default-100 dark:hover:bg-gray-800 transition-all"
          title="Resetear opciones"
        >
          <RotateCcw size={12} />
          Resetear
        </button>
      </div>

      {/* Drop Zone */}
      <DropZone />

      {/* Gallery */}
      <ImageGallery />

      {/* Editor grid: preview | controls */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left: Preview + optional Process button */}
        <div className="space-y-4">
          <PreviewPanel />
          {!hideProcessButton && <ProcessButton />}
        </div>

        {/* Right: Tool-specific controls */}
        <div className="rounded-2xl border border-default-200 dark:border-gray-800 bg-default-50 dark:bg-gray-900 p-5">
          {controlPanel}
        </div>
      </div>
    </div>
  );
}
