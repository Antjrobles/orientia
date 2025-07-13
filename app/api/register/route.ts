import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';


const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Validar los datos de entrada
    if (!name || !email || !password) {
      return new NextResponse('Faltan nombre, email o contraseña', { status: 400 });
    }
    if (password.length < 6) {
      return new NextResponse('La contraseña debe tener al menos 6 caracteres', { status: 400 });
    }

    // 2. Comprobar si el usuario ya existe
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new NextResponse('Ya existe un usuario con este email', { status: 409 }); // 409 Conflict
    }

    // Ignoramos el error específico que indica que no se encontró ninguna fila, que es lo esperado.
    if (existingUserError && existingUserError.code !== 'PGRST116') {
      throw existingUserError;
    }

    // 3. Hashear (cifrar) la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Insertar el nuevo usuario en la base de datos
    const { error: insertError } = await supabase.from('users').insert({
      name,
      email,
      hashed_password: hashedPassword,
    });

    if (insertError) {
      console.error('Error al insertar en Supabase:', insertError);
      return new NextResponse('No se pudo crear el usuario', { status: 500 });
    }

    // 5. Devolver una respuesta de éxito
    return NextResponse.json({ message: 'Usuario creado correctamente' }, { status: 201 });
  } catch (error) {
    console.error('Error de registro:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}
