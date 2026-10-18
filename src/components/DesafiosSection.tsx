'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ArrowRight, Mountain, Compass, Shield, Zap } from 'lucide-react';
import { challengesData } from '@/app/desafios/data';

interface Props {
  lang?: string;
  routes?: any[];
}

export default function DesafiosSection({ lang = 'es', routes = [] }: Props) {
  const challenges = Object.values(challengesData);

  return (
    <section id="desafios" className="pt-4 pb-16 sm:pt-12 sm:pb-24 relative z-20 scroll-mt-[150px] sm:scroll-mt-[170px] overflow-hidden">
      {/* Luz ambiental sutil de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
        
        {/* Encabezado Épico de la Sección */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.28em] font-bold block mb-2">
            ENTRENAMIENTO & RESISTENCIA
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            DESAFÍA TU MENTALIDAD
          </h2>

          <p className="text-white/70 text-sm sm:text-base font-light font-mono mt-3 max-w-2xl mx-auto leading-relaxed">
            Formatos de exigencia real para forjar carácter, resistencia física y templanza en la montaña. Cumbres al alba con frontales, circuitos multicumbre y travesías de alta intensidad.
          </p>
        </div>

        {/* Contenedor Carrusel Horizontal en Móvil / Grid 2x2 en Desktop */}
        <div className="relative -mr-5 sm:mr-0">
          <div 
            id="desafios-scroll-track"
            className="flex md:grid md:grid-cols-2 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory md:snap-none gap-5 sm:gap-8 pb-4 scroll-smooth pr-5 sm:pr-0 pl-0.5"
          >
            {challenges.map((c) => {
              // Sincronizar imagen editada desde el panel admin en Supabase
              const matchedRoute = routes.find((r) => {
                const t = (r.title || '').toLowerCase();
                if (c.slug === 'desafio-5am') return t.includes('5:00 am') || t.includes('5am') || t.includes('5:00');
                if (c.slug === 'triple-corona') return t.includes('triple corona');
                if (c.slug === 'sierra-de-ramon') return t.includes('sierra de ramón') || t.includes('sierra de ramon');
                if (c.slug === 'desbloqueando-santiago') return t.includes('desbloqueando');
                return false;
              });

              const currentCoverImage = matchedRoute?.image_url || c.coverImage;

              return (
                <Link
                  key={c.slug}
                  href={`/desafios/${c.slug}`}
                  className="w-[84vw] max-w-[380px] md:w-auto shrink-0 snap-start group relative rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/60 transition-all duration-500 flex flex-col justify-between min-h-[380px] sm:min-h-[400px] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                  style={{
                    backgroundColor: 'rgba(12, 14, 18, 0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                {/* Imagen de Fondo Cinematográfica */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={currentCoverImage}
                    alt={c.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.70] group-hover:brightness-[0.85]"
                  />
                {/* Gradiente oscuro profundo para legibilidad total */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-black/40" />
              </div>

              {/* Header de la Tarjeta: Badge Superior & Número */}
              <div className="relative z-10 p-6 flex items-start justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono font-bold text-amber-400 uppercase tracking-wider shadow-md">
                  {c.badge}
                </span>
                <span className="text-white/40 font-mono font-black text-xs sm:text-sm tracking-widest">
                  #{c.number}
                </span>
              </div>

              {/* Contenido Inferior: Título, Tagline, Métricas y Botón */}
              <div className="relative z-10 p-6 sm:p-7 space-y-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight group-hover:text-amber-300 transition-colors drop-shadow-md">
                    {c.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-mono font-medium mt-1 line-clamp-2">
                    {c.subtitle}
                  </p>
                </div>

                {/* Métricas Técnicas Clave */}
                <div 
                  className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl font-mono text-center"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.55)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                  }}
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/50 block">Altitud</span>
                    <span className="text-xs sm:text-sm font-bold text-white">{c.metrics.altitud.split(' ')[0]}</span>
                  </div>
                  <div className="border-x border-white/10">
                    <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">Desnivel</span>
                    <span className="text-xs sm:text-sm font-black text-amber-300">{c.metrics.desnivel}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/50 block">Tiempo</span>
                    <span className="text-xs sm:text-sm font-bold text-white">{c.metrics.tiempo.split(' ')[0]} hrs</span>
                  </div>
                </div>

                {/* Footer de la Tarjeta con CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-white/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Cupo boutique: {c.metrics.cupoMax.split(' ')[0]} pax</span>
                  </div>

                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs uppercase tracking-wider group-hover:border-amber-400 transition-all">
                    <span>Ver Ficha</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
        </div>

          {/* Flecha circular flotante idéntica a la sección de niveles en móvil */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('desafios-scroll-track');
              if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
            }}
            className="md:hidden absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/20 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95"
            aria-label="Siguiente desafío"
          >
            <span className="text-base font-bold leading-none">›</span>
          </button>
        </div>

        {/* Botón inferior para ver todos los Desafíos */}
        <div className="mt-12 text-center">
          <Link
            href="/desafios"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-stone-900/90 hover:bg-stone-800 text-white border border-white/20 hover:border-amber-400/80 font-mono font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-xl hover:scale-105"
          >
            <span>Explorar Desafíos Extremos</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

      </div>
    </section>
  );
}
