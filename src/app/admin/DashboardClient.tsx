'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart3, Users, Map, CalendarDays, TrendingUp, TrendingDown,
  ArrowRight, Package, Clock, CheckCircle2
} from 'lucide-react';

export default function DashboardClient({ data }: { data: any }) {
  const { totalAdventurers, totalRoutes, upcomingDepartures, totalRevenue, netResult } = data;

  const kpis = [
    {
      label: 'Resultado Neto',
      value: `$${netResult.toLocaleString('es-CL')}`,
      icon: netResult >= 0 ? TrendingUp : TrendingDown,
      color: netResult >= 0 ? 'text-green-400' : 'text-red-400',
      border: netResult >= 0 ? 'border-green-500/20' : 'border-red-500/20',
      sub: 'Ingresos - Egresos - Nómina',
      href: '/admin/finance',
    },
    {
      label: 'Ingresos Acumulados',
      value: `$${totalRevenue.toLocaleString('es-CL')}`,
      icon: BarChart3,
      color: 'text-blue-400',
      border: 'border-slate-800',
      sub: 'Reservas cobradas',
      href: '/admin/finance',
    },
    {
      label: 'Aventureros CRM',
      value: totalAdventurers,
      icon: Users,
      color: 'text-slate-200',
      border: 'border-slate-800',
      sub: 'Pasajeros registrados',
      href: '/admin/registro-aventurero',
    },
    {
      label: 'Rutas Activas',
      value: totalRoutes,
      icon: Map,
      color: 'text-slate-200',
      border: 'border-slate-800',
      sub: 'En catálogo DMC',
      href: '/admin/creador-rutas',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">

        {/* Header */}
        <header className="pb-6 border-b border-slate-800">
          <p className="text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2">Gaz Style Expeditions OS</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
            Dashboard <span className="font-bold">Central</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2">
            Estado operativo en tiempo real. {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map(k => (
            <Link key={k.label} href={k.href} className={`bg-slate-900 border ${k.border} rounded-xl p-6 hover:border-blue-500/40 transition-all group`}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{k.label}</p>
                <k.icon className={`w-5 h-5 ${k.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              </div>
              <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-xs text-slate-600 mt-2">{k.sub}</p>
            </Link>
          ))}
        </div>

        {/* Upcoming Departures */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              Próximas Salidas
            </h2>
            <Link href="/admin/calendario" className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1">
              Ver Agenda <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {upcomingDepartures.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
              <Clock className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No hay salidas programadas. <Link href="/admin/calendario" className="text-blue-500 hover:underline">Agenda una ahora.</Link></p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDepartures.slice(0, 5).map((dep: any) => {
                const adv = dep.adventures_catalog;
                return (
                  <div key={dep.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-6 hover:border-slate-700 transition-colors">
                    <div className="text-center min-w-[60px]">
                      <p className="text-2xl font-black text-white">{new Date(dep.start_date).getDate()}</p>
                      <p className="text-[10px] font-semibold text-blue-500 uppercase">
                        {new Date(dep.start_date).toLocaleString('es-ES', { month: 'short' })}
                      </p>
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-slate-200">{adv?.title || 'Ruta'}</p>
                      <p className="text-[10px] text-slate-500 uppercase mt-0.5">{adv?.category} · {dep.current_pax} Pax</p>
                    </div>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                      dep.status === 'confirmed'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {dep.status === 'confirmed' ? 'Go ✓' : 'Programada'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-5">Acceso Rápido</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Nueva Ruta', href: '/admin/creador-rutas', icon: Map },
              { label: 'Registrar Aventurero', href: '/admin/registro-aventurero', icon: Users },
              { label: 'Agendar Salida', href: '/admin/calendario', icon: CalendarDays },
              { label: 'Registrar Gasto', href: '/admin/finance', icon: BarChart3 },
            ].map(a => (
              <Link key={a.label} href={a.href} className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 flex flex-col items-center justify-center gap-3 text-center group transition-all">
                <a.icon className="w-6 h-6 text-slate-500 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">{a.label}</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
