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
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
