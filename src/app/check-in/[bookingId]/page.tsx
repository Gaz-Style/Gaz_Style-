import { getBookingForCheckIn } from "../actions";
import CheckInClient from "./CheckInClient";
import { Mountain } from "lucide-react";
import Link from "next/link";

export default async function CheckInPage({ params }: { params: { bookingId: string } }) {
    const booking = await getBookingForCheckIn(params.bookingId);

    if (!booking) {
        return (
            <div className="min-h-screen gaz-premium-body flex flex-col items-center justify-center p-6 text-center">
                <Mountain className="w-16 h-16 text-amber-500/30 mb-6" />
                <h1 className="text-3xl font-editorial font-bold text-white mb-4">Reserva no encontrada</h1>
                <p className="text-slate-400 mb-8 max-w-md">No pudimos encontrar la reserva que intentas revisar. Por favor verifica el enlace en tu correo de confirmación.</p>
                <Link href="/" className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
                    Volver al Inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen gaz-premium-body bg-stone-950 flex flex-col">
            <header className="w-full glass-panel border-b border-white/5 h-20 flex justify-center items-center">
                <span className="font-editorial font-bold text-2xl tracking-wider text-white">
                    GAZ<span className="text-amber-500 italic">_Style</span>
                </span>
            </header>

            <main className="flex-grow flex items-center py-12 px-6 relative z-10">
                <CheckInClient booking={booking} />
            </main>
        </div>
    );
}
