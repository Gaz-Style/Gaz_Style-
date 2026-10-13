import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  Mountain, Clock, HeartPulse, MapPin, 
  CheckCircle2, XCircle, ArrowLeft, MessageCircle, 
  Calendar, Users, ShieldCheck
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
  if (!challenge) notFound();

  const otherChallenges = Object.values(challengesData).filter(c => c.slug !== challenge.slug);

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans selection:bg-amber-500/30">

      <GuideRadioWidget />

      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50" style={{ backgroundColor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/#desafios" className="inline-flex items-center gap-2 text-[11px] font-bold text-white/60 hover:text-white uppercase tracking-[0.2em] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Desafíos
          </Link>
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image src="/santiago-hiking-10.png" alt="Santiago Hiking" width={140} height={64} className="h-8 w-auto object-contain drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]" priority />
          </Link>
        </div>
      </nav>

      {/* ── Hero full-bleed ──────────────────────────────────────────── */}
      <header className="relative min-h-[75vh] flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <Image src={challenge.coverImage} alt={challenge.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-stone-950/25" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-14 pt-32">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="bg-amber-500 text-black text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full">{challenge.number}</span>
            <span className="text-white/50 font-mono text-[10px] uppercase tracking-[0.2em]">{challenge.badge}</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4">
            {challenge.title}
          </h1>
          <p className="text-white/60 text-base md:text-xl font-light max-w-2xl leading-relaxed mb-8">
            {challenge.subtitle}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mb-8">
            {[
              { label: 'Altitud', value: challenge.metrics.altitud },
              { label: 'Dificultad', value: challenge.metrics.dificultad, amber: true },
              { label: 'Cupo Máx', value: challenge.metrics.cupoMax },
              { label: 'Temporada', value: challenge.metrics.temporada },
            ].map((s) => (
              <div key={s.label} className="text-center py-3 px-2 rounded-xl font-mono" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-[10px] text-white/40 uppercase font-medium mb-1">{s.label}</p>
                <p className={`text-xs font-bold ${s.amber ? 'text-amber-400' : 'text-white'}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#fechas" className="btn-arcteryx-primary text-center justify-center !py-3.5 !px-6 text-xs font-mono font-bold tracking-wider">
              <Calendar className="w-4 h-4 mr-2" /> REVISAR FECHAS Y RESERVAR
            </a>
            <a
              href={`https://wa.me/56957958467?text=${encodeURIComponent(challenge.whatsappMessage)}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-arcteryx text-center justify-center !py-3.5 !px-6 text-xs font-mono font-bold tracking-wider"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> COORDINAR SALIDA PRIVADA
            </a>
          </div>
        </div>
      </header>

      {/* ── Ficha Técnica ─────────────────────────────────────────────── */}
      <section id="ficha-tecnica" className="py-14" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block mb-1">Especificaciones Técnicas</span>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Ficha del Recorrido</h2>
          </div>

          <div className="divide-y divide-white/8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { label: 'Altitud máxima', value: challenge.metrics.altitud },
              { label: 'Desnivel acumulado', value: challenge.metrics.desnivel },
              { label: 'Distancia total', value: challenge.metrics.distancia },
              { label: 'Tiempo estimado', value: challenge.metrics.tiempo },
              { label: 'Dificultad', value: challenge.metrics.dificultad, amber: true },
              { label: 'Temporada', value: challenge.metrics.temporada },
              { label: 'Tamaño de grupo', value: challenge.metrics.cupoMax },
              { label: 'Ubicación', value: challenge.dondeEsta.sector },
              { label: 'Tarifa referencial', value: challenge.precioReferencial },
            ].map((row) => (
              <div key={row.label} className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono font-medium">{row.label}</span>
                <span className={`font-semibold sm:text-right ${row.amber ? 'text-amber-400' : 'text-white'}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── La Experiencia ─────────────────────────────────────────────── */}
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block">La Experiencia</span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">¿De qué se trata?</h2>
            <div className="text-white/55 text-sm md:text-base font-light leading-relaxed space-y-4">
              <p>{challenge.descripcion.parrafo1}</p>
              <p>{challenge.descripcion.parrafo2}</p>
              <p>{challenge.descripcion.parrafo3}</p>
            </div>
            <div className="border-l-2 border-amber-500 pl-6 py-2 italic text-white/70 text-base font-light">
              "{challenge.tagline}"
            </div>
          </div>

          {/* Tarjeta de Acceso */}
          <div className="p-6 rounded-2xl h-fit space-y-5" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <div className="flex items-center gap-2 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <MapPin className="w-4 h-4 text-amber-400" />
              <h3 className="font-black text-white uppercase text-xs tracking-[0.2em]">¿Dónde y cómo llegar?</h3>
            </div>
            <div className="space-y-4 font-mono text-xs">
              {[
                { label: 'Sector', value: challenge.dondeEsta.sector },
                { label: 'Punto de Encuentro', value: challenge.dondeEsta.puntoEncuentro },
                { label: 'Acceso', value: challenge.dondeEsta.acceso },
                { label: 'Coordenadas GPS', value: challenge.dondeEsta.coordenadas },
              ].map((d) => (
                <div key={d.label}>
                  <p className="text-white/35 uppercase tracking-widest text-[10px] font-bold mb-0.5">{d.label}</p>
                  <p className="text-white/80 font-sans text-sm">{d.value}</p>
                </div>
              ))}
            </div>
            <a
              href={`https://wa.me/56957958467?text=${encodeURIComponent(`Hola Gaz! Consulto sobre cómo llegar al ${challenge.title}.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-arcteryx w-full text-center block text-xs !py-2.5"
            >
              Consultar Traslados
            </a>
          </div>
        </div>
      </section>

      {/* ── Puntos Destacados ──────────────────────────────────────────── */}
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block mb-1">Puntos Destacados</span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">¿Qué vemos y vivimos?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {challenge.queVemos.map((item: any, idx: number) => (
              <div key={idx} className="p-6 rounded-2xl group transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">{item.titulo}</h3>
                </div>
                <p className="text-white/50 text-sm font-light leading-relaxed pl-10">{item.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galería ─────────────────────────────────────────────────────── */}
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block mb-1">Visuales en Terreno</span>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Postales de la Expedición</h2>
            </div>
            <p className="text-white/35 text-xs font-mono hidden md:block">Fotografía profesional incluida</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {challenge.gallery.map((img: any, idx: number) => (
              <div key={idx} className="group overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image src={img.url} alt={img.caption} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs text-white/45 font-light leading-relaxed">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Itinerario ──────────────────────────────────────────────────── */}
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-10 text-center">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block mb-1">Cronograma Detallado</span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Itinerario de la Jornada</h2>
            <p className="text-white/40 text-sm font-light mt-2">Horarios con margen de seguridad y pausas de contemplación.</p>
          </div>
          <div className="border-l-2 border-white/10 ml-4 md:ml-24 pl-8 space-y-8">
            {challenge.itinerario.map((step: any, idx: number) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[37px] top-1.5 w-3.5 h-3.5 rounded-full bg-stone-950 border-2 border-amber-500 group-hover:bg-amber-500 transition-colors" />
                <span className="font-mono text-xs font-bold text-amber-400 tracking-wider block mb-1">{step.hora}</span>
                <h3 className="text-base font-bold text-white uppercase tracking-tight mb-1">{step.titulo}</h3>
                <p className="text-white/45 text-sm font-light leading-relaxed">{step.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Incluye / No Incluye ─────────────────────────────────────── */}
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 text-center">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block mb-1">Transparencia Total</span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">¿Qué incluye?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-7 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Incluido en el Programa
              </h3>
              <ul className="space-y-3">
                {challenge.incluye.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/60 font-light">
                    <span className="text-emerald-400 shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-7 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" /> No Incluido
              </h3>
              <ul className="space-y-3">
                {challenge.noIncluye.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/60 font-light">
                    <span className="text-rose-400 shrink-0">✕</span> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 rounded-xl p-4" style={{ border: '1px solid rgba(245,158,11,0.2)', backgroundColor: 'rgba(245,158,11,0.06)' }}>
                <p className="text-xs text-amber-300/80 font-light leading-relaxed">
                  <strong className="font-semibold block mb-0.5 font-mono uppercase text-[10px] text-amber-400">¿Necesitas arriendo de equipo?</strong>
                  Indícanoslo al contactar a Gaz y coordinamos arriendo o préstamo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Equipo Requerido ─────────────────────────────────────────── */}
      <section className="py-14" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="p-8 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Equipo Obligatorio</h3>
                <p className="text-white/40 text-xs font-mono">Lo que debes llevar en tu mochila</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challenge.equipoRequerido.map((eq: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-sm text-white/60 font-light">{eq}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Fechas y Reserva ─────────────────────────────────────────── */}
      <section id="fechas" className="py-16 scroll-mt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold mb-1 block">Calendario Oficial · 2026</span>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Próximas Salidas</h2>
              <p className="text-white/45 text-sm font-light mt-2 max-w-lg">Grupos boutique de máx. {challenge.metrics.cupoMax}. Cupos por orden de reserva.</p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block mb-0.5">Tarifa por persona</span>
              <p className="text-3xl font-black font-mono text-white">{challenge.precioText}</p>
              <p className="text-sm text-white/40 font-mono">{challenge.precioUSD}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {challenge.fechasDisponibles.map((salida: any) => {
              const esUltimos = salida.cuposDisponibles <= 2;
              const bookingUrl = `/reservar?route=${challenge.slug}&fecha=${salida.id}`;
              const waUrl = `https://wa.me/56957958467?text=${encodeURIComponent(`Hola Gaz, quiero el ${challenge.title} — ${salida.fecha} (${salida.hora}). ¿Disponibilidad?`)}`;
              return (
                <div key={salida.id} className="rounded-2xl p-6 flex flex-col justify-between" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${esUltimos ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.09)'}` }}>
                  <div>
                    <div className="flex items-baseline justify-between mb-3 text-xs">
                      <span className="text-white/40 font-mono">Salida confirmada</span>
                      <span className={esUltimos ? 'text-amber-400 font-semibold font-mono' : 'text-white/50 font-mono'}>
                        {esUltimos ? `Últimos ${salida.cuposDisponibles} cupos` : `${salida.cuposDisponibles} cupos`}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{salida.fecha}</h3>
                    <div className="space-y-1.5 text-xs font-mono text-white/45 mb-5">
                      <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" /><span>{salida.hora}</span></div>
                      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" /><span className="line-clamp-1">{challenge.dondeEsta.puntoEncuentro}</span></div>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs text-white/35 font-mono">Total por cupo:</span>
                      <span className="text-lg font-black font-mono text-white">{challenge.precioText}</span>
                    </div>
                    <Link href={bookingUrl} className="w-full btn-arcteryx-primary text-center justify-center !py-3 text-xs font-mono font-bold tracking-wider block">
                      RESERVAR CUPO →
                    </Link>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full block text-center py-1.5 text-[11px] font-mono text-white/30 hover:text-white transition-colors">
                      O reservar vía WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner privada */}
          <div className="rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-6 mb-8" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <div>
              <span className="text-amber-400 font-mono text-[10px] uppercase tracking-[0.2em] font-bold block mb-1">¿Otra fecha o salida privada?</span>
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Coordinamos tu Salida Privada</h4>
              <p className="text-white/45 text-sm max-w-xl font-light leading-relaxed mt-1">Lunes a Domingo. Grupos, parejas, empresas. Horarios a tu conveniencia.</p>
            </div>
            <a
              href={`https://wa.me/56957958467?text=${encodeURIComponent(`Hola Gaz, me interesa una salida privada para ${challenge.title}.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-arcteryx whitespace-nowrap text-xs !py-3.5 !px-6 shrink-0"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> CONSULTAR FECHA PRIVADA
            </a>
          </div>

          {/* Garantías */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 font-mono text-xs text-white/40" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { icon: <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />, text: 'Garantía climática 100% reprogramable' },
              { icon: <HeartPulse className="w-4 h-4 text-amber-400 shrink-0" />, text: 'Guía WFR con botiquín & inReach satelital' },
              { icon: <Users className="w-4 h-4 text-amber-400 shrink-0" />, text: `Grupos boutique de máx. ${challenge.metrics.cupoMax}` },
            ].map((g, i) => (
              <div key={i} className="flex items-center gap-3">{g.icon}<span>{g.text}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Otros Desafíos ───────────────────────────────────────────── */}
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-white/35 font-mono text-[10px] uppercase tracking-[0.25em] block mb-1">Explora la Colección</span>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Otros Desafíos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {otherChallenges.map((other) => (
              <Link key={other.slug} href={`/desafios/${other.slug}`} className="group rounded-2xl overflow-hidden flex flex-col transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image src={other.coverImage} alt={other.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-950/80 to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-4 text-white font-mono text-xs font-bold">{other.metrics.altitud}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">{other.number} · {other.metrics.desnivel}</span>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">{other.title}</h3>
                  <p className="text-xs text-white/45 font-light line-clamp-2 flex-1">{other.subtitle}</p>
                  <div className="mt-4 pt-3 flex items-center justify-between text-xs font-mono font-bold text-amber-400" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span>VER DETALLES</span><span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="py-10 text-white/25 font-mono text-xs text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="mb-1">SANTIAGO HIKING · EXPEDICIONES BOUTIQUE EN LA CORDILLERA DE LOS ANDES</p>
        <p className="text-white/15 text-[11px]">Lo Barnechea · Santiago de Chile · Guía Certificado WFR</p>
      </footer>

    </div>
  );
}
