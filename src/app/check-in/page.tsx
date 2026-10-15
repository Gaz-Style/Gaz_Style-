import { getBookingForCheckIn } from "./actions";
import CheckInClient from "./[bookingId]/CheckInClient";
import Link from "next/link";
import Image from "next/image";

export default async function GeneralCheckInPage() {
    const booking = await getBookingForCheckIn('');

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
