'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  lang?: string;
  routes?: any[];
}

const DEFAULT_HIKE_AND_FLY = [
  {
    slug: 'alto-del-naranjo-hike-and-fly',
    title: 'Hike & Fly Alto del Naranjo',
    mountain: 'Alto del Naranjo',
    subtitle: 'Ascenso clásico por Puente Ñilhue hasta la meseta andina y despegue panorámico hacia el valle.',
    badge: 'HIKE & FLY · COTA 1.890M',
    cota: '1.890 m',
    tiempoVuelo: '20 a 25 min',
    desnivel: '+850 m',
    price: 155000,
    image: '/images/hike-and-fly-takeoff.jpg',
  },
  {
    slug: 'cerro-manquehue-ridge-fly',
    title: 'Hike & Fly Cerro Manquehue',
    mountain: 'Cerro Manquehue',
    subtitle: 'La cumbre tutelar más icónica. Arista rocosa de trekking y planeo térmico sobre la ciudad.',
    badge: 'HIKE & FLY · ICONO TUTELAR',
    cota: '1.627 m',
    tiempoVuelo: '20 a 25 min',
    desnivel: '+680 m',
    price: 165000,
    image: '/images/hike-and-fly-takeoff.jpg',
  },
  {
    slug: 'cerro-provincia-hike-and-fly',
    title: 'Hike & Fly Cerro Provincia',
    mountain: 'Cerro Provincia',
    subtitle: 'La gran cumbre andina de Santiago. +1.750m de ascenso a pie y vuelo épico de alta cota.',
    badge: 'HIKE & FLY · ALTA MONTAÑA',
    cota: '2.750 m',
    tiempoVuelo: '35 a 45 min',
    desnivel: '+1.750 m',
    price: 195000,
    image: '/images/hike-and-fly-andes.jpg',
  },
];

