"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Eye,
  ArrowUpDown,
  Download,
  ClipboardPenLine,
  FileText,
  FolderOpen,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Trash2,
  Save,
  ShieldCheck,
  Upload,
  UserCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import AndaluciaSchoolSelector from "@/components/forms/AndaluciaSchoolSelector";
import Spinner from "@/components/ui/Spinner";

type ReportTone = "tecnico" | "equilibrado" | "cercano";

type SettingsForm = {
  fullName: string;
  email: string;
  phone: string;
  professionalId: string;
  schoolName: string;
  position: string;
  specialization: string;
  location: string;
  signature: string;
  reportTone: ReportTone;
  includeSignatureInReports: boolean;
  includeConfidentialityFooter: boolean;
  autoRewriteNotes: boolean;
  emailNotifications: boolean;
  draftReminders: boolean;
  weeklySummary: boolean;
};

type PersonalDoc = {
  name: string;
  path: string;
  size: number;
  createdAt: string;
  url: string;
};

const DEFAULT_FORM: SettingsForm = {
  fullName: "",
  email: "",
  phone: "",
  professionalId: "",
  schoolName: "",
  position: "",
  specialization: "",
  location: "",
  signature: "",
  reportTone: "equilibrado",
  includeSignatureInReports: true,
  includeConfidentialityFooter: true,
  autoRewriteNotes: true,
  emailNotifications: true,
  draftReminders: true,
  weeklySummary: false,
};

