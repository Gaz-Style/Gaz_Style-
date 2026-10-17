'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mountain, Search, ExternalLink, Calendar, Plus, Eye,
  Sparkles, CheckCircle2, ShieldCheck, MapPin, Filter, ArrowLeft,
  Navigation, Compass, Layers, Copy, Check
} from 'lucide-react';
import { PeakDetail } from '@/lib/atlasService';

interface Props {
  initialPeaks: PeakDetail[];
  initialTrailheads: any[];
  initialTrails: any[];
}

export default function CerrosAdminClient({ initialPeaks, initialTrailheads, initialTrails }: Props) {
  const [peaks, setPeaks] = useState<PeakDetail[]>(initialPeaks);
  const [trailheads] = useState<any[]>(initialTrailheads);
  const [trails] = useState<any[]>(initialTrails);

  const [activeTab, setActiveTab] = useState<'cerros' | 'trailheads' | 'trails'>('cerros');
  const [search, setSearch] = useState('');
  const [filterMassif, setFilterMassif] = useState('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const massifs = ['all', ...Array.from(new Set(peaks.map(p => p.massif).filter(Boolean)))];

  const filteredPeaks = peaks.filter(p => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.massif.toLowerCase().includes(q) || (p.comunas && p.comunas.some(c => c.toLowerCase().includes(q)));
    if (!matchSearch) return false;
    if (filterMassif === 'all') return true;
    return p.massif.toLowerCase().includes(filterMassif.toLowerCase());
  });

  const filteredTrailheads = trailheads.filter(th => {
    const q = search.toLowerCase().trim();
    return !q || th.name.toLowerCase().includes(q) || th.comuna.toLowerCase().includes(q) || (th.address_description && th.address_description.toLowerCase().includes(q));
  });

  const filteredTrails = trails.filter(t => {
    const q = search.toLowerCase().trim();
    return !q || t.name.toLowerCase().includes(q) || (t.trail_surface && t.trail_surface.toLowerCase().includes(q));
  });

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-slate-100 font-sans">
      
      {/* Cabecera Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">Catálogo de Cerros</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Mountain className="w-7 h-7 text-amber-400" />
            Catálogo Oficial de Cerros & Cumbres IGM
          </h1>
          <p className="text-slate-400 text-xs font-mono mt-1">
            Gestor integral de las 47 Cumbres de la Región Metropolitana · URLs directas SEO en la raíz
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#cerros"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Vitrina en la Web</span>
          </Link>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Cumbres Oficiales IGM</span>
          <span className="text-2xl font-black text-white">{peaks.length}</span>
          <span className="text-[10px] text-amber-400 block mt-0.5">100% Indexables en Google</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Senderos y Variantes</span>
          <span className="text-2xl font-black text-emerald-400">{trails.length}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Rutas técnicas directas</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Puntos de Acceso / Trailheads</span>
          <span className="text-2xl font-black text-sky-400">{trailheads.length}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Con enlaces a Waze & Maps</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Estructura SEO</span>
          <span className="text-sm font-black text-white block mt-1">santiagohiking.com/[cerro]</span>
          <span className="text-[10px] text-emerald-400 block">Exact Match Keyword</span>
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('cerros')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
            activeTab === 'cerros'
              ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900/50'
          }`}
        >
          <Mountain className="w-4 h-4" />
          <span>Cumbres ({peaks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trailheads')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
            activeTab === 'trailheads'
              ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900/50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Puntos de Acceso / Waze ({trailheads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trails')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
            activeTab === 'trails'
              ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Senderos & Variantes ({trails.length})</span>
        </button>
      </div>

      {/* Buscador & Filtro de Macizo */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, comuna o cordón..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-400 transition-all"
          />
        </div>

        {activeTab === 'cerros' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {massifs.map(m => (
              <button
                key={m}
                onClick={() => setFilterMassif(m)}
                className={`px-3 py-2 rounded-xl text-[11px] font-mono font-bold whitespace-nowrap transition-all ${
                  filterMassif === m
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {m === 'all' ? 'Todos los Macizos' : m}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: CUMBRES */}
      {activeTab === 'cerros' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Cumbre & Cota</th>
                  <th className="py-4 px-6">Macizo / Cordón</th>
                  <th className="py-4 px-6">Comunas & Cuenca</th>
                  <th className="py-4 px-6 text-center">Variantes</th>
                  <th className="py-4 px-6">URL Directa SEO</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPeaks.map((peak) => {
                  const directTrails = (peak.trail_peaks || []).filter(tp => tp.trails?.trail_type !== 'travesia_cordon');
                  const traverses = (peak.trail_peaks || []).filter(tp => tp.trails?.trail_type === 'travesia_cordon');

                  return (
                    <tr key={peak.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-white/10 bg-slate-950">
                            <Image
                              src={peak.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'}
                              alt={peak.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm block">{peak.name}</span>
                            <span className="text-amber-400 font-black text-xs">{peak.altitude_msnm} msnm</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-300">
                        <span className="font-semibold block">{peak.massif}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{peak.basin}</span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-slate-200 block">{peak.comunas.join(', ')}</span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            directTrails.length > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {directTrails.length} {directTrails.length === 1 ? 'Variante' : 'Variantes'}
                          </span>
                          {traverses.length > 0 && (
                            <span className="text-[9px] text-sky-400 font-mono">
                              +{traverses.length} Travesía Cordón
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-400 text-[11px]">
                        <span className="text-emerald-400 font-semibold">/{peak.slug}</span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCopy(peak.slug)}
                            title="Copiar URL directa"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                          >
                            {copiedSlug === peak.slug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <Link
                            href={`/${peak.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/30 transition-all font-bold text-[11px]"
                          >
                            <span>Ver Ficha</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PUNTOS DE ACCESO / TRAILHEADS */}
      {activeTab === 'trailheads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Punto de Acceso</th>
                  <th className="py-4 px-6">Comuna & Dirección</th>
                  <th className="py-4 px-6">Horarios & Estacionamiento</th>
                  <th className="py-4 px-6 text-right">Navegación GPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTrailheads.map((th) => (
                  <tr key={th.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-white text-sm block">{th.name}</span>
                      <span className="text-[10px] text-amber-400">{th.parking_type.replace('_', ' ')} · {th.parking_fee_clp === 0 ? 'Gratuito' : `$${th.parking_fee_clp}`}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-slate-200 block font-semibold">{th.comuna}</span>
                      <span className="text-slate-400 text-[11px] block max-w-sm line-clamp-1">{th.address_description}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-slate-300 block">{th.operating_hours || 'Acceso público 24/7'}</span>
                      <span className="text-slate-500 text-[10px] block line-clamp-1">{th.parking_security_tip}</span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {th.waze_deep_link && (
                          <a
                            href={th.waze_deep_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-[#33CCFF]/15 text-[#33CCFF] border border-[#33CCFF]/30 hover:bg-[#33CCFF]/25 font-bold text-[10px] flex items-center gap-1"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Waze</span>
                          </a>
                        )}
                        {th.google_maps_link && (
                          <a
                            href={th.google_maps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10 font-bold text-[10px] flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3 text-rose-400" />
                            <span>Maps</span>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SENDEROS & VARIANTES */}
      {activeTab === 'trails' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Sendero & Tipo</th>
                  <th className="py-4 px-6">Distancia & Desnivel</th>
                  <th className="py-4 px-6">Tiempo Estimado</th>
                  <th className="py-4 px-6">Dificultad & Esfuerzo</th>
                  <th className="py-4 px-6">Superficie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTrails.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-white text-sm block">{t.name}</span>
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                        {t.trail_type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-black text-amber-400 block text-sm">{t.distance_km} km</span>
                      <span className="text-slate-300 text-xs">+{t.elevation_gain_m}m D+</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-slate-200 block">{t.avg_duration_up_hours}h subida</span>
                      <span className="text-slate-500 text-[10px]">{t.avg_duration_down_hours}h bajada</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-slate-200 block capitalize">{t.technical_difficulty.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-amber-400">Esfuerzo: {t.physical_exertion}</span>
                    </td>

                    <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                      {t.trail_surface}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
