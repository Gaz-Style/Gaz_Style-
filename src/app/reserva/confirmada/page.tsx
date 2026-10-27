'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Mountain, MessageCircle, ArrowRight, Calendar, ShieldCheck } from 'lucide-react';
import { trackPurchaseSuccess } from '@/lib/analytics';

function ConfirmadaContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id') || 'mp-ok';
  const status = searchParams.get('status') || searchParams.get('collection_status') || 'approved';

  useEffect(() => {
    // Disparar evento de conversión en GA4, Meta Pixel y GTM dataLayer
    trackPurchaseSuccess({
      id: paymentId,
      amount: 45000,
      routeTitle: 'Expedición Santiago Hiking',
    });
  }, [paymentId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex flex-col justify-center items-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full bg-black/40 border border-amber-500/30 rounded-3xl p-8 md:p-12 text-center relative z-10 backdrop-blur-xl shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2 block">
          ¡Pago Confirmado!
        </span>
        <h1 className="text-3xl md:text-4xl font-editorial font-bold text-white mb-4">
          Tu cupo en la montaña está asegurado ⚡
        </h1>
        <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed mb-8">
          Hemos recibido tu pago con éxito. Te enviamos el comprobante a tu correo y el equipo de Santiago Hiking te contactará para coordinar la salida.
        </p>

        {/* ── PASO POST-PAGO: FICHA MÉDICA, RUT Y SEGURIDAD WFR ── */}
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-6 text-left space-y-3 mb-8 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 font-mono">
              Paso Obligatorio: Ficha de Seguridad & RUT WFR
            </h3>
          </div>
          <p className="text-slate-200 text-xs sm:text-sm font-light leading-relaxed">
            Tu pago ya está confirmado. Ahora debes <strong className="text-white font-semibold">rellenar los campos correspondientes</strong> (RUT o Pasaporte, contacto de emergencia y ficha médica WFR) para activar tu <strong>Expedition Pass</strong> oficial y el protocolo de seguridad.
          </p>
          <div className="pt-2">
            <Link
              href={searchParams.get('external_reference') ? `/check-in/${searchParams.get('external_reference')}` : '/check-in'}
              className="btn-arcteryx-primary w-full inline-flex items-center justify-center !py-4 !px-6 text-xs font-mono font-bold tracking-widest gap-2 shadow-[0_0_24px_rgba(245,158,11,0.4)] hover:scale-[1.01] transition-transform"
            >
              RELLENAR FICHA DE SEGURIDAD & RUT AHORA →
            </Link>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-left space-y-2.5 mb-8">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Punto de encuentro y horarios detallados en tu Expedition Pass</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
            <Mountain className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Equipo requerido: calzado con buen agarre y 2L de hidratación</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`https://wa.me/56984021940?text=${encodeURIComponent(`¡Hola Gaz! Acabo de pagar mi reserva (ID: ${paymentId}). Quiero confirmar mi participación en la expedición.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd5a] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
          >
            <MessageCircle className="w-5 h-5" /> Confirmar en WhatsApp
          </a>
          <Link
            href="/"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReservaConfirmadaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Cargando confirmación...</div>}>
      <ConfirmadaContent />
    </Suspense>
  );
}
