'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function GuideRadioWidget() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Al estar en el tope de la página, siempre visible
      if (currentScrollY < 40) {
        setIsVisible(true);
      } else {
        // Si el usuario hace scroll hacia ABAJO, ocultar para no estorbar la lectura
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 8) {
          setIsVisible(false);
        } 
        // Si el usuario retrocede / hace scroll hacia ARRIBA, mostrar inmediatamente
        else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 6) {
          setIsVisible(true);
        }
      }

      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  // No mostrar en rutas administrativas o de control interno
  if (
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/portal-aventureros') || 
    pathname?.startsWith('/check-in')
  ) {
    return null;
  }

  const whatsappMessage = encodeURIComponent(
    '¡Hola Gaz! Te escribo desde la web de Santiago Hiking, me gustaría conversar contigo sobre las rutas y salidas.'
  );

  return (
    <aside 
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ease-out transform flex ${
        isVisible 
          ? 'translate-x-0 opacity-100 pointer-events-auto' 
          : 'translate-x-full opacity-0 pointer-events-none'
      }`}
      aria-label="Hablar con Guía"
    >
      <a
        href={`https://wa.me/56957958467?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Hablar con el Guía Gaz por WhatsApp"
        className="group flex flex-col items-center justify-center gap-2 py-3 px-1.5 sm:py-4 sm:px-2.5 rounded-l-xl shadow-[-4px_0_25px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-x-1 hover:bg-stone-900/90 active:scale-95 cursor-pointer select-none border-t border-l border-b border-white/20 bg-stone-950/85 sm:bg-white/10 backdrop-blur-xl"
        style={{
          borderRight: 'none',
        }}
      >
        {/* Texto Vertical */}
        <span className="[writing-mode:vertical-rl] rotate-180 text-[9px] sm:text-[11px] font-mono tracking-[0.16em] sm:tracking-[0.18em] font-bold text-white/90 group-hover:text-amber-300 transition-colors uppercase py-1">
          HABLAR CON GUÍA
        </span>

        {/* Ícono de WhatsApp */}
        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
      </a>
    </aside>
  );
}
