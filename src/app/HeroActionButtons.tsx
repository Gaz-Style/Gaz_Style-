'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Lightbulb, X, ArrowRight, CheckCircle2, ChevronRight, 
  Flame, Clock, MapPin, Sparkles, MessageCircle, RotateCcw,
  Compass, Mountain, Users, Sun
} from 'lucide-react';
import { trackLeadGuide } from '@/lib/analytics';

interface Props {
  lang?: string;
}

// ── Rutas Recomendadas ──────────────────────────────────────────────────────────
const ROUTES = {
  iniciacion: {
    id: 'sunset-manquehuito',
    slug: '/desafios/desafio-5am',
    title: 'Manquehuito Sunset & Nubes',
    subtitle: 'Tu primera cumbre sobre el valle',
    difficulty: 'Nivel 1 · Iniciación Activa',
    meta: '3.5 hrs · 1.638m · Desnivel +420m',
    desc: 'El ascenso perfecto para empezar. Senderos amables, ritmo grupal relajado y vistas doradas de 360° sobre todo Santiago.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85',
    tag: 'Ideal Principiantes',
  },
  intermedio_sunset: {
    id: 'desafio-5am',
    slug: '/desafios/desafio-5am',
    title: 'Desafío 5:00 AM (Sunrise)',
    subtitle: 'Cumbre al romper el alba',
    difficulty: 'Nivel 2 · Cardio & Desconexión',
    meta: '4.5 hrs · Frontales · Amanecer en cumbre',
    desc: 'Ascenso nocturno con linternas frontales y cumbre al alba sobre el mar de nubes. Desciendes antes de que empiece el ruido de la ciudad.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
    tag: 'El Favorito de la Comunidad',
  },
  intermedio_cardio: {
    id: 'triple-corona',
    slug: '/desafios/triple-corona',
    title: 'La Triple Corona de Santiago',
    subtitle: '3 Cumbres · El reto definitivo',
    difficulty: 'Nivel 3 · Resistencia Andina',
    meta: '3 Cumbres · +2.100m D+ · Programa guiado',
    desc: 'Manquehuito, Cerro Manquehue y Cerro Pochoco. Para quienes ya entrenan y buscan resistencia física real en la cordillera.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=85',
    tag: 'Desafío Físico',
  },
  avanzado: {
    id: 'sierra-de-ramon',
    slug: '/desafios/sierra-de-ramon',
    title: 'Travesía Sierra de Ramón',
    subtitle: 'La reina técnica de los Andes',
    difficulty: 'Nivel 4 · Alta Exigencia',
    meta: '3.250m Cota · Full Day · Aristas de roca',
    desc: 'Aristas técnicas de alta montaña, vistas panorámicas sobre los glaciares y protocolo estricto de seguridad guiada.',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=900&q=85',
    tag: 'Alta Montaña',
  },
} as const;

type RouteKey = keyof typeof ROUTES;

