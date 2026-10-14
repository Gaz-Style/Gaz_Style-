import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./HeroCarousel";
import { 
  Mountain, ShieldCheck, Clock, HeartPulse, Compass, 
  MessageCircle, Camera, Tent, ArrowRight, CheckCircle2, 
  Star, Trophy, Flame, MapPin, Sparkles, Navigation, Calendar
} from "lucide-react";
import TestimonialsCarousel from "./TestimonialsCarousel";
import FloatingNavbar from "./FloatingNavbar";
import GuideRadioWidget from "./GuideRadioWidget";
import LeadMagnetForm from "./LeadMagnetForm";
import HeroActionButtons from "./HeroActionButtons";
import SwipeCarousel from "./SwipeCarousel";
import ScrollToTopButton from "./ScrollToTopButton";
import ExperienceFilterableGrid from "./ExperienceFilterableGrid";
import { createClient } from '@supabase/supabase-js';

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
  const { routes, departures } = await getPublicData();

  // ── SEPARACIÓN ESTRICTA DE TIPOLOGÍAS ──────────────────────────────────────────
  // Salidas Grupales: SOLO trekking regular, sunset y salidas de día.
  // Los Grandes Desafíos y Expediciones jamás deben mezclarse aquí.
  const salidasGrupales = routes.filter((r: any) => {
    const cat = (r.category || '').toLowerCase();
    const vt = (r.vertical_type || '').toLowerCase();
    const title = (r.title || '').toLowerCase();
    const isChallenge =
      cat.includes('desafío') ||
      cat.includes('desafio') ||
      vt === 'challenges' ||
      vt === 'expeditions' ||
      title.includes('desafío') ||
      title.includes('desafio') ||
      title.includes('triple corona') ||
      title.includes('desbloqueando') ||
      title.includes('sierra de ramón') ||
      title.includes('sierra de ramon');
    return !isChallenge;
  });

  // Los Grandes Desafíos & Expediciones Andinas (Alimentados dinámicamente)
  const dbDesafios = routes.filter((r: any) => {
    const cat = (r.category || '').toLowerCase();
    const vt = (r.vertical_type || '').toLowerCase();
    const title = (r.title || '').toLowerCase();
    return (
      vt === 'challenges' ||
      vt === 'expeditions' ||
      cat.includes('desafío') ||
      cat.includes('desafio') ||
      title.includes('desafío') ||
      title.includes('desafio') ||
      title.includes('triple corona') ||
      title.includes('desbloqueando') ||
      title.includes('sierra de ramón') ||
      title.includes('sierra de ramon')
    );
  });

  // Lista de desafíos: si existen en DB los usa dinámicamente; si no, fallback a los 4 icónicos
  const desafiosList = dbDesafios.length > 0 ? dbDesafios : [
    { id: '1', title: 'Desafío 5:00 AM', badge: 'COTA 1.638M · MANQUEHUITO', image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85', description: 'Ascenso nocturno con linternas frontales. Conquista la cumbre al romper el alba con café caliente sobre el mar de nubes de Santiago.' },
    { id: '2', title: 'La Triple Corona', badge: '3 CUMBRES · +2.100M D+', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85', description: 'El reto andino definitivo: Manquehuito, Cerro Manquehue y Cerro Pochoco. Forja resistencia real en los Andes.' },
    { id: '3', title: 'Sierra de Ramón', badge: 'COTA 3.250M · ALTA EXIGENCIA', image_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85', description: 'La travesía técnica reina de Santiago. Aristas de roca, vistas 360° y protocolo WFR estricto.' },
    { id: '4', title: 'Desbloqueando Santiago', badge: 'PLAN 6 SEMANAS · 1 CERRO/SEM', image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85', description: 'El pasaporte de montaña para principiantes activos. Dificultad creciente, orientación en subida y cumbres semanales.' }
  ];

  return (
    <div className="bg-stone-950 topographic-pattern topographic-contours min-h-screen text-stone-100 font-sans selection:bg-amber-500/30">
      
      {/* MENÚ SUPERIOR FLOTANTE GLASSMORPHISM TIPO BOTÓN (Inspirado en Arc'teryx) */}
      <FloatingNavbar currentLang={lang} />

      {/* PESTAÑA LATERAL VIDRIO AHUMADO: CANAL DE RADIO GUÍA / SOS */}
      <GuideRadioWidget />

      {/* BOTÓN FLOTANTE INFERIOR: VOLVER AL INICIO */}
      <ScrollToTopButton />

      {/* 1. HERO SECTION CINEMATOGRÁFICO (Inspirado en Arc'teryx) */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 px-6 overflow-hidden">
        <HeroCarousel />

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-6 sm:mt-10">
          {/* 1. Trust & Reviews Badge Superior (Flotante limpio y con buena separación) */}
          <div className="inline-flex items-center justify-center gap-2.5 sm:gap-4 mb-8 sm:mb-12 text-[12px] sm:text-[14px] font-mono tracking-wider text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-black text-sm sm:text-base tracking-tight drop-shadow-sm">★★★★★</span>
              <span className="font-bold text-white">4.9/5</span>
            </div>
            <span className="text-white/40 hidden sm:inline">·</span>
            <div className="hidden sm:flex items-center gap-1.5 text-white/95">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Guías WFR</span>
            </div>
            <span className="text-white/40 hidden sm:inline">·</span>
            <div className="hidden sm:flex items-center gap-1.5 text-white/95">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>SOS Satelital Garmin</span>
            </div>
          </div>
          
          {/* 2. Título Hero Sólido con Tipografía Oficial de Hiking (font-edo) en Dorado Andino */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white leading-[0.92] mb-6 drop-shadow-md">
            DESBLOQUEA <br />
            <span className="font-edo tracking-wider block mt-2 text-6xl sm:text-8xl md:text-9xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              LA CUMBRE.
            </span>
          </h1>
          
          {/* 3. Subtítulo (Bajada) */}
          <p className="text-base sm:text-lg md:text-xl text-slate-100 max-w-2xl mx-auto font-normal leading-relaxed mb-10 drop-shadow">
            {lang === 'en'
              ? 'The city goes silent when the mountain speaks. Wild trekking, trail, and raw adrenaline in the Andes of Santiago, Chile: feel the altitude, break your limits, and claim your place at the summit.'
              : 'La ciudad se calla cuando habla la montaña. Rutas salvajes de trekking, trail y adrenalina en los Andes de Santiago de Chile: siente la altura, rompe tus límites y reclama tu lugar en la cima.'}
          </p>

          {/* 4. Botones Píldora Glassmorphism */}
          <HeroActionButtons lang={lang} />
        </div>
      </section>

      {/* CATÁLOGO DE SALIDAS ACTIVAS DE TEMPORADA */}
      <section id="rutas" className="py-8 sm:py-14 bg-transparent relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-4 sm:mb-6 border-b border-white/15 pb-3 sm:pb-4">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] mb-1 block font-semibold">
              Temporada 2026 · Catálogo Oficial
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Experiencias & Rutas Andinas
            </h2>
            <p className="text-white/60 text-sm mt-1.5 font-light max-w-lg">
              Explora nuestros 4 pilares: Salidas Grupales comunitarias, Travesías deportivas, Expedition Pass privado a medida y Expediciones High Mountain.
            </p>
          </div>

          {/* ── Vitrina Interactiva de Experiencias Filtrables por Categoría ── */}
          <ExperienceFilterableGrid routes={routes} />
        </div>
      </section>

      {/* 2. LOS GRANDES DESAFÍOS ANDINOS (Lienzo Blanco Editorial: Fotografías como Galería) */}
      <section id="desafios" className="py-10 sm:py-16 md:py-20 bg-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-4 sm:mb-8 border-b border-white/15 pb-3 sm:pb-4 flex flex-col md:flex-row md:items-end justify-between gap-2.5 sm:gap-4">
            <div>
              <span className="text-white/50 font-mono text-[10px] tracking-[0.3em] uppercase block mb-1">
                The Andes Challenges · Serie 2026
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                Los Grandes Desafíos
              </h2>
            </div>
            <p className="text-white/60 text-xs md:text-sm max-w-md font-light leading-relaxed">
              Expediciones icónicas diseñadas para llevar tu resistencia física y mental al siguiente nivel en la Cordillera de los Andes.
            </p>
          </div>

          <SwipeCarousel peekWidth={32} gap={14}>
            {desafiosList.map((d: any, idx: number) => {
              const num = String(idx + 1).padStart(2, '0');
              const t = (d.title || '').toLowerCase();
              let slug = `/rutas/${d.id}`;
              if (t.includes('5:00 am') || t.includes('5am')) slug = '/desafios/desafio-5am';
              else if (t.includes('triple corona')) slug = '/desafios/triple-corona';
              else if (t.includes('sierra de ramón') || t.includes('sierra de ramon')) slug = '/desafios/sierra-de-ramon';
              else if (t.includes('desbloqueando')) slug = '/desafios/desbloqueando-santiago';

              const meta = d.badge || (d.vertical_type === 'expeditions' ? 'ALTA MONTAÑA · ANDES' : 'GRAN DESAFÍO · CUENCA CENTRAL');
              const imgSrc = d.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85';

              return (
                <div key={d.id || num} className="relative min-h-[500px] overflow-hidden flex flex-col justify-end p-8 group border border-stone-200/20 hover:border-white/30 transition-all duration-500 bg-stone-900 rounded-2xl">
                  <Image src={imgSrc} alt={d.title} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent pointer-events-none" />
                  <div className="relative z-10 space-y-3">
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/70 block">{num} · {meta}</span>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">{d.title}</h3>
                    <p className="text-slate-200 text-sm font-light leading-relaxed line-clamp-3">{d.description || 'Reto de montaña de alta exigencia física y mental en los Andes de Santiago.'}</p>
                    <div className="pt-2">
                      <Link href={slug} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-white border-b border-white/60 pb-1 hover:border-white transition-all hover:text-amber-300">
                        Ver Detalles y Ficha Técnica &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </SwipeCarousel>
        </div>
      </section>

      {/* 3. SISTEMA DE NIVELES FUNCIONAL (Limpio, Técnico & Sereno) */}
      <section id="niveles" className="py-24 bg-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-white/50 font-mono text-[10px] tracking-[0.3em] uppercase block mb-1">
              Graduación Técnica · Cuenca Central
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Sistema de Niveles de Montaña
            </h2>
          </div>

          <div className="glass-divide rounded-xl px-6 md:px-10" style={{backgroundColor:'rgba(255,255,255,0.06)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',border:'1px solid rgba(255,255,255,0.11)'} as React.CSSProperties}>
            
            {/* Nivel 1 */}
            <div className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/10 transition-colors">
              <div className="flex items-baseline gap-4 md:w-1/3">
                <span className="text-white/40 font-mono text-xs font-bold">01</span>
                <div>
                  <h4 className="text-white font-bold text-lg uppercase tracking-tight">Iniciación Activa</h4>
                  <span className="text-[11px] font-mono text-white/45 block">Desnivel &lt;400m+ · 3.5 hrs</span>
                </div>
              </div>
              <p className="text-white/60 text-xs md:text-sm font-light md:w-1/2 leading-relaxed">
                Ritmo amable y pausas panorámicas. Ideal para tu primera cumbre, fotografía profesional y café al atardecer sobre la cuenca.
              </p>
              <div className="md:w-1/6 md:text-right">
                <span className="text-[11px] font-mono text-amber-300 font-semibold uppercase tracking-wider">Sunset Manquehuito</span>
              </div>
            </div>

            {/* Nivel 2 */}
            <div className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/10 transition-colors">
              <div className="flex items-baseline gap-4 md:w-1/3">
                <span className="text-white/40 font-mono text-xs font-bold">02</span>
                <div>
                  <h4 className="text-white font-bold text-lg uppercase tracking-tight">Cardio & Desconexión</h4>
                  <span className="text-[11px] font-mono text-white/45 block">Desnivel 400 a 800m+ · 4-5 hrs</span>
                </div>
              </div>
              <p className="text-white/60 text-xs md:text-sm font-light md:w-1/2 leading-relaxed">
                Ritmo deportivo sostenido para botar el estrés de la oficina. Exige calzado con buen agarre, respiración constante y energía activa.
              </p>
              <div className="md:w-1/6 md:text-right">
                <span className="text-[11px] font-mono text-amber-300 font-semibold uppercase tracking-wider">WildTrek / Pochoco</span>
              </div>
            </div>

            {/* Nivel 3 */}
            <div className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/10 transition-colors">
              <div className="flex items-baseline gap-4 md:w-1/3">
                <span className="text-white/40 font-mono text-xs font-bold">03</span>
                <div>
                  <h4 className="text-white font-bold text-lg uppercase tracking-tight">Desafío Andino</h4>
                  <span className="text-[11px] font-mono text-white/45 block">Desnivel 800 a 1.400m+ · 6-8 hrs</span>
                </div>
              </div>
              <p className="text-white/60 text-xs md:text-sm font-light md:w-1/2 leading-relaxed">
                Terreno técnico, piedras sueltas y exigencia física real. Requiere preparación previa, bastones de trekking y chequeo médico.
              </p>
              <div className="md:w-1/6 md:text-right">
                <span className="text-[11px] font-mono text-amber-300 font-semibold uppercase tracking-wider">Manquehue / Provincia</span>
              </div>
            </div>

            {/* Nivel 4 */}
            <div className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/10 transition-colors">
              <div className="flex items-baseline gap-4 md:w-1/3">
                <span className="text-white/40 font-mono text-xs font-bold">04</span>
                <div>
                  <h4 className="text-white font-bold text-lg uppercase tracking-tight">Alta Montaña</h4>
                  <span className="text-[11px] font-mono text-white/45 block">Altitud &gt;3.800m · Full Day / Campamento</span>
                </div>
              </div>
              <p className="text-white/60 text-xs md:text-sm font-light md:w-1/2 leading-relaxed">
                Cumbres mayores sobre los 4.000m. Exposición a altitud, viento y posible campamento base. Guiado estricto con botiquín WFR y satélite.
              </p>
              <div className="md:w-1/6 md:text-right">
                <span className="text-[11px] font-mono text-amber-300 font-semibold uppercase tracking-wider">Pintor / El Plomo</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 5. PLANES "CIELO, MAR Y TIERRA" (Ecosistema All-Inclusive) */}
      <section id="alianzas" className="py-28 bg-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:flex justify-between items-end border-b border-white/15 pb-8">
            <div>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] mb-2 block font-semibold">
                Ecosistema All-Inclusive
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                Cielo, Mar & Tierra
              </h2>
            </div>
            <p className="text-white/60 text-sm max-w-md mt-4 md:mt-0 font-light">
              La experiencia integral de Chile central: unimos las cumbres de los Andes, la costa pacífica y la gastronomía de autor a través de alianzas estratégicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            <div className="p-8 rounded-2xl" style={{backgroundColor:'rgba(255,255,255,0.06)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.10)'}}>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">01 · CORDILLERA</span>
              <h3 className="text-xl font-bold text-white uppercase mb-3">Refugios & Ascensos</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Alojamiento en refugios de montaña y glampings boutique en Farellones y Cajón del Maipo. Salidas al atardecer, avistamiento astronómico y seguridad certificada WFR.
              </p>
            </div>

            <div className="p-8 rounded-2xl" style={{backgroundColor:'rgba(255,255,255,0.06)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.10)'}}>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">02 · GASTRONOMÍA</span>
              <h3 className="text-xl font-bold text-white uppercase mb-3">El "Tercer Tiempo"</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Bajada directa del cerro a locales gastronómicos y viñedos aliados. Maridajes exclusivos, carnes y cocina de autor para reponer energías con el grupo o tu pareja.
              </p>
            </div>

            <div className="p-8 rounded-2xl" style={{backgroundColor:'rgba(255,255,255,0.06)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.10)'}}>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">03 · COSTA PACÍFICA</span>
              <h3 className="text-xl font-bold text-white uppercase mb-3">Océano & Escape</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Extensión opcional hacia la costa (Zapallar / Pichilemu): surf, hoteles frente al mar y desconexión total. De la nieve de los Andes a las olas del Pacífico en 2 horas.
              </p>
            </div>

          </div>

          {/* Banner CTA Personalizado */}
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl" style={{backgroundColor:'rgba(245,158,11,0.10)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',border:'1px solid rgba(245,158,11,0.30)'}}>
            <div>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
                A Tu Medida
              </span>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                ¿Buscas un paquete privado o corporativo?
              </h3>
              <p className="text-white/65 text-sm font-light max-w-xl">
                Diseñamos expediciones privadas 1 a 1, aniversarios para parejas o jornadas de team building para empresas con transporte, alojamiento y guianza exclusiva.
              </p>
            </div>
            <a
              href={`https://wa.me/56957958467?text=${encodeURIComponent('Hola Gaz! Me gustaría cotizar un plan privado o paquete a medida con Santiago Hiking.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-arcteryx-primary whitespace-nowrap shadow-sm"
            >
              COTIZAR PAQUETE A MEDIDA
            </a>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIOS (Voces de la Cumbre) */}
      <section className="py-24 bg-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
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

      {/* 7. EL CÍRCULO & PRÓXIMAS SALIDAS */}
      <section id="circulo" className="py-28 bg-transparent relative z-20">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="p-8 md:p-14 text-center mb-16 rounded-2xl" style={{backgroundColor:'rgba(255,255,255,0.06)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.11)'}}>
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] mb-3 block font-bold">
              Outdoor Club & Red
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
              El Círculo Santiago Hiking
            </h2>
            <p className="text-white/60 text-sm md:text-base font-light mb-8 max-w-xl mx-auto leading-relaxed">
              La montaña se disfruta en comunidad. Únete al WhatsApp oficial gratuito donde avisamos salidas espontáneas, resolvemos dudas de equipo y compartimos fotos de cada cumbre.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`https://wa.me/56957958467?text=${encodeURIComponent('Hola Gaz! Quiero unirme a la comunidad y salidas grupales de Santiago Hiking.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arcteryx-primary shadow-sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> ENTRAR AL WHATSAPP OFICIAL
              </a>
              <a
                href="https://www.instagram.com/santiagohiking"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arcteryx shadow-xs"
              >
                <Camera className="w-4 h-4 mr-2" /> INSTAGRAM @SANTIAGOHIKING
              </a>
            </div>
          </div>

          {/* AGENDA - PRÓXIMAS SALIDAS */}
          <div>
            <div className="mb-8 flex justify-between items-end border-b border-white/15 pb-4">
              <div>
                <span className="text-amber-400 font-mono text-[10px] uppercase tracking-widest block font-semibold">Calendario</span>
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Fechas Abiertas</h3>
              </div>
            </div>

            {departures.length === 0 ? (
              <div className="py-12 text-center rounded-2xl" style={{backgroundColor:'rgba(255,255,255,0.04)',border:'1px dashed rgba(255,255,255,0.12)'}}>
                <p className="text-white/40 text-xs font-mono">No hay salidas programadas para los próximos días. Únete al WhatsApp para enterarte de las aperturas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departures.map((dep: any) => {
                  const adv = dep.adventures_catalog;
                  const spots = (adv?.max_pax || 0) - (dep.current_pax || 0);
                  return (
                    <div key={dep.id} className="p-6 flex items-center gap-5 hover:bg-white/10 transition-all rounded-2xl font-mono" style={{backgroundColor:'rgba(255,255,255,0.06)',backdropFilter:'blur(14px)',WebkitBackdropFilter:'blur(14px)',border:'1px solid rgba(255,255,255,0.10)'}}>
                      <div className="text-center min-w-[56px] border-r border-white/10 pr-4">
                        <p className="text-2xl font-black text-white">{new Date(dep.start_date).toLocaleDateString('es-CL', { timeZone: 'UTC', day: 'numeric' })}</p>
                        <p className="text-[10px] font-bold text-amber-400 uppercase">
                          {new Date(dep.start_date).toLocaleDateString('es-CL', { timeZone: 'UTC', month: 'short' })}
                        </p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-white text-sm uppercase">{adv?.title || 'Expedición'}</p>
                        <p className="text-xs text-white/50 mt-0.5">
                          {spots <= 5 ? (
                            <span className="text-amber-400 font-bold">Últimos {spots} cupos</span>
                          ) : (
                            <span>Cupos disponibles</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white text-sm">
                          ${Number(((adv?.base_price || 0) >= 5000) ? adv.base_price : 25000).toLocaleString('es-CL')}
                        </p>
                        <Link href="/reservar" className="text-[10px] text-amber-400 hover:text-white hover:underline uppercase tracking-wider block mt-1 font-bold">
                          Reservar &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 8. FOOTER CARTOGRÁFICO (Inspirado en Roark) */}
      <footer className="pt-16 pb-12 font-mono text-xs relative z-20" style={{backgroundColor:'rgba(0,0,0,0.55)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12" style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            
            {/* Columna Marca */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Image
                  src="/logotipo blanco.png"
                  alt="Santiago Hiking"
                  width={340}
                  height={80}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
              <p className="text-white/50 text-xs font-sans font-light leading-relaxed">
                {lang === 'en'
                  ? 'Expeditions in the Chilean Andes, backcountry safety, and summits above Santiago. Guided by Gaz.'
                  : 'Expediciones en los Andes chilenos, seguridad en montaña y cumbres sobre el valle de Santiago. Guiado por Gaz.'}
              </p>
              <p className="text-[11px] text-white/30 font-mono">
                CORDILLERA DE LOS ANDES · SANTIAGO DE CHILE <br />
                LAT -33.35° S · LON -70.51° W
              </p>
            </div>

            {/* Columna Rutas */}
            <div>
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Expediciones</p>
              <ul className="space-y-2 text-xs">
                <li><Link href="/desafios/desafio-5am" className="hover:text-amber-600 transition-colors">Desafío 5:00 AM</Link></li>
                <li><Link href="/desafios/triple-corona" className="hover:text-amber-600 transition-colors">Triple Corona Santiago</Link></li>
                <li><Link href="/desafios/sierra-de-ramon" className="hover:text-amber-600 transition-colors">Sierra de Ramón (3.250m)</Link></li>
                <li><Link href="/desafios/desbloqueando-santiago" className="hover:text-amber-600 transition-colors">Desbloqueando Santiago</Link></li>
                <li><a href="#rutas" className="hover:text-amber-600 transition-colors">Sunset Manquehuito</a></li>
              </ul>
            </div>

            {/* Columna Alianzas */}
            <div>
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Ecosistema</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#alianzas" className="hover:text-amber-600 transition-colors">Cielo, Mar y Tierra</a></li>
                <li><a href="#alianzas" className="hover:text-amber-600 transition-colors">Hoteles & Refugios Aliados</a></li>
                <li><a href="#alianzas" className="hover:text-amber-600 transition-colors">Gastronomía & Tercer Tiempo</a></li>
                <li><a href="#alianzas" className="hover:text-amber-600 transition-colors">Expediciones B2B / Empresas</a></li>
                <li><Link href="/faq" className="hover:text-amber-600 transition-colors">Protocolo WFR & Seguridad</Link></li>
              </ul>
            </div>

            {/* Columna Contacto */}
            <div>
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Contacto Directo</p>
              <ul className="space-y-2 text-xs">
                <li>WhatsApp Oficial: <a href="https://wa.me/56957958467" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">+56 9 5795 8467</a></li>
                <li>Instagram: <a href="https://instagram.com/santiagohiking" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">@santiagohiking</a></li>
                <li>Asistente IA: Activo 24/7 en WhatsApp</li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-white/35">
            <p>&copy; 2026 GAZ_STYLE · SANTIAGO HIKING. TODOS LOS DERECHOS RESERVADOS.</p>
            <div className="flex gap-6">
              <Link href="/faq" className="hover:text-stone-900 transition-colors">FAQ & Montaña</Link>
              <Link href="/reservar" className="hover:text-stone-900 transition-colors">Checkout</Link>
              <Link href="/llms.txt" className="hover:text-stone-900 transition-colors">LLMs Protocol</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
