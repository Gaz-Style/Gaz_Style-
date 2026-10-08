'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function getAdventurers() {
    const supabase = getAdminClient();
    const { data, error } = await supabase
        .from('crm_adventurers')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data;
}

export async function createAdventurer(formData: FormData) {
    const supabase = getAdminClient();
    const { error } = await supabase.from('crm_adventurers').insert({
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        blood_type: formData.get('blood_type') as string,
        severe_allergies: (formData.get('severe_allergies') as string) || 'Ninguna',
        medical_conditions: formData.get('medical_conditions') as string,
        emergency_contact_name: formData.get('emergency_contact_name') as string,
        emergency_contact_phone: formData.get('emergency_contact_phone') as string,
        mountain_experience_level: formData.get('mountain_experience_level') as string,
        waiver_signed: false,
    });
    if (error) return { error: error.message };
    revalidatePath('/admin/registro-aventurero');
    return { success: true };
}

export async function markWaiverSigned(id: string) {
    const supabase = getAdminClient();
    const { error } = await supabase.from('crm_adventurers').update({
        waiver_signed: true,
        waiver_date: new Date().toISOString(),
    }).eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/admin/registro-aventurero');
    return { success: true };
}

export async function deleteAdventurer(id: string) {
    const supabase = getAdminClient();
    const { error } = await supabase.from('crm_adventurers').delete().eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/admin/registro-aventurero');
    return { success: true };
}
