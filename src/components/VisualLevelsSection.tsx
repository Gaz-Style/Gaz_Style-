'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mountain, Lightbulb, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import GlobalSearchModal from '@/components/GlobalSearchModal';

interface Props {
  onOpenQuiz?: () => void;
  lang?: string;
}

export default function VisualLevelsSection({ onOpenQuiz, lang = 'es' }: Props) {
  const levels = [
    {
      level: 1,
      name: 'Iniciación Activa',
      subtitle: 'Tu primera cumbre andina',
      bars: '■□□□',
      gain: 'Desnivel < 450m D+',
      duration: '3 a 4 hrs',
      desc: 'Ritmo amable con pausas panorámicas. Ideal para debutar en la cordillera, disfrutar el atardecer dorado y vistas 360° sobre el valle.',
      summits: 'Cerro Carbón · Manquehuito',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    },
    {
      level: 2,
      name: 'Cardio & Ritmo',
      subtitle: 'Sudar la camiseta y desconectar',
      bars: '■■□□',
      gain: 'Desnivel 450 a 800m D+',
      duration: '4 a 5 hrs',
      desc: 'Ritmo deportivo sostenido para botar la semana. Exige calzado con buen agarre, respiración constante y energía activa.',
      summits: 'Cerro Pochoco · Desafío 5:00 AM',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    },
    {
      level: 3,
      name: 'Desafío Andino',
      subtitle: 'Pendientes y filos rocosos',
      bars: '■■■□',
      gain: 'Desnivel 800 a 1.400m D+',
      duration: '6 a 8 hrs',
      desc: 'Pendientes pronunciadas, acarreos andinos y exposición a la altura de la precordillera. Exige determinación mental y buena hidratación.',
      summits: 'Cerro Manquehue · Cerro Provincia',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
    },
    {
      level: 4,
      name: 'Gran Altitud',
      subtitle: 'Resistencia sobre los 4.000m',
      bars: '■■■■',
      gain: 'Desnivel > 1.500m D+',
      duration: 'Jornadas completas o pernocte',
      desc: 'Expediciones técnicas de altura por aristas expuestas en los Andes centrales. Requiere preparación física y aclimatación guiada.',
      summits: 'Cerro Pintor (4.180m) · El Plomo (5.424m)',
      image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section id="niveles" className="py-20 sm:py-28 relative z-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Cabecera Técnica de Niveles (Estándar MBA: Different levels, all epic adventures) */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.28em] font-semibold block mb-2">
            Graduación Técnica · Cuenca de Santiago
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            Distintos Niveles, Todas Cumbres Épicas
          </h2>
          <p className="text-white/60 text-sm sm:text-base font-light mt-3 leading-relaxed">
            Nadie se queda atrás. Elige la exigencia física exacta para disfrutar cada paso en la montaña:
          </p>
        </div>

        {/* ── 4 TARJETAS VISUALES CON BARRA SEGMENTADA (MBA STYLE) ── */}
        <div className="relative -mr-4 sm:mr-0">
          <div 
            id="levels-scroll-track"
            className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory lg:snap-none gap-4 sm:gap-6 pb-4 scroll-smooth pl-0.5 pr-4 sm:pr-0"
          >
            {levels.map((lvl) => (
              <div
                key={lvl.level}
                className="group relative rounded-3xl overflow-hidden min-h-[440px] w-[78vw] max-w-[320px] lg:w-full lg:max-w-none shrink-0 snap-start flex flex-col justify-between border border-white/10 hover:border-amber-400/50 transition-all duration-500 shadow-xl hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)]"
              >
                {/* Foto inmersiva de fondo */}
                <Image
                  src={lvl.image}
                  alt={lvl.name}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                {/* Gradiente oscuro profundo para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-black/95 pointer-events-none" />

                {/* Parte superior de la tarjeta: Nivel + Barra de Progreso */}
                <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-white/90">
                    NIVEL 0{lvl.level}
                  </span>

                  <span className="font-mono text-sm tracking-widest font-black text-amber-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none">
                    {lvl.bars}
                  </span>
                </div>

                {/* Parte inferior de la tarjeta: Título, Métricas y Descripción */}
                <div className="relative z-10 p-5 sm:p-6 space-y-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-amber-300 transition-colors">
                      {lvl.name}
                    </h3>
                    <span className="text-[11px] font-mono text-amber-300/80 block mt-0.5">
                      {lvl.subtitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-white/70 py-1 border-y border-white/10">
                    <span>{lvl.duration}</span>
                    <span>•</span>
                    <span>{lvl.gain}</span>
                  </div>

                  <p className="text-xs text-white/75 font-light leading-relaxed">
                    {lvl.desc}
                  </p>

                  <div className="pt-2 text-[11px] font-mono text-amber-400 font-semibold">
                    <span>Ejemplos: {lvl.summits}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Flecha circular flotante idéntica a MBA en móvil */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('levels-scroll-track');
              if (el) el.scrollBy({ left: 280, behavior: 'smooth' });
            }}
            className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-white/20 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95"
            aria-label="Siguiente nivel"
          >
            <span className="text-base font-bold leading-none">›</span>
          </button>
        </div>

        {/* ── BANNER RESOLUTOR DE DUDAS: INTEGRACIÓN DEL QUIZ "¿CUÁL ES MI CUMBRE?" ── */}
        <div 
          className="mt-12 sm:mt-16 p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-[0_20px_50px_rgba(245,158,11,0.12)] flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 15, 15, 0.90) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-1">
              DIAGNÓSTICO EN 30 SEGUNDOS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              ¿Dudas sobre cuál es la ruta adecuada para ti?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl">
              Responde 2 preguntas rápidas sobre tu experiencia previa y te diremos exactamente cuál debería ser tu próxima cumbre en Santiago.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenQuiz) onOpenQuiz();
              else if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-hiking-quiz'));
              }
            }}
            className="btn-arcteryx-primary !py-4 !px-8 text-xs font-mono font-bold tracking-widest uppercase shrink-0 shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center gap-2 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-black" />
            <span>¿CUÁL ES MI CUMBRE?</span>
          </button>
        </div>

      </div>
    </section>
  );
}
