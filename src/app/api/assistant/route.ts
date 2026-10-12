import { NextResponse } from 'next/server';

const SANTIAGO_HIKING_SYSTEM_PROMPT = `
Eres el Asistente Virtual Oficial de Santiago Hiking (Gaz_Style Expeditions).
Tu objetivo es orientar a viajeros, residentes y aventureros que quieren subir los cerros de Santiago de Chile de forma segura, entretenida y con estilo.

Identidad de la marca:
- Nombre: Santiago Hiking (by Gaz_Style)
- Tono: Enérgico, profesional, cercano, motivador ("fucking vibra ⚡"). No eres un bot aburrido, hablas como un guía apasionado y de confianza.
- Fundador y Guía Principal: Gaz (experto en montaña, primeros auxilios WFR y creador de contenido).

Catálogo de Experiencias:
1. Sunset Treks (Cerro Manquehuito):
   - Atardecer sobre Santiago, descenso nocturno con linternas frontales y café en cumbre.
   - Nivel: Medio-Iniciación (apto para principiantes activos).
   - Precio: Desde $25.000 CLP.
2. Networking Manquehuito:
   - Trekking exclusivo para emprendedores, profesionales y creativos. Conexión humana, intercambio de ideas y picoteo en cumbre.
   - Precio: $45.000 CLP.
3. WildTrek:
   - Salida deportiva de alta intensidad para desconectar del estrés laboral y recargar energía.
   - Precio: $25.000 CLP.
4. Alta Montaña (Cerro Pintor 4.180m):
   - Full day desde La Parva / Valle Nevado con vistas a El Plomo.
5. Expediciones 1 a 1:
   - Rutas privadas a medida con logística personalizada.

Diferenciales clave:
- Fotografía y video profesional en alta resolución incluidos para cada asistente.
- Guianza certificada con protocolo de seguridad WFR y botiquín de trauma.
- El "Tercer Tiempo": bajamos del cerro directo a locales aliados en Lo Barnechea a comer y compartir.
- Reserva directa en: https://www.santiagohiking.com/reservar

Reglas de respuesta:
1. Sé conciso, cálido y directo.
2. Recomienda la ruta adecuada según la condición física y el objetivo del usuario.
3. Recuerda al usuario qué llevar: zapatillas con buen agarre, 1.5L de agua, cortaviento y linterna frontal para atardeceres.
4. Siempre invita a revisar las salidas abiertas en /reservar o unirse a "El Círculo" en WhatsApp.
`;

export async function POST(req: Request) {
  try {
    const { message, lang = 'es' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Si hay clave de DeepSeek configurada (Prioritaria)
    if (deepseekKey) {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SANTIAGO_HIKING_SYSTEM_PROMPT },
            { role: 'user', content: `[Idioma de respuesta: ${lang}] ${message}` },
          ],
          temperature: 0.5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          reply: data.choices[0]?.message?.content,
          provider: 'deepseek',
        });
      }
    }

    // 2. Si hay clave de OpenAI configurada
    if (openAiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SANTIAGO_HIKING_SYSTEM_PROMPT },
            { role: 'user', content: `[Idioma de respuesta: ${lang}] ${message}` },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          reply: data.choices[0]?.message?.content,
          provider: 'openai',
        });
      }
    }

    // 2. Si hay clave de Gemini configurada
    if (geminiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SANTIAGO_HIKING_SYSTEM_PROMPT}\n\nUsuario (${lang}): ${message}` }],
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json({
            reply: text,
            provider: 'gemini',
          });
        }
      }
    }

    // 3. Fallback inteligente mientras se configuran las API keys
    const fallbackAnswers: Record<string, string> = {
      es: `¡Hola! Soy el asistente de Santiago Hiking ⚡. Actualmente la conexión con IA está lista esperando la clave de API (OPENAI_API_KEY o GEMINI_API_KEY). De todas formas, te cuento que nuestras salidas más populares son el Sunset Manquehuito ($25.000) y el Networking Manquehuito ($45.000). Puedes ver las fechas confirmadas y reservar tu cupo directo en /reservar o unirte a nuestro WhatsApp comunitario.`,
      en: `Hello! I'm the Santiago Hiking assistant ⚡. The AI backend is configured and ready for the API key. Our most popular hikes are Sunset Manquehuito ($25,000 CLP) and Networking Manquehuito ($45,000 CLP). You can check upcoming departures and book online at /reservar or join our WhatsApp circle!`,
      pt: `Olá! Sou o assistente do Santiago Hiking ⚡. A conexão de IA está pronta. Nossas trilhas mais procuradas são o Sunset Manquehuito e o Networking Manquehuito. Confira as saídas e reserve sua vaga em /reservar!`,
    };

    return NextResponse.json({
      reply: fallbackAnswers[lang] || fallbackAnswers.es,
      provider: 'ready_for_key',
      status: 'API endpoint configured and awaiting OPENAI_API_KEY or GEMINI_API_KEY in .env.local',
    });
  } catch (error) {
    console.error('Error en assistant API:', error);
    return NextResponse.json(
      { error: 'Error interno en el asistente' },
      { status: 500 }
    );
  }
}
