import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 60; // Vercel Hobby plan max is 60s

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UpscaleMode = "improve" | "upscale" | "restore";

/**
 * Cloudinary AI effects availability:
 *   e_improve        → FREE  — auto colour/contrast/sharpness
 *   e_upscale        → PAID add-on — 2× super-resolution (Bad Request on free plan)
 *   e_restore        → PAID add-on — artefact removal (Bad Request on free plan)
 *
 * Strategy:
 *  - "improve"  → upload to Cloudinary with e_improve eager transformation (free)
 *  - "upscale"  → Sharp 2× bicubic resize (client-side, no Cloudinary credits needed)
 *  - "restore"  → Sharp denoise + sharpen (client-side fallback)
 *
 * Note: The Cloudinary SDK v2 eager `effect` field uses the effect name WITHOUT
 * the "e_" prefix (e.g. "improve", not "e_improve"). The "e_" prefix is only for
 * URL-based transformation strings.
 */

// ─── Sharp-based fallbacks (no Cloudinary credits) ────────────────────────────

async function upscaleWithSharp(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  const meta = await image.metadata();
  const w = (meta.width ?? 1000) * 2;
  const h = (meta.height ?? 1000) * 2;
  return image
    .resize(w, h, { kernel: sharp.kernel.lanczos3 })
    .png({ quality: 100 })
    .toBuffer();
}

async function restoreWithSharp(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .median(1)          // mild denoise
    .sharpen({ sigma: 1.2, m1: 0.5, m2: 0.8 })
    .png({ quality: 100 })
    .toBuffer();
}

// ─── Cloudinary improve (free plan) ───────────────────────────────────────────

async function improveWithCloudinary(
  base64DataUri: string
): Promise<{ buffer: ArrayBuffer; publicId: string }> {
  // Upload with eager e_improve transformation.
  // SDK v2: effect name WITHOUT "e_" prefix inside the transformation object.
  const uploadResult = await cloudinary.uploader.upload(base64DataUri, {
    folder: "image-manipulator-tmp",
    resource_type: "image",
    eager: [{ effect: "improve", quality: "auto:best", fetch_format: "png" }],
    eager_async: false,
  });

  const publicId = uploadResult.public_id;
  const eagerUrl = uploadResult.eager?.[0]?.secure_url;

  if (!eagerUrl) {
    // Eager didn't produce a URL — build a signed delivery URL as fallback
    const signedUrl = cloudinary.url(publicId, {
      transformation: [{ effect: "improve", quality: "auto:best", fetch_format: "png" }],
      sign_url: true,
      secure: true,
    });

    const res = await fetch(signedUrl);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Cloudinary delivery error ${res.status}: ${body.slice(0, 300)}`);
    }
    return { buffer: await res.arrayBuffer(), publicId };
  }

  const res = await fetch(eagerUrl);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary delivery error ${res.status}: ${body.slice(0, 300)}`);
  }
  return { buffer: await res.arrayBuffer(), publicId };
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("[/api/upscale] Missing Cloudinary environment variables");
    return NextResponse.json(
      {
        error:
          "Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
      },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const mode = (formData.get("mode") as UpscaleMode) ?? "improve";

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    let outputBytes: Uint8Array;
    let cleanupPublicId: string | null = null;

    if (mode === "improve") {
      // Free Cloudinary AI enhancement
      const base64 = `data:${file.type};base64,${inputBuffer.toString("base64")}`;
      const { buffer, publicId } = await improveWithCloudinary(base64);
      outputBytes = new Uint8Array(buffer);
      cleanupPublicId = publicId;
    } else if (mode === "upscale") {
      // 2× resolution via Sharp (Cloudinary e_upscale requires paid add-on)
      outputBytes = await upscaleWithSharp(inputBuffer);
    } else {
      // "restore" — denoise + sharpen via Sharp
      outputBytes = await restoreWithSharp(inputBuffer);
    }

    // Fire-and-forget cleanup of the temporary Cloudinary upload
    if (cleanupPublicId) {
      cloudinary.uploader.destroy(cleanupPublicId, { resource_type: "image" }).catch(() => {});
    }

    return new NextResponse(outputBytes as unknown as BodyInit, {
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
