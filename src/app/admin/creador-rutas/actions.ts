'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Usamos el SERVICE_ROLE_KEY para operaciones de admin (bypasses RLS)
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

// Interfaz para los costos
export interface AdventureCost {
    cost_name: string;
    expected_amount: number;
    cost_type: 'fixed' | 'per_pax';
}

export async function getAdventuresWithCosts() {
    const supabase = getAdminClient();
    
    // Obtenemos las rutas y sus plantillas de costo asociadas (JOIN)
    const { data, error } = await supabase
        .from('adventures_catalog')
        .select(`
            *,
            adventure_costs_template (*)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching adventures:', error);
        return [];
    }
    return data;
}

export async function createAdventureWithCosts(formData: FormData, costs: AdventureCost[]) {
    const supabase = getAdminClient();
    
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const difficulty_level = formData.get('difficulty_level') as string;
    const duration_days = parseInt(formData.get('duration_days') as string) || 1;
    const base_price = parseFloat(formData.get('base_price') as string) || 0;
    const min_pax = parseInt(formData.get('min_pax') as string) || 2;
    const max_pax = parseInt(formData.get('max_pax') as string) || 12;
    const description = formData.get('description') as string;
    const duration_text = formData.get('duration_text') as string;
    const image_url = (formData.get('image_url') as string) || null;

    // 1. Insertamos la Aventura (El Molde)
    const { data: adventure, error: adventureError } = await supabase
        .from('adventures_catalog')
        .insert({
            title,
            category,
            difficulty_level,
            duration_days,
            base_price,
            min_pax,
            max_pax,
            description,
            duration_text,
            image_url,
            is_active: true
        })
        .select('id')
        .single();

    if (adventureError) {
        console.error('Error creando aventura:', adventureError);
        throw new Error(`Error al crear la aventura: ${adventureError.message}`);
    }

    // 2. Si hay costos, los insertamos en la Plantilla de Costos (Relación 1:N)
    if (costs && costs.length > 0) {
        const costsToInsert = costs.map(c => ({
            adventure_id: adventure.id,
            cost_name: c.cost_name,
            expected_amount: c.expected_amount,
            cost_type: c.cost_type
        }));

        const { error: costsError } = await supabase
            .from('adventure_costs_template')
            .insert(costsToInsert);

        if (costsError) {
            console.error('Error insertando costos:', costsError);
            throw new Error(`Error al vincular costos de proveedores: ${costsError.message}`);
        }
    }

    revalidatePath('/admin/creador-rutas');
}

export async function toggleAdventureStatus(id: string, currentStatus: boolean) {
    const supabase = getAdminClient();
    const { error } = await supabase
        .from('adventures_catalog')
        .update({ is_active: !currentStatus })
        .eq('id', id);

    if (error) {
        throw new Error('Error al actualizar estado');
    }
    revalidatePath('/admin/creador-rutas');
}

export async function deleteAdventure(id: string) {
    const supabase = getAdminClient();

    // Step 1: Get all departures for this adventure
    const { data: departures } = await supabase
        .from('agenda_departures')
        .select('id')
        .eq('adventure_id', id);

    // Step 2: Delete bookings linked to those departures
    if (departures && departures.length > 0) {
        const depIds = departures.map(d => d.id);
        await supabase.from('bookings').delete().in('departure_id', depIds);
    }

    // Step 3: Delete all departures for this adventure
    await supabase.from('agenda_departures').delete().eq('adventure_id', id);

    // Step 4: Delete the cost template
    await supabase.from('adventure_costs_template').delete().eq('adventure_id', id);

    // Step 5: Delete the adventure itself
    const { error } = await supabase
        .from('adventures_catalog')
        .delete()
        .eq('id', id);

    if (error) {
        return { error: `Error de base de datos: ${error.message}` };
    }
    revalidatePath('/admin/creador-rutas');
    return { success: true };
}

export async function updateAdventureWithCosts(id: string, formData: FormData, costs: AdventureCost[]) {
    const supabase = getAdminClient();
    
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const difficulty_level = formData.get('difficulty_level') as string;
    const duration_days = parseInt(formData.get('duration_days') as string) || 1;
    const base_price = parseFloat(formData.get('base_price') as string) || 0;
    const min_pax = parseInt(formData.get('min_pax') as string) || 2;
    const max_pax = parseInt(formData.get('max_pax') as string) || 12;
    const description = formData.get('description') as string;
    const duration_text = formData.get('duration_text') as string;
    const image_url = (formData.get('image_url') as string) || null;

    // 1. Update Adventure
    const { error: adventureError } = await supabase
        .from('adventures_catalog')
        .update({
            title,
            category,
            difficulty_level,
            duration_days,
            base_price,
            min_pax,
            max_pax,
            description,
            duration_text,
            image_url
        })
        .eq('id', id);

    if (adventureError) {
        console.error('Error actualizando aventura:', adventureError);
        throw new Error(`Error al actualizar la aventura: ${adventureError.message}`);
    }

    // 2. Delete old costs
    await supabase.from('adventure_costs_template').delete().eq('adventure_id', id);

    // 3. Insert new costs
    if (costs && costs.length > 0) {
        const costsToInsert = costs.map(c => ({
            adventure_id: id,
            cost_name: c.cost_name,
            expected_amount: c.expected_amount,
            cost_type: c.cost_type
        }));

        const { error: costsError } = await supabase
            .from('adventure_costs_template')
            .insert(costsToInsert);

        if (costsError) {
            console.error('Error insertando costos:', costsError);
            throw new Error(`Error al actualizar costos: ${costsError.message}`);
        }
    }

    revalidatePath('/admin/creador-rutas');
}

