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

            // ── VARIANTE 2: TARJETA EDITORIAL DE LUJO ORIGINAL (Travesías, High Mountain & Boutique) ──
            const t = (route.title || '').toLowerCase();
            let targetUrl = `/rutas/${route.id}`;
            if (t.includes('5:00 am') || t.includes('5am')) targetUrl = '/desafios/desafio-5am';
            else if (t.includes('triple corona')) targetUrl = '/desafios/triple-corona';
            else if (t.includes('sierra de ramón') || t.includes('sierra de ramon')) targetUrl = '/desafios/sierra-de-ramon';
            else if (t.includes('desbloqueando')) targetUrl = '/desafios/desbloqueando-santiago';

            const meta = route.badge || (
              isHighMountain
                ? 'ALTA MONTAÑA · ANDES 5.000M+'
                : isBoutique
                ? '100% PRIVADO · TAILOR-MADE'
                : 'GRAN DESAFÍO · CUENCA CENTRAL'
            );

            return (
              <div
                key={route.id || idx}
                className="relative min-h-[500px] overflow-hidden flex flex-col justify-end p-8 group border border-stone-200/20 hover:border-white/30 transition-all duration-500 bg-stone-900 rounded-2xl"
              >
                {/* Fotografía de Fondo Completa */}
                <Image
                  src={imgSrc}
                  alt={cleanTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                {/* Velo Cinematográfico Suave */}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent pointer-events-none" />

                {/* Contenido Editorial Limpio & Completo */}
                <div className="relative z-10 space-y-3">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/70 block">
                    {meta}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                    {cleanTitle}
                  </h3>

                  <p className="text-slate-200 text-sm font-light leading-relaxed line-clamp-3">
                    {route.description || 'Expedición técnica guiada en la Cordillera de los Andes de Santiago.'}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={targetUrl}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-white border-b border-white/60 pb-1 hover:border-white transition-all hover:text-amber-300"
                    >
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
  );
}

