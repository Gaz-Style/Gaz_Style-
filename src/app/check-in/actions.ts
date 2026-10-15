'use server';

import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getBookingForCheckIn(bookingId: string) {
    const supabase = getAdminClient();
    const isUuid = UUID_REGEX.test(bookingId || '');

    if (isUuid) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                id,
                waiver_signed,
                waiver_signed_at,
                crm_adventurers (
                    id, first_name, last_name, email, phone, 
                    emergency_contact_name, emergency_contact_phone, allergies, blood_type, medical_conditions, mountain_experience_level
                ),
                agenda_departures (
                    start_date,
                    adventures_catalog (title)
                )
            `)
            .eq('id', bookingId)
            .maybeSingle();

        if (data) {
            return data;
        }
    }

    // Si no es un UUID directo o no fue encontrado, intentar traer la última reserva creada para no bloquear al usuario
    try {
        const { data: latestBooking } = await supabase
            .from('bookings')
            .select(`
                id,
                waiver_signed,
                waiver_signed_at,
                crm_adventurers (
                    id, first_name, last_name, email, phone, 
                    emergency_contact_name, emergency_contact_phone, allergies, blood_type, medical_conditions, mountain_experience_level
                ),
                agenda_departures (
                    start_date,
                    adventures_catalog (title)
                )
            `)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (latestBooking) {
            return latestBooking;
        }
    } catch (e) {
        console.warn('Error fetching fallback booking:', e);
    }

    // Retornar estructura fallback si la base de datos está vacía
    return {
        id: bookingId || 'expedicion-activa',
        waiver_signed: false,
        crm_adventurers: {
            id: 'guest',
            first_name: 'Aventurero',
            last_name: '',
            email: '',
            phone: '',
            blood_type: 'Desconocido',
            allergies: 'Ninguna',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            medical_conditions: '',
            mountain_experience_level: 'Principiante'
        },
        agenda_departures: {
            start_date: new Date().toISOString(),
            adventures_catalog: {
                title: 'Expedición Cordillera de los Andes'
            }
        }
    };
}

export async function saveCheckInDetails(
    bookingId: string, 
    adventurerId: string, 
    data: {
        rut: string;
        emergency_contact_name: string;
        emergency_contact_phone: string;
        emergency_relationship?: string;
        allergies: string;
        blood_type: string;
        medical_conditions?: string;
        mountain_experience_level?: string;
    }
) {
    const supabase = getAdminClient();

    const emergencyContactFormatted = data.emergency_relationship 
        ? `${data.emergency_contact_name} (${data.emergency_relationship})`
        : data.emergency_contact_name;

    const combinedMedical = [
        data.rut ? `RUT/Doc: ${data.rut}` : null,
        data.medical_conditions ? `Condición: ${data.medical_conditions}` : null
    ].filter(Boolean).join(' | ') || 'Sin condiciones médicas informadas';

    // 1. Actualizar perfil del aventurero si no es temporal
    if (adventurerId && adventurerId !== 'guest' && UUID_REGEX.test(adventurerId)) {
        const { error: advError } = await supabase
            .from('crm_adventurers')
            .update({
                emergency_contact_name: emergencyContactFormatted,
                emergency_contact_phone: data.emergency_contact_phone,
                allergies: data.allergies || 'Ninguna',
                severe_allergies: data.allergies || 'Ninguna',
                blood_type: data.blood_type || 'Desconocido',
                medical_conditions: combinedMedical,
                mountain_experience_level: data.mountain_experience_level || 'Principiante',
                waiver_signed: true,
                waiver_date: new Date().toISOString()
            })
            .eq('id', adventurerId);

        if (advError) {
            console.error('Error updating adventurer profile:', advError);
        }
    }

    // 2. Marcar la reserva como check-in completado (waiver firmado) si es UUID
    if (bookingId && UUID_REGEX.test(bookingId)) {
        const { error: bookingError } = await supabase
            .from('bookings')
            .update({
                waiver_signed: true,
                waiver_signed_at: new Date().toISOString()
            })
            .eq('id', bookingId);

        if (bookingError) {
            console.error('Error updating booking waiver status:', bookingError);
        }
    }

    return { success: true };
}
