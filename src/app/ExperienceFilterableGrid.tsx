'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mountain, Tent } from 'lucide-react';
import SwipeCarousel from './SwipeCarousel';

interface ExperienceFilterableGridProps {
  routes: any[];
}

export default function ExperienceFilterableGrid({ routes }: ExperienceFilterableGridProps) {
  if (!routes || routes.length === 0) {
    return (
      <div
        className="py-16 text-center rounded-2xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)' }}
      >
        <Tent className="w-10 h-10 text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-xs font-mono uppercase tracking-wider">
          Próximamente nuevas fechas disponibles.
        </p>
      </div>
    );
  }

  return (
    <SwipeCarousel peekWidth={32} gap={14}>
      {routes.map((route: any) => (
        <div
          key={route.id}
          className="h-full rounded-2xl overflow-hidden flex flex-col group min-h-[480px] justify-between"
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
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
            <span className="absolute top-4 right-4 bg-stone-900/80 backdrop-blur px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded shadow-sm">
              {route.custom_discipline || route.badge || route.category || 'TREKKING'}
            </span>
          </div>

          <div className="p-6 flex flex-col flex-1 justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
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
              className="btn-arcteryx w-full flex items-center justify-center text-center"
            >
              Ver Detalles
            </Link>
          </div>
        </div>
      ))}
    </SwipeCarousel>
  );
}
