'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { getDictionary } from '@/lib/i18n';
import GlobalSearchModal from '@/components/GlobalSearchModal';

interface Props {
  currentLang: string;
}

export default function FloatingNavbar({ currentLang }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lockVisibleUntil = 0;

    const handleForceShow = (e: Event) => {
      const customEvent = e as CustomEvent;
      const duration = customEvent?.detail?.duration || 1500;
      lockVisibleUntil = Date.now() + duration;
      setIsVisible(true);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Si está bloqueado para mantenerse visible (ej: al presionar el botón de desafíos)
      if (Date.now() < lockVisibleUntil) {
        setIsVisible(true);
        lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
        return;
      }

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
    window.addEventListener('show-floating-navbar', handleForceShow);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('show-floating-navbar', handleForceShow);
    };
  }, []);

  const [valueIndex, setValueIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);

  // Mensajes que rotan suavemente cada 4.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setValueIndex((prev) => (prev + 1) % 3);
        setFadeState(true);
      }, 400); // 400ms de desvanecimiento
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const VALUES_TICKER = [
    { icon: '🌿', text: 'Cuidamos el planeta · Sin Dejar Rastro', accent: 'text-emerald-200/90' },
    { icon: '🤝', text: 'Apoyamos y fortalecemos economías locales', accent: 'text-amber-200/90' },
    { icon: '🏔️', text: 'Conservación activa de la cordillera andina', accent: 'text-sky-200/90' },
  ];

  const dict = getDictionary(currentLang);

  const navLinks = [
    { href: '#expediciones', label: currentLang === 'en' ? 'Expeditions' : 'Expediciones' },
    { href: '#niveles', label: currentLang === 'en' ? 'Levels' : 'Niveles' },
    { href: '#fechas-abiertas', label: currentLang === 'en' ? 'Departures' : 'Fechas Abiertas' },
    { href: '#atlas', label: 'Atlas' },
    { href: '#circulo', label: currentLang === 'en' ? 'Community' : 'Comunidad' },
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
          className="rounded-2xl md:rounded-full px-3.5 sm:px-7 min-h-[58px] sm:min-h-[72px] py-1 flex justify-between items-center transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-white/10"
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

          {/* Acciones: Buscador, Selector de Idioma & Menú Móvil */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Buscador Desktop (Cápsula elegante con tecla rápida ⌘K) */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all text-xs group"
              aria-label="Buscar cumbres o rutas"
            >
              <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-stone-300">Buscar...</span>
              <kbd className="font-mono text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-stone-400 border border-white/10">⌘K</kbd>
            </button>

            {/* Buscador Móvil / Tablet (Ícono Lupa al estilo Much Better Adventures) */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Buscar cumbres o rutas"
            >
              <Search className="w-5 h-5 text-amber-400" />
            </button>

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
            {/* Acceso directo a búsqueda dentro del menú móvil */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="py-2.5 px-3 rounded-lg text-xs uppercase tracking-[0.2em] font-bold text-amber-400 hover:bg-white/10 transition-colors flex items-center gap-2 text-left"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Buscar Cumbres & Rutas</span>
            </button>

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

        {/* BANDA ANIMADA TIPO TICKER FLOTANTE DEBAJO DEL MENÚ + BADGE DE GOOGLE */}
        <div className="flex flex-col items-center gap-1.5 mt-2 pointer-events-auto">
          {/* Ticker de Valores Ambientales y Locales (Solo texto limpio sin fondo ni contenedor) */}
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono select-none transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            <span className="text-xs transition-transform duration-300 hover:scale-110">
              {VALUES_TICKER[valueIndex].icon}
            </span>
            <span 
              className={`transition-all duration-400 ease-in-out font-medium tracking-wide ${
                fadeState ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
              } ${VALUES_TICKER[valueIndex].accent}`}
            >
              {VALUES_TICKER[valueIndex].text}
            </span>
          </div>

          {/* Badge de Google ubicado justo debajo de la banda ambiental (Mate sin brillo) */}
          <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 text-sm sm:text-base font-mono text-white/90 select-none whitespace-nowrap mt-0.5">
            <span className="text-amber-400 font-bold tracking-widest text-base sm:text-lg">★★★★★</span>
            <span className="font-bold text-white tracking-wider">4.9/5 Google</span>
          </div>
        </div>

      </div>

      {/* Modal Buscador Instantáneo Global */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        lang={currentLang}
      />
    </header>
  );
}
