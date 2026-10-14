'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mountain, Tent, Sparkles, Compass, ShieldAlert, Users } from 'lucide-react';
import SwipeCarousel from './SwipeCarousel';

interface ExperienceFilterableGridProps {
  routes: any[];
}

type CategoryTab = 'all' | 'grupales' | 'desafios' | 'expedition_pass' | 'high_mountain';

export default function ExperienceFilterableGrid({ routes }: ExperienceFilterableGridProps) {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');

  // Clasificador inteligente de categorías
  const getRouteCategory = (r: any): 'grupales' | 'desafios' | 'expedition_pass' | 'high_mountain' => {
    const cat = (r.category || '').toLowerCase();
    const vt = (r.vertical_type || '').toLowerCase();
    const title = (r.title || '').toLowerCase();

    if (cat === 'high_mountain' || title.includes('5.424m') || title.includes('4.954m') || title.includes('5.856m') || title.includes('el plomo') || title.includes('leonera') || title.includes('san josé')) {
      return 'high_mountain';
    }
    if (cat === 'expedition_pass' || title.includes('expedition pass') || title.includes('vip')) {
      return 'expedition_pass';
    }
    if (cat === 'desafios' || cat.includes('desafío') || vt === 'challenges' || title.includes('provincia') || title.includes('triple corona') || title.includes('san ramón') || title.includes('la cruz')) {
      return 'desafios';
    }
    return 'grupales';
  };

  const filteredRoutes = useMemo(() => {
    if (!routes || routes.length === 0) return [];
    if (activeTab === 'all') return routes;
    return routes.filter((r) => getRouteCategory(r) === activeTab);
  }, [routes, activeTab]);

  const counts = useMemo(() => {
    const res = { all: routes.length, grupales: 0, desafios: 0, expedition_pass: 0, high_mountain: 0 };
    routes.forEach((r) => {
      const c = getRouteCategory(r);
      res[c] = (res[c] || 0) + 1;
    });
    return res;
  }, [routes]);

  const tabs: { id: CategoryTab; label: string; icon: any }[] = [
    { id: 'all', label: 'Todas', icon: Compass },
    { id: 'grupales', label: 'Salidas Grupales', icon: Users },
    { id: 'desafios', label: 'Travesías & Desafíos', icon: Mountain },
    { id: 'expedition_pass', label: 'Expedition Pass', icon: Sparkles },
    { id: 'high_mountain', label: 'High Mountain', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">
      {/* ── BARRA DE PESTAÑAS GLASSMORPHISM ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] || 0;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_2px_12px_rgba(251,191,36,0.3)]'
                  : 'text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
              style={{
                backgroundColor: isActive ? undefined : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-stone-950/20 text-stone-950 font-black' : 'bg-white/10 text-white/50'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── LISTADO / CARRUSEL DE RUTAS FILTRADAS ── */}
      {filteredRoutes.length === 0 ? (
        <div
          className="py-16 text-center rounded-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)' }}
        >
          <Tent className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-xs font-mono uppercase tracking-wider">
            Próximamente nuevas fechas disponibles en esta categoría.
          </p>
        </div>
      ) : (
        <SwipeCarousel peekWidth={32} gap={14}>
          {filteredRoutes.map((route: any) => {
            const formattedClp = Number(route.base_price).toLocaleString('es-CL');
            const priceLabel = route.price_usd
              ? `${route.price_usd} · $${formattedClp} CLP`
              : `$${formattedClp} CLP`;

            return (
              <div
                key={route.id}
                className="h-full rounded-2xl overflow-hidden flex flex-col group min-h-[500px] justify-between"
                style={{
                  backgroundColor: 'rgba(10, 10, 10, 0.16)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-stone-900 shrink-0">
                  {route.image_url ? (
                    <Image
                      src={route.image_url}
                      alt={route.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 70vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <Mountain className="w-16 h-16 text-stone-300 m-auto" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <span className="absolute top-4 right-4 bg-stone-900/85 backdrop-blur px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded shadow-sm border border-white/10">
                    {route.badge || route.custom_discipline || route.category || 'TREKKING'}
                  </span>
                  {/* Badge de Precio Flotante */}
                  <div className="absolute bottom-3 left-4 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono font-bold text-amber-300 border border-amber-400/30">
                    {priceLabel}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-2 line-clamp-2">
                      {route.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-4 font-light line-clamp-2">
                      {route.description || 'Guiado premium paso a paso en la cordillera.'}
                    </p>

                    <div
                      className="grid grid-cols-3 gap-2 py-3 text-center font-mono rounded-lg"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-medium">Duración</p>
                        <p className="text-xs font-bold text-white">
                          {route.duration_text || (route.duration_days ? `${route.duration_days}d` : '3 - 5')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-medium">Dificultad</p>
                        <p className="text-xs font-bold text-amber-400">
                          {route.difficulty_level || 'Media'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-medium">Altura</p>
                        <p className="text-xs font-bold text-white">
                          {route.max_altitude
                            ? (String(route.max_altitude).toLowerCase().includes('m') ? route.max_altitude : `${route.max_altitude} m`)
                            : (route.difficulty_level === 'Alta' ? '2.100 m' : '1.638 m')}
                        </p>
                      </div>
                    </div>
                  </div>

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
      )}
    </div>
  );
}

