"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ConsentState, ConsentCategories } from "@/lib/consent";
import {
  broadcastConsent,
  defaultConsent,
  detectGPC,
  readConsent,
  removeNonEssentialCookies,
  writeConsent,
} from "@/lib/consent";

type ConsentContextType = {
  consent: ConsentState;
  setCategory: (cat: ConsentCategories, value: boolean) => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  save: (next: Partial<ConsentState>) => void;
  loaded: boolean;
  hasCookie: boolean;
};

const ConsentContext = createContext<ConsentContextType | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent());
  const [loaded, setLoaded] = useState(false);
  const [hasCookie, setHasCookie] = useState(false);

  useEffect(() => {
    // Initialize from cookie or GPC default
    const existing = readConsent();
    if (existing) {
      setConsent(existing);
      broadcastConsent(existing);
      setLoaded(true);
      setHasCookie(true);
      return;
    }
    const gpc = detectGPC();
    const initial = defaultConsent();
    if (gpc) {
      initial.preferences = false;
      initial.analytics = false;
      initial.performance = false;
      initial.ads = false;
    }
    setConsent(initial);
    setLoaded(true);
  }, []);

  const api = useMemo<ConsentContextType>(
    () => ({
      consent,
      loaded,
      hasCookie,
      setCategory(cat, value) {
        const next = {
          ...consent,
          [cat]: cat === "necessary" ? true : value,
          updatedAt: new Date().toISOString(),
        };
        setConsent(next);
      },
      acceptAll() {
        const next: ConsentState = {
          ...consent,
          preferences: true,
          analytics: true,
          performance: true,
          ads: true,
          updatedAt: new Date().toISOString(),
        };
        setConsent(next);
        writeConsent(next);
        setHasCookie(true);
        broadcastConsent(next);
      },
      rejectNonEssential() {
        const next: ConsentState = {
          ...consent,
          preferences: false,
          analytics: false,
          performance: false,
          ads: false,
          updatedAt: new Date().toISOString(),
        };
        setConsent(next);
        writeConsent(next);
        removeNonEssentialCookies();
        setHasCookie(true);
        broadcastConsent(next);
      },
      save(partial) {
        const next: ConsentState = {
          ...consent,
          ...partial,
          necessary: true,
          updatedAt: new Date().toISOString(),
        };
        setConsent(next);
        writeConsent(next);
        if (!next.analytics || !next.performance || !next.ads)
          removeNonEssentialCookies();
        setHasCookie(true);
        broadcastConsent(next);
      },
    }),
    [consent, loaded, hasCookie],
  );

  return (
    <ConsentContext.Provider value={api}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}
