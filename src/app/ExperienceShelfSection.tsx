'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mountain, Compass, ShieldCheck, Video, Car, Sparkles, Crown, ArrowRight, Calendar } from 'lucide-react';
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

        {/* Carrusel de Rutas de la Sección */}
        <SwipeCarousel peekWidth={32} gap={16}>
          {routes.map((route: any) => {
            const formattedClp = Number(route.base_price).toLocaleString('es-CL');
            const usdPrice = route.price_usd || (route.base_price ? `US$${Math.round(route.base_price / 975)}` : null);

            return (
              <div
                key={route.id}
                className="h-full rounded-2xl overflow-hidden flex flex-col group min-h-[520px] justify-between transition-all duration-300 hover:border-amber-400/50"
                style={{
                  backgroundColor: 'rgba(12, 12, 12, 0.45)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  border: isHighMountain 
                    ? '1px solid rgba(245, 158, 11, 0.35)' 
                    : (isBoutique ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid rgba(255, 255, 255, 0.12)'),
                  boxShadow: isHighMountain 
                    ? '0 12px 35px rgba(245, 158, 11, 0.08)' 
                    : '0 8px 25px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Imagen y Badges Flotantes */}
                <div className="aspect-[16/10] relative overflow-hidden bg-stone-900 shrink-0">
                  {route.image_url ? (
                    <Image
                      src={route.image_url}
                      alt={route.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <Mountain className="w-16 h-16 text-stone-400 m-auto" />
                  )}
                  
                  {/* Gradiente ahumado sobre la foto */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent pointer-events-none" />

                  {/* Badge de Categoría Superior */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                    {isHighMountain && (
                      <span className="bg-amber-500/90 text-stone-950 px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase font-black rounded shadow flex items-center gap-1">
                        <Crown className="w-3 h-3 text-stone-950" /> 5.000M+
                      </span>
                    )}
                    {isBoutique && (
                      <span className="bg-amber-400/90 text-stone-950 px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase font-black rounded shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-stone-950" /> PRIVADO
                      </span>
                    )}
                    <span className="bg-stone-950/85 backdrop-blur px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded border border-white/10 shadow-sm">
                      {route.badge || route.custom_discipline || (isHighMountain ? 'EXPEDICIÓN' : (isBoutique ? 'BOUTIQUE' : 'TREKKING'))}
                    </span>
                  </div>

                  {/* Badge de Precio Dual Flotante */}
                  <div className="absolute bottom-3 left-4 bg-stone-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-400/30 flex items-baseline gap-2">
                    {isHighMountain ? (
                      <>
                        <span className="text-sm font-black font-mono text-amber-400">
                          {usdPrice}
                        </span>
                        <span className="text-[11px] font-mono text-white/50">
                          ${formattedClp} CLP
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-black font-mono text-amber-300">
                          ${formattedClp} CLP
                        </span>
                        {usdPrice && (
                          <span className="text-[10px] font-mono text-white/50">
                            {usdPrice}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Contenido de la Ficha */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors">
                      {route.title}
                    </h3>
                    <p className="text-xs md:text-sm text-white/60 mb-4 font-light line-clamp-2 leading-relaxed">
                      {route.description || 'Guiado profesional de montaña, seguridad y experiencia en la Cordillera de los Andes.'}
                    </p>

                    {/* Especificaciones Técnicas */}
                    <div
                      className="grid grid-cols-3 gap-2 py-3 text-center font-mono rounded-xl"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div>
                        <p className="text-[9px] text-white/40 uppercase font-medium">Duración</p>
                        <p className="text-xs font-bold text-white mt-0.5">
                          {route.duration_text || (route.duration_days ? `${route.duration_days} días` : '1 día')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/40 uppercase font-medium">Dificultad</p>
                        <p className={`text-xs font-bold mt-0.5 ${
                          route.difficulty_level === 'Muy Alta' || isHighMountain 
                            ? 'text-rose-400' 
                            : (route.difficulty_level === 'Alta' ? 'text-amber-400' : 'text-emerald-400')
                        }`}>
                          {route.difficulty_level || (isHighMountain ? 'Muy Alta' : 'Media')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/40 uppercase font-medium">Cumbre</p>
                        <p className="text-xs font-bold text-white mt-0.5">
                          {route.max_altitude || 'Cordillera'}
                        </p>
                      </div>
                    </div>

                    {/* Ventajas Exclusivas para High Mountain o Boutique */}
                    {isHighMountain && (
                      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-white/60 pt-2 border-t border-white/10">
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
                      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-white/60 pt-2 border-t border-white/10">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Car className="w-3 h-3" /> Pick-up Puerta a Puerta
                        </span>
                        <span className="flex items-center gap-1 text-amber-300">
                          <Video className="w-3 h-3" /> Reel 4K Editado
                        </span>
                        <span className="text-emerald-400">100% Privado</span>
                      </div>
                    )}
                  </div>

                  {/* Botón CTA Original */}
                  <Link
                    href={`/rutas/${route.id}`}
                    className="btn-arcteryx w-full flex items-center justify-center text-center mt-2"
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
