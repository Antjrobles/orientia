"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Building2,
  UserRound,
  CalendarDays,
  Layers3,
  Trash2,
  Check,
  X,
  Pencil,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type CasoIntervencion = {
  id: string;
  iniciales_alumno: string;
  centro_nombre: string;
  created_at: string;
  updated_at: string;
};

type Intervencion = {
  id: string;
  caso_id: string;
  fecha_intervencion: string;
  ambito: "escolar" | "sociocultural";
  subambito:
    | "tutoria"
    | "profesorado"
    | "claustro"
    | "equipo_directivo"
    | "orientacion"
    | "convivencia"
    | "evaluacion"
    | "familia"
    | "servicios_sociales"
    | "entorno_comunitario"
    | "salud_mental"
    | "proteccion_menor"
    | "otros";
  titulo: string;
  texto_redactado_ia: string;
  texto_original: string;
  created_at: string;
};

const CONTEXTOS_POR_AMBITO = {
  escolar: [
    { value: "tutoria", label: "Tutoria" },
    { value: "profesorado", label: "Profesorado" },
    { value: "claustro", label: "Claustro" },
    { value: "equipo_directivo", label: "Equipo directivo" },
    { value: "orientacion", label: "Orientación" },
    { value: "convivencia", label: "Convivencia" },
    { value: "evaluacion", label: "Evaluación" },
    { value: "otros", label: "Otros" },
  ],
  sociocultural: [
    { value: "familia", label: "Familia" },
    { value: "servicios_sociales", label: "Servicios Sociales" },
    { value: "entorno_comunitario", label: "Entorno comunitario" },
    { value: "salud_mental", label: "Salud mental / sanidad" },
    { value: "proteccion_menor", label: "Protección de menores" },
    { value: "otros", label: "Otros" },
  ],
} as const;

type ContextoEspecifico =
  (typeof CONTEXTOS_POR_AMBITO)[keyof typeof CONTEXTOS_POR_AMBITO][number]["value"];
type AmbitoIntervencion = "escolar" | "sociocultural";
type IntervencionAgrupada = {
  groupKey: string;
  ids: string[];
  rows: Array<{ id: string; ambito: AmbitoIntervencion; subambito: ContextoEspecifico }>;
  fecha_intervencion: string;
  ambito: AmbitoIntervencion;
  subambitos: ContextoEspecifico[];
  titulo: string;
  texto_original: string;
  texto_redactado_ia: string;
};
type CaseSortField = "updated_at" | "iniciales_alumno" | "centro_nombre" | "created_at";

const AMBITO_BY_CONTEXTO: Record<ContextoEspecifico, AmbitoIntervencion> = {
  tutoria: "escolar",
  profesorado: "escolar",
  claustro: "escolar",
  equipo_directivo: "escolar",
  orientacion: "escolar",
  convivencia: "escolar",
  evaluacion: "escolar",
  familia: "sociocultural",
  servicios_sociales: "sociocultural",
  entorno_comunitario: "sociocultural",
  salud_mental: "sociocultural",
  proteccion_menor: "sociocultural",
  otros: "escolar",
};

function labelContexto(value: Intervencion["subambito"]) {
  const all = [...CONTEXTOS_POR_AMBITO.escolar, ...CONTEXTOS_POR_AMBITO.sociocultural];
  return all.find((item) => item.value === value)?.label || value;
}

function normalizeInitialsClient(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}

