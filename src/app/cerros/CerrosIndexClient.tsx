'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mountain, Search, Compass, MapPin, ArrowRight, ArrowLeft, Sparkles, Filter } from 'lucide-react';
import { PeakDetail } from '@/lib/atlasService';
import Footer from '@/components/Footer';

interface Props {
  peaks: PeakDetail[];
}

const MASSIF_FILTERS = [
  { id: 'all', label: 'Todos (47 Cumbres)' },
  { id: 'isla', label: 'Cerros Isla Urbanos' },
  { id: 'manquehue', label: 'Cordón Manquehue' },
  { id: 'ramon', label: 'Sierra de Ramón' },
  { id: 'espanoles', label: 'Cordón de los Españoles' },
  { id: 'central', label: 'Cordillera Central (Farellones / Plomo)' },
  { id: 'maipo', label: 'Cajón del Maipo' }
];

export default function CerrosIndexClient({ peaks }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMassif, setSelectedMassif] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredPeaks = useMemo(() => {
    return peaks.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) ||
        p.massif.toLowerCase().includes(q) ||
        (p.comunas && p.comunas.some(c => c.toLowerCase().includes(q))) ||
        (p.summary && p.summary.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (selectedMassif === 'all') return true;
      const m = p.massif.toLowerCase();
      if (selectedMassif === 'isla') return m.includes('isla');
      if (selectedMassif === 'manquehue') return m.includes('manquehue') || m.includes('varas');
      if (selectedMassif === 'ramon') return m.includes('ramón') || m.includes('ramon');
      if (selectedMassif === 'espanoles') return m.includes('españoles') || m.includes('espanoles') || m.includes('arrayán');
      if (selectedMassif === 'central') return m.includes('central') || m.includes('farellones') || m.includes('plomo') || m.includes('yerba');
      if (selectedMassif === 'maipo') return m.includes('maipo') || m.includes('morales') || m.includes('morado');
      return true;
    }).sort((a, b) => {
      return sortOrder === 'desc'
        ? b.altitude_msnm - a.altitude_msnm
        : a.altitude_msnm - b.altitude_msnm;
    });
  }, [peaks, searchQuery, selectedMassif, sortOrder]);

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans selection:bg-amber-500/30">
      
      {/* NAVBAR SUPERIOR */}
      <header className="border-b border-white/10 bg-stone-950/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Volver a la Portada</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {peaks.length} CUMBRES REGISTRADAS
            </span>
            <Link href="/">
              <Image src="/logotipo blanco.png" alt="Santiago Hiking" width={160} height={40} className="h-7 w-auto object-contain" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* CABECERA HERO DEL DIRECTORIO */}
        <div className="mb-10">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 block mb-2">
            Cartografía Andina Metropolitana · IGM & Santiago Hiking
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Directorio de Cerros de Santiago
          </h1>
          <p className="text-white/60 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
            La enciclopedia completa de montañismo y senderismo de Santiago: 47 cumbres con altimetría verificada, accesos urbanos en Waze, perfiles interactivos y meteorología en vivo.
          </p>
        </div>

        {/* BUSCADOR Y FILTROS INTERACTIVOS */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por cerro, comuna (ej: Manquehue, Vitacura, Plomo, Lo Barnechea)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/40 text-sm font-mono focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-wider text-white hover:border-amber-400/50 transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>{sortOrder === 'desc' ? 'Mayor a Menor Cota' : 'Menor a Mayor Cota'}</span>
            </button>
          </div>

          {/* Pills de Filtrado por Cordón */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {MASSIF_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedMassif(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all shrink-0 ${
                  selectedMassif === f.id
                    ? 'bg-amber-500 text-stone-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLA DE TARJETAS DE CUMBRES */}
        {filteredPeaks.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <Mountain className="w-10 h-10 text-white/30 mx-auto mb-3" />
            <p className="text-sm font-mono text-white/50">No se encontraron cumbres para tu criterio de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeaks.map((peak) => (
              <Link
                key={peak.slug}
                href={`/cerros/${peak.slug.replace(/^cerro-/, '')}`}
                className="group rounded-3xl overflow-hidden flex flex-col justify-between bg-white/[0.03] border border-white/10 hover:border-amber-400/50 transition-all shadow-xl hover:shadow-[0_15px_40px_rgba(245,158,11,0.15)] hover:-translate-y-1"
              >
                <div>
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image
                      src={peak.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
                      alt={peak.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                    
                    {/* Badges superiores */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono font-bold">
                      <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur border border-white/15 text-white flex items-center gap-1.5 shadow-md">
                        <Mountain className="w-3.5 h-3.5 text-amber-400" />
                        <span>{peak.altitude_msnm} msnm</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur text-[10px] text-white/80 border border-white/10 uppercase">
                        {peak.basin}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                      {peak.massif} · {peak.comunas.join(', ')}
                    </span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors mb-2">
                      {peak.name}
                    </h3>
                    <p className="text-xs text-white/60 font-light leading-relaxed line-clamp-2">
                      {peak.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono font-bold text-amber-400 group-hover:text-amber-300">
                  <span>Explorar Ficha Técnica</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
