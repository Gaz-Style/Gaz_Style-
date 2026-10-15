'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Usamos el SERVICE_ROLE_KEY para operaciones de admin (bypasses RLS) con fallback seguro
function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// Interfaz para los costos
export interface AdventureCost {
    cost_name: string;
    expected_amount: number;
    cost_type: 'fixed' | 'per_pax';
}

export async function getAdventuresWithCosts() {
    try {
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
        return data || [];
    } catch (e) {
        console.error('Exception fetching adventures:', e);
        return [];
    }
}

export async function createAdventureWithCosts(formData: FormData, costs: AdventureCost[]): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
        const supabase = getAdminClient();
        
        const title = (formData.get('title') as string || '').trim();
        if (!title) {
            return { success: false, error: 'El nombre comercial de la experiencia es obligatorio.' };
        }

        const category = (formData.get('category') as string || 'General').trim();
        const difficulty_level = (formData.get('difficulty_level') as string || 'Iniciación Activa / Moderada').trim();
        const duration_days = parseInt(formData.get('duration_days') as string) || 1;
        const base_price = parseFloat(formData.get('base_price') as string) || 0;
        const min_pax = parseInt(formData.get('min_pax') as string) || 2;
        const max_pax = parseInt(formData.get('max_pax') as string) || 12;
        const description = (formData.get('description') as string || '').trim();
        const duration_text = (formData.get('duration_text') as string || '').trim();
        const image_url = (formData.get('image_url') as string) || null;
        const elevation_gain = (formData.get('elevation_gain') as string) || '';
        const max_altitude = (formData.get('max_altitude') as string) || '';
        const distance = (formData.get('distance') as string) || '';
        
        const itineraryStr = formData.get('itinerary') as string || '';
        const itinerary = itineraryStr ? itineraryStr.split('\n').filter(s=>s.trim()).map(s=>({time: 'XX:XX', title: s.trim(), desc: ''})) : [];
        
        const includedStr = formData.get('included') as string || '';
        const included = includedStr ? includedStr.split('\n').filter(s=>s.trim()) : [];

        const not_includedStr = formData.get('not_included') as string || '';
        const not_included = not_includedStr ? not_includedStr.split('\n').filter(s=>s.trim()) : [];

        // Campos extendidos del Diseñador Universal
        const vertical_type = (formData.get('vertical_type') as string) || 'salidas_grupales';
        const custom_discipline = (formData.get('custom_discipline') as string) || '';
        const badge = (formData.get('badge') as string) || '';
        const number_code = (formData.get('number_code') as string) || '';
        const tagline = (formData.get('tagline') as string) || '';
        const price_usd = (formData.get('price_usd') as string) || '';
        const strava_url = (formData.get('strava_url') as string) || '';
        const gpx_track_url = (formData.get('gpx_track_url') as string) || '';

        const p1 = (formData.get('story_p1') as string) || '';
        const p2 = (formData.get('story_p2') as string) || '';
        const p3 = (formData.get('story_p3') as string) || '';
        const story_paragraphs = [p1, p2, p3].filter(Boolean);

        const logistics = {
            sector: (formData.get('logistics_sector') as string) || '',
            acceso: (formData.get('logistics_acceso') as string) || '',
            puntoEncuentro: (formData.get('logistics_punto') as string) || '',
            coordenadas: (formData.get('logistics_coordenadas') as string) || ''
        };

        const reqEquipStr = (formData.get('required_equipment') as string) || '';
        const required_equipment = reqEquipStr ? reqEquipStr.split('\n').filter(s=>s.trim()) : [];

        // Payload base garantizado
        const basePayload: Record<string, any> = {
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
            elevation_gain,
            max_altitude,
            distance,
            itinerary,
            included,
            not_included,
            is_active: true
        };

        // Payload extendido con todas las columnas nuevas
        const extendedPayload = {
            ...basePayload,
            vertical_type,
            custom_discipline,
            badge,
            number_code,
            tagline,
            price_usd,
            strava_url,
            gpx_track_url,
            story_paragraphs,
            logistics,
            required_equipment
        };

        // 1. Intentamos insertar con todas las columnas extendidas
        let adventureId: string;
        let { data: adventure, error: adventureError } = await supabase
            .from('adventures_catalog')
            .insert(extendedPayload)
            .select('id')
            .single();

        // Si da error por columnas faltantes en Supabase, reintentamos con basePayload seguro
        if (adventureError && adventureError.message.includes('does not exist')) {
            console.warn('Columnas extendidas no encontradas, insertando con basePayload:', adventureError.message);
            const retry = await supabase
                .from('adventures_catalog')
                .insert(basePayload)
                .select('id')
                .single();
            if (retry.error) {
                console.error('Error creando aventura:', retry.error);
                return { success: false, error: `Error de base de datos: ${retry.error.message}` };
            }
            adventureId = retry.data.id;
        } else if (adventureError || !adventure) {
            console.error('Error creando aventura:', adventureError);
            return { success: false, error: `Error al crear la aventura: ${adventureError?.message || 'No se recibieron datos de confirmación'}` };
        } else {
            adventureId = adventure.id;
        }

        // 2. Si hay costos, los insertamos en la Plantilla de Costos (Relación 1:N)
        if (costs && costs.length > 0) {
            const costsToInsert = costs
                .filter(c => c.cost_name && c.cost_name.trim())
                .map(c => ({
                    adventure_id: adventureId,
                    cost_name: c.cost_name.trim(),
                    expected_amount: Number(c.expected_amount) || 0,
                    cost_type: c.cost_type || 'fixed'
                }));

            if (costsToInsert.length > 0) {
                const { error: costsError } = await supabase
                    .from('adventure_costs_template')
                    .insert(costsToInsert);

                if (costsError) {
                    console.error('Error insertando costos:', costsError);
                    return { success: false, error: `Experiencia guardada pero ocurrió un error al vincular costos: ${costsError.message}` };
                }
            }
        }

        try {
            revalidatePath('/admin/creador-rutas');
            revalidatePath('/');
        } catch (revErr) {
            console.warn('Advertencia revalidando rutas:', revErr);
        }

        return { success: true, id: adventureId };
    } catch (err: any) {
        console.error('Error general en createAdventureWithCosts:', err);
        return { success: false, error: err.message || 'Error inesperado del servidor' };
    }
}

