'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Admin client to bypass RLS
function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}

export async function getDepartures() {
    const supabase = getAdminClient();
    
    // Obtenemos salidas agendadas con su respectivo molde de aventura y pasajeros con ticket
    const { data, error } = await supabase
        .from('agenda_departures')
        .select(`
            *,
            adventures_catalog (title, category, min_pax, max_pax, duration_days),
            bookings (
                id,
                total_price,
                amount_paid,
                payment_status,
                status,
                waiver_signed,
                created_at,
                crm_adventurers (
                    id,
                    first_name,
                    last_name,
                    phone,
                    email,
                    emergency_contact_name,
                    emergency_contact_phone,
                    blood_type,
                    severe_allergies
                )
            )
        `)
        .order('start_date', { ascending: true });

    if (error) {
        console.error('Error fetching departures:', error);
        return [];
    }
    return data;
}

export async function getActiveAdventures() {
    const supabase = getAdminClient();
    const { data, error } = await supabase
        .from('adventures_catalog')
        .select('id, title, duration_days, category, max_pax')
        .eq('is_active', true)
        .order('title', { ascending: true });

    if (error) return [];
    return data;
}

export async function createDeparture(formData: FormData) {
    const supabase = getAdminClient();
    
    const adventure_id = formData.get('adventure_id') as string;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;
    
    // Guide assignment is optional for now
    const guide_name = formData.get('guide_name') as string || null;

    if (!adventure_id || !start_date || !end_date) {
        throw new Error('Faltan campos obligatorios para agendar la salida.');
    }

    const { error } = await supabase
        .from('agenda_departures')
        .insert({
            adventure_id,
            start_date,
            end_date,
            status: 'scheduled',
            current_pax: 0,
            guide_id: null // Provisional hasta tener tabla de Staff
        });

    if (error) {
        console.error('SUPABASE ERROR:', error.message);
        throw new Error(`Error al agendar la salida: ${error.message}`);
    }

    revalidatePath('/admin/calendario');
}

export async function updateDepartureStatus(id: string, newStatus: string) {
    const supabase = getAdminClient();
    const { error } = await supabase
        .from('agenda_departures')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) {
        throw new Error('Error al actualizar el estado de la salida');
    }
    revalidatePath('/admin/calendario');
}

export async function deleteDeparture(id: string) {
    const supabase = getAdminClient();
    const { error } = await supabase
        .from('agenda_departures')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error('Error al cancelar/eliminar la salida');
    }
    revalidatePath('/admin/calendario');
}

export async function addUnplannedExpense(departure_id: string, description: string, amount: number) {
    const supabase = getAdminClient();
    const { error } = await supabase.from('general_expenses').insert({
        expense_date: new Date().toISOString().split('T')[0],
        description,
        amount,
        category: 'Gasto Imprevisto en Ruta',
        payment_method: 'Efectivo',
        departure_id,
    });
    if (error) return { error: error.message };
    revalidatePath('/admin/calendario');
    return { success: true };
}

export async function removeBooking(bookingId: string, departureId: string) {
    const supabase = getAdminClient();
    
    // Eliminar ticket / booking
    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

    if (error) {
        console.error('Error deleting booking:', error);
        throw new Error('No se pudo eliminar el ticket');
    }

    // Actualizar current_pax en la salida
    const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('departure_id', departureId);

    await supabase
        .from('agenda_departures')
        .update({ current_pax: count || 0 })
        .eq('id', departureId);

    revalidatePath('/admin/calendario');
    revalidatePath('/admin/sales');
    revalidatePath('/admin/operaciones');
    return { success: true };
}
