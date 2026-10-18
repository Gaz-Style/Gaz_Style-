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
}

interface Props {
  routes: RouteItem[];
  lang?: string;
}

export default function UnifiedExpeditionsTabs({ routes = [], lang = 'es' }: Props) {
  const [activeTab, setActiveTab] = useState<'trekking' | 'travesias_desafios' | 'expediciones'>('trekking');

  // ── CLASIFICACIÓN PURA SEGÚN LO DEFINIDO EN EL PANEL ADMIN (Sin heurísticas ni precios) ──
  const getCategoryOfRoute = (r: RouteItem): 'trekking' | 'travesias_desafios' | 'expediciones' => {
    const v = (r.vertical_type || '').toLowerCase().trim();
    if (v === 'trekking' || v === 'salidas_grupales' || v === 'grupales') return 'trekking';
    if (v === 'travesias_desafios' || v === 'challenges' || v === 'desafios') return 'travesias_desafios';
    if (v === 'expediciones' || v === 'high_mountain' || v === 'expedition_pass' || v === 'boutique') return 'expediciones';
    return 'trekking';
  };

  // Rutas de la pestaña activa (obedeciendo 100% al admin)
  const currentRoutes = routes.filter((r) => getCategoryOfRoute(r) === activeTab);

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

  return (
    <section id="expediciones" className="py-6 sm:py-12 relative z-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── SELECTOR DE PESTAÑAS EN LÍNEA ESTILO MUCH BETTER ADVENTURES (Directo a las tarjetas) ── */}
        <div className="w-full border-b border-white/10 mb-6 sm:mb-8">
          <div className="flex items-center justify-start sm:justify-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar whitespace-nowrap px-4 sm:px-6 pb-2 scroll-smooth">
            <button
              type="button"
              onClick={() => setActiveTab('trekking')}
              className={`relative pb-2.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all select-none cursor-pointer shrink-0 ${
                activeTab === 'trekking'
                  ? 'text-white'
                  : 'text-white/45 hover:text-white/80'
              }`}
            >
              <span>TREKKING</span>
              {activeTab === 'trekking' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-amber-400 rounded-full shadow-[0_0_14px_rgba(251,191,36,0.9)]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('travesias_desafios')}
              className={`relative pb-2.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all select-none cursor-pointer shrink-0 ${
                activeTab === 'travesias_desafios'
                  ? 'text-white'
                  : 'text-white/45 hover:text-white/80'
              }`}
            >
              <span>TRAVESÍAS & DESAFÍOS</span>
              {activeTab === 'travesias_desafios' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-amber-400 rounded-full shadow-[0_0_14px_rgba(251,191,36,0.9)]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('expediciones')}
              className={`relative pb-2.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all select-none cursor-pointer shrink-0 ${
                activeTab === 'expediciones'
                  ? 'text-white'
                  : 'text-white/45 hover:text-white/80'
              }`}
            >
              <span>EXPEDICIONES</span>
              {activeTab === 'expediciones' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-amber-400 rounded-full shadow-[0_0_14px_rgba(251,191,36,0.9)]" />
              )}
            </button>
          </div>
        </div>

        {/* ── LISTADO DE TARJETAS TIPO MUCH BETTER ADVENTURES (Sin espacio vacío al borde derecho) ── */}
        <div className="relative -mr-4 sm:mr-0">
          <div 
            id="expeditions-scroll-track"
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 sm:gap-6 pb-4 scroll-smooth pl-0.5 pr-4 sm:pr-0"
          >
            {currentRoutes.map((route, idx) => {
              const lvl = getLevelIndicator(route);
              const formattedClp = Number(route.base_price || 25000).toLocaleString('es-CL');
              const imgSrc = route.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
              const cleanTitle = (route.title || '').replace(/^cerro\s+/i, '').trim();

              return (
                <div
                  key={route.id || idx}
                  className="rounded-3xl overflow-hidden flex flex-col justify-between border border-white/10 shrink-0 snap-start
                             w-[78vw] max-w-[320px] sm:w-[320px] shadow-2xl transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(12, 14, 18, 0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Foto Superior */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-stone-900 shrink-0">
                    <Image
                      src={imgSrc}
                      alt={cleanTitle}
                      fill
                      sizes="(max-width: 640px) 78vw, 320px"
                      className="object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="bg-stone-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase font-bold text-white rounded border border-white/10">
                        {route.badge || route.custom_discipline || 'EXPEDITION PASS'}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] tracking-widest select-none">
                        {lvl.bars}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono text-white/90">
                      <span className="font-bold flex items-center gap-1.5">
                        <Mountain className="w-3.5 h-3.5 text-amber-400" />
                        {route.max_altitude ? (String(route.max_altitude).includes('m') ? route.max_altitude : `${route.max_altitude}m`) : '1.638m'}
                      </span>
                      <span className="text-white/70 text-[10px]">
                        {route.duration_text || `${route.duration_days || 1} jornada`}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono">
                        <span className="text-amber-400 font-bold uppercase tracking-wider">{lvl.name}</span>
                        <span className="text-white/40">{route.difficulty_level || 'Media'}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-snug mb-1.5">
                        {cleanTitle}
                      </h3>
                      <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-light">
                        {route.description || 'Ascenso guiado por senderos andinos de Santiago con liderazgo de cordada.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono">
                      <div>
                        <span className="text-[9px] text-white/40 uppercase block">Desde</span>
                        <span className="text-base font-black text-amber-400">${formattedClp}</span>
                      </div>
                      <Link
                        href={`/reservar?route=${route.id || route.slug || ''}`}
                        className="btn-arcteryx-primary !py-2 !px-4 text-[10px] sm:text-xs font-mono font-bold tracking-wider"
                      >
                        RESERVAR
                      </Link>
                    </div>
                  </div>
                </div>
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
