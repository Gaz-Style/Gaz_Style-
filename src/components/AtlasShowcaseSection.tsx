'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mountain, ArrowRight, Sparkles, MapPin, Compass, ShieldCheck } from 'lucide-react';

interface PeakSummary {
  slug: string;
  name: string;
  altitude_msnm: number;
  massif: string;
  comunas: string[];
  basin: string;
  summary: string;
  cover_image_url: string;
}

const FEATURED_PEAKS: Record<string, PeakSummary[]> = {
  isla: [
    {
      slug: 'cerro-carbon',
      name: 'Cerro Carbón',
      altitude_msnm: 1365,
      massif: 'Cordón Manquehue',
      comunas: ['Vitacura', 'Huechuraba'],
      basin: 'Cuenca del Mapocho',
      summary: 'La gran cumbre de entrenamiento y sunset de Santiago, con vistas directas a los rascacielos de Sanhattan.',
      cover_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    },
    {
      slug: 'cerro-san-cristobal',
      name: 'Cerro San Cristóbal',
      altitude_msnm: 863,
      massif: 'Cerros Isla Valle Central',
      comunas: ['Providencia', 'Recoleta'],
      basin: 'Cuenca del Mapocho',
      summary: 'El corazón verde de Santiago, con vistas panorámicas de 360 grados sobre toda la metrópoli.',
      cover_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      slug: 'cerro-chena',
      name: 'Cerro Chena',
      altitude_msnm: 720,
      massif: 'Cerro Isla Cuenca del Maipo',
      comunas: ['San Bernardo'],
      basin: 'Cuenca del Maipo',
      summary: 'La fortaleza incaica más austral del Tawantinsuyu, cargada de arqueología y solsticios sagrados.',
      cover_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    }
  ],
  manquehue: [
    {
      slug: 'cerro-manquehue',
      name: 'Cerro Manquehue',
      altitude_msnm: 1638,
      massif: 'Cordón Manquehue',
      comunas: ['Vitacura', 'Lo Barnechea'],
      basin: 'Cuenca del Mapocho',
      summary: 'El volcán extinto y la cumbre reina del valle de Santiago, con una arista rocosa legendaria.',
      cover_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    },
    {
      slug: 'cerro-manquehuito',
      name: 'Cerro Manquehuito',
      altitude_msnm: 1319,
      massif: 'Cordón Manquehue',
      comunas: ['Lo Barnechea'],
      basin: 'Cuenca del Mapocho',
      summary: 'El mirador predilecto para atardeceres y mar de nubes sobre Santiago.',
      cover_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      slug: 'cerro-el-guanaco',
      name: 'Cerro El Guanaco',
      altitude_msnm: 950,
      massif: 'Cordón Manquehue',
      comunas: ['Huechuraba'],
      basin: 'Cuenca del Mapocho',
      summary: 'El contrafuerte poniente del cordón que domina el valle norte de Santiago.',
      cover_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    }
  ],
  ramon: [
    {
      slug: 'cerro-provincia',
      name: 'Cerro Provincia',
      altitude_msnm: 2750,
      massif: 'Sierra de Ramón',
      comunas: ['Las Condes', 'Lo Barnechea'],
      basin: 'Cuenca del Mapocho',
      summary: 'La gran prueba de resistencia andina de Santiago: casi 1.800m de desnivel vertical continuo.',
      cover_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    },
    {
      slug: 'cerro-san-ramon',
      name: 'Cerro San Ramón',
      altitude_msnm: 3253,
      massif: 'Sierra de Ramón',
      comunas: ['Peñalolén', 'La Reina'],
      basin: 'Cuenca del Mapocho',
      summary: 'El coloso y techo absoluto de la precordillera de Santiago que supera los 3.200 metros.',
      cover_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      slug: 'cerro-la-cruz',
      name: 'Cerro La Cruz',
      altitude_msnm: 2552,
      massif: 'Sierra de Ramón',
      comunas: ['Peñalolén'],
      basin: 'Cuenca del Mapocho',
      summary: 'El templo vertical de Peñalolén ascendiendo por el bosque y las cascadas de Quebrada de Macul.',
      cover_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    }
  ],
  alta_montana: [
    {
      slug: 'cerro-pintor',
      name: 'Cerro Pintor',
      altitude_msnm: 4180,
      massif: 'Cordillera Central',
      comunas: ['Lo Barnechea'],
      basin: 'Cuenca del Mapocho',
      summary: 'Tu primer cuatro mil andino: el mirador policromático de nieves eternas de Farellones.',
      cover_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    },
    {
      slug: 'cerro-el-plomo',
      name: 'Cerro El Plomo',
      altitude_msnm: 5424,
      massif: 'Macizo del Plomo',
      comunas: ['Lo Barnechea', 'San José de Maipo'],
      basin: 'Cuenca del Mapocho',
      summary: 'El Apu Tutelar sagrado del valle central de Chile. Una cumbre mística a 5.424 metros.',
      cover_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      slug: 'mirador-de-condores',
      name: 'Mirador de Cóndores',
      altitude_msnm: 1800,
      massif: 'Cajón del Maipo',
      comunas: ['San José de Maipo'],
      basin: 'Cuenca del Maipo',
      summary: 'El mayor santuario de avistamiento de fauna andina sobre los acantilados de Alfalfal.',
      cover_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    }
  ]
};

export default function AtlasShowcaseSection() {
  const [activeTab, setActiveTab] = useState<'isla' | 'manquehue' | 'ramon' | 'alta_montana'>('manquehue');
  const currentPeaks = FEATURED_PEAKS[activeTab] || FEATURED_PEAKS['manquehue'];

  return (
    <section id="cerros" className="py-20 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Cabecera de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Guías Oficiales & Expediciones</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Cerros y Cumbres de Santiago
            </h2>
            <p className="text-white/60 text-sm sm:text-base font-light mt-2 max-w-2xl leading-relaxed">
              Descubre las 47 cumbres oficiales de la Región Metropolitana: desde cerros isla urbanos para entrenamiento diario hasta seismiles glaciares de la cordillera principal.
            </p>
          </div>

          <Link
            href="/#cerros"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-xl hover:scale-105 shrink-0"
          >
            <span>Ver Todas las Cumbres</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tabs de Cordones */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setActiveTab('manquehue')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'manquehue'
                ? 'bg-amber-500 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
            }`}
          >
            Cordón Manquehue & Las Varas
          </button>
          <button
            onClick={() => setActiveTab('ramon')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'ramon'
                ? 'bg-amber-500 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
            }`}
          >
            Sierra de Ramón & San Carlos
          </button>
          <button
            onClick={() => setActiveTab('alta_montana')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'alta_montana'
                ? 'bg-amber-500 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
            }`}
          >
            Alta Montaña & Cajón del Maipo
          </button>
          <button
            onClick={() => setActiveTab('isla')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'isla'
                ? 'bg-amber-500 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
            }`}
          >
            Cerros Isla Urbanos
          </button>
        </div>

        {/* Tarjetas Destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentPeaks.map((peak) => (
            <Link
              key={peak.slug}
              href={`/${peak.slug}`}
              className="group rounded-3xl overflow-hidden flex flex-col justify-between bg-white/[0.03] border border-white/10 hover:border-amber-400/50 transition-all shadow-xl hover:shadow-[0_15px_40px_rgba(245,158,11,0.15)] hover:-translate-y-1"
            >
              <div>
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={peak.cover_image_url}
                    alt={peak.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  
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
                <span>Ver Ficha Técnica</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
