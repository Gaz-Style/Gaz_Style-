'use client';

import React, { useState } from 'react';
import {
    Calendar, Users, CreditCard,
    Clock, Shield, ArrowLeft, Loader2, CheckCircle2,
    Lock, ShieldCheck, Mountain, Compass, AlertCircle
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
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [acceptsWaiver, setAcceptsWaiver] = useState(false);

    const updateParticipant = (index: number, field: string, value: string) => {
        setAdditionalParticipants(prev => {
            const next = [...prev];
            if (!next[index]) next[index] = { first_name: '', last_name: '', email: '' };
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const adv = selected?.adventures_catalog;
    const rawLogistics = typeof adv?.logistics === 'string' 
        ? (() => { try { return JSON.parse(adv.logistics); } catch { return {}; } })() 
        : (adv?.logistics || {});
    const rawActive = adv?.is_discount_active ?? rawLogistics.is_discount_active;
    const isPromoActive = (rawActive === true || rawActive === 'true' || rawActive === 1 || rawActive === '1')
        && Number(adv?.discount_price ?? rawLogistics.discount_price) > 0
        && Number(adv?.discount_price ?? rawLogistics.discount_price) < Number(adv?.base_price || 0);

    const originalUnitPrice = Number(adv?.base_price || 0);
    const unitPrice = isPromoActive 
        ? Number(adv?.discount_price ?? rawLogistics.discount_price) 
        : originalUnitPrice;
    const discountBadge = adv?.discount_badge || rawLogistics.discount_badge || 'ÚLTIMOS CUPOS OFF';

    const total = selected ? unitPrice * paxCount : 0;
    const availableSpots = selected
        ? Math.max(1, (selected.adventures_catalog?.max_pax || 10) - (selected.current_pax || 0))
        : 10;

    // Validación rigurosa de formato
    const isEmailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
    const isPhoneValid = (p: string) => p.replace(/\D/g, '').length >= 8;

    const errors = {
        first_name: !form.first_name.trim() ? 'El nombre es obligatorio' : '',
        last_name: !form.last_name.trim() ? 'El apellido es obligatorio' : '',
        email: !form.email.trim() 
            ? 'El correo es obligatorio' 
            : !isEmailValid(form.email) 
            ? 'Ingresa un correo electrónico válido' 
            : '',
        phone: !form.phone.trim() 
            ? 'El celular/WhatsApp es obligatorio' 
            : !isPhoneValid(form.phone) 
            ? 'Ingresa un número de celular válido (mín. 8 dígitos)' 
            : '',
    };

    // Validar si los acompañantes adicionales tienen sus datos obligatorios (si aplica)
    const getAdditionalError = (index: number, field: 'first_name' | 'last_name') => {
        const p = additionalParticipants[index];
        if (!p || !p[field]?.trim()) {
            return field === 'first_name' 
                ? `El nombre del acompañante ${index + 2} es obligatorio` 
                : `El apellido del acompañante ${index + 2} es obligatorio`;
        }
        return '';
    };

    const hasIncompleteAdditional = Array.from({ length: Math.max(0, paxCount - 1) }).some((_, i) => {
        const p = additionalParticipants[i];
        return !p?.first_name?.trim() || !p?.last_name?.trim();
    });

    const hasErrors = Object.values(errors).some(Boolean) || hasIncompleteAdditional;

    async function handlePay() {
        if (!selected) return;

        // Marcar todos los campos como tocados para mostrar errores visuales inmediatos
        const allTouched: Record<string, boolean> = {
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            waiver: true,
        };
        for (let i = 0; i < paxCount - 1; i++) {
            allTouched[`p_${i + 2}_first_name`] = true;
            allTouched[`p_${i + 2}_last_name`] = true;
        }
        setTouched(allTouched);

        if (hasErrors || !acceptsWaiver) {
            // Condicionar para no avanzar sin rellenar los campos obligatorios
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
                unit_price: unitPrice,
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
                                        <div className="flex items-center gap-1.5 justify-start sm:justify-end mb-1">
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                                Tarifa por persona
                                            </span>
                                            {isPromoActive && (
                                                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono font-bold text-[9px] uppercase tracking-wider animate-pulse">
                                                    🔥 {discountBadge}
                                                </span>
                                            )}
                                        </div>
                                        {isPromoActive ? (
                                            <div>
                                                <div className="flex items-baseline gap-1.5 justify-start sm:justify-end">
                                                    <span className="text-xs line-through text-white/40 font-mono">
                                                        ${originalUnitPrice.toLocaleString('es-CL')}
                                                    </span>
                                                    <span className="text-[10px] line-through text-white/30 font-mono">
                                                        US${Math.round(originalUnitPrice / 950).toLocaleString('en-US')}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline gap-2 justify-start sm:justify-end">
                                                    <span className="text-xl sm:text-2xl font-black font-mono text-rose-400">
                                                        ${unitPrice.toLocaleString('es-CL')} <span className="text-xs text-white/50">CLP</span>
                                                    </span>
                                                    <span className="text-xs font-mono text-white/70">
                                                        US${Math.round(unitPrice / 950).toLocaleString('en-US')}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-2 justify-start sm:justify-end">
                                                <span className="text-xl font-black font-mono text-amber-400">
                                                    ${originalUnitPrice.toLocaleString('es-CL')} <span className="text-xs text-white/50">CLP</span>
                                                </span>
                                                <span className="text-xs font-mono text-white/45">
                                                    US${Math.round(originalUnitPrice / 950).toLocaleString('en-US')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8 space-y-7">
                                    
                                    {/* Explicación del Flujo de Reserva en 2 Pasos */}
                                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                                        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                        <div className="text-xs text-stone-200/90 leading-relaxed font-light">
                                            <span className="text-amber-400 font-bold uppercase tracking-wider block mb-1 text-[11px] font-mono">
                                                Proceso de Reserva en 2 Pasos
                                            </span>
                                            <p className="text-white/80">
                                                <strong className="text-white font-semibold">1. Datos de Contacto Obligatorios:</strong> Completa nombre, apellido, correo y celular para emitir tu orden y proceder al pago seguro.
                                            </p>
                                            <p className="text-amber-200/80 mt-1">
                                                <strong className="text-amber-300 font-semibold">2. Ficha Médica & RUT Post-Pago:</strong> Inmediatamente después de pagar, completarás el RUT/Pasaporte, contacto de emergencia y ficha médica de cada participante.
                                            </p>
                                        </div>
                                    </div>

                                    {/* 1. Datos de Contacto */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                                                1. Datos de Contacto del Titular
                                            </h4>
                                            <span className="text-[10px] text-amber-400/80 font-mono">
                                                (*) Campos obligatorios
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field 
                                                label="Nombre" 
                                                name="first_name" 
                                                value={form.first_name} 
                                                onChange={(v: string) => {
                                                    setForm(f => ({...f, first_name: v}));
                                                    if (touched.first_name) setTouched(t => ({...t, first_name: true}));
                                                }} 
                                                onBlur={() => setTouched(t => ({...t, first_name: true}))}
                                                placeholder="Ej. Juan" 
                                                required
                                                error={touched.first_name ? errors.first_name : ''}
                                            />
                                            <Field 
                                                label="Apellido" 
                                                name="last_name" 
                                                value={form.last_name} 
                                                onChange={(v: string) => {
                                                    setForm(f => ({...f, last_name: v}));
                                                    if (touched.last_name) setTouched(t => ({...t, last_name: true}));
                                                }} 
                                                onBlur={() => setTouched(t => ({...t, last_name: true}))}
                                                placeholder="Ej. Pérez" 
                                                required
                                                error={touched.last_name ? errors.last_name : ''}
                                            />
                                        </div>

                                        <Field 
                                            label="Correo electrónico (donde recibirás el voucher)" 
                                            name="email" 
                                            type="email" 
                                            value={form.email} 
                                            onChange={(v: string) => {
                                                setForm(f => ({...f, email: v}));
                                                if (touched.email) setTouched(t => ({...t, email: true}));
                                            }} 
                                            onBlur={() => setTouched(t => ({...t, email: true}))}
                                            placeholder="juan.perez@email.com" 
                                            required
                                            error={touched.email ? errors.email : ''}
                                        />
                                        
                                        <Field 
                                            label="Teléfono / WhatsApp (para coordinación del ascenso)" 
                                            name="phone" 
                                            value={form.phone} 
                                            onChange={(v: string) => {
                                                setForm(f => ({...f, phone: v}));
                                                if (touched.phone) setTouched(t => ({...t, phone: true}));
                                            }} 
                                            onBlur={() => setTouched(t => ({...t, phone: true}))}
                                            placeholder="+56 9 1234 5678" 
                                            required
                                            error={touched.phone ? errors.phone : ''}
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
                                                    <span className="text-[10px] text-amber-400/80 font-mono">
                                                        (*) Nombre y apellido obligatorios
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
                                                                    onChange={(v: string) => {
                                                                        updateParticipant(idx, 'first_name', v);
                                                                        if (touched[`p_${pNum}_first_name`]) {
                                                                            setTouched(t => ({...t, [`p_${pNum}_first_name`]: true}));
                                                                        }
                                                                    }}
                                                                    onBlur={() => setTouched(t => ({...t, [`p_${pNum}_first_name`]: true}))}
                                                                    placeholder={`Ej. Nombre`}
                                                                    required
                                                                    error={touched[`p_${pNum}_first_name`] ? getAdditionalError(idx, 'first_name') : ''}
                                                                />
                                                                <Field
                                                                    label="Apellido"
                                                                    name={`p_${pNum}_last_name`}
                                                                    value={pData.last_name}
                                                                    onChange={(v: string) => {
                                                                        updateParticipant(idx, 'last_name', v);
                                                                        if (touched[`p_${pNum}_last_name`]) {
                                                                            setTouched(t => ({...t, [`p_${pNum}_last_name`]: true}));
                                                                        }
                                                                    }}
                                                                    onBlur={() => setTouched(t => ({...t, [`p_${pNum}_last_name`]: true}))}
                                                                    placeholder={`Ej. Apellido`}
                                                                    required
                                                                    error={touched[`p_${pNum}_last_name`] ? getAdditionalError(idx, 'last_name') : ''}
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
                                                {isPromoActive && (
                                                    <span className="text-xs font-mono line-through text-white/40 block">
                                                        ${(originalUnitPrice * paxCount).toLocaleString('es-CL')} CLP
                                                    </span>
                                                )}
                                                <span className={`text-2xl sm:text-3xl font-black font-mono block ${isPromoActive ? 'text-rose-400' : 'text-amber-400'}`}>
                                                    ${total.toLocaleString('es-CL')} <span className="text-xs font-normal text-white/60">CLP</span>
                                                </span>
                                                <span className="text-xs font-mono text-white/45 block mt-0.5">
                                                    ~US${Math.round(total / 950).toLocaleString('en-US')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Términos rápidos */}
                                        <div className="space-y-2 pt-2">
                                            <div className="flex items-start gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id="waiver" 
                                                    checked={acceptsWaiver}
                                                    onChange={(e) => {
                                                        setAcceptsWaiver(e.target.checked);
                                                        setTouched(t => ({...t, waiver: true}));
                                                    }}
                                                    className="mt-0.5 w-4 h-4 rounded border-white/30 text-amber-500 focus:ring-amber-400 bg-black/40 cursor-pointer accent-amber-500"
                                                />
                                                <label htmlFor="waiver" className="text-xs text-white/70 leading-relaxed cursor-pointer select-none">
                                                    Acepto los términos de la expedición y declaro tener salud compatible con senderismo en montaña. <span className="text-red-400 font-bold">*</span>
                                                </label>
                                            </div>
                                            {touched.waiver && !acceptsWaiver && (
                                                <span className="text-[10px] text-red-400 font-mono tracking-tight block pl-7">
                                                    Debes aceptar los términos para poder avanzar al pago.
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botón de Pago Neutro y Multipasarela */}
                                    <div className="pt-6 border-t border-white/10 space-y-4">
                                        {/* Alerta de campos obligatorios si el usuario intentó pagar */}
                                        {hasErrors && Object.keys(touched).length > 0 && (
                                            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-bold text-red-300 block mb-0.5">Campos obligatorios requeridos:</span>
                                                    <p className="font-light text-red-200/90 leading-relaxed">
                                                        Por favor completa todos los campos marcados con asterisco (*) en rojo (Nombre, Apellido, Correo y Celular válidos) para avanzar al pago.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {!acceptsWaiver && Object.keys(touched).length > 0 && !hasErrors && (
                                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2 animate-in fade-in">
                                                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                                <span>Debes aceptar los términos y condiciones de la expedición para continuar.</span>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handlePay}
                                            disabled={isSubmitting}
                                            className={`w-full !py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                                                isSubmitting
                                                    ? 'opacity-60 cursor-not-allowed bg-stone-800 text-white'
                                                    : hasErrors || !acceptsWaiver
                                                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 hover:bg-amber-500/35 hover:text-white'
                                                    : 'btn-arcteryx-primary shadow-[0_0_24px_rgba(245,158,11,0.35)]'
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                                                    <span>Iniciando pasarela de pago...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="w-4 h-4" />
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
                                            <span>Mercado Pago · Webpay · Transferencia</span>
                                            <span>·</span>
                                            <span className="flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Garantía de reprogramación
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-center gap-4 pt-3 border-t border-white/5">
                                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50">
                                                <Image src="/logo-sernatur.png" alt="Sernatur" width={16} height={16} className="w-3.5 h-3.5 object-contain rounded-full bg-white p-[0.5px]" />
                                                <span>Prestador SERNATUR</span>
                                            </div>
                                            <span className="text-white/20">|</span>
                                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50">
                                                <Image src="/logo-wfr-graupel.webp" alt="WFR" width={16} height={16} className="w-3.5 h-3.5 object-contain rounded-full" />
                                                <span>Primeros Auxilios WFR</span>
                                            </div>
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

function Field({ 
    label, 
    name, 
    value, 
    onChange, 
    onBlur,
    placeholder, 
    type = 'text', 
    required = false,
    error = '' 
}: {
    label: string;
    name: string;
    value: string;
    onChange: (val: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    error?: string;
}) {
    const hasError = Boolean(error);

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/80 uppercase tracking-wider block font-mono text-[11px]">
                    {label} {required && <span className="text-red-400 font-bold">*</span>}
                </label>
                {hasError && (
                    <span className="text-[10px] text-red-400 font-mono tracking-tight animate-in fade-in duration-200">
                        {error}
                    </span>
                )}
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={e => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                    hasError
                        ? 'border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400 bg-red-950/20 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                        : 'border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-black/40'
                }`}
                style={{
                    borderWidth: '1px',
                    borderStyle: 'solid',
                }}
            />
        </div>
    );
}
