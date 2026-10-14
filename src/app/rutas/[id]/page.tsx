import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Clock, Users, HeartPulse, Mountain, CheckCircle2, XCircle, Map, Calendar, MessageCircle, ShieldCheck, Ticket, Award, Sparkles, Navigation, Car, Video, Crown } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { challengesData } from '../../desafios/data';
import Image from 'next/image';
import ScrollToTopButton from '../../ScrollToTopButton';
import SwipeBackHandler from './SwipeBackHandler';
import MountainWeatherWidget from '@/components/MountainWeatherWidget';
import ElevationProfileWidget from '@/components/ElevationProfileWidget';
import { getMountainWeather } from '@/lib/weather';

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

async function getUpcomingDepartures(adventureId: string) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
            .from('agenda_departures')
            .select('id, start_date, current_pax, status')
            .eq('adventure_id', adventureId)
            .gte('start_date', today)
            .in('status', ['scheduled', 'confirmed'])
            .order('start_date', { ascending: true })
            .limit(3);
        return data || [];
    } catch (_) {
        return [];
    }
}

export default async function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (challengesData[id]) redirect(`/desafios/${id}`);

    const [route, upcomingDepartures] = await Promise.all([
        getRouteData(id),
        getUpcomingDepartures(id)
    ]);

    if (!route) notFound();

    const t = (route.title || '').toLowerCase();
    if (t.includes('5:00 am') || t.includes('5am')) redirect('/desafios/desafio-5am');
    if (t.includes('triple corona')) redirect('/desafios/triple-corona');
    if (t.includes('sierra de ramón') || t.includes('sierra de ramon')) redirect('/desafios/sierra-de-ramon');
    if (t.includes('desbloqueando')) redirect('/desafios/desbloqueando-santiago');

    const elev = parseInt(String(route.max_altitude || '').replace(/[^0-9]/g, '')) || 1600;
    const weather = await getMountainWeather(-33.35, -70.55, elev);

    const elevation = route.elevation_gain || (route.difficulty_level === 'Alta' ? '+1.200m' : '+600m');

    const itinerary = (route.itinerary_steps && Array.isArray(route.itinerary_steps) && route.itinerary_steps.length > 0)
        ? route.itinerary_steps.map((s: any) => ({
            time: s.hora || s.time || '',
            title: s.titulo || s.title || '',
            desc: s.descripcion || s.desc || ''
        }))
        : (route.itinerary?.length > 0 ? route.itinerary : [
            { time: '07:00', title: 'Punto de Encuentro', desc: 'Nos juntamos en el punto acordado en Lo Barnechea.' },
            { time: '08:30', title: 'Inicio del Trekking', desc: 'Comenzamos la caminata a ritmo de aclimatación y respiración.' },
            { time: '12:30', title: 'Cumbre y Desconexión', desc: 'Llegamos a la cumbre con vistas 360° sobre todo Santiago.' },
            { time: '16:00', title: 'Regreso y Cierre', desc: 'Bajamos a la ciudad con la expedición completa y fotos del día.' }
        ]);

    const isExpeditionPass = (route.category || '').toLowerCase() === 'expedition_pass' || (route.title || '').toLowerCase().includes('expedition pass');
    const isHighMountain = (route.category || '').toLowerCase() === 'high_mountain' || (route.title || '').toLowerCase().includes('5.424m') || (route.title || '').toLowerCase().includes('5.856m') || (route.title || '').toLowerCase().includes('4.954m');

    const included = isExpeditionPass ? [
        'Pick-up y Drop-off privado en tu hotel o domicilio en Santiago (SUV / 4x4)',
        'Guía de montaña profesional bilingüe certificado WFR dedicado a tu ritmo',
        'Registro audiovisual cinematográfico: Video Reel vertical 4K editado para tus redes',
        'Box lunch ancestral gourmet + frutos secos andinos y café de cumbre',
        'Bebida helada de cortesía al descender de la montaña',
        'Bastones de trekking de préstamo + botiquín WAFA',
        'Comunicación satelital Garmin InReach SOS activa'
    ] : (isHighMountain ? [
        'Arrieros y mulas de carga para transporte de equipo pesado a campamento base',
        'Campamento base montado con carpas 4 estaciones resistentes al viento',
        'Guías de alta montaña certificados WFR con protocolo estricto de aclimatación',
        'Monitoreo diario de oximetría (SpO2) y balón de oxígeno medicinal de emergencia',
        'Transporte 4x4 Santiago - Cordillera ida y vuelta',
        'Comunicación satelital Garmin SOS y radios VHF',
        'Todas las raciones de marcha y comidas calientes de campamento'
    ] : (route.included?.length > 0 ? route.included : [
        'Expedition Pass Digital con coordenadas GPS y voucher oficial',
        'Guía profesional de montaña WFR certificado',
        'Fotografía profesional en ruta y cumbre',
        'Botiquín de primeros auxilios de alta montaña',
        'Radios VHF y comunicación satelital Garmin SOS',
        'Ración de marcha técnica y snacks energéticos'
    ]));

    const notIncluded = isExpeditionPass ? [
        'Indumentaria y calzado técnico personal de montaña',
        'Consumos o comidas fuera del itinerario estipulado',
        'Propinas voluntarias para guía o conductor'
    ] : (isHighMountain ? [
        'Indumentaria técnica personal (botas de alta montaña, saco pluma -10°C, primera capa)',
        'Equipo técnico personal (crampones y piolet, disponibles para arriendo)',
        'Seguro médico personal de accidentes de montaña',
        'Propinas voluntarias para arrieros y guías'
    ] : (route.not_included?.length > 0 ? route.not_included : [
        'Transporte hasta el punto de encuentro en Lo Barnechea',
        'Indumentaria y calzado técnico de trekking',
        'Seguro personal de accidentes'
    ]));

    const whatsappMessage = encodeURIComponent(
        `¡Hola Santiago Hiking! Me interesa agendar la salida "${route.title}". ¿Tienen cupos disponibles para las próximas fechas?`
    );

    const schemaOrgMarkup = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": route.title,
        "description": route.description,
        "image": route.image_url || "/images/young-woman-running-on-mountain-royalty-free-image-1656406038.avif",
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

            <div className="relative min-h-screen text-white font-sans selection:bg-amber-500/30 bg-stone-950 pb-28 lg:pb-16">

                {/* ── FONDO OFICIAL DE LA RUTA (FOTOGRAFÍA ORIGINAL CON TINTE SUTIL) ── */}
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    {route.image_url ? (
                        <Image
                            src={route.image_url}
                            alt={route.title}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover object-center"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-stone-900" />
                    )}
                    {/* Tinte oscuro ultra sutil (solo 10%) únicamente sobre la imagen de fondo */}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                </div>

                {/* ── CONTENIDO EN CAPA SUPERIOR (Z-10 FLUYENDO SOBRE LA FOTO) ── */}
                <div className="relative z-10">
                    <SwipeBackHandler fallbackUrl="/#rutas" />
                    <ScrollToTopButton />

                    {/* ── NAVBAR FLOTANTE: TEXTO LIMPIO Y LOGOTIPO LIBRE DE PÍLDORA ── */}
                    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8 pointer-events-none">
                        <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
                            {/* Volver a Salidas: Solo texto limpio con flecha e interacción, sin cápsula */}
                            <Link 
                                href="/#rutas" 
                                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-white/80 hover:text-white transition-all hover:-translate-x-1 py-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
                            >
                                <ArrowLeft className="w-4 h-4 text-amber-400" />
                                <span>Volver a Salidas</span>
                            </Link>

                            {/* Logotipo Oficial Grande y Libre de Píldora */}
                            <Link 
                                href="/" 
                                className="flex items-center transition-transform duration-200 hover:scale-105 py-1"
                            >
                                <Image 
                                    src="/logotipo blanco.png" 
                                    alt="Santiago Hiking" 
                                    width={400} 
                                    height={100} 
                                    className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]" 
                                    priority 
                                />
                            </Link>
                        </div>
                    </header>

                    {/* ── HERO DE LA RUTA (TRANSPARENTE SOBRE LA FOTO FIJA) ── */}
                    <header className="relative min-h-[65vh] sm:min-h-[70vh] flex flex-col justify-end">
                        <div className="max-w-6xl mx-auto px-6 pb-8 pt-32 w-full">
                            <span className="bg-stone-900/80 backdrop-blur px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded border border-white/10 mb-4 inline-block">
                                {route.category}
                            </span>

                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                                {route.title}
                            </h1>

                            <p className="text-white/90 text-base md:text-xl font-light max-w-2xl leading-relaxed mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                {route.description}
                            </p>

                            {/* Contenedor de Métricas Oficial (Idéntico a las tarjetas del Home) */}
                            <div 
                                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 px-4 text-center font-mono rounded-xl max-w-2xl mb-8"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    border: '1px solid rgba(255, 255, 255, 0.10)',
                                }}
                            >
                                <div>
                                    <p className="text-[10px] text-white/40 uppercase font-medium">Duración</p>
                                    <p className="text-xs sm:text-sm font-bold text-white">{route.duration_text || `${route.duration_days}d`}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/40 uppercase font-medium">Dificultad</p>
                                    <p className="text-xs sm:text-sm font-bold text-amber-400">{route.difficulty_level}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/40 uppercase font-medium">Altura</p>
                                    <p className="text-xs sm:text-sm font-bold text-white">
                                        {route.max_altitude
                                            ? (String(route.max_altitude).toLowerCase().includes('m') ? route.max_altitude : `${route.max_altitude} m`)
                                            : '1.638 m'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/40 uppercase font-medium">Desnivel</p>
                                    <p className="text-xs sm:text-sm font-bold text-white">{elevation}</p>
                                </div>
                            </div>

                            {/* Botones Píldora Arc'teryx (Desktop & Mobile) */}
                            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                                <Link
                                    href={`/reservar?route=${route.id}`}
                                    className="btn-arcteryx-primary flex items-center justify-center !py-3.5 !px-8 text-xs font-mono font-bold tracking-widest shadow-[0_0_24px_rgba(245,158,11,0.35)]"
                                >
                                    <Calendar className="w-4 h-4 mr-2" /> AGENDAR {route.title}
                                </Link>

                                <a
                                    href={`https://wa.me/56957958467?text=${whatsappMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-arcteryx flex items-center justify-center !py-3.5 !px-8 text-xs font-mono font-bold tracking-widest"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2 text-emerald-400" /> CONSULTAR WHATSAPP
                                </a>
                            </div>
                        </div>
                    </header>

                    {/* ── CONTENIDO PRINCIPAL FLOTANDO SOBRE LA FOTO FIJA ── */}
                    <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Columna Izquierda: Storytelling + Altimetría + Luxury Pass + Itinerario + Host + Inclusiones */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* ── Storytelling Editorial (si existe) ── */}
                            {route.story_paragraphs && route.story_paragraphs.length > 0 && (
                                <section 
                                    className="p-6 sm:p-8 rounded-3xl space-y-4"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.10)',
                                    }}
                                >
                                    <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold block">
                                        La Experiencia
                                    </span>
                                    <div className="space-y-3 text-white/70 text-sm font-light leading-relaxed">
                                        {route.story_paragraphs.map((p: string, idx: number) => (
                                            <p key={idx}>{p}</p>
                                        ))}
                                    </div>
                                    {route.tagline && (
                                        <div className="border-l-2 border-amber-400 pl-4 py-1 italic text-white/80 text-sm">
                                            "{route.tagline}"
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* ── Perfil Altimétrico y Strava ── */}
                            <ElevationProfileWidget
                                maxAltitude={route.max_altitude || '1.638m'}
                                elevationGain={elevation}
                                distance={route.distance || '6 km'}
                                stravaUrl={route.strava_url}
                                gpxTrackUrl={route.gpx_track_url}
                            />

                            {/* ── Tarjeta Destacada: Luxury Pass Digital Incluido ── */}
                            <section 
                                className="p-6 sm:p-8 rounded-3xl relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                    boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
                                }}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                                            <Ticket className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block">
                                                Protocolo Oficial de Expedición
                                            </span>
                                            <h3 className="text-lg font-bold text-white tracking-tight">
                                                Expedition Pass & Voucher Digital Oficial
                                            </h3>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                        Envío Inmediato a tu Correo
                                    </span>
                                </div>
                                <p className="text-white/70 text-sm font-light leading-relaxed mb-4">
                                    Al confirmar tu reserva, emitimos tu <strong className="text-white font-medium">Expedition Pass</strong> personalizado con código QR de abordaje, coordenadas GPS exactas para Google Maps y Waze, pronóstico meteorológico actualizado en tiempo real y contacto directo con tu guía asignado.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-amber-500/20 text-xs text-white/60 font-mono">
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400">📍</span> Coordenadas Waze / Maps
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400">📡</span> Canal VHF & Satélite SOS
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400">🎟️</span> Acceso Rápido con QR
                                    </div>
                                </div>
                            </section>

                            {/* Itinerario con Glassmorphism */}
                            <section 
                                className="p-6 sm:p-8 rounded-3xl"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.10)',
                                }}
                            >
                                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                                    <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-bold">Ruta · Itinerario</span>
                                </div>
                                <div className="space-y-6">
                                    {itinerary.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-5">
                                            <div className="w-16 text-right pt-1 shrink-0">
                                                <span className="text-amber-400 font-mono text-xs font-bold">{item.time}</span>
                                            </div>
                                            <div className="relative pb-6 flex-1">
                                                {idx !== itinerary.length - 1 && (
                                                    <div className="absolute top-7 bottom-0 left-[-13px] w-px bg-white/10" />
                                                )}
                                                <div className="w-5 h-5 rounded-full bg-stone-950 border-2 border-amber-400 absolute -left-[18px] top-0 flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                </div>
                                                <h3 className="text-base font-bold text-white uppercase tracking-tight mb-1">{item.title}</h3>
                                                <p className="text-white/60 font-light text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* ── Sección de Anfitrión & Guía Oficial (Mario Cruz) ── */}
                            <section 
                                className="p-6 sm:p-8 rounded-3xl"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.10)',
                                }}
                            >
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500/40 shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                                        <Image
                                            src="/images/IMG_1674-1024x768.jpg"
                                            alt="Mario Cruz - Guía Fundador de Santiago Hiking"
                                            fill
                                            className="object-cover object-center"
                                        />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left space-y-2">
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                            <span className="text-amber-400 font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
                                                Liderazgo en Montaña
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/80 border border-white/10">
                                                Bilingüe (ES / EN)
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">
                                            Guiado por Mario Cruz & Equipo de Montaña
                                        </h3>
                                        <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed">
                                            Montañista y fundador de Santiago Hiking. Certificado en primeros auxilios en áreas remotas (WFR) y conocedor de cada filo, quebrada y mirador de la Cordillera de los Andes sobre el valle central. Nuestra prioridad es tu seguridad, el ritmo pausado y la hospitalidad de montaña.
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-mono text-white/50">
                                            <span className="flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Certificación WFR
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <HeartPulse className="w-3.5 h-3.5 text-emerald-400" /> Protocolo Cardioprotegido
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Award className="w-3.5 h-3.5 text-amber-400" /> +10 años en Cordillera
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ── BANNER EXPEDITION PASS / HIGH MOUNTAIN VIP UPGRADE ── */}
                            {(!isExpeditionPass && !isHighMountain) ? (
                                <section 
                                    className="p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-amber-500/30 shadow-[0_12px_40px_rgba(245,158,11,0.12)]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(20, 20, 20, 0.85) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                    }}
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div className="space-y-3 max-w-xl">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                                                    <Crown className="w-3 h-3 text-amber-400" /> Formato Expedition Boutique Disponible
                                                </span>
                                                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">100% Privado</span>
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                                                ¿Prefieres vivir esta cumbre en privado y a tu propio ritmo?
                                            </h3>
                                            <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                                                Convierte esta ruta en una <strong>Expedition Boutique exclusiva</strong> para ti o tu grupo cerrado. Incluye pick-up directo en tu hotel o domicilio en Santiago, fecha abierta a tu elección (lunes a domingo) y entrega de un video <strong>Reel 4K editado profesional</strong> para tus redes.
                                            </p>
                                            <div className="flex flex-wrap gap-4 pt-1 text-xs font-mono text-white/60">
                                                <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-amber-400" /> Pick-up Puerta a Puerta</span>
                                                <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-amber-400" /> Reel 4K de Cumbre</span>
                                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Guía WFR Exclusivo</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
                                            <a
                                                href={`https://wa.me/56957958467?text=${encodeURIComponent(`¡Hola! Me gustaría cotizar la ruta "${route.title}" en formato privado Expedition Boutique (con pick-up en Santiago y Reel 4K). ¿Qué disponibilidad tienen?`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-arcteryx-primary !py-3.5 !px-6 text-xs font-mono font-bold tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                                            >
                                                <Sparkles className="w-4 h-4" /> COTIZAR EXPEDITION BOUTIQUE
                                            </a>
                                            <span className="text-[10px] font-mono text-center text-white/40">
                                                Tarifa a medida · Respuesta &lt; 15 min
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            ) : (
                                <section 
                                    className="p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-amber-500/30 shadow-[0_12px_40px_rgba(245,158,11,0.15)]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 15, 15, 0.9) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                                            <Crown className="w-3 h-3 text-amber-400" /> {isHighMountain ? 'Expedition High Mountain Oficial' : 'Expedition Boutique Privada'}
                                        </span>
                                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Servicio Todo Incluido</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                                        Estándar Internacional de Expedición Andina
                                    </h3>
                                    <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-4">
                                        {isHighMountain 
                                            ? 'Operación integral con campamentos de altura, porteo de mulas y arrieros (según itinerario), ratio técnico de seguridad 1:2 o 1:3, alimentación liofilizada de montaña y monitoreo satelital Garmin SOS 24/7 en tiempo real.'
                                            : 'Servicio 100% privado con transporte ejecutivo puerta a puerta desde tu hotel en Santiago, ritmo de ascenso personalizado sin presiones y cobertura audiovisual con Reel 4K profesional listo para compartir.'
                                        }
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                                            <span className="text-amber-400 font-bold flex items-center gap-1"><Car className="w-3.5 h-3.5" /> Pick-up</span>
                                            <span className="text-[11px] text-white/60">Puerta a puerta en Santiago</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                                            <span className="text-amber-400 font-bold flex items-center gap-1"><Video className="w-3.5 h-3.5" /> Reel 4K</span>
                                            <span className="text-[11px] text-white/60">Edición profesional incluida</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                                            <span className="text-amber-400 font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> WFR / SOS</span>
                                            <span className="text-[11px] text-white/60">Garmin InReach satelital</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                                            <span className="text-amber-400 font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> A tu Medida</span>
                                            <span className="text-[11px] text-white/60">Lunes a Domingo a elección</span>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Inclusiones (Diseño de Tarjetas de Cristal Ahumado) */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div 
                                    className="p-6 rounded-2xl" 
                                    style={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)' 
                                    }}
                                >
                                    <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Incluye
                                    </h3>
                                    <ul className="space-y-3">
                                        {included.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-white/70 font-light">
                                                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div 
                                    className="p-6 rounded-2xl" 
                                    style={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)' 
                                    }}
                                >
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

                        {/* Columna Derecha: Clima en Vivo + Sidebar Desktop de Cristal Ahumado */}
                        <div className="relative hidden lg:block space-y-6">
                            {/* Widget de Clima Andino en Vivo */}
                            <MountainWeatherWidget
                                weather={weather}
                                locationName={route.title}
                                elevationText={route.max_altitude || undefined}
                            />

                            <div 
                                className="sticky top-28 p-7 rounded-3xl space-y-6" 
                                style={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                                    backdropFilter: 'blur(24px)', 
                                    WebkitBackdropFilter: 'blur(24px)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                }}
                            >
                                <div>
                                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 block mb-1">
                                        {isHighMountain ? 'Tarifa Expedition High Mountain' : (isExpeditionPass ? 'Tarifa Expedition Boutique' : 'Valor por persona')}
                                    </span>
                                    {isHighMountain ? (
                                        <div>
                                            <div className="flex items-baseline justify-between">
                                                <p className="text-4xl font-black text-amber-400 font-mono">
                                                    US${Math.round((route.base_price || 1460000) / 975).toLocaleString('en-US')}
                                                </p>
                                                <span className="text-sm text-white/60 font-mono">
                                                    ${Number(route.base_price || 1460000).toLocaleString('es-CL')} CLP
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                                                Garantía de tarifa oficial · Guías UIAGM/WFR
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-baseline justify-between">
                                            <p className="text-4xl font-black text-white font-mono">
                                                ${Number(route.base_price || 25000).toLocaleString('es-CL')}
                                            </p>
                                            <span className="text-sm text-white/45 font-mono">
                                                US${Math.round((route.base_price || 25000) / 950).toLocaleString('en-US')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Widget de Salidas Confirmadas con Disponibilidad */}
                                {upcomingDepartures && upcomingDepartures.length > 0 && (
                                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2.5">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" /> Próximas Salidas
                                        </span>
                                        <div className="space-y-2">
                                            {upcomingDepartures.map((dep: any) => {
                                                const spots = (route.max_pax || 12) - (dep.current_pax || 0);
                                                const depDate = new Date(dep.start_date + 'T12:00:00').toLocaleDateString('es-CL', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short'
                                                });
                                                return (
                                                    <div key={dep.id} className="flex items-center justify-between text-xs font-mono">
                                                        <span className="text-white/90 capitalize">{depDate}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${spots <= 3 ? 'text-amber-300 bg-amber-500/20' : 'text-emerald-300 bg-emerald-500/20'}`}>
                                                            {spots > 0 ? `${spots} cupos` : 'Agotado'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Link
                                        href={`/reservar?route=${route.id}`}
                                        className="btn-arcteryx-primary w-full flex items-center justify-center !py-4 text-xs font-mono font-bold tracking-widest shadow-[0_0_24px_rgba(245,158,11,0.3)]"
                                    >
                                        <Calendar className="w-4 h-4 mr-2" /> AGENDAR {route.title}
                                    </Link>

                                    <a
                                        href={`https://wa.me/56957958467?text=${whatsappMessage}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-arcteryx w-full flex items-center justify-center !py-3.5 text-xs font-mono font-bold tracking-widest"
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2 text-emerald-400" /> WHATSAPP DIRECTO
                                    </a>
                                </div>

                                <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] font-mono text-white/40">
                                    <p className="flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Guiado certificado WFR
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Ticket className="w-3.5 h-3.5 text-amber-400" /> Expedition Pass digital inmediato
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-amber-400" /> Reserva confirmada al instante
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* ── BARRA FLOTANTE INFERIOR MOBILE (SIEMPRE ACCESIBLE AL PULGAR) ── */}
                    <div 
                        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 py-3 border-t border-white/10"
                        style={{
                            backgroundColor: 'rgba(10, 10, 10, 0.92)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 -10px 30px rgba(0,0,0,0.6)'
                        }}
                    >
                        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
                            <div>
                                <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">
                                    {isHighMountain ? 'Tarifa High Mountain' : (isExpeditionPass ? 'Expedition Boutique' : 'Valor persona')}
                                </span>
                                {isHighMountain ? (
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-xl font-black text-amber-400 font-mono">
                                            US${Math.round((route.base_price || 1460000) / 975).toLocaleString('en-US')}
                                        </span>
                                        <span className="text-[11px] text-white/50 font-mono">
                                            ${Number(route.base_price || 1460000).toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-xl font-black text-white font-mono">
                                            ${Number(route.base_price || 25000).toLocaleString('es-CL')}
                                        </span>
                                        <span className="text-[11px] text-white/40 font-mono">
                                            US${Math.round((route.base_price || 25000) / 950).toLocaleString('en-US')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Link
                                href={`/reservar?route=${route.id}`}
                                className="btn-arcteryx-primary !py-2.5 !px-6 text-xs font-mono font-bold tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-1.5"
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>AGENDAR AHORA</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
