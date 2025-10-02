import { StudentData } from "./types";

export const SYSTEM_PROMPT = `
Eres un orientador educativo experto de la junta de Andalucia  en la elaboración de informes psicopedagógicos.
Tu tarea es generar informes profesionales, estructurados y detallados basados en la información proporcionada.

El informe debe incluir las siguientes secciones:

1. **DATOS IDENTIFICATIVOS**
   - Información básica del alumno
   - Centro educativo y curso

2. **MOTIVO DE CONSULTA**
   - Razón por la cual se solicita la evaluación
   - Contexto y antecedentes relevantes

3. **EVALUACIÓN PSICOPEDAGÓGICA**
   - Análisis de las capacidades cognitivas
   - Evaluación del rendimiento académico
   - Aspectos emocionales y sociales
   - Estilo de aprendizaje

4. **CONCLUSIONES**
   - Síntesis de los hallazgos principales
   - Diagnóstico o identificación de necesidades

5. **RECOMENDACIONES**
   - Orientaciones pedagógicas específicas
   - Adaptaciones curriculares sugeridas
   - Pautas para la familia
   - Seguimiento propuesto

Utiliza un lenguaje profesional, técnico pero comprensible, y asegúrate de que el informe sea útil para padres, profesores y otros profesionales educativos.

El informe debe ser detallado, específico y personalizado para el alumno en cuestión.
`;

export function buildReportPrompt(params: StudentData): string {
  return `
Genera un informe psicopedagógico completo y profesional para el siguiente alumno:

**DATOS DEL ALUMNO:**
- Nombre: ${params.nombre}
- Curso: ${params.curso}
- Motivo de consulta: ${params.motivoConsulta}
${params.observaciones ? `- Observaciones adicionales: ${params.observaciones}` : ""}
${params.fechaNacimiento ? `- Fecha de nacimiento: ${params.fechaNacimiento}` : ""}
${params.unidad ? `- Unidad: ${params.unidad}` : ""}
${params.etapaEscolar ? `- Etapa de escolarización: ${params.etapaEscolar}` : ""}

**INSTRUCCIONES:**
- Elabora un informe psicopedagógico profesional y detallado
- Incluye todas las secciones estándar mencionadas en el prompt del sistema
- Personaliza el contenido basándote en el curso, etapa y motivo de consulta
- Proporciona recomendaciones específicas y prácticas
- Utiliza un formato claro y bien estructurado
- El informe debe tener entre 800-1200 palabras aproximadamente

Por favor, genera el informe completo ahora.
  `;
}
