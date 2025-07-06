/**
 * Este archivo contiene las definiciones de tipos de TypeScript
 * que se corresponden con el esquema de tu base de datos de Supabase.
 * Mantener esto sincronizado con tu SQL es clave para la seguridad de tipos.
 */

// Tipos ENUM basados en el  SQL de supabase
export type RolUsuario = "usuario" | "admin"
export type PlanUsuario = "gratis" | "premium" | "empresa"
export type EstadoInforme = "borrador" | "en_revision" | "finalizado" | "archivado"

// Tipos para las columnas JSONB de la tabla 'informes'

export interface DatosIdentificativos {
  alumno: {
    nombre: string
    fecha_nacimiento: string // formato YYYY-MM-DD
    nie: string
    curso: string
  }
  centro: {
    nombre: string
    localidad: string
  }
  tutores: string[]
  etapa_escolar: string
}

export interface HistoriaYMedidas {
  historia_escolar: string
  actuaciones_diversidad: {
    medidas: string[]
    nivel_competencia: string
    modalidad: string
  }
}

export interface EvaluacionPsicopedagogica {
  profesional: string
  fecha_inicio: string // formato YYYY-MM-DD
  fecha_fin: string // formato YYYY-MM-DD
  motivo: string
  instrumentos: string[]
  // Estos pueden ser más complejos, los dejamos como 'any' por ahora
  resultados_escala_ecca: Record<string, any>
  valoracion_logopedica: Record<string, any>
  evaluacion_psicomotora: Record<string, any>
}

export interface Diagnostico {
  tipo_grado_discapacidad: string
  datos_clinicos_relevantes: string
}

export interface InformacionAlumno {
  desarrollo_cognitivo: string
  desarrollo_motor: string
  desarrollo_sensorial: string
  desarrollo_comunicativo: string
  desarrollo_social: string
  estilo_aprendizaje: string
  nivel_competencia_curricular: string
}

export interface ContextoGeneral {
  escolar: {
    clima_aula: string
    clima_patio: string
  }
  familiar: {
    composicion: string
    actitud: string
    pautas_educativas: string
  }
}

export interface Orientaciones {
  profesorado: Record<string, string>
  familia: Record<string, string>
}

// El tipo principal para la tabla 'informes'
export interface Informe {
  id: string // uuid
  autor_id: string // uuid
  creado_en: string // timestamptz
  actualizado_en: string // timestamptz
  estado: EstadoInforme
  datos_identificativos: DatosIdentificativos
  // Por ahora, mantenemos los otros campos como opcionales para empezar
  historia_y_medidas?: HistoriaYMedidas
  evaluacion_psicopedagogica: { motivo: string } // Solo el motivo es obligatorio para empezar
  // ... resto de campos jsonb
}

