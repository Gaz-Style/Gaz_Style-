import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mountain, 
  MapPin, 
  Compass, 
  ArrowRight, 
  Sun, 
  TrendingUp, 
  Car, 
  ShieldCheck, 
  Sparkles,
  Search
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPeaks } from '@/lib/peaksService';
import CumbresFilterClient from './CumbresFilterClient';

export const metadata: Metadata = {
  title: 'Cumbres y Senderos de Santiago | Guía Oficial de Rutas y Accesos',
  description: 'Explorador interactivo de cumbres y senderos en Santiago de Chile. Fichas técnicas, estacionamientos seguros, diferentes accesos y variantes para Cerro Manquehuito, Manquehue, Carbón, Pochoco y Provincia.',
  keywords: [
    'Cerros de Santiago',
    'Trekking Santiago rutas',
    'Cerro Manquehuito accesos',
    'Cerro Manquehue por donde subir',
    'Cerro Pochoco estacionamiento',
    'Cerro Provincia ruta normal',
    'Senderismo Santiago de Chile'
  ],
  openGraph: {
    title: 'Cumbres y Senderos de Santiago | Santiago Hiking',
    description: 'Conoce los mejores cerros de Santiago, sus accesos vehiculares, niveles de dificultad y variantes al atardecer.',
    url: 'https://www.santiagohiking.com/cumbres',
    siteName: 'Santiago Hiking',
    images: [{ url: '/logotipo%20blanco.png' }]
  }
};

export default async function CumbresPage() {
  const peaks = await getPeaks();

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-amber-500/30 bg-stone-950">
      {/* ── FONDO OFICIAL DE MONTAÑA FIJO (ESTILO OFICIAL SANTIAGO HIKING) ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/wildtrek_sunset.png"
          alt="Cordillera de los Andes Santiago"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.28] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/50 to-stone-950/95 pointer-events-none" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-28 pb-20">
        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div 
            className="rounded-3xl overflow-hidden p-8 sm:p-12 md:p-16 transition-all"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.45)', 
              backdropFilter: 'blur(20px)', 
              WebkitBackdropFilter: 'blur(20px)', 
              border: '1px solid rgba(255, 255, 255, 0.12)' 
            }}
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest font-semibold mb-6">
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                <span>Explorador de la Cordillera Central</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-[1.05] mb-6">
                Cumbres & Senderos <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                  de Santiago de Chile
                </span>
              </h1>

              <p className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed font-light mb-8 max-w-2xl">
                La guía más completa y moderna de la precordillera urbana. Compara los diferentes 
                <strong className="text-white font-semibold"> accesos vehiculares, estacionamientos y variantes técnicas</strong> de 
                cada cerro para elegir cómo y por dónde subir.
              </p>

              {/* Stat badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-400 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>5 Cumbres Principales Mapeadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>10+ Accesos Vehiculares Verificados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>Tracks GPX Libres de Descarga</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CATÁLOGO DE CERROS CON FILTRO EN TIEMPO REAL */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CumbresFilterClient initialPeaks={peaks} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
