export type OutputFormat = "png" | "jpg" | "webp" | "avif" | "tiff";

export interface ImageFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  dataUrl: string;
  width?: number;
  height?: number;
}

export interface ResizeOptions {
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  fit: "cover" | "contain" | "fill" | "inside" | "outside";
}

export interface ConvertOptions {
  format: OutputFormat;
  quality: number;
}

export interface BackgroundRemovalOptions {
  enabled: boolean;
}

export interface ManipulationOptions {
  resize: ResizeOptions;
  convert: ConvertOptions;
  removeBackground: boolean;
}

export interface ProcessingResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}
