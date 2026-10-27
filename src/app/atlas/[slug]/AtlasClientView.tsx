'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mountain, MapPin, ArrowLeft, Clock, ShieldCheck, 
  Sparkles, Sun, Car, Download, Calendar, MessageCircle, 
  Droplets, AlertTriangle, CheckCircle2, ChevronRight,
  TrendingUp, Users, HeartPulse
} from 'lucide-react';

import ElevationProfileWidget from '@/components/ElevationProfileWidget';
import GpxLeadModal from '@/components/GpxLeadModal';
import MountainWeatherWidget from '@/components/MountainWeatherWidget';
import { AtlasEntity, AtlasRouteVariant, AtlasWaypoint } from '@/data/atlasDirectory';
import { MountainWeather } from '@/lib/weather';

interface AtlasClientViewProps {
  entity: AtlasEntity;
  otherEntities: AtlasEntity[];
  initialWeather: MountainWeather;
}

export default function AtlasClientView({
  entity,
  otherEntities,
  initialWeather
}: AtlasClientViewProps) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedTrailheadIdx, setSelectedTrailheadIdx] = useState(0);
  const [isGpxModalOpen, setIsGpxModalOpen] = useState(false);

  const currentVariant = entity.variants[selectedVariantIdx] || entity.variants[0];
  const currentTrailhead = entity.trailheads[selectedTrailheadIdx] || entity.trailheads[0];

  const waMessage = encodeURIComponent(
    `¡Hola Gaz! Estuve revisando el Atlas Andino para ${entity.name} (${currentVariant.name}) en santiagohiking.com y me gustaría consultar disponibilidad para una salida guiada.`
  );

  return (
    <>
      <main className="pt-24 pb-20">
        
        {/* ── BREADCRUMB & REGRESO ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
          <Link
            href="/atlas"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Atlas de Cumbres</span>
          </Link>
        </div>

        {/* ── HERO TOPOGRÁFICO DE LA CUMBRE / TRAVESÍA ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div 
            className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10"
            style={{ backgroundColor: 'rgba(10, 10, 10, 0.75)' }}
          >
            {/* Foto de Portada con Tinte */}
            <Image
              src={entity.cover_image_url}
              alt={entity.name}
              fill
              priority
              sizes="100vw"
              className="object-cover -z-10 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-transparent -z-10" />

            <div className="max-w-4xl">
              {/* Badges de Datos Reales */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="px-3.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" />
                  <span>{entity.altitude_msnm.toLocaleString('es-CL')} msnm</span>
                </span>

                <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/85 font-mono text-xs">
                  {entity.massif}
                </span>

                <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/70 font-mono text-xs">
                  {entity.entity_type === 'travesia' ? 'Travesía de Arista' : 'Cumbre Directa'}
                </span>
              </div>

              {/* Título H1 */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-none mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                {entity.name}
              </h1>

              {/* Resumen Paisajístico */}
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-light mb-6 max-w-3xl drop-shadow">
                {entity.summary}
              </p>

              {/* Métricas Clave de la Variante Actual */}
              <div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 px-4 text-center font-mono rounded-2xl max-w-2xl"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-medium">Distancia Total</p>
                  <p className="text-xs sm:text-sm font-bold text-white">{currentVariant.distance_km} km</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-medium">Desnivel (+D)</p>
                  <p className="text-xs sm:text-sm font-bold text-amber-400">+{currentVariant.elevation_gain_m} m</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-medium">Tiempo Subida</p>
                  <p className="text-xs sm:text-sm font-bold text-white">{currentVariant.avg_duration_up_hours} hrs</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-medium">Dificultad</p>
                  <p className="text-xs sm:text-sm font-bold text-emerald-400 capitalize">
                    {currentVariant.technical_difficulty.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MÓDULO CARTOGRÁFICO 3D CON VARIANTES ILUMINADAS ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block mb-1">
                Cartografía & Reconocimiento Visual de Arista
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Centro de Reconocimiento Fotográfico, Satelital & Metraje en Terreno
              </h2>
            </div>

            {/* Botón Descarga GPX (Lead Magnet) */}
            <button
              onClick={() => setIsGpxModalOpen(true)}
              className="btn-arcteryx-primary !py-2.5 !px-5 text-xs font-mono font-bold tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              <Download className="w-4 h-4" />
              <span>BAJAR TRACK GPX OFICIAL</span>
            </button>
          </div>



          {/* ── GALERÍA FOTOGRÁFICA EDITORIAL DE ALTA MONTAÑA ── */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative rounded-2xl overflow-hidden h-64 border border-white/10 group shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                alt="El Filo de la Muerte arista expuesta"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  CRUX SUPREMO · 3.120M
                </span>
                <h4 className="text-sm font-bold text-white uppercase">El Filo de la Muerte</h4>
                <p className="text-[11px] text-white/70 font-light mt-0.5">Caídas verticales de más de 800m hacia ambos flancos cordilleranos.</p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-64 border border-white/10 group shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
                alt="Cerro Provincia Refugio Domo"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  HITO #1 · 2.750M
                </span>
                <h4 className="text-sm font-bold text-white uppercase">Cumbre Cerro Provincia & Refugio</h4>
                <p className="text-[11px] text-white/70 font-light mt-0.5">El domo geodésico de madera sobre el valle iluminado de Santiago.</p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-64 border border-white/10 group shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
                alt="Cumbre Cerro San Ramón 3253m"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  HITO #3 · 3.253M
                </span>
                <h4 className="text-sm font-bold text-white uppercase">Cumbre Cerro San Ramón</h4>
                <p className="text-[11px] text-white/70 font-light mt-0.5">El techo absoluto del cordón con vistas a Tupungato y El Plomo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SELECTOR DE ACCESOS / TRAILHEADS DE Oficial ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-white font-bold">
              Puntos de Acceso Urbano & Estacionamientos ({entity.trailheads.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {entity.trailheads.map((th, idx) => {
              const isSelected = idx === selectedTrailheadIdx;
              return (
                <div
                  key={th.id}
                  onClick={() => setSelectedTrailheadIdx(idx)}
                  className="p-5 rounded-2xl cursor-pointer transition-all border"
                  style={{
                    backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    borderColor: isSelected ? 'rgba(245, 158, 11, 0.45)' : 'rgba(255, 255, 255, 0.10)',
                    boxShadow: isSelected ? '0 10px 30px rgba(245, 158, 11, 0.15)' : 'none'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-400">
                      Acceso #{idx + 1} · {th.comuna}
                    </span>
                    <a
                      href={th.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Abrir Waze/Maps</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{th.name}</h4>
                  <p className="text-xs text-white/60 mb-3 leading-relaxed">{th.address_description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-white/50 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-white/30 block">Estacionamiento:</span>
                      <span className="text-white/80">{th.parking_security_tip}</span>
                    </div>
                    <div>
                      <span className="text-white/30 block">Transporte Público:</span>
                      <span className="text-white/80">{th.public_transit_info}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PERFIL ALTIMÉTRICO DINÁMICO & SECRETOS DE RUTA ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda (2/3): Altimetría Interactiva */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block mb-1">
                    Cotas de Altitud
                  </span>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    Perfil Altimétrico: {currentVariant.name}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 text-amber-300 border border-amber-500/30">
                  +{currentVariant.elevation_gain_m}m D+
                </span>
              </div>

              {/* Widget SVG de Altimetría */}
              <ElevationProfileWidget
                points={currentVariant.elevation_profile}
                maxAltitude={`${currentVariant.max_altitude_m}m`}
                elevationGain={`+${currentVariant.elevation_gain_m}m D+`}
                distance={`${currentVariant.distance_km} km`}
                difficulty={(currentVariant.technical_difficulty || 'Moderada').replace(/_/g, " ").replace(/trekker/gi, "").trim()}
                routeType={currentVariant.trail_type === 'travesia_cordon' ? 'point_to_point' : 'out_and_back'}
              />
            </div>

            {/* Secretos de Ruta & Alertas Técnicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase">
                  <Droplets className="w-4 h-4" />
                  <span>Fuentes de Agua</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  {currentVariant.water_sources_detail}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Vías de Escape & Terreno</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  {currentVariant.escape_routes_info}
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha (1/3): Clima Andino en Vivo */}
          <div className="space-y-6">
            <MountainWeatherWidget
              weather={initialWeather}
              locationName={entity.name}
              elevationText={`${entity.altitude_msnm}m`}
            />

            {/* Caja de Historia y Geología */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
              <span className="text-amber-400 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block">
                Patrimonio & Geología
              </span>
              <h4 className="text-sm font-bold text-white uppercase">Historia del Macizo</h4>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                {entity.history_and_cosmovision}
              </p>
              <p className="text-xs text-white/60 font-light leading-relaxed pt-2 border-t border-white/10">
                {entity.geology_and_nature}
              </p>
            </div>
          </div>
        </div>

        {/* ── CIERRE DE ORO COMERCIAL (EL FORMATO DE DESAFIO-5AM) ── */}
        {currentVariant.commercial_experience && (
          <section className="pt-16 pb-12 border-t border-white/10 bg-gradient-to-b from-stone-950 via-stone-900/40 to-stone-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Header Comercial */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 pb-8 border-b border-white/10">
                <div>
                  <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold mb-1 block">
                    Expediciones Guiadas Oficiales · 2026
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                    {currentVariant.commercial_experience.title}
                  </h2>
                  <p className="text-white/60 text-sm font-light mt-2 max-w-xl">
                    {currentVariant.commercial_experience.tagline}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block mb-0.5">
                    Tarifa por persona
                  </span>
                  <p className="text-3xl font-black font-mono text-white">
                    ${currentVariant.commercial_experience.base_price_clp.toLocaleString('es-CL')} CLP
                  </p>
                  <p className="text-sm text-white/40 font-mono">
                    {currentVariant.commercial_experience.price_usd}
                  </p>
                </div>
              </div>

              {/* Grid de Salidas Confirmadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {currentVariant.commercial_experience.upcoming_departures.map((salida) => {
                  const esUltimos = salida.cuposDisponibles <= 2;
                  const bookingUrl = `/reservar?route=${entity.slug}&fecha=${salida.id}`;
                  return (
                    <div 
                      key={salida.id} 
                      className="rounded-2xl p-6 flex flex-col justify-between border"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.04)', 
                        borderColor: esUltimos ? 'rgba(245, 158, 11, 0.45)' : 'rgba(255, 255, 255, 0.10)' 
                      }}
                    >
                      <div>
                        <div className="flex items-baseline justify-between mb-3 text-xs">
                          <span className="text-white/40 font-mono">Salida confirmada</span>
                          <span className={esUltimos ? 'text-amber-400 font-semibold font-mono' : 'text-white/50 font-mono'}>
                            {salida.estado}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-3">{salida.fecha}</h3>
                        <div className="space-y-1.5 text-xs font-mono text-white/50 mb-5">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{salida.hora}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" />
                            <span className="line-clamp-1">{currentTrailhead.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2 border-t border-white/10">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="text-xs text-white/40 font-mono">Total por cupo:</span>
                          <span className="text-lg font-black font-mono text-white">
                            ${currentVariant.commercial_experience?.base_price_clp.toLocaleString('es-CL')} CLP
                          </span>
                        </div>
                        <Link 
                          href={bookingUrl} 
                          className="w-full btn-arcteryx-primary text-center justify-center !py-3 text-xs font-mono font-bold tracking-wider block"
                        >
                          RESERVAR CUPO →
                        </Link>
                        <a 
                          href={`https://wa.me/56984021940?text=${waMessage}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full block text-center py-1.5 text-[11px] font-mono text-white/40 hover:text-white transition-colors"
                        >
                          O consultar vía WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Banner de Salida Privada On-Demand */}
              <div 
                className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-10 border border-amber-500/30"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.10) 0%, rgba(20, 20, 20, 0.90) 100%)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div>
                  <span className="text-amber-400 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block mb-1">
                    ¿Otra fecha o salida a tu medida?
                  </span>
                  <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                    Coordinamos tu Salida Guiada Privada
                  </h4>
                  <p className="text-white/60 text-sm max-w-xl font-light leading-relaxed mt-1">
                    Lunes a Domingo. Tarifas por grupo: 1 persona (privado), 2 personas (dúo) o grupos de 3+. Horarios y ritmo adaptado a tu condición física.
                  </p>
                </div>
                <a
                  href={`https://wa.me/56984021940?text=${encodeURIComponent(`Hola Gaz, me interesa cotizar una salida privada para ${entity.name} (${currentVariant.name}).`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-arcteryx whitespace-nowrap text-xs !py-3.5 !px-8 shrink-0"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> COTIZAR FECHA PRIVADA
                </a>
              </div>

              {/* Las 3 Garantías de Confianza */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 font-mono text-xs text-white/50 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Garantía climática 100% reprogramable</span>
                </div>
                <div className="flex items-center gap-3">
                  <HeartPulse className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Guía WFR con botiquín & inReach SOS</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Grupos reducidos boutique de máx. 8</span>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ── CROSS-SELLING: OTRAS CUMBRES Y TRAVESÍAS DEL ATLAS ── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block mb-1">
                La Red de Cumbres
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                Explora Otras Cumbres del Atlas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherEntities.map((other) => (
                <Link
                  key={other.slug}
                  href={`/atlas/${other.slug}`}
                  className="group rounded-3xl overflow-hidden flex flex-col transition-all border border-white/10 hover:border-amber-400/50 bg-white/[0.03]"
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image
                      src={other.cover_image_url}
                      alt={other.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-4 text-white font-mono text-xs font-bold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15">
                      {other.altitude_msnm} msnm · {other.massif}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                      {other.entity_type === 'travesia' ? 'TRAVESÍA DE ARISTA' : 'CUMBRE PRINCIPAL'}
                    </span>
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
                      {other.name}
                    </h3>
                    <p className="text-xs text-white/60 font-light line-clamp-2 flex-1 mb-4">
                      {other.summary}
                    </p>
                    <div className="pt-3 flex items-center justify-between text-xs font-mono font-bold text-amber-400 border-t border-white/10">
                      <span>VER DETALLES TOPOGRÁFICOS</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── MODAL LEAD MAGNET GPX ── */}
      <GpxLeadModal
        isOpen={isGpxModalOpen}
        onClose={() => setIsGpxModalOpen(false)}
        peakName={entity.name}
        routeName={currentVariant.name}
        distanceKm={currentVariant.distance_km}
      />
    </>
  );
}
