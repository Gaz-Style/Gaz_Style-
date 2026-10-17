'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, Backpack, Sparkles, AlertCircle } from 'lucide-react';

interface GearItem {
  id: string;
  name: string;
  category: 'esencial' | 'clima' | 'adicional';
  description: string;
  required: boolean;
}

const DEFAULT_GEAR: GearItem[] = [
  {
    id: 'calzado',
    name: 'Calzado con buen agarre',
    category: 'esencial',
    description: 'Zapatillas de trail running o botas con suela de relieve adherente (evitar zapatillas urbanas de suela lisa).',
    required: true,
  },
  {
    id: 'capas',
    name: 'Sistema de 3 capas térmicas',
    category: 'clima',
    description: 'Primera capa transpirable + abrigo térmico ligero (polar/pluma) + cortaviento impermeable.',
    required: true,
  },
  {
    id: 'agua',
    name: 'Hidratación (1.5L a 2L de agua)',
    category: 'esencial',
    description: 'En cordillera la baja humedad acelera la deshidratación. Llevar en botella reutilizable o camelbak.',
    required: true,
  },
  {
    id: 'linterna',
    name: 'Linterna Frontal con batería llena',
    category: 'esencial',
    description: 'Indispensable para el descenso al atardecer o cumbre de alba. Deja ambas manos libres para apoyo.',
    required: true,
  },
  {
    id: 'solar',
    name: 'Protección solar completa',
    category: 'clima',
    description: 'Lentes con filtro UV400, bloqueador solar SPF 50+ y gorro o jockey para protegerte del sol andino.',
    required: true,
  },
  {
    id: 'snack',
    name: 'Ración de marcha personal',
    category: 'esencial',
    description: 'Frutos secos, barra energética, fruta o sándwich liviano para reponer energía en cumbre.',
    required: false,
  },
  {
    id: 'bastones',
    name: 'Bastones de trekking (recomendados)',
    category: 'adicional',
    description: 'Reducen hasta un 30% el impacto en las rodillas durante la bajada y dan estabilidad en terreno suelto.',
    required: false,
  },
];

export default function PackingChecklistWidget({ customGear }: { customGear?: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalItems = DEFAULT_GEAR.length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progressPercent = Math.round((checkedCount / totalItems) * 100);

  return (
    <section
      className="p-6 sm:p-8 rounded-3xl"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block mb-1">
            Mochila & Equipamiento
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Backpack className="w-5 h-5 text-amber-400" /> Checklist Interactivo de Equipo
          </h3>
        </div>

        {/* Barra de progreso */}
        <div className="text-right sm:min-w-[140px] w-full sm:w-auto">
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-mono mb-1">
            <span className="text-white/60">Tu Mochila:</span>
            <span className="text-amber-400 font-bold">{checkedCount}/{totalItems} listos</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-white/70 font-light mb-6">
        Marca los elementos conforme los guardes en tu mochila. Nuestros guías revisarán el equipo esencial en el punto de encuentro antes de comenzar la marcha.
      </p>

      <div className="divide-y divide-white/10">
        {DEFAULT_GEAR.map((item) => {
          const isDone = Boolean(checked[item.id]);
          return (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              className="py-3.5 flex items-start gap-3.5 cursor-pointer select-none transition-colors group hover:bg-white/[0.02] -mx-2 px-2 rounded-xl"
            >
              {/* Casilla de relleno / Checkbox interactivo */}
              <div className="pt-0.5 shrink-0">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  isDone 
                    ? 'bg-amber-500 border-amber-400 text-stone-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]' 
                    : 'border-white/30 bg-black/40 group-hover:border-amber-400/70'
                }`}>
                  {isDone && <CheckSquare className="w-4 h-4 text-stone-950 stroke-[3]" />}
                </div>
              </div>

              {/* Información directa sin tarjeta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <span className={`text-xs sm:text-sm font-bold uppercase tracking-tight ${
                    isDone ? 'line-through text-white/40' : 'text-white'
                  }`}>
                    {item.name}
                  </span>
                  <span className={`text-[9px] font-mono uppercase tracking-wider ${
                    item.required ? 'text-amber-400/90 font-bold' : 'text-white/40'
                  }`}>
                    {item.required ? 'Obligatorio' : 'Recomendado'}
                  </span>
                </div>
                <p className={`text-[11px] sm:text-xs font-light mt-0.5 leading-relaxed ${
                  isDone ? 'text-white/30' : 'text-white/65'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {checkedCount === totalItems && (
        <div className="mt-5 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center animate-in fade-in">
          <p className="text-emerald-300 font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> ¡Mochila completa y lista para la cumbre!
          </p>
        </div>
      )}
    </section>
  );
}
