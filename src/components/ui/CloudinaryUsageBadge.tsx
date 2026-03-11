"use client";

import { useEffect, useState } from "react";
import { Cloud, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CloudinaryUsageData } from "@/app/api/cloudinary-usage/route";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function UsageBar({
  label,
  usage,
  limit,
  percent,
  unit,
}: {
  label: string;
  usage: number;
  limit: number;
  percent: number;
  unit?: "bytes" | "number";
}) {
  const isHigh = percent >= 80;
  const isMedium = percent >= 50;

  const color = isHigh
    ? "bg-red-500"
    : isMedium
    ? "bg-amber-500"
    : "bg-emerald-500";

  const usageStr = unit === "bytes" ? formatBytes(usage) : usage.toLocaleString();
  const limitStr = unit === "bytes" ? formatBytes(limit) : limit === 0 ? "∞" : limit.toLocaleString();

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-default-500">{label}</span>
        <span className="text-default-400 font-mono">
          {usageStr}
          {limit > 0 && (
            <span className="text-default-300"> / {limitStr}</span>
          )}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-default-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function CloudinaryUsageBadge() {
  const [data, setData] = useState<CloudinaryUsageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUsage() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cloudinary-usage");
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsage();
  }, []);

  return (
    <div className="rounded-xl border border-default-200 dark:border-gray-700 bg-default-50 dark:bg-gray-900/50 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud size={14} className="text-sky-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-default-400">
            Cloudinary
          </span>
          {data && (
            <span className="rounded-full bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400">
              {data.plan}
            </span>
          )}
        </div>
        <button
          onClick={fetchUsage}
          disabled={loading}
          className="text-default-400 hover:text-default-600 transition-colors"
          title="Actualizar"
        >
          <RefreshCw size={13} className={cn(loading && "animate-spin")} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-2">
          <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !data && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-default-200 dark:bg-gray-700" />
              <div className="h-1.5 w-full rounded-full bg-default-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      )}

      {/* Data */}
      {data && (
        <div className="space-y-3">
          {data.credits.limit > 0 && (
            <UsageBar
              label="Créditos IA"
              usage={data.credits.usage}
              limit={data.credits.limit}
              percent={data.credits.used_percent}
            />
          )}
          <UsageBar
            label="Transformaciones"
            usage={data.transformations.usage}
            limit={data.transformations.limit}
            percent={data.transformations.used_percent}
          />
          <UsageBar
            label="Almacenamiento"
            usage={data.storage.usage}
            limit={data.storage.limit}
            percent={data.storage.used_percent}
            unit="bytes"
          />
          <UsageBar
            label="Ancho de banda"
            usage={data.bandwidth.usage}
            limit={data.bandwidth.limit}
            percent={data.bandwidth.used_percent}
            unit="bytes"
          />
          <p className="text-[10px] text-default-300 text-right">
            Actualizado{" "}
            {new Date(data.last_updated).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
