/**
 * Definiciones de las secciones JSONB almacenadas en la tabla `informes`.
 * Estas estructuras representan el “contrato” que viaja entre API y UI.
 */

// Datos identificativos del informe (usados actualmente en UI)
export interface DatosIdentificativos {
  alumno: {
    nombre?: string;
    fecha_nacimiento?: string; // ISODateString
    nie?: string;
    curso?: string;
  };
  centro?: {
    nombre?: string;
    localidad?: string;
  };
  tutores?: string[]; // nombres o identificadores
  etapa_escolar?: string;
}

// Historia académica y medidas adoptadas anteriormente
export interface HistoriaYMedidas {
  historia_escolar?: string;
  actuaciones_medidas?: string;
  otros?: string;
}

// Marco de evaluación psicopedagógica
export interface EvaluacionPsicopedagogicaJson {
  motivo_consulta?: string;
  observaciones?: string;
  informe_ia_generado?: string; // contenido Markdown/Texto
  // instrumentos?: { instrumento: string; notas?: string }[]; // opcional si se decide incluir aquí
}

// Diagnóstico / determinación de necesidades específicas
export interface Diagnostico {
  presenta_neae?: boolean;
  sindrome_especifico?: string;
  observaciones?: string;
  necesidades?: string[]; // lista libre o taxonomía propia
}

// Información relevante del alumno (resumen)
export interface InformacionAlumno {
  nombre_apellidos?: string; // usado en admin
  datos_clinicos_sociales?: string;
  desarrollo_cognitivo_desc?: string;
  desarrollo_psicomotor_desc?: string;
  desarrollo_sensorial_desc?: string;
  comunicativo_linguistico_desc?: string;
  social_afectivo_desc?: string;
  estilo_aprendizaje_motivacion_desc?: string;
  otros_desc?: string;
}

// Contexto general (escolar y familiar/social)
export interface ContextoGeneral {
  contexto_escolar?: string;
  contexto_familiar_social?: string;
}

// Orientaciones (para profesorado y familia)
export interface Orientaciones {
  orientaciones_profesorado?: string;
  orientaciones_familia?: string;
}

