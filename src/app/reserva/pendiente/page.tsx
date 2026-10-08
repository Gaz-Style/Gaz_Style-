import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Pago Pendiente | Gaz Style Expeditions' };

export default function ReservaPendiente() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="w-24 h-24 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-12 h-12 text-orange-400" />
                </div>
                <div>
                    <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">Pago en Revisión</p>
                    <h1 className="text-4xl font-bold text-white mb-4">Pago pendiente</h1>
                    <p className="text-slate-400 text-lg">
                        Tu pago está siendo procesado por MercadoPago. Esto puede tomar unos minutos. Te notificaremos por correo cuando se confirme.
                    </p>
                </div>
                <Link href="/" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    Volver al inicio <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
