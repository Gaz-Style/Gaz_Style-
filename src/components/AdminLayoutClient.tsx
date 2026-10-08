'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Menu, ArrowLeft, Mountain } from 'lucide-react';

const moduleNames: Record<string, string> = {
  '/admin': 'Dashboard Central',
  '/admin/pos': 'Punto de Venta',
  '/admin/caja': 'Caja Diaria',
  '/admin/sales': 'Registro de Ventas',
  '/admin/crm': 'Aventureros & Clienteling',
  '/admin/agenda': 'Agenda de Expediciones',
  '/admin/catalog': 'Rutas y Servicios',
  '/admin/inventory': 'Equipamiento & Inventario',
  '/admin/finance': 'Finanzas Operativas',
  '/admin/settings': 'Configuraciones',
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isPOS = pathname === '/admin/pos';
  const isLogin = pathname === '/admin/login';
  const hideHeader = isPOS || isLogin;

  const currentModuleKey = Object.keys(moduleNames).find(key => 
    pathname === key || (key !== '/admin' && pathname?.startsWith(key))
  );
  const currentModuleName = currentModuleKey ? moduleNames[currentModuleKey] : 'Administración';
  
  return (
    <div className={cn(
      "flex min-h-screen w-full bg-[#0f1115] text-white font-sans selection:bg-primary/30",
      !hideHeader && "lg:-mt-20"
    )}>
      
      {/* Mobile Top Bar */}
      {!isLogin && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f1115]/90 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {pathname !== '/admin' && (
            <Link 
              href="/admin" 
              className="flex items-center justify-center p-2 -ml-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-primary font-black tracking-widest flex items-center gap-1.5">
              <Mountain className="w-3 h-3" />
              Gaz Style
            </span>
            <span className="text-xs font-bold text-slate-300 tracking-wide mt-0.5">{currentModuleName}</span>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>
      )}

      {!isLogin && (
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      )}

      <div 
        className={cn(
            "flex-1 transition-all duration-300 relative flex flex-col min-h-screen overflow-x-hidden pt-16 lg:pt-0",
            !isLogin && (isCollapsed ? "ml-0 lg:ml-[88px]" : "ml-0 lg:ml-[280px]")
        )}
      >
        {children}
      </div>
    </div>
  );
}
