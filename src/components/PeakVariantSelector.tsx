'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Car, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  Droplets, 
  Sun, 
  CheckCircle, 
  Download, 
  MessageCircle, 
  Camera, 
  Compass, 
  ExternalLink,
  Users,
  Footprints
} from 'lucide-react';
import { Peak, PeakTrailhead, PeakRoute } from '@/data/peaksDirectory';
import ElevationProfileWidget from './ElevationProfileWidget';
import GpxLeadModal from './GpxLeadModal';

interface PeakVariantSelectorProps {
  peak: Peak;
}

export default function PeakVariantSelector({ peak }: PeakVariantSelectorProps) {
  const [selectedThIndex, setSelectedThIndex] = useState(0);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isGpxModalOpen, setIsGpxModalOpen] = useState(false);

  const currentTrailhead: PeakTrailhead = peak.trailheads[selectedThIndex] || peak.trailheads[0];
  const currentRoute: PeakRoute = currentTrailhead?.routes[selectedRouteIndex] || currentTrailhead?.routes[0];

  const difficultyLabels: Record<string, { label: string; color: string; bg: string }> = {
    facil_familiar: { label: 'Iniciación / Familiar', color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' },
    moderada: { label: 'Moderada / Excursionista', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
    exigente: { label: 'Exigente / Fuerte Pendiente', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
    alta_montana: { label: 'Alta Montaña / Expedición', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' }
  };

  const currentDiff = difficultyLabels[currentRoute.technical_difficulty] || difficultyLabels.moderada;

  const waMessage = encodeURIComponent(
    `¡Hola Gaz! ⚡ Estuve viendo la ruta a ${peak.name} por ${currentTrailhead.name} (${currentRoute.variant_name}) en santiagohiking.com y me gustaría saber cuándo tienen salidas programadas o si se puede coordinar guiado privado.`
  );

  return (
    <div className="w-full space-y-6">
      {/* 1. SELECTOR DE ACCESOS / PUNTOS DE INICIO (TRAILHEADS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/60 font-bold">
              Selecciona el Punto de Partida / Acceso ({peak.trailheads.length} disponibles)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {peak.trailheads.map((th, index) => {
            const isSelected = index === selectedThIndex;
            return (
              <button
                key={th.id}
                onClick={() => {
                  setSelectedThIndex(index);
                  setSelectedRouteIndex(0);
                }}
                style={{ backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: isSelected ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.10)' }} className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected ? 'border-amber-400/60 shadow-lg shadow-amber-500/15' : 'hover:border-white/25'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold mb-1">
                    <Car className="w-3 h-3" />
                    <span>Acceso #{index + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {th.name}
                  </h4>
                  <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                    {th.address_description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-white/60">
                    {th.entry_fee_required ? `$${th.entry_fee_clp} CLP` : 'Acceso Libre'}
                  </span>
                  <span className="text-amber-400/80 font-medium">
                    {th.routes.length} {th.routes.length === 1 ? 'variante' : 'variantes'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SI EL ACCESO TIENE MÁS DE UNA VARIANTE, MOSTRAR TABS DE VARIANTES */}
      {currentTrailhead.routes.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider shrink-0">
            Variantes desde este acceso:
          </span>
          {currentTrailhead.routes.map((r, rIdx) => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteIndex(rIdx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors shrink-0 ${
                rIdx === selectedRouteIndex
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {r.variant_name}
            </button>
          ))}
        </div>
      )}

      {/* 3. PANEL TÉCNICO COMPLETO DE LA VARIANTE SELECCIONADA */}
      <div 
        className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl border transition-all"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.10)'
        }}
      >
        {/* Cabecera de la variante */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span 
                className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-bold"
                style={{ backgroundColor: currentDiff.bg, color: currentDiff.color }}
              >
                {currentDiff.label}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 text-white/70 border border-white/10">
                Esfuerzo: {currentRoute.physical_exertion}
              </span>
              {currentRoute.best_time_of_day && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                  <Sun className="w-3 h-3" /> {currentRoute.best_time_of_day}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentRoute.variant_name}
            </h2>
            <p className="text-xs font-mono text-white/50 mt-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Iniciando en: <span className="text-white font-medium">{currentTrailhead.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGpxModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-medium border border-white/10 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Bajar Track GPX</span>
            </button>
            <a
              href={currentTrailhead.google_maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-medium border border-white/10 transition-colors flex items-center gap-2"
            >
              <Car className="w-4 h-4 text-sky-400" />
              <span>Cómo llegar (GPS)</span>
              <ExternalLink className="w-3 h-3 text-white/40" />
            </a>
          </div>
        </div>

        {/* 4 Métricas Clave en Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
              Distancia Total
            </span>
            <p className="text-2xl font-black font-mono text-white">
              {currentRoute.distance_km} <span className="text-sm font-normal text-white/50">km</span>
            </p>
            <span className="text-[10px] font-mono text-white/40">Ida y vuelta</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
              Desnivel Acumulado
            </span>
            <p className="text-2xl font-black font-mono text-amber-400">
              +{currentRoute.elevation_gain_m} <span className="text-sm font-normal text-white/50">m</span>
            </p>
            <span className="text-[10px] font-mono text-white/40">D+ positivo</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
              Tiempo Subida
            </span>
            <p className="text-2xl font-black font-mono text-white">
              {currentRoute.avg_duration_up_hours} <span className="text-sm font-normal text-white/50">hrs</span>
            </p>
            <span className="text-[10px] font-mono text-white/40">A ritmo amable</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
              Tiempo Bajada
            </span>
            <p className="text-2xl font-black font-mono text-white">
              {currentRoute.avg_duration_down_hours} <span className="text-sm font-normal text-white/50">hrs</span>
            </p>
            <span className="text-[10px] font-mono text-white/40">Descenso</span>
          </div>
        </div>

        {/* Descripción e itinerario de la variante */}
        <div className="mb-6">
          <h4 className="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold mb-2">
            Descripción de la Ruta
          </h4>
          <p className="text-sm text-white/80 leading-relaxed">
            {currentRoute.description}
          </p>
        </div>

        {/* Gráfico de perfil altimétrico interactivo */}
        <div className="mb-6">
          <ElevationProfileWidget
            points={currentRoute.elevation_profile}
            maxAltitude={`${peak.altitude_msnm}m`}
            elevationGain={`+${currentRoute.elevation_gain_m}m D+`}
            distance={`${currentRoute.distance_km} km`}
          />
        </div>

        {/* Dos Columnas: Logística de Acceso & Equipo Requerido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Tarjeta de Logística y Estacionamiento */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Logística y Estacionamiento
              </h4>
            </div>

            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono">•</span>
                <span><strong>Estacionamiento:</strong> {currentTrailhead.parking_security_tip}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono">•</span>
                <span><strong>Transporte público:</strong> {currentTrailhead.public_transit_info}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono">•</span>
                <span><strong>Horarios:</strong> {currentTrailhead.operating_hours}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono">•</span>
                <span><strong>Entrada:</strong> {currentTrailhead.entry_fee_required ? `$${currentTrailhead.entry_fee_clp} CLP por persona` : 'Entrada libre y gratuita'}</span>
              </li>
            </ul>
          </div>

          {/* Tarjeta de Equipo Obligatorio & Recomendado */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Equipo & Seguridad en Ruta
              </h4>
            </div>

            <ul className="space-y-2 text-xs text-white/70">
              {currentRoute.required_equipment.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
              <li className="flex items-start gap-2 text-amber-300/90 pt-1">
                <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Agua:</strong> {currentRoute.water_available ? 'Hay vertientes en la ruta' : 'No hay fuentes de agua, cargar todo desde abajo'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 🎯 TARJETA DE CONVERSIÓN COMERCIAL SANTIAGO HIKING */}
        <div 
          className="rounded-2xl p-6 sm:p-7 relative overflow-hidden border"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(18, 22, 26, 0.95) 100%)',
            borderColor: 'rgba(245, 158, 11, 0.35)'
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span>Salidas Guiadas Oficiales Santiago Hiking</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ¿Prefieres subir acompañado y con fotos pro?
              </h3>
              <p className="text-xs text-white/70 max-w-xl mt-1 leading-relaxed">
                Subimos esta ruta al atardecer en grupos reducidos. Incluye liderazgo de montaña, linternas frontales profesionales, botiquín de expedición y registro fotográfico en la cumbre.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/reservar"
                className="py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs font-mono tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 text-center active:scale-[0.98]"
              >
                Reservar Cupo (${currentRoute.commercial_price_clp.toLocaleString('es-CL')} CLP)
              </Link>

              <a
                href={`https://wa.me/56984021940?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para descargar GPX */}
      <GpxLeadModal
        isOpen={isGpxModalOpen}
        onClose={() => setIsGpxModalOpen(false)}
        peakName={peak.name}
        routeName={currentRoute.variant_name}
        distanceKm={currentRoute.distance_km}
      />
    </div>
  );
}
