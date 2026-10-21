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
    title: 'Alto del Naranjo Hike & Fly',
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
    title: 'Cerro Manquehue Ridge & Soar',
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
    title: 'Cerro Provincia High Alpine Flight',
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

  const displayAdventures = DEFAULT_HIKE_AND_FLY.map((fallback) => {
    const matched = dbHikeAndFly.find((r: any) => {
      const t = (r.title || '').toLowerCase();
      const s = (r.slug || '').toLowerCase();
      return (
        t.includes(fallback.title.toLowerCase()) ||
        s.includes(fallback.slug) ||
        (fallback.slug.includes('naranjo') && t.includes('naranjo')) ||
        (fallback.slug.includes('manquehue') && t.includes('manquehue')) ||
        (fallback.slug.includes('provincia') && t.includes('provincia'))
      );
    });

    if (matched) {
      return {
        slug: matched.slug || fallback.slug,
        title: matched.title || fallback.title,
        subtitle: matched.description || fallback.subtitle,
        badge: matched.badge || fallback.badge,
        cota: matched.max_altitude || fallback.cota,
        tiempoVuelo: matched.logistics?.tiempoVuelo || fallback.tiempoVuelo,
        desnivel: matched.elevation_gain || fallback.desnivel,
        price: matched.base_price || fallback.price,
        image: matched.image_url || fallback.image,
      };
    }

    return fallback;
  });

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

        {/* ── CONTENEDOR: GRID 4 COLUMNAS EN ESCRITORIO / CARRUSEL EN MÓVIL ── */}
        <div className="relative -mr-4 sm:mr-0">
          <div
            ref={scrollRef}
            className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory lg:snap-none gap-4 sm:gap-6 pb-4 scroll-smooth pr-4 sm:pr-0 pl-0.5"
          >
            {/* ── TARJETA 1 (PRINCIPAL INFORMATIVA: TÍTULO ADENTRO Y LINK A PÁGINA COMPLETA) ── */}
            <Link
              href="/hike-and-fly"
              className="w-[84vw] max-w-[340px] sm:max-w-[360px] lg:w-auto lg:max-w-none shrink-0 lg:shrink snap-start group relative rounded-3xl overflow-hidden border border-amber-400/40 hover:border-amber-400/80 transition-all duration-500 flex flex-col justify-between min-h-[460px] sm:min-h-[480px] lg:min-h-[490px] shadow-[0_16px_50px_rgba(0,0,0,0.7)]"
              style={{
                backgroundColor: 'rgba(12, 14, 18, 0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              {/* Foto de Fondo Cinematográfica */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/hike-and-fly-andes.jpg"
                  alt="Hike and Fly parapente biplaza en los Andes"
                  fill
                  priority
                  sizes="(max-width: 1024px) 84vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.45] group-hover:brightness-[0.55]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-black/45" />
              </div>

              {/* Header de la Tarjeta Principal */}
              <div className="relative z-10 p-5 sm:p-6 flex items-start justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-stone-900/90 backdrop-blur-md border border-amber-400/30 text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  PARAPENTE TÁNDEM
                </span>
                <span className="px-2 py-1 rounded-full bg-stone-950/80 border border-white/10 font-mono text-[9px] sm:text-[10px] font-bold text-stone-300">
                  PILOTO PRO
                </span>
              </div>

              {/* Contenido Central & Inferior con el Título ADENTRO */}
              <div className="relative z-10 p-5 sm:p-6 space-y-3.5">
                <div>
                  <span className="text-amber-400 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block mb-1">
                    CUMBRES Y DESPEGUES OFICIALES
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                    ELIGE TU CUMBRE DE DESPEGUE
                  </h3>
                  <p className="text-xs text-stone-300 font-mono font-light mt-2 line-clamp-3 leading-relaxed">
                    Asciende la arista a pie con la cordada y despliega las alas en cumbre para regresar planeando en parapente biplaza sobre Santiago.
                  </p>
                </div>

                {/* Especificaciones Rápidas */}
                <div
                  className="grid grid-cols-2 gap-2 py-2 px-2.5 rounded-xl font-mono text-center text-xs"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.60)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                  }}
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 block">MODALIDAD</span>
                    <span className="text-xs font-bold text-white">Tándem Biplaza</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 block">PLANEO</span>
                    <span className="text-xs font-bold text-amber-400">15 a 30 min</span>
                  </div>
                </div>

                {/* Botón Acceso a la Página Completa */}
                <div className="pt-1">
                  <span className="w-full py-3 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-stone-950 font-mono text-xs uppercase tracking-wider font-black transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5">
                    <span>Ver Información</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* ── TARJETAS 2, 3 Y 4 (LAS CUMBRES HABILITADAS) ───────────────── */}
            {displayAdventures.map((adv) => (
              <Link
                key={adv.slug}
                href={`/hike-and-fly/${adv.slug}`}
                className="w-[84vw] max-w-[340px] sm:max-w-[360px] lg:w-auto lg:max-w-none shrink-0 lg:shrink snap-start group relative rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/60 transition-all duration-500 flex flex-col justify-between min-h-[460px] sm:min-h-[480px] lg:min-h-[490px] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                style={{
                  backgroundColor: 'rgba(12, 14, 18, 0.80)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Imagen de Fondo Cinematográfica */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={adv.image}
                    alt={adv.title}
                    fill
                    sizes="(max-width: 1024px) 84vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.55] group-hover:brightness-[0.70]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-black/35" />
                </div>

                {/* Header de la Tarjeta: Badge Superior */}
                <div className="relative z-10 p-5 sm:p-6 flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-white/15 text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider shadow-md">
                    {adv.badge}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-stone-950/80 border border-white/10 font-mono text-[10px] font-bold text-stone-200">
                    {adv.tiempoVuelo}
                  </span>
                </div>

                {/* Contenido Inferior: Título, Métricas y Botón */}
                <div className="relative z-10 p-5 sm:p-6 space-y-3.5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-amber-300 transition-colors drop-shadow-md">
                      {adv.title}
                    </h3>
                    <p className="text-xs text-stone-300 font-mono font-light mt-1.5 line-clamp-2 leading-relaxed">
                      {adv.subtitle}
                    </p>
                  </div>

                  {/* Telemetría Técnica de la Cumbre */}
                  <div
                    className="grid grid-cols-2 gap-2 py-2 px-2.5 rounded-xl font-mono text-center"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.55)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                    }}
                  >
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-stone-400 block">DESPEGUE</span>
                      <span className="text-xs font-bold text-white">{adv.cota}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-stone-400 block">DESNIVEL</span>
                      <span className="text-xs font-bold text-white">{adv.desnivel}</span>
                    </div>
                  </div>

                  {/* Barra de Precio y CTA */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/10 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Cupo Tándem</span>
                      <span className="text-sm sm:text-base font-black text-amber-400 font-mono">
                        ${Number(adv.price).toLocaleString('es-CL')}
                      </span>
                    </div>
                    <span className="px-3.5 py-2 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-stone-950 font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5">
                      <span>Ver Ficha</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
