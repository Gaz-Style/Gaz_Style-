import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, lang = 'es' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Correo electrónico inválido' },
        { status: 400 }
      );
    }

    // Si Supabase está configurado, registrar el lead
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        await supabase.from('leads_guides').insert([
          {
            email: email.trim().toLowerCase(),
            guide_type: '5_rutas_santiago',
            language: lang,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (dbErr) {
        console.warn('Advertencia al registrar lead en BD:', dbErr);
      }
    }

    // Mensaje localizado según idioma
    const messages: Record<string, string> = {
      es: '¡Guía enviada con éxito! Revisa tu bandeja de entrada o spam.',
      en: 'Guide sent successfully! Check your inbox or spam.',
      pt: 'Guia enviado com sucesso! Verifique sua caixa de entrada.',
      de: 'Guide erfolgreich gesendet! Prüfe deinen Posteingang.',
      zh: '指南发送成功！请检查您的收件箱。',
    };

    return NextResponse.json({
      success: true,
      message: messages[lang] || messages.es,
    });
  } catch (error) {
    console.error('Error en lead-guide:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar tu solicitud' },
      { status: 500 }
    );
  }
}
