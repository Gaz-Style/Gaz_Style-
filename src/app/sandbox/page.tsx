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
  Video,
  Crown,
  CheckCircle2,
  XCircle,
  MapPin,
  TrendingUp,
  Droplets,
  Sun,
  Download,
  Award,
  HeartPulse,
  Sparkles,
  Navigation,
  Check,
  Compass,
  Layers,
  ChevronRight,
  Flame,
  Users,
  AlertCircle
} from 'lucide-react';
import MountainWeatherWidget from '@/components/MountainWeatherWidget';
import ElevationProfileWidget from '@/components/ElevationProfileWidget';
import PackingChecklistWidget from '@/components/PackingChecklistWidget';
import GpxLeadModal from '@/components/GpxLeadModal';
import { ATLAS_ENTITIES, AtlasEntity, AtlasRouteVariant, AtlasWaypoint } from '@/data/atlasDirectory';

export default function MasterUnifiedSandboxPage() {
  const entity: AtlasEntity = ATLAS_ENTITIES['cerro-carbon'];
  
  const [selectedThIndex, setSelectedThIndex] = useState(0);
  const [selectedVarIndex, setSelectedVarIndex] = useState(0);
  const [isGpxModalOpen, setIsGpxModalOpen] = useState(false);

  const activeTrailhead = entity.trailheads[selectedThIndex] || entity.trailheads[0];
  const activeVariant: AtlasRouteVariant = entity.variants[selectedVarIndex] || entity.variants[0];

  const whatsappMessage = encodeURIComponent(
    `¡Hola Santiago Hiking! ⚡ Me interesa agendar la salida al Cerro Carbón (1.365m) por el acceso ${activeTrailhead.name} (${activeVariant.name}). ¿Tienen cupos disponibles?`
  );

  return (
    <>
      <div className="relative min-h-screen text-white font-sans selection:bg-amber-500/30 pb-28 lg:pb-16">
        
        {/* ── FONDO OFICIAL DE LA RUTA A PANTALLA COMPLETA ── */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/wildtrek_sunset.png"
            alt="Cerro Carbón - Santiago Hiking"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-65 contrast-110"
          />
          {/* Velo oscuro y opaco para máxima legibilidad de tipografía andina */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/60 to-stone-950/95 pointer-events-none" />
        </div>

        {/* ── CONTENIDO PRINCIPAL FLOTANDO EN Z-10 ── */}
        <div className="relative z-10">

          {/* ── NAVBAR FLOTANTE CON LOGOTIPO LIMPIO ── */}
          <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8 pointer-events-none">
            <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
              <Link 
                href="/cumbres" 
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-white/80 hover:text-white transition-all hover:-translate-x-1 py-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Volver al Catálogo</span>
              </Link>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-lg">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  PROTOTIPO MAESTRO UNIFICADO (12 BLOQUES + 3D)
                </span>

                <Link href="/" className="flex items-center transition-transform duration-200 hover:scale-105 py-1">
                  <Image 
                    src="/logotipo blanco.png" 
                    alt="Santiago Hiking" 
                    width={380} 
                    height={90} 
                    className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]" 
                    priority 
                  />
                </Link>
              </div>


            </div>
          </header>

          {/* ── BLOQUE 1 & 2: HERO DE LA RUTA + 4 MÉTRICAS + ACTION BAR ── */}
          <header className="relative min-h-[68vh] sm:min-h-[72vh] flex flex-col justify-end pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10 w-full">
              
              <div className="mb-3">
                <span className="bg-stone-900/80 backdrop-blur px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded border border-white/10 inline-block">
                  Trekking Santiago · Vitacura & Huechuraba
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4 drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
                {entity.name} <span className="text-amber-400">({entity.altitude_msnm}m)</span>
              </h1>

              <p className="text-white/90 text-base md:text-xl font-light max-w-2xl leading-relaxed mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                {entity.summary}
              </p>

              

              

              {/* ── TELEMETRÍA METEOROLÓGICA INTEGRAL EN CUMBRE (UNIFICADA) ── */}
              <div 
                className="rounded-3xl p-5 sm:p-6 font-mono w-full mt-4 shadow-2xl space-y-3"
                style={{
                  backgroundColor: 'rgba(10, 10, 10, 0.75)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                {/* Fila Principal de Telemetría (4 columnas clave) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-medium">Temp. Cumbre</p>
                    <p className="text-sm sm:text-base font-black text-white">
                      16°C <span className="text-[10px] text-white/40 font-normal">(Sens. 15°)</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-medium">Viento Arista</p>
                    <p className="text-sm sm:text-base font-black text-white">
                      12 km/h <span className="text-[10px] text-white/40 font-normal">Ráf. 18</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-medium">Ventana / Cielo</p>
                    <p className="text-sm sm:text-base font-black text-emerald-400 uppercase flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Óptimo
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-medium">Ocaso / UV</p>
                    <p className="text-sm sm:text-base font-black text-white">
                      19:58 <span className="text-[10px] text-amber-400 font-normal">UV7 (Alto)</span>
                    </p>
                  </div>
                </div>

                {/* Subfila Complementaria: Mínima nocturna, Humedad, Alba y Fuente de datos */}
                <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/60">
                  <div className="flex items-center gap-3">
                    <span>Cielo: <strong className="text-white">Despejado</strong></span>
                    <span>•</span>
                    <span>Mínima noche: <strong className="text-white">8°C</strong></span>
                    <span>•</span>
                    <span>Humedad: <strong className="text-white">34%</strong></span>
                    <span>•</span>
                    <span>Alba: <strong className="text-amber-300">07:04 hrs</strong></span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-white/40">
                    Estación Open-Meteo · 1.365m
                  </span>
                </div>
              </div>

              {/* ── PERFIL DE ELEVACIÓN & ALTIMETRÍA INTERACTIVO BAJO EL CLIMA ── */}
              <div className="mt-5 w-full">
                <ElevationProfileWidget
                  maxAltitude={`${entity.altitude_msnm}m`}
                  elevationGain={`+${activeVariant.elevation_gain_m}m D+`}
                  distance={`${activeVariant.distance_km} km`}
                  difficulty={activeVariant.technical_difficulty.replace(/_/g, " ").replace(/trekker/gi, "").trim()}
                  stravaUrl="https://www.strava.com/segments/1269934"
                  /* uses default ascent profile */
                />
              </div>
            </div>
          </header>



          {/* ── CUERPO PRINCIPAL (2 COLUMNAS: EDITORIAL/CARTOGRAFÍA + SIDEBAR COMERCIAL) ── */}
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

            {/* COLUMNA IZQUIERDA: BLOQUES 3 A 11 */}
            <div className="space-y-10">

              {/* ── BLOQUE 5: LOGÍSTICA & PUNTOS DE ACCESO (UNA SOLA TARJETA LIMPIA) ── */}
              <section 
                className="p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                {/* Cabecera limpia y técnica */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                      Punto de Acceso & Logística
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 uppercase">
                    {activeTrailhead.comuna}
                  </span>
                </div>

                {/* Foto + Datos del Acceso (Sin tarjeta anidada dentro) */}
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-black/50">
                    <Image
                      src={activeTrailhead.id.includes('la-piramide') 
                        ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80' 
                        : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'}
                      alt={activeTrailhead.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-white truncate">
                      {activeTrailhead.name}
                    </h4>
                    <p className="text-xs text-white/60 line-clamp-2 font-light">
                      {activeTrailhead.address_description}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-amber-400">
                      <span>Paso Público Habilitado</span>
                      <span>{activeTrailhead.operating_hours.split('(')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Tips de Estacionamiento y Transporte integrados directamente (sin cajas anidadas) */}
                <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-white/40 uppercase text-[10px] block mb-0.5">Estacionamiento & Seguridad:</span>
                    <p className="text-white/80 font-light leading-relaxed">{activeTrailhead.parking_security_tip}</p>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase text-[10px] block mb-0.5">Transporte Público / Micros:</span>
                    <p className="text-white/80 font-light leading-relaxed">{activeTrailhead.public_transit_info}</p>
                  </div>
                </div>

                {/* 2. Selector de Variantes */}
                {entity.variants.length > 1 && (
                  <div>
                    <label className="text-[11px] font-mono text-white/50 uppercase tracking-widest block mb-2">
                      2. Selecciona la Variante Técnica:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {entity.variants.map((v, vIdx) => {
                        const isSelected = vIdx === selectedVarIndex;
                        return (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVarIndex(vIdx)}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                              isSelected
                                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/25'
                                : 'bg-white/10 text-white/70 hover:bg-white/15'
                            }`}
                          >
                            {v.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Panel Técnico de la Variante Activa */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-white tracking-tight">{activeVariant.name}</h4>
                    <span className="text-xs font-mono font-bold text-amber-400">+{activeVariant.elevation_gain_m}m D+</span>
                  </div>

                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                    {activeVariant.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs font-mono text-white/70">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="line-clamp-1">{activeVariant.water_sources_detail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="line-clamp-1">Sombra: {activeVariant.shade_percentage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">Esfuerzo: {activeVariant.physical_exertion}</span>
                    </div>
                  </div>

                  {/* Advertencia técnica de terreno y seguridad oficial Santiago Hiking */}
                  <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200/90 font-mono">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-amber-300">Condición del Terreno & Seguridad:</p>
                      <p className="text-white/80 font-light leading-relaxed">
                        Pendiente pronunciada con presencia de maicillo seco y tierra suelta en el tercio final. En el descenso el terreno se vuelve resbaloso; se aconseja descender con apoyo de bastones de trekking y calzado con suela de relieve. <strong>No hay vertientes de agua en la ruta</strong>: portar mínimo 1.5L a 2.0L por persona.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── BLOQUE 3: HISTORIA & GEOGRAFÍA ANDINA ── */}
              <section 
                className="rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                }}
              >
                {/* Fotografía a ancho completo con el título y ficha adentro */}
                <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                    alt="Arista y Atardecer en Cerro Carbón"
                    fill
                    className="object-cover"
                  />
                  {/* Gradiente oscuro superior e inferior para máxima legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90" />
                  
                  {/* Título y badge adentro de la imagen (arriba) */}
                  <div className="absolute top-0 left-0 right-0 p-5 sm:p-6 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-amber-400 font-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-bold block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        Historia & Geografía Andina
                      </span>
                      <span className="text-[11px] font-mono text-white/70 block mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        Cordón del Manquehue · Formación Mioceno
                      </span>
                    </div>
                    
                  </div>

                  {/* Datos de locación al pie de la imagen (abajo) */}
                  <div className="absolute bottom-3.5 left-5 right-5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-white/90 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                      Filo Suroriental · Vista al Valle de Santiago
                    </span>
                    <span className="text-amber-400 font-bold bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-500/40 text-[11px]">
                      Hora Dorada & Sunset
                    </span>
                  </div>
                </div>

                {/* Contenido textual con padding */}
                <div className="p-6 sm:p-8 space-y-5">
                  {/* Datos de temporada y luz */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-white/60">Luz: <strong className="text-white font-semibold">Top Sunset (Ocaso Cordillerano)</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-white/60">Temporada: <strong className="text-white font-semibold">Todo el año (Mañanas en verano)</strong></span>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-white/80 text-sm font-light leading-relaxed">
                    <p>
                      El <strong>{entity.name} ({entity.altitude_msnm} msnm)</strong> constituye el contrafuerte suroriental del emblemático Cordón del Manquehue, una formación volcánica extinta que data del Mioceno medio y que divide físicamente la cuenca del río Mapocho y la zona norte del valle de Santiago. {entity.history_and_cosmovision}
                    </p>
                    <p>
                      {entity.geology_and_nature} A diferencia del Manquehue mayor, el Carbón presenta una pendiente sostenida pero dócil a través de su arista sur, lo que lo transforma en la escuela predilecta de montañistas urbanos, corredores de montaña y expedicionarios que buscan afinar respiración, zancada y aclimatación previa a cumbres superiores de la Cordillera de los Andes.
                    </p>
                    <p>
                      {entity.mountaineering_tradition}
                    </p>
                  </div>
                </div>
              </section>

              {/* ── BLOQUE 8: RUTA · CRONOGRAMA E HITOS PASO A PASO ── */}
              {/* ── BLOQUE 8: RUTA · CRONOGRAMA E HITOS REALES ── */}
              <section 
                className="p-6 sm:p-8 rounded-3xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold">
                    Ruta · Hitos Reales del Sendero
                  </span>
                  <span className="text-[10px] font-mono text-white/40">Vía Normal La Pirámide</span>
                </div>

                <div className="divide-y divide-white/10">
                  {[
                    {
                      km: 'Km 0.0',
                      alt: '885 msnm',
                      title: 'Portón de Acceso La Pirámide (Saint George)',
                      desc: 'Registro en el punto de control e ingreso al sendero oficial del Parque Metropolitano. Comienza el ascenso en suave pendiente rodeando el bosque esclerófilo bajo.'
                    },
                    {
                      km: 'Km 1.3',
                      alt: '1.120 msnm',
                      title: 'Mirador El Litre & Primera Meseta',
                      desc: 'Hito clásico de descanso con sombraje natural. Desde aquí se domina toda la autopista Vespucio Norte, el sector de Sanhattan y el valle de Huechuraba.'
                    },
                    {
                      km: 'Km 1.9',
                      alt: '1.240 msnm',
                      title: 'Filo Sur & Tramo de Maicillo',
                      desc: 'El sendero monta la arista cumbrera. La vegetación se vuelve más baja (matorral andino) y la pendiente se incrementa sobre suelo de tierra suelta.'
                    },
                    {
                      km: 'Km 2.6',
                      alt: '1.365 msnm',
                      title: 'Cumbre Cerro Carbón (Cruz & Pirca)',
                      desc: 'Cumbre oficial marcada por la cruz de hierro y las piedras de descanso. Vista panorámica 360° hacia la pared sur del Manquehue, San Cristóbal y Cordillera de Los Andes.'
                    },
                    {
                      km: 'Km 5.2',
                      alt: '885 msnm',
                      title: 'Descenso & Retorno por el Mismo Filo',
                      desc: 'Bajada controlada por la arista hacia el Mirador El Litre y retorno al portón de La Pirámide. Se recomienda paso firme y apoyo de bastones en las zonas de maicillo.'
                    }
                  ].map((step, idx) => (
                    <div 
                      key={idx} 
                      className="py-4 first:pt-0 last:pb-0 space-y-1.5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                            {step.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs text-white/50">
                          <span className="text-amber-400 font-bold">{step.km}</span>
                          <span>·</span>
                          <span>{step.alt}</span>
                        </div>
                      </div>
                      <p className="text-white/70 font-light text-xs sm:text-sm leading-relaxed pl-3.5">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>



              {/* ── BLOQUE 11: INCLUSIONES & EXCLUSIONES EN ESPEJO ── */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="p-6 rounded-3xl"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(52, 211, 153, 0.25)' 
                  }}
                >
                  <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Incluye en la Salida
                  </h3>
                  <ul className="space-y-3 font-mono text-xs text-white/80">
                    {[
                      'Liderazgo profesional y gestión técnica de cordada',
                      'Equipamiento técnico de apoyo para la marcha en montaña',
                      'Botiquín de primeros auxilios para áreas remotas y oximetría',
                      'Comunicación permanente por radio VHF y enlace satelital Garmin SOS',
                      'Registro fotográfico digital en alta resolución'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                        <span className="font-light leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div 
                  className="p-6 rounded-3xl"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(244, 63, 94, 0.25)' 
                  }}
                >
                  <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" /> No Incluye
                  </h3>
                  <ul className="space-y-3 font-mono text-xs text-white/70">
                    {[
                      'Transporte al punto de encuentro (incluido en upgrade Expedition Boutique)',
                      'Calzado de trekking y vestimenta personal de montaña',
                      'Mochila personal de ataque (20 a 30 litros recomendada)',
                      'Seguro médico personal contra accidentes en la naturaleza'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-rose-400 mt-0.5 shrink-0">✕</span>
                        <span className="font-light leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* ── BLOQUE 12: CHECKLIST INTERACTIVO DE MOCHILA (0/7 LISTOS) ── */}
              <section>
                <PackingChecklistWidget />
              </section>

              {/* ── SECCIÓN COMERCIAL ESTILO MUCH BETTER ADVENTURES ── */}
              <section id="expediciones" className="scroll-mt-24 space-y-6">
                
                {/* Cabecera Técnica de Expediciones Guiadas */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block mb-1">
                      Expediciones Oficiales · Grupo Reducido
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      Próximas Salidas Guiadas
                    </h2>
                    <p className="text-white/60 text-xs sm:text-sm font-light mt-1 font-mono">
                      Máximo 8 senderistas por salida · Liderazgo de montaña · Radioenlace VHF & SOS
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Temporada Abierta · Vitacura</span>
                  </div>
                </div>

                {/* Grid de Salidas Estilo Much Better Adventures (Flat, sin caja sobre caja) */}
                <div className="space-y-3">
                  {[
                    {
                      id: 'dep-cb-1',
                      fecha: 'Viernes 24 de Octubre',
                      tipo: 'Sunset & Atardecer Dorado',
                      hora: '17:30 hrs',
                      cuposDisponibles: 2,
                      estado: 'Últimos 2 cupos',
                      precioClp: '$35.000',
                      precioUsd: 'US$37'
                    },
                    {
                      id: 'dep-cb-2',
                      fecha: 'Sábado 25 de Octubre',
                      tipo: 'Ascenso Clásico & Técnica de Bastones',
                      hora: '08:30 hrs',
                      cuposDisponibles: 4,
                      estado: 'Salida Confirmada',
                      precioClp: '$35.000',
                      precioUsd: 'US$37'
                    },
                    {
                      id: 'dep-cb-3',
                      fecha: 'Viernes 31 de Octubre',
                      tipo: 'Sunset & Luna Llena Cordillerana',
                      hora: '17:30 hrs',
                      cuposDisponibles: 6,
                      estado: 'Inscripciones Abiertas',
                      precioClp: '$35.000',
                      precioUsd: 'US$37'
                    }
                  ].map((salida) => {
                    const esUltimos = salida.cuposDisponibles <= 2;
                    return (
                      <div 
                        key={salida.id}
                        className="rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: esUltimos ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                        }}
                      >
                        {/* Fecha y Tipo de Salida */}
                        <div className="space-y-1 min-w-[240px]">
                          <div className="flex items-center gap-2 text-[10px] font-mono">
                            <span className={esUltimos ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                              ● {salida.estado}
                            </span>
                            <span className="text-white/30">|</span>
                            <span className="text-white/50">{salida.cuposDisponibles} cupos libres</span>
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                            {salida.fecha}
                          </h4>
                          <p className="text-xs font-mono text-white/60">
                            {salida.tipo}
                          </p>
                        </div>

                        {/* Datos Operativos Rápidos */}
                        <div className="flex items-center gap-4 text-xs font-mono text-white/60">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{salida.hora}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Liderazgo de Cordada</span>
                          </div>
                        </div>

                        {/* Tarifa y CTA */}
                        <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                          <div className="text-left md:text-right font-mono">
                            <span className="text-[10px] text-white/40 block">Por persona</span>
                            <span className="text-lg font-black text-white">{salida.precioClp}</span>
                            <span className="text-[10px] text-white/40 ml-1.5">{salida.precioUsd}</span>
                          </div>

                          <Link
                            href={`/reservar?route=cerro-carbon&fecha=${salida.id}`}
                            className="btn-arcteryx-primary !py-2.5 !px-5 text-xs font-mono font-bold tracking-wider shrink-0"
                          >
                            RESERVAR CUPO
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Nota de garantía técnica */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-white/45 pt-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Incluye equipamiento de apoyo y seguridad para la ruta
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Salida con cobertura satelital Garmin InReach
                  </span>
                </div>
              </section>

              {/* ── UPGRADE EXPEDITION BOUTIQUE (AL FINAL CON PRÓXIMAS SALIDAS) ── */}
                <div 
                  className="p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-amber-500/35 shadow-[0_12px_40px_rgba(245,158,11,0.15)]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.10) 0%, rgba(20, 20, 20, 0.90) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                          <Crown className="w-3 h-3 text-amber-400" /> Formato Expedition Boutique Disponible
                        </span>
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">100% Privado</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                        ¿Prefieres vivir el Cerro Carbón en privado y a tu propio ritmo?
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                        Convierte esta ruta en una <strong>Expedition Boutique exclusiva</strong> para ti o tu grupo cerrado. Incluye pick-up directo en tu hotel o domicilio en Santiago (SUV / 4x4), fecha abierta a tu elección (lunes a domingo) y entrega de un video <strong>Reel 4K editado profesional</strong> para tus redes.
                      </p>
                      <div className="flex flex-wrap gap-4 pt-1 text-xs font-mono text-white/60">
                        <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-amber-400" /> Pick-up Puerta a Puerta</span>
                        <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-amber-400" /> Reel 4K de Cumbre</span>
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Guía y Liderazgo Exclusivo</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
                      <a
                        href={`https://wa.me/56957958467?text=${encodeURIComponent('¡Hola! Me gustaría cotizar la cumbre al Cerro Carbón en formato privado Expedition Boutique (con pick-up en Santiago y Reel 4K). ¿Qué disponibilidad tienen?')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-arcteryx-primary !py-3.5 !px-6 text-xs font-mono font-bold tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                      >
                        <Sparkles className="w-4 h-4" /> COTIZAR EXPEDITION BOUTIQUE
                      </a>
                      <span className="text-[10px] font-mono text-center text-white/40">
                        Tarifa personalizada · Respuesta en &lt; 15 min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

          </main>

          {/* ── BARRA FLOTANTE MOBILE: EXCLUSIVAMENTE LEAD MAGNET (DESCARGA GPX) ── */}
          <div 
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 py-3 border-t border-white/[0.12] bg-[#0c0f12]/95 backdrop-blur-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.9)]"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/50 block">
                  Ficha Técnica Oficial
                </span>
                <span className="text-xs font-mono text-white font-semibold truncate block">
                  {activeVariant.distance_km} km · +{activeVariant.elevation_gain_m}m D+
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://www.strava.com/segments/1269934"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono font-bold tracking-wider text-[#FC4C02] bg-[#FC4C02]/15 border border-[#FC4C02]/40 hover:bg-[#FC4C02]/25 transition-all shadow-[0_0_15px_rgba(252,76,2,0.25)]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FC4C02] animate-pulse"></span>
                  <span>STRAVA</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsGpxModalOpen(true)}
                  className="btn-arcteryx-primary !py-2.5 !px-5 text-xs font-mono font-bold tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DESCARGAR TRACK</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ── MODAL GPX ── */}
        <GpxLeadModal
          isOpen={isGpxModalOpen}
          onClose={() => setIsGpxModalOpen(false)}
          peakName={entity.name}
          routeName={activeVariant.name}
          distanceKm={activeVariant.distance_km}
        />

      </div>
    </>
  );
}
