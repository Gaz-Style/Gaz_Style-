import Link from 'next/link';
import { CheckCircle2, ArrowRight, Mountain } from 'lucide-react';

export const metadata = {
    title: '¡Reserva Confirmada! | Gaz Style Expeditions',
};

export default function ReservaConfirmada({ searchParams }: { searchParams: any }) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative">
                    <div className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-12 h-12 text-green-400" />
                    </div>
                    <div className="absolute inset-0 bg-green-500/5 rounded-full blur-3xl" />
                </div>

                <div>
                    <p className="text-green-400 text-xs font-bold tracking-widest uppercase mb-3">Pago Exitoso</p>
                    <h1 className="text-4xl font-bold text-white mb-4">¡Estás dentro!</h1>
                    <p className="text-slate-400 text-lg">
                        Tu reserva ha sido confirmada. Recibirás un correo con los detalles de la expedición y el formulario médico que debes completar antes de la salida.
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-3">
                    <p className="text-sm font-bold text-slate-300">Próximos pasos:</p>
                    {[
                        'Revisa tu correo para el comprobante de pago',
                        'Completa tu ficha médica (te llegarán instrucciones)',
                        'Firma tu waiver de asunción de riesgo',
                        'El día de la salida, preséntate 30 min antes con tu equipamiento',
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <span className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                            <p className="text-sm text-slate-400">{step}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <Link href="/reservar" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
                        Ver más expediciones <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
