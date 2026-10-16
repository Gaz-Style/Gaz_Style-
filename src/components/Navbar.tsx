'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowLeft, Mountain, Compass, Sparkles } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    if (pathname.startsWith('/admin')) return null;

    const navLinks = [
        { href: '/cumbres', label: 'Cumbres & Rutas', badge: 'Nuevo' },
        { href: '/desafios', label: 'Desafíos' },
        { href: '/faq', label: 'FAQ & Seguridad' },
        { href: '/modelo-negocio', label: 'Nosotros' },
    ];

    const isHome = pathname === '/';

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-[#0a0d0f]/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between relative">
                    {/* Left Area: Back Button (History) & Brand Logo */}
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
                        
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                                <Mountain className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-sans text-base md:text-lg font-black uppercase text-white tracking-wider leading-none">
                                    Santiago<span className="text-amber-400">Hiking</span>
                                </span>
                                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 mt-1">
                                    by Gaz_Style
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.15em] font-mono text-white/70 font-semibold">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href} 
                                className={`transition-colors flex items-center gap-1.5 ${
                                    pathname.startsWith(link.href) 
                                        ? 'text-amber-400 font-bold' 
                                        : 'hover:text-white'
                                }`}
                            >
                                <span>{link.label}</span>
                                {link.badge && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                        <Link 
                            href="/reservar" 
                            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 whitespace-nowrap"
                        >
                            Reservar Salida
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-white/80 hover:text-white z-50"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-0 w-full bg-[#0a0d0f]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-5 shadow-2xl z-40 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`text-sm font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-between py-2 border-b border-white/5 ${
                                    pathname.startsWith(link.href) ? 'text-amber-400' : 'text-white/80'
                                }`}
                            >
                                <span>{link.label}</span>
                                {link.badge && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                        <Link
                            href="/reservar"
                            onClick={() => setIsOpen(false)}
                            className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-mono font-bold text-xs uppercase tracking-wider text-center shadow-lg shadow-amber-500/20"
                        >
                            Reservar Salida al Atardecer
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
