import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
// Cache 5 minutos — evita llamadas repetidas a la API de Cloudinary
export const revalidate = 300;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUsageData {
  plan: string;
  credits: {
    usage: number;
    limit: number;
    used_percent: number;
  };
  transformations: {
    usage: number;
    limit: number;
    used_percent: number;
  };
  storage: {
    usage: number; // bytes
    limit: number;
    used_percent: number;
  };
  bandwidth: {
    usage: number; // bytes
    limit: number;
    used_percent: number;
  };
  last_updated: string;
}

export async function GET() {
  try {
    // cloudinary.api.usage() devuelve el resumen de consumo de la cuenta
    const usage = await cloudinary.api.usage();

    const data: CloudinaryUsageData = {
      plan: usage.plan ?? "Free",
      credits: {
        usage: usage.credits?.usage ?? 0,
        limit: usage.credits?.limit ?? 0,
        used_percent: usage.credits?.used_percent ?? 0,
      },
      transformations: {
        usage: usage.transformations?.usage ?? 0,
        limit: usage.transformations?.limit ?? 0,
        used_percent: usage.transformations?.used_percent ?? 0,
      },
      storage: {
        usage: usage.storage?.usage ?? 0,
        limit: usage.storage?.limit ?? 0,
        used_percent: usage.storage?.used_percent ?? 0,
      },
      bandwidth: {
        usage: usage.bandwidth?.usage ?? 0,
        limit: usage.bandwidth?.limit ?? 0,
        used_percent: usage.bandwidth?.used_percent ?? 0,
      },
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json(data, {
      headers: {
        // Cache en el navegador 5 minutos
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[/api/cloudinary-usage]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch usage" },
      { status: 500 }
    );
  }
}
