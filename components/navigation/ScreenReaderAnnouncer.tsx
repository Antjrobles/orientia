"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function formatPath(pathname: string) {
  if (!pathname || pathname === "/") {
    return "Inicio";
  }

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment).replace(/[-_]/g, " "));

  return segments
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");
}

export default function ScreenReaderAnnouncer() {
  const pathname = usePathname() ?? "/";
  const [message, setMessage] = useState("");

  useEffect(() => {
    const label = formatPath(pathname);
    setMessage(`Página cargada: ${label}`);
  }, [pathname]);

  return (
    <p aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </p>
  );
}
