export type SectionKey =
  | "datosPersonales"
  | "datosEscolares"
  | "evaluacionPsicopedagogica"
  | "infoAlumno"
  | "contextoEscolar"
  | "entornoFamiliar"
  | "necesidadesApoyo"
  | "propuestaAtencion"
  | "orientacionesFamilia";

export interface FormState {
  // Datos personales
  nombre: string;
  curso: string;
  fechaNacimiento?: string;
  unidad?: string;
  primerTutor?: string;
  segundoTutor?: string;
  etapaEscolar?: string;

  // Historia escolar (datos escolares)
  escolarizacionPrevia?: string;
  actuacionesDiversidad?: string;

  // Actuaciones - Sistema condicional
  nivelEducativoActuaciones?: "infantil" | "primaria" | "secundaria";
  medidaSeleccionadaInfantil?: string;
  medidaSeleccionadaPrimaria?: string;
  medidaSeleccionadaSecundaria?: string;
  otrasOrientaciones?: string;

  // EOE referencia
  eoeReferencia?: string;

  // Datos de evaluación psicopedagógica ampliados
  profesionalRealiza?: string;
  fechaInicioEvaluacion?: string;
  fechaFinEvaluacion?: string;
  motivoEvaluacion?: string;
  motivoEvaluacionDetalle?: string;
  instrumentosInformacion?: string;
  numeroSesiones?: string;

  // Adjuntos
  familiaAdjuntos?: File[];

  // Datos escolares
  centro?: string;
  localidad?: string;

  // Evaluación psicopedagógica (actual uso IA)
  motivoConsulta: string;
  observaciones?: string;

  // Secciones adicionales
  infoAlumno?: string;
  contextoEscolar?: string;
  entornoFamiliar?: string;
  necesidadesApoyo?: string;
  propuestaAtencion?: string;
  orientacionesFamilia?: string;
  orientacionesAdjuntos?: File[];

  // Información relevante del alumno/a
  datosClinicosSociales?: string;
  descDesarrolloCognitivo?: string;
  desarrolloCognitivoNivel?: string;
  autonomiaWC?: string;
  autonomiaWCObs?: string;
  descDesarrolloSensorial?: string;
  visionValoraciones?: string[];
  audicionValoraciones?: string[];
  descDesarrolloPsicomotor?: string;
  psicomotorNivel?: string;
  movilidadNivel?: string;
  movilidadObs?: string;
  controlPosturalNivel?: string;
  controlPosturalObs?: string;
  manipulacionMaterialesNivel?: string;
  manipulacionMaterialesObs?: string;
  alimentacionNivel?: string;
  alimentacionObs?: string;
  descDesarrolloComunicativo?: string;
  comunicacionNivel?: string;
  lenguajeExpresivoNivel?: string;
  lenguajeComprensivoNivel?: string;
  descDesarrolloSocialAfectivo?: string;
  descEstiloAprendizaje?: string;
  infoOtros?: string;
  nivelCompetenciaCurricular?: string;
  estiloAprendizajeMotivacion?: string;
  otrosInfoRelevante?: string;
  ficheroExterno?: string;

  // NEAE - Determinación de necesidades
  presentaNEAE?: string;
  necesidadesListado?: string[];
  sindromeEspecifico?: string;
  observacionesNEAE?: string;

  // Propuesta de atención educativa
  medidasEducativasGenerales?: string[];
  recursosMaterialesEspecificos?: string[];
  recursosMaterialesObs?: string;
  actuacionesObservaciones?: string;
  profesoradoEspecialista?: string[];
  profesoradoEspecialistaObs?: string;
  personalNoDocente?: string[];
  personalNoDocenteObs?: string;
}

export type FormErrors = Partial<Record<keyof FormState, string>>;

export type FormChangeHandler = <K extends keyof FormState>(
  key: K,
  value: FormState[K],
) => void;

export type SectionStatusChecker = (key: SectionKey) => boolean;

export type CollapsibleStatusChecker = (key: string) => boolean;

export type FileListHandler = (files: FileList | null) => void;

export type RemoveFileHandler = (index: number) => void;

export type SaveDraftHandler = (section?: SectionKey) => void;

export type CollapsibleToggleHandler = (key: string) => void;

export type CollapsibleRecord = Record<string, boolean>;
