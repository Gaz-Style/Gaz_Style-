import { getPublicDepartures } from './actions';
import BookingClient from './BookingClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Reserva tu Expedición | Gaz Style Expeditions',
    description: 'Elige tu salida, completa tus datos y paga de forma segura. Trekking y alta montaña en Chile.',
};

export default async function ReservarPage({ searchParams }: { searchParams: Promise<{ route?: string }> }) {
    const params = await searchParams;
    const departures = await getPublicDepartures();
    return <BookingClient departures={departures} initialAdventureId={params?.route} />;
}