function formatDateEs(value: string) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function IntervencionesPage() {
  const [searchInitials, setSearchInitials] = useState("");
  const [searchCenter, setSearchCenter] = useState("");
  const [cases, setCases] = useState<CasoIntervencion[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [interventions, setInterventions] = useState<Intervencion[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [loadingInterventions, setLoadingInterventions] = useState(false);
  const [error, setError] = useState("");

  const [newCaseInitials, setNewCaseInitials] = useState("");
  const [newCaseCenter, setNewCaseCenter] = useState("");
  const [creatingCase, setCreatingCase] = useState(false);
  const [editingCase, setEditingCase] = useState<CasoIntervencion | null>(null);
  const [editCaseInitials, setEditCaseInitials] = useState("");
  const [editCaseCenter, setEditCaseCenter] = useState("");
  const [savingCaseEdit, setSavingCaseEdit] = useState(false);

  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);
  const [pendingDeleteCase, setPendingDeleteCase] = useState<CasoIntervencion | null>(null);

  const [editingInterventionKey, setEditingInterventionKey] = useState<string | null>(null);
  const [editInterventionDate, setEditInterventionDate] = useState("");
  const [editInterventionAmbitos, setEditInterventionAmbitos] = useState<
    AmbitoIntervencion[]
  >([]);
  const [editInterventionContexts, setEditInterventionContexts] = useState<
    ContextoEspecifico[]
  >([]);
  const [editInterventionTitle, setEditInterventionTitle] = useState("");
  const [editInterventionText, setEditInterventionText] = useState("");
  const [updatingInterventionKey, setUpdatingInterventionKey] = useState<string | null>(null);
  const [pendingDeleteIntervention, setPendingDeleteIntervention] = useState<IntervencionAgrupada | null>(
    null,
  );
  const [deletingInterventionKey, setDeletingInterventionKey] = useState<string | null>(null);

  const [fechaIntervencion, setFechaIntervencion] = useState("");
  const [ambitosSeleccionados, setAmbitosSeleccionados] = useState<AmbitoIntervencion[]>([]);
  const [contextosSeleccionados, setContextosSeleccionados] = useState<ContextoEspecifico[]>([]);
  const [titulo, setTitulo] = useState("");
  const [textoOriginal, setTextoOriginal] = useState("");
  const [savingIntervention, setSavingIntervention] = useState(false);
  const [activeTab, setActiveTab] = useState<"registrar" | "historial">("registrar");
  const [showCaseTools, setShowCaseTools] = useState(true);
  const [caseSortField, setCaseSortField] = useState<CaseSortField>("updated_at");
  const [caseSortDesc, setCaseSortDesc] = useState(true);
  const [prefillLatestOnSelect, setPrefillLatestOnSelect] = useState(false);

  const selectedCase = useMemo(
    () => cases.find((item) => item.id === selectedCaseId) || null,
    [cases, selectedCaseId],
  );

  const contextoOptions = useMemo(
    () => {
      const merged = [...CONTEXTOS_POR_AMBITO.escolar, ...CONTEXTOS_POR_AMBITO.sociocultural];
      if (ambitosSeleccionados.length === 0) return [];
      const filtered = merged.filter((option) => {
        if (option.value === "otros") return true;
        const amb = AMBITO_BY_CONTEXTO[option.value];
        return ambitosSeleccionados.includes(amb);
      });
      const unique = new Map<ContextoEspecifico, (typeof merged)[number]>();
      for (const item of filtered) {
        if (!unique.has(item.value)) {
          unique.set(item.value, item);
        }
      }
      return Array.from(unique.values());
    },
    [ambitosSeleccionados],
  );

  const groupedInterventions = useMemo<IntervencionAgrupada[]>(() => {
    const groups = new Map<string, IntervencionAgrupada>();
    for (const item of interventions) {
      const key = [
        item.fecha_intervencion,
        item.ambito,
        item.titulo.trim().toLowerCase(),
        item.texto_original.trim(),
      ].join("|");
      const existing = groups.get(key);
      if (!existing) {
        groups.set(key, {
          groupKey: key,
          ids: [item.id],
          rows: [{ id: item.id, ambito: item.ambito, subambito: item.subambito }],
          fecha_intervencion: item.fecha_intervencion,
          ambito: item.ambito,
          subambitos: [item.subambito],
          titulo: item.titulo,
          texto_original: item.texto_original,
          texto_redactado_ia: item.texto_redactado_ia,
        });
      } else {
        existing.ids.push(item.id);
        existing.rows.push({ id: item.id, ambito: item.ambito, subambito: item.subambito });
        if (!existing.subambitos.includes(item.subambito)) {
          existing.subambitos.push(item.subambito);
        }
      }
    }
    return Array.from(groups.values()).sort((a, b) => {
      const byDate = b.fecha_intervencion.localeCompare(a.fecha_intervencion);
      if (byDate !== 0) return byDate;
      return b.groupKey.localeCompare(a.groupKey);
    });
  }, [interventions]);

  const timelineByDate = useMemo(() => {
    const sections = new Map<string, IntervencionAgrupada[]>();
    for (const item of groupedInterventions) {
      const dateKey = item.fecha_intervencion.slice(0, 10);
      const existing = sections.get(dateKey);
      if (existing) {
        existing.push(item);
      } else {
        sections.set(dateKey, [item]);
      }
    }
    return Array.from(sections.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, items]) => ({ date, items }));
  }, [groupedInterventions]);

  const sortedCases = useMemo(() => {
    const next = [...cases];
    next.sort((a, b) => {
      if (caseSortField === "iniciales_alumno") {
        return a.iniciales_alumno.localeCompare(b.iniciales_alumno, "es");
      }
      if (caseSortField === "centro_nombre") {
        return a.centro_nombre.localeCompare(b.centro_nombre, "es");
      }
      if (caseSortField === "created_at") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
    });
    if (caseSortDesc) {
      next.reverse();
    }
    return next;
  }, [cases, caseSortDesc, caseSortField]);

  useEffect(() => {
    if (!contextoOptions.length) {
      if (contextosSeleccionados.length) setContextosSeleccionados([]);
      return;
    }
    const valid = contextosSeleccionados.filter((item) =>
      contextoOptions.some((option) => option.value === item),
    );
    if (valid.length !== contextosSeleccionados.length) {
      setContextosSeleccionados(valid);
    }
  }, [contextoOptions, contextosSeleccionados]);

  const fetchCases = async (initials = "", center = "") => {
    setLoadingCases(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (initials.trim()) params.set("q", initials.trim());
      if (center.trim()) params.set("centro", center.trim());
      const res = await fetch(`/api/intervenciones/casos?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudieron cargar los casos");
      }
      const incomingCases = data.casos || [];
      setCases(incomingCases);
      if (
        selectedCaseId &&
        !incomingCases.some((item: CasoIntervencion) => item.id === selectedCaseId)
      ) {
        setSelectedCaseId("");
        setInterventions([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
      toast.error(message);
      setCases([]);
    } finally {
      setLoadingCases(false);
    }
  };

  const fetchInterventions = async (caseId: string) => {
    if (!caseId) {
      setInterventions([]);
      return;
    }
    setLoadingInterventions(true);
    setError("");
    try {
      const res = await fetch(`/api/intervenciones?casoId=${caseId}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudieron cargar las intervenciones");
      }
      const incomingInterventions: Intervencion[] = data.intervenciones || [];
      setInterventions(incomingInterventions);

      if (prefillLatestOnSelect) {
        if (incomingInterventions.length === 0) {
          setFechaIntervencion("");
          setAmbitosSeleccionados([]);
          setContextosSeleccionados([]);
          setTitulo("");
          setTextoOriginal("");
        } else {
          const latest = [...incomingInterventions].sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          )[0];
          const linked = incomingInterventions.filter(
            (item) =>
              item.created_at === latest.created_at &&
              item.fecha_intervencion === latest.fecha_intervencion &&
              item.titulo === latest.titulo &&
              item.texto_original === latest.texto_original,
          );
          setFechaIntervencion(latest.fecha_intervencion.slice(0, 10));
          setAmbitosSeleccionados(
            Array.from(new Set(linked.map((item) => item.ambito))),
          );
          setContextosSeleccionados(
            Array.from(new Set(linked.map((item) => item.subambito))),
          );
          setTitulo(latest.titulo);
          setTextoOriginal(latest.texto_original);
        }
        setPrefillLatestOnSelect(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
      toast.error(message);
      setInterventions([]);
      setPrefillLatestOnSelect(false);
    } finally {
      setLoadingInterventions(false);
    }
  };

  useEffect(() => {
    fetchCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCaseId) fetchInterventions(selectedCaseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCaseId]);

  useEffect(() => {
    if (!selectedCaseId) setShowCaseTools(true);
  }, [selectedCaseId]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    await fetchCases(searchInitials, searchCenter);
  };

  const handleCreateCase = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedInitials = normalizeInitialsClient(newCaseInitials);
    const normalizedCenter = newCaseCenter.trim().replace(/\s+/g, " ");

    if (normalizedInitials.length < 2) {
      const message = "Escribe al menos 2 letras en las iniciales (ejemplo: JBL).";
      setError(message);
      toast.error(message);
      return;
    }
    if (normalizedCenter.length < 2) {
      const message = "El nombre del centro debe tener al menos 2 caracteres.";
      setError(message);
      toast.error(message);
      return;
    }

    setCreatingCase(true);
    setError("");
    try {
      const res = await fetch("/api/intervenciones/casos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inicialesAlumno: normalizedInitials,
          centroNombre: normalizedCenter,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo crear el caso");
      }

      await fetchCases(normalizedInitials, normalizedCenter);
      setSelectedCaseId(data.caso.id);
      setActiveTab("registrar");
      setNewCaseInitials("");
      setNewCaseCenter("");
      toast.success("Caso creado correctamente.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
      toast.error(message);
    } finally {
      setCreatingCase(false);
    }
  };

  const requestDeleteCase = (item: CasoIntervencion) => {
    setPendingDeleteCase(item);
    setError("");
  };

  const openEditCase = (item: CasoIntervencion) => {
    setEditingCase(item);
    setEditCaseInitials(item.iniciales_alumno);
    setEditCaseCenter(item.centro_nombre);
    setError("");
  };

  const handleSaveCaseEdit = async () => {
    if (!editingCase) return;
    const normalizedInitials = normalizeInitialsClient(editCaseInitials);
    const normalizedCenter = editCaseCenter.trim().replace(/\s+/g, " ");
    if (normalizedInitials.length < 2) {
      const message = "Escribe al menos 2 letras en las iniciales (ejemplo: JBL).";
      setError(message);
      toast.error(message);
      return;
    }
    if (normalizedCenter.length < 2) {
      const message = "El nombre del centro debe tener al menos 2 caracteres.";
      setError(message);
      toast.error(message);
      return;
    }

    setSavingCaseEdit(true);
    setError("");
    try {
      const res = await fetch("/api/intervenciones/casos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCase.id,
          inicialesAlumno: normalizedInitials,
          centroNombre: normalizedCenter,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo actualizar el caso");
      }

      await fetchCases(searchInitials, searchCenter);
      setEditingCase(null);
      toast.success("Caso actualizado correctamente.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
      toast.error(message);
    } finally {
      setSavingCaseEdit(false);
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    setDeletingCaseId(caseId);
    setError("");
    try {
      const res = await fetch("/api/intervenciones/casos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: caseId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo eliminar el caso");
      }

      const deletedId = data.deletedId || caseId;
      setCases((prev) => prev.filter((item) => item.id !== deletedId));
      if (selectedCaseId === deletedId) {
        setSelectedCaseId("");
        setInterventions([]);
        setEditingInterventionKey(null);
      }
      if (pendingDeleteCase?.id === deletedId) {
        setPendingDeleteCase(null);
      }
      toast.success("Caso eliminado correctamente.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
      toast.error(message);
    } finally {
      setDeletingCaseId(null);
    }
  };

  const startEditIntervention = (intervention: IntervencionAgrupada) => {
    setEditingInterventionKey(intervention.groupKey);
    setEditInterventionDate(intervention.fecha_intervencion.slice(0, 10));
    setEditInterventionAmbitos(
      Array.from(
        new Set(
          intervention.subambitos.map((sub) =>
            sub === "otros" ? intervention.ambito : AMBITO_BY_CONTEXTO[sub],
          ),
        ),
      ),
    );
    setEditInterventionContexts(intervention.subambitos);
    setEditInterventionTitle(intervention.titulo);
    setEditInterventionText(intervention.texto_original);
    setError("");
  };

  const cancelEditIntervention = () => {
    setEditingInterventionKey(null);
    setEditInterventionDate("");
    setEditInterventionAmbitos([]);
    setEditInterventionContexts([]);
    setEditInterventionTitle("");
    setEditInterventionText("");
  };

  const handleSaveIntervention = async (intervention: IntervencionAgrupada) => {
    const nextDate = editInterventionDate;
    const nextAmbitos = editInterventionAmbitos;
    const nextContexts = Array.from(new Set(editInterventionContexts));
    const nextTitle = editInterventionTitle.trim();
    const nextText = editInterventionText.trim();
    if (!nextDate || nextAmbitos.length === 0 || nextContexts.length === 0 || !nextTitle || !nextText) {
      const message = "Fecha, ámbito, contexto, título y nota son obligatorios.";
      setError(message);
      toast.error(message);
      return;
    }
    if (nextTitle.length < 3) {
      const message = "El título debe tener al menos 3 caracteres.";
      setError(message);
      toast.error(message);
      return;
    }
    if (nextText.length < 10) {
      const message = "La nota debe tener al menos 10 caracteres.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!selectedCaseId) {
      const message = "Selecciona un caso antes de editar.";
      setError(message);
      toast.error(message);
      return;
    }

    setUpdatingInterventionKey(intervention.groupKey);
    setError("");
    try {
      const rowsByPair = new Map<
        string,
        Array<{ id: string; ambito: AmbitoIntervencion; subambito: ContextoEspecifico }>
      >();
      for (const row of intervention.rows) {
        const key = `${row.ambito}|${row.subambito}`;
        const existing = rowsByPair.get(key);
        if (existing) existing.push(row);
        else rowsByPair.set(key, [row]);
      }

      for (const context of nextContexts) {
        const targetAmbitos =
          context === "otros"
            ? nextAmbitos
            : [AMBITO_BY_CONTEXTO[context]].filter((amb) => nextAmbitos.includes(amb));
        for (const derivedAmbito of targetAmbitos) {
          const bucket = rowsByPair.get(`${derivedAmbito}|${context}`);
          const existingRow = bucket && bucket.length > 0 ? bucket.shift() : null;
          if (existingRow) {
            const res = await fetch("/api/intervenciones", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: existingRow.id,
                fechaIntervencion: nextDate,
                ambito: derivedAmbito,
                subambito: context,
                titulo: nextTitle,
                textoOriginal: nextText,
              }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
              throw new Error(data.error || "No se pudo actualizar la intervención");
            }
          } else {
            const res = await fetch("/api/intervenciones", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                casoId: selectedCaseId,
                fechaIntervencion: nextDate,
                ambito: derivedAmbito,
                subambitos: [context],
                titulo: nextTitle,
                textoOriginal: nextText,
              }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
              throw new Error(data.error || "No se pudo añadir el contexto");
            }
          }
        }
      }

      const idsToDelete: string[] = [];
      for (const remaining of rowsByPair.values()) {
        for (const row of remaining) {
          idsToDelete.push(row.id);
        }
      }
      for (const id of idsToDelete) {
        const res = await fetch("/api/intervenciones", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "No se pudo quitar un contexto");
        }
      }

      if (selectedCaseId) {
        await fetchInterventions(selectedCaseId);
      }
      cancelEditIntervention();
      toast.success("Intervención actualizada correctamente.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
      toast.error(message);
    } finally {
      setUpdatingInterventionKey(null);
    }
  };

  const editContextoOptions = useMemo(
    () => {
      const merged = [...CONTEXTOS_POR_AMBITO.escolar, ...CONTEXTOS_POR_AMBITO.sociocultural];
      if (editInterventionAmbitos.length === 0) return [];
      const filtered = merged.filter((option) => {
        if (option.value === "otros") return true;
        const amb = AMBITO_BY_CONTEXTO[option.value];
        return editInterventionAmbitos.includes(amb);
      });
      const unique = new Map<ContextoEspecifico, (typeof merged)[number]>();
      for (const item of filtered) {
        if (!unique.has(item.value)) {
          unique.set(item.value, item);
        }
      }
      return Array.from(unique.values());
    },
    [editInterventionAmbitos],
  );

  useEffect(() => {
    if (!editInterventionContexts.length) return;
    const valid = editInterventionContexts.filter((item) =>
      editContextoOptions.some((option) => option.value === item),
    );
    if (valid.length !== editInterventionContexts.length) {
      setEditInterventionContexts(valid);
    }
  }, [editContextoOptions, editInterventionContexts]);

  const toggleEditContexto = (value: ContextoEspecifico) => {
    setEditInterventionContexts((current) => {
      if (current.includes(value)) {
        const next = current.filter((item) => item !== value);
        return next.length === 0 ? current : next;
      }
      return [...current, value];
    });
  };

  const toggleAmbito = (value: AmbitoIntervencion) => {
    setAmbitosSeleccionados((current) => {
      if (current.includes(value)) {
        const next = current.filter((item) => item !== value);
        return next.length === 0 ? current : next;
      }
      return [...current, value];
    });
  };

  const toggleEditAmbito = (value: AmbitoIntervencion) => {
    setEditInterventionAmbitos((current) => {
      if (current.includes(value)) {
        const next = current.filter((item) => item !== value);
        return next.length === 0 ? current : next;
      }
      return [...current, value];
    });
  };

  const handleDeleteIntervention = async (
    interventionIds: string[],
    interventionKey: string,
  ) => {
    setDeletingInterventionKey(interventionKey);
    setError("");
    try {
      for (const id of interventionIds) {
        const res = await fetch("/api/intervenciones", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "No se pudo eliminar la nota");
        }
      }

      setInterventions((prev) =>
        prev.filter((item) => !interventionIds.includes(item.id)),
      );
      if (editingInterventionKey === interventionKey) {
        cancelEditIntervention();
      }
      if (pendingDeleteIntervention?.groupKey === interventionKey) {
        setPendingDeleteIntervention(null);
      }
      toast.success("Nota eliminada correctamente.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
      toast.error(message);
    } finally {
      setDeletingInterventionKey(null);
    }
  };

  const toggleContexto = (value: ContextoEspecifico) => {
    setContextosSeleccionados((current) => {
      if (current.includes(value)) {
        const next = current.filter((item) => item !== value);
        return next.length === 0 ? current : next;
      }
      return [...current, value];
    });
  };

  const handleCreateIntervention = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) {
      setError("Selecciona un caso antes de guardar una intervención.");
      return;
    }
    if (!fechaIntervencion) {
      setError("Selecciona la fecha de la intervención.");
      return;
    }
    if (ambitosSeleccionados.length === 0) {
      setError("Selecciona al menos un ámbito.");
      return;
    }
    if (contextosSeleccionados.length === 0) {
      setError("Selecciona al menos un contexto específico.");
      return;
    }
    const trimmedTitle = titulo.trim();
    const trimmedText = textoOriginal.trim();
    if (trimmedTitle.length < 3) {
      const message = "El título debe tener al menos 3 caracteres.";
      setError(message);
      toast.error(message);
      return;
    }
    if (trimmedText.length < 10) {
      const message = "La nota debe tener al menos 10 caracteres.";
      setError(message);
      toast.error(message);
      return;
    }

    setSavingIntervention(true);
    setError("");
    try {
      const contextosPorAmbito = new Map<AmbitoIntervencion, ContextoEspecifico[]>();
      for (const contexto of contextosSeleccionados) {
        const targetAmbitos =
          contexto === "otros"
            ? ambitosSeleccionados
            : [AMBITO_BY_CONTEXTO[contexto]].filter((amb) =>
                ambitosSeleccionados.includes(amb),
              );
        for (const derivedAmbito of targetAmbitos) {
          const existing = contextosPorAmbito.get(derivedAmbito) || [];
          if (!existing.includes(contexto)) {
            existing.push(contexto);
          }
          contextosPorAmbito.set(derivedAmbito, existing);
        }
      }
      if (contextosPorAmbito.size === 0) {
        throw new Error("Los contextos seleccionados no corresponden a los ámbitos elegidos.");
      }

      let totalGuardadas = 0;
      for (const [ambito, subambitos] of contextosPorAmbito.entries()) {
        const res = await fetch("/api/intervenciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            casoId: selectedCaseId,
            fechaIntervencion,
            ambito,
            subambitos,
            titulo: trimmedTitle,
            textoOriginal: trimmedText,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "No se pudo guardar la intervención");
        }
        totalGuardadas += data.totalGuardadas || subambitos.length;
      }

      const cantidad = totalGuardadas || contextosSeleccionados.length;
      setTitulo("");
      setTextoOriginal("");
      setFechaIntervencion("");
      setAmbitosSeleccionados([]);
      setContextosSeleccionados([]);
      await fetchInterventions(selectedCaseId);
      setActiveTab("historial");
      toast.success(
        `Intervención guardada en ${cantidad} contexto${cantidad > 1 ? "s" : ""}.`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
      toast.error(message);
    } finally {
      setSavingIntervention(false);
    }
  };

  return (
    <div className="w-full px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-bold tracking-tight text-gray-900">
          Intervenciones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crea un caso, selecciónalo y registra el seguimiento desde un único
          espacio de trabajo.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <section className="space-y-5">
        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/30">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold text-emerald-900">Gestión de casos</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100"
              onClick={() => setShowCaseTools((prev) => !prev)}
            >
              {showCaseTools ? "Ocultar crear/buscar" : "Mostrar crear/buscar"}
            </Button>
          </div>
          {showCaseTools && (
            <div className="grid gap-4 border-t border-emerald-200/70 p-4 lg:grid-cols-2">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-base">Crear nuevo caso</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={handleCreateCase}>
                  <Input
                    value={newCaseInitials}
                    onChange={(e) => setNewCaseInitials(e.target.value.toUpperCase())}
                    placeholder="Iniciales (ej: JBL)"
                    required
                  />
                  <Input
                    value={newCaseCenter}
                    onChange={(e) => setNewCaseCenter(e.target.value)}
                    placeholder="Nombre del centro"
                    required
                  />
                  <Button type="submit" className="w-full" disabled={creatingCase}>
                    <Plus className="mr-2 h-4 w-4" />
                    {creatingCase ? "Creando..." : "Crear caso"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Buscar casos</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-2" onSubmit={handleSearch}>
                  <Input
                    value={searchInitials}
                    onChange={(e) => setSearchInitials(e.target.value)}
                    placeholder="Filtrar por iniciales"
                  />
                  <Input
                    value={searchCenter}
                    onChange={(e) => setSearchCenter(e.target.value)}
                    placeholder="Filtrar por centro"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full"
                    disabled={loadingCases}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {loadingCases ? "Buscando..." : "Buscar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            </div>
          )}
        </div>

        {selectedCase && (
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-lg border border-emerald-300 bg-emerald-100/70 px-4 py-3 text-sm text-emerald-950">
            <span className="font-semibold uppercase tracking-wide">Caso activo</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span className="font-bold">{selectedCase.iniciales_alumno}</span>
            <span className="font-medium">{selectedCase.centro_nombre}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-emerald-400 bg-white text-emerald-900 hover:bg-emerald-50"
              onClick={() => {
                setSelectedCaseId("");
                setInterventions([]);
                setActiveTab("registrar");
              }}
            >
              Limpiar selección
            </Button>
          </div>
        )}

        <main>
          <Card className="w-full">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-base">Espacio de trabajo</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {!selectedCase ? (
                <p className="text-sm text-muted-foreground">
                  Selecciona un caso para empezar a trabajar.
                </p>
              ) : (
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "registrar" | "historial")}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="registrar">Registrar</TabsTrigger>
                    <TabsTrigger value="historial">Historial</TabsTrigger>
                  </TabsList>

                  <TabsContent value="registrar">
                    <form className="space-y-5" onSubmit={handleCreateIntervention}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Fecha</label>
                          <Input
                            type="date"
                            value={fechaIntervencion}
                            onChange={(e) => setFechaIntervencion(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Ámbitos (multi-selección)
                          </label>
                          <div className="flex flex-wrap gap-2 rounded-md border border-gray-200 p-2.5">
                            {(["escolar", "sociocultural"] as AmbitoIntervencion[]).map((item) => {
                              const isActive = ambitosSeleccionados.includes(item);
                              return (
                                <Button
                                  key={item}
                                  type="button"
                                  variant={isActive ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleAmbito(item)}
                                >
                                  {item === "escolar" ? "Escolar" : "Sociocultural"}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Contextos específicos (multi-selección)
                        </label>
                        {contextoOptions.length === 0 ? (
                          <div className="rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-muted-foreground">
                            Selecciona primero el ámbito.
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 rounded-md border border-gray-200 p-3">
                            {contextoOptions.map((item) => {
                              const isActive = contextosSeleccionados.includes(item.value);
                              return (
                                <Button
                                  key={item.value}
                                  type="button"
                                  variant={isActive ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleContexto(item.value)}
                                  className="h-8"
                                >
                                  <Layers3 className="mr-1.5 h-3.5 w-3.5" />
                                  {item.label}
                                </Button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium">Título</label>
                        <Input
                          value={titulo}
                          onChange={(e) => setTitulo(e.target.value)}
                          placeholder="Ej: Seguimiento de hábitos y coordinación con familia"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium">Nota original</label>
                        <Textarea
                          value={textoOriginal}
                          onChange={(e) => setTextoOriginal(e.target.value)}
                          placeholder="Escribe aquí tus notas..."
                          rows={10}
                          required
                        />
                      </div>

                      <Button type="submit" disabled={savingIntervention}>
                        <Plus className="mr-2 h-4 w-4" />
                        {savingIntervention ? "Guardando..." : "Guardar intervención"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="historial">
                    {loadingInterventions ? (
                      <p className="text-sm text-muted-foreground">Cargando intervenciones...</p>
                    ) : groupedInterventions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Todavía no hay intervenciones para este caso.
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {timelineByDate.map((section) => (
                          <section key={section.date}>
                            <div className="mb-3 flex items-center gap-3">
                              <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
                                {formatDateEs(section.date)}
                              </span>
                              <span className="h-px flex-1 bg-emerald-200" />
                              <span className="text-xs text-emerald-700">
                                {section.items.length} registro
                                {section.items.length > 1 ? "s" : ""}
                              </span>
                            </div>

                            <ol className="relative space-y-4 pl-10">
                              <span className="pointer-events-none absolute bottom-0 left-4 top-0 w-px bg-emerald-300" />
                              {section.items.map((item) => (
                                <li key={item.groupKey} className="relative">
                                  <span className="absolute -left-[30px] top-6 h-4 w-4 rounded-full border-2 border-emerald-600 bg-white shadow-sm" />

                                  <article className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm transition-all hover:shadow-md">
                                    <div className="border-b border-emerald-100 bg-emerald-50/70 px-5 py-3.5">
                                      <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
                                            {item.ambito}
                                          </span>
                                          {item.subambitos.map((sub) => (
                                            <span
                                              key={`${item.groupKey}-${sub}`}
                                              className="rounded-md border border-emerald-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-900"
                                            >
                                              {labelContexto(sub)}
                                            </span>
                                          ))}
                                        </div>
                                        {editingInterventionKey !== item.groupKey && (
                                          <div className="flex items-center gap-2">
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="outline"
                                              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                              onClick={() => startEditIntervention(item)}
                                            >
                                              <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                              Editar
                                            </Button>
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="outline"
                                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                              onClick={() => setPendingDeleteIntervention(item)}
                                              disabled={deletingInterventionKey === item.groupKey}
                                            >
                                              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                              Eliminar nota
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-700/80">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        {item.subambitos.length} contexto
                                        {item.subambitos.length > 1 ? "s" : ""}
                                      </div>
                                    </div>
                                    <div className="px-5 py-4">
                                      {editingInterventionKey === item.groupKey ? (
                                        <div className="space-y-3">
                                          <div className="grid gap-3 sm:grid-cols-3">
                                            <div>
                                              <label className="mb-1 block text-xs font-medium text-gray-700">
                                                Fecha
                                              </label>
                                              <Input
                                                type="date"
                                                value={editInterventionDate}
                                                onChange={(e) =>
                                                  setEditInterventionDate(e.target.value)
                                                }
                                              />
                                            </div>
                                            <div>
                                              <label className="mb-1 block text-xs font-medium text-gray-700">
                                                Ámbitos
                                              </label>
                                              <div className="flex flex-wrap gap-1.5 rounded-md border border-gray-200 p-2">
                                                {(["escolar", "sociocultural"] as AmbitoIntervencion[]).map((amb) => {
                                                  const isActive = editInterventionAmbitos.includes(amb);
                                                  return (
                                                    <Button
                                                      key={amb}
                                                      type="button"
                                                      variant={isActive ? "default" : "outline"}
                                                      size="sm"
                                                      className="h-7 text-xs"
                                                      onClick={() => {
                                                        toggleEditAmbito(amb);
                                                        setEditInterventionContexts((current) =>
                                                          current.filter((ctx) => {
                                                            if (ctx === "otros") return true;
                                                            const derived = AMBITO_BY_CONTEXTO[ctx];
                                                            const nextAmbitos = isActive
                                                              ? editInterventionAmbitos.filter((a) => a !== amb)
                                                              : [...editInterventionAmbitos, amb];
                                                            return nextAmbitos.includes(derived);
                                                          }),
                                                        );
                                                      }}
                                                    >
                                                      {amb === "escolar" ? "Escolar" : "Sociocultural"}
                                                    </Button>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                            <div>
                                              <label className="mb-1 block text-xs font-medium text-gray-700">
                                                Contextos (multi-selección)
                                              </label>
                                              {editInterventionAmbitos.length === 0 ? (
                                                <div className="rounded-md border border-dashed border-gray-300 px-3 py-2 text-xs text-muted-foreground">
                                                  Selecciona primero el ámbito.
                                                </div>
                                              ) : (
                                                <div className="flex flex-wrap gap-1.5 rounded-md border border-gray-200 p-2">
                                                  {editContextoOptions.map((option) => {
                                                    const isActive = editInterventionContexts.includes(
                                                      option.value,
                                                    );
                                                    return (
                                                      <Button
                                                        key={option.value}
                                                        type="button"
                                                        variant={isActive ? "default" : "outline"}
                                                        size="sm"
                                                        className="h-7 text-xs"
                                                        onClick={() => toggleEditContexto(option.value)}
                                                      >
                                                        {option.label}
                                                      </Button>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <Input
                                            value={editInterventionTitle}
                                            onChange={(e) => setEditInterventionTitle(e.target.value)}
                                            placeholder="Título"
                                          />
                                          <Textarea
                                            value={editInterventionText}
                                            onChange={(e) => setEditInterventionText(e.target.value)}
                                            rows={7}
                                          />
                                          <div className="flex items-center gap-2">
                                            <Button
                                              type="button"
                                              size="sm"
                                              onClick={() => handleSaveIntervention(item)}
                                              disabled={updatingInterventionKey === item.groupKey}
                                            >
                                              <Check className="mr-1.5 h-3.5 w-3.5" />
                                              {updatingInterventionKey === item.groupKey
                                                ? "Guardando..."
                                                : "Guardar cambios"}
                                            </Button>
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="outline"
                                              onClick={cancelEditIntervention}
                                              disabled={updatingInterventionKey === item.groupKey}
                                            >
                                              <X className="mr-1.5 h-3.5 w-3.5" />
                                              Cancelar
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <h3 className="text-[15px] font-semibold leading-snug text-gray-950">
                                            {item.titulo}
                                          </h3>
                                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                                            {item.texto_redactado_ia || item.texto_original}
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </article>
                                </li>
                              ))}
                            </ol>
                          </section>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </main>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Listado de casos</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{sortedCases.length} casos</span>
            <Select
              value={caseSortField}
              onValueChange={(value: CaseSortField) => setCaseSortField(value)}
            >
              <SelectTrigger className="h-8 w-[220px] text-xs">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_at">Actividad</SelectItem>
                <SelectItem value="iniciales_alumno">Iniciales</SelectItem>
                <SelectItem value="centro_nombre">Centro</SelectItem>
                <SelectItem value="created_at">Fecha creación</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 px-2"
              onClick={() => setCaseSortDesc((prev) => !prev)}
              aria-label="Invertir orden"
            >
              {caseSortDesc ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="max-h-[460px] overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {sortedCases.length === 0 ? (
              <li className="px-4 py-4 text-sm text-muted-foreground">No hay casos todavía.</li>
            ) : (
              sortedCases.map((item) => {
                const isSelected = selectedCaseId === item.id;
                return (
                  <li
                    key={item.id}
                    className={`group relative px-4 py-3 transition-all ${
                      isSelected
                        ? "bg-emerald-100/80"
                        : "bg-white hover:bg-emerald-50 hover:shadow-sm"
                    }`}
                  >
                    <span
                      className={`absolute inset-y-2 left-0 w-1 rounded-r transition-colors ${
                        isSelected ? "bg-emerald-500" : "bg-transparent group-hover:bg-emerald-300"
                      }`}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        className="min-w-0 flex-1 rounded-sm text-left outline-none ring-emerald-300 transition-colors focus-visible:ring-2"
                        onClick={() => {
                          setPrefillLatestOnSelect(true);
                          setSelectedCaseId(item.id);
                          setActiveTab("registrar");
                        }}
                      >
                        <div
                          className={`inline-flex items-center gap-3 text-sm font-semibold ${
                            isSelected ? "text-emerald-900" : "text-gray-900"
                          }`}
                        >
                          <UserRound
                            className={`h-4 w-4 ${
                              isSelected ? "text-emerald-700" : "text-gray-500"
                            }`}
                          />
                          {item.iniciales_alumno}
                        </div>
                        <div className="mt-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5" />
                          {item.centro_nombre}
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          onClick={() => openEditCase(item)}
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5" />
                          Editar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => requestDeleteCase(item)}
                          disabled={deletingCaseId === item.id}
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </section>
      <Dialog
        open={Boolean(editingCase)}
        onOpenChange={(open) => {
          if (!open && !savingCaseEdit) setEditingCase(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar caso</DialogTitle>
            <DialogDescription>
              Actualiza iniciales y centro del caso seleccionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={editCaseInitials}
              onChange={(e) => setEditCaseInitials(e.target.value.toUpperCase())}
              placeholder="Iniciales (ej: JBL)"
            />
            <Input
              value={editCaseCenter}
              onChange={(e) => setEditCaseCenter(e.target.value)}
              placeholder="Nombre del centro"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingCase(null)}
              disabled={savingCaseEdit}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveCaseEdit} disabled={savingCaseEdit}>
              {savingCaseEdit ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={Boolean(pendingDeleteCase)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteCase(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar registro</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el registro{" "}
              <span className="font-semibold text-foreground">
                {pendingDeleteCase?.iniciales_alumno}
              </span>
              {" "}de{" "}
              <span className="font-semibold text-foreground">
                {pendingDeleteCase?.centro_nombre}
              </span>
              {" "}y sus intervenciones asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(deletingCaseId)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              onClick={(event) => {
                if (!pendingDeleteCase) return;
                event.preventDefault();
                void handleDeleteCase(pendingDeleteCase.id);
              }}
              disabled={Boolean(deletingCaseId)}
            >
              {deletingCaseId ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={Boolean(pendingDeleteIntervention)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteIntervention(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar nota</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la intervención{" "}
              <span className="font-semibold text-foreground">
                {pendingDeleteIntervention?.titulo}
              </span>
              {" "}en {pendingDeleteIntervention?.subambitos.length || 0} contexto(s) de forma
              permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(deletingInterventionKey)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              onClick={(event) => {
                if (!pendingDeleteIntervention) return;
                event.preventDefault();
                void handleDeleteIntervention(
                  pendingDeleteIntervention.ids,
                  pendingDeleteIntervention.groupKey,
                );
              }}
              disabled={Boolean(deletingInterventionKey)}
            >
              {deletingInterventionKey ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
