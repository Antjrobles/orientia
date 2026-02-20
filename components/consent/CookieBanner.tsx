"use client";

import React, { useEffect, useState } from "react";
import { useConsent } from "@/components/consent/ConsentProvider";
import Link from "next/link";
import { toast } from "sonner";

export default function CookieBanner() {
  const { consent, loaded, hasCookie, acceptAll, rejectNonEssential, save } =
    useConsent();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(consent);

  useEffect(() => {
    setDraft(consent);
  }, [consent]);

  if (!loaded) return null;

  if (hasCookie) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-5xl rounded-t-2xl border border-border bg-card p-4 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex-1">
            <p className="text-sm text-foreground">
              Usamos cookies necesarias para el funcionamiento del sitio y, con
              tu consentimiento, cookies de preferencias, analítica y
              rendimiento. Puedes cambiar tu elección en cualquier momento desde{" "}
              <Link
                href="/ajustes-cookies"
                className="text-primary-600 underline"
              >
                Ajustes de Cookies
              </Link>
              .
            </p>
            {open && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    { key: "preferences", label: "Preferencias" },
                    { key: "analytics", label: "Analítica" },
                    { key: "performance", label: "Rendimiento" },
                    { key: "ads", label: "Publicidad" },
                  ].map((c) => (
                    <label
                      key={c.key}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background p-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={(draft as any)[c.key]}
                        onChange={(e) =>
                          setDraft({
                            ...(draft as any),
                            [c.key]: e.target.checked,
                          } as any)
                        }
                        className="h-4 w-4 rounded border-input bg-background"
                      />
                      <span className="text-foreground">{c.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      save(draft);
                      toast.success("Preferencias guardadas");
                    }}
                    className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/80"
                  >
                    Guardar preferencias
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row">
            <button
              onClick={() => {
                rejectNonEssential();
                toast.success("Preferencias rechazadas");
              }}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Rechazar todo
            </button>
            <button
              onClick={() => {
                acceptAll();
                toast.success("Preferencias aceptadas");
              }}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Aceptar todo
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/80"
            >
              {open ? "Ocultar" : "Configurar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
