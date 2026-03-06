"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, Search, Send, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FriendlyErrorAlert } from "@/components/ui/friendly-error-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Recipient = {
  id: string;
  name: string | null;
  email: string | null;
  role: "admin" | "usuario";
  emailVerified: string | null;
  communicationsOptOut?: boolean;
};

const DEFAULT_SUBJECT = "Comunicación de Orientia";
const DEFAULT_MESSAGE = `Hola,

Queremos compartir contigo una actualización completa sobre el trabajo que estamos realizando en Orientia y sobre cómo estos avances pueden ayudarte en el día a día del centro.

Durante este último periodo hemos dedicado el esfuerzo principal a mejorar la claridad de los informes psicopedagógicos, reforzar la estabilidad general de la plataforma y simplificar la experiencia de uso en los flujos más frecuentes. El objetivo de estos cambios es reducir fricción operativa y facilitar que el equipo de orientación pueda trabajar con mayor continuidad y menos interrupciones.

También estamos revisando de forma continua aspectos de rendimiento y consistencia para que la herramienta responda mejor en escenarios de uso intensivo, especialmente cuando se gestionan varios casos de forma simultánea. Queremos que Orientia sea un apoyo fiable para la planificación, el seguimiento y la coordinación con el resto del equipo educativo.

Nuestro compromiso es que cada mejora tenga impacto real en la práctica profesional, no solo en lo técnico. Por eso seguimos priorizando funcionalidades que aporten valor directo en la evaluación, la intervención y la documentación del trabajo orientador.

Si quieres, puedes responder a este correo con sugerencias, incidencias o necesidades concretas de tu centro. Revisamos cada aportación para definir prioridades y próximos desarrollos con criterio pedagógico y operativo.

Un saludo,
Equipo de Orientia`;

