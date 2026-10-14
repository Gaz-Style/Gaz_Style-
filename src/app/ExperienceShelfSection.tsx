'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mountain } from 'lucide-react';
import SwipeCarousel from './SwipeCarousel';

interface ExperienceShelfSectionProps {
  id: string;
  badge: string;
  title: string;
  highlightTitle?: string;
  subtitle: string;
  routes: any[];
  isHighMountain?: boolean;
  isBoutique?: boolean;
  cardVariant?: 'split' | 'cover';
}

export default function ExperienceShelfSection({
  id,
  badge,
  title,
  highlightTitle,
  subtitle,
  routes,
  isHighMountain,
  isBoutique,
  cardVariant
}: ExperienceShelfSectionProps) {
  if (!routes || routes.length === 0) return null;

  const isSplit = cardVariant === 'split' || id === 'salidas-grupales';

  return (
    <section id={id} className="py-12 sm:py-16 md:py-20 bg-transparent relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Cabecera Editorial Limpia & Sofisticada */}
        <div className="mb-6 sm:mb-8 border-b border-white/15 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-white/50 font-mono text-[10px] tracking-[0.3em] uppercase block mb-1">
              {badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              {title}{' '}
              {highlightTitle && (
                <span className="text-white">
                  {highlightTitle}
                </span>
              )}
            </h2>
          </div>
          <p className="text-white/60 text-xs md:text-sm max-w-md font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Carrusel con las Tarjetas Oficiales de Santiago Hiking */}
        <SwipeCarousel peekWidth={32} gap={14}>
          {routes.map((route: any, idx: number) => {
            const formattedClp = Number(route.base_price).toLocaleString('es-CL');
            const usdPrice = route.price_usd || (route.base_price ? `US$${Math.round(route.base_price / 975).toLocaleString('en-US')}` : null);
            const imgSrc = route.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85';
            
            const altitudeText = route.max_altitude
              ? (String(route.max_altitude).toLowerCase().includes('m') ? route.max_altitude : `${route.max_altitude} m`)
              : (route.difficulty_level === 'Alta' ? '2.100 m' : '1.638 m');

            const durationText = route.duration_text || (route.duration_days ? `${route.duration_days}d` : '3 - 5');
            const difficultyText = route.difficulty_level || 'Media';
            const locationText = route.location || 'LO BARNECHEA';
            let cleanTitle = (route.title || '').split('·')[0].trim();
            if (isSplit) {
              cleanTitle = cleanTitle.replace(/^cerro\s+/i, '').trim();
            }

            // ── VARIANTE 1: TARJETA OFICIAL SALIDAS GRUPALES (Split Image + Lighter Frosted Glass Container) ──
            if (isSplit) {
              return (
                <div
                  key={route.id || idx}
                  className="h-full rounded-2xl overflow-hidden flex flex-col group min-h-[460px] justify-between border border-white/12 transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                  }}
                >
                  {/* Foto Superior */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-stone-900 shrink-0">
                    <Image
                      src={imgSrc}
                      alt={cleanTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 70vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    <span className="absolute top-3.5 right-3.5 bg-stone-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded shadow-sm border border-white/10">
                      {route.badge || route.custom_discipline || 'TREKKING'}
                    </span>
                  </div>

                  {/* Cuerpo Glassmorphism Más Claro y Compacto */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mb-1.5">
                        {cleanTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-200/80 font-light leading-relaxed mb-3 line-clamp-2">
                        {route.description || 'Ascenso guiado paso a paso con la comunidad Gaz-Style en los Andes de Santiago.'}
                      </p>

                      {/* Métricas Técnicas Compactas */}
                      <div
                        className="grid grid-cols-3 gap-1 py-2.5 px-3 text-center font-mono rounded-xl"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider">Duración</p>
                          <p className="text-xs font-bold text-white mt-0.5">
                            {durationText}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider">Dificultad</p>
                          <p className="text-xs font-bold text-amber-400 mt-0.5">
                            {difficultyText}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider">Altura</p>
                          <p className="text-xs font-bold text-white mt-0.5">
                            {altitudeText}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/rutas/${route.id}`}
                      className="btn-arcteryx w-full !py-2.5 !px-5 text-center flex items-center justify-center text-xs font-bold tracking-widest uppercase"
                    >
                      VER DETALLES
                    </Link>
                  </div>
                </div>
              );
            }

            // ── VARIANTE 2: TARJETA DE LUJO CINEMATOGRÁFICA (Grandes Desafíos & Expeditions) ──
            const topMeta = `${locationText} · ${altitudeText}`;
            const priceTag = isHighMountain
              ? `${usdPrice} · $${formattedClp} CLP`
              : `$${formattedClp} CLP`;

            return (
              <div
                key={route.id || idx}
                className="relative min-h-[540px] rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-7 group border border-white/15 hover:border-white/30 transition-all duration-500 bg-stone-900"
              >
                {/* Fotografía de Fondo Completa */}
                <Image
                  src={imgSrc}
                  alt={route.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                {/* Velo Cinematográfico Suave */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/20 pointer-events-none" />

                {/* Badges Superiores Flotantes */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono text-white font-bold uppercase tracking-wider border border-white/10 shadow-sm">
                    {topMeta}
                  </span>
                  <span className="bg-stone-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold text-amber-300 border border-amber-400/40 shadow-sm">
                    {priceTag}
                  </span>
                </div>

                {/* Contenido Inferior */}
                <div className="relative z-10 space-y-4 pt-12">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight drop-shadow-md mb-2">
                      {cleanTitle}
                    </h3>
                    <p className="text-slate-200 text-sm font-light leading-relaxed line-clamp-2 drop-shadow">
                      {route.description || 'Expedición técnica guiada en la alta cordillera de los Andes de Santiago.'}
                    </p>
                  </div>

                  {/* Fila de Métricas Técnicas */}
                  <div
                    className="grid grid-cols-3 gap-2 py-3 px-3 text-center font-mono rounded-xl"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.55)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div>
                      <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider">Duración</p>
                      <p className="text-xs font-bold text-white mt-0.5">
                        {durationText}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider">Dificultad</p>
                      <p className="text-xs font-bold text-amber-400 mt-0.5">
                        {difficultyText}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider">Cumbre</p>
                      <p className="text-xs font-bold text-white mt-0.5">
                        {altitudeText}
                      </p>
                    </div>
                  </div>

                  {/* Botón Píldora */}
                  <Link
                    href={`/rutas/${route.id}`}
                    className="w-full rounded-full border border-white/30 bg-stone-950/60 hover:bg-stone-900 text-white font-bold tracking-wider py-3.5 px-6 text-center text-xs sm:text-sm transition-all uppercase flex items-center justify-center shadow-lg hover:border-white/50"
                  >
                    VER DETALLES & RESERVAR
                  </Link>
                </div>
              </div>
            );
          })}
        </SwipeCarousel>
      </div>
    </section>
  );
}

