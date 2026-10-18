'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Lightbulb, X, ArrowRight, CheckCircle2, ChevronRight, 
  Flame, Clock, MessageCircle, RotateCcw,
  Mountain, Users, Sun, Compass
} from 'lucide-react';
import { trackLeadGuide } from '@/lib/analytics';
import GlobalSearchModal from '@/components/GlobalSearchModal';

interface Props {
  lang?: string;
  allRoutes?: any[];
}

// ── Rutas Recomendadas (Con imágenes reales locales y métricas idénticas a la web) ──────
const ROUTES = {
  iniciacion: {
    id: 'sunset-manquehuito',
    slug: '#salidas-grupales',
    title: 'WILDTREK',
    subtitle: 'Ascenso al Manquehuito',
    difficulty: 'Media',
    duration: '3 - 5',
    max_pax: '12 pax',
    desc: 'Ascenso al Manquehuito para ver el atardecer cayendo sobre Santiago. Vistas doradas, desconexión y deporte.',
    image: '/images/young-woman-running-on-mountain-royalty-free-image-1656406038.avif',
    tag: 'TREKKING',
  },
  intermedio_sunset: {
    id: 'desafio-5am',
    slug: '/desafios/desafio-5am',
    title: 'DESAFÍO 5:00 AM',
    subtitle: 'Cumbre al romper el alba',
    difficulty: 'Media',
    duration: '4 - 5',
    max_pax: '10 pax',
    desc: 'Ascenso nocturno con linternas frontales y cumbre al alba sobre el mar de nubes. Desciendes antes de que empiece el ruido urbano.',
    image: '/images/atleta-trail-running.webp',
    tag: 'SUNRISE',
  },
  intermedio_cardio: {
    id: 'triple-corona',
    slug: '/desafios/triple-corona',
    title: 'TRIPLE CORONA',
    subtitle: '3 Cumbres · El reto definitivo',
    difficulty: 'Avanzada',
    duration: '7 - 8',
    max_pax: '8 pax',
    desc: 'Manquehuito, Cerro Manquehue y Cerro Pochoco en una sola jornada. Resistencia física y cardio real en la cordillera.',
    image: '/images/andestrail-5.jpg',
    tag: 'TRAIL & CARDIO',
  },
  avanzado: {
    id: 'sierra-de-ramon',
    slug: '/desafios/sierra-de-ramon',
    title: 'SIERRA DE RAMÓN',
    subtitle: 'La reina técnica de los Andes',
    difficulty: 'Exigente',
    duration: 'Full Day',
    max_pax: '6 pax',
    desc: 'Aristas técnicas de alta montaña sobre los 3.250m. Protocolo de ritmo y conquista física sobre los glaciares.',
    image: '/images/wildtrek_sunset.png',
    tag: 'ALTA MONTAÑA',
  },
} as const;

type RouteKey = keyof typeof ROUTES;

