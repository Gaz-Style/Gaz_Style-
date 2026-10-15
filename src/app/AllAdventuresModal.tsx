'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight, Clock, Mountain } from 'lucide-react';

interface RouteItem {
  id: string;
  title: string;
  category?: string;
  vertical_type?: string;
  difficulty_level?: string;
  duration_text?: string;
  duration_days?: number;
  max_altitude?: string | number;
  location?: string;
  base_price?: number;
  price_usd?: string;
  image_url?: string;
  description?: string;
  badge?: string;
}

interface AllAdventuresModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: RouteItem[];
  lang?: string;
}

export default function AllAdventuresModal({ isOpen, onClose, routes, lang = 'es' }: AllAdventuresModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Clasificador idéntico a las 4 secciones de la web
  const categorize = (r: RouteItem): 'grupales' | 'travesias' | 'high_mountain' | 'boutique' => {
    const v = (r.vertical_type || '').toLowerCase();
    const c = (r.category || '').toLowerCase();
    const t = (r.title || '').toLowerCase();

    if (v === 'high_mountain' || c === 'high_mountain' || t.includes('plomo') || t.includes('leonera') || t.includes('san josé') || t.includes('san jose')) {
      return 'high_mountain';
    }
    if (v === 'expedition_pass' || c === 'expedition_pass' || t.includes('vip') || t.includes('expedition pass')) {
      return 'boutique';
    }
    if (v === 'travesias_desafios' || v === 'challenges' || c === 'travesias_desafios' || c === 'desafios' || t.includes('provincia') || t.includes('corona') || t.includes('san ramón') || t.includes('la cruz') || t.includes('carpa')) {
      return 'travesias';
    }
    return 'grupales';
  };

  const SECTIONS = [
    {
      key: 'grupales' as const,
      name: 'Salidas Grupales',
      tag: 'COMUNIDAD & ATARDECERES',
      borderColor: 'border-white/15',
    },
    {
      key: 'travesias' as const,
      name: 'Travesías & Desafíos',
      tag: 'ENDURANCE FULL DAY',
      borderColor: 'border-stone-700/80',
    },
    {
      key: 'high_mountain' as const,
      name: 'Expedition High Mountain',
      tag: 'GRANDES CUMBRES 5.000M+',
      borderColor: 'border-slate-300/80',
    },
    {
      key: 'boutique' as const,
      name: 'Expedition Boutique',
      tag: '100% PRIVADO & TAILOR-MADE',
      borderColor: 'border-[#D4AF37]',
    },
  ];

  const grouped = useMemo(() => {
    const res: Record<'grupales' | 'travesias' | 'high_mountain' | 'boutique', RouteItem[]> = {
      grupales: [],
      travesias: [],
      high_mountain: [],
      boutique: [],
    };
    routes.forEach((r) => {
      const cat = categorize(r);
      res[cat].push(r);
    });
    return res;
  }, [routes]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Velo transparente ligero: mantiene visible la montaña y video de fondo */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-none" />

      {/* Tarjeta Contenedora Glassmorphism Transparente (Idéntica a la web) */}
      <div 
        className="relative z-10 w-full max-w-2xl max-h-[90vh] sm:max-h-[86vh] rounded-3xl overflow-hidden flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.85)] border border-white/12"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera limpia y mínima */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div>
            <span className="text-white/50 font-mono text-[9px] tracking-[0.25em] uppercase block">
              Catálogo de Expediciones
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Todas las Aventuras
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista con Scroll: Tarjetas Compactas de Cerros con Foto y Reseña Corta */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 overscroll-contain">
          {SECTIONS.map((sec) => {
            const items = grouped[sec.key];
            if (items.length === 0) return null;

            return (
              <div key={sec.key}>
                {/* Título de Categoría Mínimo */}
                <div className="flex items-baseline justify-between mb-2.5 pb-1.5 border-b border-white/10">
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                    {sec.name}
                  </h3>
                  <span className="text-[9px] font-mono tracking-widest text-white/45 uppercase">
                    {sec.tag}
                  </span>
                </div>

                {/* Tarjetas Compactas en Lista */}
                <div className="space-y-2">
                  {items.map((route) => {
                    let cleanTitle = (route.title || '').split('·')[0].trim();
                    if (sec.key === 'grupales') {
                      cleanTitle = cleanTitle.replace(/^cerro\s+/i, '');
                    }
                    const targetUrl = `/rutas/${route.id}`;
                    const duration = route.duration_text || (route.duration_days ? `${route.duration_days}d` : '3 - 5h');
                    const altitude = route.max_altitude ? (String(route.max_altitude).includes('m') ? route.max_altitude : `${route.max_altitude}m`) : null;
                    const price = route.base_price ? `$${Number(route.base_price).toLocaleString('es-CL')}` : null;

                    return (
                      <Link
                        key={route.id}
                        href={targetUrl}
                        onClick={onClose}
                        className={`group relative rounded-xl overflow-hidden flex items-stretch border transition-all duration-300 hover:scale-[1.01] ${sec.borderColor}`}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                        }}
                      >
                        {/* Foto de la Aventura Completa en Proporción Ideal */}
                        <div className="relative w-28 sm:w-36 shrink-0 overflow-hidden bg-stone-900">
                          <Image
                            src={route.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'}
                            alt={cleanTitle}
                            fill
                            sizes="144px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 pointer-events-none" />
                        </div>

                        {/* Contenido: Título, Reseña Corta y Datos */}
                        <div className="p-3 sm:p-3.5 flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors truncate">
                                {cleanTitle}
                              </h4>
                              <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                            </div>

                            {/* Reseña Corta */}
                            <p className="text-[11px] text-white/70 font-light leading-snug line-clamp-2">
                              {route.description || 'Ascenso guiado con la comunidad de montaña Santiago Hiking.'}
                            </p>
                          </div>

                          {/* Métricas Compactas */}
                          <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-white/5 text-[10px] font-mono text-white/50">
                            <span>{duration}</span>
                            {altitude && <span>· {altitude}</span>}
                            {price && <span className="ml-auto font-bold text-white/80">{price}</span>}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
