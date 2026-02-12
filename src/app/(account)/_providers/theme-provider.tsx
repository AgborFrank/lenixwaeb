"use client";

import { useEffect, useState } from "react";
import { getSettings } from "@/app/(account)/settings/actions";

const COOKIE_NAME = "lenix_theme";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

function readThemeFromCookie(): "dark" | "light" | "system" | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  const v = match?.[1];
  if (v === "dark" || v === "light" || v === "system") return v;
  return null;
}

function setThemeCookie(theme: "dark" | "light" | "system") {
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function resolveDark(theme: "dark" | "light" | "system"): boolean {
  if (theme === "system") {
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return theme === "dark";
}

function applyTheme(dark: boolean) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (dark) html.classList.add("dark");
  else html.classList.remove("dark");
}

/** Applies user theme (dark/light/system) to document. Runs in account area; can be used in root for logged-in only or here. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const fromCookie = readThemeFromCookie();
    if (fromCookie) {
      applyTheme(resolveDark(fromCookie));
      return;
    }
    getSettings().then(({ data }) => {
      const theme = data?.theme ?? "dark";
      applyTheme(resolveDark(theme));
      setThemeCookie(theme);
    });
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const fromCookie = readThemeFromCookie();
      if (fromCookie === "system") applyTheme(media.matches);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [mounted]);

  return <>{children}</>;
}
