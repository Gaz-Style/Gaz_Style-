'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Mountain, 
  MapPin, 
  Car, 
  ArrowRight, 
  Sun, 
  TrendingUp,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { Peak } from '@/data/peaksDirectory';

interface CumbresFilterClientProps {
  initialPeaks: Peak[];
}

export default function CumbresFilterClient({ initialPeaks }: CumbresFilterClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sunsetOnly, setSunsetOnly] = useState(false);

  const filteredPeaks = useMemo(() => {
    return initialPeaks.filter(peak => {
      // 1. Text search
      const matchesSearch = 
        peak.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        peak.comunas.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        peak.massif.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Sunset filter
      if (sunsetOnly && !peak.is_popular_sunset) return false;

      // 3. Difficulty filter
      if (selectedDifficulty !== 'all') {
        const hasMatchingRoute = peak.trailheads.some(th => 
          th.routes.some(r => r.technical_difficulty === selectedDifficulty)
        );
        if (!hasMatchingRoute) return false;
      }

      return true;
    });
  }, [initialPeaks, searchQuery, selectedDifficulty, sunsetOnly]);

  return (
    <div className="space-y-8">
      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div 
        className="p-4 sm:p-6 rounded-2xl border backdrop-blur-xl transition-all"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.10)'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Input de búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Buscar por cerro (Manquehuito, Pochoco...), comuna o sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-white/30"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Toggle Atardecer */}
          <button
            onClick={() => setSunsetOnly(!sunsetOnly)}
            className={`px-4 py-3 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 border shrink-0 ${
              sunsetOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
            }`}
          >
            <Sun className={`w-4 h-4 ${sunsetOnly ? 'text-amber-400' : 'text-white/40'}`} />
            <span>Top Atardeceres</span>
          </button>
        </div>

        {/* Botones de Dificultad */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-white/40 uppercase tracking-wider text-[10px] shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Nivel:
          </span>
          {[
            { id: 'all', label: 'Todos los Niveles' },
            { id: 'facil_familiar', label: 'Iniciación / Familiar' },
            { id: 'moderada', label: 'Moderado' },
            { id: 'exigente', label: 'Exigente' },
            { id: 'alta_montana', label: 'Alta Montaña' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDifficulty(d.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                selectedDifficulty === d.id
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTADOS EN GRILLA */}
      {filteredPeaks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeaks.map((peak) => {
            const totalRoutes = peak.trailheads.reduce((acc, th) => acc + th.routes.length, 0);

            return (
              <div
                key={peak.id}
                className="group relative rounded-3xl overflow-hidden transition-all hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between" style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
              >
                <div>
                  {/* Imagen de Portada con Badges */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={peak.cover_image_url}
                      alt={peak.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/30" />

                    {/* Altitud Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-bold flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-amber-400" />
                      <span>{peak.altitude_msnm.toLocaleString('es-CL')} msnm</span>
                    </div>

                    {/* Sunset Badge si aplica */}
                    {peak.is_popular_sunset && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-400" />
                        <span>Sunset Spot</span>
                      </div>
                    )}

                    {/* Comunas al pie de la foto */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-mono text-white/80">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{peak.comunas.join(' · ')}</span>
                    </div>
                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="p-6">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block mb-1">
                      {peak.massif}
                    </span>
                    <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors tracking-tight mb-2">
                      {peak.name}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-4">
                      {peak.summary}
                    </p>

                    {/* Accesos disponibles pills */}
                    <div className="space-y-1.5 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                        Puntos de Partida / Accesos:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {peak.trailheads.map(th => (
                          <span 
                            key={th.id}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/80 flex items-center gap-1"
                          >
                            <Car className="w-2.5 h-2.5 text-amber-400/80" />
                            {th.name.replace('Acceso ', '')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pie de Tarjeta con Botón de Explorar */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/cumbres/${peak.slug}`}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black text-white text-xs font-mono font-bold tracking-wider uppercase transition-all border border-white/10 hover:border-amber-400 flex items-center justify-between group/btn"
                  >
                    <span>Ver {peak.trailheads.length} accesos y variantes</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-white/5 bg-white/[0.01]">
          <Compass className="w-10 h-10 text-white/30 mx-auto mb-3 animate-spin" style={{ animationDuration: '20s' }} />
          <h3 className="text-lg font-bold text-white mb-1">No se encontraron cumbres</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto mb-4">
            No hay cumbres que coincidan con &quot;{searchQuery}&quot; y los filtros aplicados.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('all');
              setSunsetOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono"
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}
    </div>
  );
}
