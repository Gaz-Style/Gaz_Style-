'use client';

import React, { useState } from 'react';
import {
    Mountain, Calendar, Users, CreditCard, ChevronRight,
    Clock, Star, MapPin, Shield, ArrowRight, Loader2, CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { createBookingWithMercadoPago } from './actions';

function getDifficultyColor(level: string) {
    if (!level) return 'text-slate-400 bg-slate-800';
    if (level.toLowerCase().includes('alta') || level.toLowerCase().includes('experto')) return 'text-red-400 bg-red-500/10 border border-red-500/20';
    if (level.toLowerCase().includes('media')) return 'text-orange-400 bg-orange-500/10 border border-orange-500/20';
    return 'text-green-400 bg-green-500/10 border border-green-500/20';
}

export default function BookingClient({ departures, initialAdventureId }: { departures: any[], initialAdventureId?: string }) {
    // If a route was passed from the homepage, filter the departures to show only those for that route
    const filteredDepartures = initialAdventureId 
        ? departures.filter(dep => dep.adventures_catalog?.id === initialAdventureId)
        : departures;

    const initialSelected = filteredDepartures.length === 1 ? filteredDepartures[0] : null;
    const initialStep = filteredDepartures.length === 1 ? 'form' : 'select';

    const [selected, setSelected] = useState<any | null>(initialSelected);
    const [paxCount, setPaxCount] = useState(1);
    const [step, setStep] = useState<'select' | 'form' | 'processing'>(initialStep);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', phone: '',
        emergency_contact: '', medical_info: ''
    });
    const [acceptsWaiver, setAcceptsWaiver] = useState(false);

    const total = selected ? (selected.adventures_catalog?.base_price || 0) * paxCount : 0;
    const availableSpots = selected
        ? (selected.adventures_catalog?.max_pax || 0) - (selected.current_pax || 0)
        : 0;

    async function handlePay() {
        if (!selected) return;
        if (!acceptsWaiver) {
            alert('Debes aceptar el descargo de responsabilidad médico para continuar.');
            return;
        }
        setIsSubmitting(true);
        try {
            const result = await createBookingWithMercadoPago({
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                phone: form.phone,
                emergency_contact: form.emergency_contact,
                medical_info: form.medical_info,
                accepts_waiver: acceptsWaiver,
                departure_id: selected.id,
                pax_count: paxCount,
                adventure_title: selected.adventures_catalog?.title,
                unit_price: selected.adventures_catalog?.base_price || 0,
            });
            // Redirect to MercadoPago payment page
            window.location.href = result.payment_url!;
        } catch (err: any) {
            alert('Error al procesar el pago: ' + err.message);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">

            {/* Hero Banner */}
            <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-6 py-16 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
                <p className="text-blue-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">Gaz Style Expeditions</p>
                <h1 className="text-4xl md:text-6xl font-extralight tracking-tight text-white mb-4">
                    Reserva tu <span className="font-bold">Expedición</span>
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto text-lg">
                    Selecciona una salida disponible, completa tus datos y paga de forma segura con MercadoPago.
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {['Elige tu salida', 'Tus datos', 'Pago'].map((s, i) => {
                        const stepNum = i + 1;
                        const currentStep = step === 'select' ? 1 : step === 'form' ? 2 : 3;
                        return (
                            <React.Fragment key={s}>
                                <div className={`flex items-center gap-2 text-sm font-semibold ${currentStep >= stepNum ? 'text-blue-400' : 'text-slate-600'}`}>
                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${currentStep > stepNum ? 'bg-blue-500 border-blue-500 text-white' : currentStep === stepNum ? 'border-blue-500 text-blue-400' : 'border-slate-700 text-slate-600'}`}>
                                        {currentStep > stepNum ? '✓' : stepNum}
                                    </span>
                                    <span className="hidden md:block">{s}</span>
                                </div>
                                {i < 2 && <ChevronRight className="w-4 h-4 text-slate-700" />}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* STEP 1: Select Departure */}
                {step === 'select' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-white text-center mb-8">Salidas Disponibles</h2>
                        {filteredDepartures.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl">
                                <Mountain className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500">No hay salidas disponibles en este momento. Vuelve pronto.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredDepartures.map(dep => {
                                    const adv = dep.adventures_catalog;
                                    const spots = (adv?.max_pax || 0) - (dep.current_pax || 0);
                                    const isFull = spots <= 0;
                                    return (
                                        <div
                                            key={dep.id}
                                            onClick={() => { if (!isFull) { setSelected(dep); setPaxCount(1); setStep('form'); } }}
                                            className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all cursor-pointer group
                                                ${isFull ? 'opacity-50 cursor-not-allowed border-slate-800' : 'border-slate-800 hover:border-blue-500/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'}
                                            `}
                                        >
                                            {/* Card image / header */}
                                            <div className="relative h-32 overflow-hidden bg-slate-800 flex items-center justify-center">
                                                {adv?.image_url ? (
                                                    <Image
                                                        src={adv.image_url}
                                                        alt={adv.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <Mountain className="w-10 h-10 text-slate-700" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                                                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                                                    <div>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getDifficultyColor(adv?.difficulty_level)}`}>
                                                            {adv?.difficulty_level || 'N/A'}
                                                        </span>
                                                    </div>
                                                    {isFull && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full">LLENO</span>}
                                                    {selected?.id === dep.id && <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">✓ Seleccionada</span>}
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-white mb-1">{adv?.title}</h3>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">{adv?.category}</p>
                                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                                    <Calendar className="w-4 h-4 text-blue-500" />
                                                    <span>{new Date(dep.start_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                    <span>{adv?.duration_text || `${adv?.duration_days} día${adv?.duration_days > 1 ? 's' : ''}`}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                                    <Users className="w-4 h-4 text-blue-500" />
                                                    <span>{spots} cupo{spots !== 1 ? 's' : ''} disponible{spots !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="pt-3 border-t border-slate-800 flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] text-slate-500 uppercase">Precio por persona</p>
                                                        <p className="text-2xl font-black text-white">${Number(adv?.base_price).toLocaleString('es-CL')}</p>
                                                    </div>
                                                    {!isFull && (
                                                        <div className={`p-2 rounded-lg transition-all ${selected?.id === dep.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-400'}`}>
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                )}

                {/* STEP 2: Form */}
                {step === 'form' && selected && (
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                            {/* Resumen Superior */}
                            <div className="bg-blue-600/10 border-b border-blue-500/20 p-6 md:p-8">
                                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Tu reserva</p>
                                <h3 className="text-2xl font-bold text-white mb-2">{selected.adventures_catalog?.title}</h3>
                                <p className="text-blue-200 text-sm">
                                    {new Date(selected.start_date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>

                            <div className="p-6 md:p-8 space-y-8">
                                {/* Datos de Contacto */}
                                <div className="space-y-5">
                                    <h2 className="text-xl font-semibold text-white">Tus datos de contacto</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Nombre" name="first_name" value={form.first_name} onChange={(v: string) => setForm(f => ({...f, first_name: v}))} placeholder="Juan" />
                                        <Field label="Apellido" name="last_name" value={form.last_name} onChange={(v: string) => setForm(f => ({...f, last_name: v}))} placeholder="Pérez" />
                                    </div>
                                    <Field label="Correo electrónico" name="email" type="email" value={form.email} onChange={(v: string) => setForm(f => ({...f, email: v}))} placeholder="juan@mail.com" />
                                    <Field label="Teléfono" name="phone" value={form.phone} onChange={(v: string) => setForm(f => ({...f, phone: v}))} placeholder="+56 9 1234 5678" />

                                </div>

                                {/* Ficha Médica Básica */}
                                <div className="space-y-5 border-t border-slate-800 pt-8">
                                    <h2 className="text-xl font-semibold text-white">Ficha Médica y Check-in</h2>
                                    <p className="text-sm text-slate-400 font-light">Para tu seguridad en el cerro, necesitamos esta información clave antes de confirmar tu cupo.</p>
                                    
                                    <Field label="Contacto de Emergencia (Nombre y Teléfono)" name="emergency_contact" value={form.emergency_contact} onChange={(v: string) => setForm(f => ({...f, emergency_contact: v}))} placeholder="Ej: María Pérez, +569 8765 4321" />
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-400 uppercase">Alergias o condiciones médicas (Opcional)</label>
                                        <textarea
                                            value={form.medical_info}
                                            onChange={e => setForm(f => ({ ...f, medical_info: e.target.value }))}
                                            placeholder="Asma, alergia a picaduras, lesiones previas, etc."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                {/* Selección de Cupos y Total */}
                                <div className="border-t border-slate-800 pt-8 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-white font-semibold block">Cantidad de cupos</span>
                                            {availableSpots <= 5 ? (
                                                <span className="text-amber-500 text-xs mt-1 font-bold flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                    ¡Alta demanda! Últimos {availableSpots} cupos
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs mt-1 block">
                                                    Quedan {availableSpots} cupos disponibles
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 border border-slate-700 bg-slate-950 rounded-xl p-1">
                                            <button onClick={() => setPaxCount(p => Math.max(1, p - 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">−</button>
                                            <span className="font-bold text-white w-8 text-center">{paxCount}</span>
                                            <button onClick={() => setPaxCount(p => Math.min(availableSpots, p + 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">+</button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-slate-400 uppercase text-xs font-bold tracking-widest">Total a pagar</span>
                                        <span className="text-3xl font-black text-white">${total.toLocaleString('es-CL')} <span className="text-sm font-normal text-slate-500">CLP</span></span>
                                    </div>

                                    {/* Check-in y Waiver */}
                                    <div className="flex items-start gap-3 pt-6 border-t border-slate-800">
                                        <div className="mt-0.5">
                                            <input 
                                                type="checkbox" 
                                                id="waiver" 
                                                checked={acceptsWaiver}
                                                onChange={(e) => setAcceptsWaiver(e.target.checked)}
                                                className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500/20 cursor-pointer"
                                            />
                                        </div>
                                        <label htmlFor="waiver" className="text-xs text-slate-400 cursor-pointer select-none">
                                            He leído y acepto el <span className="text-blue-400 underline">Descargo de Responsabilidad Médico</span>. Declaro tener salud compatible con la actividad, asumo los riesgos inherentes al montañismo y autorizo el protocolo WFR en caso de emergencia.
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep('select')} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors">
                                Volver
                            </button>
                            <button
                                onClick={handlePay}
                                disabled={isSubmitting || !form.first_name || !form.last_name || !form.email}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-colors"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
                                ) : (
                                    <><CreditCard className="w-5 h-5" /> Pagar con MercadoPago</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Field({ label, name, value, onChange, placeholder, type = 'text' }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>
    );
}
