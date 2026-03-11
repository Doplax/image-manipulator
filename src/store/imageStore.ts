import { create } from "zustand";
import type { ImageFile, ManipulationOptions, OutputFormat } from "@/types/image";
import type { UpscaleMode } from "@/app/api/upscale/route";

export type ToolId = "resize" | "convert" | "background" | "upscale";
export type AppView = "dashboard" | "tool";

interface ImageStore {
  // Navigation
  view: AppView;
  activeTool: ToolId | null;
  navigateTo: (tool: ToolId) => void;
  navigateToDashboard: () => void;

  images: ImageFile[];
  selectedImage: ImageFile | null;
  isProcessing: boolean;
  processedUrl: string | null;
  options: ManipulationOptions;

  // Upscale-specific
  upscaleMode: UpscaleMode;
  setUpscaleMode: (mode: UpscaleMode) => void;

  addImages: (files: ImageFile[]) => void;
  removeImage: (id: string) => void;
  selectImage: (image: ImageFile | null) => void;
  setProcessing: (loading: boolean) => void;
  setProcessedUrl: (url: string | null) => void;
  clearProcessed: () => void;

  setResizeWidth: (width: number | undefined) => void;
  setResizeHeight: (height: number | undefined) => void;
  setMaintainAspectRatio: (value: boolean) => void;
  setResizeFit: (fit: ManipulationOptions["resize"]["fit"]) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
  setRemoveBackground: (value: boolean) => void;
  resetOptions: () => void;
}

const defaultOptions: ManipulationOptions = {
  resize: {
    width: undefined,
    height: undefined,
    maintainAspectRatio: true,
    fit: "inside",
  },
  convert: {
    format: "png",
    quality: 90,
  },
  removeBackground: false,
};

export const useImageStore = create<ImageStore>((set) => ({
  // Navigation
  view: "dashboard",
  activeTool: null,
  navigateTo: (tool) => set({ view: "tool", activeTool: tool, images: [], selectedImage: null, processedUrl: null }),
  navigateToDashboard: () => set({ view: "dashboard", activeTool: null, images: [], selectedImage: null, processedUrl: null }),

  images: [],
  selectedImage: null,
  isProcessing: false,
  processedUrl: null,
  options: { ...defaultOptions, resize: { ...defaultOptions.resize }, convert: { ...defaultOptions.convert } },

  upscaleMode: "improve",
  setUpscaleMode: (mode) => set({ upscaleMode: mode }),

  addImages: (files) =>
    set((state) => ({ images: [...state.images, ...files] })),

  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
      selectedImage: state.selectedImage?.id === id ? null : state.selectedImage,
    })),

  selectImage: (image) => set({ selectedImage: image, processedUrl: null }),

  setProcessing: (loading) => set({ isProcessing: loading }),

  setProcessedUrl: (url) => set({ processedUrl: url }),

  clearProcessed: () => set({ processedUrl: null }),

  setResizeWidth: (width) =>
    set((state) => ({
      options: { ...state.options, resize: { ...state.options.resize, width } },
    })),

  setResizeHeight: (height) =>
    set((state) => ({
      options: { ...state.options, resize: { ...state.options.resize, height } },
    })),

  setMaintainAspectRatio: (value) =>
    set((state) => ({
      options: {
        ...state.options,
        resize: { ...state.options.resize, maintainAspectRatio: value },
      },
    })),

  setResizeFit: (fit) =>
    set((state) => ({
      options: { ...state.options, resize: { ...state.options.resize, fit } },
    })),

  setOutputFormat: (format) =>
    set((state) => ({
      options: { ...state.options, convert: { ...state.options.convert, format } },
    })),

  setQuality: (quality) =>
    set((state) => ({
      options: { ...state.options, convert: { ...state.options.convert, quality } },
    })),

  setRemoveBackground: (value) =>
    set((state) => ({ options: { ...state.options, removeBackground: value } })),

  resetOptions: () =>
    set({
      options: {
        ...defaultOptions,
        resize: { ...defaultOptions.resize },
        convert: { ...defaultOptions.convert },
      },
    }),
}));
