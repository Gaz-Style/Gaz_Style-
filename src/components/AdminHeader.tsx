'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ArrowLeft, Bell, Search, Mountain } from 'lucide-react';

import { logoutAction } from '@/app/admin/login/actions';

interface AdminHeaderProps {
  hasUser: boolean;
}

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

export default function AdminHeader({ hasUser }: AdminHeaderProps) {
  const pathname = usePathname();
  const isSubpage = pathname !== '/admin';
  const isPOS = pathname === '/admin/pos';
  const isLogin = pathname === '/admin/login';

  // Find matching module name
  if (isPOS || isLogin) return null;
  const currentModuleKey = Object.keys(moduleNames).find(key => 
    pathname === key || (key !== '/admin' && pathname?.startsWith(key))
  );
  const currentModuleName = currentModuleKey ? moduleNames[currentModuleKey] : 'Administración';

  return (
    <header className="hidden lg:flex sticky top-0 w-full h-20 bg-[#0f1115]/80 backdrop-blur-xl border-b border-white/5 z-40 items-center justify-between px-6 md:px-8">
      <div className="flex items-center gap-4">
        {/* Navigation Breadcrumb / Module Indicator */}
        <div className="flex items-center gap-3">
          {hasUser && isSubpage && (
            <Link 
              href="/admin" 
              className="flex items-center justify-center p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <div className="flex flex-col">
            <span className="text-[9px] uppercase text-primary font-black tracking-widest flex items-center gap-1.5">
              <Mountain className="w-3 h-3" />
              Gaz Style Expeditions
            </span>
            <span className="text-sm font-bold text-white tracking-wide">{currentModuleName}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {hasUser && (
          <>
            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-3">
                <button className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse"></span>
                </button>
                <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
            </div>

            <form action={logoutAction}>
              <button 
                type="submit" 
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-300 hover:text-white transition-all px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400"
              >
                <span className="hidden md:inline">Cerrar Sesión</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        )}
      </div>
    </header>
  );
}
