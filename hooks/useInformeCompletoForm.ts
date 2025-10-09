import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { StudentData } from "@/lib/groq/types";
import type {
  CollapsibleRecord,
  CollapsibleStatusChecker,
  CollapsibleToggleHandler,
  FileListHandler,
  FormChangeHandler,
  FormErrors,
  FormState,
  RemoveFileHandler,
  SaveDraftHandler,
  SectionKey,
  SectionStatusChecker,
} from "@/types/informe-completo";

const requiredSections: Record<SectionKey, string[]> = {
  datosPersonales: ["curso", "etapaEscolar"],
  datosEscolares: ["escolarizacionPrevia"],
  evaluacionPsicopedagogica: [
    "fechaInicioEvaluacion",
    "fechaFinEvaluacion",
    "motivoEvaluacion",
  ],
  infoAlumno: ["descDesarrolloCognitivo"],
  contextoEscolar: ["contextoEscolar"],
  entornoFamiliar: ["entornoFamiliar"],
  necesidadesApoyo: ["presentaNEAE"],
  propuestaAtencion: ["propuestaAtencion"],
  orientacionesFamilia: ["orientacionesFamilia"],
};

const requiredCollapsibleSections: Record<string, string[]> = {
  identity: ["curso", "fechaNacimiento"],
  datosEvaluacionPsico: [
    "fechaInicioEvaluacion",
    "fechaFinEvaluacion",
    "motivoEvaluacion",
    "instrumentosInformacion",
  ],
  infoEntornoFamiliar: ["entornoFamiliar"],
};

const INITIAL_COLLAPSIBLES: CollapsibleRecord = {
  dp: true,
  esc: false,
  ev: false,
  ir: false,
  ce: false,
  ef: false,
  ne: false,
  pa: false,
  of: false,
  orientacionesProfesorado: false,
  ficherosAdjuntosProfesorado: false,
  orientacionesFamilia: false,
};

const buildAnonCode = (prefix: string) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

interface UseInformeCompletoFormOptions {
  onSubmit: (data: StudentData) => void;
}

