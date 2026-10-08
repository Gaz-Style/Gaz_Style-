'use server';

import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function getBookingForCheckIn(bookingId: string) {
    const supabase = getAdminClient();
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            id,
            waiver_signed,
            waiver_signed_at,
            crm_adventurers (
                id, first_name, last_name, email, phone, 
                emergency_contact_name, emergency_contact_phone, allergies, blood_type
            ),
            agenda_departures (
                start_date,
                adventures_catalog (title)
            )
        `)
        .eq('id', bookingId)
        .single();

    if (error) {
        console.error('Error fetching booking for check-in:', error);
        return null;
    }

    return data;
}

export async function saveCheckInDetails(
    bookingId: string, 
    adventurerId: string, 
    data: {
        emergency_contact_name: string;
        emergency_contact_phone: string;
        allergies: string;
        blood_type: string;
    }
) {
    const supabase = getAdminClient();

    // 1. Actualizar perfil del aventurero
    const { error: advError } = await supabase
        .from('crm_adventurers')
        .update({
            emergency_contact_name: data.emergency_contact_name,
            emergency_contact_phone: data.emergency_contact_phone,
            allergies: data.allergies,
            blood_type: data.blood_type,
            waiver_signed: true // Se firma en el perfil también
        })
        .eq('id', adventurerId);

    if (advError) throw new Error('Error al actualizar datos médicos');

    // 2. Marcar la reserva como check-in completado (waiver firmado)
    const { error: bookingError } = await supabase
        .from('bookings')
        .update({
            waiver_signed: true,
            waiver_signed_at: new Date().toISOString()
        })
        .eq('id', bookingId);

    if (bookingError) throw new Error('Error al confirmar el check-in');

    return true;
}
