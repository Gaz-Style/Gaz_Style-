'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, Compass, Users, Mountain, ShieldAlert, Sparkles, 
  ChevronRight, ArrowUpRight, Search, MapPin, Clock, Flame
} from 'lucide-react';

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
}

export default function AllAdventuresModal({ isOpen, onClose, routes }: AllAdventuresModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'grupales' | 'travesias' | 'high_mountain' | 'boutique'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquear scroll de fondo cuando el modal está abierto
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

  // Clasificador idéntico a la web
  const categorize = (r: RouteItem): 'grupales' | 'travesias' | 'high_mountain' | 'boutique' => {
    const v = (r.vertical_type || '').toLowerCase();
    const c = (r.category || '').toLowerCase();
    const t = (r.title || '').toLowerCase();

    // 1. High Mountain
    if (v === 'high_mountain' || c === 'high_mountain' || t.includes('plomo') || t.includes('leonera') || t.includes('san josé') || t.includes('san jose')) {
      return 'high_mountain';
    }
    // 2. Expedition Boutique (VIP)
    if (v === 'expedition_pass' || c === 'expedition_pass' || t.includes('vip') || t.includes('expedition pass')) {
      return 'boutique';
    }
    // 3. Travesías & Desafíos
    if (v === 'travesias_desafios' || v === 'challenges' || c === 'travesias_desafios' || c === 'desafios' || t.includes('provincia') || t.includes('corona') || t.includes('san ramón') || t.includes('la cruz') || t.includes('carpa')) {
      return 'travesias';
    }
    // 4. Salidas Grupales
    return 'grupales';
  };

  // Secciones oficiales ordenadas exactamente como en la home
  const SECTIONS = [
    {
      key: 'grupales' as const,
      name: 'Salidas Grupales',
      badge: 'COMUNIDAD & ATARDECERES',
      desc: 'Ascensos de media jornada y atardeceres sobre Santiago en grupos reducidos con guías certificados WFR.',
      color: 'amber',
      icon: Users,
    },
    {
      key: 'travesias' as const,
      name: 'Travesías & Desafíos',
      badge: 'ENDURANCE FULL DAY',
      desc: 'Retos de resistencia física y mental en la cuenca central con +1.500m de desnivel vertical y filos andinos.',
      color: 'stone',
      icon: Mountain,
    },
    {
      key: 'high_mountain' as const,
      name: 'Expedition High Mountain',
      badge: 'GRANDES CUMBRES 5.000M+',
      desc: 'Expediciones técnicas de altura en los Andes (El Plomo, Leonera, San José) con porteo, arrieros y monitoreo satelital.',
      color: 'slate',
      icon: ShieldAlert,
    },
    {
      key: 'boutique' as const,
      name: 'Expedition Boutique',
      badge: '100% PRIVADO & TAILOR-MADE',
      desc: 'Experiencias privadas a tu propio ritmo con transporte ejecutivo hotel a hotel, catering gourmet y video Reel 4K profesional.',
      color: 'gold',
      icon: Sparkles,
    },
  ];

  // Agrupar rutas
  const groupedRoutes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const result: Record<'grupales' | 'travesias' | 'high_mountain' | 'boutique', RouteItem[]> = {
      grupales: [],
      travesias: [],
      high_mountain: [],
      boutique: [],
    };

    routes.forEach((r) => {
      const matchSearch = !q || (r.title || '').toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q);
      if (!matchSearch) return;

      const cat = categorize(r);
      result[cat].push(r);
    });

    return result;
  }, [routes, searchQuery]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Velo Cinematográfico con blur profundo */}
      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md pointer-events-none" />

      {/* Contenedor Principal: Hoja Editorial de Cristal */}
      <div 
        className="relative z-10 w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-[0_25px_90px_rgba(0,0,0,0.9)] border border-white/12"
        style={{
          backgroundColor: 'rgba(18, 18, 20, 0.94)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Catálogo */}
        <div className="p-5 sm:p-7 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white/50 font-mono text-[10px] tracking-[0.3em] uppercase">
                Catálogo Maestro · Santiago Hiking
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Todas las Aventuras
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Buscador Rápido */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cerro o ruta..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-3.5 py-2 text-xs text-white placeholder-white/35 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Cerrar catálogo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de Filtros de Categoría */}
        <div className="px-5 sm:px-7 py-3 border-b border-white/5 bg-black/20 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-white/60 hover:text-white bg-white/5 border border-white/5'
            }`}
          >
            Todas ({routes.length})
          </button>
          {SECTIONS.map((sec) => {
            const count = groupedRoutes[sec.key].length;
            const isActive = activeCategory === sec.key;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => setActiveCategory(sec.key)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-400 text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white bg-white/5 border border-white/5'
                }`}
              >
                <span>{sec.name}</span>
                <span className={`text-[10px] ${isActive ? 'text-black/70' : 'text-white/40'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Lista con Scroll: Categorías y Cerros en Lista con Reseña Corta */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-8 divide-y divide-white/5 overscroll-contain">
          {SECTIONS.map((sec) => {
            if (activeCategory !== 'all' && activeCategory !== sec.key) return null;
            const items = groupedRoutes[sec.key];
            if (items.length === 0) return null;

            return (
              <div key={sec.key} className="pt-6 first:pt-0">
                {/* Cabecera de Categoría */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <sec.icon className={`w-3.5 h-3.5 ${
                      sec.key === 'boutique'
                        ? 'text-[#D4AF37]'
                        : sec.key === 'high_mountain'
                        ? 'text-slate-300'
                        : sec.key === 'travesias'
                        ? 'text-stone-300'
                        : 'text-amber-400'
                    }`} />
                    <span className="text-white/45 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase">
                      {sec.badge}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                      {sec.name}
                    </h3>
                    <p className="text-xs text-white/50 font-light max-w-md">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                {/* Lista de Aventuras / Cerros */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {items.map((route) => {
                    const cleanTitle = (route.title || '').split('·')[0].trim();
                    const targetUrl = `/rutas/${route.id}`;
                    const formattedClp = route.base_price ? Number(route.base_price).toLocaleString('es-CL') : null;
                    const usdPrice = route.price_usd || (route.base_price ? `US$${Math.round(route.base_price / 975)}` : null);

                    const duration = route.duration_text || (route.duration_days ? `${route.duration_days} días` : '3 - 5h');
                    const altitude = route.max_altitude ? (String(route.max_altitude).includes('m') ? route.max_altitude : `${route.max_altitude}m`) : null;

                    // Bordes sutiles según la colección
                    const borderHover = sec.key === 'boutique'
                      ? 'hover:border-[#D4AF37]/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.18)]'
                      : sec.key === 'high_mountain'
                      ? 'hover:border-slate-300/60 hover:shadow-[0_0_20px_rgba(226,232,240,0.20)]'
                      : sec.key === 'travesias'
                      ? 'hover:border-stone-500/60'
                      : 'hover:border-amber-400/50';

                    return (
                      <Link
                        key={route.id}
                        href={targetUrl}
                        onClick={onClose}
                        className={`group relative p-3 sm:p-3.5 rounded-2xl flex items-start gap-3.5 bg-white/[0.03] border border-white/8 transition-all duration-300 hover:bg-white/[0.07] ${borderHover}`}
                      >
                        {/* Miniatura Cuadrada de la Fotografía */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-white/10">
                          <Image
                            src={route.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'}
                            alt={cleanTitle}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Detalles & Reseña Corta */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors truncate">
                                {cleanTitle}
                              </h4>
                              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                            </div>

                            {/* Reseña Corta */}
                            <p className="text-[11px] sm:text-xs text-white/60 font-light leading-relaxed line-clamp-2 mb-2">
                              {route.description || 'Ascenso guiado en la Cordillera de los Andes con Santiago Hiking.'}
                            </p>
                          </div>

                          {/* Píldoras / Ficha técnica ultra compacta */}
                          <div className="flex items-center gap-2 text-[10px] font-mono text-white/45">
                            {duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 text-white/40" />
                                {duration}
                              </span>
                            )}
                            {altitude && (
                              <span>· {altitude}</span>
                            )}
                            {formattedClp && (
                              <span className="ml-auto font-bold text-white/80">
                                {sec.key === 'high_mountain' && usdPrice ? usdPrice : `$${formattedClp}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Estado Vacío */}
          {Object.values(groupedRoutes).every((list) => list.length === 0) && (
            <div className="py-16 text-center">
              <Compass className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/60 font-light">
                No encontramos rutas que coincidan con &ldquo;{searchQuery}&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] font-mono text-white/40 shrink-0">
          <span>{routes.length} expediciones catalogadas en los Andes</span>
          <span className="text-amber-400 font-semibold cursor-pointer" onClick={onClose}>
            Cerrar [ESC]
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
