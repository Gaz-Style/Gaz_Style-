import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { Mountain, Users, ArrowRight, ShieldCheck, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export default async function OperacionesPage() {
    const supabase = getAdminClient();
    
    const { data: departures } = await supabase
        .from('agenda_departures')
        .select(`
            *,
            adventures_catalog (title, category)
        `)
        .in('status', ['scheduled', 'confirmed'])
        .gte('start_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true });

    return (
        <div className="min-h-screen gaz-premium-body bg-stone-950 text-slate-200 p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
                    <div>
                        <div className="inline-flex items-center gap-2 text-amber-500 text-xs font-bold tracking-widest uppercase mb-2">
                            <Mountain className="w-4 h-4" /> Despacho de Campo
                        </div>
                        <h1 className="text-4xl md:text-5xl font-editorial font-bold text-white">
                            Dashboard de <span className="text-amber-500 italic">Guía</span>
                        </h1>
                        <p className="text-slate-400 font-light mt-2">
                            Revisa tus próximas salidas y el estado del Check-in médico de tus pasajeros.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!departures || departures.length === 0 ? (
                        <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl glass-panel">
                            <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white">No hay salidas próximas</h3>
                            <p className="text-slate-500 mt-2">
                                No tienes expediciones agendadas o confirmadas en el calendario.
                            </p>
                        </div>
                    ) : (
                        departures.map((dep: any) => (
                            <div key={dep.id} className="glass-panel border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-1">{dep.adventures_catalog?.title}</h3>
                                <p className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-6">
                                    {new Date(dep.start_date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                                
                                <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/5 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-[10px] uppercase text-slate-500 font-bold">Inscritos</p>
                                            <p className="text-xl font-bold text-white">{dep.current_pax} <span className="text-sm text-slate-500 font-light">/ {dep.adventures_catalog?.max_pax}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="text-[10px] uppercase text-slate-500 font-bold">Estado</p>
                                            <p className="text-sm font-bold text-green-400 capitalize">{dep.status === 'confirmed' ? 'Go (Confirmada)' : 'Programada'}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link href={`/admin/operaciones/${dep.id}`} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 transition-all">
                                    Ver Manifiesto y Fichas <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
