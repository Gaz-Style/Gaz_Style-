'use client';

import React, { useState } from 'react';
import { Mountain, ArrowUpRight, RotateCcw } from 'lucide-react';

interface ElevationPoint {
  km: number;
  alt: number;
  label?: string;
}

interface ElevationProfileWidgetProps {
  points?: ElevationPoint[];
  maxAltitude?: string;
  elevationGain?: string;
  distance?: string;
  difficulty?: string;
  routeType?: 'out_and_back' | 'point_to_point';
  stravaUrl?: string;
  gpxTrackUrl?: string;
}

export default function ElevationProfileWidget({
  points,
  maxAltitude = '1.365m',
  elevationGain = '+480m D+',
  distance = '5.2 km',
  difficulty = 'Moderada',
  routeType = 'out_and_back',
}: ElevationProfileWidgetProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Perfil de ascenso puro hacia la cumbre (Opción 1: Base -> Mirador -> Cumbre)
  const defaultAscentPoints: ElevationPoint[] = [
    { km: 0.0, alt: 885, label: 'Portón La Pirámide (Inicio)' },
    { km: 0.7, alt: 990, label: 'Bosque Esclerófilo' },
    { km: 1.3, alt: 1120, label: 'Mirador El Litre' },
    { km: 1.9, alt: 1240, label: 'Filo Sur & Maicillo' },
    { km: 2.6, alt: 1365, label: 'Cumbre Cerro Carbón (1.365m)' },
  ];

  const data = points && points.length > 2 ? points : defaultAscentPoints;
  const minAlt = Math.min(...data.map(p => p.alt));
  const maxAlt = Math.max(...data.map(p => p.alt));
  const totalKm = data[data.length - 1].km || 2.6;

  const width = 640;
  const height = 230;
  const paddingLeft = 50;
  const paddingRight = 70;
  const paddingTop = 45;
  const paddingBottom = 40;

  const getX = (km: number) => paddingLeft + ((km / totalKm) * (width - paddingLeft - paddingRight));
  const getY = (alt: number) => height - paddingBottom - (((alt - minAlt) / (maxAlt - minAlt || 1)) * (height - paddingTop - paddingBottom));

  // Generar path SVG del ascenso
  const pathData = data.reduce((acc, curr, i) => {
    const x = getX(curr.km);
    const y = getY(curr.alt);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaData = `${pathData} L ${getX(totalKm)} ${height - paddingBottom} L ${getX(0)} ${height - paddingBottom} Z`;

  const activePoint = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div 
      className="rounded-3xl p-5 sm:p-6 backdrop-blur-2xl transition-all relative overflow-hidden"
      style={{ 
        backgroundColor: 'rgba(10, 12, 16, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}
    >
      {/* ── CABECERA TÉCNICA ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2.5">
          <Mountain className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold block">
              Cartografía & Altimetría
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight">
              Perfil de Elevación del Ascenso
            </h4>
          </div>
        </div>

        {/* Badge identificador del tipo de sendero */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-mono font-bold w-fit">
          <RotateCcw className="w-3 h-3 text-amber-400" />
          <span>Ida y Vuelta (Mismo Sendero · {distance})</span>
        </div>
      </div>

      {/* ── 4 MÉTRICAS LIMPIAS EN UNA SOLA LÍNEA ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 font-mono text-center">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Distancia Total</p>
          <p className="text-sm sm:text-base font-bold text-white">{distance}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Dificultad</p>
          <p className="text-sm sm:text-base font-bold text-amber-400 capitalize">{difficulty}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Cota Cumbre</p>
          <p className="text-sm sm:text-base font-bold text-white">{maxAltitude}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Desnivel (+D)</p>
          <p className="text-sm sm:text-base font-bold text-white">{elevationGain}</p>
        </div>
      </div>

      {/* ── PANEL INTERACTIVO DE HITOS (ARRIBA DEL GRÁFICO) ── */}
      <div className="min-h-[42px] mb-3 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/8 flex items-center justify-between transition-all">
        {activePoint ? (
          <div className="w-full flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-white font-bold">{activePoint.label || 'Punto de arista'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold">{activePoint.alt} msnm</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80">{activePoint.km} km</span>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center text-[11px] font-mono text-white/40">
            <span>Toca o pasa el cursor por los puntos de la arista para ver cota y descanso</span>
          </div>
        )}
      </div>

      {/* ── GRÁFICO SVG: MALLA VIRTUAL POLIGONAL 3D + LÍNEA DE ASCENSO ── */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          <defs>
            {/* Degradado ámbar para la línea del sendero */}
            <linearGradient id="trailGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
            </linearGradient>

            {/* Degradado de la malla poligonal */}
            <linearGradient id="meshGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.01" />
            </linearGradient>

            {/* Sombra de relieve */}
            <linearGradient id="reliefShadow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* ── 1. MALLA VIRTUAL 3D (LOW-POLY WIREFRAME MOUNTAIN MESH) ── */}
          <g opacity="0.85">
            {/* Cordón secundario de fondo (Precordillera lejana) */}
            <polygon points="20,190 90,140 180,165 240,130 320,180 320,190" fill="url(#reliefShadow)" stroke="#0284c7" strokeWidth="0.6" opacity="0.3" />
            <line x1="90" y1="140" x2="180" y2="165" stroke="#38bdf8" strokeWidth="0.5" opacity="0.3" />
            <line x1="180" y1="165" x2="240" y2="130" stroke="#38bdf8" strokeWidth="0.5" opacity="0.3" />

            {/* Cerro Principal: Facetas poligonales trianguladas (Wireframe) */}
            {/* Ladera izquierda inferior */}
            <polygon points="50,190 140,165 170,190" fill="#0284c7" fillOpacity="0.06" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.3" />
            <polygon points="140,165 220,135 170,190" fill="#0369a1" fillOpacity="0.08" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.35" />
            <polygon points="170,190 220,135 290,190" fill="#0284c7" fillOpacity="0.04" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.25" />

            {/* Ladera media subiendo hacia la cumbre */}
            <polygon points="220,135 340,95 290,190" fill="#0284c7" fillOpacity="0.08" stroke="#38bdf8" strokeWidth="0.9" strokeOpacity="0.4" />
            <polygon points="290,190 340,95 410,190" fill="#0369a1" fillOpacity="0.05" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.3" />
            <polygon points="340,95 450,65 410,190" fill="#38bdf8" fillOpacity="0.09" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.45" />

            {/* Pirámide Cumbrera (Pico de alta cota) */}
            <polygon points="450,65 570,45 410,190" fill="url(#meshGrad)" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.6" />
            <polygon points="570,45 520,190 410,190" fill="#0284c7" fillOpacity="0.07" stroke="#38bdf8" strokeWidth="0.9" strokeOpacity="0.35" />
            <polygon points="570,45 580,190 520,190" fill="#0369a1" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="0.9" strokeOpacity="0.4" />

            {/* Aristas internas de la malla (Líneas de tensión geométrica) */}
            <line x1="140" y1="165" x2="340" y2="95" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.3" />
            <line x1="220" y1="135" x2="450" y2="65" stroke="#38bdf8" strokeWidth="0.7" strokeDasharray="4 2" opacity="0.4" />
            <line x1="340" y1="95" x2="570" y2="45" stroke="#38bdf8" strokeWidth="0.9" strokeOpacity="0.5" />
            <line x1="450" y1="65" x2="520" y2="190" stroke="#38bdf8" strokeWidth="0.6" opacity="0.25" />

            {/* Nodos de vértice de la malla poligonal (Puntos celestes brillantes) */}
            {[
              [140, 165], [220, 135], [340, 95], [450, 65], [170, 190], [290, 190], [410, 190], [520, 190]
            ].map(([nx, ny], i) => (
              <circle key={i} cx={nx} cy={ny} r="2" fill="#38bdf8" opacity="0.6" />
            ))}
          </g>

          {/* Líneas horizontales sutiles de cota */}
          <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="rgba(255,255,255,0.12)" />

          {/* ── 2. TRAZADO DORADO DEL SENDERO REAL (ASCENSO) ── */}
          {/* Sombra de apoyo */}
          <path d={pathData} fill="none" stroke="rgba(0,0,0,0.9)" strokeWidth="6" strokeLinecap="round" />
          
          {/* Línea dorada continua de arista */}
          <path 
            d={pathData} 
            fill="none" 
            stroke="url(#trailGlow)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Hitos interactivos a lo largo de la arista */}
          {data.map((p, idx) => {
            const x = getX(p.km);
            const y = getY(p.alt);
            const isHovered = hoverIndex === idx;
            const isSummit = idx === data.length - 1;

            return (
              <g 
                key={idx} 
                className="cursor-pointer" 
                onMouseEnter={() => setHoverIndex(idx)}
                onTouchStart={() => setHoverIndex(idx)}
              >
                {/* Halo interactivo */}
                <circle cx={x} cy={y} r={isHovered ? '16' : '10'} fill="rgba(245, 158, 11, 0.2)" className="transition-all" />

                {/* Punto exterior */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSummit ? '6' : isHovered ? '5.5' : '4'} 
                  fill={isSummit ? '#f59e0b' : '#fbbf24'} 
                  stroke="#0a0c10" 
                  strokeWidth="2" 
                />

                {/* Banderín en la Cumbre con altitud dinámica */}
                {isSummit && (
                  <g transform={`translate(${x}, ${y - 32})`}>
                    <line x1="0" y1="0" x2="0" y2="32" stroke="#f59e0b" strokeWidth="1.5" />
                    <polygon points="0,0 18,6 0,12" fill="#f59e0b" />
                    <text x="22" y="10" fill="#fff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      CUMBRE ({maxAltitude})
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Eje X inferior dinámico */}
          <text x={paddingLeft} y={height - 18} fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="monospace">
            {data[0]?.km || 0.0} km ({data[0]?.label ? data[0].label.split('(')[0].trim() : 'Base'})
          </text>
          <text x={width - paddingRight - 15} y={height - 18} fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="monospace" textAnchor="end">
            {totalKm} km ({data[data.length - 1]?.label ? (data[data.length - 1]?.label || '').split('(')[0].trim() : 'Cumbre'})
          </text>
        </svg>
      </div>

      {/* ── PIE TÉCNICO EXPLICATIVO DEL RETORNO DINÁMICO ── */}
      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-white/50">
        <span className="flex items-center gap-1.5 text-amber-400/90">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Ascenso: {totalKm} km ({elevationGain})</span>
          {routeType === 'out_and_back' && (
            <>
              <span>•</span>
              <span className="text-white/70">Descenso: {totalKm} km por la misma vía</span>
            </>
          )}
        </span>
        <span className="text-white/40">
          {routeType === 'out_and_back' ? `Total de la Jornada: ${distance} ida y vuelta` : `Travesía Punto a Punto: ${distance}`}
        </span>
      </div>
    </div>
  );
}
