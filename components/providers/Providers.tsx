"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React, { useEffect } from "react";
import AutoLogout from "@/components/security/AutoLogout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import GlobalCommandPalette from "@/components/navigation/GlobalCommandPalette";

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "system") {
      window.localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, []);

  // El SessionProvider provee el contexto de la sesión a todos los componentes hijos.
  // Es crucial que este sea un componente 'use client'.
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {/* Sistema de seguridad: cierra sesión automáticamente tras 30 min de inactividad */}
        <AutoLogout />
        <GlobalCommandPalette />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
