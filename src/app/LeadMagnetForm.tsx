'use client';

import React, { useState, useRef, useEffect } from 'react';
import { trackLeadGuide } from '@/lib/analytics';
import { CheckCircle2, Loader2, Tag, ChevronDown, ArrowRight, MapPin, Clock, Flame } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Props { lang?: string; }

// ── Rutas resultado (tarjeta final) ──────────────────────────────────────────
const ROUTES = {
  iniciacion: {
    id:         'sunset-manquehuito',
    slug:       '#salidas-grupales',
    title:      'Saltos de Apoquindo',
    subtitle:   'Tu primera cumbre ideal',
    difficulty: 'Nivel 1 · Iniciación Activa',
    meta:       '3.5 hrs · 1.638m · Desnivel +420m',
    desc:       'El cerro perfecto para empezar. Senderos claros, ritmo amable y vistas de 360° sobre el valle de Santiago antes del mediodía.',
    image:      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85',
    color:      'from-emerald-900/80',
  },
  intermedio_sunset: {
    id:         'desafio-5am',
    slug:       '/desafios/desafio-5am',
    title:      'Desafío 5:00 AM',
    subtitle:   'Cumbre al romper el alba',
    difficulty: 'Nivel 2 · Cardio & Desconexión',
    meta:       '5 hrs · Manquehuito · Ascenso nocturno',
    desc:       'Salida con linternas frontales, cumbre al amanecer sobre el mar de nubes de Santiago. Bajas antes de que despierte la ciudad.',
    image:      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
    color:      'from-indigo-900/80',
  },
  intermedio_cardio: {
    id:         'triple-corona',
    slug:       '/desafios/triple-corona',
    title:      'La Triple Corona',
    subtitle:   'El reto andino definitivo',
    difficulty: 'Nivel 3 · Desafío Andino',
    meta:       '3 cumbres · +2.100m D+ · Un programa progresivo',
    desc:       'Manquehuito, Cerro Manquehue y Cerro Pochoco. Conquista las tres cumbres clásicas de la cuenca y forja resistencia real en los Andes.',
    image:      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=85',
    color:      'from-orange-900/80',
  },
  avanzado: {
    id:         'sierra-de-ramon',
    slug:       '/desafios/sierra-de-ramon',
    title:      'Sierra de Ramón',
    subtitle:   'La travesía técnica reina',
    difficulty: 'Nivel 4 · Alta Exigencia',
    meta:       '3.250m · Full Day · Aristas de roca',
    desc:       'Aristas técnicas, vistas panorámicas de 360° y protocolo de autosuficiencia con guías WFR. La cumbre más exigente sobre Santiago.',
    image:      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=900&q=85',
    color:      'from-red-900/80',
  },
} as const;

type RouteKey = keyof typeof ROUTES;

