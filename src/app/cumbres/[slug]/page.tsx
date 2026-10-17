import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mountain, 
  MapPin, 
  ArrowLeft, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Sun,
  Camera,
  Radio,
  HeartHandshake
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MountainWeatherWidget from '@/components/MountainWeatherWidget';
import PeakVariantSelector from '@/components/PeakVariantSelector';
import { getAllPeaks } from '@/data/peaksDirectory';
import { getPeakBySlug } from '@/lib/peaksService';
import { getMountainWeather } from '@/lib/weather';
import HeroCarousel from '@/app/HeroCarousel';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const peaks = getAllPeaks();
  return peaks.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const peak = await getPeakBySlug(slug);

  if (!peak) {
    return { title: 'Cumbre no encontrada | Santiago Hiking' };
  }

  return {
    title: `${peak.name} (${peak.altitude_msnm}m) | Rutas, Accesos y Variantes`,
    description: `Guía técnica y completa para subir al ${peak.name}. Conoce los accesos por ${peak.trailheads.map(t => t.name).join(', ')}, desniveles, estacionamientos y cómo subir seguro.`,
    keywords: [
      peak.name,
      `Cómo subir ${peak.name}`,
      `Ruta ${peak.name}`,
      `Estacionamiento ${peak.name}`,
      `Trekking ${peak.name}`
    ],
    openGraph: {
      title: `${peak.name} - Guía de Cumbres y Accesos | Santiago Hiking`,
      description: peak.summary,
      images: [{ url: peak.cover_image_url }]
    }
  };
}

export default async function PeakDetailPage({ params }: Props) {
  const { slug } = await params;
  const peak = await getPeakBySlug(slug);

  if (!peak) {
    notFound();
  }

  // Clima en vivo en la cumbre
  const weather = await getMountainWeather(peak.latitude, peak.longitude, peak.altitude_msnm);

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-amber-500/30 bg-stone-950">
      {/* ── FONDO OFICIAL DEL CERRO FIJO A PANTALLA COMPLETA ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/45 to-stone-950/90 pointer-events-none" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-24 pb-20">
        {/* BREADCRUMB & BACK LINK */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <Link
            href="/cumbres"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Catálogo de Cumbres</span>
          </Link>
        </div>

        {/* HERO DEL CERRO */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div 
            className="relative rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-10 md:p-12 transition-all shadow-2xl"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.40)', 
              backdropFilter: 'blur(20px)', 
              WebkitBackdropFilter: 'blur(20px)', 
              border: '1px solid rgba(255, 255, 255, 0.12)' 
            }}
          >
            <Image
              src={peak.cover_image_url}
              alt={peak.name}
              fill
              priority
              sizes="100vw"
              className="object-cover -z-10 filter brightness-90"
            />
            {/* Dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent -z-10" />

            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" />
                  <span>{peak.altitude_msnm.toLocaleString('es-CL')} msnm</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 font-mono text-xs">
                  {peak.massif}
                </span>
                {peak.is_popular_sunset && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-xs font-medium flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Top Sunset</span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-4">
                {peak.name}
              </h1>

              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-light mb-4">
                {peak.summary}
              </p>

              <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Comunas: {peak.comunas.join(' · ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL: CLIMA + SELECTOR DE VARIANTES */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Widget de Clima en Cumbre */}
          <div>
            <MountainWeatherWidget
              weather={weather}
              locationName={`Cumbre ${peak.name}`}
              elevationText={`${peak.altitude_msnm}m`}
            />
          </div>

          {/* Selector Interactivo de Accesos y Variantes */}
          <div>
            <PeakVariantSelector peak={peak} />
          </div>

          {/* BANNER DE CONVERSIÓN A SALIDA GUIADA SANTIAGO HIKING */}
          <div 
            className="rounded-3xl p-8 sm:p-12 relative overflow-hidden transition-all shadow-2xl"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.45)', 
              backdropFilter: 'blur(20px)', 
              WebkitBackdropFilter: 'blur(20px)', 
              border: '1px solid rgba(245, 158, 11, 0.25)' 
            }}
          >
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono uppercase tracking-wider font-bold mb-4">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Salidas Guiadas con Seguridad
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                ¿Prefieres subir el {peak.name} con un guía profesional?
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed font-light mb-6">
                Te guiamos a ritmo amable con certificación WFR, botiquín de trauma, radios VHF, 
                fotografía profesional de alta definición incluida.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/reservar"
                  className="px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 active:scale-95"
                >
                  Ver Próximas Salidas al {peak.name}
                </Link>
                <a
                  href={`https://wa.me/56957958467?text=${encodeURIComponent(`Hola Santiago Hiking! Quisiera consultar por salidas guiadas privadas o grupales al ${peak.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-white font-mono text-xs font-semibold uppercase tracking-wider border border-white/15 transition-all"
                >
                  Coordinar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
