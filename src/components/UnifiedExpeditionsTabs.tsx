'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mountain, ArrowRight, Clock, TrendingUp, Shield, Sparkles } from 'lucide-react';
import SwipeCarousel from '@/app/SwipeCarousel';

interface RouteItem {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  vertical_type?: string;
  difficulty_level?: string;
  duration_text?: string;
  duration_days?: number;
  max_altitude?: string | number;
  elevation_gain_m?: number;
  base_price?: number;
  price_usd?: string;
  image_url?: string;
  description?: string;
  badge?: string;
  custom_discipline?: string;
  is_discount_active?: boolean;
  discount_price?: number;
  discount_badge?: string;
  discount_color?: string;
  logistics?: {
    is_discount_active?: boolean;
    discount_price?: number;
    discount_badge?: string;
    discount_color?: string;
    [key: string]: any;
  };
}

interface Props {
  routes: RouteItem[];
  lang?: string;
}

const FALLBACK_HIKE_AND_FLY: RouteItem[] = [
  {
    id: 'alto-del-naranjo-hike-and-fly',
    title: 'Hike & Fly Alto del Naranjo',
    slug: 'alto-del-naranjo-hike-and-fly',
    vertical_type: 'hike_and_fly',
    difficulty_level: 'Media',
    max_altitude: '1.890m',
    elevation_gain_m: 850,
    base_price: 155000,
    image_url: '/images/hike-and-fly-takeoff.jpg',
  },
  {
    id: 'cerro-manquehue-ridge-fly',
    title: 'Hike & Fly Cerro Manquehue',
    slug: 'cerro-manquehue-ridge-fly',
    vertical_type: 'hike_and_fly',
    difficulty_level: 'Media',
    max_altitude: '1.627m',
    elevation_gain_m: 680,
    base_price: 165000,
    image_url: '/images/hike-and-fly-takeoff.jpg',
  },
  {
    id: 'cerro-provincia-hike-and-fly',
    title: 'Hike & Fly Cerro Provincia',
    slug: 'cerro-provincia-hike-and-fly',
    vertical_type: 'hike_and_fly',
    difficulty_level: 'Avanzada',
    max_altitude: '2.750m',
    elevation_gain_m: 1750,
    base_price: 195000,
    image_url: '/images/hike-and-fly-andes.jpg',
  },
];

