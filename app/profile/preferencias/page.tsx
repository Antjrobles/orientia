"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type PreferencesState = {
  emailNotifications: boolean;
  draftReminders: boolean;
  weeklySummary: boolean;
};

export default function PreferenciasPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesState>({
    emailNotifications: true,
    draftReminders: true,
    weeklySummary: false,
  });
  const [initial, setInitial] = useState<PreferencesState>({
    emailNotifications: true,
    draftReminders: true,
    weeklySummary: false,
  });

  const isDirty =
    preferences.emailNotifications !== initial.emailNotifications ||
    preferences.draftReminders !== initial.draftReminders ||
    preferences.weeklySummary !== initial.weeklySummary;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/profile/preferences", {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "No se pudieron cargar las preferencias.");
        }
        const next: PreferencesState = {
          emailNotifications: Boolean(data.preferences?.emailNotifications ?? true),
          draftReminders: Boolean(data.preferences?.draftReminders ?? true),
          weeklySummary: Boolean(data.preferences?.weeklySummary ?? false),
        };
        setPreferences(next);
        setInitial(next);
      } catch (error) {
        toast.error("Preferencias", {
          description:
            error instanceof Error
              ? error.message
              : "No se pudieron cargar las preferencias.",
        });
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

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
      };
      setPreferences(next);
      setInitial(next);

      toast.success("Preferencias guardadas");
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
        <h1 className="text-2xl font-bold text-gray-900">Preferencias</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tus notificaciones y comunicaciones.
        </p>
      </div>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-600" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando preferencias...
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3 rounded-md border border-emerald-100 p-3">
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

              <div className="flex items-start justify-between gap-3 rounded-md border border-emerald-100 p-3">
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

              <div className="flex items-start justify-between gap-3 rounded-md border border-emerald-100 p-3">
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
                  <Mail className="mr-1 h-3.5 w-3.5" />
                  Email
                </Badge>
                <span>Estas preferencias se aplican a tu cuenta.</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={save}
          disabled={loading || saving || !isDirty}
          className="bg-green-600 hover:bg-green-700"
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