export default function AdminComunicacionesPage() {
  const [users, setUsers] = useState<Recipient[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sending, setSending] = useState(false);
  const [optimisticNotice, setOptimisticNotice] = useState<string | null>(null);
  const [friendlyError, setFriendlyError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [commsFilter, setCommsFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const loadUsers = async () => {
    setLoadingUsers(true);
    setFriendlyError(null);
    try {
      const params = new URLSearchParams({
        q: search.trim(),
        role: roleFilter,
        verified: verifiedFilter,
        comms: commsFilter,
      });
      const response = await fetch(
        `/api/admin/communications/users?${params.toString()}`,
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudo cargar el listado.");
      }

      const incoming = Array.isArray(data.users) ? (data.users as Recipient[]) : [];
      setUsers(incoming);

      setSelectedIds((current) => {
        const validIds = new Set(incoming.map((u) => u.id));
        const next = new Set<string>();
        for (const id of current) {
          if (validIds.has(id)) next.add(id);
        }
        return next;
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cargar el listado de contactos.";
      setFriendlyError(message);
      toast.error("Comunicaciones", {
        description: message,
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, verifiedFilter, commsFilter]);

  const selectableUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          Boolean(u.email && String(u.email).trim().length > 0) &&
          !u.communicationsOptOut,
      ),
    [users],
  );

  const selectedCount = selectedIds.size;
  const allVisibleSelected =
    selectableUsers.length > 0 &&
    selectableUsers.every((user) => selectedIds.has(user.id));

  const toggleAllVisible = (checked: boolean) => {
    if (!checked) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(selectableUsers.map((user) => user.id)));
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const sendCampaign = async () => {
    if (selectedCount === 0) {
      toast.error("Selecciona al menos un contacto.");
      return;
    }
    if (subject.trim().length < 3) {
      toast.error("El asunto es obligatorio.");
      return;
    }
    if (message.trim().length < 20) {
      toast.error("El mensaje es demasiado corto.");
      return;
    }

    const selectedSnapshot = new Set(selectedIds);
    setOptimisticNotice(
      `Preparando envío para ${selectedSnapshot.size} contacto${
        selectedSnapshot.size > 1 ? "s" : ""
      }...`,
    );
    setSelectedIds(new Set());
    setSending(true);
    setFriendlyError(null);
    try {
      const loadingToastId = toast.loading("Enviando comunicación", {
        description: "Estamos preparando y distribuyendo el envío.",
      });

      const response = await fetch("/api/admin/communications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          recipientIds: [...selectedSnapshot],
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo enviar la comunicación.");
      }

      if (data.failed > 0) {
        toast.warning("Envío parcial", {
          id: loadingToastId,
          description: `Enviados: ${data.sent}. Fallidos: ${data.failed}. Excluidos por baja: ${data.skippedOptOut ?? 0}.`,
        });
      } else {
        toast.success("Comunicación enviada", {
          id: loadingToastId,
          description: `Enviada a ${data.sent} contactos.`,
        });
      }
      setOptimisticNotice("Comunicación enviada correctamente.");
    } catch (error) {
      setSelectedIds(selectedSnapshot);
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo enviar la comunicación. Revisa la conexión e inténtalo de nuevo.";
      setFriendlyError(message);
      toast.error("Error al enviar", {
        description: message,
      });
      setOptimisticNotice(null);
    } finally {
      setSending(false);
      window.setTimeout(() => setOptimisticNotice(null), 2200);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 pb-12 pt-8 sm:px-6 md:px-7 lg:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Comunicaciones
            </h1>
            <p className="text-sm text-muted-foreground">
              Filtra usuarios registrados y envía comunicaciones con Plunk.
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <Mail className="mr-1.5 h-3.5 w-3.5" />
            Envío manual
          </Badge>
        </div>

        {optimisticNotice && (
          <Alert className="mb-4 border-emerald-500/40 bg-emerald-500/10 text-emerald-100">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <AlertTitle>Estado en curso</AlertTitle>
            <AlertDescription>{optimisticNotice}</AlertDescription>
          </Alert>
        )}

        {friendlyError && (
          <div className="mb-4">
            <FriendlyErrorAlert
              title="No pudimos completar la operación"
              message={friendlyError}
              actionLabel="Reintentar carga"
              onAction={() => void loadUsers()}
              onDismiss={() => setFriendlyError(null)}
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[1.1fr,1fr] xl:grid-cols-[1.2fr,1fr]">
          <Card className="border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Contactos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <div className="md:col-span-1 lg:col-span-1">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los roles</SelectItem>
                      <SelectItem value="usuario">Solo usuarios</SelectItem>
                      <SelectItem value="admin">Solo admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                  <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Verificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="verified">Email verificado</SelectItem>
                      <SelectItem value="unverified">Sin verificar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                  <Select value={commsFilter} onValueChange={setCommsFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Comunicaciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Reciben comunicaciones</SelectItem>
                      <SelectItem value="optout">Baja de comunicaciones</SelectItem>
                      <SelectItem value="all">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={loadUsers}
                    disabled={loadingUsers}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </Button>
                </div>
              </div>

              <Input
                placeholder="Buscar por nombre o correo..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void loadUsers();
                  }
                }}
              />

              <div className="rounded-md border border-emerald-500/40">
                <div className="flex items-center justify-between border-b border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                  <label className="inline-flex items-center gap-2 font-medium">
                    <Checkbox
                      checked={allVisibleSelected}
                      onCheckedChange={(checked) => toggleAllVisible(Boolean(checked))}
                    />
                    Seleccionar visibles
                  </label>
                  <span>
                    {selectedCount} seleccionados de {selectableUsers.length}
                  </span>
                </div>
                <div className="max-h-[420px] overflow-auto">
                  {loadingUsers ? (
                    <div className="space-y-2 px-3 py-4">
                      {Array.from({ length: 7 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-4 rounded-sm" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-36" />
                              <Skeleton className="h-3 w-52" />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : users.length === 0 ? (
                    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                      No hay contactos para los filtros seleccionados.
                    </div>
                  ) : (
                    users.map((user) => {
                      const checked = selectedIds.has(user.id);
                      const hasEmail = Boolean(user.email);
                      const verified = Boolean(user.emailVerified);
                      const blockedForComms = Boolean(user.communicationsOptOut);
                      return (
                        <div
                          key={user.id}
                          className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 transition-all duration-150 hover:bg-accent/35 hover:pl-4 last:border-b-0"
                        >
                          <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                            <Checkbox
                              checked={checked}
                              disabled={!hasEmail || blockedForComms}
                              onCheckedChange={(next) =>
                                toggleOne(user.id, Boolean(next))
                              }
                            />
                            <span className="min-w-0 text-sm">
                              <span className="block truncate font-medium text-foreground">
                                {user.name || "Sin nombre"}
                              </span>
                              <span className="block truncate text-muted-foreground">
                                {user.email || "Sin email"}
                              </span>
                            </span>
                          </label>
                          <div className="shrink-0 space-x-1">
                            <Badge variant="outline" className="capitalize">
                              {user.role}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                verified
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                  : "border-amber-500/40 bg-amber-500/10 text-amber-300"
                              }
                            >
                              {verified ? "Verificada" : "No verificada"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                user.communicationsOptOut
                                  ? "border-border bg-muted text-muted-foreground"
                                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                              }
                            >
                              {user.communicationsOptOut ? "Baja" : "Activa"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Redactar comunicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Asunto"
              />
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Mensaje de la comunicación"
                rows={16}
                className="resize-y"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSubject(DEFAULT_SUBJECT);
                    setMessage(DEFAULT_MESSAGE);
                  }}
                >
                  Cargar plantilla base
                </Button>
                <Button
                  type="button"
                  onClick={sendCampaign}
                  disabled={sending || selectedCount === 0}
                  className="bg-emerald-600 transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:translate-y-0"
                >
                  {sending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {sending
                    ? "Enviando..."
                    : `Enviar a ${selectedCount} contactos`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
