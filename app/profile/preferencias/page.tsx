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

type PreferencesState = {
  emailNotifications: boolean;
  draftReminders: boolean;
  weeklySummary: boolean;
  theme: ThemePreference;
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
  });
  const [initial, setInitial] = useState<PreferencesState>({
    emailNotifications: true,
    draftReminders: true,
    weeklySummary: false,
    theme: "light",
  });

  const isDirty =
    preferences.emailNotifications !== initial.emailNotifications ||
    preferences.draftReminders !== initial.draftReminders ||
    preferences.weeklySummary !== initial.weeklySummary ||
    preferences.theme !== initial.theme;

  const applyTheme = (choice: ThemePreference) => {
    const root = document.documentElement;

    root.classList.toggle("dark", choice === "dark");
    root.style.colorScheme = choice;
    window.localStorage.setItem("theme", choice);
  };

  useEffect(() => {
    if (didLoadRef.current) {
      return;
    }
    didLoadRef.current = true;

    const load = async () => {
      const localStoredTheme = normalizeTheme(window.localStorage.getItem("theme"));
      setTheme(localStoredTheme);
      applyTheme(localStoredTheme);
      setPreferences((current) => ({ ...current, theme: localStoredTheme }));
      setInitial((current) => ({ ...current, theme: localStoredTheme }));

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
        };
        setTheme(next.theme);
        applyTheme(next.theme);
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
      };
      setTheme(next.theme);
      applyTheme(next.theme);
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
                  <Mail className="mr-1 h-3.5 w-3.5" />
                  Email
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