// ── Traducciones ──────────────────────────────────────────────────────────────
const T: Record<string, {
  title: string; subtitle: string;
  step1Label: string; step2Label: string;
  levels: string[]; vibes: string[];
  ctaDiscover: string;
  namePlaceholder: string; phonePlaceholder: string; emailPlaceholder: string;
  ctaClaim: string; ctaRoute: string;
  footerPrivacy: string;
  resultTag: string;
}> = {
  es: {
    title:          '¿Cuál es tu cumbre?',
    subtitle:       'Responde 2 preguntas y descubrí tu ruta perfecta en los Andes.',
    step1Label:     'Nivel',
    step2Label:     'Desafío',
    levels:         ['Primera cumbre / Iniciación', 'Intermedio — ya subo cerros', 'Avanzado — gran altitud'],
    vibes:          ['Sunset & Desconexión', 'Cardio & Adrenalina', 'Desafío Andino Épico'],
    ctaDiscover:    'Descubre la tuya',
    namePlaceholder:  'Nombre y Apellido',
    phonePlaceholder: 'Teléfono / WhatsApp',
    emailPlaceholder: 'Correo electrónico',
    ctaClaim:       'Mi cumbre + 50% OFF',
    ctaRoute:       'Ver Ficha Técnica',
    footerPrivacy:  '🔒 Sin spam · Código de descuento por email',
    resultTag:      'Tu cumbre ideal',
  },
  en: {
    title:          'What\'s Your Summit?',
    subtitle:       'Answer 2 questions and discover your perfect Andes route.',
    step1Label:     'Level',
    step2Label:     'Challenge',
    levels:         ['First summit / Beginner', 'Intermediate — active hiker', 'Advanced — high altitude'],
    vibes:          ['Sunset & Scenic Views', 'Cardio & Adrenaline', 'Epic Andean Challenge'],
    ctaDiscover:    'Discover Yours',
    namePlaceholder:  'Full Name',
    phonePlaceholder: 'Phone / WhatsApp',
    emailPlaceholder: 'Email address',
    ctaClaim:       'My summit + 50% OFF',
    ctaRoute:       'View Route Details',
    footerPrivacy:  '🔒 No spam · Discount code by email',
    resultTag:      'Your ideal summit',
  },
  fr: {
    title:          'Quel est votre sommet ?',
    subtitle:       'Répondez à 2 questions et découvrez votre itinéraire parfait.',
    step1Label:     'Niveau',
    step2Label:     'Défi',
    levels:         ['Premier sommet / Débutant', 'Intermédiaire — randonneur actif', 'Avancé — haute altitude'],
    vibes:          ['Coucher de soleil & Détente', 'Cardio & Adrénaline', 'Défi andin épique'],
    ctaDiscover:    'Découvrez la vôtre',
    namePlaceholder:  'Nom et prénom',
    phonePlaceholder: 'Téléphone / WhatsApp',
    emailPlaceholder: 'Adresse email',
    ctaClaim:       'Mon sommet + -50%',
    ctaRoute:       'Voir la fiche technique',
    footerPrivacy:  '🔒 Sans spam · Code de réduction par email',
    resultTag:      'Votre sommet idéal',
  },
  de: {
    title:          'Was ist dein Gipfel?',
    subtitle:       'Beantworte 2 Fragen und entdecke deine perfekte Andentour.',
    step1Label:     'Level',
    step2Label:     'Challenge',
    levels:         ['Erster Gipfel / Anfänger', 'Mittel — aktiver Wanderer', 'Fortgeschrittene — Hochgebirge'],
    vibes:          ['Sonnenuntergang & Erholung', 'Cardio & Adrenalin', 'Epische Andentour'],
    ctaDiscover:    'Entdecke deine',
    namePlaceholder:  'Vor- und Nachname',
    phonePlaceholder: 'Telefon / WhatsApp',
    emailPlaceholder: 'E-Mail-Adresse',
    ctaClaim:       'Mein Gipfel + 50% Rabatt',
    ctaRoute:       'Routendetails ansehen',
    footerPrivacy:  '🔒 Kein Spam · Rabattcode per E-Mail',
    resultTag:      'Dein idealer Gipfel',
  },
  pt: {
    title:          'Qual é o seu cume?',
    subtitle:       'Responda 2 perguntas e descubra sua rota perfeita nos Andes.',
    step1Label:     'Nível',
    step2Label:     'Desafio',
    levels:         ['Primeira cume / Iniciante', 'Intermediário — trilheiro ativo', 'Avançado — alta altitude'],
    vibes:          ['Pôr do sol & Desconexão', 'Cardio & Adrenalina', 'Desafio Andino Épico'],
    ctaDiscover:    'Descubra a sua',
    namePlaceholder:  'Nome e sobrenome',
    phonePlaceholder: 'Telefone / WhatsApp',
    emailPlaceholder: 'Email',
    ctaClaim:       'Meu cume + 50% OFF',
    ctaRoute:       'Ver ficha técnica',
    footerPrivacy:  '🔒 Sem spam · Código de desconto por email',
    resultTag:      'Seu cume ideal',
  },
};

function tx(lang: string) { return T[lang] ?? T['es']; }

const LEVEL_IDS = ['iniciacion', 'intermedio', 'avanzado'] as const;
const VIBE_IDS  = ['sunset', 'cardio', 'alta_montana'] as const;
type Level = typeof LEVEL_IDS[number];
type Vibe  = typeof VIBE_IDS[number];

function getRouteKey(level: Level, vibe: Vibe): RouteKey {
  if (level === 'avanzado') return 'avanzado';
  if (level === 'intermedio' && vibe === 'cardio') return 'intermedio_cardio';
  if (level === 'intermedio') return 'intermedio_sunset';
  return 'iniciacion';
}

