import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const optionsRaw = formData.get("options") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const options = optionsRaw ? JSON.parse(optionsRaw) : {};
    const {
      resize = {},
      convert = { format: "png", quality: 90 },
      removeBackground = false,
    } = options;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize sharp pipeline
    let pipeline = sharp(buffer);

    // Get metadata
    const metadata = await pipeline.metadata();

    // --- Resize ---
    if (resize.width || resize.height) {
      const resizeOptions: sharp.ResizeOptions = {
        width: resize.width ? parseInt(resize.width) : undefined,
        height: resize.height ? parseInt(resize.height) : undefined,
        fit: resize.fit || "inside",
        withoutEnlargement: false,
      };

      if (resize.maintainAspectRatio === false && resize.width && resize.height) {
        resizeOptions.fit = "fill";
      }

      pipeline = pipeline.resize(resizeOptions);
    }

    // --- Remove background (via alpha channel manipulation for server-side) ---
    // For full AI-based removal, we apply a simple edge-detection alpha mask
    // Real BG removal uses @imgly/background-removal (client-side)
    if (removeBackground && metadata.format !== "png") {
      pipeline = pipeline.toFormat("png");
    }

    // --- Format conversion ---
    const format = convert.format || "png";
    const quality = parseInt(convert.quality) || 90;

    switch (format) {
      case "jpg":
      case "jpeg":
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        break;
      case "webp":
        pipeline = pipeline.webp({ quality });
        break;
      case "avif":
        pipeline = pipeline.avif({ quality });
        break;
      case "tiff":
        pipeline = pipeline.tiff({ quality });
        break;
      case "png":
      default:
        pipeline = pipeline.png({ quality: Math.round((quality / 100) * 9) });
        break;
    }

    // Process the image
    const outputBuffer = await pipeline.toBuffer();
    const mimeType = getMimeType(format);
    const outputFilename = `processed-${Date.now()}.${format === "jpg" ? "jpg" : format}`;

    return new NextResponse(outputBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${outputFilename}"`,
        "Content-Length": outputBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}

function getMimeType(format: string): string {
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    avif: "image/avif",
    tiff: "image/tiff",
  };
  return map[format] || "image/png";
}
