export interface StudentData {
  nombre: string;
  edad: number;
  curso: string;
  motivoConsulta: string;
  observaciones?: string;
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
  details?: any;
}

export class GroqApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'GroqApiError';
  }
}