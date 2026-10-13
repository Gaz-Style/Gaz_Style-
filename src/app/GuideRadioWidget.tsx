'use client';

import React, { useState, useEffect } from 'react';

export default function GuideRadioWidget() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Al hacer scroll, desaparece de inmediato
      setIsScrolling(true);

      // Limpia el temporizador anterior
      clearTimeout(timeoutId);

      // Aparece suavemente al parar de escrolear (700ms)
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 700);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!mounted) return null;

  const whatsappMessage = encodeURIComponent(
    '¡Hola Gaz! Te escribo desde la web de Santiago Hiking, me gustaría conversar contigo sobre las rutas y salidas.'
  );

  return (
    <aside 
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-400 ease-out transform ${
        isScrolling 
          ? 'translate-x-full opacity-0 pointer-events-none' 
          : 'translate-x-0 opacity-100 pointer-events-auto'
      }`}
      aria-label="Hablar con Guía"
    >
      <a
        href={`https://wa.me/56957958467?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Hablar con el Guía Gaz"
        className="group flex flex-col items-center justify-center py-5 px-2 sm:px-2.5 rounded-l-xl shadow-[-4px_0_25px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-x-1 hover:bg-white/10 cursor-pointer select-none"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          borderRight: 'none',
        }}
      >
        {/* Texto Vertical en blanco */}
        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] sm:text-[11px] font-mono tracking-[0.18em] font-bold text-white/80 group-hover:text-amber-300 transition-colors uppercase py-1.5">
          HABLAR CON GUÍA
        </span>
      </a>
    </aside>
  );
}
