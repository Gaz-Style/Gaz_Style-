'use client';

import { useState } from 'react';
import { ShieldCheck, HeartPulse, Phone, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { saveCheckInDetails } from '../actions';

export default function CheckInClient({ booking }: { booking: any }) {
    const adv = booking.crm_adventurers;
    const title = booking.agenda_departures?.adventures_catalog?.title;
    const date = new Date(booking.agenda_departures?.start_date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    const [form, setForm] = useState({
        emergency_contact_name: adv.emergency_contact_name || '',
        emergency_contact_phone: adv.emergency_contact_phone || '',
        allergies: adv.allergies || 'Ninguna',
        blood_type: adv.blood_type || 'Desconocido'
    });
    const [accepted, setAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(booking.waiver_signed);

    const handleSubmit = async () => {
        if (!accepted) return alert("Debes aceptar los términos y condiciones de la liberación de responsabilidad.");
        setIsSubmitting(true);
        try {
            await saveCheckInDetails(booking.id, adv.id, form);
            setIsDone(true);
        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar tu información. Por favor, intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDone) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-8 glass-panel border-green-500/30 rounded-3xl text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-editorial font-bold text-white mb-2">¡Check-in Completado!</h2>
                <p className="text-slate-400 font-light mb-6">
                    Tus datos médicos han sido registrados y el Waiver ha sido firmado digitalmente. Estás listo para tu aventura a {title}.
                </p>
                <div className="bg-green-500/10 text-green-400 p-4 rounded-xl text-sm border border-green-500/20">
                    Nos vemos el {date}. ¡Prepárate para la experiencia!
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h1 className="text-3xl font-editorial font-bold text-white mb-2">Check-in Digital y Ficha Médica</h1>
                <p className="text-slate-400 font-light">Completa tu información de seguridad antes de la salida.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-blue-500/20 bg-blue-500/5">
                <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">Tu Expedición</p>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-slate-300 text-sm mt-1">{date} · Pasajero: {adv.first_name} {adv.last_name}</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-bold text-white">Ficha Médica</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field 
                        label="Grupo Sanguíneo" 
                        value={form.blood_type} 
                        onChange={(v: string) => setForm(f => ({...f, blood_type: v}))} 
                        placeholder="Ej: O+" 
                    />
                    <Field 
                        label="Alergias o Enfermedades Crónicas" 
                        value={form.allergies} 
                        onChange={(v: string) => setForm(f => ({...f, allergies: v}))} 
                        placeholder="Especifique si aplica" 
                    />
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-bold text-white">Contacto de Emergencia</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field 
                        label="Nombre Completo" 
                        value={form.emergency_contact_name} 
                        onChange={(v: string) => setForm(f => ({...f, emergency_contact_name: v}))} 
                        placeholder="Nombre de un familiar/amigo" 
                    />
                    <Field 
                        label="Teléfono Móvil" 
                        value={form.emergency_contact_phone} 
                        onChange={(v: string) => setForm(f => ({...f, emergency_contact_phone: v}))} 
                        placeholder="+56 9 1234 5678" 
                    />
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl border-amber-500/30 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-bold text-white">Liberación de Responsabilidades (Waiver)</h3>
                </div>
                
                <div className="text-xs text-slate-400 leading-relaxed space-y-3 max-h-48 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <p>Al participar en esta expedición, declaro estar en condiciones físicas y mentales adecuadas para realizar actividades de montaña.</p>
                    <p>Entiendo que el montañismo y el trekking son actividades de riesgo inherente que pueden resultar en lesiones, daños a la propiedad o, en casos extremos, la muerte.</p>
                    <p>Eximo a Gaz_Style Turismo Spa y a sus guías de cualquier responsabilidad legal, civil o penal frente a accidentes derivados de mi propia negligencia o desacato de las instrucciones del guía a cargo.</p>
                    <p>Autorizo al personal a cargo a tomar las decisiones médicas de emergencia pertinentes en caso de no poder hacerlo por mi cuenta, y asumo los costos que de esto deriven.</p>
                </div>

                <label className="flex items-start gap-4 p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                    <input 
                        type="checkbox" 
                        checked={accepted} 
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-slate-600 text-amber-500 focus:ring-amber-500 bg-black/50" 
                    />
                    <div>
                        <span className="text-sm font-bold text-white block">Acepto los términos y el Waiver</span>
                        <span className="text-xs text-slate-400 mt-1 block">He leído y entiendo las condiciones de participación. Mi firma digital quedará registrada junto con mi IP y fecha.</span>
                    </div>
                </label>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isSubmitting || !accepted || !form.emergency_contact_name || !form.emergency_contact_phone}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-black font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3"
            >
                {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Procesando Firma...</>
                ) : (
                    <><ShieldCheck className="w-5 h-5" /> Firmar y Finalizar Check-in</>
                )}
            </button>
        </div>
    );
}

function Field({ label, value, onChange, placeholder }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
        </div>
    );
}
