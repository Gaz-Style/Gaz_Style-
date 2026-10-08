import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { ClipboardList, Download, WifiOff, Users, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OperacionesPage() {
    const supabase = await createClient();
    
    // Obtenemos salidas confirmadas (status = 'confirmed')
    const { data: departures } = await supabase
        .from('agenda_departures')
        .select(`
            *,
            adventures_catalog (title, category)
        `)
        .eq('status', 'confirmed')
        .order('start_date', { ascending: true });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
                    <div>
                        <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2">
                            <ClipboardList className="w-4 h-4" /> Despacho de Campo
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                            Manifiestos <span className="font-bold">Offline</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-2">
                            Descarga la lista de pasajeros y alertas médicas para uso sin conexión en la montaña.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!departures || departures.length === 0 ? (
                        <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                            <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-300">No hay salidas "Confirmadas" (Go)</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                Ve a la Agenda Operativa y marca una salida como "Confirmada" para generar su manifiesto.
                            </p>
                        </div>
                    ) : (
                        departures.map(dep => (
                            <div key={dep.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4">
                                    <WifiOff className="w-5 h-5 text-slate-700 group-hover:text-blue-500/30 transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{dep.adventures_catalog?.title}</h3>
                                <p className="text-sm text-blue-500 font-semibold uppercase mb-6">
                                    Salida: {new Date(dep.start_date).toLocaleDateString('es-ES')}
                                </p>
                                
                                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800 mb-6">
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-500 font-bold">Pax Confirmados</p>
                                        <p className="text-2xl font-black text-slate-200">{dep.current_pax}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase text-slate-500 font-bold">Estado</p>
                                        <p className="text-sm font-bold text-green-500">Go (Despacho Autorizado)</p>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <Download className="w-4 h-4" />
                                    Sincronizar PWA (Offline)
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
