"use client";

import { cn } from "@/lib/utils";

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: "violet" | "emerald" | "amber" | "sky";
  accentColor?: "violet" | "emerald" | "amber" | "sky";
  onClick: () => void;
}

const badgeStyles = {
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  sky: "bg-sky-500/15 text-sky-400 border-sky-500/30",
};

const accentBorder = {
  violet: "hover:border-violet-500/60 group-hover:text-violet-400",
  emerald: "hover:border-emerald-500/60 group-hover:text-emerald-400",
  amber: "hover:border-amber-500/60 group-hover:text-amber-400",
  sky: "hover:border-sky-500/60 group-hover:text-sky-400",
};

const iconBg = {
  violet: "bg-violet-500/15 text-violet-400 group-hover:bg-violet-500/25",
  emerald: "bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25",
  amber: "bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25",
  sky: "bg-sky-500/15 text-sky-400 group-hover:bg-sky-500/25",
};

export default function ToolCard({
  icon,
  title,
  description,
  badge,
  badgeColor = "violet",
  accentColor = "violet",
  onClick,
}: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-default-200 bg-default-50 p-6 text-left",
        "transition-all duration-200 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
        "dark:border-gray-800 dark:bg-gray-900 dark:hover:shadow-black/30",
        accentBorder[accentColor]
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200",
          iconBg[accentColor]
        )}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground text-base">{title}</h3>
          {badge && (
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                badgeStyles[badgeColor]
              )}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-default-500 leading-relaxed">{description}</p>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-end">
        <span className={cn(
          "text-xs font-medium text-default-400 transition-colors duration-200",
          accentBorder[accentColor]
        )}>
          Abrir →
        </span>
      </div>
    </button>
  );
}
