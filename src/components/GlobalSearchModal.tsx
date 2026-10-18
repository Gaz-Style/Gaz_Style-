'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, X, Mountain, Compass, MapPin, ArrowRight,
  Sparkles, ShieldCheck, CheckCircle2, Award
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
  initialTab?: 'peaks' | 'adventures' | 'packages';
}

export default function GlobalSearchModal({ isOpen, onClose, lang = 'es', initialTab = 'peaks' }: Props) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'peaks' | 'adventures' | 'packages'>(initialTab);
  const [peaks, setPeaks] = useState<any[]>([]);
  const [adventures, setAdventures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronizar tab si cambia initialTab al abrir el modal
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Escuchar tecla ESC y Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Autofoco y control del scroll del body
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Búsqueda en vivo
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setPeaks(data.peaks || []);
          setAdventures(data.adventures || []);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Separación técnica entre Aventuras Grupales/Travesías y Paquetes All-Inclusive
  const isPackage = (adv: any) => {
    return (
      adv.vertical_type === 'expedition_pass' ||
      adv.vertical_type === 'high_mountain' ||
      adv.category === 'expedition_pass' ||
      adv.category === 'high_mountain' ||
      (adv.base_price && Number(adv.base_price) >= 200000)
    );
  };

  const regularAdventures = useMemo(() => adventures.filter(a => !isPackage(a)), [adventures]);
  const allInclusivePackages = useMemo(() => adventures.filter(a => isPackage(a)), [adventures]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const currentResultsCount = 
    activeTab === 'peaks' ? peaks.length :
    activeTab === 'adventures' ? regularAdventures.length :
    allInclusivePackages.length;

  const quickChips = [
    { label: 'El Carbón', q: 'Carbón' },
    { label: 'Manquehue', q: 'Manquehue' },
    { label: 'Pochoco', q: 'Pochoco' },
    { label: 'El Plomo (Alta Montaña)', q: 'Plomo' },
    { label: 'Sunset Atardeceres', q: 'sunset' },
  ];

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Velo transparente ligero: mantiene visible la montaña y video de fondo */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-none" />

      {/* Tarjeta Contenedora Glassmorphism Esmerilado */}
      <div 
        className="relative z-10 w-full max-w-2xl max-h-[90vh] sm:max-h-[86vh] rounded-3xl overflow-hidden flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.85)] border border-white/12"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera con Buscador Integrado */}
        <div className="px-5 py-4 border-b border-white/10 shrink-0 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-white/50 font-mono text-[9px] tracking-[0.25em] uppercase block">
                Catálogo Oficial Santiago Hiking
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Cumbres, Rutas & Expediciones
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Cerrar buscador"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Input de Búsqueda translúcido con bordes finos */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-white/50 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por cerro, comuna, dificultad o experiencia..."
              className="w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] border border-white/12 focus:border-amber-400/60 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-all"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 p-1 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* ── PESTAÑAS HORIZONTALES MINIMALISTAS EN 1 LÍNEA (ESTILO ARC'TERYX) ── */}
          <div className="flex items-center w-full bg-white/[0.04] p-1 rounded-2xl border border-white/10 mt-3.5 gap-1">
            {/* Pestaña 1: Cumbres */}
            <button
              type="button"
              onClick={() => setActiveTab('peaks')}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-center transition-all cursor-pointer select-none whitespace-nowrap ${
                activeTab === 'peaks'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Cumbres
            </button>

            {/* Pestaña 2: Aventuras */}
            <button
              type="button"
              onClick={() => setActiveTab('adventures')}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-center transition-all cursor-pointer select-none whitespace-nowrap ${
                activeTab === 'adventures'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Aventuras
            </button>

            {/* Pestaña 3: Expediciones */}
            <button
              type="button"
              onClick={() => setActiveTab('packages')}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-center transition-all cursor-pointer select-none whitespace-nowrap ${
                activeTab === 'packages'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Expediciones
            </button>
          </div>
        </div>

        {/* Lista con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
          {loading && (
            <div className="flex items-center justify-center py-12 text-white/50 gap-2 font-mono text-xs">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              Buscando en catálogo...
            </div>
          )}

          {!loading && currentResultsCount === 0 && (
            <div className="text-center py-12">
              <Mountain className="w-10 h-10 text-white/30 mx-auto mb-2" />
              <p className="text-white font-bold text-sm">No encontramos resultados para &quot;{query}&quot; en esta categoría</p>
              <p className="text-white/50 text-xs mt-1">Prueba cambiando de pestaña o limpiando el buscador.</p>
            </div>
          )}

          {/* ── 1. VISTA DE CUMBRES DEL ATLAS ── */}
          {activeTab === 'peaks' && peaks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between mb-2 pb-1.5 border-b border-white/10">
                <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" /> Atlas Andino de Santiago
                </h3>
                <span className="text-[9px] font-mono tracking-widest text-white/45 uppercase">
                  {peaks.length} CUMBRES OFICIALES
                </span>
              </div>

              {peaks.map((p) => {
                let cleanTitle = (p.name || '').replace(/^cerro\s+/i, '');
                const altitudeText = p.altitude_msnm ? `${p.altitude_msnm.toLocaleString('es-CL')} m` : '';
                const locationText = Array.isArray(p.comunas) ? p.comunas.join(', ') : p.massif || 'Santiago';

                return (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    onClick={onClose}
                    className="group relative rounded-xl overflow-hidden flex items-stretch border border-white/15 transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/50"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                  >
                    <div className="relative w-24 sm:w-28 shrink-0 overflow-hidden bg-stone-900">
                      <Image
                        src={p.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'}
                        alt={p.name}
                        fill
                        sizes="112px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 pointer-events-none" />
                    </div>

                    <div className="p-3 sm:p-3.5 flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors truncate">
                            {cleanTitle}
                          </h4>
                          <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                        <p className="text-[11px] text-white/70 font-light leading-snug line-clamp-2">
                          {p.summary || `Ficha técnica oficial de ascensos, senderos y accesos a la cumbre.`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-2 text-[10px] font-mono text-white/50">
                        {altitudeText && (
                          <span className="text-white/80 font-bold">{altitudeText}</span>
                        )}
                        <span>·</span>
                        <span className="truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-white/40" />
                          {locationText}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── 2. VISTA DE AVENTURAS GRUPALES & TRAVESÍAS ── */}
          {activeTab === 'adventures' && regularAdventures.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between mb-2 pb-1.5 border-b border-white/10">
                <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" /> Salidas Grupales & Travesías
                </h3>
                <span className="text-[9px] font-mono tracking-widest text-white/45 uppercase">
                  {regularAdventures.length} AVENTURAS
                </span>
              </div>

              {regularAdventures.map((adv) => {
                let cleanTitle = (adv.title || '').split('·')[0].trim().replace(/^cerro\s+/i, '');
                const duration = adv.duration_text || '3 - 5h';
                const altitude = adv.max_altitude ? (String(adv.max_altitude).includes('m') ? adv.max_altitude : `${adv.max_altitude}m`) : null;
                const price = adv.base_price ? `$${Number(adv.base_price).toLocaleString('es-CL')}` : null;

                return (
                  <Link
                    key={adv.id}
                    href={`/rutas/${adv.id}`}
                    onClick={onClose}
                    className="group relative rounded-xl overflow-hidden flex items-stretch border border-white/15 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-400/50"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                  >
                    <div className="relative w-24 sm:w-28 shrink-0 overflow-hidden bg-stone-900">
                      <Image
                        src={adv.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'}
                        alt={cleanTitle}
                        fill
                        sizes="112px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 pointer-events-none" />
                    </div>

                    <div className="p-3 sm:p-3.5 flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors truncate">
                            {cleanTitle}
                          </h4>
                          <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                        <p className="text-[11px] text-white/70 font-light leading-snug line-clamp-2">
                          {adv.description || 'Expedición y ascenso guiado con el equipo oficial de Santiago Hiking.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-white/50">
                        <span>{duration}</span>
                        {altitude && (
                          <>
                            <span>·</span>
                            <span>{altitude}</span>
                          </>
                        )}
                        {price && (
                          <>
                            <span>·</span>
                            <span className="text-white font-bold ml-auto">{price}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── 3. VISTA DE GRANDES EXPEDICIONES & SALIDAS VIP ── */}
          {activeTab === 'packages' && allInclusivePackages.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between mb-2 pb-1.5 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    Grandes Expediciones & Salidas VIP
                  </h3>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                  {allInclusivePackages.length} EXPEDICIONES ACTIVAS
                </span>
              </div>

              {allInclusivePackages.map((pkg) => {
                let cleanTitle = (pkg.title || '').split('·')[0].trim();
                const duration = pkg.duration_text || (pkg.duration_days ? `${pkg.duration_days} Días` : 'Full Day');
                const altitude = pkg.max_altitude ? (String(pkg.max_altitude).includes('m') ? pkg.max_altitude : `${pkg.max_altitude}m`) : 'Alta Cumbre';
                const price = pkg.base_price ? `$${Number(pkg.base_price).toLocaleString('es-CL')}` : null;

                return (
                  <Link
                    key={pkg.id}
                    href={`/rutas/${pkg.id}`}
                    onClick={onClose}
                    className="group relative rounded-2xl overflow-hidden flex flex-col sm:flex-row items-stretch border border-amber-500/30 hover:border-amber-400 transition-all duration-300 hover:scale-[1.01] shadow-[0_4px_25px_rgba(245,158,11,0.1)]"
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.05)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Foto */}
                    <div className="relative w-full sm:w-40 h-32 sm:h-auto shrink-0 overflow-hidden bg-stone-900">
                      <Image
                        src={pkg.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'}
                        alt={cleanTitle}
                        fill
                        sizes="160px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-stone-950 font-black text-[9px] uppercase tracking-wider shadow">
                          ALL INCLUSIVE
                        </span>
                      </div>
                    </div>

                    {/* Contenido VIP */}
                    <div className="p-3.5 sm:p-4 flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h4 className="text-base font-black text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                            {cleanTitle}
                          </h4>
                          <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                        <p className="text-xs text-white/80 font-light leading-relaxed line-clamp-2">
                          {pkg.description || 'Programa de expedición con logística integral todo incluido: transporte 4x4, liderazgo de expedición, campamentos de altura y alimentación de montaña.'}
                        </p>
                      </div>

                      {/* Ventajas incluidas */}
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3 text-[10px] font-mono text-white/70">
                          <span className="text-amber-300 font-bold">{altitude}</span>
                          <span>·</span>
                          <span>{duration}</span>
                          <span>·</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Logística 100%
                          </span>
                        </div>
                        {price && (
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-white/40 block">TODO INCLUIDO</span>
                            <span className="text-sm font-black text-amber-400 font-mono">{price}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