export default function AjustesPerfilPage() {
  const [form, setForm] = useState<SettingsForm>(DEFAULT_FORM);
  const [initialForm, setInitialForm] = useState<SettingsForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [deletingDocPath, setDeletingDocPath] = useState<string | null>(null);
  const [renamingDocPath, setRenamingDocPath] = useState<string | null>(null);
  const [editingDocPath, setEditingDocPath] = useState<string | null>(null);
  const [editingDocName, setEditingDocName] = useState("");
  const [docs, setDocs] = useState<PersonalDoc[]>([]);
  const [previewDoc, setPreviewDoc] = useState<PersonalDoc | null>(null);
  const [previewText, setPreviewText] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [docQuery, setDocQuery] = useState("");
  const [docSortField, setDocSortField] = useState<"createdAt" | "name" | "size">(
    "createdAt",
  );
  const [docSortDesc, setDocSortDesc] = useState(true);
  const [error, setError] = useState("");

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm],
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/profile/settings", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "No se pudo cargar la configuracion.");
        }
        const next = { ...DEFAULT_FORM, ...(data.settings || {}) };
        setForm(next);
        setInitialForm(next);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo cargar la configuracion.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    const loadDocs = async () => {
      setLoadingDocs(true);
      try {
        const res = await fetch("/api/profile/personal-docs", {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "No se pudieron cargar los documentos.");
        }
        setDocs(Array.isArray(data.files) ? data.files : []);
      } catch (err) {
        toast.error("Documentos personales", {
          description:
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los documentos.",
        });
      } finally {
        setLoadingDocs(false);
      }
    };

    void loadDocs();
  }, []);

  const setField = <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudieron guardar los ajustes.");
      }
      const saved = { ...DEFAULT_FORM, ...(data.settings || form) };
      setForm(saved);
      setInitialForm(saved);
      toast.success("Ajustes guardados", {
        description: "Tu perfil profesional se actualizo correctamente.",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudieron guardar los ajustes.";
      setError(message);
      toast.error("Error al guardar", { description: message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setError("");
  };

  const handleUploadDoc = async (file: File) => {
    const payload = new FormData();
    payload.append("file", file);
    setUploadingDoc(true);
    try {
      const res = await fetch("/api/profile/personal-docs", {
        method: "POST",
        body: payload,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo subir el documento.");
      }
      setDocs((current) => [data.file as PersonalDoc, ...current]);
      toast.success("Documento subido", {
        description: "Archivo personal guardado correctamente.",
      });
    } catch (err) {
      toast.error("Error al subir", {
        description:
          err instanceof Error ? err.message : "No se pudo subir el documento.",
      });
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteDoc = async (path: string) => {
    setDeletingDocPath(path);
    try {
      const res = await fetch("/api/profile/personal-docs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo eliminar el documento.");
      }
      setDocs((current) => current.filter((item) => item.path !== path));
      toast.success("Documento eliminado");
    } catch (err) {
      toast.error("Error al eliminar", {
        description:
          err instanceof Error ? err.message : "No se pudo eliminar el documento.",
      });
    } finally {
      setDeletingDocPath(null);
    }
  };

  const startRenameDoc = (doc: PersonalDoc) => {
    setEditingDocPath(doc.path);
    setEditingDocName(doc.name);
  };

  const cancelRenameDoc = () => {
    setEditingDocPath(null);
    setEditingDocName("");
  };

  const handleRenameDoc = async (doc: PersonalDoc) => {
    const newName = editingDocName.trim();
    if (!newName || newName.length < 3) {
      toast.error("Nombre invalido", {
        description: "El nombre debe tener al menos 3 caracteres.",
      });
      return;
    }

    setRenamingDocPath(doc.path);
    try {
      const res = await fetch("/api/profile/personal-docs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: doc.path, newName }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo renombrar el documento.");
      }

      setDocs((current) =>
        current.map((item) =>
          item.path === doc.path
            ? {
                ...item,
                path: data.path as string,
                name: data.name as string,
              }
            : item,
        ),
      );

      setPreviewDoc((current) =>
        current && current.path === doc.path
          ? {
              ...current,
              path: data.path as string,
              name: data.name as string,
            }
          : current,
      );

      cancelRenameDoc();
      toast.success("Documento renombrado");
    } catch (err) {
      toast.error("Error al renombrar", {
        description:
          err instanceof Error ? err.message : "No se pudo renombrar el documento.",
      });
    } finally {
      setRenamingDocPath(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes <= 0) return "0 KB";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const visibleDocs = useMemo(() => {
    const query = docQuery.trim().toLowerCase();
    const filtered = query
      ? docs.filter((doc) => doc.name.toLowerCase().includes(query))
      : docs;
    const sorted = [...filtered].sort((a, b) => {
      if (docSortField === "name") {
        return a.name.localeCompare(b.name, "es");
      }
      if (docSortField === "size") {
        return a.size - b.size;
      }
      return (
        new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
      );
    });
    if (docSortDesc) sorted.reverse();
    return sorted;
  }, [docs, docQuery, docSortField, docSortDesc]);

  const getExtension = (name: string) => {
    const parts = name.toLowerCase().split(".");
    return parts.length > 1 ? parts.at(-1) || "" : "";
  };

  const handlePreviewDoc = async (doc: PersonalDoc) => {
    setPreviewDoc(doc);
    setPreviewError("");
    setPreviewText("");
    const ext = getExtension(doc.name);
    const isTextLike = ["txt", "md", "rtf"].includes(ext);
    const isPdf = ext === "pdf";
    if (isPdf) {
      setPreviewLoading(false);
      return;
    }

    setPreviewLoading(true);
    try {
      const response = await fetch(
        `/api/profile/personal-docs/file?path=${encodeURIComponent(doc.path)}`,
        { cache: "no-store" },
      );
      if (!response.ok) {
        throw new Error("No se pudo cargar la vista previa del documento.");
      }
      const blob = await response.blob();
      if (isTextLike) {
        const text = await blob.text();
        setPreviewText(text);
      }
    } catch (err) {
      setPreviewError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar la vista previa del documento.",
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const buildDocUrl = (path: string, download = false) =>
    `/api/profile/personal-docs/file?path=${encodeURIComponent(path)}${download ? "&download=1" : ""}`;

  return (
    <div className="w-full px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  Ajustes de cuenta
                </Badge>
                <Badge variant="secondary">Perfil profesional</Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Perfil y configuracion
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Define los datos que se reutilizan en informes, firma y flujo de trabajo.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                Datos asociados a tu cuenta
              </span>
            </div>
          </div>
        </section>

        {loading ? (
          <Spinner variant="centered" />
        ) : (
          <>
            {error ? (
              <Card className="border-red-200 bg-red-50/70 shadow-sm">
                <CardContent className="py-4 text-sm text-red-700">{error}</CardContent>
              </Card>
            ) : null}

            <div className="space-y-6">
              <Card className="border-emerald-100/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-emerald-600" />
                    Perfil profesional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nombre completo">
                      <Input
                        value={form.fullName}
                        onChange={(e) => setField("fullName", e.target.value)}
                        placeholder="Nombre y apellidos"
                      />
                    </Field>
                    <Field label="Email">
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input value={form.email} readOnly className="pl-9 bg-gray-50" />
                      </div>
                    </Field>
                    <Field label="Telefono">
                      <Input
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        placeholder="+34 600 000 000"
                      />
                    </Field>
                    <Field label="Numero de colegiado">
                      <Input
                        value={form.professionalId}
                        onChange={(e) => setField("professionalId", e.target.value)}
                        placeholder="N. colegiado"
                      />
                    </Field>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Centro educativo">
                      <Input
                        value={form.schoolName}
                        onChange={(e) => setField("schoolName", e.target.value)}
                        placeholder="Nombre del centro"
                      />
                    </Field>
                    <Field label="Cargo">
                      <Input
                        value={form.position}
                        onChange={(e) => setField("position", e.target.value)}
                        placeholder="Orientador/a, psicopedagogo/a"
                      />
                    </Field>
                    <Field label="Especialidad">
                      <Input
                        value={form.specialization}
                        onChange={(e) => setField("specialization", e.target.value)}
                        placeholder="NEAE, convivencia, mediacion..."
                      />
                    </Field>
                    <Field label="Ubicacion">
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          value={form.location}
                          onChange={(e) => setField("location", e.target.value)}
                          placeholder="Ciudad, provincia"
                          className="pl-9"
                        />
                      </div>
                    </Field>
                  </div>

                  <AndaluciaSchoolSelector
                    onSelectSchool={(selection) => {
                      setField("schoolName", selection.schoolName);
                      setField(
                        "location",
                        [selection.locality, selection.municipality, selection.province]
                          .filter(Boolean)
                          .join(", "),
                      );
                      toast.success("Centro aplicado", {
                        description:
                          "Se han actualizado los campos de centro y ubicacion.",
                      });
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="border-emerald-100/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardPenLine className="h-4 w-4 text-emerald-600" />
                    Informes y notificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <Field label="Firma profesional">
                      <Textarea
                        value={form.signature}
                        onChange={(e) => setField("signature", e.target.value)}
                        rows={4}
                        placeholder="Nombre, cargo, centro y via de contacto"
                      />
                    </Field>
                    <Field label="Estilo de redaccion por defecto">
                      <Select
                        value={form.reportTone}
                        onValueChange={(value: ReportTone) => setField("reportTone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tecnico">Tecnico</SelectItem>
                          <SelectItem value="equilibrado">Equilibrado</SelectItem>
                          <SelectItem value="cercano">Cercano a familias</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Informes
                      </p>
                      <div className="space-y-2">
                        <ToggleCompactRow
                          label="Incluir firma en informes PDF"
                          checked={form.includeSignatureInReports}
                          onCheckedChange={(checked) =>
                            setField("includeSignatureInReports", checked)
                          }
                        />
                        <ToggleCompactRow
                          label="Incluir pie de confidencialidad"
                          checked={form.includeConfidentialityFooter}
                          onCheckedChange={(checked) =>
                            setField("includeConfidentialityFooter", checked)
                          }
                        />
                        <ToggleCompactRow
                          label="Reescritura asistida de notas por IA"
                          checked={form.autoRewriteNotes}
                          onCheckedChange={(checked) => setField("autoRewriteNotes", checked)}
                        />
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Notificaciones
                      </p>
                      <div className="space-y-2">
                        <ToggleCompactRow
                          label="Recibir notificaciones por email"
                          checked={form.emailNotifications}
                          onCheckedChange={(checked) => setField("emailNotifications", checked)}
                        />
                        <ToggleCompactRow
                          label="Recordatorios de borradores pendientes"
                          checked={form.draftReminders}
                          onCheckedChange={(checked) => setField("draftReminders", checked)}
                        />
                        <ToggleCompactRow
                          label="Resumen semanal de actividad"
                          checked={form.weeklySummary}
                          onCheckedChange={(checked) => setField("weeklySummary", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-emerald-600" />
                    Documentos personales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-emerald-400 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900">
                      {uploadingDoc ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {uploadingDoc ? "Subiendo..." : "Subir documento"}
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.doc,.txt,.odt,.rtf,.md"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            void handleUploadDoc(file);
                          }
                          e.currentTarget.value = "";
                        }}
                        disabled={uploadingDoc}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Formatos: PDF, DOCX, DOC, TXT, ODT, RTF y MD. Maximo 10MB.
                    </p>

                    {loadingDocs ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando documentos...
                      </div>
                    ) : docs.length === 0 ? (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-muted-foreground">
                        No hay documentos personales guardados.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid gap-2 sm:grid-cols-[1fr,170px,44px]">
                          <Input
                            value={docQuery}
                            onChange={(e) => setDocQuery(e.target.value)}
                            placeholder="Buscar por nombre..."
                          />
                          <Select
                            value={docSortField}
                            onValueChange={(value: "createdAt" | "name" | "size") =>
                              setDocSortField(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="createdAt">Fecha</SelectItem>
                              <SelectItem value="name">Nombre</SelectItem>
                              <SelectItem value="size">Tamano</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setDocSortDesc((prev) => !prev)}
                            title={docSortDesc ? "Orden descendente" : "Orden ascendente"}
                          >
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </div>

                        {visibleDocs.length === 0 ? (
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-muted-foreground">
                            No hay resultados para la busqueda actual.
                          </div>
                        ) : null}

                        <div className="space-y-2">
                          {visibleDocs.map((doc) => (
                            <div key={doc.path}>
                              <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
                                    <p className="truncate text-sm font-medium text-gray-900">
                                      {doc.name}
                                    </p>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {formatSize(doc.size)}
                                    {doc.createdAt
                                      ? ` · ${new Date(doc.createdAt).toLocaleDateString("es-ES")}`
                                      : ""}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                    onClick={() => startRenameDoc(doc)}
                                    aria-label={`Renombrar ${doc.name}`}
                                    title="Renombrar"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                    onClick={() => void handlePreviewDoc(doc)}
                                    aria-label={`Ver ${doc.name}`}
                                    title="Vista previa"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {doc.path ? (
                                    <a
                                      href={buildDocUrl(doc.path)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:border-emerald-300 hover:text-emerald-700"
                                      aria-label={`Abrir ${doc.name}`}
                                      title="Abrir"
                                    >
                                      <Download className="h-4 w-4" />
                                    </a>
                                  ) : null}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    disabled={deletingDocPath === doc.path}
                                    onClick={() => void handleDeleteDoc(doc.path)}
                                    aria-label={`Eliminar ${doc.name}`}
                                    title="Eliminar"
                                  >
                                    {deletingDocPath === doc.path ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              {editingDocPath === doc.path ? (
                                <div className="mt-2 grid gap-2 sm:grid-cols-[1fr,auto,auto]">
                                  <Input
                                    value={editingDocName}
                                    onChange={(e) => setEditingDocName(e.target.value)}
                                    placeholder="Nuevo nombre con extension"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={renamingDocPath === doc.path}
                                    onClick={() => void handleRenameDoc(doc)}
                                  >
                                    {renamingDocPath === doc.path ? (
                                      <span className="inline-flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Guardando
                                      </span>
                                    ) : (
                                      "Guardar"
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={renamingDocPath === doc.path}
                                    onClick={cancelRenameDoc}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewDoc ? (
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-emerald-900">
                            Vista previa: {previewDoc.name}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPreviewDoc(null);
                              setPreviewText("");
                              setPreviewError("");
                            }}
                          >
                            Cerrar
                          </Button>
                        </div>
                        {(() => {
                          const ext = getExtension(previewDoc.name);
                          if (ext === "pdf") {
                            return (
                              <object
                                data={buildDocUrl(previewDoc.path)}
                                type="application/pdf"
                                className="h-[460px] w-full rounded-md border border-emerald-100 bg-white"
                              >
                                <div className="rounded-md border border-emerald-100 bg-white p-3 text-sm text-muted-foreground">
                                  Tu navegador no permite vista embebida de PDF.
                                  <a
                                    href={buildDocUrl(previewDoc.path)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ml-1 font-medium text-emerald-700 underline"
                                  >
                                    Abrir documento
                                  </a>
                                </div>
                              </object>
                            );
                          }
                          if (["txt", "md", "rtf"].includes(ext)) {
                            if (previewLoading) {
                              return (
                                <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Cargando vista previa...
                                </div>
                              );
                            }
                            if (previewError) {
                              return <p className="text-sm text-red-600">{previewError}</p>;
                            }
                            return (
                              <pre className="max-h-[460px] overflow-auto whitespace-pre-wrap rounded-md border border-emerald-100 bg-white p-3 text-xs text-gray-800">
                                {previewText || "Documento vacio."}
                              </pre>
                            );
                          }
                          return (
                            <div className="rounded-md border border-emerald-100 bg-white p-3 text-sm text-muted-foreground">
                              Este formato no admite vista inline en navegador.
                              <a
                                href={buildDocUrl(previewDoc.path)}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-1 font-medium text-emerald-700 underline"
                              >
                                Abrir documento
                              </a>
                            </div>
                          );
                        })()}
                      </div>
                    ) : null}
                </CardContent>
              </Card>
            </div>

            <Card className="border-emerald-200 bg-white/95 shadow-sm">
              <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Estado de cambios</p>
                  <p className="text-xs text-muted-foreground">
                    {isDirty
                      ? "Tienes cambios sin guardar."
                      : "Todo esta sincronizado con tu cuenta."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={handleReset} disabled={!isDirty || saving}>
                    Restaurar
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSave}
                    disabled={!isDirty || saving}
                  >
                    {saving ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Guardando...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Guardar cambios
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function ToggleCompactRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-white bg-white px-3 py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
