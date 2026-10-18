'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  lang?: string;
}

export default function TopTickerBar({ lang = 'es' }: Props) {
  const isEn = lang === 'en';
  const isPt = lang === 'pt';

  return (
    <aside 
      aria-label="Aviso de salidas y disponibilidad"
      className="relative z-50 bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-amber-500/20 border-b border-amber-500/35 backdrop-blur-md text-amber-200 py-2 px-4 text-center text-[11px] sm:text-xs font-mono tracking-wider"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-black font-black text-[10px] uppercase tracking-widest animate-pulse">
          <Sparkles className="w-3 h-3 text-black" />
          {isEn ? 'SPOTS OPEN' : isPt ? 'VAGAS ABERTAS' : 'CUPOS ABIERTOS'}
        </span>

        <span className="text-white/90 font-medium">
          {isEn
            ? 'Feeling spontaneous? Grab an open spot for this weekend in the Andes'
            : isPt
            ? 'Decidindo em cima da hora? Garanta sua vaga para este fim de semana nos Andes'
            : '¿Subes este fin de semana? Asegura tu cupo en las próximas salidas guiadas'}
        </span>

        <Link
          href="#fechas-abiertas"
          className="inline-flex items-center gap-1 text-amber-300 hover:text-white font-bold underline underline-offset-4 transition-colors ml-1"
        >
          <span>{isEn ? 'View departures' : isPt ? 'Ver datas' : 'Ver fechas disponibles'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
