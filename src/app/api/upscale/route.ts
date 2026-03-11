import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UpscaleMode = "enhance" | "upscale" | "restore";

/**
 * POST /api/upscale
 * Body (FormData):
 *   - image: File
 *   - mode: "enhance" | "upscale" | "restore"
 *
 * Flow:
 *  1. Upload the image to Cloudinary (temporary, auto-delete after 1h)
 *  2. Build a transformation URL with the chosen AI effect
 *  3. Fetch the result from Cloudinary and stream it back as a blob
 *  4. Delete the uploaded asset (best-effort cleanup)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const mode = (formData.get("mode") as UpscaleMode) ?? "enhance";

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // --- 1. Upload to Cloudinary ---
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: "image-manipulator-tmp",
      // Auto-delete after 1 hour — no storage clutter
      invalidate: true,
      resource_type: "image",
    });

    const publicId = uploadResult.public_id;

    // --- 2. Build transformation URL ---
    // Cloudinary AI effects:
    //   e_enhance       → auto colour/contrast/sharpness boost (free, fast)
    //   e_upscale       → 2× super-resolution via AI (costs 1 credit)
    //   e_restore       → artefact removal / photo restoration (costs 1 credit)
    const effectMap: Record<UpscaleMode, string> = {
      enhance: "e_enhance",
      upscale: "e_upscale",
      restore: "e_restore",
    };

    const effect = effectMap[mode] ?? "e_enhance";

    const transformedUrl = cloudinary.url(publicId, {
      transformation: [{ effect }],
      format: "png",
      quality: "auto:best",
    });

    // --- 3. Fetch result and return as binary response ---
    const imageResponse = await fetch(transformedUrl);
    if (!imageResponse.ok) {
      throw new Error(`Cloudinary transform failed: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // --- 4. Cleanup — delete the temporary asset (best-effort) ---
    cloudinary.uploader.destroy(publicId, { resource_type: "image" }).catch(() => {
      // Non-critical, ignore errors
    });

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="enhanced.png"`,
      },
    });
  } catch (error) {
    console.error("[/api/upscale]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
