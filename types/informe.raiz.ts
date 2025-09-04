/**
 * Tipo raíz `Informe` alineado con la tabla `public.informes`.
 * Incluye las secciones JSONB tipadas.
 */

import type { UUID, ISODateTimeString, EstadoInforme } from './informe.base';
import type {
  DatosIdentificativos,
  HistoriaYMedidas,
  EvaluacionPsicopedagogicaJson,
  Diagnostico,
  InformacionAlumno,
  ContextoGeneral,
  Orientaciones,
} from './informe.secciones';

export interface Informe {
  id: UUID;
  autor_id: UUID;
  creado_en: ISODateTimeString;
  actualizado_en: ISODateTimeString;
  estado: EstadoInforme;

  datos_identificativos: DatosIdentificativos | null;
  historia_y_medidas: HistoriaYMedidas | null;
  evaluacion_psicopedagogica: EvaluacionPsicopedagogicaJson | null;
  diagnostico: Diagnostico | null;
  informacion_alumno: InformacionAlumno | null;
  contexto_general: ContextoGeneral | null;
  necesidades_apoyo_educativo: string | null;
  orientaciones: Orientaciones | null;
}

