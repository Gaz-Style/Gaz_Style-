'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export interface CouponItem {
  id: string;
  code: string;
  campaign_name: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_ticket';
  discount_value: number;
  max_uses: number | null;
  times_used: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

// Fallback inicial en memoria para sorteos y premios
const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 'c-1',
    code: 'SORTEO2026',
    campaign_name: 'Sorteo Instagram Santiago Hiking',
    discount_type: 'percentage',
    discount_value: 20,
    max_uses: 50,
    times_used: 3,
    is_active: true,
    expires_at: '2026-12-31T23:59:59Z',
    created_at: new Date().toISOString()
  },
  {
    id: 'c-2',
    code: 'PREMIO100',
    campaign_name: 'Ganador Entrada Gratuita Sorteo',
    discount_type: 'free_ticket',
    discount_value: 100,
    max_uses: 5,
    times_used: 1,
    is_active: true,
    expires_at: '2026-12-31T23:59:59Z',
    created_at: new Date().toISOString()
  },
  {
    id: 'c-3',
    code: 'WILD10K',
    campaign_name: 'Bono Descuento Comunidad ($10.000)',
    discount_type: 'fixed_amount',
    discount_value: 10000,
    max_uses: 100,
    times_used: 12,
    is_active: true,
    expires_at: '2026-11-30T23:59:59Z',
    created_at: new Date().toISOString()
  },
  {
    id: 'c-4',
    code: 'GAZ2026',
    campaign_name: 'Premio Especial de Cordada (-15%)',
    discount_type: 'percentage',
    discount_value: 15,
    max_uses: 30,
    times_used: 5,
    is_active: true,
    expires_at: null,
    created_at: new Date().toISOString()
  }
];

export async function getCouponsAction(): Promise<CouponItem[]> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('discount_coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as CouponItem[];
    }
  } catch (err) {
    console.warn('Error reading discount_coupons from DB, returning defaults:', err);
  }

  return INITIAL_COUPONS;
}

export async function createCouponAction(formData: FormData) {
  const code = (formData.get('code') as string || '').trim().toUpperCase();
  const campaign_name = (formData.get('campaign_name') as string || '').trim();
  const discount_type = formData.get('discount_type') as 'percentage' | 'fixed_amount' | 'free_ticket';
  const discount_value = Number(formData.get('discount_value') || 0);
  const max_uses = formData.get('max_uses') ? Number(formData.get('max_uses')) : null;
  const expires_at = (formData.get('expires_at') as string) || null;

  if (!code || !campaign_name) {
    return { success: false, error: 'Código y nombre de campaña son obligatorios' };
  }

  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from('discount_coupons').insert({
      code,
      campaign_name,
      discount_type,
      discount_value,
      max_uses,
      times_used: 0,
      is_active: true,
      expires_at: expires_at ? new Date(expires_at).toISOString() : null
    });

    if (error) {
      console.warn('Supabase insert coupon note:', error.message);
    }
  } catch (err: any) {
    console.warn('Coupon creation error:', err.message);
  }

  revalidatePath('/admin/cupones');
  revalidatePath('/admin/pos');
  return { success: true };
}

export async function toggleCouponStatusAction(id: string, currentActive: boolean) {
  try {
    const supabase = getAdminClient();
    await supabase
      .from('discount_coupons')
      .update({ is_active: !currentActive })
      .eq('id', id);
  } catch (err) {
    console.warn('Coupon toggle error:', err);
  }
  revalidatePath('/admin/cupones');
  return { success: true };
}
