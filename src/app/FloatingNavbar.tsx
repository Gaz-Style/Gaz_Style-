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
    { href: '#salidas-grupales', label: '1. Grupales' },
    { href: '#travesias-desafios', label: '2. Desafíos' },
    { href: '#high-mountain', label: '3. High Mountain' },
    { href: '#expedition-boutique', label: '4. Boutique' },
    { href: '#niveles', label: 'Niveles' },
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
        
        {/* Cápsula Flotante Cristal Esmerilado Puro (True Frosted Glass) */}
        <div 
          className="rounded-2xl md:rounded-full px-3.5 sm:px-7 min-h-[72px] sm:min-h-[82px] py-1.5 flex justify-between items-center transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-white/10"
          style={{
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Logotipo Oficial Completo (Tamaño aumentado x3) */}
          <Link 
            href="/" 
            className="flex items-center group transition-transform duration-200 hover:scale-[1.02] py-0.5"
          >
            <Image
              src="/logotipo blanco.png"
              alt="Santiago Hiking"
              width={500}
              height={125}
              className="h-12 sm:h-14 md:h-16 w-auto max-w-[58vw] sm:max-w-none object-contain drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]"
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

        {/* Menú Desplegable Glassmorphism en Móvil */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden mt-2 rounded-2xl p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
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
