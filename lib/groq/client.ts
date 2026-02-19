import Groq from "groq-sdk";
import { StudentData, GroqApiError } from "./types";
import { SYSTEM_PROMPT, buildReportPrompt } from "./prompts";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type GenerateReportParams = StudentData;

export async function generatePsychopedagogicalReport(
  params: GenerateReportParams,
): Promise<string> {
  try {
    const prompt = buildReportPrompt(params);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new GroqApiError("No se recibió contenido de la API de Groq");
    }

    return content;
  } catch (error: unknown) {
    throw handleGroqError(error);
  }
}

type GroqLikeError = {
  status?: number;
  code?: string;
};

export function handleGroqError(error: unknown): GroqApiError {
  if (error instanceof GroqApiError) {
    return error;
  }

  const err = (error as GroqLikeError) || {};

  if (err.status === 429) {
    return new GroqApiError(
      "Límite de solicitudes excedido. Intenta más tarde.",
      429,
    );
  }

  if (err.status === 401) {
    return new GroqApiError("Error de autenticación con la API de Groq", 401);
  }

  if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
    return new GroqApiError("Error de conexión con la API de Groq", 503);
  }

  return new GroqApiError(
    "Error desconocido al generar el informe",
    500,
    error,
  );
}
