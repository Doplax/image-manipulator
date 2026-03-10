"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeIcon() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />;
}
