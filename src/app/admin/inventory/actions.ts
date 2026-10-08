'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

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

export async function getInventory() {
    const supabase = getAdminClient();
    const { data, error } = await supabase
        .from('shared_inventory')
        .select('*')
        .order('category', { ascending: true })
        .order('item_name', { ascending: true });

    if (error) {
        console.error('Error fetching inventory:', error);
        return [];
    }
    return data;
}

export async function createInventoryItem(formData: FormData) {
    const supabase = getAdminClient();
    
    const item_name = formData.get('item_name') as string;
    const category = formData.get('category') as string;
    const total_owned = parseInt(formData.get('total_owned') as string);
    
    const { error } = await supabase
        .from('shared_inventory')
        .insert({
            item_name,
            category,
            total_owned,
            available_qty: total_owned, // Initially, all are available
            status: 'active'
        });

    if (error) throw new Error(error.message);
    revalidatePath('/admin/inventory');
}

export async function updateInventoryQty(id: string, newTotal: number) {
    const supabase = getAdminClient();
    
    // First get current to calculate diff for available_qty
    const { data: current } = await supabase.from('shared_inventory').select('total_owned, available_qty').eq('id', id).single();
    if (!current) return;

    const diff = newTotal - current.total_owned;
    const newAvailable = current.available_qty + diff;

    const { error } = await supabase
        .from('shared_inventory')
        .update({ 
            total_owned: newTotal,
            available_qty: newAvailable < 0 ? 0 : newAvailable
        })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/inventory');
}

export async function deleteInventoryItem(id: string) {
    const supabase = getAdminClient();
    const { error } = await supabase
        .from('shared_inventory')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/inventory');
}
