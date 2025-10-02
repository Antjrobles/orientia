"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  // El SessionProvider provee el contexto de la sesión a todos los componentes hijos.
  // Es crucial que este sea un componente 'use client'.
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
