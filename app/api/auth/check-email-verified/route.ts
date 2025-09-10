import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ exists: false, verified: false }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('emailVerified')
      .eq('email', email)
      .single();

    if (error) {
      // No revelar existencia exacta por seguridad; devolvemos genérico.
      return NextResponse.json({ exists: false, verified: false });
    }

    return NextResponse.json({ exists: true, verified: Boolean(data?.emailVerified) });
  } catch {
    return NextResponse.json({ exists: false, verified: false }, { status: 500 });
  }
}

