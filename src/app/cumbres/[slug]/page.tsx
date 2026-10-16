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
    <div className="bg-stone-950 topographic-pattern topographic-contours min-h-screen text-stone-100 font-sans selection:bg-amber-500/30">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* BREADCRUMB & BACK LINK */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <Link
            href="/cumbres"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/60 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Catálogo de Cumbres</span>
          </Link>
        </div>

        {/* HERO DEL CERRO */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="relative rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-10 md:p-12" style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.10)' }}>
            <Image
              src={peak.cover_image_url}
              alt={peak.name}
              fill
              priority
              sizes="100vw"
              className="object-cover -z-10"
            />
            {/* Dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent -z-10" />

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

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                {peak.name}
              </h1>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4">
                {peak.summary}
              </p>

              <div className="flex items-center gap-2 text-xs font-mono text-white/60">
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
              elevationText={`${peak.altitude_msnm} msnm`}
            />
          </div>

          {/* Panorama Visual */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8">
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
              Vista Panorámica en Cumbre
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              {peak.panoramic_summary}
            </p>
          </div>

          {/* EL SELECTOR INTERACTIVO DE VARIANTES */}
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold block mb-1">
                Cartografía & Desglose
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Accesos y Variantes de Ascenso
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Elige el punto de partida que más te acomode para ver la distancia, estacionamiento y perfil altimétrico.
              </p>
            </div>

            <PeakVariantSelector peak={peak} />
          </div>

          {/* GARANTÍA Y PILARES SANTIAGO HIKING */}
          <div className="pt-8 border-t border-white/10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold block mb-1">
                Estándar Santiago Hiking
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                ¿Por qué subir con nosotros?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Guías WFR Certificados</h4>
                <p className="text-xs text-white/60">Primeros auxilios avanzados en zonas remotas y cordillera.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <Radio className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Com. Satelital & VHF</h4>
                <p className="text-xs text-white/60">Conexión de emergencia continua con base y socorro andino.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Fotografía Pro Incluida</h4>
                <p className="text-xs text-white/60">Cámara profesional al atardecer para tus mejores recuerdos.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Ritmo Amable & Grupo</h4>
                <p className="text-xs text-white/60">Nadie se queda atrás. Grupos reducidos y buena vibra.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
