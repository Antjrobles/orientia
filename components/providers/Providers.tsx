"use client";

import { SessionProvider, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import AutoLogout from "@/components/security/AutoLogout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import dynamic from "next/dynamic";

// Lazy load: solo se necesita para usuarios autenticados
const GlobalCommandPalette = dynamic(
  () => import("@/components/navigation/GlobalCommandPalette"),
  { ssr: false },
);

// Renderiza el command palette solo cuando hay sesión activa
function AuthenticatedExtras() {
  const { data: session } = useSession();
  if (!session) return null;
  return (
    <>
      <AutoLogout />
      <GlobalCommandPalette />
    </>
  );
}

function AccessibilityPreferenceSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const sync = async () => {
      try {
        const response = await fetch("/api/profile/preferences", {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok || !data.success) return;

        const highContrast = Boolean(data.preferences?.highContrast ?? false);
        const keyboardNavigation = Boolean(
          data.preferences?.keyboardNavigation ?? false,
        );
        const reducedMotion = Boolean(data.preferences?.reducedMotion ?? false);
        const fontSize = data.preferences?.fontSize === "large" ? "large" : "normal";
        document.documentElement.classList.toggle("high-contrast", highContrast);
        document.documentElement.classList.toggle(
          "keyboard-navigation",
          keyboardNavigation,
        );
        document.documentElement.classList.toggle("reduced-motion", reducedMotion);
        document.documentElement.classList.toggle(
          "font-size-large",
          fontSize === "large",
        );
        window.localStorage.setItem(
          "accessibility_high_contrast",
          String(highContrast),
        );
        window.localStorage.setItem(
          "accessibility_keyboard_navigation",
          String(keyboardNavigation),
        );
        window.localStorage.setItem(
          "accessibility_reduced_motion",
          String(reducedMotion),
        );
        window.localStorage.setItem("accessibility_font_size", fontSize);
      } catch {
        // Ignora errores de sincronización no críticos
      }
    };

    void sync();
  }, [session]);

  return null;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "system") {
      window.localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }

    const highContrast =
      window.localStorage.getItem("accessibility_high_contrast") === "true";
    const keyboardNavigation =
      window.localStorage.getItem("accessibility_keyboard_navigation") === "true";
    const reducedMotion =
      window.localStorage.getItem("accessibility_reduced_motion") === "true";
    const fontSize =
      window.localStorage.getItem("accessibility_font_size") === "large";
    document.documentElement.classList.toggle("high-contrast", highContrast);
    document.documentElement.classList.toggle(
      "keyboard-navigation",
      keyboardNavigation,
    );
    document.documentElement.classList.toggle("reduced-motion", reducedMotion);
    document.documentElement.classList.toggle("font-size-large", fontSize);
  }, []);

  useEffect(() => {
    const handleGlobalNavigationKeys = (event: KeyboardEvent) => {
      if (event.altKey && !event.ctrlKey && !event.metaKey) {
        const key = event.key.toLowerCase();
        if (key === "m") {
          event.preventDefault();
          const main = document.getElementById("main");
          if (main instanceof HTMLElement) {
            main.focus();
          }
          return;
        }
        if (key === "h") {
          event.preventDefault();
          const nav = document.querySelector(
            'nav[aria-label="Navegación principal"] a, nav[aria-label="Navegación móvil"] a',
          );
          if (nav instanceof HTMLElement) {
            nav.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleGlobalNavigationKeys);
    return () =>
      window.removeEventListener("keydown", handleGlobalNavigationKeys);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AuthenticatedExtras />
        <AccessibilityPreferenceSync />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