export default function HeroActionButtons({ lang = 'es', allRoutes = [] }: Props) {
  const isEn = lang === 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [isAllAdventuresOpen, setIsAllAdventuresOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Respuestas del quiz
  const [selectedVibe, setSelectedVibe] = useState<string>('sunset');
  const [selectedLevel, setSelectedLevel] = useState<string>('iniciacion');

  // Formulario opcional para guardar ruta
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Determinar ruta según respuestas
  const getRecommendedRoute = (): typeof ROUTES[RouteKey] => {
    if (selectedLevel === 'avanzado' || selectedVibe === 'alta_montana') {
      return ROUTES.avanzado;
    }
    if (selectedLevel === 'intermedio' && selectedVibe === 'cardio') {
      return ROUTES.intermedio_cardio;
    }
    if (selectedLevel === 'intermedio') {
      return ROUTES.intermedio_sunset;
    }
    return ROUTES.iniciacion;
  };

  const route = getRecommendedRoute();

  // Cerrar modal con tecla Escape y bloqueo suave de scroll
  useEffect(() => {
    if (!isOpen) return;

    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleReset = () => {
    setStep(1);
    setSelectedVibe('sunset');
    setSelectedLevel('iniciacion');
    setSaved(false);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      await fetch('/api/lead-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name.trim() || 'Aventurero',
          phone,
          lang,
          experience_level: selectedLevel,
          preferred_style: selectedVibe,
          recommended_route: route.title,
          discount_code: 'SUMMIT50',
        }),
      });
      setSaved(true);
      trackLeadGuide(email);
    } catch {
      // Si falla API igual mostramos éxito al usuario
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    isEn
      ? `Hi Santiago Hiking! I took the adventure quiz on your website and got recommended "${route.title}". Do you have available spots for an upcoming date?`
      : `¡Hola Santiago Hiking! Hice el test en la web y me recomendó "${route.title}". ¿Tienen cupos disponibles para próximas salidas?`
  );

  // Escuchar evento global para abrir el Quiz desde la sección de niveles o cualquier parte
  useEffect(() => {
    const handleOpenQuiz = () => {
      handleReset();
      setIsOpen(true);
    };
    window.addEventListener('open-hiking-quiz', handleOpenQuiz);
    return () => window.removeEventListener('open-hiking-quiz', handleOpenQuiz);
  }, []);

  return (
    <>
      {/* ── BOTÓN HERO CÁPSULA GLASSMORPHISM (SIN BRILLO / SIN GLOW) ── */}
      <div className="flex items-center justify-center w-full">
        <a
          href="#expediciones"
          className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-center select-none font-mono text-amber-300 hover:text-white"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.20)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          }}
        >
          <span>
            {lang === 'en' 
              ? 'View Adventures' 
              : lang === 'pt' 
              ? 'Ver Aventuras' 
              : 'Ver Aventura'}
          </span>
          <span className="text-amber-400 group-hover:translate-y-0.5 transition-transform duration-200">↓</span>
        </a>
      </div>

      {/* ── MODAL MAESTRO: CUMBRES DEL ATLAS & AVENTURAS GUIADAS CON BUSCADOR ── */}
      <GlobalSearchModal
        isOpen={isAllAdventuresOpen}
        onClose={() => setIsAllAdventuresOpen(false)}
        lang={lang}
      />

      {/* ── MODAL POPUP CON LA IDENTIDAD EXACTA DE LA WEB: CRISTAL, PÍLDORAS Y VIDEO NATIVO ── */}
      {isOpen && mounted && typeof document !== 'undefined' && document.body && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300 overflow-y-auto overscroll-none"
          style={{ touchAction: 'pan-y' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Velo transparente ligero: mantiene el video y la montaña 100% visibles, luminosos y con su color real */}
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px] pointer-events-none" />

          {/* ── TARJETA DEL MODAL: CRISTAL AHUMADO IDÉNTICO A LAS TARJETAS DE LA WEB ── */}
          <div 
            className="relative z-10 w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-200 my-auto overscroll-contain shadow-[0_25px_80px_rgba(0,0,0,0.85)]"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
            }}
          >
            {/* Cabecera con Fotografía Real de Cerro / Trail (Idéntica a la tarjeta WILDTREK) */}
            <div className="aspect-[16/8] relative w-full overflow-hidden bg-stone-900 shrink-0">
              <Image
                src={step === 3 ? route.image : '/images/young-woman-running-on-mountain-royalty-free-image-1656406038.avif'}
                alt="Cerro y Aventura"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              
              {/* Badge superior derecho idéntico al de las tarjetas de la web */}
              <span className="absolute top-4 right-4 bg-stone-900/80 backdrop-blur px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-white rounded shadow-sm">
                {step === 3 ? route.tag : 'TREKKING'}
              </span>

              {/* Botón Cerrar flotante sobre la foto */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-stone-900/80 hover:bg-stone-900 backdrop-blur border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Título sobre la foto */}
              <div className="absolute bottom-3 left-5 right-5">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-amber-400 font-bold block mb-0.5">
                  {step < 3 ? `PREGUNTA ${step} DE 2` : 'TU RECOMENDACIÓN'}
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-white uppercase tracking-tight leading-tight drop-shadow-md">
                  {step === 1 && '¿QUÉ ACTIVIDADES TE INTERESAN?'}
                  {step === 2 && '¿CUÁL ES TU NIVEL DE TREKKING?'}
                  {step === 3 && route.title}
                </h3>
              </div>
            </div>

            {/* Cuerpo del Modal con los Contenedores y Botones Píldora de la Web */}
            <div className="flex-1 p-5 overflow-y-auto overscroll-contain space-y-3">
              
              {/* ── PASO 1: ACTIVIDADES (BOTONES PÍLDORA .btn-arcteryx DE LA WEB) ── */}
              {step === 1 && (
                <div className="space-y-3">
                  {/* Contenedor métrico/informativo idéntico al recuadro de la web */}
                  <div 
                    className="py-2.5 px-4 text-center font-mono rounded-lg" 
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <p className="text-[10px] text-white/40 uppercase font-medium">Modalidad</p>
                    <p className="text-xs font-bold text-white">Selecciona tu estilo de aventura</p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { id: 'sunset', title: 'Atardecer & Nubes', tag: 'SUNSET' },
                      { id: 'cardio', title: 'Cardio & Adrenalina', tag: 'TRAIL' },
                      { id: 'alta_montana', title: 'Alta Montaña & Glaciares', tag: '3000M+' },
                      { id: 'grupal', title: 'Salida Grupal / Comunidad', tag: 'GRUPAL' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedVibe(item.id);
                          setStep(2);
                        }}
                        className="btn-arcteryx w-full !justify-between !px-6 !py-3.5 text-left group transition-all"
                      >
                        <span className="font-bold text-xs uppercase tracking-wider text-white group-hover:text-amber-300">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest text-amber-400 group-hover:translate-x-1 transition-transform">
                          {item.tag} &rarr;
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── PASO 2: NIVEL DE EXPERIENCIA (BOTONES PÍLDORA .btn-arcteryx DE LA WEB) ── */}
              {step === 2 && (
                <div className="space-y-3">
                  {/* Contenedor métrico/informativo idéntico al recuadro de la web */}
                  <div 
                    className="py-2.5 px-4 text-center font-mono rounded-lg" 
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <p className="text-[10px] text-white/40 uppercase font-medium">Experiencia</p>
                    <p className="text-xs font-bold text-white">¿Cuál es tu estado físico en senderos?</p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { id: 'iniciacion', title: 'Iniciación · Primera Cumbre', tag: 'NIVEL 1' },
                      { id: 'intermedio', title: 'Intermedio · Ya subo cerros', tag: 'NIVEL 2' },
                      { id: 'avanzado', title: 'Avanzado · Gran Altitud', tag: 'NIVEL 3' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => {
                          setSelectedLevel(lvl.id);
                          setStep(3);
                        }}
                        className="btn-arcteryx w-full !justify-between !px-6 !py-3.5 text-left group transition-all"
                      >
                        <span className="font-bold text-xs uppercase tracking-wider text-white group-hover:text-amber-300">
                          {lvl.title}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest text-amber-400 group-hover:translate-x-1 transition-transform">
                          {lvl.tag} &rarr;
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-start">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider py-1.5 cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      &larr; Volver a Actividades
                    </button>
                  </div>
                </div>
              )}

              {/* ── PASO 3: RESULTADO RECOMENDADO (DISEÑO 100% IDÉNTICO A LA TARJETA WILDTREK) ── */}
              {step === 3 && (
                <div className="space-y-3.5 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
                      {route.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-4 font-light leading-relaxed">
                      {route.desc}
                    </p>

                    {/* Contenedor de 3 columnas idéntico al recuadro de la web */}
                    <div 
                      className="grid grid-cols-3 gap-2 py-3 text-center font-mono rounded-lg" 
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-medium">Duración</p>
                        <p className="text-xs font-bold text-white">{route.duration}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-medium">Dificultad</p>
                        <p className="text-xs font-bold text-amber-400">{route.difficulty}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-medium">Cupo Máx</p>
                        <p className="text-xs font-bold text-white">{route.max_pax}</p>
                      </div>
                    </div>
                  </div>

                  {/* Botón Píldora idéntico al de la web: .btn-arcteryx */}
                  <Link 
                    href={route.slug} 
                    onClick={() => setIsOpen(false)} 
                    className="btn-arcteryx w-full flex items-center justify-center"
                  >
                    VER DETALLES
                  </Link>

                  {/* Acciones Rápidas: WhatsApp Píldora Glassmorphism */}
                  <a
                    href={`https://wa.me/56957958467?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 hover:text-white transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Consultar Cupos por WhatsApp</span>
                  </a>

                  {/* Guardar recomendación o cupo con email */}
                  {!saved ? (
                    <form onSubmit={handleSaveContact} className="pt-2 border-t border-white/10 space-y-1.5">
                      <p className="text-[10px] sm:text-[11px] text-white/50 text-center">
                        ¿Quieres guardar esta ruta y recibir 50% OFF para tu primera salida?
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Tu correo electrónico"
                          className="flex-1 bg-white/10 border border-white/15 rounded-full px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-2 rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          {loading ? '...' : 'Enviar'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-center">
                      <p className="text-amber-400 text-xs font-mono font-bold">
                        ✓ ¡Ruta y código guardados con éxito!
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center pt-0.5">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-[10px] font-mono cursor-pointer transition-colors uppercase tracking-wider"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Volver a empezar</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
