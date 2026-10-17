'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mountain, Search, ExternalLink, Calendar, Plus, Eye,
  Sparkles, CheckCircle2, ShieldCheck, MapPin, Filter, ArrowLeft
} from 'lucide-react';
import { PeakDetail } from '@/lib/atlasService';

interface Props {
  initialPeaks: PeakDetail[];
}

export default function AtlasAdminClient({ initialPeaks }: Props) {
  const [peaks, setPeaks] = useState<PeakDetail[]>(initialPeaks);
  const [search, setSearch] = useState('');
  const [filterMassif, setFilterMassif] = useState('all');

  const filtered = peaks.filter(p => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.massif.toLowerCase().includes(q) || (p.comunas && p.comunas.some(c => c.toLowerCase().includes(q)));
    if (!matchSearch) return false;
    if (filterMassif === 'all') return true;
    return p.massif.toLowerCase().includes(filterMassif.toLowerCase());
  });

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
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">Directorio de Cerros</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Mountain className="w-7 h-7 text-amber-400" />
            Gestor de Cumbres y Rutas Oficiales
          </h1>
          <p className="text-slate-400 text-xs font-mono mt-1">
            {peaks.length} Cumbres Oficiales IGM cargadas en base de datos · Cuencas del Mapocho y Maipo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cerros"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border border-white/10 transition-all"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Ver Web Pública</span>
          </Link>
        </div>
      </div>

      {/* Filtros & Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cumbre o comuna..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-400 transition-all"
          />
        </div>
      </div>

      {/* Tabla de Cumbres */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Cumbre & Cota</th>
                <th className="py-4 px-6">Macizo / Cordón</th>
                <th className="py-4 px-6">Comunas & Cuenca</th>
                <th className="py-4 px-6 text-center">Rutas Enlazadas</th>
                <th className="py-4 px-6 text-center">Salidas MBA</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((peak) => {
                const trailsCount = peak.trail_peaks ? peak.trail_peaks.length : 0;
                const totalDates = (peak.trail_peaks || []).reduce((acc, tp) => acc + (tp.trails?.expedition_dates?.length || 0), 0);

                return (
                  <tr key={peak.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0 border border-white/10">
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
                    <td className="py-4 px-6 text-slate-300">{peak.massif}</td>
                    <td className="py-4 px-6">
                      <span className="text-slate-200 block">{peak.comunas.join(', ')}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{peak.basin}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${trailsCount > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                        {trailsCount} {trailsCount === 1 ? 'Ruta' : 'Rutas'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${totalDates > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-500'}`}>
                        {totalDates} {totalDates === 1 ? 'Salida' : 'Salidas'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/${peak.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-amber-500 hover:text-stone-950 text-slate-300 transition-all font-bold text-[11px]"
                      >
                        <span>Ver Ficha</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
