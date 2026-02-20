"use client";

import React from "react";
import { Home, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

type Action =
  | { type: "link"; label: string; href: string }
  | { type: "back"; label: string };

interface ErrorViewProps {
  code: string;
  title: string;
  description?: string;
  icon?: "shield" | "home" | "none";
  primaryAction?: Action;
  secondaryAction?: Action;
}

export default function ErrorView({
  code,
  title,
  description,
  icon = "none",
  primaryAction,
  secondaryAction,
}: ErrorViewProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-muted/40 text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(120deg, hsl(var(--primary) / 0.10), hsl(var(--secondary) / 0.18))",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--background)) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
          <div className="px-6 pt-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              {icon === "shield" && (
                <Shield className="h-7 w-7 text-primary" />
              )}
              {icon === "home" && <Home className="h-7 w-7 text-primary" />}
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-primary">
                <span className="font-mono">{code}</span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
            </div>
          </div>

          <div className="px-6 pb-6 pt-4">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {secondaryAction &&
                (secondaryAction.type === "link" ? (
                  <Link
                    href={secondaryAction.href}
                    className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {secondaryAction.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => history.back()}
                    className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {secondaryAction.label}
                  </button>
                ))}

              {primaryAction && primaryAction.type === "link" && (
                <Link
                  href={primaryAction.href}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {primaryAction.label}
                </Link>
              )}
            </div>
          </div>

          <div className="border-t border-border/60 bg-muted/40 px-6 py-3 text-center text-xs text-muted-foreground">
            <span className="font-mono">{code}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
