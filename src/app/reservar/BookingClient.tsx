'use client';

import React, { useState } from 'react';
import {
    Calendar, Users, CreditCard,
    Clock, Shield, ArrowLeft, Loader2, CheckCircle2,
    Lock, ShieldCheck, Mountain, Compass
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createBookingWithMercadoPago } from './actions';
import { trackBeginCheckout } from '@/lib/analytics';
import { challengesData } from '../desafios/data';
import HeroCarousel from '@/app/HeroCarousel';
import ScrollToTopButton from '@/app/ScrollToTopButton';

export default function BookingClient({ 
    departures = [], 
    catalogRoutes = [],
    initialAdventureId,
    initialFechaId,
    initialRoute
}: { 
    departures: any[]; 
    catalogRoutes?: any[];
    initialAdventureId?: string;
    initialFechaId?: string;
    initialRoute?: any;
}) {
    // 1. Si viene de uno de los Desafíos Andinos
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
    } else if (initialRoute) {
        // Viene directamente de una ruta del catálogo
        const existingDep = departures.find((d: any) => d.adventures_catalog?.id === initialRoute.id);
        preSelectedDeparture = existingDep || {
            id: `route-${initialRoute.id}`,
            start_date: 'A coordinar con Guía / Próxima fecha',
            hora: '08:00 AM',
            current_pax: 0,
            adventures_catalog: initialRoute,
        };
    } else if (initialAdventureId) {
        preSelectedDeparture = departures.find((d: any) => d.id === initialAdventureId || d.adventures_catalog?.id === initialAdventureId);
    }

    const [selected, setSelected] = useState<any | null>(preSelectedDeparture);
    const [paxCount, setPaxCount] = useState(1);
    const [additionalParticipants, setAdditionalParticipants] = useState<{ first_name: string; last_name: string; email?: string }[]>([]);
    const [step, setStep] = useState<'select' | 'form'>((preSelectedDeparture || selected) ? 'form' : 'select');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', phone: ''
    });
    const [acceptsWaiver, setAcceptsWaiver] = useState(false);

    const updateParticipant = (index: number, field: string, value: string) => {
        setAdditionalParticipants(prev => {
            const next = [...prev];
            if (!next[index]) next[index] = { first_name: '', last_name: '', email: '' };
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const total = selected ? (selected.adventures_catalog?.base_price || 0) * paxCount : 0;
    const availableSpots = selected
        ? Math.max(1, (selected.adventures_catalog?.max_pax || 10) - (selected.current_pax || 0))
        : 10;

    async function handlePay() {
        if (!selected) return;
        if (!form.first_name || !form.last_name || !form.email || !form.phone) {
            alert('Por favor completa los datos de contacto del titular para continuar.');
            return;
        }
        if (!acceptsWaiver) {
            alert('Debes aceptar los términos y condiciones de la expedición para continuar.');
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
                accepts_waiver: acceptsWaiver,
                departure_id: selected.id,
                pax_count: paxCount,
                adventure_title: selected.adventures_catalog?.title || 'Expedición Andes',
                unit_price: selected.adventures_catalog?.base_price || 0,
                additional_participants: additionalParticipants.slice(0, Math.max(0, paxCount - 1)),
            });
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

    const backUrl = challenge ? `/desafios/${challenge.slug}` : (initialRoute ? `/rutas/${initialRoute.id}` : (initialAdventureId ? `/rutas/${initialAdventureId}` : '/'));

    return (
        <div className="relative min-h-screen text-stone-100 font-sans selection:bg-amber-500/30 bg-stone-950">

            {/* ── FONDO DE VIDEOS DE LA WEB (CINEMATOGRÁFICO EN BUCLE) ── */}
            <HeroCarousel />
            {/* Velo ahumado ligero para mantener legibilidad sin oscurecer de más el fondo */}
            <div className="fixed inset-0 z-0 bg-stone-950/30 pointer-events-none" />

            {/* ── CONTENIDO PRINCIPAL (CAPA Z-10) ── */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <ScrollToTopButton />

                {/* ── NAVBAR FLOTANTE TRANSPARENTE (SIN FRANJA NEGRA) ── */}
                <header className="sticky top-0 z-40 px-4 sm:px-8 py-3 sm:py-5 bg-transparent">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <button 
                            onClick={() => {
                                if (step === 'form' && !challenge && !initialRoute) {
                                    setStep('select');
                                } else {
                                    window.location.href = backUrl;
                                }
                            }}
                            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-white/80 hover:text-white transition-all hover:-translate-x-1 cursor-pointer py-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
                        >
                            <ArrowLeft className="w-4 h-4 text-amber-400" />
                            <span>{challenge ? `Volver a ${challenge.title}` : (initialRoute ? `Volver a ${initialRoute.title}` : 'Volver')}</span>
                        </button>

                        <Link href="/" className="flex items-center transition-transform duration-200 hover:scale-105 py-1">
                            <Image
                                src="/logotipo blanco.png"
                                alt="Santiago Hiking"
                                width={320}
                                height={75}
                                className="h-8 sm:h-10 md:h-12 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
                                priority
                            />
                        </Link>
                    </div>
                </header>

                {/* Hero Header de Checkout */}
                <div className="pt-8 sm:pt-12 pb-6 px-6 text-center">
                    <span className="text-amber-400 font-mono text-[11px] uppercase tracking-[0.25em] font-bold block mb-2 drop-shadow-sm">
                        Pasarela de Reserva Oficial
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                        Reserva y Pago Seguro
                    </h1>
                    <p className="text-white/60 text-xs sm:text-sm font-light max-w-lg mx-auto leading-relaxed">
                        Completa tus datos personales para asegurar tu cupo y pagar de forma segura vía MercadoPago o Webpay.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 flex-1 w-full">

                    {/* ── PASO 1: SELECCIONAR EXPEDICIÓN (SI NO HABÍA NINGUNA ELEGIDA) ── */}
                    {step === 'select' && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold uppercase tracking-tight text-white">Selecciona tu Aventura</h3>
                                <p className="text-sm text-white/50 font-light mt-1">Elige la experiencia en la montaña para la que deseas reservar cupos.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(catalogRoutes.length > 0 ? catalogRoutes : departures.map((d: any) => d.adventures_catalog).filter(Boolean)).map((route: any) => (
                                    <div 
                                        key={route.id}
                                        onClick={() => {
                                            const dep = departures.find((d: any) => d.adventures_catalog?.id === route.id) || {
                                                id: `route-${route.id}`,
                                                start_date: 'A coordinar con Guía / Próxima fecha',
                                                hora: '08:00 AM',
                                                current_pax: 0,
                                                adventures_catalog: route,
                                            };
                                            setSelected(dep);
                                            setStep('form');
                                        }}
                                        className="group p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(16px)',
                                            WebkitBackdropFilter: 'blur(16px)',
                                            border: '1px solid rgba(255, 255, 255, 0.10)',
                                        }}
                                    >
                                        <div>
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                                                {route.category || 'Trekking'}
                                            </span>
                                            <h4 className="text-lg font-black uppercase text-white group-hover:text-amber-300 transition-colors">
                                                {route.title}
                                            </h4>
                                            <p className="text-xs text-white/60 font-light mt-2 line-clamp-2">
                                                {route.description || 'Guiado premium paso a paso en la cordillera.'}
                                            </p>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                                            <span className="text-sm font-black font-mono text-amber-400">
                                                ${Number(route.base_price || 25000).toLocaleString('es-CL')} CLP
                                            </span>
                                            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider group-hover:text-amber-400 flex items-center gap-1">
                                                Elegir →
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── PASO 2: FORMULARIO DE RESERVA Y DATOS ── */}
                    {step === 'form' && selected && (
                        <div className="max-w-2xl mx-auto space-y-8">
                            
                            {/* Resumen de la Expedición Seleccionada (Card Glassmorphism) */}
                            <div 
                                className="rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                }}
                            >
                                <div 
                                    className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}
                                >
                                    <div>
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                                            Expedición Seleccionada
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                                            {selected.adventures_catalog?.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-white/75 font-mono">
                                            <span className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                                                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                                {selected.start_date}
                                            </span>
                                            {selected.hora && (
                                                <span className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                                    {selected.hora}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                            Tarifa por persona
                                        </span>
                                        <div className="flex items-baseline gap-2 justify-start sm:justify-end">
                                            <span className="text-xl font-black font-mono text-amber-400">
                                                ${Number(selected.adventures_catalog?.base_price || 0).toLocaleString('es-CL')} <span className="text-xs text-white/50">CLP</span>
                                            </span>
                                            <span className="text-xs font-mono text-white/45">
                                                US${Math.round(Number(selected.adventures_catalog?.base_price || 0) / 950).toLocaleString('en-US')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8 space-y-7">
                                    
                                    {/* 1. Datos de Contacto */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
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

                                    {/* 2. Selección de Cupos y Cálculo de Total */}
                                    <div className="space-y-5 pt-6 border-t border-white/10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono block">
                                                    2. Cantidad de Cupos
                                                </h4>
                                                <span className="text-xs text-white/50 font-light mt-0.5 block">
                                                    Quedan {availableSpots} cupos disponibles para esta fecha
                                                </span>
                                            </div>

                                            <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-black/40">
                                                <button 
                                                    type="button"
                                                    onClick={() => setPaxCount(p => Math.max(1, p - 1))} 
                                                    className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 font-bold transition-colors cursor-pointer"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 text-center font-bold font-mono text-white">
                                                    {paxCount}
                                                </span>
                                                <button 
                                                    type="button"
                                                    onClick={() => setPaxCount(p => Math.min(availableSpots, p + 1))} 
                                                    className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 font-bold transition-colors cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Despliegue de Datos de los demás participantes si compra 2 o más tickets */}
                                        {paxCount > 1 && (
                                            <div className="space-y-4 pt-3 border-t border-white/10">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono block">
                                                        Datos de los Acompañantes ({paxCount - 1} {paxCount === 2 ? 'adicional' : 'adicionales'})
                                                    </span>
                                                    <span className="text-[10px] text-white/40 font-mono">
                                                        Tickets individuales
                                                    </span>
                                                </div>

                                                {Array.from({ length: paxCount - 1 }).map((_, idx) => {
                                                    const pNum = idx + 2;
                                                    const pData = additionalParticipants[idx] || { first_name: '', last_name: '', email: '' };
                                                    return (
                                                        <div 
                                                            key={idx} 
                                                            className="p-4 rounded-2xl space-y-3"
                                                            style={{
                                                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                                border: '1px solid rgba(255, 255, 255, 0.08)'
                                                            }}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70">
                                                                    Participante {pNum}
                                                                </span>
                                                                <span className="text-[9px] font-mono uppercase text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded">
                                                                    Ticket #{pNum}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                <Field
                                                                    label="Nombre"
                                                                    name={`p_${pNum}_first_name`}
                                                                    value={pData.first_name}
                                                                    onChange={(v: string) => updateParticipant(idx, 'first_name', v)}
                                                                    placeholder={`Ej. Nombre`}
                                                                />
                                                                <Field
                                                                    label="Apellido"
                                                                    name={`p_${pNum}_last_name`}
                                                                    value={pData.last_name}
                                                                    onChange={(v: string) => updateParticipant(idx, 'last_name', v)}
                                                                    placeholder={`Ej. Apellido`}
                                                                />
                                                            </div>
                                                            <Field
                                                                label="Correo electrónico (Opcional · para recibir su copia)"
                                                                name={`p_${pNum}_email`}
                                                                type="email"
                                                                value={pData.email || ''}
                                                                onChange={(v: string) => updateParticipant(idx, 'email', v)}
                                                                placeholder={`correo@acompanante.com`}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Nota de baja fricción: RUT, Contacto de emergencia y Ficha Médica post-pago */}
                                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                                            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-200/90 leading-relaxed font-light">
                                                <strong className="font-semibold text-white">Ficha de Seguridad WFR:</strong> Por protocolo de montaña, una vez confirmado el pago cada participante registrará su <strong className="text-white">RUT/Pasaporte, contacto de emergencia y datos de salud (grupo sanguíneo y alergias)</strong> directamente en su Expedition Pass.
                                            </p>
                                        </div>

                                        {/* Resumen de Precio Final */}
                                        <div 
                                            className="p-4 sm:p-5 rounded-2xl flex items-center justify-between"
                                            style={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                                                border: '1px solid rgba(255, 255, 255, 0.10)',
                                            }}
                                        >
                                            <div>
                                                <span className="text-xs font-mono uppercase text-white/50 block">
                                                    Total a Pagar ({paxCount} {paxCount === 1 ? 'cupo' : 'cupos'})
                                                </span>
                                                <span className="text-[11px] text-white/40 font-light">
                                                    Sin comisiones adicionales · Boleta incluida
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 block">
                                                    ${total.toLocaleString('es-CL')} <span className="text-xs font-normal text-white/60">CLP</span>
                                                </span>
                                                <span className="text-xs font-mono text-white/45 block mt-0.5">
                                                    ~US${Math.round(total / 950).toLocaleString('en-US')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Términos rápidos */}
                                        <div className="flex items-start gap-3 pt-2">
                                            <input 
                                                type="checkbox" 
                                                id="waiver" 
                                                checked={acceptsWaiver}
                                                onChange={(e) => setAcceptsWaiver(e.target.checked)}
                                                className="mt-0.5 w-4 h-4 rounded border-white/30 text-amber-500 focus:ring-amber-400 bg-black/40 cursor-pointer accent-amber-500"
                                            />
                                            <label htmlFor="waiver" className="text-xs text-white/70 leading-relaxed cursor-pointer select-none">
                                                Acepto los términos de la expedición y declaro tener salud compatible con senderismo en montaña.
                                            </label>
                                        </div>
                                    </div>

                                    {/* Botón de Pago Neutro y Multipasarela */}
                                    <div className="pt-6 border-t border-white/10 space-y-4">
                                        <button
                                            type="button"
                                            onClick={handlePay}
                                            disabled={isSubmitting || !form.first_name || !form.last_name || !form.email || !form.phone || !acceptsWaiver}
                                            className="btn-arcteryx-primary w-full !py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(245,158,11,0.35)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                                                    <span>Iniciando pasarela de pago...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="w-4 h-4 text-stone-950" />
                                                    <span>PAGAR ${total.toLocaleString('es-CL')} CLP →</span>
                                                </>
                                            )}
                                        </button>

                                        {/* Métodos de Pago y Sellos de Confianza */}
                                        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-white/40 pt-2">
                                            <span className="flex items-center gap-1.5">
                                                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Pago seguro cifrado SSL
                                            </span>
                                            <span>·</span>
                                            <span>Mercado Pago · Webpay (Transbank) · Transferencia</span>
                                            <span>·</span>
                                            <span className="flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Garantía de reprogramación
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

function Field({ label, name, value, onChange, placeholder, type = 'text' }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block font-mono text-[11px]">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.40)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
            />
        </div>
    );
}
