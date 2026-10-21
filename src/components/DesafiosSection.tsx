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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Encabezado Épico de la Sección */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.28em] font-bold block mb-2">
            ENTRENAMIENTO & RESISTENCIA
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            DESAFÍO EXTREMO
          </h2>

          <p className="text-white/70 text-sm sm:text-base font-light font-mono mt-3 max-w-2xl mx-auto leading-relaxed">
            Formatos de exigencia real para forjar carácter, resistencia física y templanza en la montaña. Cumbres al alba con frontales, circuitos multicumbre y travesías de alta intensidad.
          </p>
        </div>

        {/* Contenedor Carrusel Horizontal en Móvil / 4 en Línea en Desktop (lg:grid-cols-4) */}
        <div className="relative -mr-4 sm:mr-0">
          <div 
            id="desafios-scroll-track"
            className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory lg:snap-none gap-4 sm:gap-6 pb-4 scroll-smooth pr-4 sm:pr-0 pl-0.5"
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

              // Metadatos adaptados al diseño exacto de tarjetas de Niveles
              const metaMap: Record<string, { bars: string; duration: string; gain: string; summits: string; subtitle: string; desc: string }> = {
                'desafio-5am': {
                  bars: '■■□□',
                  duration: '3.5 a 4 hrs',
                  gain: 'Desnivel +420m D+',
                  summits: 'Cerro Manquehuito',
                  subtitle: 'Ascenso nocturno al amanecer',
                  desc: 'Ascenso nocturno con frontales al Manquehuito para conquistar la cumbre al romper el alba sobre el mar de nubes.',
                },
                'triple-corona': {
                  bars: '■■■■',
                  duration: '10 a 12 hrs',
                  gain: 'Desnivel +2.100m D+',
                  summits: 'Manquehuito · Manquehue · Carbón',
                  subtitle: 'El reto andino · 3 cumbres',
                  desc: 'El circuito andino supremo: Manquehuito, Cerro Manquehue y Carbón en una sola jornada de resistencia continua.',
                },
                'sierra-de-ramon': {
                  bars: '■■■■',
                  duration: '12 hrs totales',
                  gain: 'Desnivel +2.400m D+',
                  summits: 'Punta de Damas · Cerro Ramón',
                  subtitle: 'Alta exigencia · Cota 3.250m',
                  desc: 'La travesía alpina reina de la cuenca central. Aristas de roca pura sobre los 3.200m con vista panorámica infinita.',
                },
                'desbloqueando-santiago': {
                  bars: '■■■□',
                  duration: '6 semanas',
                  gain: '+350m a +1.800m D+',
                  summits: 'Circuito 6 cumbres',
                  subtitle: 'Pasaporte formativo outdoor',
                  desc: 'Programa progresivo de montaña: 1 cerro por semana, desde tu primera cumbre hasta aristas de alta exigencia.',
                },
              };

              const meta = metaMap[c.slug] || {
                bars: '■■■□',
                duration: c.metrics.tiempo,
                gain: c.metrics.desnivel,
                summits: c.metrics.ubicacion.split(',')[0],
                subtitle: c.tagline,
                desc: c.subtitle,
              };

              const num = parseInt(c.number || '1', 10);
              const numPadded = num < 10 ? `0${num}` : `${num}`;

              return (
                <Link
                  key={c.slug}
                  href={`/desafios/${c.slug}`}
                  className="group relative rounded-3xl overflow-hidden min-h-[440px] sm:min-h-[460px] w-[78vw] max-w-[320px] lg:w-full lg:max-w-none shrink-0 snap-start flex flex-col justify-between border border-white/10 hover:border-amber-400/50 transition-all duration-500 shadow-xl hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)]"
                >
                  {/* Foto inmersiva de fondo */}
                  <Image
                    src={currentCoverImage}
                    alt={c.title}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />
                  {/* Gradiente oscuro profundo para legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-black/95 pointer-events-none" />

                  {/* Parte superior de la tarjeta: Desafío + Barra de Progreso */}
                  <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-white/90">
                      DESAFÍO {numPadded}
                    </span>

                    <span className="font-mono text-sm tracking-widest font-black text-amber-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none">
                      {meta.bars}
                    </span>
                  </div>

                  {/* Parte inferior de la tarjeta: Título, Métricas y Descripción */}
                  <div className="relative z-10 p-5 sm:p-6 space-y-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-amber-300 transition-colors leading-tight">
                        {c.title}
                      </h3>
                      <span className="text-[11px] font-mono text-amber-300/80 block mt-0.5">
                        {meta.subtitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-white/70 py-1 border-y border-white/10">
                      <span>{meta.duration}</span>
                      <span>•</span>
                      <span>{meta.gain}</span>
                    </div>

                    <p className="text-xs text-white/75 font-light leading-relaxed line-clamp-3">
                      {meta.desc}
                    </p>

                    <div className="pt-2 border-t border-white/10">
                      <span className="w-full py-2.5 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-stone-950 font-mono text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-amber-500/20">
                        <span>Go!</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Flecha circular flotante en móvil */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('desafios-scroll-track');
              if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
            }}
            className="lg:hidden absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/20 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95"
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
