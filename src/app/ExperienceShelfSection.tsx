'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mountain } from 'lucide-react';
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
    <section id={id} className="py-12 sm:py-16 md:py-20 bg-transparent relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Cabecera Editorial Limpia & Sofisticada */}
        <div className="mb-6 sm:mb-8 border-b border-white/15 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-white/50 font-mono text-[10px] tracking-[0.3em] uppercase block mb-1">
              {numberTag} · {badge}
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

        {/* Carrusel Editorial con Tarjetas de Imagen Completa (Estilo Lienzo de Galería) */}
        <SwipeCarousel peekWidth={32} gap={14}>
          {routes.map((route: any, idx: number) => {
            const num = String(idx + 1).padStart(2, '0');
            const formattedClp = Number(route.base_price).toLocaleString('es-CL');
            const usdPrice = route.price_usd || (route.base_price ? `US$${Math.round(route.base_price / 975).toLocaleString('en-US')}` : null);
            const imgSrc = route.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85';
            
            // Meta tag editorial sobrio
            const metaTag = route.badge || route.max_altitude || (isHighMountain ? '5.000M+ · ALTA MONTAÑA' : (isBoutique ? '100% PRIVADO' : 'TREKKING'));

            return (
              <div
                key={route.id || num}
                className="relative min-h-[500px] overflow-hidden flex flex-col justify-end p-8 group border border-stone-200/20 hover:border-white/30 transition-all duration-500 bg-stone-900 rounded-2xl"
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
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent pointer-events-none" />

                {/* Contenido Editorial Flotante */}
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/70 block">
                      {num} · {metaTag}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300 tracking-wider">
                      {isHighMountain ? (
                        <>{usdPrice} · ${formattedClp} CLP</>
                      ) : (
                        <>${formattedClp} CLP</>
                      )}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    {route.title}
                  </h3>

                  <p className="text-slate-200 text-sm font-light leading-relaxed line-clamp-3">
                    {route.description || 'Expedición técnica guiada en la Cordillera de los Andes de Santiago.'}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/rutas/${route.id}`}
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