export async function toggleAdventureStatus(id: string, currentStatus: boolean): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = getAdminClient();
        const { error } = await supabase
            .from('adventures_catalog')
            .update({ is_active: !currentStatus })
            .eq('id', id);

        if (error) {
            return { success: false, error: 'Error al actualizar estado: ' + error.message };
        }
        
        try {
            revalidatePath('/admin/creador-rutas');
        } catch (e) {
            console.warn('Revalidate warning:', e);
        }
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || 'Error inesperado del servidor' };
    }
}

export async function deleteAdventure(id: string): Promise<{ success: boolean; error?: string }> {
    try {
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
            return { success: false, error: `Error de base de datos: ${error.message}` };
        }
        
        try {
            revalidatePath('/admin/creador-rutas');
        } catch (e) {
            console.warn('Revalidate warning:', e);
        }
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || 'Error inesperado del servidor' };
    }
}

export async function updateAdventureWithCosts(id: string, formData: FormData, costs: AdventureCost[]): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = getAdminClient();
        
        const title = (formData.get('title') as string || '').trim();
        if (!title) {
            return { success: false, error: 'El nombre comercial de la experiencia es obligatorio.' };
        }

        const category = (formData.get('category') as string || 'General').trim();
        const difficulty_level = (formData.get('difficulty_level') as string || 'Iniciación Activa / Moderada').trim();
        const duration_days = parseInt(formData.get('duration_days') as string) || 1;
        const base_price = parseFloat(formData.get('base_price') as string) || 0;
        const min_pax = parseInt(formData.get('min_pax') as string) || 2;
        const max_pax = parseInt(formData.get('max_pax') as string) || 12;
        const description = (formData.get('description') as string || '').trim();
        const duration_text = (formData.get('duration_text') as string || '').trim();
        const image_url = (formData.get('image_url') as string) || null;
        const elevation_gain = (formData.get('elevation_gain') as string) || '';
        const max_altitude = (formData.get('max_altitude') as string) || '';
        const distance = (formData.get('distance') as string) || '';
        
        const itineraryStr = formData.get('itinerary') as string || '';
        const itinerary = itineraryStr ? itineraryStr.split('\n').filter(s=>s.trim()).map(s=>({time: 'XX:XX', title: s.trim(), desc: ''})) : [];
        
        const includedStr = formData.get('included') as string || '';
        const included = includedStr ? includedStr.split('\n').filter(s=>s.trim()) : [];

        const not_includedStr = formData.get('not_included') as string || '';
        const not_included = not_includedStr ? not_includedStr.split('\n').filter(s=>s.trim()) : [];

        // Campos extendidos del Diseñador Universal
        const vertical_type = (formData.get('vertical_type') as string) || 'salidas_grupales';
        const custom_discipline = (formData.get('custom_discipline') as string) || '';
        const badge = (formData.get('badge') as string) || '';
        const number_code = (formData.get('number_code') as string) || '';
        const tagline = (formData.get('tagline') as string) || '';
        const price_usd = (formData.get('price_usd') as string) || '';
        const strava_url = (formData.get('strava_url') as string) || '';
        const gpx_track_url = (formData.get('gpx_track_url') as string) || '';

        const p1 = (formData.get('story_p1') as string) || '';
        const p2 = (formData.get('story_p2') as string) || '';
        const p3 = (formData.get('story_p3') as string) || '';
        const story_paragraphs = [p1, p2, p3].filter(Boolean);

        const logistics = {
            sector: (formData.get('logistics_sector') as string) || '',
            acceso: (formData.get('logistics_acceso') as string) || '',
            puntoEncuentro: (formData.get('logistics_punto') as string) || '',
            coordenadas: (formData.get('logistics_coordenadas') as string) || ''
        };

        const reqEquipStr = (formData.get('required_equipment') as string) || '';
        const required_equipment = reqEquipStr ? reqEquipStr.split('\n').filter(s=>s.trim()) : [];

        const baseUpdatePayload: Record<string, any> = {
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
            elevation_gain,
            max_altitude,
            distance,
            itinerary,
            included,
            not_included
        };

        const extendedUpdatePayload = {
            ...baseUpdatePayload,
            vertical_type,
            custom_discipline,
            badge,
            number_code,
            tagline,
            price_usd,
            strava_url,
            gpx_track_url,
            story_paragraphs,
            logistics,
            required_equipment
        };

        // 1. Update Adventure (intentamos con todas las columnas y caemos a base si faltan)
        let { error: adventureError } = await supabase
            .from('adventures_catalog')
            .update(extendedUpdatePayload)
            .eq('id', id);

        if (adventureError && adventureError.message.includes('does not exist')) {
            console.warn('Columnas extendidas no encontradas al actualizar, guardando basePayload:', adventureError.message);
            const retry = await supabase
                .from('adventures_catalog')
                .update(baseUpdatePayload)
                .eq('id', id);
            if (retry.error) {
                console.error('Error actualizando aventura:', retry.error);
                return { success: false, error: `Error de base de datos: ${retry.error.message}` };
            }
        } else if (adventureError) {
            console.error('Error actualizando aventura:', adventureError);
            return { success: false, error: `Error al actualizar la aventura: ${adventureError.message}` };
        }

        // 2. Delete old costs
        const { error: delErr } = await supabase.from('adventure_costs_template').delete().eq('adventure_id', id);
        if (delErr) {
            console.warn('Advertencia al limpiar costos antiguos:', delErr);
        }

        // 3. Insert new costs
        if (costs && costs.length > 0) {
            const costsToInsert = costs
                .filter(c => c.cost_name && c.cost_name.trim())
                .map(c => ({
                    adventure_id: id,
                    cost_name: c.cost_name.trim(),
                    expected_amount: Number(c.expected_amount) || 0,
                    cost_type: c.cost_type || 'fixed'
                }));

            if (costsToInsert.length > 0) {
                const { error: costsError } = await supabase
                    .from('adventure_costs_template')
                    .insert(costsToInsert);

                if (costsError) {
                    console.error('Error insertando costos:', costsError);
                    return { success: false, error: `Aventura actualizada, pero error al actualizar costos: ${costsError.message}` };
                }
            }
        }

        try {
            revalidatePath('/admin/creador-rutas');
            revalidatePath('/');
        } catch (revErr) {
            console.warn('Advertencia revalidando rutas:', revErr);
        }

        return { success: true };
    } catch (err: any) {
        console.error('Error general en updateAdventureWithCosts:', err);
        return { success: false, error: err.message || 'Error inesperado del servidor' };
    }
}
