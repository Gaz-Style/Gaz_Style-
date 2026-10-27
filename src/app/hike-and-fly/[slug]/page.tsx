import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Mountain, ShieldCheck, Clock, Users, ArrowLeft, 
  ArrowRight, CheckCircle2, Star, Sparkles, Navigation, 
  Calendar, Check, Shield, Zap, MessageCircle, 
  MapPin, AlertTriangle, FileText, CheckCircle, Compass,
  Wind, Feather
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMountainWeather } from '@/lib/weather';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
}

async function getHikeAndFlyExpedition(slugOrId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
  if (isUUID) {
    const { data } = await supabase.from('adventures_catalog').select('*').eq('id', slugOrId).single();
    if (data) return data;
  }

  // Búsqueda semántica por slug / término
  const cleanTerm = decodeURIComponent(slugOrId).replace(/-/g, ' ').toLowerCase().trim();
  const { data: allHikeFly } = await supabase
    .from('adventures_catalog')
    .select('*')
    .or('vertical_type.eq.hike_and_fly,category.eq.hike_and_fly');

  if (allHikeFly && allHikeFly.length > 0) {
    const match = allHikeFly.find((r: any) => {
      const t = (r.title || '').toLowerCase();
      const s = (r.slug || '').toLowerCase();
      return (
        t.includes(cleanTerm) || 
        (cleanTerm.includes('naranjo') && t.includes('naranjo')) ||
        (cleanTerm.includes('manquehue') && t.includes('manquehue')) ||
        (cleanTerm.includes('provincia') && t.includes('provincia')) ||
        (cleanTerm.includes('medio') && t.includes('medio'))
      );
    });
    if (match) return match;
    // Fallback al primero de la vertical
    return allHikeFly[0];
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getHikeAndFlyExpedition(slug);

  if (!exp) {
    return {
      title: 'Expedición Hike & Fly no encontrada | Santiago Hiking',
      description: 'La expedición de vuelo libre solicitada no está disponible.'
    };
  }

  const title = `${exp.title} · Hike & Fly Andes | Santiago Hiking`;
  const description = `Expedición Hike & Fly en los Andes: ${exp.title}. Ascenso a pie por aristas andinas (${exp.max_altitude || '1.450 m'}) y descenso planeando en parapente biplaza tándem con piloto experto. Perspectiva panorámica de 360° y aterrizaje suave en césped.`;

  return {
    title,
    description,
    keywords: [
      'hike and fly santiago chile',
      'parapente biplaza santiago',
      'hike and fly manquehue',
      'hike and fly alto del naranjo',
      'hike and fly cerro provincia',
      'hike and fly cerro del medio',
      'santiago hiking vuelo libre',
      'turismo aventura sustentable santiago'
    ],
    alternates: {
      canonical: `https://santiagohiking.com/hike-and-fly/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://santiagohiking.com/hike-and-fly/${slug}`,
      siteName: 'Santiago Hiking · Gaz_Style Expeditions',
      images: [
        {
          url: exp.image_url || 'https://santiagohiking.com/images/hike-and-fly-andes.jpg',
          width: 1200,
          height: 630,
          alt: `${exp.title} - Despegue y Vuelo Libre en Parapente`
        }
      ],
      type: 'website',
      locale: 'es_CL'
    },
    other: {
      'geo.region': 'CL-RM',
      'geo.placename': 'Santiago, Región Metropolitana, Chile',
      'geo.position': '-33.4150;-70.4720',
      'ICBM': '-33.4150, -70.4720'
    }
  };
}

export default async function HikeAndFlyDetailPage({ params }: Props) {
  const { slug } = await params;
  const exp = await getHikeAndFlyExpedition(slug);

  if (!exp) notFound();

  // Telemetría meteorológica en zona de despegue
  const elev = parseInt(String(exp.max_altitude || '').replace(/[^0-9]/g, '')) || 1450;
  const weather = await getMountainWeather(-33.415, -70.472, elev);

  // Esquema Semántico JSON-LD (Schema.org) para Google & LLMs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristTrip',
        '@id': `https://santiagohiking.com/hike-and-fly/${slug}#trip`,
        name: exp.title,
        description: exp.description,
        touristType: ['Alpinists', 'Paragliding Enthusiasts', 'Eco Adventurers', 'Mountain Hikers'],
        provider: {
          '@type': 'TouristInformationCenter',
          name: 'Santiago Hiking (Gaz_Style Expeditions)',
          url: 'https://santiagohiking.com',
          telephone: '+56984021940',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Santiago',
            addressRegion: 'Región Metropolitana',
            addressCountry: 'CL'
          }
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'CLP',
          price: exp.base_price || 145000,
          availability: 'https://schema.org/InStock',
          validFrom: '2026-10-21',
          url: `https://santiagohiking.com/hike-and-fly/${slug}`,
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: exp.base_price || 145000,
            priceCurrency: 'CLP',
            valueAddedTaxIncluded: true
          }
        },
        itinerary: {
          '@type': 'ItemList',
          itemListElement: (exp.itinerary_steps || []).map((step: any, idx: number) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: `${step.time || ''} - ${step.title || ''}`,
            description: step.desc || ''
          }))
        }
      },
      {
        '@type': 'SportsActivityLocation',
        '@id': `https://santiagohiking.com/hike-and-fly/${slug}#launch-site`,
        name: `${exp.title} - Despegue de Vuelo Libre`,
        elevation: `${exp.max_altitude || '1.450 m'}`,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -33.4150,
          longitude: -70.4720
        },
        containedInPlace: {
          '@type': 'Place',
          name: 'Cordillera de los Andes Centrales, Santiago, Chile'
        }
      },
      {
        '@type': 'FAQPage',
        '@id': `https://santiagohiking.com/hike-and-fly/${slug}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿En qué consiste la modalidad Hike & Fly en Santiago?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Es la disciplina montañera más pura: la cordada asciende a pie hasta el punto de despegue en cumbre o arista, donde nos encontramos con los pilotos tándem. Tras un briefing de seguridad, despegamos enganchados en un parapente biplaza para descender planeando en las corrientes térmicas, aterrizando suavemente en la zona de aterrizaje (LZ).'
            }
          },
          {
            '@type': 'Question',
            name: '¿Se requiere experiencia previa de vuelo en parapente?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No se requiere experiencia previa en vuelo. Vuelas en modalidad tándem (biplaza) como pasajero frente a un piloto profesional con vasta experiencia en vuelo de montaña. Tu única tarea es caminar unos pasos con decisión durante el despegue.'
            }
          },
          {
            '@type': 'Question',
            name: '¿Qué ocurre si las condiciones de viento no permiten el despegue?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'La seguridad aerológica es el valor supremo. Si al llegar a cumbre el viento o la nubosidad no cumplen los estrictos estándares de vuelo seguro, la cordada realiza el descenso pedestre con acompañamiento experto y el valor del servicio de vuelo tándem se reembolsa íntegramente.'
            }
          },
          {
            '@type': 'Question',
            name: '¿Cómo es la sensación de vuelo y cómo se realiza el aterrizaje?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'El vuelo es sereno, estable y silencioso. Vas cómodamente sentado en el arnés disfrutando de una panorámica 360° de la cordillera y el valle de Santiago. El aterrizaje se realiza de pie de manera gradual y suave sobre césped, dando apenas un par de pasos al tocar tierra.'
            }
          }
        ]
      }
    ]
  };

  const itinerary = exp.itinerary_steps || [
    { time: '07:30', title: 'Punto de Encuentro y Check de Equipo', desc: 'Briefing de ruta andina, revisión de hidratación, calzado y asignación de radios de cordada.' },
    { time: '08:00', title: 'Ascenso Pedestre a la Cumbre', desc: 'Trekking a ritmo de montaña constante por los senderos y filos andinos hasta el punto de despegue.' },
    { time: '11:30', title: 'Cumbre y Briefing Técnico de Vuelo', desc: 'Cumbre, hidratación y bienvenida del equipo de pilotos tándem. Colocación de arnés, casco y explicación de la carrera de despegue.' },
    { time: '12:15', title: 'Despegue e Inflado de Ala', desc: 'Tres pasos sincronizados con el piloto frente a la brisa andina y transición suave al aire libre.' },
    { time: '12:35', title: 'Vuelo Térmico y Planeo sobre el Valle', desc: 'Planeo silencioso entre 15 y 30 minutos sobre las quebradas de la precordillera con vistas panorámicas.' },
    { time: '13:00', title: 'Aterrizaje en Zona Designada (LZ)', desc: 'Toque a tierra suave sobre césped, foto de cordada y cierre de la expedición.' }
  ];

  const requiredEquipment = exp.required_equipment || [
    'Botas de montaña con caña media o alta (suela con buen agarre)',
    'Pantalón largo resistente y cortaviento',
    'Guantes ligeros de trekking para el vuelo',
    'Lentes de sol con protección UV400',
    '2 litros de agua o electrolitos',
    'Protector solar y bálsamo labial'
  ];

  const isWindFavorable = weather ? weather.windSpeed <= 25 : true;

  return (
    <main className="relative min-h-screen text-white font-sans selection:bg-amber-500/30 bg-stone-950 flex flex-col">
      {/* Schema.org JSON-LD inyectado para SEO & LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* ── HERO DE LA EXPEDICIÓN HIKE & FLY ─────────────────────────────────── */}
      <header className="relative pt-28 pb-16 px-4 sm:px-6 md:px-8 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={exp.image_url || '/images/hike-and-fly-andes.jpg'}
            alt={exp.title}
            fill
            priority
            className="object-cover object-center opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          {/* Breadcrumb Semántico */}
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/hike-and-fly" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Hike & Fly Andes</Link>
            <span>/</span>
            <span className="text-stone-300 truncate max-w-xs">{exp.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-stone-900/90 border border-white/15 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-widest">
              {exp.badge || 'HIKE & FLY ANDES · VUELO LIBRE'}
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900/80 border border-white/10 text-stone-300 font-mono text-[10px] uppercase tracking-wider">
              VUELO LIBRE DE MONTAÑA
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900/80 border border-white/10 text-stone-300 font-mono text-[10px] uppercase tracking-wider">
              PARAPENTE TÁNDEM BIPLAZA
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight leading-tight max-w-4xl">
            {exp.title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-300 font-light max-w-3xl leading-relaxed">
            {exp.description}
          </p>

          {/* Barra de Telemetría Técnica */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 font-mono text-xs max-w-5xl">
            <div className="p-3 rounded-xl bg-stone-900/90 border border-white/10">
              <span className="text-stone-400 block text-[10px] uppercase">COTA DESPEGUE</span>
              <span className="text-base font-black text-amber-400">{exp.max_altitude || '1.450 m'}</span>
              <span className="text-[10px] text-stone-500 block">Lanzamiento cumbrero</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/90 border border-white/10">
              <span className="text-stone-400 block text-[10px] uppercase">DESNIVEL A PIE</span>
              <span className="text-base font-black text-white">{exp.elevation_gain || '+750 m'}</span>
              <span className="text-[10px] text-stone-500 block">Esfuerzo en subida</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/90 border border-white/10">
              <span className="text-stone-400 block text-[10px] uppercase">TIEMPO DE VUELO</span>
              <span className="text-base font-black text-stone-200">15 - 30 min</span>
              <span className="text-[10px] text-stone-500 block">Planeo térmico libre</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/90 border border-white/10">
              <span className="text-stone-400 block text-[10px] uppercase">MODALIDAD</span>
              <span className="text-base font-black text-white">Tándem Biplaza</span>
              <span className="text-[10px] text-stone-500 block">Piloto profesional</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/90 border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-stone-400 block text-[10px] uppercase">VISTA PANORÁMICA</span>
              <span className="text-base font-black text-amber-400">360° Andes</span>
              <span className="text-[10px] text-stone-500 block">Valle central</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── CUERPO PRINCIPAL: FICHA TÉCNICA + BARRA DE RESERVA ───────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
        
        {/* Columna Principal (2 columnas de 3) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Telemetría Aerológica en Vivo (Open-Meteo) */}
          {weather && (
            <div className="p-5 rounded-2xl bg-stone-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-amber-400" /> Aerología en Despegue (Open-Meteo en Vivo)
                </span>
                <span className="text-stone-400">Altitud: {elev} msnm</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="p-2.5 rounded-lg bg-stone-950 border border-white/5">
                  <span className="text-[10px] text-stone-400 block">TEMPERATURA</span>
                  <span className="text-lg font-bold text-white">{weather.temperature}°C</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-950 border border-white/5">
                  <span className="text-[10px] text-stone-400 block">VIENTO EN COTA</span>
                  <span className="text-lg font-bold text-amber-400">{weather.windSpeed} km/h</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-950 border border-white/5">
                  <span className="text-[10px] text-stone-400 block">CONDICIÓN</span>
                  <span className="text-xs font-bold text-stone-200 block truncate mt-1">{weather.statusText}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-950 border border-white/5">
                  <span className="text-[10px] text-stone-400 block">VENTANA VUELO</span>
                  <span className={`text-xs font-bold block mt-1 ${isWindFavorable ? 'text-amber-400' : 'text-stone-400'}`}>
                    {isWindFavorable ? 'ÓPTIMA (<25 km/h)' : 'ESPERA AEROLÓGICA'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Manifiesto del Vuelo Libre */}
          <article className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <Feather className="w-5 h-5 text-amber-400" />
              El Manifiesto de Vuelo Libre
            </h2>
            <div className="space-y-4 text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              {(exp.story_paragraphs && exp.story_paragraphs.length > 0) ? (
                exp.story_paragraphs.map((p: string, idx: number) => (
                  <p key={idx}>{p}</p>
                ))
              ) : (
                <>
                  <p>
                    El <strong>Hike & Fly</strong> nace de la esencia más pura del montañismo alpino: ganarse la cumbre con la fuerza de tus piernas, conectar con la montaña paso a paso y, al alcanzar el punto culminante, extender las alas para fundirse con las corrientes térmicas de los Andes.
                  </p>
                  <p>
                    Planeas en el silencio de la cordillera, sostenido por las corrientes térmicas ascendentes y con la compañía de cóndores andinos sobrevolando los mismos filos rocosos que acabas de ascender a pie.
                  </p>
                  <p>
                    El Hike & Fly ofrece el desenlace culminante a la jornada: una transición donde el esfuerzo de la subida es recompensado con un planeo sobre el valle central que te deposita suavemente de pie sobre césped.
                  </p>
                </>
              )}
            </div>
          </article>

          {/* Cómo Funciona: Los 3 Momentos */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              La Experiencia en Tres Fases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
                <span className="font-mono text-amber-400 font-bold text-xs uppercase tracking-wider block">Fase 1 · A Pie</span>
                <h3 className="text-base font-bold text-white uppercase font-sans">El Ascenso</h3>
                <p className="text-stone-400 text-xs leading-relaxed font-light">
                  Trekking guiado con liderazgo de cordada. Ritmo constante, hidratación y superación deportiva hasta la cumbre.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
                <span className="font-mono text-amber-400 font-bold text-xs uppercase tracking-wider block">Fase 2 · En Cumbre</span>
                <h3 className="text-base font-bold text-white uppercase font-sans">El Despegue</h3>
                <p className="text-stone-400 text-xs leading-relaxed font-light">
                  Nos equipamos con arnés y casco junto al piloto biplaza. Briefing técnico, inflado de ala y tres pasos firmes.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
                <span className="font-mono text-amber-400 font-bold text-xs uppercase tracking-wider block">Fase 3 · En el Aire</span>
                <h3 className="text-base font-bold text-white uppercase font-sans">El Vuelo</h3>
                <p className="text-stone-400 text-xs leading-relaxed font-light">
                  Planeas cómodamente durante 15 a 30 minutos sobre el valle. Aterrizaje suave caminando en la zona designada (LZ).
                </p>
              </div>
            </div>
          </section>

          {/* Itinerario Cronológico Minuto a Minuto */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Cronograma de la Salida
            </h2>
            <div className="space-y-3 font-mono text-xs">
              {itinerary.map((step: any, idx: number) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-stone-900/60 border border-white/10 flex items-start gap-4 transition-colors hover:border-amber-400/40"
                >
                  <span className="px-2.5 py-1 rounded bg-stone-950 border border-white/15 text-amber-400 font-bold shrink-0">
                    {step.time || '00:00'}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white uppercase font-sans">
                      {step.title}
                    </h3>
                    <p className="text-stone-400 font-sans text-xs font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipamiento Requerido */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Equipamiento Técnico Necesario
            </h2>
            <p className="text-xs text-stone-400">
              El equipo de vuelo (parapente biplaza, arneses, paracaídas de emergencia homologado y cascos certificados) es provisto íntegramente por la organización. Tú solo debes traer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requiredEquipment.map((item: string, idx: number) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-stone-900/70 border border-white/10 flex items-center gap-3 text-xs text-stone-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filosofía Ecológica & Sin Dejar Rastro */}
          <div className="p-6 rounded-2xl bg-stone-900/80 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-bold">
              <Feather className="w-4 h-4" />
              Compromiso de Montaña · Sin Dejar Rastro
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              El parapente es la forma más limpia de volar creada por la humanidad. Operamos exclusivamente aprovechando las térmicas solares y la sustentación del viento andino. No dejamos rastro en el sendero, no perturbamos el silencio de la cordillera y protegemos la fauna nativa en cada despegue.
            </p>
          </div>

        </div>

        {/* Columna Lateral: Tarjeta Flotante de Reserva y Ficha */}
        <div className="space-y-6">
          <div className="sticky top-28 p-6 sm:p-8 rounded-3xl bg-stone-900/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
            
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded bg-stone-950 text-amber-400 border border-white/15 font-mono text-[10px] uppercase font-bold tracking-wider">
                EXPEDICIÓN TÁNDEM BIPLAZA
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  ${(exp.base_price || 145000).toLocaleString('es-CL')}
                </span>
                <span className="text-xs font-mono text-stone-400 uppercase">CLP / persona</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Aprox. US$ {Math.round((exp.base_price || 145000) / 900)} · Cupos limitados por cordada y condiciones de viento.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 font-mono text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-400">Modalidad:</span>
                <span className="text-white font-semibold">Trekking + Vuelo Tándem</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-400">Piloto:</span>
                <span className="text-stone-200 font-semibold">Tándem Certificado</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-400">Seguridad:</span>
                <span className="text-white font-semibold">Garantía Aerológica</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-400">Aterrizaje:</span>
                <span className="text-amber-400 font-semibold">Zona oficial en césped</span>
              </div>
            </div>

            {/* CTA WhatsApp directo con mensaje contextualizado */}
            <a
              href={`https://wa.me/56984021940?text=${encodeURIComponent(`Hola Santiago Hiking, quisiera coordinar cupo para la expedición Hike & Fly: "${exp.title}". ¿Cuáles son las próximas fechas con ventana de viento favorable?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2.5 text-center"
            >
              <MessageCircle className="w-4 h-4 fill-stone-950" />
              <span>Coordinar Vuelo por WhatsApp</span>
            </a>

            {/* Garantía Aerológica */}
            <div className="p-3.5 rounded-xl bg-stone-950 border border-white/5 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                Garantía Aerológica de Cordada
              </span>
              <p className="text-[11px] text-stone-400 font-light leading-relaxed">
                Si las condiciones de viento no son 100% óptimas para el despegue seguro, la cordada realiza el descenso pedestre y el valor del vuelo tándem se reembolsa en su totalidad.
              </p>
            </div>

            {/* Botón Volver al Catálogo */}
            <Link
              href="/hike-and-fly"
              className="w-full py-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 border border-white/10 font-mono text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Otras Cumbres de Vuelo</span>
            </Link>

          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
