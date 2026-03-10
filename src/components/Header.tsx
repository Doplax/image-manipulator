"use client";

import dynamic from "next/dynamic";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Chip,
} from "@heroui/react";
import { useTheme } from "next-themes";
import { ImageIcon, Github } from "lucide-react";

// Rendered only on the client to avoid SSR/hydration mismatch
// (resolvedTheme is undefined on the server with next-themes)
const ThemeIcon = dynamic(() => import("@/components/ui/ThemeIcon"), { ssr: false });

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Navbar
      maxWidth="xl"
      className="border-b border-divider backdrop-blur-md bg-background/70"
      isBordered
    >
      <NavbarBrand>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground">
            <ImageIcon size={15} className="text-background" />
          </div>
          <span className="font-bold text-foreground text-sm tracking-tight">
            Image Manipulator
          </span>
          <Chip size="sm" variant="flat" className="hidden sm:flex text-xs h-5 px-1">
            v1.0
          </Chip>
        </div>
      </NavbarBrand>

      <NavbarContent justify="end" className="gap-2">
        <NavbarItem className="hidden sm:flex">
          <Chip
            size="sm"
            variant="dot"
            color="success"
            className="text-xs border-none"
          >
            Next.js 16 · Vercel Ready
          </Chip>
        </NavbarItem>

        <NavbarItem>
          <Button
            as="a"
            href="https://github.com/Doplax/image-manipulator"
            target="_blank"
            rel="noopener noreferrer"
            variant="bordered"
            size="sm"
            startContent={<Github size={14} />}
            className="text-xs font-medium"
          >
            GitHub
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            aria-label="Toggle theme"
            onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <ThemeIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
