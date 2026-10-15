import { getBookingForCheckIn } from "../actions";
import CheckInClient from "./CheckInClient";
import { Mountain } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function CheckInPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const { bookingId } = await params;
    const booking = await getBookingForCheckIn(bookingId);

    if (!booking) {
        return (
            <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center text-white">
                <Mountain className="w-16 h-16 text-amber-500/40 mb-6" />
                <h1 className="text-3xl font-editorial font-bold text-white mb-4">Reserva no encontrada</h1>
                <p className="text-white/60 mb-8 max-w-md text-sm">No pudimos encontrar la reserva que intentas revisar. Por favor verifica el enlace en tu comprobante de pago o contáctanos por WhatsApp.</p>
                <Link href="/" className="btn-arcteryx-primary !py-3 !px-8 text-xs font-mono font-bold tracking-widest">
                    Volver al Inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-950 flex flex-col text-stone-100">
            <header className="w-full border-b border-white/10 h-20 flex justify-between items-center px-6 sm:px-12 bg-black/40 backdrop-blur-md">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logotipo blanco.png"
                        alt="Santiago Hiking"
                        width={240}
                        height={55}
                        className="h-8 sm:h-10 w-auto object-contain"
                        priority
                    />
                </Link>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold border border-amber-500/30 px-3 py-1 rounded-full bg-amber-500/10">
                    Expedition Pass WFR
                </span>
            </header>

            <main className="flex-grow flex items-center py-10 px-4 sm:px-6 relative z-10">
                <CheckInClient booking={booking} />
            </main>
        </div>
    );
}
