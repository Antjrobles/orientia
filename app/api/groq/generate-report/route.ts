import { NextRequest, NextResponse } from 'next/server';
import { generatePsychopedagogicalReport } from '@/lib/groq/client';
import { GroqApiError } from '@/lib/groq/types';
import { z } from 'zod';

const RequestSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    curso: z.string().min(1, 'El curso es requerido'),
    motivoConsulta: z.string().min(1, 'El motivo de consulta es requerido'),
    observaciones: z.string().optional(),
    fechaNacimiento: z.string().optional(),
    unidad: z.string().optional(),
    primerTutor: z.string().optional(),
    segundoTutor: z.string().optional(),
    etapaEscolar: z.string().optional(),
    centro: z.string().optional(),
    localidad: z.string().optional(),
  })
  .passthrough();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RequestSchema.parse(body);

    const report = await generatePsychopedagogicalReport(validatedData);

    return NextResponse.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error in generate-report API:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: error.errors
        },
        { status: 400 }
      );
    }

    if (error instanceof GroqApiError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
