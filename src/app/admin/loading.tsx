import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-950 text-slate-500 font-sans">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
      <p className="text-sm font-semibold uppercase tracking-widest animate-pulse">
        Cargando Módulo...
      </p>
    </div>
  );
}
