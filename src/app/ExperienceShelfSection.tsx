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
  lang?: string;
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
  cardVariant,
  lang = 'es'
}: ExperienceShelfSectionProps) {
  if (!routes || routes.length === 0) return null;

  const isSplit = cardVariant === 'split' || id === 'salidas-grupales';

  // Determinación dinámica de columnas en escritorio según cantidad de rutas
  const desktopGridCols = routes.length === 4
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    : routes.length === 2
    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  // Función común para renderizar cada tarjeta con máxima fidelidad visual
  const renderCard = (route: any, idx: number) => {
    const formattedClp = Number(route.base_price).toLocaleString('es-CL');
    const usdPrice = route.price_usd || (route.base_price ? `US$${Math.round(route.base_price / 975).toLocaleString('en-US')}` : null);
    const imgSrc = route.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85';
    
    const altitudeText = route.max_altitude
      ? (String(route.max_altitude).toLowerCase().includes('m') ? route.max_altitude : `${route.max_altitude} m`)
      : (route.difficulty_level === 'Alta' ? '2.100 m' : '1.638 m');

    const durationText = route.duration_text || (route.duration_days ? `${route.duration_days}d` : '3 - 5');
    const difficultyText = route.difficulty_level || 'Media';
    let cleanTitle = (route.title || '').split('·')[0].trim();
    if (isSplit) {
      cleanTitle = cleanTitle.replace(/^cerro\s+/i, '').trim();
    }

    // ── VARIANTE 1: TARJETA OFICIAL SALIDAS GRUPALES (Split Image + Frosted Glass Container) ──
    if (isSplit) {
      return (
        <div
          key={route.id || idx}
          className="h-full rounded-2xl overflow-hidden flex flex-col group min-h-[460px] justify-between border border-white/10 transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)]"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Foto Superior */}
          <div className="aspect-[16/10] relative overflow-hidden bg-stone-900 shrink-0">
            <Image
              src={imgSrc}
              alt={cleanTitle}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <span className="absolute top-3.5 right-3.5 bg-stone-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded shadow-sm border border-white/10">
              {route.badge || route.custom_discipline || 'TREKKING'}
            </span>
          </div>

          {/* Cuerpo Glassmorphism */}
          <div className="p-5 flex flex-col flex-1 justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mb-1.5">
                {cleanTitle}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200/80 font-light leading-relaxed mb-3 line-clamp-2">
                {route.description || 'Ascenso guiado paso a paso con la comunidad Gaz-Style en los Andes de Santiago.'}
              </p>

              {/* Métricas Técnicas */}
              <div
                className="grid grid-cols-3 gap-1 py-2.5 px-3 text-center font-mono rounded-xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider">
                    {lang === 'en' ? 'Duration' : lang === 'fr' ? 'Durée' : lang === 'pt' ? 'Duração' : lang === 'de' ? 'Dauer' : 'Duración'}
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {durationText}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider">
                    {lang === 'en' ? 'Difficulty' : lang === 'fr' ? 'Difficulté' : lang === 'pt' ? 'Dificuldade' : lang === 'de' ? 'Schwierigkeit' : 'Dificultad'}
                  </p>
                  <p className="text-xs font-bold text-amber-400 mt-0.5">
                    {difficultyText}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider">
                    {lang === 'en' ? 'Altitude' : lang === 'fr' ? 'Altitude' : lang === 'pt' ? 'Altitude' : lang === 'de' ? 'Höhe' : 'Altura'}
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {altitudeText}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/rutas/${route.id}`}
              className="btn-arcteryx w-full !py-2.5 !px-5 text-center flex items-center justify-center text-xs font-bold tracking-widest uppercase hover:scale-[1.02] transition-transform"
            >
              {lang === 'en' ? 'VIEW DETAILS' : lang === 'fr' ? 'VOIR DÉTAILS' : lang === 'pt' ? 'VER DETALHES' : lang === 'de' ? 'DETAILS ANSEHEN' : 'VER DETALLES'}
            </Link>
          </div>
        </div>
      );
    }

    // ── VARIANTE 2: TARJETA EDITORIAL DE LUJO (Travesías, High Mountain & Boutique) ──
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

    const isTravesia = id === 'travesias-desafios';

    return (
      <div
        key={route.id || idx}
        className={`relative min-h-[380px] sm:min-h-[420px] md:min-h-[460px] overflow-hidden flex flex-col justify-end p-5 sm:p-6 md:p-7 group transition-all duration-500 bg-stone-900 rounded-2xl hover:scale-[1.02] ${
          isBoutique
            ? 'border-2 border-[#D4AF37] hover:border-[#F3E5AB] shadow-[0_0_35px_rgba(212,175,55,0.25)] hover:shadow-[0_0_55px_rgba(212,175,55,0.45)] ring-1 ring-inset ring-[#D4AF37]/30'
            : isHighMountain
            ? 'border-2 border-slate-300 hover:border-white shadow-[0_0_35px_rgba(226,232,240,0.30)] hover:shadow-[0_0_55px_rgba(255,255,255,0.50)] ring-1 ring-inset ring-white/40'
            : isTravesia
            ? 'border-2 border-stone-700/80 hover:border-stone-500 shadow-[0_0_30px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-stone-600/40'
            : 'border border-stone-200/20 hover:border-white/30'
        }`}
      >
        {/* Fotografía de Fondo Completa */}
        <Image
          src={imgSrc}
          alt={cleanTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
        />

        {/* Velo Cinematográfico Suave */}
        <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-transparent pointer-events-none" />

        {/* Aura Dorada Metálica (Solo Boutique) */}
        {isBoutique && (
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.16) 0%, rgba(197, 160, 40, 0.05) 40%, transparent 70%)',
              boxShadow: 'inset 0 0 26px rgba(212, 175, 55, 0.18)',
            }}
          />
        )}

        {/* Aura Plateada Brillante / Glaciar (Solo High Mountain) */}
        {isHighMountain && (
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.20) 0%, rgba(203, 213, 225, 0.08) 35%, transparent 65%)',
              boxShadow: 'inset 0 0 28px rgba(226, 232, 240, 0.22)',
            }}
          />
        )}

        {/* Contenido Editorial */}
        <div className="relative z-10 space-y-2">
          <span
            className={`text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase block ${
              isBoutique
                ? 'text-[#D4AF37] font-bold'
                : isHighMountain
                ? 'text-slate-200 font-bold tracking-[0.3em]'
                : 'text-white/70'
            }`}
          >
            {meta}
          </span>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-snug">
            {cleanTitle}
          </h3>

          <p className="text-slate-200 text-xs sm:text-sm font-light leading-relaxed line-clamp-2">
            {route.description || 'Expedición técnica guiada en la Cordillera de los Andes de Santiago.'}
          </p>

          <div className="pt-1.5">
            <Link
              href={targetUrl}
              className={`inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-[0.18em] font-bold border-b pb-0.5 transition-all ${
                isBoutique
                  ? 'text-[#F3E5AB] border-[#D4AF37] hover:text-white hover:border-white'
                  : isHighMountain
                  ? 'text-slate-100 border-slate-300 hover:text-white hover:border-white'
                  : 'text-white border-white/60 hover:border-white hover:text-stone-300'
              }`}
            >
              {lang === 'en'
                ? 'View Details & Technical Specs →'
                : lang === 'fr'
                ? 'Voir Détails et Fiche Technique →'
                : lang === 'pt'
                ? 'Ver Detalhes e Ficha Técnica →'
                : lang === 'de'
                ? 'Details & Datenblatt anzeigen →'
                : 'Ver Detalles y Ficha Técnica →'}
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id={id} className="py-6 sm:py-10 md:py-16 bg-transparent relative z-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        
        {/* Cabecera Editorial Limpia & Sofisticada */}
        <div className="mb-4 sm:mb-6 border-b border-white/10 pb-3 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="text-white/50 font-mono text-[10px] tracking-[0.3em] uppercase block mb-1">
              {badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">
              {isBoutique ? (
                <>
                  <span
                    className="text-white"
                    style={{
                      WebkitTextStroke: '1.2px #D4AF37',
                      paintOrder: 'stroke fill',
                      textShadow: '0 0 18px rgba(212, 175, 55, 0.45)',
                    }}
                  >
                    {title}
                  </span>{' '}
                  {highlightTitle && (
                    <span
                      className="text-white"
                      style={{
                        WebkitTextStroke: '1.2px #D4AF37',
                        paintOrder: 'stroke fill',
                        textShadow: '0 0 22px rgba(212, 175, 55, 0.65)',
                      }}
                    >
                      {highlightTitle}
                    </span>
                  )}
                </>
              ) : isHighMountain ? (
                <>
                  <span
                    className="text-white"
                    style={{
                      WebkitTextStroke: '1.2px #C0C0C0',
                      paintOrder: 'stroke fill',
                      textShadow: '0 0 18px rgba(226, 232, 240, 0.5)',
                    }}
                  >
                    {title}
                  </span>{' '}
                  {highlightTitle && (
                    <span
                      className="text-white"
                      style={{
                        WebkitTextStroke: '1.2px #E2E8F0',
                        paintOrder: 'stroke fill',
                        textShadow: '0 0 24px rgba(248, 250, 252, 0.7)',
                      }}
                    >
                      {highlightTitle}
                    </span>
                  )}
                </>
              ) : id === 'travesias-desafios' ? (
                <>
                  <span
                    className="text-white"
                    style={{
                      WebkitTextStroke: '1.2px #404040',
                      paintOrder: 'stroke fill',
                      textShadow: '0 0 16px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    {title}
                  </span>{' '}
                  {highlightTitle && (
                    <span
                      className="text-white"
                      style={{
                        WebkitTextStroke: '1.2px #525252',
                        paintOrder: 'stroke fill',
                        textShadow: '0 0 18px rgba(0, 0, 0, 0.9)',
                      }}
                    >
                      {highlightTitle}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-white">
                  {title} {highlightTitle && <span>{highlightTitle}</span>}
                </span>
              )}
            </h2>
          </div>
          <p className="text-white/70 text-xs sm:text-[13px] max-w-md font-light leading-snug">
            {subtitle}
          </p>
        </div>

        {/* 1. MODO MÓVIL (Touch Swipe Carousel) */}
        <div className="block lg:hidden">
          <SwipeCarousel peekWidth={28} gap={14}>
            {routes.map((route: any, idx: number) => renderCard(route, idx))}
          </SwipeCarousel>
        </div>

        {/* 2. MODO ESCRITORIO (Grid de Tarjetas Independientes con visualización simultánea) */}
        <div className={`hidden lg:grid ${desktopGridCols} gap-6 items-stretch`}>
          {routes.map((route: any, idx: number) => renderCard(route, idx))}
        </div>

      </div>
    </section>
  );
}