export default function UnifiedExpeditionsTabs({ routes = [], lang = 'es' }: Props) {
  const [activeTab, setActiveTab] = useState<'trekking' | 'travesias_desafios' | 'hike_and_fly' | 'expediciones'>('trekking');

  // ── CLASIFICACIÓN PURA SEGÚN LO DEFINIDO EN EL PANEL ADMIN (Sin heurísticas ni precios) ──
  const getCategoryOfRoute = (r: RouteItem): 'trekking' | 'travesias_desafios' | 'expediciones' | 'hike_and_fly' => {
    const v = (r.vertical_type || '').toLowerCase().trim();
    const c = (r.category || '').toLowerCase().trim();
    const t = (r.title || '').toLowerCase().trim();
    if (v === 'hike_and_fly' || v === 'hike_fly' || v === 'parapente' || c === 'hike_and_fly' || c === 'hike_fly' || c === 'parapente' || t.includes('hike & fly') || t.includes('hike and fly')) return 'hike_and_fly';
    if (v === 'trekking' || v === 'salidas_grupales' || v === 'grupales' || c === 'trekking') return 'trekking';
    if (v === 'travesias_desafios' || v === 'challenges' || v === 'desafios' || c === 'desafios' || c === 'travesias') return 'travesias_desafios';
    if (v === 'expediciones' || v === 'high_mountain' || v === 'expedition_pass' || v === 'boutique' || c === 'expediciones') return 'expediciones';
    return 'trekking';
  };

  // Rutas de la pestaña activa (obedeciendo 100% al admin con fallback para hike & fly)
  const filtered = routes.filter((r) => getCategoryOfRoute(r) === activeTab);
  const currentRoutes = activeTab === 'hike_and_fly' && filtered.length === 0 ? FALLBACK_HIKE_AND_FLY : filtered;

  // Helper para nivel visual tipo MBA (1 a 4 barras) basado en dificultad real y altitud
  const getLevelIndicator = (route: RouteItem) => {
    const diff = (route.difficulty_level || '').toLowerCase();
    const alt = Number(String(route.max_altitude || '').replace(/[^0-9]/g, '')) || 0;

    // Nivel 4: Gran Altitud (sobre 3.800m o dificultad Experto / Muy Alta)
    if (alt >= 3800 || diff.includes('experto') || diff.includes('muy alta')) {
      return { level: 4, name: 'Nivel 4 · Gran Altitud', bars: '■■■■' };
    }
    // Nivel 3: Desafío Andino (sobre 2.400m o dificultad Alta / Avanzada / Exigente)
    if (alt >= 2400 || diff.includes('alta') || diff.includes('avanzad') || diff.includes('exigente')) {
      return { level: 3, name: 'Nivel 3 · Desafío Andino', bars: '■■■□' };
    }
    // Nivel 2: Cardio & Ritmo (Media / Intermedia)
    if (alt >= 1600 || diff.includes('media') || diff.includes('intermed')) {
      return { level: 2, name: 'Nivel 2 · Cardio & Ritmo', bars: '■■□□' };
    }
    // Nivel 1: Iniciación
    return { level: 1, name: 'Nivel 1 · Iniciación', bars: '■□□□' };
  };

  // Helper para ritmo de cordada estándar MBA
  const getPaceIndicator = (route: RouteItem) => {
    const diff = (route.difficulty_level || '').toLowerCase();
    const title = (route.title || '').toLowerCase();
    if (diff.includes('experto') || diff.includes('muy alta') || title.includes('5am') || title.includes('triple') || title.includes('sierra')) {
      return { pace: 'Ritmo Atleta', color: 'text-rose-400' };
    }
    if (diff.includes('alta') || diff.includes('avanzad') || diff.includes('exigente')) {
      return { pace: 'Ritmo Constante', color: 'text-amber-300' };
    }
    return { pace: 'Ritmo Pausado', color: 'text-emerald-400' };
  };

  return (
    <section id="expediciones" className="pt-2 sm:pt-6 pb-6 sm:pb-12 relative z-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── SELECTOR DE PESTAÑAS EN LÍNEA ESTILO MUCH BETTER ADVENTURES ── */}
        <div className="w-full border-b border-white/10 mb-6 sm:mb-8">
          <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-12 md:gap-16 overflow-x-auto no-scrollbar whitespace-nowrap px-4 sm:px-6 pb-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('trekking')}
              className={`relative pb-2.5 text-sm sm:text-base md:text-lg font-mono font-bold uppercase tracking-wider transition-all select-none cursor-pointer shrink-0 text-center ${
                activeTab === 'trekking'
                  ? 'text-white'
                  : 'text-white/45 hover:text-white/80'
              }`}
            >
              <span>TREKKING</span>
              {activeTab === 'trekking' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('travesias_desafios')}
              className={`relative pb-2.5 text-sm sm:text-base md:text-lg font-mono font-bold uppercase tracking-wider transition-all select-none cursor-pointer shrink-0 text-center ${
                activeTab === 'travesias_desafios'
                  ? 'text-white'
                  : 'text-white/45 hover:text-white/80'
              }`}
            >
              <span>TRAVESÍAS</span>
              {activeTab === 'travesias_desafios' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hike_and_fly')}
              className={`relative pb-2.5 text-sm sm:text-base md:text-lg font-mono font-bold uppercase tracking-wider transition-all select-none cursor-pointer shrink-0 text-center ${
                activeTab === 'hike_and_fly'
                  ? 'text-white'
                  : 'text-white/45 hover:text-white/80'
              }`}
            >
              <span>HIKE & FLY</span>
              {activeTab === 'hike_and_fly' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('expediciones')}
              className={`relative pb-2.5 text-sm sm:text-base md:text-lg font-mono font-bold uppercase tracking-wider transition-all select-none cursor-pointer shrink-0 text-center ${
                activeTab === 'expediciones'
                  ? 'text-white'
                  : 'text-white/45 hover:text-white/80'
              }`}
            >
              <span>EXPEDICIONES</span>
              {activeTab === 'expediciones' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-amber-400 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* ── LISTADO DE TARJETAS TIPO MUCH BETTER ADVENTURES (Sin espacio vacío al borde derecho) ── */}
        <div className="relative -mr-4 sm:mr-0">
          <div 
            id="expeditions-scroll-track"
            className="flex items-start overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 sm:gap-6 pb-4 scroll-smooth pl-0.5 pr-4 sm:pr-0"
          >
            {currentRoutes.map((route, idx) => {
              const lvl = getLevelIndicator(route);
              const pace = getPaceIndicator(route);
              const formattedClp = Number(route.base_price || 25000).toLocaleString('es-CL');
              const imgSrc = route.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
              const cleanTitle = (route.title || '').replace(/^cerro\s+/i, '').trim();

              // Enlace directo a la ficha completa de la ruta
              const isHikeFly = getCategoryOfRoute(route) === 'hike_and_fly';
              const routeUrl = isHikeFly 
                ? `/hike-and-fly/${route.slug || route.id || ''}`
                : `/rutas/${route.id || route.slug || ''}`;

              return (
                <Link
                  key={route.id || idx}
                  href={routeUrl}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 snap-start
                             w-[165px] h-[260px] min-h-[260px] sm:w-[220px] sm:h-[330px] md:w-[240px] md:h-[360px] aspect-[9/14] sm:aspect-[2/3] shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/10"
                >
                  {/* Foto de Fondo Completa (Full Bleed) */}
                  <Image
                    src={imgSrc}
                    alt={cleanTitle}
                    fill
                    sizes="(max-width: 640px) 160px, 240px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Gradiente Cinematográfico para legibilidad de textos */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 group-hover:via-black/20 transition-colors" />

                  {/* Barras de Nivel & Badge de Oferta Urgente */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none z-10">
                    {(() => {
                      const rawLogistics = typeof route.logistics === 'string' 
                        ? (JSON.parse(route.logistics || '{}')) 
                        : (route.logistics || {});
                      const hasDiscount = Boolean(route.is_discount_active || rawLogistics.is_discount_active);
                      const discountPrice = Number(route.discount_price || rawLogistics.discount_price || 0);
                      const isPromo = hasDiscount && discountPrice > 0;

                      if (!isPromo) return <span />;

                      const cTheme = route.discount_color || rawLogistics.discount_color || 'rose';
                      const cClass = 
                        cTheme === 'rose'    ? 'bg-[#e11d48] text-white' :
                        cTheme === 'red'     ? 'bg-[#dc2626] text-white' :
                        cTheme === 'amber'   ? 'bg-[#f59e0b] text-stone-950 font-black' :
                        cTheme === 'purple'  ? 'bg-[#7c3aed] text-white' :
                        cTheme === 'cyan'    ? 'bg-[#06b6d4] text-stone-950 font-black' :
                        cTheme === 'emerald' ? 'bg-[#10b981] text-stone-950 font-black' :
                        'bg-[#e11d48] text-white';

                      const badgeText = route.discount_badge || rawLogistics.discount_badge || 'ÚLTIMOS CUPOS OFF';

                      return (
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] sm:text-[9px] uppercase tracking-wider font-mono shadow-sm ${cClass}`}>
                          {badgeText}
                        </span>
                      );
                    })()}
                    <span className="text-xs sm:text-sm font-mono font-bold text-amber-400 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] tracking-widest select-none">
                      {lvl.bars}
                    </span>
                  </div>

                  {/* Contenido Inferior: Nivel, Ritmo de Cordada, Título, Altura y Desnivel */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 text-white">
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono">
                      <span className="text-amber-400 font-bold uppercase tracking-wider line-clamp-1">
                        {lvl.name.split('·')[1]?.trim() || lvl.name}
                      </span>
                      <span className={`text-[8px] sm:text-[9px] font-semibold tracking-tight ${pace.color}`}>
                        {pace.pace}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-tight leading-tight group-hover:text-amber-300 transition-colors drop-shadow-md">
                      {cleanTitle}
                    </h3>

                    {/* Fila Inferior: Altura Cumbre y Desnivel */}
                    <div className="pt-1.5 mt-1 border-t border-white/15 flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/80">
                      <span>
                        {route.max_altitude ? (String(route.max_altitude).includes('m') ? route.max_altitude : `${route.max_altitude}m`) : '1.638m'}
                      </span>
                      <span className="text-white/60">
                        {route.elevation_gain_m ? `+${route.elevation_gain_m}m D+` : '+850m D+'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Flecha circular flotante a la derecha idéntica a MBA */}
          {currentRoutes.length > 1 && (
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('expeditions-scroll-track');
                if (el) el.scrollBy({ left: 280, behavior: 'smooth' });
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/20 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95"
              aria-label="Siguiente"
            >
              <span className="text-base font-bold leading-none">›</span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
