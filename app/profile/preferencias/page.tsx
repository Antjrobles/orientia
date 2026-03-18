"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Bell, Loader2, Mail, MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type ThemePreference = "light" | "dark";
type FontSizePreference = "normal" | "large";

type PreferencesState = {
  emailNotifications: boolean;
  draftReminders: boolean;
  weeklySummary: boolean;
  theme: ThemePreference;
  fontSize: FontSizePreference;
  highContrast: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
};

function normalizeTheme(value: unknown): ThemePreference {
  return value === "dark" ? "dark" : "light";
}

export default function PreferenciasPage() {
  const { theme, setTheme } = useTheme();
  const didLoadRef = useRef(false);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesState>({
    emailNotifications: true,
    draftReminders: true,
    weeklySummary: false,
    theme: "light",
    fontSize: "normal",
    highContrast: false,
    keyboardNavigation: false,
    reducedMotion: false,
  });
  const [initial, setInitial] = useState<PreferencesState>({
    emailNotifications: true,
    draftReminders: true,
    weeklySummary: false,
    theme: "light",
    fontSize: "normal",
    highContrast: false,
    keyboardNavigation: false,
    reducedMotion: false,
  });

  const isDirty =
    preferences.emailNotifications !== initial.emailNotifications ||
    preferences.draftReminders !== initial.draftReminders ||
    preferences.weeklySummary !== initial.weeklySummary ||
    preferences.theme !== initial.theme ||
    preferences.fontSize !== initial.fontSize ||
    preferences.highContrast !== initial.highContrast ||
    preferences.keyboardNavigation !== initial.keyboardNavigation ||
    preferences.reducedMotion !== initial.reducedMotion;

  const applyTheme = (choice: ThemePreference) => {
    const root = document.documentElement;

    root.classList.toggle("dark", choice === "dark");
    root.style.colorScheme = choice;
    window.localStorage.setItem("theme", choice);
  };

  const applyFontSize = (choice: FontSizePreference) => {
    const root = document.documentElement;
    root.classList.toggle("font-size-large", choice === "large");
    window.localStorage.setItem("accessibility_font_size", choice);
  };

  const applyAccessibility = (next: Pick<
    PreferencesState,
    "highContrast" | "keyboardNavigation" | "reducedMotion"
  >) => {
    const root = document.documentElement;
    root.classList.toggle("high-contrast", next.highContrast);
    root.classList.toggle("keyboard-navigation", next.keyboardNavigation);
    root.classList.toggle("reduced-motion", next.reducedMotion);
    window.localStorage.setItem(
      "accessibility_high_contrast",
      String(next.highContrast),
    );
    window.localStorage.setItem(
      "accessibility_keyboard_navigation",
      String(next.keyboardNavigation),
    );
    window.localStorage.setItem(
      "accessibility_reduced_motion",
      String(next.reducedMotion),
    );
  };

  useEffect(() => {
    if (didLoadRef.current) {
      return;
    }
    didLoadRef.current = true;

    const load = async () => {
      const localStoredTheme = normalizeTheme(window.localStorage.getItem("theme"));
      const localHighContrast =
        window.localStorage.getItem("accessibility_high_contrast") === "true";
      const localKeyboardNavigation =
        window.localStorage.getItem("accessibility_keyboard_navigation") === "true";
      const localReducedMotion =
        window.localStorage.getItem("accessibility_reduced_motion") === "true";
      const localFontSize =
        window.localStorage.getItem("accessibility_font_size") === "large"
          ? "large"
          : "normal";
      setTheme(localStoredTheme);
      applyTheme(localStoredTheme);
      applyFontSize(localFontSize);
      applyAccessibility({
        highContrast: localHighContrast,
        keyboardNavigation: localKeyboardNavigation,
        reducedMotion: localReducedMotion,
      });
      setPreferences((current) => ({
        ...current,
        theme: localStoredTheme,
        fontSize: localFontSize,
        highContrast: localHighContrast,
        keyboardNavigation: localKeyboardNavigation,
        reducedMotion: localReducedMotion,
      }));
      setInitial((current) => ({
        ...current,
        theme: localStoredTheme,
        fontSize: localFontSize,
        highContrast: localHighContrast,
        keyboardNavigation: localKeyboardNavigation,
        reducedMotion: localReducedMotion,
      }));

      setSyncing(true);
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 4500);
      try {
        const response = await fetch("/api/profile/preferences", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "No se pudieron cargar las preferencias.");
        }
        const effectiveTheme = normalizeTheme(
          window.localStorage.getItem("theme") ?? data.preferences?.theme,
        );

        const next: PreferencesState = {
          emailNotifications: Boolean(data.preferences?.emailNotifications ?? true),
          draftReminders: Boolean(data.preferences?.draftReminders ?? true),
          weeklySummary: Boolean(data.preferences?.weeklySummary ?? false),
          theme: effectiveTheme,
          fontSize: data.preferences?.fontSize === "large" ? "large" : localFontSize,
          highContrast: Boolean(data.preferences?.highContrast ?? localHighContrast),
          keyboardNavigation: Boolean(
            data.preferences?.keyboardNavigation ?? localKeyboardNavigation,
          ),
          reducedMotion: Boolean(
            data.preferences?.reducedMotion ?? localReducedMotion,
          ),
        };
        setTheme(next.theme);
        applyTheme(next.theme);
        applyFontSize(next.fontSize);
        applyAccessibility({
          highContrast: next.highContrast,
          keyboardNavigation: next.keyboardNavigation,
          reducedMotion: next.reducedMotion,
        });
        setPreferences(next);
        setInitial(next);
      } catch (error) {
        const isAbortError =
          error instanceof DOMException && error.name === "AbortError";
        if (!isAbortError) {
          toast.error("Preferencias", {
            description:
              error instanceof Error
                ? error.message
                : "No se pudieron cargar las preferencias.",
          });
        }
      } finally {
        window.clearTimeout(timeout);
        setSyncing(false);
      }
    };

    void load();
  }, [setTheme]);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/profile/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudieron guardar las preferencias.");
      }

      const next: PreferencesState = {
        emailNotifications: Boolean(data.preferences?.emailNotifications ?? true),
        draftReminders: Boolean(data.preferences?.draftReminders ?? true),
        weeklySummary: Boolean(data.preferences?.weeklySummary ?? false),
        theme: (["light", "dark"].includes(data.preferences?.theme)
          ? data.preferences.theme
          : "light") as ThemePreference,
        fontSize: data.preferences?.fontSize === "large" ? "large" : "normal",
        highContrast: Boolean(data.preferences?.highContrast ?? false),
        keyboardNavigation: Boolean(data.preferences?.keyboardNavigation ?? false),
        reducedMotion: Boolean(data.preferences?.reducedMotion ?? false),
      };
      setTheme(next.theme);
      applyTheme(next.theme);
      applyFontSize(next.fontSize);
      applyAccessibility({
        highContrast: next.highContrast,
        keyboardNavigation: next.keyboardNavigation,
        reducedMotion: next.reducedMotion,
      });
      setPreferences(next);
      setInitial(next);

      toast.success("Preferencias guardadas");
      if (Array.isArray(data.warnings) && data.warnings.length > 0) {
        toast.warning("Guardado parcial", {
          description: data.warnings[0],
        });
      }
    } catch (error) {
      toast.error("Error al guardar", {
        description:
          error instanceof Error
            ? error.message
            : "No se pudieron guardar las preferencias.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Preferencias</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tus notificaciones y comunicaciones.
        </p>
      </div>

      <Card className="border-border/70 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <>
              {syncing ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Sincronizando preferencias...
                </div>
              ) : null}
              <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="theme-preference" className="text-sm font-medium">
                    Apariencia de la app
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Elige tema claro u oscuro.
                  </p>
                </div>
                <div className="flex min-w-[220px] flex-col gap-2">
                  <div
                    id="theme-preference"
                    className="grid grid-cols-2 rounded-md border border-input bg-background p-1"
                  >
                    {(
                      [
                        { value: "light", label: "Claro" },
                        { value: "dark", label: "Oscuro" },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setTheme(option.value);
                          applyTheme(option.value);
                          setPreferences((current) => ({
                            ...current,
                            theme: option.value,
                          }));
                        }}
                        className={
                          preferences.theme === option.value
                            ? "rounded-sm bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground"
                            : "rounded-sm px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Activo:{" "}
                    <span className="font-medium text-foreground">
                      {theme === "dark" ? "Oscuro" : "Claro"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="font-size-preference" className="text-sm font-medium">
                    Tamaño del texto
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Aumenta la tipografia base para facilitar la lectura.
                  </p>
                </div>
                <div className="flex min-w-[220px] flex-col gap-2">
                  <div
                    id="font-size-preference"
                    className="grid grid-cols-2 rounded-md border border-input bg-background p-1"
                  >
                    {(
                      [
                        { value: "normal", label: "Normal" },
                        { value: "large", label: "Grande" },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          applyFontSize(option.value);
                          setPreferences((current) => ({
                            ...current,
                            fontSize: option.value,
                          }));
                        }}
                        className={
                          preferences.fontSize === option.value
                            ? "rounded-sm bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground"
                            : "rounded-sm px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Activo:{" "}
                    <span className="font-medium text-foreground">
                      {preferences.fontSize === "large" ? "Grande" : "Normal"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="comm-orientia" className="text-sm font-medium">
                    Comunicaciones de Orientia
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recibir actualizaciones y avisos de la plataforma.
                  </p>
                </div>
                <Switch
                  id="comm-orientia"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    setPreferences((current) => ({
                      ...current,
                      emailNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="draft-reminders" className="text-sm font-medium">
                    Recordatorios de borradores
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recibir avisos sobre informes en progreso.
                  </p>
                </div>
                <Switch
                  id="draft-reminders"
                  checked={preferences.draftReminders}
                  onCheckedChange={(checked) =>
                    setPreferences((current) => ({
                      ...current,
                      draftReminders: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="weekly-summary" className="text-sm font-medium">
                    Resumen semanal
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recibir un resumen periódico de actividad.
                  </p>
                </div>
                <Switch
                  id="weekly-summary"
                  checked={preferences.weeklySummary}
                  onCheckedChange={(checked) =>
                    setPreferences((current) => ({
                      ...current,
                      weeklySummary: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="high-contrast" className="text-sm font-medium">
                    Modo de alto contraste
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Refuerza contraste y legibilidad en toda la interfaz.
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => {
                    applyAccessibility({
                      highContrast: checked,
                      keyboardNavigation: preferences.keyboardNavigation,
                      reducedMotion: preferences.reducedMotion,
                    });
                    setPreferences((current) => ({
                      ...current,
                      highContrast: checked,
                    }));
                  }}
                />
              </div>

              <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="keyboard-navigation" className="text-sm font-medium">
                    Navegación por teclado mejorada
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Destaca mejor el foco y prioriza la navegación sin ratón.
                  </p>
                </div>
                <Switch
                  id="keyboard-navigation"
                  checked={preferences.keyboardNavigation}
                  onCheckedChange={(checked) => {
                    applyAccessibility({
                      highContrast: preferences.highContrast,
                      keyboardNavigation: checked,
                      reducedMotion: preferences.reducedMotion,
                    });
                    setPreferences((current) => ({
                      ...current,
                      keyboardNavigation: checked,
                    }));
                  }}
                />
              </div>

              <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="reduced-motion" className="text-sm font-medium">
                    Reducir movimiento
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Minimiza animaciones y transiciones para una experiencia visual mas estable.
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => {
                    applyAccessibility({
                      highContrast: preferences.highContrast,
                      keyboardNavigation: preferences.keyboardNavigation,
                      reducedMotion: checked,
                    });
                    setPreferences((current) => ({
                      ...current,
                      reducedMotion: checked,
                    }));
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">
                  <MoonStar className="mr-1 h-3.5 w-3.5" />
                  Tema
                </Badge>
                <Badge variant="secondary">
                  <Sun className="mr-1 h-3.5 w-3.5" />
                  {preferences.theme === "dark" ? "Oscuro" : "Claro"}
                </Badge>
                <Badge variant="secondary">
                  {preferences.fontSize === "large" ? "Texto grande" : "Texto normal"}
                </Badge>
                <Badge variant="secondary">
                  <Mail className="mr-1 h-3.5 w-3.5" />
                  Email
                </Badge>
                <Badge variant="secondary">
                  {preferences.highContrast ? "Alto contraste" : "Contraste estándar"}
                </Badge>
                <Badge variant="secondary">
                  {preferences.keyboardNavigation
                    ? "Teclado mejorado"
                    : "Teclado estándar"}
                </Badge>
                <Badge variant="secondary">
                  {preferences.reducedMotion ? "Movimiento reducido" : "Movimiento estándar"}
                </Badge>
                <span>Estas preferencias se aplican a tu cuenta.</span>
              </div>
          </>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={save}
          disabled={saving || !isDirty}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar preferencias"
          )}
        </Button>
      </div>
    </div>
  );
}
