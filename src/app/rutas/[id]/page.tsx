import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Map, Clock, Users, HeartPulse, Mountain, CheckCircle2, XCircle, Tent, Backpack } from 'lucide-react';
import { notFound } from 'next/navigation';

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

export default async function RouteDetailPage({ params }: { params: { id: string } }) {
    const route = await getRouteData(params.id);

    if (!route) {
        notFound();
    }

    // Datos reales de la Base de Datos con fallbacks
    const elevation = route.elevation_gain || (route.difficulty_level === 'Alta' ? '+1.200m' : '+600m');
    const itinerary = route.itinerary && route.itinerary.length > 0 ? route.itinerary : [
        { time: '07:00', title: 'Punto de Encuentro', desc: 'Nos juntamos en el punto acordado en Lo Barnechea.' },
        { time: '08:30', title: 'Inicio del Trekking', desc: 'Comenzamos la caminata a ritmo suave para aclimatar.' },
        { time: '12:30', title: 'Cumbre y Descanso', desc: 'Llegamos al punto más alto.' },
        { time: '16:00', title: 'Regreso y Gastronomía', desc: 'Bajamos a la comuna para recargar energías en local aliado.' }
    ];

    const included = route.included && route.included.length > 0 ? route.included : [
        'Guía profesional WFR certificado',
        'Botiquín de primeros auxilios completo',
        'Radios VHF y comunicación satelital',
        'Ración de marcha premium local'
    ];

    const notIncluded = route.not_included && route.not_included.length > 0 ? route.not_included : [
        'Transporte hasta el punto de encuentro',
        'Zapatos y ropa técnica personal',
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
            "url": `https://gaz-style.vercel.app/reservar?route=${route.id}`
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgMarkup) }}
            />
            
            <style dangerouslySetInnerHTML={{
                __html: `
                  .glass-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                  }
                  .gold-gradient-text {
                    background: linear-gradient(to right, #f59e0b, #fbbf24, #fcd34d);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                `
            }} />

            <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-amber-500/30">
                {/* Navbar Simple */}
                <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
                    <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Volver
                        </Link>
                        <div className="font-serif font-bold text-xl tracking-wider text-white">
                            GAZ<span className="text-amber-500 italic">_Style</span>
                        </div>
                    </div>
                </nav>

                {/* Hero Header */}
                <header className="relative pt-32 pb-24 px-6 border-b border-white/10">
                    <div className="absolute inset-0 z-0">
                        <Image 
                            src={route.image_url || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"} 
                            alt={route.title} 
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto">
                        <span className="bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block">
                            {route.category}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                            {route.title}
                        </h1>
                        <p className="text-xl text-slate-400 font-light max-w-2xl leading-relaxed mb-10">
                            {route.description}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4">
                                <Clock className="w-8 h-8 text-amber-500" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Duración</p>
                                    <p className="text-white font-medium">{route.duration_text || `${route.duration_days} días`}</p>
                                </div>
                            </div>
                            <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4">
                                <HeartPulse className="w-8 h-8 text-amber-500" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Dificultad</p>
                                    <p className="text-white font-medium">{route.difficulty_level}</p>
                                </div>
                            </div>
                            <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4">
                                <Map className="w-8 h-8 text-amber-500" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Distancia</p>
                                    <p className="text-white font-medium">{route.distance || '12 km'}</p>
                                </div>
                            </div>
                            <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4">
                                <Mountain className="w-8 h-8 text-amber-500" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Desnivel / Altitud</p>
                                    <p className="text-white font-medium">{elevation} <span className="text-slate-400 text-xs">({route.max_altitude || '3.200m'})</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                    
                    {/* Contenido Principal (Izquierda) */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Itinerario */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <Map className="text-amber-500" /> Itinerario de la Expedición
                            </h2>
                            <div className="space-y-6">
                                {itinerary.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-6">
                                        <div className="w-16 text-right pt-1 shrink-0">
                                            <span className="text-amber-500 font-mono font-bold">{item.time}</span>
                                        </div>
                                        <div className="relative pb-6">
                                            {/* Linea vertical */}
                                            {idx !== itinerary.length - 1 && (
                                                <div className="absolute top-8 bottom-0 left-[11px] w-px bg-white/10" />
                                            )}
                                            <div className="w-6 h-6 rounded-full bg-stone-900 border-2 border-amber-500 absolute -left-3 top-0 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                            </div>
                                            <div className="pl-8">
                                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-slate-400 font-light text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Inclusiones */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-panel p-8 rounded-3xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500" /> Qué Incluye
                                </h3>
                                <ul className="space-y-4">
                                    {included.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                            <span className="text-emerald-500 mt-0.5">✓</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="glass-panel p-8 rounded-3xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <XCircle className="text-rose-500" /> No Incluye
                                </h3>
                                <ul className="space-y-4">
                                    {notIncluded.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                            <span className="text-rose-500 mt-0.5">✕</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Reserva (Derecha) */}
                    <div className="relative">
                        <div className="sticky top-28 glass-panel p-8 rounded-3xl border border-amber-500/20">
                            <div className="text-center mb-8">
                                <p className="text-sm text-slate-400 uppercase tracking-widest mb-2">Valor por persona</p>
                                <p className="text-5xl font-bold text-white mb-2">${Number(route.base_price).toLocaleString('es-CL')}</p>
                                <p className="text-xs text-emerald-400">Cupos limitados (Máx {route.max_pax} pax)</p>
                            </div>

                            <Link 
                                href={`/reservar?route=${route.id}`} 
                                className="block w-full bg-amber-500 hover:bg-amber-400 text-black text-center px-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.2)] mb-4"
                            >
                                Agendar Expedición
                            </Link>

                            <p className="text-center text-xs text-slate-500 font-light mt-4 px-4">
                                Requiere completar cuestionario médico y firma de waiver digital.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