export function useInformeCompletoForm({
  onSubmit,
}: UseInformeCompletoFormOptions) {
  const [anonCodes] = useState(() => ({
    alumno: buildAnonCode("ALUM"),
    tutor1: buildAnonCode("TUT1"),
    tutor2: buildAnonCode("TUT2"),
    profesional: buildAnonCode("PROF"),
    eoe: buildAnonCode("EOE"),
  }));

  const [form, setForm] = useState<FormState>({
    nombre: `Alumno/a [${anonCodes.alumno}]`,
    primerTutor: `Tutor/a 1 [${anonCodes.tutor1}]`,
    segundoTutor: `Tutor/a 2 [${anonCodes.tutor2}]`,
    profesionalRealiza: `Profesional [${anonCodes.profesional}]`,
    eoeReferencia: `EOE [${anonCodes.eoe}]`,
    curso: "",
    motivoConsulta: "",
    observaciones: "",
  });

  const [open, setOpen] = useState<SectionKey[]>([]);
  const [openCollapsibles, setOpenCollapsibles] =
    useState<CollapsibleRecord>(INITIAL_COLLAPSIBLES);
  const [historiaEscolarOpen, setHistoriaEscolarOpen] = useState(true);
  const [necesidadTemp, setNecesidadTemp] = useState<string>("");
  const [recursoMaterialTemp, setRecursoMaterialTemp] = useState<string>("");
  const [profEspecialistaTemp, setProfEspecialistaTemp] = useState<string>("");
  const [personalNoDocenteTemp, setPersonalNoDocenteTemp] =
    useState<string>("");

  const handleChange = useCallback<FormChangeHandler>((key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const toggleCollapsible = useCallback<CollapsibleToggleHandler>((key) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const handleNivelActuacionesChange = useCallback<
    (value: "infantil" | "primaria" | "secundaria" | undefined) => void
  >(
    (value) => {
      handleChange("nivelEducativoActuaciones", value);
    },
    [handleChange],
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem("informe-borrador");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        const { nombre, primerTutor, segundoTutor, ...restParsed } = parsed;
        void nombre;
        void primerTutor;
        void segundoTutor;
        setForm((f) => ({ ...f, ...restParsed }));
      }
    } catch {
      // ignorar errores de lectura
    }
  }, []);

  const errors: FormErrors = useMemo(() => {
    const e: FormErrors = {};
    if (!form.curso?.trim()) e.curso = "Requerido";
    if (!form.motivoConsulta?.trim()) e.motivoConsulta = "Requerido";
    return e;
  }, [form]);

  const isSectionComplete = useCallback<SectionStatusChecker>(
    (key) => {
      const req = requiredSections[key];
      if (req.length === 0) return false;

      if (key === "datosEscolares") {
        const identityComplete = Boolean(
          form.curso?.trim() && form.fechaNacimiento?.trim(),
        );
        const escolarizacionOk = Boolean(form.escolarizacionPrevia?.trim());
        const actuacionOk = Boolean(
          form.medidaSeleccionadaInfantil ||
            form.medidaSeleccionadaPrimaria ||
            form.medidaSeleccionadaSecundaria,
        );
        return identityComplete && escolarizacionOk && actuacionOk;
      }

      if (key === "evaluacionPsicopedagogica") {
        const identityComplete = Boolean(
          form.curso?.trim() && form.fechaNacimiento?.trim(),
        );
        const datosEvaluacionComplete = Boolean(
          form.fechaInicioEvaluacion?.trim() &&
            form.fechaFinEvaluacion?.trim() &&
            form.motivoEvaluacion?.trim() &&
            form.instrumentosInformacion?.trim(),
        );
        return identityComplete && datosEvaluacionComplete;
      }

      const sectionsWithIdentity: SectionKey[] = [
        "infoAlumno",
        "contextoEscolar",
        "entornoFamiliar",
        "necesidadesApoyo",
        "propuestaAtencion",
        "orientacionesFamilia",
      ];

      if (sectionsWithIdentity.includes(key)) {
        const identityComplete = Boolean(
          form.curso?.trim() && form.fechaNacimiento?.trim(),
        );
        const specificFieldsComplete = req.every((k) => {
          const value = (form as unknown as Record<string, unknown>)[k];
          return typeof value === "number"
            ? true
            : Boolean(value && String(value).trim());
        });
        return identityComplete && specificFieldsComplete;
      }

      return req.every((k) => {
        const value = (form as unknown as Record<string, unknown>)[k];
        return typeof value === "number"
          ? true
          : Boolean(value && String(value).trim());
      });
    },
    [form],
  );

  const isCollapsibleSectionComplete = useCallback<CollapsibleStatusChecker>(
    (key) => {
      if (key === "historiaEscolar") {
        const escolarizacionOk = Boolean(form.escolarizacionPrevia?.trim());
        const actuacionOk = Boolean(
          form.medidaSeleccionadaInfantil ||
            form.medidaSeleccionadaPrimaria ||
            form.medidaSeleccionadaSecundaria,
        );
        return escolarizacionOk && actuacionOk;
      }

      const req = requiredCollapsibleSections[key];
      if (!req || req.length === 0) return false;

      return req.every((k) => {
        const value = (form as unknown as Record<string, unknown>)[k];
        return Boolean(value && String(value).trim());
      });
    },
    [form],
  );

  const { completedSectionsCount, totalCompletable, progressPercentage } =
    useMemo(() => {
      const sectionKeys = Object.keys(requiredSections) as SectionKey[];
      const completableSections = sectionKeys.filter(
        (key) => requiredSections[key].length > 0,
      );
      const completed = completableSections.filter((key) =>
        isSectionComplete(key),
      ).length;
      const total = completableSections.length;
      const progress = total > 0 ? (completed / total) * 100 : 0;

      return {
        completedSectionsCount: completed,
        totalCompletable: total,
        progressPercentage: progress,
      };
    }, [isSectionComplete]);

  const handleFilesChange = useCallback<FileListHandler>((files) => {
    if (!files) return;
    const arr = Array.from(files);
    setForm((f) => ({
      ...f,
      familiaAdjuntos: [...(f.familiaAdjuntos || []), ...arr],
    }));
  }, []);

  const handleOrientacionesFiles = useCallback<FileListHandler>((files) => {
    if (!files) return;
    const arr = Array.from(files);
    setForm((f) => ({
      ...f,
      orientacionesAdjuntos: [...(f.orientacionesAdjuntos || []), ...arr],
    }));
  }, []);

  const removeAdjunto = useCallback<RemoveFileHandler>((idx) => {
    setForm((f) => ({
      ...f,
      familiaAdjuntos: (f.familiaAdjuntos || []).filter((_, i) => i !== idx),
    }));
  }, []);

  const removeOrientacionesAdjunto = useCallback<RemoveFileHandler>((idx) => {
    setForm((f) => ({
      ...f,
      orientacionesAdjuntos: (f.orientacionesAdjuntos || []).filter(
        (_, i) => i !== idx,
      ),
    }));
  }, []);

  const handleSaveDraft = useCallback<SaveDraftHandler>(
    (sectionToClose) => {
      try {
        localStorage.setItem("informe-borrador", JSON.stringify(form));
        toast.success("Borrador guardado", {
          description: "Se ha guardado localmente en este navegador.",
        });
        if (sectionToClose) {
          setOpen((prev) => prev.filter((s) => s !== sectionToClose));
        }
      } catch {
        toast.error("No se pudo guardar el borrador");
      }
    },
    [form],
  );

  const handleClear = useCallback(() => {
    const newCodes = {
      alumno: buildAnonCode("ALUM"),
      tutor1: buildAnonCode("TUT1"),
      tutor2: buildAnonCode("TUT2"),
      profesional: buildAnonCode("PROF"),
      eoe: buildAnonCode("EOE"),
    };

    setForm({
      nombre: `Alumno/a [${newCodes.alumno}]`,
      primerTutor: `Tutor/a 1 [${newCodes.tutor1}]`,
      segundoTutor: `Tutor/a 2 [${newCodes.tutor2}]`,
      profesionalRealiza: `Profesional [${newCodes.profesional}]`,
      eoeReferencia: `EOE [${newCodes.eoe}]`,
      curso: "",
      motivoConsulta: "",
    } as FormState);

    setNecesidadTemp("");
    setRecursoMaterialTemp("");
    setProfEspecialistaTemp("");
    setPersonalNoDocenteTemp("");
    setHistoriaEscolarOpen(true);
    setOpenCollapsibles(INITIAL_COLLAPSIBLES);
    setOpen([]);
    localStorage.removeItem("informe-borrador");

    toast.info("Formulario limpiado", {
      description: "Se han generado nuevos códigos anónimos",
    });
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!form.curso?.trim() || !form.motivoConsulta?.trim()) {
        toast.error("Por favor, completa los campos requeridos");
        return;
      }

      const payload: StudentData = {
        nombre: form.nombre,
        curso: form.curso.trim(),
        motivoConsulta: form.motivoConsulta.trim(),
        observaciones: form.observaciones?.trim() || "",
      };

      onSubmit(payload);
    },
    [form, onSubmit],
  );

  return {
    form,
    errors,
    open,
    setOpen,
    openCollapsibles,
    toggleCollapsible,
    historiaEscolarOpen,
    setHistoriaEscolarOpen,
    necesidadTemp,
    setNecesidadTemp,
    recursoMaterialTemp,
    setRecursoMaterialTemp,
    profEspecialistaTemp,
    setProfEspecialistaTemp,
    personalNoDocenteTemp,
    setPersonalNoDocenteTemp,
    handleChange,
    handleFilesChange,
    handleOrientacionesFiles,
    removeAdjunto,
    removeOrientacionesAdjunto,
    handleSaveDraft,
    handleClear,
    handleSubmit,
    handleNivelActuacionesChange,
    isSectionComplete,
    isCollapsibleSectionComplete,
    completedSectionsCount,
    totalCompletable,
    progressPercentage,
  } as const;
}
