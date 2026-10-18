'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ArrowRight, Mountain, Compass, Shield, Zap } from 'lucide-react';
import { challengesData } from '@/app/desafios/data';

interface Props {
  lang?: string;
}

export default function DesafiosSection({ lang = 'es' }: Props) {
  const challenges = Object.values(challengesData);

  return (
    <section id="desafios" className="py-20 sm:py-28 relative z-20 scroll-mt-20 overflow-hidden">
      {/* Luz ambiental sutil de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-rose-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
        
        {/* Encabezado Épico de la Sección */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-mono font-bold uppercase tracking-widest mb-4">
            <span className="text-sm">💀</span>
            <span>ALTO RENDIMIENTO & SUPERACIÓN</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            DESAFÍOS CORDILLERA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500">SANTIAGO</span>
          </h2>

          <p className="text-white/70 text-sm sm:text-base font-light font-mono mt-3 max-w-2xl mx-auto leading-relaxed">
            Formatos diseñados para quienes buscan más que un paseo tradicional. Cumbres nocturnas al alba, retos multicumbre y travesías de resistencia con liderazgo técnico de cordada.
          </p>
        </div>

        {/* Grid de Desafíos 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {challenges.map((c) => (
            <Link
              key={c.slug}
              href={`/desafios/${c.slug}`}
              className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/60 transition-all duration-500 flex flex-col justify-between min-h-[360px] sm:min-h-[400px] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              style={{
                backgroundColor: 'rgba(12, 14, 18, 0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Imagen de Fondo Cinematográfica */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={c.coverImage}
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
          ))}
        </div>

        {/* Botón inferior para ver todos los Desafíos */}
        <div className="mt-12 text-center">
          <Link
            href="/desafios"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-stone-900/90 hover:bg-stone-800 text-white border border-white/20 hover:border-amber-400/80 font-mono font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-xl hover:scale-105"
          >
            <span className="text-base">💀</span>
            <span>Explorar Todos los Desafíos</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

      </div>
    </section>
  );
}
