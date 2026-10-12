'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

interface Props {
  currentLang: string;
}

export default function FloatingNavbar({ currentLang }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Al estar en el tope de la página, siempre visible
      if (currentScrollY < 40) {
        setIsVisible(true);
        setScrolled(false);
      } else {
        setScrolled(true);

        // Si el usuario hace scroll hacia ABAJO, ocultar
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 8) {
          setIsVisible(false);
          setMobileMenuOpen(false); // Cierra menú desplegable móvil
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

  const navLinks = [
    { href: '#desafios', label: 'Desafíos' },
    { href: '#niveles', label: 'Niveles' },
    { href: '#rutas', label: 'Salidas' },
    { href: '#alianzas', label: 'Cielo, Mar & Tierra' },
    { href: '#circulo', label: 'Comunidad' },
  ];

  return (
    <header 
      className={`fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-350 ease-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-28 opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-6xl mx-auto pointer-events-auto">
        
        {/* Cápsula Flotante Cristal Oscuro Transparente de Alta Gama (Luxury Frosted Crystal) */}
        <div 
          className={`bg-stone-950/40 hover:bg-stone-950/50 backdrop-blur-2xl backdrop-saturate-150 border-t border-white/30 border-x border-white/15 border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_16px_40px_rgba(0,0,0,0.35)] rounded-2xl md:rounded-full px-4 sm:px-7 h-16 sm:h-18 flex justify-between items-center transition-all duration-300 ${
            scrolled ? 'bg-stone-950/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_45px_rgba(0,0,0,0.45)] border-t-white/35' : ''
          }`}
        >
          {/* Logotipo Blanco + Texto SANTIAGO en blanco */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 sm:gap-3 group transition-transform duration-200 hover:scale-[1.02]"
          >
            {/* Isotipo Oficial SH en Blanco */}
            <Image
              src="/logo-sh-white.png"
              alt="Santiago Hiking"
              width={44}
              height={44}
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
              priority
            />
            
            {/* Logotipo Oficial 19 (SANTIAGO en blanco + HIKING en ámbar) */}
            <Image
              src="/logo-text-white.png"
              alt="Santiago Hiking"
              width={220}
              height={32}
              className="h-5 sm:h-6 md:h-7 w-auto object-contain drop-shadow-xs"
              priority
            />
          </Link>

          {/* Menú de Navegación Rápida (Desktop en Cristal) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-stone-200">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-amber-400 hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Selector de Idioma & Botón Móvil */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher currentLang={currentLang} />
            
            {/* Botón Hamburger Móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable Glassmorphism en Móvil (Cristal Oscuro) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-stone-950/75 backdrop-blur-2xl border-t border-white/25 border-x border-white/15 border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-xs uppercase tracking-[0.2em] font-bold text-stone-200 hover:bg-white/10 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

      </div>
    </header>
  );
}
