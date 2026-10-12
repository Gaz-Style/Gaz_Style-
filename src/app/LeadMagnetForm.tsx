'use client';

import React, { useState } from 'react';
import { trackLeadGuide } from '@/lib/analytics';
import { Mountain, CheckCircle2, Loader2, Sparkles, ArrowRight, ArrowLeft, Tag, Compass, Flame } from 'lucide-react';
import Link from 'next/link';

interface Props {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  lang?: string;
}

export default function LeadMagnetForm({ lang = 'es' }: Props) {
  // Estado del Quiz Interactivo
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [level, setLevel] = useState<'iniciacion' | 'intermedio' | 'avanzado'>('iniciacion');
  const [vibe, setVibe] = useState<'sunset' | 'cardio' | 'alta_montana'>('sunset');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Lógica de recomendación de ruta basada en respuestas
  const getRecommendation = () => {
    if (vibe === 'sunset' || level === 'iniciacion') {
      return {
        title: 'Sunset Manquehuito & Café de Especialidad',
        desc: 'Tu ruta perfecta: 3.5 hrs, ritmo relajado, atardecer sobre Santiago y café caliente en cumbre.',
        difficulty: 'Nivel 1 · Iniciación Activa',
        badgeColor: 'text-amber-600 bg-amber-50 border-amber-200',
        routeId: 'be1beb1c-ef0c-44b7-9a34-58a5a62c7245',
      };
    }
    if (vibe === 'cardio' || level === 'intermedio') {
      return {
        title: 'WildTrek Cerro Manquehue / Pochoco',
        desc: 'Desconexión deportiva: ritmo sostenido, vistas 360° y liberación de estrés tras la semana laboral.',
        difficulty: 'Nivel 2-3 · Cardio Deportivo',
        badgeColor: 'text-orange-600 bg-orange-50 border-orange-200',
        routeId: 'ef298aff-971c-4329-b18f-879d6538f7fc',
      };
    }
    return {
      title: 'Alta Montaña Cerro Pintor (4.180m)',
      desc: 'Desafío andino supremo: altitud real, glaciares y protocolo estricto WFR en los Andes centrales.',
      difficulty: 'Nivel 4 · Alta Exigencia',
      badgeColor: 'text-red-600 bg-red-50 border-red-200',
      routeId: 'desafios/sierra-de-ramon',
    };
  };

  const recommendation = getRecommendation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          lang,
          experience_level: level,
          preferred_style: vibe,
          recommended_route: recommendation.title,
          discount_code: 'CUMBRE10K',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        trackLeadGuide(email);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Hubo un error al procesar tu solicitud');
      }
    } catch {
      setErrorMsg('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-3xl p-6 sm:p-10 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      
      {/* CABECERA CON BADGE ESTILO MUCH BETTER ADVENTURES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/40 rounded-full text-amber-300 text-[11px] font-mono uppercase tracking-wider font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Mountain Quiz · Edición 2026</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Descubre tu Cumbre Ideal en Santiago
          </h3>
          <p className="text-white/60 text-xs sm:text-sm font-light mt-0.5">
            Responde 2 preguntas y desbloquea <strong className="text-white/90 font-semibold">$10.000 CLP de crédito de bienvenida</strong> + la Guía Técnica WFR.
          </p>
        </div>

        {/* Indicador de progreso */}
        {!submitted && (
          <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs font-bold text-white/40">
            <span className={step >= 1 ? 'text-amber-400' : ''}>Paso {step}</span>
            <span>/</span>
            <span>3</span>
          </div>
        )}
      </div>

      {/* PASO 1: NIVEL DE CONDICIÓN FÍSICA */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <p className="text-sm font-bold text-white/80 uppercase tracking-wider font-mono">
            1. ¿Cuál es tu experiencia actual en senderos?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'iniciacion', label: 'Iniciación / Primera Cumbre', desc: 'Hago caminatas suaves o quiero empezar de cero sin riesgos.', icon: Mountain },
              { id: 'intermedio', label: 'Intermedio / Hago Deporte', desc: 'Tengo buena condición física, subo cerros de Santiago de vez en cuando.', icon: Compass },
              { id: 'avanzado', label: 'Avanzado / Gran Altitud', desc: 'Busco desnivel potente, aristas de roca o ascensos sobre 3.500m.', icon: Flame },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setLevel(opt.id as any);
                  setStep(2);
                }}
                className={`p-5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between group hover:bg-white/20 ${
                  level === opt.id ? 'bg-amber-500/20 border border-amber-400/50' : 'border border-white/10 bg-white/05'
                }`}
                style={{ backgroundColor: level === opt.id ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)' }}
              >
                <div>
                  <opt.icon className="w-5 h-5 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-white text-sm">{opt.label}</p>
                  <p className="text-white/55 text-xs mt-1 font-light leading-relaxed">{opt.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  <span>Elegir</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PASO 2: TIPO DE EXPERIENCIA */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white/80 uppercase tracking-wider font-mono">
              2. ¿Qué tipo de experiencia quieres vivir?
            </p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1 font-mono transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Volver
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'sunset', label: 'Sunset & Desconexión', desc: 'Atardecer, fotos de cumbre de calidad y café caliente sobre el mar de nubes.' },
              { id: 'cardio', label: 'Cardio & Liberación', desc: 'Ritmo sostenido para botar el estrés de la semana en contacto con la cordillera.' },
              { id: 'alta_montana', label: 'Desafío Andino Épico', desc: 'Ascenso técnico, autosuficiencia y vistas a los colosos de los Andes centrales.' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setVibe(opt.id as any);
                  setStep(3);
                }}
                className={`p-5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between group hover:bg-white/20 ${
                  vibe === opt.id ? 'border border-amber-400/50' : 'border border-white/10'
                }`}
                style={{ backgroundColor: vibe === opt.id ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)' }}
              >
                <div>
                  <p className="font-bold text-white text-sm mb-1">{opt.label}</p>
                  <p className="text-white/55 text-xs font-light leading-relaxed">{opt.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  <span>Ver Mi Cumbre</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PASO 3: RECOMENDACIÓN PERSONALIZADA + RECLAMAR VOUCHER */}
      {step === 3 && !submitted && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Card de la Ruta Recomendada */}
          <div
            className="p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border border-amber-400/50 text-amber-300 bg-amber-500/15">
                {recommendation.difficulty}
              </span>
              <h4 className="text-lg font-black text-white tracking-tight">
                {recommendation.title}
              </h4>
              <p className="text-white/60 text-xs font-light max-w-xl">
                {recommendation.desc}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-400/40 text-amber-300 px-4 py-2 rounded-xl shrink-0 font-mono text-xs font-bold">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Voucher $10.000 Reservado</span>
            </div>
          </div>

          {/* Formulario de Reclamación */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email principal..."
                className="rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 flex-1"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                required
                disabled={loading}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="WhatsApp (opcional, para avisos)"
                className="rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 sm:w-64"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 cursor-pointer whitespace-nowrap shadow-[0_0_20px_rgba(245,158,11,0.35)]"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Reclamar $10.000 + Guía
              </button>
            </div>
            {errorMsg && <p className="text-red-400 text-xs font-medium">{errorMsg}</p>}
            <p className="text-[11px] text-white/35 text-center sm:text-left">
              🔒 Cero spam. Te enviaremos el código de descuento y el PDF técnico de las rutas de Santiago.
            </p>
          </form>
        </div>
      )}

      {/* ESTADO FINAL: VOUCHER DESBLOQUEADO Y ENTREGADO */}
      {submitted && (
        <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-2xl animate-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>¡Voucher Desbloqueado con Éxito!</span>
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tight">
                Tu Cupón de Bienvenida: <span className="text-amber-400 font-mono">CUMBRE10K</span>
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm font-light max-w-xl">
                Hemos enviado tu Guía Técnica a <strong className="text-white">{email}</strong>. Puedes usar tu cupón de $10.000 CLP en cualquiera de nuestras salidas de temporada.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/reservar"
                className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold uppercase tracking-widest text-xs px-6 py-3.5 rounded-xl transition-all text-center shadow-lg hover:scale-105 active:scale-95"
              >
                Usar Cupón en Reserva &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
