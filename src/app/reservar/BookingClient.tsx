'use client';

import React, { useState } from 'react';
import {
    Mountain, Calendar, Users, CreditCard, ChevronRight,
    Clock, Star, MapPin, Shield, ArrowLeft, Loader2, CheckCircle2,
    Lock, ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createBookingWithMercadoPago } from './actions';
import { trackBeginCheckout } from '@/lib/analytics';
import { challengesData } from '../desafios/data';

export default function BookingClient({ 
    departures, 
    initialAdventureId,
    initialFechaId 
}: { 
    departures: any[]; 
    initialAdventureId?: string;
    initialFechaId?: string;
}) {
    // Si viene de uno de los Desafíos Andinos
    const challenge = initialAdventureId ? challengesData[initialAdventureId] : null;

    let preSelectedDeparture: any = null;
    if (challenge) {
        const targetFecha = challenge.fechasDisponibles.find(f => f.id === initialFechaId) || challenge.fechasDisponibles[0];
        preSelectedDeparture = {
            id: targetFecha ? targetFecha.id : `challenge-${challenge.slug}`,
            start_date: targetFecha?.fecha || 'Próxima salida confirmada',
            hora: targetFecha?.hora || '08:00 AM',
            current_pax: targetFecha ? (targetFecha.cuposTotales - targetFecha.cuposDisponibles) : 0,
            adventures_catalog: {
                id: challenge.slug,
                title: challenge.title,
                base_price: challenge.precioCLP,
                max_pax: targetFecha ? targetFecha.cuposTotales : 10,
                duration_text: challenge.metrics.tiempo,
                difficulty_level: challenge.metrics.dificultad,
                category: challenge.badge,
                image_url: challenge.coverImage,
            }
        };
    }

    const [selected, setSelected] = useState<any | null>(preSelectedDeparture);
    const [paxCount, setPaxCount] = useState(1);
    const [step, setStep] = useState<'select' | 'form' | 'processing'>(preSelectedDeparture ? 'form' : 'select');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', phone: '',
        emergency_contact: '', medical_info: ''
    });
    const [acceptsWaiver, setAcceptsWaiver] = useState(false);

    const total = selected ? (selected.adventures_catalog?.base_price || 0) * paxCount : 0;
    const availableSpots = selected
        ? Math.max(1, (selected.adventures_catalog?.max_pax || 10) - (selected.current_pax || 0))
        : 10;

    async function handlePay() {
        if (!selected) return;
        if (!form.first_name || !form.last_name || !form.email || !form.phone) {
            alert('Por favor completa todos tus datos personales para continuar.');
            return;
        }
        if (!acceptsWaiver) {
            alert('Debes aceptar el descargo de responsabilidad médico para continuar.');
            return;
        }
        setIsSubmitting(true);
        try {
            trackBeginCheckout({
                id: selected.id,
                title: selected.adventures_catalog?.title || 'Expedición',
                price: total
            });
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
                adventure_title: selected.adventures_catalog?.title || 'Expedición Andes',
                unit_price: selected.adventures_catalog?.base_price || 0,
            });
            // Redirigir directamente a la página de pago de MercadoPago
            if (result.payment_url) {
                window.location.href = result.payment_url;
            } else {
                throw new Error('No se generó el enlace de pago de MercadoPago');
            }
        } catch (err: any) {
            alert('Error al conectar con la pasarela de pago: ' + err.message);
            setIsSubmitting(false);
        }
    }

    const backUrl = challenge ? `/desafios/${challenge.slug}` : (initialAdventureId ? `/rutas/${initialAdventureId}` : '/');

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-500/30">

            {/* Navbar Minimalista Limpio */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <button 
                        onClick={() => {
                            if (step === 'form' && !challenge) {
                                setStep('select');
                            } else {
                                window.location.href = backUrl;
                            }
                        }}
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" /> {challenge ? `Volver a ${challenge.title}` : `Volver`}
                    </button>

                    <Link href="/" className="flex items-center gap-2.5">
                        <Image
                            src="/logo sh.png"
                            alt="Santiago Hiking"
                            width={32}
                            height={32}
                            className="w-7 h-7 object-contain"
                        />
                        {/* Logotipo Oficial 20 (SANTIAGO en negro + HIKING en ámbar) */}
                        <Image
                            src="/logo-text-black.png"
                            alt="Santiago Hiking"
                            width={200}
                            height={28}
                            className="h-5 sm:h-6 w-auto object-contain"
                            priority
                        />
                    </Link>
                </div>
            </header>

            {/* Hero Banner Limpio */}
            <div className="bg-white border-b border-stone-200 py-10 px-6 text-center">
                <span className="text-amber-600 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block mb-2">
                    Pasarela de Reserva Oficial
                </span>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-stone-950 mb-2">
                    Reserva y Pago Seguro
                </h1>
                <p className="text-stone-600 text-xs sm:text-sm font-light max-w-lg mx-auto">
                    Completa tus datos personales para asegurar tu cupo y pagar de forma segura vía MercadoPago o Webpay.
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

                {/* Indicador de Pasos */}
                <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10 text-xs font-mono">
                    <div className="flex items-center gap-2 text-stone-500">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-stone-200 text-stone-800">
                            ✓
                        </span>
                        <span className="hidden sm:inline">1. Salida</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-300" />
                    <div className="flex items-center gap-2 text-stone-950 font-bold">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-stone-950 text-white">
                            2
                        </span>
                        <span>Tus Datos y Cupos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-300" />
                    <div className="flex items-center gap-2 text-stone-400">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-stone-300 text-stone-400 bg-white">
                            3
                        </span>
                        <span className="hidden sm:inline">Pago Seguro</span>
                    </div>
                </div>

                {/* FORMULARIO DE RESERVA (PASO 2) */}
                {selected && (
                    <div className="max-w-2xl mx-auto space-y-8">
                        
                        {/* Resumen de la Expedición Seleccionada */}
                        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                            <div className="p-6 sm:p-7 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/60">
                                <div>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 block mb-1">
                                        Expedición Seleccionada
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-stone-950 mb-1">
                                        {selected.adventures_catalog?.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 font-mono mt-2">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                            {selected.start_date}
                                        </span>
                                        {selected.hora && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-stone-400" />
                                                {selected.hora}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
                                        Tarifa por persona
                                    </span>
                                    <span className="text-xl font-black font-mono text-stone-950">
                                        ${Number(selected.adventures_catalog?.base_price || 0).toLocaleString('es-CL')}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 space-y-7">
                                
                                {/* 1. Datos de Contacto */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
                                        1. Datos de Contacto del Titular
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field 
                                            label="Nombre" 
                                            name="first_name" 
                                            value={form.first_name} 
                                            onChange={(v: string) => setForm(f => ({...f, first_name: v}))} 
                                            placeholder="Ej. Juan" 
                                        />
                                        <Field 
                                            label="Apellido" 
                                            name="last_name" 
                                            value={form.last_name} 
                                            onChange={(v: string) => setForm(f => ({...f, last_name: v}))} 
                                            placeholder="Ej. Pérez" 
                                        />
                                    </div>

                                    <Field 
                                        label="Correo electrónico (donde recibirás el voucher)" 
                                        name="email" 
                                        type="email" 
                                        value={form.email} 
                                        onChange={(v: string) => setForm(f => ({...f, email: v}))} 
                                        placeholder="juan.perez@email.com" 
                                    />
                                    
                                    <Field 
                                        label="Teléfono / WhatsApp (para coordinación del ascenso)" 
                                        name="phone" 
                                        value={form.phone} 
                                        onChange={(v: string) => setForm(f => ({...f, phone: v}))} 
                                        placeholder="+56 9 1234 5678" 
                                    />
                                </div>

                                {/* 2. Ficha Médica y Contacto de Emergencia */}
                                <div className="space-y-4 pt-6 border-t border-stone-100">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
                                        2. Contacto de Emergencia & Seguridad WFR
                                    </h4>
                                    
                                    <Field 
                                        label="Nombre y teléfono de contacto de emergencia" 
                                        name="emergency_contact" 
                                        value={form.emergency_contact} 
                                        onChange={(v: string) => setForm(f => ({...f, emergency_contact: v}))} 
                                        placeholder="Ej. María Pérez · +56 9 8765 4321" 
                                    />

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block font-mono text-[11px]">
                                            Alergias o condiciones médicas relevantes (Opcional)
                                        </label>
                                        <textarea
                                            value={form.medical_info}
                                            onChange={e => setForm(f => ({ ...f, medical_info: e.target.value }))}
                                            placeholder="Asma, alergia a picaduras, lesiones previas, medicamentos, etc."
                                            className="w-full bg-white border border-stone-300 rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors resize-none"
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                {/* 3. Selección de Cupos y Cálculo de Total */}
                                <div className="space-y-4 pt-6 border-t border-stone-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-stone-900 font-mono block">
                                                3. Cantidad de Cupos
                                            </span>
                                            <span className="text-xs text-stone-500 font-light mt-0.5 block">
                                                Quedan {availableSpots} cupos disponibles para esta fecha
                                            </span>
                                        </div>

                                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                                            <button 
                                                type="button"
                                                onClick={() => setPaxCount(p => Math.max(1, p - 1))} 
                                                className="w-10 h-10 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center font-bold font-mono text-stone-950">
                                                {paxCount}
                                            </span>
                                            <button 
                                                type="button"
                                                onClick={() => setPaxCount(p => Math.min(availableSpots, p + 1))} 
                                                className="w-10 h-10 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Resumen de Precio Final */}
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between mt-4">
                                        <div>
                                            <span className="text-xs font-mono uppercase text-stone-500 block">
                                                Total a Pagar ({paxCount} {paxCount === 1 ? 'cupo' : 'cupos'})
                                            </span>
                                            <span className="text-[11px] text-stone-400 font-light">
                                                Sin comisiones adicionales · Boleta incluida
                                            </span>
                                        </div>
                                        <span className="text-2xl font-black font-mono text-stone-950">
                                            ${total.toLocaleString('es-CL')} <span className="text-xs font-normal text-stone-500">CLP</span>
                                        </span>
                                    </div>

                                    {/* Waiver & Descargo de Responsabilidad */}
                                    <div className="flex items-start gap-3 pt-4">
                                        <input 
                                            type="checkbox" 
                                            id="waiver" 
                                            checked={acceptsWaiver}
                                            onChange={(e) => setAcceptsWaiver(e.target.checked)}
                                            className="mt-0.5 w-4 h-4 rounded border-stone-300 text-stone-950 focus:ring-stone-900 cursor-pointer"
                                        />
                                        <label htmlFor="waiver" className="text-xs text-stone-600 leading-relaxed cursor-pointer select-none">
                                            He leído y acepto los términos de participación y descargo de responsabilidad médico. Declaro tener salud compatible con la actividad física en montaña y autorizo la atención del guía certificado WFR en caso de emergencia.
                                        </label>
                                    </div>
                                </div>

                                {/* Botón de Pago con MercadoPago */}
                                <div className="pt-6 border-t border-stone-200 space-y-3">
                                    <button
                                        type="button"
                                        onClick={handlePay}
                                        disabled={isSubmitting || !form.first_name || !form.last_name || !form.email || !form.phone || !acceptsWaiver}
                                        className="w-full bg-stone-950 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                                                <span>Conectando con MercadoPago...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-4 h-4 text-amber-400" />
                                                <span>PAGAR ${total.toLocaleString('es-CL')} CLP CON MERCADOPAGO →</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Sellos de Seguridad */}
                                    <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-stone-500 pt-2">
                                        <span className="flex items-center gap-1.5">
                                            <Lock className="w-3.5 h-3.5 text-emerald-600" /> Pago seguro cifrado SSL
                                        </span>
                                        <span>·</span>
                                        <span>Débito, Crédito y Webpay</span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-stone-500" /> Garantía de reprogramación
                                        </span>
                                    </div>
                                </div>

                            </div>
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
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block font-mono text-[11px]">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white border border-stone-300 rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
            />
        </div>
    );
}
