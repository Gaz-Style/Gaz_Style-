import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Error en el Pago | Gaz Style Expeditions' };

export default function ReservaError() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-12 h-12 text-red-400" />
                </div>
                <div>
                    <p className="text-red-400 text-xs font-bold tracking-widest uppercase mb-3">Pago No Procesado</p>
                    <h1 className="text-4xl font-bold text-white mb-4">Algo salió mal</h1>
                    <p className="text-slate-400 text-lg">
                        Tu pago fue rechazado o cancelado. No se realizó ningún cargo. Puedes intentarlo nuevamente.
                    </p>
                </div>
                <Link href="/reservar" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Intentar nuevamente
                </Link>
            </div>
        </div>
    );
}
