import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const CreateInformeSchema = z.object({
  studentData: z.object({
    nombre: z.string(),
    edad: z.number(),
    curso: z.string(),
    motivoConsulta: z.string(),
    observaciones: z.string().optional(),
  }),
  generatedReport: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { studentData, generatedReport } = CreateInformeSchema.parse(body);

    // Crear el objeto para insertar en Supabase con datos básicos
    const informeData = {
      autor_id: session.user.id,
      datos_identificativos: {
        alumno: {
          nombre: studentData.nombre,
          fecha_nacimiento: '',
          nie: '',
          curso: studentData.curso,
        },
        centro: {
          nombre: '',
          localidad: '',
        },
        tutores: [],
        etapa_escolar: studentData.curso,
      },
      evaluacion_psicopedagogica: {
        motivo_consulta: studentData.motivoConsulta,
        observaciones: studentData.observaciones || '',
        informe_ia_generado: generatedReport,
      },
      estado: 'borrador' as const,
    };

    const { data, error } = await supabase
      .from('informes')
      .insert(informeData)
      .select()
      .single();

    if (error) {
      console.error('Error al guardar informe:', error);
      return NextResponse.json(
        { success: false, error: 'Error al guardar el informe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      informe: data,
    });

  } catch (error) {
    console.error('Error en create informe API:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}