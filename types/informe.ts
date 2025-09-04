/**
 * Este archivo contiene las interfaces TypeScript que definen la estructura de datos
 * para un informe psicopedagógico completo, basándose en el nuevo esquema de la base de datos.
 * Estas interfaces servirán como "contrato" entre el frontend y el backend.
 */

// Tipos de enumeración basados en el esquema de la BD
export type EstadoInforme = 'borrador' | 'en_progreso' | 'completado' | 'archivado';
export type RolUsuario = 'usuario' | 'admin';
export type PlanUsuario = 'gratis' | 'premium' | 'enterprise';

// --- INTERFACES DE TABLAS PRINCIPALES (Relación 1 a 1 con Informe) ---

/**
 * Tabla: public.datos_personales
 * Contiene los datos de identificación del alumno y su familia.
 */
export interface DatosPersonales {
  id: string;
  informe_id: string;
  nombre_alumno: string | null;
  fecha_nacimiento: string | null; // Formato ISO: 'YYYY-MM-DD'
  curso: string | null;
  unidad: string | null;
  tutor_1: string | null;
  tutor_2: string | null;
  etapa_escolarizacion: string | null;
  informacion_familia: string | null;
  fichero_url: string | null;
  creado_en: string;
  actualizado_en: string;
}

/**
 * Tabla: public.datos_escolares
 * Contiene el historial académico y las medidas previas.
 */
export interface DatosEscolares {
  id: string;
  informe_id: string;
  nombre_alumno: string | null;
  fecha_nacimiento: string | null;
  curso: string | null;
  unidad: string | null;
  historia_escolar: string | null;
  actuaciones_medidas: string | null;
  creado_en: string;
  actualizado_en: string;
}

/**
 * Tabla: public.datos_evaluacion_psicopedagogica
 * Define el marco de la evaluación.
 */
export interface DatosEvaluacionPsicopedagogica {
  id: string;
  informe_id: string;
  profesional: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  motivo: string | null;
  motivo_detallado: string | null;
  numero_sesiones: number | null;
  observaciones: string | null;
  creado_en: string;
  actualizado_en: string;
  // Relación 1 a N
  instrumentos?: EvaluacionInstrumento[];
}

/**
 * Tabla: public.info_contexto_escolar
 */
export interface InfoContextoEscolar {
  id: string;
  informe_id: string;
  nombre_alumno: string | null;
  fecha_nacimiento: string | null;
  curso: string | null;
  unidad: string | null;
  contexto_escolar: string | null;
  creado_en: string;
  actualizado_en: string;
}

/**
 * Tabla: public.info_contexto_familiar_social
 */
export interface InfoContextoFamiliarSocial {
  id: string;
  informe_id: string;
  nombre_alumno: string | null;
  fecha_nacimiento: string | null;
  curso: string | null;
  unidad: string | null;
  contexto_familiar_social: string | null;
  creado_en: string;
  actualizado_en: string;
}

/**
 * Tabla: public.info_relevante_alumno
 * El "corazón" del informe, con todos los detalles del desarrollo del alumno.
 */
export interface InfoRelevanteAlumno {
  id: string;
  informe_id: string;
  nombre_alumno: string | null;
  fecha_nacimiento: string | null;
  curso: string | null;
  unidad: string | null;
  datos_clinicos_sociales: string | null;
  desarrollo_cognitivo_desc: string | null;
  desarrollo_psicomotor_desc: string | null;
  desarrollo_psicomotor_necesidad: string | null;
  movilidad_necesidad: string | null;
  movilidad_observaciones: string | null;
  control_postural_necesidad: string | null;
  control_postural_observaciones: string | null;
  acceso_manipulacion_necesidad: string | null;
  acceso_manipulacion_observaciones: string | null;
  autonomia_alimentacion_necesidad: string | null;
  autonomia_alimentacion_observaciones: string | null;
  autonomia_wc_necesidad: string | null;
  autonomia_wc_observaciones: string | null;
  desarrollo_sensorial_desc: string | null;
  vision_necesidad: string | null;
  vision_observaciones: string | null;
  audicion_necesidad: string | null;
  audicion_observaciones: string | null;
  comunicativo_linguistico_desc: string | null;
  comunicacion_necesidad: string | null;
  lenguaje_expresivo_necesidad: string | null;
  lenguaje_comprensivo_necesidad: string | null;
  social_afectivo_desc: string | null;
  estilo_aprendizaje_motivacion_desc: string | null;
  otros_desc: string | null;
  fichero_url: string | null;
  creado_en: string;
  actualizado_en: string;
}

