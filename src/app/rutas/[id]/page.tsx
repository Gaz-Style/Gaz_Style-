import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Clock, Users, HeartPulse, Mountain, CheckCircle2, XCircle, Map } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { challengesData } from '../../desafios/data';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function getRouteData(id: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data, error } = await supabase
        .from('adventures_catalog')
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) return null;
    return data;
}

export default async function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (challengesData[id]) redirect(`/desafios/${id}`);

    const route = await getRouteData(id);
    if (!route) notFound();

    const elevation = route.elevation_gain || (route.difficulty_level === 'Alta' ? '+1.200m' : '+600m');

    const itinerary = route.itinerary?.length > 0 ? route.itinerary : [
        { time: '07:00', title: 'Punto de Encuentro', desc: 'Nos juntamos en el punto acordado en Lo Barnechea.' },
        { time: '08:30', title: 'Inicio del Trekking', desc: 'Comenzamos la caminata a ritmo suave para aclimatar.' },
        { time: '12:30', title: 'Cumbre y Descanso', desc: 'Llegamos al punto más alto.' },
        { time: '16:00', title: 'Regreso', desc: 'Bajamos a la ciudad con la expedición completa.' }
    ];

    const included = route.included?.length > 0 ? route.included : [
        'Guía profesional WFR certificado',
        'Botiquín de primeros auxilios completo',
        'Radios VHF y comunicación satelital',
        'Ración de marcha premium local'
    ];

    const notIncluded = route.not_included?.length > 0 ? route.not_included : [
        'Transporte hasta el punto de encuentro',
        'Equipo técnico personal',
        'Seguro de accidentes personales'
    ];

    const schemaOrgMarkup = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": route.title,
        "description": route.description,
        "image": route.image_url || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
        "offers": {
            "@type": "Offer",
            "price": route.base_price,
            "priceCurrency": "CLP",
            "availability": "https://schema.org/InStock",
        }
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgMarkup) }} />

            <div className="min-h-screen bg-stone-950 text-white font-sans selection:bg-amber-500/30">

                {/* ── Navbar ──────────────────────────────────────── */}
                <nav className="fixed top-0 w-full z-50" style={{ backgroundColor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-bold text-white/60 hover:text-white uppercase tracking-[0.2em] transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Volver
                        </Link>
                        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                            <Image src="/logo-sh-white.png" alt="Santiago Hiking" width={36} height={36} className="h-8 w-auto object-contain" priority />
                            <Image src="/logo-text-white.png" alt="Santiago Hiking" width={160} height={28} className="h-6 w-auto object-contain" priority />
                        </Link>
                    </div>
                </nav>

                {/* ── Hero full-bleed ──────────────────────────────── */}
                <header className="relative min-h-[70vh] flex flex-col justify-end">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={route.image_url || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"}
                            alt={route.title}
                            fill priority sizes="100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20" />
                    </div>

                    <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12 pt-32">
                        <span className="bg-amber-500 text-black text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full mb-5 inline-block">
                            {route.category}
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4">
                            {route.title}
                        </h1>
                        <p className="text-white/60 text-base md:text-lg font-light max-w-2xl leading-relaxed">
                            {route.description}
                        </p>

                        {/* Stats grid — igual que las tarjetas del carrusel */}
                        <div className="grid grid-cols-4 gap-3 mt-8 max-w-xl">
                            {[
                                { label: 'Duración', value: route.duration_text || `${route.duration_days}d` },
                                { label: 'Dificultad', value: route.difficulty_level, amber: true },
                                { label: 'Cupo Máx', value: `${route.max_pax} pax` },
                                { label: 'Desnivel', value: elevation },
                            ].map((s) => (
                                <div key={s.label} className="text-center py-3 rounded-xl font-mono" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <p className="text-[10px] text-white/40 uppercase font-medium mb-1">{s.label}</p>
                                    <p className={`text-sm font-bold ${s.amber ? 'text-amber-400' : 'text-white'}`}>{s.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                {/* ── CTA Strip — visible en mobile, debajo del hero ─── */}
                <div className="px-6 py-5 lg:hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="max-w-6xl mx-auto">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 block mb-1">Valor por persona</span>
                        <div className="flex items-baseline justify-between mb-4">
                            <span className="text-3xl font-black text-white font-mono">${Number(route.base_price || 25000).toLocaleString('es-CL')}</span>
                            <span className="text-sm text-white/45 font-mono">US${Math.round((route.base_price || 25000) / 950).toLocaleString('en-US')}</span>
                        </div>
                        <Link
                            href={`/reservar?route=${route.id}`}
                            className="block w-full bg-amber-500 hover:bg-amber-400 text-black text-center px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02] shadow-[0_0_24px_rgba(245,158,11,0.3)] text-sm"
                        >
                            Agendar {route.title}
                        </Link>
                    </div>
                </div>

                {/* ── Contenido ────────────────────────────────────── */}
                <main className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Columna izquierda */}
                    <div className="lg:col-span-2 space-y-14">

                        {/* Itinerario */}
                        <section>
                            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                                <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold">Ruta · Itinerario</span>
                            </div>
                            <div className="space-y-6">
                                {itinerary.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-5">
                                        <div className="w-14 text-right pt-1 shrink-0">
                                            <span className="text-amber-500 font-mono text-xs font-bold">{item.time}</span>
                                        </div>
                                        <div className="relative pb-6 flex-1">
                                            {idx !== itinerary.length - 1 && (
                                                <div className="absolute top-7 bottom-0 left-[-13px] w-px bg-white/10" />
                                            )}
                                            <div className="w-5 h-5 rounded-full bg-stone-900 border-2 border-amber-500 absolute -left-[18px] top-0 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            </div>
                                            <h3 className="text-base font-bold text-white uppercase tracking-tight mb-1">{item.title}</h3>
                                            <p className="text-white/50 font-light text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Inclusiones */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-white/50" /> Incluye
                                </h3>
                                <ul className="space-y-3">
                                    {included.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-white/60 font-light">
                                            <span className="text-white/50 mt-0.5 shrink-0">✓</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-rose-400" /> No incluye
                                </h3>
                                <ul className="space-y-3">
                                    {notIncluded.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-white/60 font-light">
                                            <span className="text-rose-400 mt-0.5 shrink-0">✕</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar desktop */}
                    <div className="relative">
                        <div className="sticky top-24 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 block mb-1">Valor por persona</span>
                            <div className="flex items-baseline justify-between mb-5">
                                <p className="text-4xl font-black text-white font-mono">
                                    ${Number(route.base_price || 25000).toLocaleString('es-CL')}
                                </p>
                                <span className="text-sm text-white/45 font-mono">
                                    US${Math.round((route.base_price || 25000) / 950).toLocaleString('en-US')}
                                </span>
                            </div>

                            <Link
                                href={`/reservar?route=${route.id}`}
                                className="block w-full bg-amber-500 hover:bg-amber-400 text-black text-center px-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02] shadow-[0_0_24px_rgba(245,158,11,0.3)] text-sm mb-4"
                            >
                                Agendar {route.title}
                            </Link>

                            <p className="text-center text-[11px] text-white/30 font-light">
                                Requiere cuestionario médico y waiver digital.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
