'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    let timer: NodeJS.Timeout;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // Si está en el tope (< 300px), ocultar inmediatamente
      if (currentY < 300) {
        setIsVisible(false);
        if (timer) clearTimeout(timer);
        return;
      }

      // Al escrolear, emerge la pestaña desde el borde inferior
      setIsVisible(true);

      // Limpia contador previo
      if (timer) clearTimeout(timer);

      // Desaparece después de 3 segundos para no interrumpir la lectura
      timer = setTimeout(() => {
        if (!isHoveredRef.current) {
          setIsVisible(false);
        }
      }, 3000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!mounted) return null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <aside
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-40 transform transition-all ${
        isVisible
          ? 'duration-350 ease-out translate-y-0 opacity-100 pointer-events-auto'
          : 'duration-700 ease-in-out translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-label="Volver al inicio"
    >
      <button
        type="button"
        onClick={scrollToTop}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        title="Volver al inicio"
        className="group flex items-center justify-center gap-3 px-12 sm:px-16 pt-4 sm:pt-5 rounded-t-2xl sm:rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 cursor-pointer select-none"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
          borderBottom: 'none',
          paddingBottom: 'max(1.5rem, calc(0.85rem + env(safe-area-inset-bottom, 0px)))',
        }}
      >
        <ArrowUp className="w-4 h-4 text-amber-400 group-hover:-translate-y-1 transition-transform duration-200" />
        <span className="text-[11px] sm:text-xs font-mono tracking-[0.22em] font-bold text-white/90 group-hover:text-amber-300 transition-colors uppercase">
          INICIO
        </span>
      </button>
    </aside>
  );
}
