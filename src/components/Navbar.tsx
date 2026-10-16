'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith('/admin')) return null;

  const navLinks = [
    { href: '/cumbres', label: 'Cumbres & Rutas' },
    { href: '/#travesias-desafios', label: 'Desafíos' },
    { href: '/faq', label: 'FAQ & Seguridad' },
  ];

  const isHome = pathname === '/';

  return (
    <nav className="fixed top-0 w-full z-50 bg-stone-950/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between relative">
        {/* Left Area: Back Button & Official Brand Logo */}
        <div className="flex items-center gap-4">
          {!isHome && (
            <button 
              onClick={() => router.back()}
              className="flex items-center justify-center p-2 -ml-2 text-white/70 hover:text-white transition-all duration-300 z-50 group"
              aria-label="Volver atrás"
            >
              <ArrowLeft className="w-5 h-5 text-white/80 group-hover:scale-110 transition-transform duration-300" />
            </button>
          )}
          
          <Link href="/" className="flex items-center group transition-transform duration-200 hover:scale-[1.02]">
            <Image
              src="/logotipo blanco.png"
              alt="Santiago Hiking"
              width={260}
              height={65}
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.15em] font-mono text-white/70 font-semibold">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="hover:text-amber-400 transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="/reservar" 
            className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            Reservar Salida
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white"
          aria-label="Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-stone-950 border-b border-white/10 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-sm font-mono uppercase tracking-wider text-stone-300 hover:text-amber-400"
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="/reservar"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center py-3 rounded-xl bg-amber-500 text-stone-950 font-bold font-mono text-xs uppercase tracking-wider"
          >
            Reservar Salida
          </Link>
        </div>
      )}
    </nav>
  );
}