export default function HikeAndFlySection({ lang = 'es', routes = [] }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filtrar las rutas de Hike & Fly desde la base de datos
  const dbHikeAndFly = (routes || []).filter(
    (r: any) =>
      (r.vertical_type || '').toLowerCase() === 'hike_and_fly' ||
      (r.category || '').toLowerCase() === 'hike_and_fly'
  );

  const getMountainName = (rawTitle: string, fallback: string) => {
    const lower = (rawTitle || '').toLowerCase();
    if (lower.includes('naranjo')) return 'Alto del Naranjo';
    if (lower.includes('manquehue')) return 'Cerro Manquehue';
    if (lower.includes('provincia')) return 'Cerro Provincia';
    if (lower.includes('medio')) return 'Cerro del Medio';
    return fallback;
  };

  // Si existen rutas activas en la base de datos, mostramos TODAS las publicadas
  const displayAdventures = dbHikeAndFly.length > 0
    ? dbHikeAndFly.map((r: any) => {
        const fallback = DEFAULT_HIKE_AND_FLY.find((f) => 
          f.slug === r.slug || 
          (r.title && r.title.toLowerCase().includes(f.mountain.toLowerCase()))
        );
        const mountainName = getMountainName(
          r.title, 
          fallback?.mountain || r.title?.replace(/hike\s*&\s*fly\s*/gi, '').trim() || 'Andes'
        );
        return {
          slug: r.slug || fallback?.slug || r.id,
          title: `Hike & Fly ${mountainName}`,
          mountain: mountainName,
          subtitle: r.description || fallback?.subtitle || 'Ascenso de trekking andino con retorno planeando en parapente tándem biplaza.',
          badge: r.badge || fallback?.badge || 'HIKE & FLY · VUELO LIBRE',
          cota: r.max_altitude || fallback?.cota || '1.450 m',
          tiempoVuelo: r.logistics?.tiempoVuelo || fallback?.tiempoVuelo || '20 a 25 min',
          desnivel: r.elevation_gain || fallback?.desnivel || '+600 m',
          price: r.base_price || fallback?.price || 145000,
          image: r.image_url || fallback?.image || '/images/hike-and-fly-andes.jpg',
        };
      })
    : DEFAULT_HIKE_AND_FLY;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="hike-and-fly"
      className="pt-6 pb-20 sm:pt-14 sm:pb-28 relative z-20 scroll-mt-[120px] sm:scroll-mt-[140px] overflow-hidden"
    >
      {/* Luz ambiental sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ── ENCABEZADO PRINCIPAL DE LA SECCIÓN ─────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="max-w-3xl">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.28em] font-bold block mb-2">
              VUELO LIBRE ANDINO
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight">
              HIKE & FLY SANTIAGO
            </h2>
            <p className="text-white/70 text-sm sm:text-base font-light font-mono mt-3 leading-relaxed">
              La experiencia más completa de los Andes. Conquistas la cumbre a pie con esfuerzo de cordada y desciendes planeando en parapente biplaza en silencio sobre el valle central. Aventura pura y panorámica de 360°.
            </p>
          </div>

          {/* Controles de Navegación (Carrusel en Móvil / Enlace Ver Todas en Desktop) */}
          <div className="flex items-center gap-2 self-start md:self-end shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="lg:hidden p-2.5 rounded-full bg-stone-900 border border-white/10 hover:border-amber-400/50 text-stone-300 hover:text-white transition-all active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="lg:hidden p-2.5 rounded-full bg-stone-900 border border-white/10 hover:border-amber-400/50 text-stone-300 hover:text-white transition-all active:scale-95"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href="/hike-and-fly"
              className="px-4 py-2.5 rounded-full bg-stone-900/90 border border-white/10 hover:border-amber-400/50 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider transition-all"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>

        {/* ── CONTENEDOR: GRID 3 COLUMNAS EN ESCRITORIO / CARRUSEL EN MÓVIL ── */}
        <div className="relative -mr-4 sm:mr-0">
          <div
            ref={scrollRef}
            className={`flex lg:grid ${displayAdventures.length <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory lg:snap-none gap-4 sm:gap-6 pb-4 scroll-smooth pr-4 sm:pr-0 pl-0.5`}
          >
            {/* ── LAS CUMBRES HABILITADAS ───────────────── */}
            {displayAdventures.map((adv) => (
              <Link
                key={adv.slug}
                href={`/hike-and-fly/${adv.slug}`}
                className="group relative rounded-3xl overflow-hidden min-h-[440px] sm:min-h-[460px] w-[78vw] max-w-[320px] lg:w-full lg:max-w-none shrink-0 snap-start flex flex-col justify-between border border-white/10 hover:border-amber-400/50 transition-all duration-500 shadow-xl hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)]"
              >
                {/* Foto inmersiva de fondo */}
                <Image
                  src={adv.image}
                  alt={adv.title}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                {/* Gradiente oscuro profundo para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-black/95 pointer-events-none" />

                {/* Parte superior de la tarjeta: Encabezado */}
                <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-white/90">
                    {adv.badge}
                  </span>
                  <span className="font-mono text-xs tracking-widest font-black text-amber-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none">
                    {adv.tiempoVuelo}
                  </span>
                </div>

                {/* Parte inferior de la tarjeta: Título, Métricas y Descripción */}
                <div className="relative z-10 p-5 sm:p-6 space-y-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-amber-300 transition-colors leading-tight">
                      <span className="block">HIKE & FLY</span>
                      <span className="block">{adv.mountain || adv.title.replace(/hike\s*&\s*fly\s*/gi, '').trim()}</span>
                    </h3>
                    <span className="text-[11px] font-mono text-amber-300/80 block mt-0.5">
                      Cupo Tándem ${Number(adv.price).toLocaleString('es-CL')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-white/70 py-1 border-y border-white/10">
                    <span>Despegue {adv.cota}</span>
                    <span>•</span>
                    <span>Desnivel {adv.desnivel}</span>
                  </div>

                  <p className="text-xs text-white/75 font-light leading-relaxed line-clamp-3">
                    {adv.subtitle}
                  </p>

                  <div className="pt-2 border-t border-white/10">
                    <span className="w-full py-2.5 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-stone-950 font-mono text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-amber-500/20">
                      <span>GO!</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