/**
 * Tabla: public.determinacion_neae
 * Conclusiones sobre la Necesidad Específica de Apoyo Educativo.
 */
export interface DeterminacionNEAE {
  id: string;
  informe_id: string;
  presenta_neae: boolean | null;
  sindrome_especifico: string | null;
  observaciones: string | null;
  creado_en: string;
  actualizado_en: string;
  // Relación 1 a N
  necesidades?: DeterminacionNEAENecesidad[];
}

/**
 * Tabla: public.propuesta_atencion_educativa
 * Propuestas y orientaciones para el equipo docente.
 */
export interface PropuestaAtencionEducativa {
  id: string;
  informe_id: string;
  acciones_tutorial_obs: string | null;
  observaciones_generales: string | null;
  orientaciones_profesorado: string | null;
  fichero_url: string | null;
  creado_en: string;
  actualizado_en: string;
  // Relaciones 1 a N
  medidas_generales?: PropuestaMedidaGeneral[];
  recursos_materiales?: PropuestaRecursoMaterial[];
  recursos_no_docente?: PropuestaRecursoNoDocente[];
  recursos_profesorado?: PropuestaRecursoProfesorado[];
}

/**
 * Tabla: public.orientaciones_familia
 * Orientaciones específicas para la familia.
 */
export interface OrientacionesFamilia {
  id: string;
  informe_id: string;
  nombre_alumno: string | null;
  fecha_nacimiento: string | null;
  curso: string | null;
  unidad: string | null;
  orientaciones: string | null;
  fichero_url: string | null;
  creado_en: string;
  actualizado_en: string;
}

// --- INTERFACES DE TABLAS SECUNDARIAS (Relación 1 a N) ---

/** Tabla: public.evaluacion_instrumentos */
export interface EvaluacionInstrumento {
  id: string;
  evaluacion_id: string;
  instrumento: string;
  notas: string | null;
  creado_en: string;
}

/** Tabla: public.determinacion_neae_necesidades */
export interface DeterminacionNEAENecesidad {
  id: string;
  determinacion_id: string;
  necesidad: string;
  notas: string | null;
  creado_en: string;
}

/** Tabla: public.propuesta_medidas_generales */
export interface PropuestaMedidaGeneral {
  id: string;
  propuesta_id: string;
  medida: string;
  notas: string | null;
  creado_en: string;
}

/** Tabla: public.propuesta_recursos_materiales */
export interface PropuestaRecursoMaterial {
  id: string;
  propuesta_id: string;
  recurso: string;
  notas: string | null;
  creado_en: string;
}

/** Tabla: public.propuesta_recursos_no_docente */
export interface PropuestaRecursoNoDocente {
  id: string;
  propuesta_id: string;
  perfil: string;
  notas: string | null;
  creado_en: string;
}

/** Tabla: public.propuesta_recursos_profesorado */
export interface PropuestaRecursoProfesorado {
  id: string;
  propuesta_id: string;
  especialidad: string;
  notas: string | null;
  creado_en: string;
}

// --- INTERFAZ PRINCIPAL DEL INFORME ---

/**
 * Tabla: public.informes
 * La tabla central que une todas las partes del informe.
 */
export interface Informe {
  id: string;
  autor_id: string;
  creado_en: string;
  actualizado_en: string;
  estado: EstadoInforme;
}

/**
 * Interfaz Agregada: InformeCompleto
 * Esta interfaz representa un informe con todas sus partes relacionadas.
 * Será el tipo de dato principal para los formularios y vistas del informe.
 * Las propiedades son opcionales porque un informe en estado "borrador" puede no tener todas las secciones completas.
 */
export interface InformeCompleto extends Informe {
  datos_personales?: DatosPersonales;
  datos_escolares?: DatosEscolares;
  datos_evaluacion_psicopedagogica?: DatosEvaluacionPsicopedagogica;
  info_contexto_escolar?: InfoContextoEscolar;
  info_contexto_familiar_social?: InfoContextoFamiliarSocial;
  info_relevante_alumno?: InfoRelevanteAlumno;
  determinacion_neae?: DeterminacionNEAE;
  propuesta_atencion_educativa?: PropuestaAtencionEducativa;
  orientaciones_familia?: OrientacionesFamilia;
}