// ── Dropdown personalizado ────────────────────────────────────────────────────
interface DropdownProps {
  value: string; options: string[]; ids: readonly string[];
  onChange: (id: string) => void; stepNum: number; stepLabel: string;
}
function CustomDropdown({ value, options, ids, onChange, stepNum, stepLabel }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const idx = ids.indexOf(value as any);
  const label = idx >= 0 ? options[idx] : options[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-mono cursor-pointer transition-all focus:outline-none text-left"
        style={{
          backgroundColor: 'rgba(255,255,255,0.07)',
          border: `1px solid ${open ? 'rgba(245,158,11,0.50)' : 'rgba(255,255,255,0.14)'}`,
        }}
      >
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
          style={{ backgroundColor: 'rgba(245,158,11,0.18)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.35)' }}
        >{stepNum}</span>
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] uppercase tracking-[0.15em] text-white/35 font-bold">{stepLabel}</span>
          <span className="text-white/85 truncate leading-tight mt-0.5">{label}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-white/35 shrink-0 ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'rgba(12,12,18,0.96)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.65)',
          }}
        >
          {ids.map((id, i) => (
            <button
              key={id} type="button"
              onClick={() => { onChange(id); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-xs font-mono transition-colors cursor-pointer flex items-center gap-2.5
                ${value === id ? 'text-amber-400 bg-amber-500/10' : 'text-white/70 hover:text-white hover:bg-white/05'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${value === id ? 'bg-amber-400' : 'bg-transparent'}`} />
              {options[i]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function LeadMagnetForm({ lang = 'es' }: Props) {
  const t = tx(lang);
  const [level, setLevel]       = useState<Level>('iniciacion');
  const [vibe,  setVibe]        = useState<Vibe>('sunset');
  const [showForm, setShowForm] = useState(false);
  const [name,  setName]        = useState('');
  const [phone, setPhone]       = useState('');
  const [email, setEmail]       = useState('');
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg,  setErrorMsg]  = useState('');

  const routeKey = getRouteKey(level, vibe);
  const route    = ROUTES[routeKey];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !name) return;
    setLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/lead-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, lang,
          name: name.trim(),
          phone,
          experience_level: level,
          preferred_style:  vibe,
          recommended_route: route.title,
          discount_code: 'SUMMIT50',
        }),
      });
      if (res.ok) { setSubmitted(true); trackLeadGuide(email); }
      else { const d = await res.json(); setErrorMsg(d.error || 'Error'); }
    } catch { setErrorMsg('Error de conexión'); }
    finally { setLoading(false); }
  };

  /* ── RESULTADO: TARJETA DE RUTA ─────────────────────────── */
  if (submitted) {
    return (
      <div className="animate-in zoom-in-95 duration-300 space-y-3">
        {/* Tag éxito */}
        <div className="flex items-center gap-2 px-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <p className="text-white/70 text-xs font-mono">
            {t.resultTag} · <span className="text-amber-400 font-bold">SUMMIT50 — 50% OFF</span>
          </p>
        </div>

        {/* TARJETA DE RUTA — estilo desafíos */}
        <div
          className="relative min-h-[320px] overflow-hidden flex flex-col justify-end p-6 group rounded-2xl"
          style={{ border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <Image
            src={route.image}
            alt={route.title}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Gradiente inferior */}
          <div className={`absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t ${route.color} via-stone-950/60 to-transparent pointer-events-none`} />

          {/* Contenido */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Flame className="w-2.5 h-2.5" />{route.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 text-white/50 text-[10px] font-mono">
                <Clock className="w-2.5 h-2.5" />{route.meta.split('·')[0].trim()}
              </span>
              <span className="inline-flex items-center gap-1 text-white/50 text-[10px] font-mono">
                <MapPin className="w-2.5 h-2.5" />{route.meta.split('·')[1]?.trim()}
              </span>
            </div>

            <p className="text-[10px] font-mono text-white/45 uppercase tracking-widest">{route.subtitle}</p>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
              {route.title}
            </h3>
            <p className="text-white/65 text-xs font-light leading-relaxed max-w-sm">
              {route.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Link
                href={route.slug}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-[11px] px-5 py-2.5 rounded-xl transition-all hover:scale-105 w-fit"
              >
                {t.ctaRoute} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[10px] text-white/35 self-center">
                Código <span className="text-amber-400 font-mono font-bold">SUMMIT50</span> enviado a {email}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── FORMULARIO ──────────────────────────────────────────── */
  return (
    <div
      className="rounded-2xl overflow-visible"
      style={{
        backgroundColor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.11)',
      }}
    >
      {/* TÍTULO DEL QUIZ */}
      <div className="px-5 pt-4 pb-3">
        <h3 className="text-white font-black text-base uppercase tracking-tight">
          {t.title}
        </h3>
        <p className="text-white/45 text-[11px] font-light mt-0.5">{t.subtitle}</p>
      </div>

      <div className="px-4 pb-4 space-y-2">

        {/* PASO 1 */}
        <CustomDropdown
          value={level} ids={LEVEL_IDS} options={t.levels}
          onChange={id => setLevel(id as Level)}
          stepNum={1} stepLabel={t.step1Label}
        />

        {/* PASO 2 */}
        <CustomDropdown
          value={vibe} ids={VIBE_IDS} options={t.vibes}
          onChange={id => setVibe(id as Vibe)}
          stepNum={2} stepLabel={t.step2Label}
        />

        {/* PASO 3 — BOTÓN / FORMULARIO */}
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs px-5 py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-[0_0_24px_rgba(245,158,11,0.30)]"
            style={{ backgroundColor: '#f59e0b', color: '#0c0c0c' }}
          >
            <span>3</span>
            <span className="mx-1 opacity-40">·</span>
            {t.ctaDiscover}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div
            className="rounded-xl overflow-hidden animate-in slide-in-from-top-2 duration-300"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.20)' }}
          >
            <form onSubmit={handleSubmit} className="p-4 space-y-2">
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                required disabled={loading}
              />
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                disabled={loading}
              />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                required disabled={loading}
              />
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-black uppercase tracking-widest text-xs px-5 py-3.5 rounded-xl transition-all hover:scale-[1.01] shadow-[0_0_20px_rgba(245,158,11,0.30)] cursor-pointer mt-1"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Tag className="w-3.5 h-3.5" /><span>{t.ctaClaim}</span></>}
              </button>
              {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
              <p className="text-[10px] text-white/25 text-center">{t.footerPrivacy}</p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
