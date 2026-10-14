'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mountain, Compass, ShieldCheck, Video, Car, Sparkles, Crown } from 'lucide-react';
import SwipeCarousel from './SwipeCarousel';

interface ExperienceShelfSectionProps {
  id: string;
  numberTag: string;
  badge: string;
  title: string;
  highlightTitle?: string;
  subtitle: string;
  routes: any[];
  isHighMountain?: boolean;
  isBoutique?: boolean;
}

export default function ExperienceShelfSection({
  id,
  numberTag,
  badge,
  title,
  highlightTitle,
  subtitle,
  routes,
  isHighMountain,
  isBoutique
}: ExperienceShelfSectionProps) {
  if (!routes || routes.length === 0) return null;

  return (
    <section id={id} className="py-12 sm:py-16 bg-transparent relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabecera de la Sección Editorial */}
        <div className="mb-6 sm:mb-8 border-b border-white/15 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/25">
                {numberTag}
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">
                {badge}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              {title}{' '}
              {highlightTitle && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">
                  {highlightTitle}
                </span>
              )}
            </h2>
          </div>
          <p className="text-white/65 text-xs md:text-sm max-w-lg font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Carrusel de Rutas con Tarjetas de IMAGEN COMPLETA (FULL COVER) */}
        <SwipeCarousel peekWidth={32} gap={16}>
          {routes.map((route: any) => {
            const formattedClp = Number(route.base_price).toLocaleString('es-CL');
            const usdPrice = route.price_usd || (route.base_price ? `US$${Math.round(route.base_price / 975)}` : null);

            return (
              <div
                key={route.id}
                className="relative min-h-[520px] rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-7 group border border-white/10 hover:border-amber-400/50 transition-all duration-500 bg-stone-950 shadow-2xl"
              >
                {/* ── FOTOGRAFÍA FULL COVER DE FONDO (IMAGEN COMPLETA) ── */}
                {route.image_url ? (
                  <Image
                    src={route.image_url}
                    alt={route.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-900 flex items-center justify-center">
                    <Mountain className="w-16 h-16 text-stone-700" />
                  </div>
                )}

                {/* ── DEGRADADO CINEMATOGRÁFICO DE CONTRASTE ── */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-black/35 pointer-events-none" />

                {/* ── CABECERA FLOTANTE SUPERIOR ── */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isHighMountain && (
                      <span className="bg-amber-500 text-stone-950 px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase font-black rounded-full shadow-md flex items-center gap-1">
                        <Crown className="w-3 h-3 text-stone-950" /> 5.000M+
                      </span>
                    )}
                    {isBoutique && (
                      <span className="bg-amber-400 text-stone-950 px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase font-black rounded-full shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-stone-950" /> PRIVADO
                      </span>
                    )}
                    <span className="bg-stone-950/85 backdrop-blur-md px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded-full border border-white/15 shadow-sm">
                      {route.badge || route.custom_discipline || (isHighMountain ? 'ALTA MONTAÑA' : (isBoutique ? 'BOUTIQUE' : 'TREKKING'))}
                    </span>
                  </div>

                  {/* Badge de Precio Flotante Superior Derecho */}
                  <div className="bg-stone-950/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/40 flex items-baseline gap-1.5 shadow-lg">
                    {isHighMountain ? (
                      <>
                        <span className="text-xs font-black font-mono text-amber-400">
                          {usdPrice}
                        </span>
                        <span className="text-[10px] font-mono text-white/50">
                          ${formattedClp}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-black font-mono text-amber-300">
                          ${formattedClp} CLP
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* ── CONTENIDO FLOTANTE INFERIOR ── */}
                <div className="relative z-10 space-y-3.5 pt-24">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1.5 group-hover:text-amber-300 transition-colors drop-shadow-md line-clamp-2">
                      {route.title}
                    </h3>
                    <p className="text-xs text-white/75 font-light line-clamp-2 leading-relaxed drop-shadow">
                      {route.description || 'Guiado profesional de montaña, seguridad y experiencia en la Cordillera de los Andes.'}
                    </p>
                  </div>

                  {/* Ficha de métricas en cristal ahumado transparente */}
                  <div
                    className="grid grid-cols-3 gap-2 py-2.5 px-3 text-center font-mono rounded-xl border border-white/15"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }}
                  >
                    <div>
                      <p className="text-[9px] text-white/50 uppercase font-medium">Duración</p>
                      <p className="text-xs font-bold text-white mt-0.5">
                        {route.duration_text || (route.duration_days ? `${route.duration_days}d` : '1 día')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/50 uppercase font-medium">Dificultad</p>
                      <p className={`text-xs font-bold mt-0.5 ${
                        route.difficulty_level === 'Muy Alta' || isHighMountain 
                          ? 'text-rose-400' 
                          : (route.difficulty_level === 'Alta' ? 'text-amber-400' : 'text-emerald-400')
                      }`}>
                        {route.difficulty_level || (isHighMountain ? 'Muy Alta' : 'Media')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/50 uppercase font-medium">Cumbre</p>
                      <p className="text-xs font-bold text-white mt-0.5">
                        {route.max_altitude || 'Cordillera'}
                      </p>
                    </div>
                  </div>

                  {/* Highlights para High Mountain o Boutique */}
                  {isHighMountain && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/80 px-1">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Crown className="w-3 h-3" /> Arrieros & Mulas
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <ShieldCheck className="w-3 h-3" /> Garmin SOS
                      </span>
                      <span>Ratio 1:2 / 1:3</span>
                    </div>
                  )}

                  {isBoutique && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/80 px-1">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Car className="w-3 h-3" /> Pick-up Santiago
                      </span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <Video className="w-3 h-3" /> Reel 4K
                      </span>
                      <span className="text-emerald-400 font-bold">100% Privado</span>
                    </div>
                  )}

                  {/* Botón CTA Original */}
                  <Link
                    href={`/rutas/${route.id}`}
                    className="btn-arcteryx w-full flex items-center justify-center text-center !py-3 shadow-lg"
                  >
                    Ver Detalles & Reservar
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