export default function HeroActionButtons({ lang = 'es' }: Props) {
  const isEn = lang === 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

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

  // Cerrar modal con tecla Escape y bloquear scroll del body
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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

  return (
    <>
      {/* ── BOTONES HERO PÍLDORA CON GLASSMORPHISM & TRANSPARENCIA ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-lg mx-auto">
        {/* Botón 1: Ver todas las aventuras (Diseño y Color Ámbar Oficial) */}
        <a
          href="#rutas"
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black px-8 sm:px-9 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer text-center select-none"
        >
          {isEn ? 'Ver todas las aventuras' : 'Ver todas las aventuras'}
        </a>

        {/* Botón 2: Ayúdame a elegir (Diseño y Color Cristal Ahumado Oficial + Lógica del Quiz Modal) */}
        <button
          type="button"
          onClick={() => {
            handleReset();
            setIsOpen(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white px-8 sm:px-9 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 hover:bg-white/10 cursor-pointer text-center select-none group"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Lightbulb className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
          <span>{isEn ? 'Ayúdame a elegir' : 'Ayúdame a elegir'}</span>
        </button>
      </div>

      {/* ── MODAL POPUP ESTILO MUCH BETTER ADVENTURES ── */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div 
            className="relative w-full max-w-lg rounded-xl bg-stone-950 border border-white/15 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.15)'
            }}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-stone-900/50">
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-amber-400 font-bold block mb-1">
                  {step < 3 ? (isEn ? `Pregunta ${step} de 2` : `Pregunta ${step} de 2`) : 'Tu Recomendación'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
                  {step === 1 && (isEn ? '¿Qué actividades te interesan?' : '¿Qué actividades te interesan?')}
                  {step === 2 && (isEn ? '¿Cuál es tu nivel de trekking?' : '¿Cuál es tu nivel de trekking?')}
                  {step === 3 && (isEn ? 'Tu Próxima Aventura en los Andes' : 'Tu Próxima Aventura en los Andes')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-3"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del Modal */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              
              {/* ── PASO 1: TIPO DE EXPERIENCIA ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-white/60 text-xs sm:text-sm font-light">
                    Selecciona las actividades que te llamen la atención (puedes elegir varias o una):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { id: 'sunset', icon: Sun, title: 'Atardecer & Nubes', desc: 'Vistas doradas, ritmo relajado' },
                      { id: 'cardio', icon: Flame, title: 'Cardio & Adrenalina', desc: 'Buen ritmo, desafío físico' },
                      { id: 'alta_montana', icon: Mountain, title: 'Alta Cordillera & Glaciares', desc: 'Aristas de roca y cumbres 3000m+' },
                      { id: 'grupal', icon: Users, title: 'Salida Grupal / Solo-Friendly', desc: 'Ideal para sumarse solo y conectar' },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedVibe === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedVibe(item.id)}
                          className={`p-4 rounded-lg text-left border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                            isSelected 
                              ? 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_18px_rgba(245,158,11,0.25)]' 
                              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className={`p-2 rounded-md ${isSelected ? 'bg-amber-500 text-stone-950' : 'bg-white/10 text-white'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white">{item.title}</h4>
                            <p className="text-[11px] text-white/50 mt-0.5 leading-snug">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-md transition-all cursor-pointer shadow-[0_4px_20px_rgba(245,158,11,0.3)]"
                    >
                      <span>Siguiente Paso</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── PASO 2: NIVEL DE TREKKING ── */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-white/60 text-xs sm:text-sm font-light">
                    ¿Cuál es tu estado físico o experiencia actual en senderos?
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {[
                      { id: 'iniciacion', title: 'Iniciación / Primera Cumbre', desc: 'Quiero senderos claros, ritmo amable y cota menor a 1.700m.' },
                      { id: 'intermedio', title: 'Intermedio / Ya subo cerros', desc: 'Hago deporte regular y aguanto 4 a 5 horas de subida continua.' },
                      { id: 'avanzado', title: 'Avanzado / Gran Altitud', desc: 'Listo para aristas técnicas, cumbres sobre 3.000m y jornadas completas.' },
                    ].map((lvl) => {
                      const isSelected = selectedLevel === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setSelectedLevel(lvl.id)}
                          className={`w-full p-4 rounded-lg text-left border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                            isSelected 
                              ? 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_18px_rgba(245,158,11,0.25)]' 
                              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <h4 className="font-bold text-sm text-white">{lvl.title}</h4>
                            <p className="text-[11px] text-white/50 mt-0.5">{lvl.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-amber-400 bg-amber-500 text-stone-950' : 'border-white/30'
                          }`}>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-stone-950" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider py-2 cursor-pointer"
                    >
                      &larr; Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-md transition-all cursor-pointer shadow-[0_4px_20px_rgba(245,158,11,0.3)]"
                    >
                      <Sparkles className="w-4 h-4 text-stone-950" />
                      <span>Ver Mi Recomendación</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── PASO 3: RESULTADO RECOMENDADO ── */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Tarjeta de la Ruta */}
                  <div className="relative rounded-xl overflow-hidden border border-white/20 bg-stone-900 shadow-xl group">
                    <div className="aspect-[16/9] relative w-full overflow-hidden">
                      <Image
                        src={route.image}
                        alt={route.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                      <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
                        {route.tag}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3 relative -mt-6 z-10">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-semibold block mb-0.5">
                          {route.difficulty}
                        </span>
                        <h4 className="font-serif text-2xl font-black text-white leading-tight">
                          {route.title}
                        </h4>
                      </div>

                      <p className="text-white/70 text-xs leading-relaxed font-light">
                        {route.desc}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] font-mono text-white/60 pt-1 border-t border-white/10">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" />{route.meta.split('·')[0].trim()}</span>
                        <span className="flex items-center gap-1.5"><Mountain className="w-3.5 h-3.5 text-amber-400" />{route.meta.split('·')[1]?.trim()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="space-y-2.5">
                    <Link
                      href={route.slug}
                      onClick={() => setIsOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-md transition-all shadow-[0_4px_20px_rgba(245,158,11,0.35)] cursor-pointer text-center"
                    >
                      <span>Ver Ficha y Próximas Salidas</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href={`https://wa.me/56957958467?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-md transition-all cursor-pointer text-center"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Consultar Cupos por WhatsApp</span>
                    </a>
                  </div>

                  {/* Guardar recomendación o cupo con email */}
                  {!saved ? (
                    <form onSubmit={handleSaveContact} className="pt-3 border-t border-white/10 space-y-2">
                      <p className="text-[11px] text-white/50 text-center">
                        ¿Quieres guardar esta ruta y recibir 50% OFF para tu primera salida?
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Tu correo electrónico"
                          className="flex-1 bg-white/10 border border-white/15 rounded-md px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-2.5 rounded-md transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          {loading ? '...' : 'Enviar'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-3 rounded-md bg-amber-500/15 border border-amber-500/30 text-center">
                      <p className="text-amber-400 text-xs font-mono">
                        ✓ ¡Ruta y código guardados con éxito!
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-[11px] font-mono cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Volver a empezar</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
