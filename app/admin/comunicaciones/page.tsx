"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Mail, Search, Send, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
};

const DEFAULT_SUBJECT = "Estado de Orientia";
const DEFAULT_MESSAGE = `Buenos días:

Gracias por su registro y por la confianza depositada en Orientia.

Actualmente, Orientia se encuentra en una fase de desarrollo progresivo. Ya puede utilizarse, pero algunas funcionalidades continúan en proceso de mejora para asegurar un funcionamiento completo, estable y plenamente alineado con el trabajo de orientación educativa.

En esta etapa, las mejoras se están centrando en aspectos clave para la práctica profesional:
- calidad técnica y utilidad de los informes psicopedagógicos;
- organización y seguimiento de casos;
- estabilidad, seguridad y claridad de uso.

Si lo considera oportuno, puede enviar feedback, incidencias o sugerencias de mejora respondiendo a este correo. Todas las aportaciones se revisarán para priorizar próximos avances.

Si desea recibir un aviso cuando la plataforma esté plenamente operativa, indíquelo en su respuesta y se incluirá en la notificación de actualización.

Atentamente,
Equipo de Orientia`;

export default function AdminComunicacionesPage() {
  const [users, setUsers] = useState<Recipient[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sending, setSending] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({
        q: search.trim(),
        role: roleFilter,
        verified: verifiedFilter,
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
      toast.error("Comunicaciones", {
        description:
          error instanceof Error ? error.message : "No se pudo cargar el listado.",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, verifiedFilter]);

  const selectableUsers = useMemo(
    () => users.filter((u) => Boolean(u.email && String(u.email).trim().length > 0)),
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
      toast.error("Selecciona al menos una destinataria.");
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

    setSending(true);
    try {
      const response = await fetch("/api/admin/communications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          recipientIds: [...selectedIds],
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo enviar la comunicación.");
      }

      if (data.failed > 0) {
        toast.warning("Envío parcial", {
          description: `Enviados: ${data.sent}. Fallidos: ${data.failed}.`,
        });
      } else {
        toast.success("Comunicación enviada", {
          description: `Enviada a ${data.sent} destinatarias.`,
        });
      }
    } catch (error) {
      toast.error("Error al enviar", {
        description:
          error instanceof Error
            ? error.message
            : "No se pudo enviar la comunicación.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Comunicaciones
            </h1>
            <p className="text-sm text-muted-foreground">
              Filtra usuarias registradas y envía comunicados con Plunk.
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <Mail className="mr-1.5 h-3.5 w-3.5" />
            Envío manual
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Destinatarias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="md:col-span-1">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los roles</SelectItem>
                      <SelectItem value="usuario">Solo usuarias</SelectItem>
                      <SelectItem value="admin">Solo admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1">
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
                <div className="md:col-span-1">
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

              <div className="rounded-md border border-emerald-100">
                <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-900">
                  <label className="inline-flex items-center gap-2 font-medium">
                    <Checkbox
                      checked={allVisibleSelected}
                      onCheckedChange={(checked) => toggleAllVisible(Boolean(checked))}
                    />
                    Seleccionar visibles
                  </label>
                  <span>
                    {selectedCount} seleccionadas de {selectableUsers.length}
                  </span>
                </div>
                <div className="max-h-[420px] overflow-auto">
                  {loadingUsers ? (
                    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                      Cargando listado...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                      No hay usuarias para los filtros seleccionados.
                    </div>
                  ) : (
                    users.map((user) => {
                      const checked = selectedIds.has(user.id);
                      const hasEmail = Boolean(user.email);
                      const verified = Boolean(user.emailVerified);
                      return (
                        <div
                          key={user.id}
                          className="flex items-center justify-between gap-3 border-b border-emerald-50 px-3 py-2 last:border-b-0"
                        >
                          <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                            <Checkbox
                              checked={checked}
                              disabled={!hasEmail}
                              onCheckedChange={(next) =>
                                toggleOne(user.id, Boolean(next))
                              }
                            />
                            <span className="min-w-0 text-sm">
                              <span className="block truncate font-medium text-gray-900">
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
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700"
                              }
                            >
                              {verified ? "Verificada" : "No verificada"}
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

          <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Redactar comunicado</CardTitle>
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
                placeholder="Mensaje del comunicado"
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
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {sending
                    ? "Enviando..."
                    : `Enviar a ${selectedCount} destinatarias`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

