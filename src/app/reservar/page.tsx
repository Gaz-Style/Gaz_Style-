import { getPublicDepartures } from './actions';
import BookingClient from './BookingClient';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Reserva tu Expedición | Santiago Hiking',
    description: 'Elige tu salida, completa tus datos y paga de forma segura. Trekking y alta montaña en Chile.',
};

export default async function ReservarPage({ searchParams }: { searchParams: Promise<{ route?: string; fecha?: string }> }) {
    const params = await searchParams;
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const [departures, { data: routes }] = await Promise.all([
        getPublicDepartures(),
        supabase.from('adventures_catalog').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    ]);

    let initialRoute = null;
    if (params?.route) {
        const query = params.route.toLowerCase().trim();
        initialRoute = (routes || []).find((r: any) => 
            r.id.toLowerCase() === query || 
            r.title.toLowerCase().includes(query)
        ) || null;
    }

    return (
        <BookingClient 
            departures={departures || []} 
            catalogRoutes={routes || []}
            initialAdventureId={params?.route} 
            initialFechaId={params?.fecha}
            initialRoute={initialRoute}
        />
    );
}

