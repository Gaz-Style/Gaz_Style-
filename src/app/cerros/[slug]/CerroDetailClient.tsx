'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Mountain,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Ticket,
  Clock,
  Car,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Droplets,
  Sun,
  Compass,
  Layers,
  Sparkles,
  Award,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { PeakDetail } from '@/lib/atlasService';
import ElevationProfileWidget from '@/components/ElevationProfileWidget';
import Footer from '@/components/Footer';

interface Props {
  peak: PeakDetail;
  weather: any;
  currentLang: string;
}

export default function CerroDetailClient({ peak, weather, currentLang }: Props) {
  const trailLinks = peak.trail_peaks || [];
  const [selectedTrailIndex, setSelectedTrailIndex] = useState(0);

  const activeTrail = trailLinks[selectedTrailIndex]?.trails;
  const activeTrailhead = activeTrail?.trailhead_start;
  const expeditionDates = activeTrail?.expedition_dates || [];

  const summaryText = (peak.summary_i18n && peak.summary_i18n[currentLang]) || peak.summary;
  const historyText = (peak.history_and_cosmovision_i18n && peak.history_and_cosmovision_i18n[currentLang]) || peak.history_and_cosmovision;

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-amber-500/30 pb-16 bg-stone-950">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src={peak.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
          alt={`${peak.name} - Santiago Hiking`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-50 contrast-115"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/70 to-stone-950/95 pointer-events-none" />
      </div>

      <div className="relative z-10">
        <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8 pointer-events-none">
          <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
            <Link 
              href="/cerros" 
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-white/80 hover:text-white transition-all hover:-translate-x-1 py-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Explorador de Cerros</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-lg">
                <Sparkles className="w-3 h-3 text-amber-400" />
                OFICIAL IGM & SANTIAGO HIKING
              </span>

              <Link href="/" className="flex items-center transition-transform duration-200 hover:scale-105 py-1">
                <Image 
                  src="/logotipo blanco.png" 
                  alt="Santiago Hiking" 
                  width={340} 
                  height={80} 
                  className="h-9 sm:h-11 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]" 
                  priority 
                />
              </Link>
            </div>
          </div>
        </header>

        <section className="relative min-h-[64vh] sm:min-h-[70vh] flex flex-col justify-end pt-24">
          <div className="max-w-6xl mx-auto px-6 pb-10 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-stone-900/90 backdrop-blur px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded border border-white/10 inline-block">
                {peak.massif} · {peak.comunas.join(' & ')}
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold rounded">
                {peak.basin}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4 drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
              {peak.name} <span className="text-amber-400">({peak.altitude_msnm}m)</span>
            </h1>

            <p className="text-white/90 text-base md:text-lg font-light max-w-3xl leading-relaxed mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              {summaryText}
            </p>

            {weather && (
              <div 
                className="rounded-2xl p-4 sm:p-5 font-mono max-w-3xl mt-4 shadow-2xl space-y-3"
                style={{
                  backgroundColor: 'rgba(10, 10, 10, 0.78)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 text-xs text-white/90">
                    <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="font-bold tracking-wider">METEOROLOGÍA EN CUMBRE ({peak.altitude_msnm}m)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                    SENSOR VIRTUAL EN VIVO
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-white/50 text-[10px] block">TEMPERATURA</span>
                    <span className="text-lg font-black text-white">{weather.temperature ?? '--'}°C</span>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] block">VIENTO EN FILO</span>
                    <span className="text-lg font-black text-amber-400">{weather.windSpeed ?? '--'} km/h</span>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] block">HUMEDAD</span>
                    <span className="text-lg font-black text-white">{weather.humidity ?? '--'}%</span>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] block">ESTADO</span>
                    <span className="text-xs font-bold text-emerald-300 block truncate">{weather.conditionText ?? 'Despejado'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {trailLinks.length > 1 && (
          <div className="max-w-6xl mx-auto px-6 mb-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-mono text-white/50 shrink-0 uppercase tracking-widest">
                Trazados Disponibles:
              </span>
              {trailLinks.map((tl, idx) => (
                <button
                  key={tl.trails.id}
                  onClick={() => setSelectedTrailIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all shrink-0 ${
                    selectedTrailIndex === idx
                      ? 'bg-amber-500 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                  }`}
                >
                  {tl.trails.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTrail && (
          <section className="max-w-6xl mx-auto px-6 mb-12 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur">
                <span className="text-[10px] font-mono text-white/50 uppercase block">Distancia Total</span>
                <span className="text-xl sm:text-2xl font-black text-white">{activeTrail.distance_km} km</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur">
                <span className="text-[10px] font-mono text-white/50 uppercase block">Desnivel Positivo (D+)</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400">+{activeTrail.elevation_gain_m}m</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur">
                <span className="text-[10px] font-mono text-white/50 uppercase block">Tiempo Estimado</span>
                <span className="text-xl sm:text-2xl font-black text-white">{activeTrail.avg_duration_up_hours}h subida</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur">
                <span className="text-[10px] font-mono text-white/50 uppercase block">Exigencia Física</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">{activeTrail.physical_exertion}</span>
              </div>
            </div>

            {activeTrail.elevation_profile && activeTrail.elevation_profile.length > 0 && (
              <div className="p-6 rounded-3xl bg-black/50 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      Perfil Altimétrico Interactivo & Desnivel
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">
                    Cota Máxima: {activeTrail.max_altitude_m}m
                  </span>
                </div>
                <ElevationProfileWidget 
                  points={activeTrail.elevation_profile} 
                  maxAltitude={`${activeTrail.max_altitude_m}m`} 
                  elevationGain={`+${activeTrail.elevation_gain_m}m D+`} 
                  distance={`${activeTrail.distance_km} km`} 
                  difficulty={(activeTrail.technical_difficulty || 'Moderada').replace(/_/g, " ").replace(/trekker/gi, "").trim()}
                  routeType={(activeTrail as any).route_topology === 'travesia_punto_a_punto' ? 'point_to_point' : 'out_and_back'}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  Hitos & Pasos Clave del Ascenso
                </h3>
                <ul className="space-y-2.5 text-xs font-mono text-white/80">
                  {(activeTrail.crux_highlights || []).map((crux, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <span>{crux}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Equipo Técnico Obligatorio
                </h3>
                <ul className="space-y-2 text-xs font-mono text-white/80">
                  {(activeTrail.required_equipment || []).map((eq, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {activeTrailhead && (
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-white/10 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
                      Punto de Inicio & Estacionamiento
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                      {activeTrailhead.name}
                    </h3>
                    <p className="text-xs text-white/60 font-mono mt-1">
                      {activeTrailhead.address_description} · {activeTrailhead.comuna}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {activeTrailhead.waze_deep_link && (
                      <a
                        href={activeTrailhead.waze_deep_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
                      >
                        <Car className="w-4 h-4" />
                        <span>Abrir en Waze</span>
                      </a>
                    )}
                    {activeTrailhead.google_maps_link && (
                      <a
                        href={activeTrailhead.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Google Maps</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-white/50 text-[10px] block uppercase">Seguridad del Vehículo</span>
                    <p className="text-white/90 mt-0.5">{activeTrailhead.parking_security_tip || 'Estacionamiento sobre calle residencial.'}</p>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] block uppercase">Transporte Público</span>
                    <p className="text-white/90 mt-0.5">{activeTrailhead.public_transit_info || 'Acceso preferente en vehículo particular o taxi.'}</p>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] block uppercase">Horario & Tarifa</span>
                    <p className="text-white/90 mt-0.5">{activeTrailhead.operating_hours} {activeTrailhead.parking_fee_clp > 0 ? `(${activeTrailhead.parking_fee_clp} CLP)` : '(Gratuito)'}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {expeditionDates.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 mb-16">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-stone-900 to-stone-950 border border-amber-500/30 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest mb-2 border border-amber-500/40">
                    <Award className="w-3.5 h-3.5" />
                    Expediciones Oficiales en Cordada
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    Expediciones Programadas · Cupos Vivos
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 font-light mt-1">
                    Grupos reducidos (máximo 8 a 10 personas), ritmo adaptado a la cordada y comunicación satelital SOS.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expeditionDates.map((ed) => (
                  <div
                    key={ed.id}
                    className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between space-y-4 hover:border-amber-400/50 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="text-amber-400 font-bold flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {ed.departure_date}
                        </span>
                        <span className="text-white/50">{ed.departure_time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                        {ed.title_theme}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono font-black text-white block">
                          ${ed.price_clp.toLocaleString('es-CL')} CLP
                        </span>
                        <span className="text-[10px] font-mono text-white/50">
                          {ed.available_slots} cupos disponibles
                        </span>
                      </div>
                      <a
                        href={`https://wa.me/56994157813?text=${encodeURIComponent(`¡Hola! Quiero reservar mi cupo para la salida al ${peak.name} el ${ed.departure_date} (${ed.title_theme}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
                      >
                        Reservar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {historyText && (
          <section className="max-w-6xl mx-auto px-6 mb-16">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block mb-2">
                Patrimonio & Arqueología
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                Historia y Cosmovisión Andina del {peak.name}
              </h3>
              <p className="text-sm text-white/70 font-light leading-relaxed max-w-4xl">
                {historyText}
              </p>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
