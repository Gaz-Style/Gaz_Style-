import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, HelpCircle, Compass, Mountain, ShieldCheck, HeartPulse, Clock, ArrowRight, MessageCircle, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes y Guía de Montaña | Santiago Hiking by Gaz',
  description: 'Todo lo que necesitas saber para subir a los cerros de Santiago: equipamiento requerido, niveles de dificultad, seguridad WFR, logística en Lo Barnechea y expediciones privadas.',
  alternates: {
    canonical: 'https://www.santiagohiking.com/faq',
  },
};

const faqs = [
  {
    q: '¿Qué condición física o experiencia previa necesito para participar?',
    a: 'Nuestras salidas están catalogadas en 4 niveles claros: Básico, Intermedio, Avanzado y Alta Montaña. En cada ficha de ruta detallamos el desnivel positivo, la distancia en kilómetros y el tiempo estimado. Si estás comenzando a entrenar, recomendamos rutas formativas como Manquehue o Pochoco antes de abordar cumbres de más de 3.000m como El Plomo o Provincia. Al reservar realizas un check-in físico y médico preventivo para asegurar que el grupo sea homogéneo.',
  },
  {
    q: '¿Qué equipamiento básico es obligatorio para ir a la cordillera?',
    a: 'Por seguridad estricta, cada participante debe contar con: zapatos de trekking con buen agarre (suela tipo Vibram o similar, caña media o alta), vestimenta en capas (primera capa transpirable, polar o abrigo intermedio, y cortaviento/chaqueta impermeable), 2 a 3 litros de agua o electrolitos, protección solar (bloqueador FPS 50+, gorro y gafas con filtro UV categoría 3 o 4), y bastones de trekking recomendados. Para salidas de alta montaña se especifican crampones o equipo técnico.',
  },
  {
    q: '¿Dónde es el punto de encuentro y cómo funciona la logística?',
    a: 'El punto de encuentro se coordina directamente por WhatsApp según la ruta elegida, con base principal en Lo Barnechea / sector oriente de Santiago. Desde allí salimos en caravana o coordinamos traslados conjuntos hacia el inicio del sendero. Al descender del cerro cerramos la jornada con una parada gastronómica en locales aliados para recargar energías.',
  },
  {
    q: '¿Qué protocolos de primeros auxilios y seguridad tienen los guías?',
    a: 'Todas nuestras expediciones están dirigidas por guías con certificación internacional WFR (Wilderness First Responder) y experiencia comprobada en la Cordillera de los Andes. Contamos con botiquín de trauma de montaña, sistemas de comunicación radial VHF y balizas satelitales (Garmin inReach) para evacuaciones o contingencias.',
  },
  {
    q: '¿Qué sucede si hay mal tiempo o alerta meteorológica?',
    a: 'Monitoreamos modelos meteorológicos de montaña (Windy, NOAA, MeteoBlue) con 72 y 24 horas de anticipación. Si las condiciones de viento blanco, lluvia intensa o tormenta eléctrica ponen en riesgo la seguridad, la expedición se reprograma a una nueva fecha sin costo adicional o se ofrece una alternativa equivalente.',
  },
  {
    q: '¿Cómo funcionan las expediciones privadas 1 a 1 o para empresas?',
    a: 'Diseñamos ascensos privados y a medida para personas que buscan un ritmo personalizado, preparación para desafíos específicos (como Ojos del Salado o Aconcagua) o jornadas de team building outdoor corporativo. Las rutas privadas incluyen itinerario a medida, nutrición en ruta, asesoría previa de material y flexibilidad horaria absoluta.',
  },
];

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const sportsOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: 'Santiago Hiking by Gaz',
    description: 'Expediciones de montaña, senderismo técnico y trekking guiado en la Cordillera de los Andes de Santiago de Chile.',
    url: 'https://www.santiagohiking.com',
    telephone: '+56972812907',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lo Barnechea',
      addressRegion: 'Región Metropolitana',
      addressCountry: 'CL',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsOrgSchema) }}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-amber-500/30 pb-20">
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Inicio
            </Link>
            <Link href="/" className="flex items-center transition-transform hover:scale-105 duration-300">
              <Image
                src="/santiago-hiking-10.png"
                alt="Santiago Hiking"
                width={140}
                height={60}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <header className="relative pt-36 pb-16 px-6 bg-gradient-to-b from-stone-950 via-[#0a0a0a] to-[#0a0a0a] border-b border-white/5">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <p className="inline-flex items-center gap-2 text-xs text-amber-500 uppercase tracking-widest font-bold mb-4">
              <Compass className="w-4 h-4" /> Centro de Conocimiento & Montaña
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight font-extrabold mb-6">
              Preguntas Frecuentes
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Todo lo que necesitas saber sobre nuestras rutas, nivel de exigencia, equipamiento técnico y protocolos de seguridad en la cordillera.
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
          {/* CARDS DE VALOR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <ShieldCheck className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Guías WFR</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Primeros auxilios en áreas remotas, botiquines de trauma y comunicación satelital inReach en cada ascenso.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <HeartPulse className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Check-in Médico</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Perfilamiento físico online previo para asegurar que el ritmo grupal sea armónico y seguro.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <Mountain className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Cero Fricción</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Reserva digital instantánea, asesoría personalizada de equipo y bajada gastronómica en Lo Barnechea.
              </p>
            </div>
          </div>

          {/* LISTA FAQ */}
          <section className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white/[0.02] border border-white/10 rounded-2xl p-6 cursor-pointer open:border-amber-500/30 transition-all"
              >
                <summary className="flex items-center justify-between font-bold text-white group-open:text-amber-400 text-base md:text-lg">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-90 shrink-0 ml-4" />
                </summary>
                <div className="mt-4 text-sm text-slate-300 font-light leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </section>

          {/* CTA WHATSAPP DIRECTO */}
          <div className="bg-gradient-to-r from-stone-900 to-black rounded-3xl p-8 md:p-12 text-center border border-amber-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">
              ¿Tienes una duda específica sobre tu próxima cumbre?
            </h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8 relative z-10">
              Habla directo con Gaz por WhatsApp para revisar tu condición física, recomendaciones de equipo o rutas privadas personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                href="/#rutas"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-full transition-all"
              >
                Ver Rutas Disponibles
              </Link>
              <a
                href={`https://wa.me/56972812907?text=${encodeURIComponent('Hola Gaz! Tengo una consulta sobre las rutas y expediciones de Santiago Hiking.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd5a] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
