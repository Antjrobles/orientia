export interface InformeSupabase {
  id: string;
  autor_id: string;
  datos_identificativos: {
    alumno: {
      nombre: string;
      fecha_nacimiento: string;
      nie?: string;
      curso: string;
    };
    centro: {
      nombre: string;
      localidad: string;
    };
    tutores: string[];
    etapa_escolar: string;
  } | null;
  historia_y_medidas: any | null;
  evaluacion_psicopedagogica: any | null;
  diagnostico: any | null;
  informacion_alumno: any | null;
  contexto_general: any | null;
  necesidades_apoyo_educativo: string | null;
  orientaciones: any | null;
  creado_en: string;
  actualizado_en: string;
  estado: 'borrador' | 'completado' | 'archivado';
}