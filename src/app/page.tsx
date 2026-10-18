import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./HeroCarousel";
import { 
  Mountain, ShieldCheck, Clock, HeartPulse, Compass, Award, 
  MessageCircle, Camera, Tent, ArrowRight, CheckCircle2, 
  Star, Trophy, Flame, MapPin, Sparkles, Navigation, Calendar
} from "lucide-react";
import TestimonialsCarousel from "./TestimonialsCarousel";
import FloatingNavbar from "./FloatingNavbar";
import GuideRadioWidget from "./GuideRadioWidget";
import LeadMagnetForm from "./LeadMagnetForm";
import HeroActionButtons from "./HeroActionButtons";
import ScrollToTopButton from "./ScrollToTopButton";
import AtlasShowcaseSection from '@/components/AtlasShowcaseSection';
import TopTickerBar from '@/components/TopTickerBar';
import UnifiedExpeditionsTabs from '@/components/UnifiedExpeditionsTabs';
import VisualLevelsSection from '@/components/VisualLevelsSection';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';
import { getDictionary } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

async function getPublicData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const [{ data: routes }, { data: departures }] = await Promise.all([
    supabase.from('adventures_catalog').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('agenda_departures').select('*, adventures_catalog(title, base_price, max_pax)').in('status', ['scheduled', 'confirmed']).gte('start_date', new Date().toISOString().split('T')[0]).order('start_date', { ascending: true }).limit(6),
  ]);
  return { routes: routes || [], departures: departures || [] };
}

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const lang = params?.lang || 'es';
  const dict = getDictionary(lang);
  const { routes, departures } = await getPublicData();

  return (
    <div className="bg-stone-950 topographic-pattern topographic-contours min-h-screen text-stone-100 font-sans selection:bg-amber-500/30">
      
      {/* MENÚ SUPERIOR FLOTANTE GLASSMORPHISM */}
      <FloatingNavbar currentLang={lang} />

      {/* PESTAÑA LATERAL VIDRIO AHUMADO: CANAL DE RADIO GUÍA / SOS */}
      <GuideRadioWidget />

      {/* BOTÓN FLOTANTE INFERIOR: VOLVER AL INICIO */}
      <ScrollToTopButton />

      {/* 1. HERO SECTION CINEMATOGRÁFICO (Estándar MBA: Limpio, Aireado y Solo-Friendly) */}
      <section className="relative min-h-[75vh] sm:min-h-screen flex items-center justify-center pt-16 sm:pt-24 pb-4 sm:pb-12 px-5 sm:px-6 overflow-hidden">
        <HeroCarousel />

        <div className="relative z-10 max-w-5xl mx-auto text-center w-full mt-0 sm:mt-2">
          
          {/* Trust & Reviews: Solo Google sin contenedor de cápsula ni Sernatur (Tamaño aumentado) */}
          <div className="inline-flex items-center justify-center gap-2.5 sm:gap-3 mb-3 sm:mb-5 text-sm sm:text-base md:text-lg font-mono text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] select-none whitespace-nowrap">
            <span className="text-amber-400 font-bold tracking-widest text-base sm:text-xl md:text-2xl drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]">★★★★★</span>
            <span className="font-bold text-white tracking-wider">4.9/5 Google</span>
          </div>
          
          {/* Título Hero de Mayor Impacto y Proporción */}
          <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white leading-[0.92] mb-4 sm:mb-6 drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            {dict.hero.title_line1} <br />
            <span className="font-edo tracking-wider text-amber-400 drop-shadow-[0_6px_24px_rgba(0,0,0,0.7)]">
              {dict.hero.title_line2}
            </span>
          </h1>
          
          {/* Subtítulo con Mayor Legibilidad y Amplitud */}
          <p className="text-base sm:text-xl md:text-2xl text-white/95 max-w-2xl mx-auto font-normal leading-snug sm:leading-relaxed mb-6 sm:mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] px-2">
            {lang === 'en' 
              ? 'Expedition and adventure across Santiago summits. Get ready to experience freedom · Solo-Friendly.' 
              : lang === 'pt' 
              ? 'Expedição e aventura nos cumes de Santiago. Prepare-se para viver a experiência Solo-Friendly.' 
              : 'Expedición y aventura en las cumbres de Santiago. Prepárate para vivir la experiencia Solo-Friendly.'}
          </p>

          {/* Botón de Acción Principal */}
          <HeroActionButtons lang={lang} allRoutes={routes} />
        </div>
      </section>

      {/* 2. EL MOTOR DE EXPEDICIONES EN 3 PESTAÑAS (Estándar MBA: Elimina el scroll masivo) */}
      <UnifiedExpeditionsTabs routes={routes} lang={lang} />

      {/* 3. SISTEMA DE NIVELES TIPO MBA: "Distintos Niveles, Todas Cumbres Épicas" + Quiz */}
      <VisualLevelsSection lang={lang} />

      {/* 4. AGENDA: PRÓXIMAS SALIDAS CON CUPOS ABIERTOS (Urgencia & Reserva Directa) */}
      <section id="fechas-abiertas" className="py-20 sm:py-28 relative z-20 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.28em] font-semibold block mb-2">
              Calendario de Montaña
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Próximas Fechas Abiertas
            </h3>
            <p className="text-white/60 text-xs sm:text-sm font-light mt-2 font-mono">
              Salidas confirmadas en grupos reducidos. Reserva tu lugar en la cordada antes de que se agoten:
            </p>
          </div>

          {departures.length === 0 ? (
            <div className="py-12 text-center rounded-3xl" style={{backgroundColor:'rgba(255,255,255,0.04)',border:'1px dashed rgba(255,255,255,0.12)'}}>
              <p className="text-white/40 text-xs font-mono">No hay salidas programadas para los próximos días. Escríbenos al WhatsApp para enterarte de las aperturas espontáneas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departures.map((dep: any) => {
                const adv = dep.adventures_catalog;
                const spots = (adv?.max_pax || 0) - (dep.current_pax || 0);
                return (
                  <div key={dep.id} className="p-5 sm:p-6 flex items-center gap-5 hover:bg-white/10 transition-all rounded-3xl font-mono border border-white/10 shadow-lg" style={{backgroundColor:'rgba(12, 14, 18, 0.70)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)'}}>
                    <div className="text-center min-w-[56px] border-r border-white/10 pr-4">
                      <p className="text-2xl font-black text-white">{new Date(dep.start_date).toLocaleDateString('es-CL', { timeZone: 'UTC', day: 'numeric' })}</p>
                      <p className="text-[10px] font-bold text-amber-400 uppercase">
                        {new Date(dep.start_date).toLocaleDateString('es-CL', { timeZone: 'UTC', month: 'short' })}
                      </p>
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-white text-sm uppercase">{adv?.title || 'Expedición'}</p>
                      <p className="text-xs text-white/50 mt-0.5">
                        {spots <= 4 ? (
                          <span className="text-amber-400 font-bold">● Últimos {spots} cupos</span>
                        ) : (
                          <span className="text-emerald-400 font-medium">● Cupos disponibles</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-white text-sm">
                        ${Number(((adv?.base_price || 0) >= 5000) ? adv.base_price : 25000).toLocaleString('es-CL')}
                      </p>
                      <Link href={`/reservar?route=${adv?.id || ''}&fecha=${dep.id}`} className="text-[11px] text-amber-400 hover:text-white hover:underline uppercase tracking-wider block mt-1 font-bold">
                        Reservar &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. ATLAS ANDINO DE SANTIAGO (47 Cumbres Oficiales como Sello de Autoridad) */}
      <div id="atlas">
        <AtlasShowcaseSection />
      </div>

      {/* 6. TESTIMONIOS (Voces de la Cumbre) */}
      <section className="py-20 sm:py-24 bg-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center sm:text-left">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] mb-2 block font-semibold">
              Comunidad en Terreno
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Voces de la Cumbre
            </h2>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* 7. PLANES PRIVADOS & A MEDIDA (Ecosistema All-Inclusive & Boutique) */}
      <section id="alianzas" className="py-20 sm:py-24 bg-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 md:flex justify-between items-end border-b border-white/15 pb-8">
            <div>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] mb-2 block font-semibold">
                Formato Privado & Boutique
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                Cielo, Mar & Tierra
              </h2>
            </div>
            <p className="text-white/60 text-sm max-w-md mt-4 md:mt-0 font-light">
              La experiencia integral de Chile central: unimos las cumbres de los Andes, la costa pacífica y la gastronomía de autor a través de alianzas estratégicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <div className="p-7 rounded-3xl" style={{backgroundColor:'rgba(0, 0, 0, 0.35)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255, 255, 255, 0.10)'}}>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">01 · CORDILLERA</span>
              <h3 className="text-lg font-bold text-white uppercase mb-2">Refugios & Ascensos</h3>
              <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                Alojamiento en refugios de montaña y glampings boutique en Farellones y Cajón del Maipo. Salidas al atardecer, avistamiento astronómico y protocolos de primeros auxilios WFR.
              </p>
            </div>

            <div className="p-7 rounded-3xl" style={{backgroundColor:'rgba(0, 0, 0, 0.35)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255, 255, 255, 0.10)'}}>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">02 · GASTRONOMÍA</span>
              <h3 className="text-lg font-bold text-white uppercase mb-2">El "Tercer Tiempo"</h3>
              <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                Bajada directa del cerro a locales gastronómicos y viñedos aliados. Maridajes exclusivos, carnes y cocina de autor para celebrar la cumbre con la cordada.
              </p>
            </div>

            <div className="p-7 rounded-3xl" style={{backgroundColor:'rgba(0, 0, 0, 0.35)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255, 255, 255, 0.10)'}}>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">03 · COSTA PACÍFICA</span>
              <h3 className="text-lg font-bold text-white uppercase mb-2">Océano & Escape</h3>
              <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                Extensión opcional hacia la costa (Zapallar / Pichilemu): surf, hoteles frente al mar y desconexión total. De los Andes al Pacífico en 2 horas.
              </p>
            </div>
          </div>

          {/* Banner CTA Personalizado */}
          <div className="p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl" style={{backgroundColor:'rgba(245,158,11,0.10)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',border:'1px solid rgba(245,158,11,0.30)'}}>
            <div>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-1 font-bold">
                A Tu Medida
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-1">
                ¿Buscas un paquete privado o corporativo?
              </h3>
              <p className="text-white/65 text-xs sm:text-sm font-light max-w-xl">
                Diseñamos expediciones privadas 1 a 1, aniversarios para parejas o jornadas de team building para empresas con transporte, alojamiento y guianza exclusiva.
              </p>
            </div>
            <a
              href={`https://wa.me/56957958467?text=${encodeURIComponent('Hola Gaz! Me gustaría cotizar un plan privado o paquete a medida con Santiago Hiking.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-arcteryx-primary whitespace-nowrap shadow-sm text-xs font-mono font-bold tracking-wider !py-3.5 !px-7 shrink-0"
            >
              COTIZAR PAQUETE A MEDIDA
            </a>
          </div>

        </div>
      </section>

      {/* 8. EL CÍRCULO & COMUNIDAD */}
      <section id="circulo" className="py-20 sm:py-24 bg-transparent relative z-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="p-8 sm:p-12 text-center rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.7)]" style={{backgroundColor:'rgba(0, 0, 0, 0.35)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255, 255, 255, 0.10)'}}>
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] mb-2 block font-bold">
              Outdoor Club & Red
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
              El Círculo Santiago Hiking
            </h2>
            <p className="text-white/60 text-xs sm:text-sm font-light mb-6 max-w-xl mx-auto leading-relaxed">
              La montaña se disfruta en cordada. Únete al canal oficial de WhatsApp donde avisamos aperturas espontáneas, reportes de aristas y compartimos fotos de cada cumbre.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`https://wa.me/56957958467?text=${encodeURIComponent('Hola Gaz! Quiero unirme a la comunidad y salidas grupales de Santiago Hiking.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arcteryx-primary shadow-sm !py-3 !px-6 text-xs font-mono font-bold"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> ENTRAR AL WHATSAPP OFICIAL
              </a>
              <a
                href="https://www.instagram.com/santiagohiking"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arcteryx shadow-xs !py-3 !px-6 text-xs font-mono font-bold"
              >
                <Camera className="w-4 h-4 mr-2" /> INSTAGRAM @SANTIAGOHIKING
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER OFICIAL SANTIAGO HIKING */}
      <Footer />

    </div>
  );
}

