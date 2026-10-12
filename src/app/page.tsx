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
    <div className="topographic-pattern topographic-contours min-h-screen text-stone-900 font-sans selection:bg-amber-500/30">
      
      {/* MENÚ SUPERIOR FLOTANTE GLASSMORPHISM TIPO BOTÓN (Inspirado en Arc'teryx) */}
      <FloatingNavbar currentLang={lang} />

      {/* PESTAÑA LATERAL VIDRIO AHUMADO: CANAL DE RADIO GUÍA / SOS */}
      <GuideRadioWidget />

      {/* 1. HERO SECTION CINEMATOGRÁFICO (Inspirado en Arc'teryx) */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 px-6 overflow-hidden">
        <HeroCarousel />

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-12">
          {/* Badge de Coordenadas Geográficas */}
          <div className="inline-flex items-center gap-2 border border-white/30 bg-black/50 backdrop-blur-md px-4 py-1.5 mb-8 text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-white shadow-lg rounded-full">
            <span>33°21'S 70°38'W</span>
            <span className="text-amber-400">·</span>
            <span>ANDES EXPEDITIONS</span>
            <span className="text-amber-400">·</span>
            <span className="text-amber-300 font-bold">SANTIAGO DE CHILE</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6 drop-shadow-md">
            ENCUENTRA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">
              TU CUMBRE.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-100 max-w-2xl mx-auto font-light leading-relaxed mb-10 drop-shadow">
            {lang === 'en'
              ? 'Conquer the Chilean Andes. Boutique day-hikes, backcountry safety, and unmatched views above Santiago.'
              : 'Conquista los Andes chilenos. Salidas boutique de un día, seguridad en montaña y las mejores cumbres sobre el valle de Santiago.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#rutas" className="btn-arcteryx-primary w-full sm:w-auto shadow-md">
              EXPLORAR SALIDAS ACTIVAS
            </a>
            <a href="#desafios" className="btn-arcteryx-hero w-full sm:w-auto">
              LOS GRANDES DESAFÍOS
            </a>
          </div>
        </div>
      </section>

      {/* LEAD MAGNET / DESCARGA GUÍA (Lienzo Nieve / Limpio) */}
      <section className="py-14 bg-stone-100/70 border-y border-stone-200 relative z-20">
        <div className="max-w-5xl mx-auto px-6">
          <LeadMagnetForm
            title="Guía Técnica de Rutas de Santiago."
            subtitle="Recibe gratis en tu correo el mapa de desniveles, equipamiento WFR y cerros imperdibles."
            buttonText="Descargar Guía"
            lang={lang}
          />
        </div>
      </section>

      {/* 2. LOS GRANDES DESAFÍOS ANDINOS (Lienzo Blanco Editorial: Fotografías como Galería) */}
      <section id="desafios" className="py-24 bg-white relative z-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-14 border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-stone-500 font-mono text-[10px] tracking-[0.3em] uppercase block mb-1">
                The Andes Challenges · Serie 2026
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-stone-900 uppercase tracking-tight">
                Los Grandes Desafíos
              </h2>
            </div>
            <p className="text-stone-600 text-xs md:text-sm max-w-md font-light leading-relaxed">
              Cuatro expediciones icónicas para llevar tu resistencia física y mental al siguiente nivel en la Cordillera de los Andes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Desafío 1: 5:00 AM Sunrise */}
            <div className="relative min-h-[480px] md:min-h-[540px] overflow-hidden flex flex-col justify-end p-8 md:p-10 group border border-stone-200 hover:border-stone-400 transition-all duration-500 bg-stone-900 rounded-xl shadow-sm hover:shadow-lg">
              <Image 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85" 
                alt="Desafío 5:00 AM" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/80 block">
                  01 · COTA 1.638M · MANQUEHUITO
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                  Desafío 5:00 AM
                </h3>
                <p className="text-slate-200 text-xs md:text-sm font-light leading-relaxed max-w-lg">
                  Ascenso nocturno con linternas frontales. Conquista la cumbre al romper el alba con café caliente de especialidad sobre el mar de nubes de Santiago. Bajas antes de que despierte la ciudad.
                </p>
                <div className="pt-2">
                  <Link 
                    href="/desafios/desafio-5am"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-white border-b border-white/60 pb-1 hover:border-white transition-all hover:text-amber-300"
                  >
                    Ver Detalles y Ficha Técnica &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Desafío 2: Triple Corona */}
            <div className="relative min-h-[480px] md:min-h-[540px] overflow-hidden flex flex-col justify-end p-8 md:p-10 group border border-stone-200 hover:border-stone-400 transition-all duration-500 bg-stone-900 rounded-xl shadow-sm hover:shadow-lg">
              <Image 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85" 
                alt="La Triple Corona de Santiago" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/80 block">
                  02 · 3 CUMBRES · +2.100M D+
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                  La Triple Corona
                </h3>
                <p className="text-slate-200 text-xs md:text-sm font-light leading-relaxed max-w-lg">
                  El reto andino definitivo: Manquehuito, Cerro Manquehue y Cerro Pochoco. Un programa progresivo para conquistar las tres cumbres clásicas de la cuenca y forjar resistencia real.
                </p>
                <div className="pt-2">
                  <Link 
                    href="/desafios/triple-corona"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-white border-b border-white/60 pb-1 hover:border-white transition-all hover:text-amber-300"
                  >
                    Ver Detalles y Ficha Técnica &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Desafío 3: Sierra de Ramón */}
            <div className="relative min-h-[480px] md:min-h-[540px] overflow-hidden flex flex-col justify-end p-8 md:p-10 group border border-stone-200 hover:border-stone-400 transition-all duration-500 bg-stone-900 rounded-xl shadow-sm hover:shadow-lg">
              <Image 
                src="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85" 
                alt="Travesía Sierra de Ramón" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/80 block">
                  03 · COTA 3.250M · ALTA EXIGENCIA
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                  Sierra de Ramón
                </h3>
                <p className="text-slate-200 text-xs md:text-sm font-light leading-relaxed max-w-lg">
                  La travesía técnica reina de Santiago. Aristas de roca, vistas panorámicas de 360° hacia los valles centrales y protocolo de autosuficiencia y seguridad con guías certificados WFR.
                </p>
                <div className="pt-2">
                  <Link 
                    href="/desafios/sierra-de-ramon"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-white border-b border-white/60 pb-1 hover:border-white transition-all hover:text-amber-300"
                  >
                    Ver Detalles y Ficha Técnica &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Desafío 4: Desbloqueando Santiago */}
            <div className="relative min-h-[480px] md:min-h-[540px] overflow-hidden flex flex-col justify-end p-8 md:p-10 group border border-stone-200 hover:border-stone-400 transition-all duration-500 bg-stone-900 rounded-xl shadow-sm hover:shadow-lg">
              <Image 
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85" 
                alt="Desbloqueando Santiago" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/80 block">
                  04 · PLAN 6 SEMANAS · 1 CERRO/SEM
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                  Desbloqueando Santiago
                </h3>
                <p className="text-slate-200 text-xs md:text-sm font-light leading-relaxed max-w-lg">
                  El pasaporte de montaña para principiantes activos. Una ruta semanal con dificultad creciente para ponerte en forma, aprender orientación en subida y conquistar la capital cima por cima.
                </p>
                <div className="pt-2">
                  <Link 
                    href="/desafios/desbloqueando-santiago"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-white border-b border-white/60 pb-1 hover:border-white transition-all hover:text-amber-300"
                  >
                    Ver Detalles y Ficha Técnica &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SISTEMA DE NIVELES FUNCIONAL (Limpio, Técnico & Sereno) */}
      <section id="niveles" className="py-24 bg-stone-50/60 relative z-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-stone-500 font-mono text-[10px] tracking-[0.3em] uppercase block mb-1">
              Graduación Técnica · Cuenca Central
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight">
              Sistema de Niveles de Montaña
            </h2>
          </div>

          <div className="border-y border-stone-200 divide-y divide-stone-200 bg-white rounded-xl shadow-xs px-6 md:px-10">
            
            {/* Nivel 1 */}
            <div className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-stone-50/80 transition-colors">
              <div className="flex items-baseline gap-4 md:w-1/3">
                <span className="text-stone-400 font-mono text-xs font-bold">01</span>
                <div>
                  <h4 className="text-stone-900 font-bold text-lg uppercase tracking-tight">Iniciación Activa</h4>
                  <span className="text-[11px] font-mono text-stone-500 block">Desnivel &lt;400m+ · 3.5 hrs</span>
                </div>
              </div>
              <p className="text-stone-600 text-xs md:text-sm font-light md:w-1/2 leading-relaxed">
                Ritmo amable y pausas panorámicas. Ideal para tu primera cumbre, fotografía profesional y café al atardecer sobre la cuenca.
              </p>
              <div className="md:w-1/6 md:text-right">
                <span className="text-[11px] font-mono text-stone-800 font-semibold uppercase tracking-wider">Sunset Manquehuito</span>
              </div>
            </div>

            {/* Nivel 2 */}
            <div className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-stone-50/80 transition-colors">
              <div className="flex items-baseline gap-4 md:w-1/3">
                <span className="text-stone-400 font-mono text-xs font-bold">02</span>
                <div>
                  <h4 className="text-stone-900 font-bold text-lg uppercase tracking-tight">Cardio & Desconexión</h4>
                  <span className="text-[11px] font-mono text-stone-500 block">Desnivel 400 a 800m+ · 4-5 hrs</span>
                </div>
              </div>
              <p className="text-stone-600 text-xs md:text-sm font-light md:w-1/2 leading-relaxed">
                Ritmo deportivo sostenido para botar el estrés de la oficina. Exige calzado con buen agarre, respiración constante y energía activa.
              </p>
              <div className="md:w-1/6 md:text-right">
                <span className="text-[11px] font-mono text-stone-800 font-semibold uppercase tracking-wider">WildTrek / Pochoco</span>
              </div>
            </div>

            {/* Nivel 3 */}
            <div className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-stone-50/80 transition-colors">
              <div className="flex items-baseline gap-4 md:w-1/3">
                <span className="text-stone-400 font-mono text-xs font-bold">03</span>
                <div>
                  <h4 className="text-stone-900 font-bold text-lg uppercase tracking-tight">Desafío Andino</h4>
                  <span className="text-[11px] font-mono text-stone-500 block">Desnivel 800 a 1.400m+ · 6-8 hrs</span>
                </div>
              </div>
              <p className="text-stone-600 text-xs md:text-sm font-light md:w-1/2 leading-relaxed">
                Terreno técnico, piedras sueltas y exigencia física real. Requiere preparación previa, bastones de trekking y chequeo médico.
              </p>
              <div className="md:w-1/6 md:text-right">
                <span className="text-[11px] font-mono text-stone-800 font-semibold uppercase tracking-wider">Manquehue / Provincia</span>
              </div>
            </div>

            {/* Nivel 4 */}
            <div className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-stone-50/80 transition-colors">
              <div className="flex items-baseline gap-4 md:w-1/3">
                <span className="text-stone-400 font-mono text-xs font-bold">04</span>
                <div>
                  <h4 className="text-stone-900 font-bold text-lg uppercase tracking-tight">Alta Montaña</h4>
                  <span className="text-[11px] font-mono text-stone-500 block">Altitud &gt;3.800m · Full Day / Campamento</span>
                </div>
              </div>
              <p className="text-stone-600 text-xs md:text-sm font-light md:w-1/2 leading-relaxed">
                Cumbres mayores sobre los 4.000m. Exposición a altitud, viento y posible campamento base. Guiado estricto con botiquín WFR y satélite.
              </p>
              <div className="md:w-1/6 md:text-right">
                <span className="text-[11px] font-mono text-stone-800 font-semibold uppercase tracking-wider">Pintor / El Plomo</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CATÁLOGO DE SALIDAS ACTIVAS DE TEMPORADA */}
      <section id="rutas" className="py-28 bg-white relative z-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:flex justify-between items-end border-b border-stone-200 pb-8">
            <div>
              <span className="text-amber-600 font-mono text-xs uppercase tracking-[0.25em] mb-2 block font-semibold">
                Temporada 2026
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 uppercase tracking-tight">
                Salidas Grupales Activas
              </h2>
            </div>
            <p className="text-stone-600 text-sm max-w-sm mt-4 md:mt-0 font-light">
              Grupos reducidos guiados por Gaz. Equipamiento de seguridad, primeros auxilios WFR y fotografía profesional de cumbre incluidos.
            </p>
          </div>

          {routes.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-stone-300 rounded-2xl bg-stone-50">
              <Tent className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 text-sm">Próximamente publicaremos el nuevo calendario de salidas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {routes.map((route: any) => (
                <div key={route.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group">
                  
                  {/* Foto de Portada de la Ruta */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-stone-100">
                    {route.image_url ? (
                      <Image
                        src={route.image_url}
                        alt={route.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <Mountain className="w-16 h-16 text-stone-300 m-auto" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
                    <span className="absolute top-4 right-4 bg-stone-900/80 backdrop-blur px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded shadow-sm">
                      {route.category}
                    </span>
                  </div>

                  {/* Ficha Técnica */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-stone-900 uppercase tracking-tight mb-2">
                        {route.title}
                      </h3>
                      <p className="text-sm text-stone-600 mb-6 font-light line-clamp-2">
                        {route.description || 'Guiado premium paso a paso en la cordillera.'}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 border-y border-stone-100 bg-stone-50/80 py-4 mb-6 text-center font-mono rounded-lg">
                        <div>
                          <p className="text-[10px] text-stone-500 uppercase font-medium">Duración</p>
                          <p className="text-xs font-bold text-stone-900">{route.duration_text || `${route.duration_days}d`}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-500 uppercase font-medium">Dificultad</p>
                          <p className="text-xs font-bold text-amber-600">{route.difficulty_level}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-500 uppercase font-medium">Cupo Máx</p>
                          <p className="text-xs font-bold text-stone-900">{route.max_pax} pax</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-mono">Desde</span>
                        <span className="text-2xl font-black text-stone-900 font-mono">${Number(route.base_price).toLocaleString('es-CL')}</span>
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

      {/* 5. PLANES "CIELO, MAR Y TIERRA" (Ecosistema All-Inclusive) */}
      <section id="alianzas" className="py-28 bg-stone-50/60 relative z-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:flex justify-between items-end border-b border-stone-200 pb-8">
            <div>
              <span className="text-amber-600 font-mono text-xs uppercase tracking-[0.25em] mb-2 block font-semibold">
                Ecosistema All-Inclusive
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 uppercase tracking-tight">
                Cielo, Mar & Tierra
              </h2>
            </div>
            <p className="text-stone-600 text-sm max-w-md mt-4 md:mt-0 font-light">
              La experiencia integral de Chile central: unimos las cumbres de los Andes, la costa pacífica y la gastronomía de autor a través de alianzas estratégicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            <div className="border border-stone-200 p-8 bg-white rounded-2xl shadow-xs">
              <span className="text-amber-600 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">01 · CORDILLERA</span>
              <h3 className="text-xl font-bold text-stone-900 uppercase mb-3">Refugios & Ascensos</h3>
              <p className="text-stone-600 text-sm font-light leading-relaxed">
                Alojamiento en refugios de montaña y glampings boutique en Farellones y Cajón del Maipo. Salidas al atardecer, avistamiento astronómico y seguridad certificada WFR.
              </p>
            </div>

            <div className="border border-stone-200 p-8 bg-white rounded-2xl shadow-xs">
              <span className="text-amber-600 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">02 · GASTRONOMÍA</span>
              <h3 className="text-xl font-bold text-stone-900 uppercase mb-3">El "Tercer Tiempo"</h3>
              <p className="text-stone-600 text-sm font-light leading-relaxed">
                Bajada directa del cerro a locales gastronómicos y viñedos aliados. Maridajes exclusivos, carnes y cocina de autor para reponer energías con el grupo o tu pareja.
              </p>
            </div>

            <div className="border border-stone-200 p-8 bg-white rounded-2xl shadow-xs">
              <span className="text-amber-600 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">03 · COSTA PACÍFICA</span>
              <h3 className="text-xl font-bold text-stone-900 uppercase mb-3">Océano & Escape</h3>
              <p className="text-stone-600 text-sm font-light leading-relaxed">
                Extensión opcional hacia la costa (Zapallar / Pichilemu): surf, hoteles frente al mar y desconexión total. De la nieve de los Andes a las olas del Pacífico en 2 horas.
              </p>
            </div>

          </div>

          {/* Banner CTA Personalizado */}
          <div className="border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl shadow-sm">
            <div>
              <span className="text-amber-700 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
                A Tu Medida
              </span>
              <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tight mb-2">
                ¿Buscas un paquete privado o corporativo?
              </h3>
              <p className="text-stone-700 text-sm font-light max-w-xl">
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
      <section className="py-24 bg-white relative z-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-amber-600 font-mono text-xs uppercase tracking-[0.25em] mb-2 block font-semibold">
              Comunidad en Terreno
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight">
              Voces de la Cumbre
            </h2>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* 7. EL CÍRCULO & PRÓXIMAS SALIDAS */}
      <section id="circulo" className="py-28 bg-stone-50/60 relative z-20 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="border border-stone-200 p-8 md:p-14 text-center mb-16 bg-white rounded-2xl shadow-xs">
            <span className="text-amber-600 font-mono text-xs uppercase tracking-[0.25em] mb-3 block font-bold">
              Outdoor Club & Red
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-stone-900 uppercase tracking-tight mb-4">
              El Círculo Santiago Hiking
            </h2>
            <p className="text-stone-600 text-sm md:text-base font-light mb-8 max-w-xl mx-auto leading-relaxed">
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
            <div className="mb-8 flex justify-between items-end border-b border-stone-200 pb-4">
              <div>
                <span className="text-amber-600 font-mono text-[10px] uppercase tracking-widest block font-semibold">Calendario</span>
                <h3 className="text-2xl font-bold text-stone-900 uppercase tracking-tight">Fechas Abiertas</h3>
              </div>
            </div>

            {departures.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-stone-300 bg-white rounded-2xl">
                <p className="text-stone-500 text-xs font-mono">No hay salidas programadas para los próximos días. Únete al WhatsApp para enterarte de las aperturas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departures.map((dep: any) => {
                  const adv = dep.adventures_catalog;
                  const spots = (adv?.max_pax || 0) - (dep.current_pax || 0);
                  return (
                    <div key={dep.id} className="border border-stone-200 p-6 flex items-center gap-5 hover:border-amber-500/50 transition-all bg-white rounded-2xl shadow-xs font-mono">
                      <div className="text-center min-w-[56px] border-r border-stone-200 pr-4">
                        <p className="text-2xl font-black text-stone-900">{new Date(dep.start_date).toLocaleDateString('es-CL', { timeZone: 'UTC', day: 'numeric' })}</p>
                        <p className="text-[10px] font-bold text-amber-600 uppercase">
                          {new Date(dep.start_date).toLocaleDateString('es-CL', { timeZone: 'UTC', month: 'short' })}
                        </p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-stone-900 text-sm uppercase">{adv?.title || 'Expedición'}</p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {spots <= 5 ? (
                            <span className="text-amber-600 font-bold">Últimos {spots} cupos</span>
                          ) : (
                            <span>Cupos disponibles</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-stone-900 text-sm">${Number(adv?.base_price).toLocaleString('es-CL')}</p>
                        <Link href="/reservar" className="text-[10px] text-amber-600 hover:text-stone-900 hover:underline uppercase tracking-wider block mt-1 font-bold">
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
      <footer className="pt-16 pb-12 bg-stone-100 border-t border-stone-200 text-stone-600 font-mono text-xs relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-stone-200">
            
            {/* Columna Marca */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/logo sh.png"
                  alt="Santiago Hiking"
                  width={40}
                  height={40}
                  className="w-8 h-8 object-contain shrink-0"
                />
                {/* Logotipo Oficial 20 (SANTIAGO en negro + HIKING en ámbar) */}
                <Image
                  src="/logo-text-black.png"
                  alt="Santiago Hiking"
                  width={200}
                  height={28}
                  className="h-5 sm:h-6 w-auto object-contain"
                />
              </div>
              <p className="text-stone-600 text-xs font-sans font-light leading-relaxed">
                {lang === 'en'
                  ? 'Expeditions in the Chilean Andes, backcountry safety, and summits above Santiago. Guided by Gaz.'
                  : 'Expediciones en los Andes chilenos, seguridad en montaña y cumbres sobre el valle de Santiago. Guiado por Gaz.'}
              </p>
              <p className="text-[11px] text-stone-500 font-mono">
                CORDILLERA DE LOS ANDES · SANTIAGO DE CHILE <br />
                LAT -33.35° S · LON -70.51° W
              </p>
            </div>

            {/* Columna Rutas */}
            <div>
              <p className="text-stone-900 text-xs font-bold uppercase tracking-widest mb-4">Expediciones</p>
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
              <p className="text-stone-900 text-xs font-bold uppercase tracking-widest mb-4">Ecosistema</p>
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
              <p className="text-stone-900 text-xs font-bold uppercase tracking-widest mb-4">Contacto Directo</p>
              <ul className="space-y-2 text-xs">
                <li>WhatsApp Oficial: <a href="https://wa.me/56957958467" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">+56 9 5795 8467</a></li>
                <li>Instagram: <a href="https://instagram.com/santiagohiking" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">@santiagohiking</a></li>
                <li>Asistente IA: Activo 24/7 en WhatsApp</li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-stone-500">
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
