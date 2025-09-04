import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    // Buscar usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('name, email')
      .eq('email', email)
      .single();

    if (userError) {
      // No revelar si existe o no por seguridad
      return NextResponse.json({ success: true });
    }

    // Generar nuevo token (24h)
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const { error: tokenError } = await supabase.from('verification_tokens').insert({
      identifier: email,
      token,
      expires,
    });

    if (tokenError) {
      return NextResponse.json({ success: false, error: 'No se pudo generar el token' }, { status: 500 });
    }

    // Enviar email usando la ruta existente
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
    await fetch(`${process.env.NEXTAUTH_URL}/api/send-verification-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name: user?.name ?? 'usuario',
        verificationUrl,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
