import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { Mountain, ArrowLeft, ShieldAlert, HeartPulse, Phone, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export default async function ManifiestoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = getAdminClient();
    
    // 1. Obtener los datos de la salida
    const { data: departure } = await supabase
        .from('agenda_departures')
        .select('*, adventures_catalog(title)')
        .eq('id', id)
        .single();

    if (!departure) {
        return <div className="p-12 text-white">Salida no encontrada.</div>;
    }

    // 2. Obtener los pasajeros (reservas pagadas o check-in)
    // Para Gaz Style, asumiremos que mostramos todas las reservas asociadas a esta salida.
    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
            id,
            total_price,
            payment_status,
            waiver_signed,
            waiver_signed_at,
            crm_adventurers (
                id, first_name, last_name, phone, email, 
                allergies, blood_type, emergency_contact_name, emergency_contact_phone
            )
        `)
        .eq('departure_id', id)
        .in('payment_status', ['paid', 'pending', 'approved']); // Mostramos incluso los pendientes por si pagan en efectivo.

    const dateStr = new Date(departure.start_date).toLocaleDateString('es-ES', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' });
    const passengers = bookings || [];
    
    // Stats
    const totalWaivers = passengers.filter(p => p.waiver_signed).length;

    return (
        <div className="min-h-screen gaz-premium-body bg-stone-950 text-slate-200 p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
                    <div>
                        <Link href="/admin/operaciones" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase mb-4">
                            <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-editorial font-bold text-white mb-2">
                            Manifiesto: <span className="text-amber-500 italic">{departure.adventures_catalog?.title}</span>
                        </h1>
                        <p className="text-slate-400 font-light flex items-center gap-2">
                            <Mountain className="w-4 h-4" /> {dateStr}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right bg-black/40 p-4 rounded-xl border border-white/5">
                            <p className="text-[10px] uppercase text-slate-500 font-bold">Waivers Firmados</p>
                            <p className={`text-2xl font-bold ${totalWaivers === passengers.length && passengers.length > 0 ? 'text-green-500' : 'text-amber-500'}`}>
                                {totalWaivers} <span className="text-sm text-slate-500">/ {passengers.length}</span>
                            </p>
                        </div>
                    </div>
                </header>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest">Lista de Pasajeros ({passengers.length})</h2>
                    
                    {passengers.length === 0 ? (
                        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl glass-panel">
                            <p className="text-slate-500">Aún no hay reservas registradas para esta salida.</p>
                        </div>
                    ) : (
                        passengers.map((booking: any, index: number) => {
                            const adv = booking.crm_adventurers;
                            if (!adv) return null;

                            return (
                                <div key={booking.id} className={`glass-panel border-l-4 rounded-2xl p-6 ${booking.waiver_signed ? 'border-l-green-500 border-white/5' : 'border-l-amber-500 border-white/5'}`}>
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        {/* Info Pasajero */}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-white/10 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                                <h3 className="text-xl font-bold text-white">{adv.first_name} {adv.last_name}</h3>
                                                {booking.payment_status === 'paid' || booking.payment_status === 'approved' ? (
                                                    <span className="text-[10px] uppercase tracking-wider font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-md border border-green-500/20">Pagado</span>
                                                ) : (
                                                    <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-500 px-2 py-1 rounded-md border border-amber-500/20">Pago Pendiente</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400 flex items-center gap-2"><Phone className="w-3 h-3" /> {adv.phone}</p>
                                        </div>

                                        {/* Estado Waiver */}
                                        <div className="md:w-64">
                                            {booking.waiver_signed ? (
                                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-bold text-green-400 uppercase tracking-wider">Check-in Listo</p>
                                                        <p className="text-[10px] text-green-500/70 mt-0.5">Firmado: {new Date(booking.waiver_signed_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3">
                                                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Falta Check-in</p>
                                                        <button 
                                                            className="text-[10px] mt-1 text-black bg-amber-500 hover:bg-amber-400 px-2 py-1 rounded transition-colors font-bold flex items-center gap-1"
                                                            onClick={() => {
                                                                // Copiar link al portapapeles
                                                                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/check-in/${booking.id}`);
                                                                alert('Enlace de check-in copiado al portapapeles. ¡Envíalo por WhatsApp al cliente!');
                                                            }}
                                                        >
                                                            Copiar Link <FileText className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ficha Médica (Solo si firmó) */}
                                    {booking.waiver_signed && (
                                        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-red-400">
                                                    <HeartPulse className="w-4 h-4" />
                                                    <h4 className="text-xs font-bold uppercase tracking-widest">Ficha Médica</h4>
                                                </div>
                                                <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-2">
                                                    <p className="text-sm"><span className="text-slate-500">Sangre:</span> <span className="font-bold text-white">{adv.blood_type || 'No especificado'}</span></p>
                                                    <p className="text-sm"><span className="text-slate-500">Alergias/Enf:</span> <span className="font-bold text-white">{adv.allergies || 'Ninguna reportada'}</span></p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-amber-500">
                                                    <ShieldAlert className="w-4 h-4" />
                                                    <h4 className="text-xs font-bold uppercase tracking-widest">Emergencia</h4>
                                                </div>
                                                <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-2">
                                                    <p className="text-sm"><span className="text-slate-500">Contacto:</span> <span className="font-bold text-white">{adv.emergency_contact_name || 'No ingresado'}</span></p>
                                                    <p className="text-sm"><span className="text-slate-500">Teléfono:</span> <span className="font-bold text-white">{adv.emergency_contact_phone || 'No ingresado'}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
