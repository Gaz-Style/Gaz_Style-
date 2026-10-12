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
import LanguageSwitcher from "./LanguageSwitcher";
import LeadMagnetForm from "./LeadMagnetForm";
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

  return (
    <div className="topographic-pattern topographic-contours min-h-screen text-slate-200 font-sans selection:bg-amber-500/30">
      
      {/* HEADER TÉCNICO EDITORIAL */}
      <header className="fixed w-full top-0 z-50 bg-[#08090c]/85 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo Gaz_Style / Santiago Hiking */}
          <Link href="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]">
            <Image 
              src="/santiago-hiking-10.png" 
              alt="Santiago Hiking by Gaz" 
              width={180} 
              height={80} 
              className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_2px_15px_rgba(245,158,11,0.2)]" 
              priority 
            />
          </Link>

          {/* Menú de Navegación Rápida */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-300">
            <a href="#desafios" className="hover:text-amber-400 transition-colors">Desafíos</a>
            <a href="#niveles" className="hover:text-amber-400 transition-colors">Niveles</a>
            <a href="#rutas" className="hover:text-amber-400 transition-colors">Salidas</a>
            <a href="#alianzas" className="hover:text-amber-400 transition-colors">Cielo, Mar & Tierra</a>
            <a href="#circulo" className="hover:text-amber-400 transition-colors">Comunidad</a>
          </nav>

          {/* Selector de Idioma & CTA Arc'teryx */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} />
            <a href="#rutas" className="hidden lg:inline-flex btn-arcteryx">
              Reservar
            </a>
          </div>

        </div>
      </header>

      {/* 1. HERO SECTION CINEMATOGRÁFICO (Inspirado en Arc'teryx) */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 px-6 overflow-hidden">
        <HeroCarousel />

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-12">
          {/* Badge de Coordenadas Geográficas */}
          <div className="inline-flex items-center gap-2 border border-white/20 bg-black/60 backdrop-blur-md px-4 py-1.5 mb-8 text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-slate-300">
            <span>33°21'S 70°30'W</span>
            <span className="text-amber-500">·</span>
            <span>ANDES EXPEDITIONS</span>
            <span className="text-amber-500">·</span>
            <span className="text-amber-400 font-bold">LO BARNECHEA</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6">
            ENCUENTRA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">
              TU CUMBRE.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Expediciones boutique, desconexión laboral y comunidad outdoor en la Cordillera de los Andes de Santiago.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#rutas" className="btn-arcteryx-primary w-full sm:w-auto">
              EXPLORAR SALIDAS ACTIVAS
            </a>
            <a href="#desafios" className="btn-arcteryx w-full sm:w-auto">
              LOS GRANDES DESAFÍOS
            </a>
          </div>
        </div>
      </section>

      {/* LEAD MAGNET / DESCARGA GUÍA */}
      <section className="py-12 bg-black/40 border-y border-white/10 relative z-20">
        <div className="max-w-5xl mx-auto px-6">
          <LeadMagnetForm
            title="Guía Técnica de Rutas de Santiago."
            subtitle="Recibe gratis en tu correo el mapa de desniveles, equipamiento WFR y cerros imperdibles."
            buttonText="Descargar Guía"
            lang={lang}
          />
        </div>
      </section>

      {/* 2. LOS GRANDES DESAFÍOS ANDINOS */}
      <section id="desafios" className="py-28 relative z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:flex justify-between items-end border-b border-white/10 pb-8">
            <div>
              <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] mb-2 block flex items-center gap-2">
                <Trophy className="w-4 h-4" /> The Andes Challenges
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                Los Grandes Desafíos
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md mt-4 md:mt-0 font-light leading-relaxed">
              Retos diseñados para llevar tu resistencia física y tu fortaleza mental al siguiente nivel en la cordillera central.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Desafío 1: 5:00 AM Sunrise */}
            <div className="bg-[#101217]/80 border border-white/10 p-8 md:p-10 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  05:00 AM · COTA 1.638M
                </span>
                <span className="text-slate-500 font-mono text-xs">#01</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">
                Desafío 5:00 AM · Amanecer en Cumbre
              </h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
                Ascenso nocturno con linternas Petzl bajo el cielo estrellado. Cumbre al romper el alba con café de especialidad caliente sobre el mar de nubes de Santiago. Bajas antes de que la ciudad despierte.
              </p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-slate-400">
                <span>Cerro Manquehuito</span>
                <a href="#rutas" className="text-amber-400 hover:text-white uppercase font-bold tracking-wider flex items-center gap-1">
                  Ver Próxima Fecha <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Desafío 2: Triple Corona */}
            <div className="bg-[#101217]/80 border border-white/10 p-8 md:p-10 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase px-3 py-1 bg-white/10 text-white border border-white/20 font-bold">
                  3 CUMBRES · +2.100M D+
                </span>
                <span className="text-slate-500 font-mono text-xs">#02</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">
                La Triple Corona de Santiago
              </h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
                El reto andino definitivo: Manquehuito, Cerro Manquehue y Cerro Pochoco. Un programa progresivo para conquistar las tres cumbres más emblemáticas de la cuenca y forjar resistencia real.
              </p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-slate-400">
                <span>28 km Totales</span>
                <a 
                  href={`https://wa.me/56957958467?text=${encodeURIComponent('Hola Gaz! Me interesa información sobre el Desafío Triple Corona de Santiago.')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-400 hover:text-white uppercase font-bold tracking-wider flex items-center gap-1"
                >
                  Consultar Cupos <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Desafío 3: Sierra de Ramón */}
            <div className="bg-[#101217]/80 border border-white/10 p-8 md:p-10 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                  COTA 3.250M · ALTA EXIGENCIA
                </span>
                <span className="text-slate-500 font-mono text-xs">#03</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">
                Travesía Sierra de Ramón
              </h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
                La travesía técnica reina de Santiago. Aristas de roca, vistas panorámicas de 360° hacia los valles centrales y protocolo de autosuficiencia y seguridad con guías certificados WFR.
              </p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-slate-400">
                <span>Jornada Completa (8-10h)</span>
                <a 
                  href={`https://wa.me/56957958467?text=${encodeURIComponent('Hola Gaz! Quiero postular a la Travesía Sierra de Ramón.')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-400 hover:text-white uppercase font-bold tracking-wider flex items-center gap-1"
                >
                  Postular <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Desafío 4: Desbloqueando Santiago */}
            <div className="bg-[#101217]/80 border border-white/10 p-8 md:p-10 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  PLAN 6 SEMANAS · 1 CERRO/SEM
                </span>
                <span className="text-slate-500 font-mono text-xs">#04</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">
                Desbloqueando Santiago
              </h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
                El pasaporte de montaña para principiantes activos. Una ruta semanal con dificultad creciente para ponerte en forma, aprender orientación, respiración en subida y conquistar la capital cima por cima.
              </p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-slate-400">
                <span>Comunidad & Acondicionamiento</span>
                <a 
                  href={`https://wa.me/56957958467?text=${encodeURIComponent('Hola Gaz! Quiero saber cómo funciona el plan Desbloqueando Santiago.')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-400 hover:text-white uppercase font-bold tracking-wider flex items-center gap-1"
                >
                  Unirme al Reto <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SISTEMA DE NIVELES FUNCIONAL (Inspirado en MBA, claro y sin rodeos) */}
      <section id="niveles" className="py-24 bg-black/60 relative z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] mb-2 block">
              Graduación de Exigencia
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Sistema de Niveles de Aventura
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-6 bg-white/[0.02] border border-white/10 hover:border-emerald-500/40 transition-colors">
              <span className="text-emerald-400 font-mono font-bold text-sm block mb-2">NIVEL 01</span>
              <h4 className="text-white font-bold text-lg mb-2">Iniciación Activa</h4>
              <p className="text-slate-400 text-xs font-light leading-relaxed mb-4">
                Desnivel moderado (&lt;400m+). Ritmo amable y pausas panorámicas. Ideal para tu primera cumbre, fotografía y café al atardecer.
              </p>
              <span className="text-[11px] font-mono text-slate-500 block">Ej: Sunset Manquehuito</span>
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-colors">
              <span className="text-amber-400 font-mono font-bold text-sm block mb-2">NIVEL 02</span>
              <h4 className="text-white font-bold text-lg mb-2">Cardio & Desconexión</h4>
              <p className="text-slate-400 text-xs font-light leading-relaxed mb-4">
                Desnivel 400 a 800m+. Ritmo deportivo sostenido para botar el estrés laboral. Exige calzado con buen agarre y condición activa.
              </p>
              <span className="text-[11px] font-mono text-slate-500 block">Ej: WildTrek / Pochoco</span>
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/10 hover:border-orange-500/40 transition-colors">
              <span className="text-orange-400 font-mono font-bold text-sm block mb-2">NIVEL 03</span>
              <h4 className="text-white font-bold text-lg mb-2">Desafío Andino</h4>
              <p className="text-slate-400 text-xs font-light leading-relaxed mb-4">
                Desnivel 800 a 1.400m+. Terreno técnico, piedras sueltas y jornadas de 6 a 8 horas. Requiere preparación previa y bastones.
              </p>
              <span className="text-[11px] font-mono text-slate-500 block">Ej: Cerro Manquehue / Provincia</span>
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/10 hover:border-red-500/40 transition-colors">
              <span className="text-red-400 font-mono font-bold text-sm block mb-2">NIVEL 04</span>
              <h4 className="text-white font-bold text-lg mb-2">Alta Montaña</h4>
              <p className="text-slate-400 text-xs font-light leading-relaxed mb-4">
                Cumbres sobre los 3.800m. Exposición a altitud, viento y posible campamento base. Guiado estricto con botiquín WFR y satélite.
              </p>
              <span className="text-[11px] font-mono text-slate-500 block">Ej: Cerro Pintor 4.180m / El Plomo</span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CATÁLOGO DE SALIDAS ACTIVAS DE TEMPORADA */}
      <section id="rutas" className="py-28 relative z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:flex justify-between items-end border-b border-white/10 pb-8">
            <div>
              <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] mb-2 block">
                Temporada 2026
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                Salidas Grupales Activas
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm mt-4 md:mt-0 font-light">
              Grupos reducidos guiados por Gaz. Equipamiento de seguridad, primeros auxilios WFR y fotografía profesional de cumbre incluidos.
            </p>
          </div>

          {routes.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10">
              <Tent className="w-12 h-12 text-amber-500/30 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">Próximamente publicaremos el nuevo calendario de salidas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {routes.map((route: any, i: number) => (
                <div key={route.id} className="bg-[#101217] border border-white/10 flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300">
                  
                  {/* Foto de Portada de la Ruta */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-stone-900">
                    {route.image_url ? (
                      <Image
                        src={route.image_url}
                        alt={route.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <Mountain className="w-16 h-16 text-amber-500/20 m-auto" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101217] via-transparent to-transparent" />
                    <span className="absolute top-4 right-4 bg-black/70 backdrop-blur px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white border border-white/10">
                      {route.category}
                    </span>
                  </div>

                  {/* Ficha Técnica */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
                        {route.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-6 font-light line-clamp-2">
                        {route.description || 'Guiado premium paso a paso en la cordillera.'}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 border-y border-white/10 py-4 mb-6 text-center font-mono">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Duración</p>
                          <p className="text-xs font-bold text-white">{route.duration_text || `${route.duration_days}d`}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Dificultad</p>
                          <p className="text-xs font-bold text-amber-400">{route.difficulty_level}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Cupo Máx</p>
                          <p className="text-xs font-bold text-white">{route.max_pax} pax</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">Desde</span>
                        <span className="text-2xl font-black text-white font-mono">${Number(route.base_price).toLocaleString('es-CL')}</span>
                      </div>
                      <Link href={`/rutas/${route.id}`} className="btn-arcteryx">
                        Ver Ficha
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. PLANES "CIELO, MAR Y TIERRA" (All-Inclusive & Alianzas Estratégicas) */}
      <section id="alianzas" className="py-28 bg-[#090b0e] relative z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:flex justify-between items-end border-b border-white/10 pb-8">
            <div>
              <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] mb-2 block">
                Ecosistema All-Inclusive
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                Cielo, Mar & Tierra
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md mt-4 md:mt-0 font-light">
              La experiencia integral de Chile central: unimos las cumbres de los Andes, la costa pacífica y la gastronomía de autor a través de alianzas estratégicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            <div className="border border-white/10 p-8 bg-black/40">
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">01 · CORDILLERA</span>
              <h3 className="text-xl font-bold text-white uppercase mb-3">Refugios & Ascensos</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Alojamiento en refugios de montaña y glampings boutique en Lo Barnechea y Farellones. Salidas al atardecer, avistamiento astronómico y seguridad certificada WFR.
              </p>
            </div>

            <div className="border border-white/10 p-8 bg-black/40">
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">02 · GASTRONOMÍA</span>
              <h3 className="text-xl font-bold text-white uppercase mb-3">El "Tercer Tiempo"</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Bajada directa del cerro a locales gastronómicos y viñedos aliados. Maridajes exclusivos, carnes y cocina de autor para reponer energías con el grupo o tu pareja.
              </p>
            </div>

            <div className="border border-white/10 p-8 bg-black/40">
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">03 · COSTA PACÍFICA</span>
              <h3 className="text-xl font-bold text-white uppercase mb-3">Océano & Escape</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Extensión opcional hacia la costa (Zapallar / Pichilemu): surf, hoteles frente al mar y desconexión total. De la nieve de los Andes a las olas del Pacífico en 2 horas.
              </p>
            </div>

          </div>

          {/* Banner CTA Personalizado */}
          <div className="border border-amber-500/30 bg-amber-500/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
                A Tu Medida
              </span>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                ¿Buscas un paquete privado o corporativo?
              </h3>
              <p className="text-slate-400 text-sm font-light max-w-xl">
                Diseñamos expediciones privadas 1 a 1, aniversarios para parejas o jornadas de team building para empresas con transporte, alojamiento y guianza exclusiva.
              </p>
            </div>
            <a
              href={`https://wa.me/56957958467?text=${encodeURIComponent('Hola Gaz! Me gustaría cotizar un plan privado o paquete a medida con Santiago Hiking.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-arcteryx-primary whitespace-nowrap"
            >
              COTIZAR PAQUETE A MEDIDA
            </a>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIOS (Diseño elevado con verificación de aventurero) */}
      <section className="py-24 relative z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] mb-2 block">
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
      <section id="circulo" className="py-28 bg-[#090b0e] relative z-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="border border-white/10 p-8 md:p-14 text-center mb-16 bg-black/60">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] mb-3 block font-bold">
              Outdoor Club & Red
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
              El Círculo Santiago Hiking
            </h2>
            <p className="text-slate-300 text-sm md:text-base font-light mb-8 max-w-xl mx-auto leading-relaxed">
              La montaña se disfruta en comunidad. Únete al WhatsApp oficial gratuito donde avisamos salidas espontáneas, resolvemos dudas de equipo y compartimos fotos de cada cumbre.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`https://wa.me/56957958467?text=${encodeURIComponent('Hola Gaz! Quiero unirme a la comunidad y salidas grupales de Santiago Hiking.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arcteryx-primary"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> ENTRAR AL WHATSAPP OFICIAL
              </a>
              <a
                href="https://www.instagram.com/santiagohiking"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arcteryx"
              >
                <Camera className="w-4 h-4 mr-2" /> INSTAGRAM @SANTIAGOHIKING
              </a>
            </div>
          </div>

          {/* AGENDA - PRÓXIMAS SALIDAS */}
          <div>
            <div className="mb-8 flex justify-between items-end border-b border-white/10 pb-4">
              <div>
                <span className="text-amber-500 font-mono text-[10px] uppercase tracking-widest block">Calendario</span>
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Fechas Abiertas</h3>
              </div>
            </div>

            {departures.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-white/10">
                <p className="text-slate-500 text-xs font-mono">No hay salidas programadas para los próximos días. Únete al WhatsApp para enterarte de las aperturas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departures.map((dep: any) => {
                  const adv = dep.adventures_catalog;
                  const spots = (adv?.max_pax || 0) - (dep.current_pax || 0);
                  return (
                    <div key={dep.id} className="border border-white/10 p-6 flex items-center gap-5 hover:border-amber-500/50 transition-all bg-black/40 font-mono">
                      <div className="text-center min-w-[56px] border-r border-white/10 pr-4">
                        <p className="text-2xl font-black text-white">{new Date(dep.start_date).toLocaleDateString('es-CL', { timeZone: 'UTC', day: 'numeric' })}</p>
                        <p className="text-[10px] font-bold text-amber-500 uppercase">
                          {new Date(dep.start_date).toLocaleDateString('es-CL', { timeZone: 'UTC', month: 'short' })}
                        </p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-white text-sm uppercase">{adv?.title || 'Expedición'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {spots <= 5 ? (
                            <span className="text-amber-400 font-bold">Últimos {spots} cupos</span>
                          ) : (
                            <span>Cupos disponibles</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white text-sm">${Number(adv?.base_price).toLocaleString('es-CL')}</p>
                        <Link href="/reservar" className="text-[10px] text-amber-400 hover:text-white uppercase tracking-wider block mt-1 font-bold">
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
      <footer className="pt-16 pb-12 bg-[#060709] border-t border-white/10 text-slate-400 font-mono text-xs relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
            
            {/* Columna Marca */}
            <div className="space-y-4">
              <Image 
                src="/santiago-hiking-10.png" 
                alt="Santiago Hiking by Gaz" 
                width={160} 
                height={73} 
                className="h-9 w-auto object-contain opacity-90" 
              />
              <p className="text-slate-400 text-xs font-sans font-light leading-relaxed">
                Club de expediciones andinas, desconexión laboral y estilo de vida outdoor. Guiado por Gaz.
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                LO BARNECHEA · SANTIAGO DE CHILE <br />
                LAT -33.35° S · LON -70.51° W
              </p>
            </div>

            {/* Columna Rutas */}
            <div>
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Expediciones</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#desafios" className="hover:text-amber-400 transition-colors">Desafío 5:00 AM</a></li>
                <li><a href="#desafios" className="hover:text-amber-400 transition-colors">Triple Corona Santiago</a></li>
                <li><a href="#desafios" className="hover:text-amber-400 transition-colors">Sierra de Ramón (3.250m)</a></li>
                <li><a href="#desafios" className="hover:text-amber-400 transition-colors">Desbloqueando Santiago</a></li>
                <li><a href="#rutas" className="hover:text-amber-400 transition-colors">Sunset Manquehuito</a></li>
              </ul>
            </div>

            {/* Columna Alianzas */}
            <div>
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Ecosistema</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#alianzas" className="hover:text-amber-400 transition-colors">Cielo, Mar y Tierra</a></li>
                <li><a href="#alianzas" className="hover:text-amber-400 transition-colors">Hoteles & Refugios Aliados</a></li>
                <li><a href="#alianzas" className="hover:text-amber-400 transition-colors">Gastronomía Lo Barnechea</a></li>
                <li><a href="#alianzas" className="hover:text-amber-400 transition-colors">Expediciones B2B / Empresas</a></li>
                <li><Link href="/faq" className="hover:text-amber-400 transition-colors">Protocolo WFR & Seguridad</Link></li>
              </ul>
            </div>

            {/* Columna Contacto */}
            <div>
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Contacto Directo</p>
              <ul className="space-y-2 text-xs">
                <li>WhatsApp Oficial: <a href="https://wa.me/56957958467" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">+56 9 5795 8467</a></li>
                <li>Instagram: <a href="https://instagram.com/santiagohiking" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">@santiagohiking</a></li>
                <li>Asistente IA: Activo 24/7 en WhatsApp</li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <p>&copy; 2026 GAZ_STYLE · SANTIAGO HIKING. TODOS LOS DERECHOS RESERVADOS.</p>
            <div className="flex gap-6">
              <Link href="/faq" className="hover:text-white transition-colors">FAQ & Montaña</Link>
              <Link href="/reservar" className="hover:text-white transition-colors">Checkout</Link>
              <Link href="/llms.txt" className="hover:text-white transition-colors">LLMs Protocol</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
