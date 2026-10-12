'use client';

import React, { useState } from 'react';
import { trackLeadGuide } from '@/lib/analytics';
import { Mountain, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
  buttonText: string;
  lang?: string;
}

export default function LeadMagnetForm({ title, subtitle, buttonText, lang = 'es' }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      });

      if (res.ok) {
        setSubmitted(true);
        trackLeadGuide(email);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Hubo un error al enviar');
      }
    } catch (err) {
      setErrorMsg('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 transition-all">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0 hidden sm:flex">
          {submitted ? (
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          ) : (
            <Mountain className="w-6 h-6 text-amber-500" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white leading-tight">
            {submitted ? '¡Guía enviada a tu correo!' : title}
          </h3>
          <p className="text-slate-400 font-light text-xs mt-1">
            {submitted ? 'Revisa tu bandeja de entrada o spam.' : subtitle}
          </p>
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full md:w-auto gap-3 sm:gap-2 mt-2 md:mt-0">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email aquí..."
            className="bg-black/50 border border-slate-700 rounded-full px-4 py-3 sm:py-2 text-sm text-white focus:outline-none focus:border-amber-500 flex-1 md:w-64 transition-colors"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-white hover:bg-slate-200 text-black font-bold uppercase tracking-widest text-[10px] px-6 py-3 sm:py-2 rounded-full transition-all whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            {buttonText}
          </button>
          {errorMsg && <p className="text-red-400 text-xs mt-1 sm:hidden">{errorMsg}</p>}
        </form>
      ) : (
        <span className="text-xs font-semibold text-green-400 bg-green-950/50 border border-green-800/40 px-4 py-2 rounded-full">
          Descarga en proceso 📩
        </span>
      )}
    </div>
  );
}
