'use client';

import React, { useState } from 'react';
import { Mountain, ExternalLink, Download, Activity } from 'lucide-react';

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
  stravaUrl?: string;
  gpxTrackUrl?: string;
}

export default function ElevationProfileWidget({
  points,
  maxAltitude = '1.638m',
  elevationGain = '+420m D+',
  distance = '4.2 km',
  stravaUrl,
  gpxTrackUrl,
}: ElevationProfileWidgetProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Perfil por defecto si no hay array de puntos (curva de montaña realista)
  const defaultPoints: ElevationPoint[] = [
    { km: 0.0, alt: 1020, label: 'Inicio Sendero' },
    { km: 0.8, alt: 1180, label: 'Bosque Esclerófilo' },
    { km: 1.5, alt: 1350, label: 'Mirador Intermedio' },
    { km: 2.1, alt: 1638, label: 'Cumbre & Cruz' },
    { km: 2.8, alt: 1420 },
    { km: 3.5, alt: 1210 },
    { km: 4.2, alt: 1020, label: 'Punto de Encuentro' },
  ];

  const data = points && points.length > 2 ? points : defaultPoints;
  const minAlt = Math.min(...data.map(p => p.alt));
  const maxAlt = Math.max(...data.map(p => p.alt));
  const totalKm = data[data.length - 1].km || 4.2;

  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const getX = (km: number) => paddingX + ((km / totalKm) * (width - 2 * paddingX));
  const getY = (alt: number) => height - paddingY - (((alt - minAlt) / (maxAlt - minAlt || 1)) * (height - 2 * paddingY));

  // Generar path SVG
  const pathData = data.reduce((acc, curr, i) => {
    const x = getX(curr.km);
    const y = getY(curr.alt);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaData = `${pathData} L ${getX(totalKm)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

  const activePoint = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div 
      className="rounded-2xl p-6 backdrop-blur-xl transition-all"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.10)' 
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/8 gap-3">
        <div className="flex items-center gap-2.5">
          <Mountain className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold block">
              Cartografía & Altimetría
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight">
              Perfil de Elevación del Recorrido
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {stravaUrl && (
            <a
              href={stravaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider text-[#FC4C02] bg-[#FC4C02]/10 border border-[#FC4C02]/30 hover:bg-[#FC4C02]/20 transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>STRAVA</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          )}

          {gpxTrackUrl && (
            <a
              href={gpxTrackUrl}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider text-white/80 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>TRACK GPX</span>
            </a>
          )}
        </div>
      </div>

      {/* Métricas rápidas sobre el gráfico */}
      <div className="grid grid-cols-3 gap-3 mb-4 font-mono text-center">
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-white/40 uppercase">Cota Cumbre</p>
          <p className="text-xs sm:text-sm font-bold text-amber-400">{maxAltitude}</p>
        </div>
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-white/40 uppercase">Desnivel</p>
          <p className="text-xs sm:text-sm font-bold text-white">{elevationGain}</p>
        </div>
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-white/40 uppercase">Distancia</p>
          <p className="text-xs sm:text-sm font-bold text-white">{distance}</p>
        </div>
      </div>

      {/* Gráfico SVG Interactivo */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          <defs>
            <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Líneas de referencia horizontal */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="rgba(255,255,255,0.12)" />

          {/* Área sombreada bajo la curva */}
          <path d={areaData} fill="url(#elevationGrad)" />

          {/* Línea del perfil */}
          <path d={pathData} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Puntos y etiquetas de hitos */}
          {data.map((p, idx) => {
            const x = getX(p.km);
            const y = getY(p.alt);
            const isHovered = hoverIndex === idx;

            return (
              <g 
                key={idx} 
                className="cursor-pointer" 
                onMouseEnter={() => setHoverIndex(idx)}
                onTouchStart={() => setHoverIndex(idx)}
              >
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isHovered ? 6 : (p.label ? 4 : 2)} 
                  fill={isHovered ? '#ffffff' : (p.label ? '#fbbf24' : '#d97706')} 
                  stroke="#0c0a09" 
                  strokeWidth="2" 
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip flotante con datos al pasar el cursor */}
        {activePoint && (
          <div 
            className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-stone-900 border border-amber-500/40 text-xs font-mono shadow-xl text-center pointer-events-none transition-all"
          >
            <span className="text-amber-400 font-bold">{activePoint.alt} msnm</span>
            <span className="text-white/40 mx-1.5">·</span>
            <span className="text-white/80">{activePoint.km} km</span>
            {activePoint.label && (
              <span className="block text-[10px] text-white/60 font-sans mt-0.5">{activePoint.label}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-white/35 pt-2 border-t border-white/5">
        <span>0.0 km</span>
        <span>Pasa el cursor o toca los puntos para ver altitud en ruta</span>
        <span>{totalKm} km</span>
      </div>
    </div>
  );
}
