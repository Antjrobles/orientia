export interface StudentData {
  nombre: string;
  curso: string;
  motivoConsulta: string;
  observaciones?: string;
  // Campos adicionales opcionales para enriquecer el informe
  fechaNacimiento?: string; // ISO date (YYYY-MM-DD)
  unidad?: string;
  primerTutor?: string;
  segundoTutor?: string;
  etapaEscolar?: string;
  centro?: string;
  localidad?: string;
}

export interface GeneratedReport {
  content: string;
  generatedAt: Date;
  studentData: StudentData;
}

export interface ApiResponse {
  success: boolean;
  report?: string;
  error?: string;
  details?: unknown;
}

export class GroqApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "GroqApiError";
  }
}
