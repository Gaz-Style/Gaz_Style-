import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  Mountain, Clock, HeartPulse, Compass, MapPin, 
  CheckCircle2, XCircle, ArrowLeft, MessageCircle, 
  Calendar, Users, ShieldCheck, Flame, Sparkles, Footprints, Camera
} from 'lucide-react';
import { challengesData } from '../data';
import GuideRadioWidget from '../../GuideRadioWidget';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(challengesData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const challenge = challengesData[slug];
  if (!challenge) return { title: 'Desafío no encontrado' };

  return {
    title: `${challenge.title} | Santiago Hiking`,
    description: challenge.subtitle,
    openGraph: {
      title: `${challenge.title} · Andes Expeditions`,
      description: challenge.subtitle,
      images: [{ url: challenge.coverImage }],
    },
  };
}

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const challenge = challengesData[slug];

  if (!challenge) {
    notFound();
  }

  const otherChallenges = Object.values(challengesData).filter(c => c.slug !== challenge.slug);

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-amber-500/30">
      
      {/* Botón flotante lateral Hablar con Guía */}
      <GuideRadioWidget />

      {/* HEADER SUPERIOR MINIMALISTA */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/#desafios" 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-stone-600 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Desafíos
          </Link>

          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo sh.png"
              alt="Santiago Hiking"
              width={34}
              height={34}
              className="w-7 h-7 object-contain"
            />
            {/* Logotipo Oficial 20 (SANTIAGO en negro + HIKING en ámbar) */}
            <Image
              src="/logo-text-black.png"
              alt="Santiago Hiking"
              width={200}
              height={28}
              className="h-5 sm:h-6 w-auto object-contain"
              priority
            />
          </Link>
        </div>
      </header>

      {/* 1. HERO SECTION & PORTADA */}
      <section className="pt-10 pb-16 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 border border-stone-300 bg-white px-3.5 py-1 text-[11px] font-mono tracking-[0.22em] uppercase text-stone-700 rounded-full shadow-2xs mb-4">
              <span className="text-amber-600 font-bold">{challenge.number}</span>
              <span>·</span>
              <span>{challenge.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-stone-950 uppercase tracking-tight leading-[1.05] mb-4">
              {challenge.title}
            </h1>

            <p className="text-base sm:text-xl text-stone-600 font-light leading-relaxed mb-6">
              {challenge.subtitle}
            </p>

            {/* TARIFA REFERENCIAL BOUTIQUE */}
            <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-700">
              <span className="font-bold text-stone-950 font-mono">Tarifa: {challenge.precioText}</span>
              <span className="text-stone-400 font-mono text-xs">({challenge.precioUSD})</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-600 font-light">{challenge.precioBajada}</span>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#fechas"
                className="btn-arcteryx-primary text-center justify-center shadow-md !py-3.5 !px-6 text-xs font-mono font-bold tracking-wider"
              >
                <Calendar className="w-4 h-4 mr-2" /> REVISAR FECHAS Y RESERVAR CUPO
              </a>
              <a
                href={`https://wa.me/56957958467?text=${encodeURIComponent(challenge.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arcteryx text-center justify-center !py-3.5 !px-6 text-xs font-mono font-bold tracking-wider"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> COORDINAR FECHA PRIVADA
              </a>
              <a
                href="#ficha-tecnica"
                className="text-stone-500 hover:text-stone-900 text-xs font-mono tracking-wider uppercase text-center py-2 sm:px-2 transition-colors"
              >
                Ver Ficha Técnica ↓
              </a>
            </div>
          </div>

          {/* Imagen de Portada Principal LUMINOSA */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
            <Image
              src={challenge.coverImage}
              alt={challenge.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-stone-950/70 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white font-mono text-xs">
              <span className="tracking-widest uppercase text-white/90 drop-shadow">
                {challenge.dondeEsta.coordenadas} · ANDES CENTRALES
              </span>
              <span className="hidden sm:inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded text-[11px]">
                {challenge.metrics.altitud}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FICHA TÉCNICA Y ESPECIFICACIONES (Estilo Editorial Puma Adventures) */}
      <section id="ficha-tecnica" className="py-14 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <span className="text-amber-600 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block mb-1">
              Especificaciones Técnicas
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight">
              Ficha del Recorrido
            </h2>
          </div>

          {/* Tabla Editorial Limpia */}
          <div className="divide-y divide-stone-200 border-y border-stone-200 text-sm">
            
            <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Altitud máxima</span>
              <span className="font-semibold text-stone-950 sm:text-right">{challenge.metrics.altitud}</span>
            </div>

            <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Desnivel acumulado</span>
              <span className="font-semibold text-stone-950 sm:text-right">{challenge.metrics.desnivel}</span>
            </div>

            <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Distancia total</span>
              <span className="font-semibold text-stone-950 sm:text-right">{challenge.metrics.distancia}</span>
            </div>

            <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Tiempo estimado</span>
              <span className="font-semibold text-stone-950 sm:text-right">{challenge.metrics.tiempo}</span>
            </div>

            <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Dificultad</span>
              <span className="font-semibold text-amber-700 sm:text-right">{challenge.metrics.dificultad}</span>
            </div>

            <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Temporada</span>
              <span className="font-semibold text-stone-950 sm:text-right">{challenge.metrics.temporada}</span>
            </div>

            <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Tamaño de grupo</span>
              <span className="font-semibold text-stone-950 sm:text-right">{challenge.metrics.cupoMax}</span>
            </div>

            <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Ubicación y sector</span>
              <span className="font-semibold text-stone-950 sm:text-right">{challenge.dondeEsta.sector}</span>
            </div>

            <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Tarifa referencial</span>
              <span className="font-semibold text-stone-950 font-mono sm:text-right">{challenge.precioReferencial}</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. DE QUÉ SE TRATA & DÓNDE ESTÁ */}
      <section className="py-20 bg-stone-50/50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Descripción en Profundidad */}
          <div className="lg:col-span-2 space-y-6">
            <span className="text-amber-600 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block">
              La Experiencia
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-950 uppercase tracking-tight">
              ¿De qué se trata este desafío?
            </h2>
            <div className="text-stone-700 text-sm md:text-base font-light leading-relaxed space-y-4">
              <p>{challenge.descripcion.parrafo1}</p>
              <p>{challenge.descripcion.parrafo2}</p>
              <p>{challenge.descripcion.parrafo3}</p>
            </div>

            {/* Cita Editorial */}
            <div className="border-l-2 border-amber-500 pl-6 py-2 my-8 italic text-stone-800 text-base md:text-lg font-light">
              "{challenge.tagline}"
            </div>
          </div>

          {/* Dónde Está / Tarjeta de Acceso y Ubicación */}
          <div className="border border-stone-200 bg-white p-7 rounded-2xl shadow-xs space-y-6 h-fit">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
              <MapPin className="w-5 h-5 text-amber-600" />
              <h3 className="font-black text-stone-950 uppercase text-sm tracking-wider">
                ¿Dónde está y cómo llegar?
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold mb-0.5">Sector</p>
                <p className="text-stone-900 font-medium font-sans text-sm">{challenge.dondeEsta.sector}</p>
              </div>

              <div>
                <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold mb-0.5">Punto de Encuentro</p>
                <p className="text-stone-900 font-medium font-sans text-sm">{challenge.dondeEsta.puntoEncuentro}</p>
              </div>

              <div>
                <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold mb-0.5">Acceso</p>
                <p className="text-stone-900 font-sans text-xs text-stone-600 leading-relaxed">{challenge.dondeEsta.acceso}</p>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold mb-0.5">Coordenadas GPS</p>
                <p className="text-stone-900 font-bold">{challenge.dondeEsta.coordenadas}</p>
              </div>
            </div>

            <a
              href={`https://wa.me/56957958467?text=${encodeURIComponent(`Hola Gaz! Tengo dudas sobre cómo llegar o el punto de encuentro para el ${challenge.title}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-arcteryx w-full text-center text-xs block !py-2.5"
            >
              Consultar por Traslados
            </a>
          </div>

        </div>
      </section>

      {/* 4. QUÉ VEMOS EN RUTA / MOMENTOS QUE HACEN LA DIFERENCIA */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-amber-600 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block mb-1">
              Puntos Destacados & Sensaciones
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-950 uppercase tracking-tight">
              ¿Qué vemos y vivimos en esta ruta?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenge.queVemos.map((item, idx) => (
              <div 
                key={idx}
                className="p-7 border border-stone-200 bg-stone-50/40 hover:bg-white hover:border-amber-500/50 hover:shadow-md transition-all rounded-2xl group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-700 font-mono text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 uppercase tracking-tight group-hover:text-amber-600 transition-colors">
                    {item.titulo}
                  </h3>
                </div>
                <p className="text-stone-600 text-sm font-light leading-relaxed pl-11">
                  {item.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GALERÍA FOTOGRÁFICA LUMINOSA */}
      <section className="py-16 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="text-amber-600 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block mb-1">
                Visuales en Terreno
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-stone-950 uppercase tracking-tight">
                Postales de la Expedición
              </h2>
            </div>
            <p className="text-stone-500 text-xs font-mono hidden md:block">Fotografía profesional incluida en cada salida</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenge.gallery.map((img, idx) => (
              <div key={idx} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
                <div className="aspect-[4/3] relative overflow-hidden bg-stone-200">
                  <Image
                    src={img.url}
                    alt={img.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4 border-t border-stone-100">
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ITINERARIO TÉCNICO PASO A PASO */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12 text-center">
            <span className="text-amber-600 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block mb-1">
              Cronograma Detallado
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-950 uppercase tracking-tight">
              Itinerario de la Jornada
            </h2>
            <p className="text-stone-500 text-xs md:text-sm font-light mt-2">
              Horarios planificados con margen de seguridad y pausas de contemplación.
            </p>
          </div>

          <div className="border-l-2 border-stone-200 ml-4 md:ml-28 pl-6 md:pl-10 space-y-8 relative">
            {challenge.itinerario.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Punto en la línea de tiempo */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-600 group-hover:bg-amber-600 transition-colors shadow-xs" />

                {/* Hora destacada */}
                <span className="font-mono text-xs font-bold text-amber-600 tracking-wider block mb-1">
                  {step.hora}
                </span>

                <h3 className="text-lg font-bold text-stone-900 uppercase tracking-tight mb-1">
                  {step.titulo}
                </h3>

                <p className="text-stone-600 text-sm font-light leading-relaxed">
                  {step.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. QUÉ INCLUYE Y QUÉ NO INCLUYE (Transparencia Total Puma-Style) */}
      <section className="py-20 bg-stone-50/60 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center max-w-xl mx-auto">
            <span className="text-amber-600 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block mb-1">
              Transparencia Total
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-950 uppercase tracking-tight">
              ¿Qué incluye la experiencia?
            </h2>
            <p className="text-stone-600 text-xs md:text-sm font-light mt-2">
              Todo resuelto para que solo te preocupes de caminar y disfrutar la cordillera.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* INCLUYE */}
            <div className="border border-stone-200 bg-white p-8 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-6">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-stone-950 uppercase text-base tracking-wider">
                  Incluido en el Programa
                </h3>
              </div>
              <ul className="space-y-3.5 text-xs md:text-sm text-stone-700">
                {challenge.incluye.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NO INCLUYE */}
            <div className="border border-stone-200 bg-white p-8 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-6">
                <XCircle className="w-5 h-5 text-stone-400" />
                <h3 className="font-black text-stone-950 uppercase text-base tracking-wider">
                  No Incluido
                </h3>
              </div>
              <ul className="space-y-3.5 text-xs md:text-sm text-stone-700">
                {challenge.noIncluye.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-stone-400 font-bold mt-0.5">✕</span>
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-stone-100 bg-amber-50/50 p-4 rounded-xl border border-amber-200/50">
                <p className="text-xs text-amber-900 font-light leading-relaxed">
                  <strong className="font-semibold block mb-0.5 font-mono uppercase text-[11px]">¿Necesitas arriendo de equipo?</strong>
                  Si te falta calzado, chaqueta cortaviento o mochila, indícanoslo al contactar a Gaz para coordinar arriendo o préstamo.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. CHECKLIST DE EQUIPO REQUERIDO */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-stone-200 p-8 md:p-10 bg-stone-50/40 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="text-xl font-bold text-stone-950 uppercase tracking-tight">
                  Equipo Obligatorio & Checklist Personal
                </h3>
                <p className="text-stone-500 text-xs">Lo que debes llevar en tu mochila para esta salida</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-stone-700">
              {challenge.equipoRequerido.map((eq, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 bg-white border border-stone-200/80 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-light">{eq}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. CALENDARIO DE SALIDAS CONFIRMADAS & RESERVA DIRECTA */}
      <section id="fechas" className="py-20 bg-stone-50/70 scroll-mt-20 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-stone-200 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-600 font-mono text-[10px] uppercase tracking-[0.25em] font-bold mb-2">
                <Calendar className="w-4 h-4" /> Calendario Oficial · Serie 2026
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-stone-950">
                Próximas Salidas Confirmadas
              </h2>
              <p className="text-stone-600 text-sm font-light mt-2 max-w-xl">
                Salidas guiadas por Gaz en grupos boutique (máximo {challenge.metrics.cupoMax}). Los cupos se confirman por estricto orden de reserva.
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 block mb-0.5">
                Tarifa por persona
              </span>
              <div className="flex md:justify-end items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-stone-950">
                  {challenge.precioText}
                </span>
                <span className="text-sm font-mono text-stone-500">
                  / {challenge.precioUSD}
                </span>
              </div>
            </div>
          </div>

          {/* Grid de Fechas Disponibles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {challenge.fechasDisponibles.map((salida) => {
              const esUltimosCupos = salida.cuposDisponibles <= 2;
              const bookingUrl = `/reservar?route=${challenge.slug}&fecha=${salida.id}`;
              const waDateUrl = `https://wa.me/56957958467?text=${encodeURIComponent(
                `Hola Gaz, quiero reservar un cupo para el ${challenge.title} en la fecha ${salida.fecha} (${salida.hora}). ¿Tienen disponibilidad?`
              )}`;

              return (
                <div
                  key={salida.id}
                  className={`relative rounded-2xl p-7 border transition-all flex flex-col justify-between ${
                    esUltimosCupos
                      ? 'bg-white border-amber-400 shadow-sm ring-1 ring-amber-400/20 hover:shadow-md'
                      : 'bg-white border-stone-200 hover:border-stone-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Estado y Cupos (Discreto y natural) */}
                    <div className="flex items-baseline justify-between mb-3 text-xs">
                      <span className="text-stone-500 font-medium">Salida confirmada</span>
                      <span className={esUltimosCupos ? "text-amber-700 font-semibold" : "text-stone-600 font-medium"}>
                        {esUltimosCupos ? `Últimos ${salida.cuposDisponibles} cupos` : `${salida.cuposDisponibles} cupos libres`}
                      </span>
                    </div>

                    {/* Fecha y Horario */}
                    <h3 className="text-lg font-bold text-stone-950 mb-2 leading-snug">
                      {salida.fecha}
                    </h3>

                    <div className="space-y-2 text-xs font-mono text-stone-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-stone-700">{salida.hora}</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="line-clamp-1">{challenge.dondeEsta.puntoEncuentro}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pt-5 border-t border-stone-100 space-y-2.5">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-stone-500 font-mono">Total por cupo:</span>
                      <span className="text-lg font-black font-mono text-stone-950">{challenge.precioText}</span>
                    </div>

                    <Link
                      href={bookingUrl}
                      className="w-full btn-arcteryx-primary text-center justify-center !py-3 text-xs font-mono font-bold tracking-wider shadow-xs"
                    >
                      RESERVAR Y PAGAR CUPO →
                    </Link>

                    <a
                      href={waDateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block text-center py-1.5 text-[11px] font-mono text-stone-500 hover:text-stone-950 transition-colors"
                    >
                      O reservar pagando vía WhatsApp directo
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Salidas Privadas / A Medida */}
          <div className="rounded-2xl p-7 md:p-9 bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-amber-600 font-mono text-[10px] uppercase tracking-[0.2em] font-bold block">
                ¿Buscas otra fecha o salida privada?
              </span>
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-stone-950">
                Coordinamos tu Salida Privada de Lunes a Domingo
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl font-light leading-relaxed">
                Diseñamos ascensos a tu propio ritmo, con transporte coordinado, horarios a tu conveniencia o salidas exclusivas para parejas, grupos y empresas.
              </p>
            </div>

            <a
              href={`https://wa.me/56957958467?text=${encodeURIComponent(
                `Hola Gaz, me interesa coordinar una salida privada para el ${challenge.title}. ¿Qué fechas tienen disponibles?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-arcteryx whitespace-nowrap text-xs !py-3.5 !px-6 shrink-0"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> CONSULTAR FECHA PRIVADA
            </a>
          </div>

          {/* Garantías y Seguridad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-200 text-stone-600 text-xs font-mono">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Garantía climática 100% reprogramable</span>
            </div>
            <div className="flex items-center gap-3">
              <HeartPulse className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Guía WFR con botiquín & inReach satelital</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Grupos boutique de máx. {challenge.metrics.cupoMax}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 10. OTROS DESAFÍOS ANDINOS */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-stone-500 font-mono text-[10px] uppercase tracking-[0.25em] block mb-1">
              Explora la Colección
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight">
              Otros Desafíos Disponibles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherChallenges.map((other) => (
              <Link
                key={other.slug}
                href={`/desafios/${other.slug}`}
                className="group border border-stone-200 hover:border-amber-500/60 rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] relative overflow-hidden bg-stone-100">
                    <Image
                      src={other.coverImage}
                      alt={other.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-950/80 to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-4 text-white font-mono text-xs font-bold">
                      {other.metrics.altitud}
                    </span>
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider block mb-1">
                      {other.number} · {other.metrics.desnivel}
                    </span>
                    <h3 className="text-xl font-bold text-stone-900 uppercase tracking-tight mb-2 group-hover:text-amber-600 transition-colors">
                      {other.title}
                    </h3>
                    <p className="text-xs text-stone-600 font-light line-clamp-2">
                      {other.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-mono font-bold text-stone-900 group-hover:text-amber-600">
                  <span>VER DETALLES</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-stone-100 border-t border-stone-200 text-stone-600 font-mono text-xs text-center">
        <p className="mb-2">SANTIAGO HIKING · EXPEDICIONES BOUTIQUE EN LA CORDILLERA DE LOS ANDES</p>
        <p className="text-stone-500 text-[11px]">Lo Barnechea · Santiago de Chile · Guiado Certificado WFR</p>
      </footer>

    </div>
  );
}
