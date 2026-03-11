import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const maxDuration = 120;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UpscaleMode = "improve" | "upscale" | "restore";

/**
 * Cloudinary AI effects by plan:
 *   e_improve        → FREE — auto colour/contrast/sharpness (replaces e_enhance)
 *   e_upscale        → PAID add-on — 2× super-resolution
 *   e_restore        → PAID add-on — artefact/noise removal
 *
 * Strategy: apply the transformation as an "eager" transformation at upload time.
 * This forces Cloudinary to process it server-side with proper auth and returns
 * a signed URL — avoiding the "Bad Request" from unsigned delivery URLs.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const mode = (formData.get("mode") as UpscaleMode) ?? "improve";

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const effectMap: Record<UpscaleMode, string> = {
      improve: "improve",      // free — e_improve
      upscale: "upscale",      // paid add-on — e_upscale
      restore: "restore",      // paid add-on — e_restore
    };

    const effect = effectMap[mode] ?? "improve";

    // --- 1. Upload + eager transform in one call ---
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: "image-manipulator-tmp",
      resource_type: "image",
      // Apply the AI effect eagerly during upload — generates a signed delivery URL
      eager: [{ effect: `e_${effect}`, format: "png", quality: "auto:best" }],
      eager_async: false, // wait for eager transformation to complete
    });

    // --- 2. Get the eager result URL ---
    const eagerResult = uploadResult.eager?.[0];
    const publicId = uploadResult.public_id;

    if (!eagerResult?.secure_url) {
      // Fallback: build URL via SDK (works if unsigned transformations are enabled)
      const fallbackUrl = cloudinary.url(publicId, {
        transformation: [{ effect: `e_${effect}` }],
        format: "png",
        quality: "auto:best",
        sign_url: true,
      });

      const fallbackResponse = await fetch(fallbackUrl);
      if (!fallbackResponse.ok) {
        const body = await fallbackResponse.text();
        throw new Error(`Cloudinary error: ${fallbackResponse.status} — ${body.slice(0, 200)}`);
      }

      const fallbackBuffer = await fallbackResponse.arrayBuffer();
      cloudinary.uploader.destroy(publicId).catch(() => {});

      return new NextResponse(fallbackBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="enhanced.png"`,
        },
      });
    }

    // --- 3. Fetch the eager-transformed image ---
    const imageResponse = await fetch(eagerResult.secure_url);
    if (!imageResponse.ok) {
      const body = await imageResponse.text();
      throw new Error(`Cloudinary delivery error: ${imageResponse.status} — ${body.slice(0, 200)}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // --- 4. Cleanup ---
    cloudinary.uploader.destroy(publicId, { resource_type: "image" }).catch(() => {});

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
