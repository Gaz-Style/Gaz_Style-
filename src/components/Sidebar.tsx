'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Activity,
    Calendar,
    Wallet,
    DollarSign,
    Package,
    Settings,
    ChevronLeft,
    ChevronRight,
    X,
    LogOut,
    Mail,
    MessageSquare,
    Mountain,
    MapPin,
    Compass,
    Map,
    UserPlus,
    Tent,
    CalendarDays,
    ClipboardList,
    Shield,
    HeartPulse
} from 'lucide-react';
import { logoutAction } from '@/app/admin/login/actions';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 🏔️ Módulos adaptados estrictamente para Trekking / Gaz Style
export const sidebarSections = [
    {
        title: 'RESERVAS & LOGÍSTICA',
        items: [
            { name: 'Dashboard Central', href: '/admin', icon: LayoutDashboard },
            { name: 'Calendario de Salidas', href: '/admin/calendario', icon: CalendarDays },
            { name: 'Manifiestos & Operaciones', href: '/admin/operaciones', icon: ClipboardList },
            { name: 'Diseñador de Rutas', href: '/admin/creador-rutas', icon: Map },
        ]
    },
    {
        title: 'SEGURIDAD & COMUNIDAD',
        items: [
            { name: 'Ficha Aventurero (CRM)', href: '/admin/registro-aventurero', icon: Shield },
            { name: 'Live Chat (Emergencia/Ventas)', href: '/admin/livechat', icon: MessageSquare },
        ]
    },
    {
        title: 'PRODUCTO & FINANZAS',
        items: [
            { name: 'Inventario (Gear Room)', href: '/admin/inventory', icon: Tent },
            { name: 'Control de Pagos', href: '/admin/finance', icon: Wallet },
        ]
    },
    {
        title: 'SISTEMA',
        items: [
            { name: 'Configuraciones', href: '/admin/settings', icon: Settings },
        ]
    }
];

export const sidebarItems = sidebarSections.flatMap(section => section.items);

export default function Sidebar({ 
    isCollapsed, 
    setIsCollapsed,
    isMobileOpen = false,
    setIsMobileOpen = () => {}
}: { 
    isCollapsed: boolean, 
    setIsCollapsed: (v: boolean) => void,
    isMobileOpen?: boolean,
    setIsMobileOpen?: (v: boolean) => void
}) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname, setIsMobileOpen]);

    if (!isMounted) return null;

    return (
        <>
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-md"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ 
                    width: isCollapsed ? 88 : 280,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
                }}
                className={cn(
                    "bg-[#0f1115] border-r border-white/5 flex-col fixed left-0 top-0 h-screen z-50 shadow-2xl transition-transform duration-300",
                    "lg:flex text-slate-300",
                    isMobileOpen ? "flex w-[280px]" : "hidden lg:flex"
                )}
            >
                {/* 🏔️ Header Premium */}
                <div className="flex items-center justify-between p-6 h-[90px] relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/20 to-transparent opacity-30 pointer-events-none" />
                    
                    <AnimatePresence mode="wait">
                        {(!isCollapsed || isMobileOpen) && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-3 relative z-10"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center shadow-lg shadow-primary/30">
                                    <Image src="/logo.png" alt="Gaz Style" width={24} height={24} className="object-contain" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-heading text-lg text-white font-black tracking-wide">GAZ STYLE</span>
                                    <span className="text-[9px] uppercase text-primary font-bold tracking-widest mt-0.5">Expeditions OS</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <button 
                        onClick={() => {
                            if (window.innerWidth < 1024) {
                                setIsMobileOpen(false);
                            } else {
                                setIsCollapsed(!isCollapsed);
                            }
                        }}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all ml-auto relative z-10"
                    >
                        <div className="hidden lg:block">
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </div>
                        <div className="lg:hidden">
                            <X size={16} />
                        </div>
                    </button>
                </div>

                {/* 🧭 Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
                    {sidebarSections.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                            {(!isCollapsed || isMobileOpen) && (
                                <div className="px-3 mb-3">
                                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                        {section.title}
                                    </span>
                                </div>
                            )}
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                                
                                return (
                                    <Link key={item.href} href={item.href} className="block group">
                                        <div className={cn(
                                            "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                                            isActive 
                                                ? "text-white bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary" 
                                                : "text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                                        )}>
                                            <item.icon 
                                                size={20} 
                                                className={cn(
                                                    "flex-shrink-0 transition-transform duration-300 group-hover:scale-110", 
                                                    isActive ? "text-primary drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" : ""
                                                )} 
                                            />
                                            
                                            <AnimatePresence mode="wait">
                                                {(!isCollapsed || isMobileOpen) && (
                                                    <motion.span
                                                        initial={{ opacity: 0, width: 0 }}
                                                        animate={{ opacity: 1, width: 'auto' }}
                                                        exit={{ opacity: 0, width: 0 }}
                                                        className="text-sm font-medium whitespace-nowrap"
                                                    >
                                                        {item.name}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ))}
                </nav>

                {/* 👤 Footer Premium */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className={cn("flex items-center justify-between", isCollapsed && !isMobileOpen ? "justify-center" : "")}>
                        <div className={cn("flex items-center", isCollapsed && !isMobileOpen ? "justify-center" : "gap-3")}>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-emerald-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-secondary/20 border border-emerald-500/30">
                                <span className="text-xs font-bold text-white">GZ</span>
                            </div>
                            {(!isCollapsed || isMobileOpen) && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col"
                                >
                                    <span className="text-sm font-bold text-white tracking-wide">Administrador</span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span> 
                                        <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">En Línea</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                            <form action={logoutAction}>
                                <button 
                                    type="submit"
                                    className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut size={18} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
