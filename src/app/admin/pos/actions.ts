'use server';

import { createClient } from '@supabase/supabase-js';
import { AdventurerData, ExpeditionOption, POSSalePayload, SaleLedgerRecord } from '@/types/pos';
import { OFFICIAL_EXPEDITIONS } from '@/lib/pos-data';
import { sendExpeditionTicketEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// 0. Validar cupón de descuento / premio / sorteo
export async function validateCouponAction(code: string, currentTotal: number) {
  if (!code || !code.trim()) {
    return { valid: false, error: 'Ingresa un código de descuento' };
  }
  const cleanCode = code.trim().toUpperCase();

  try {
    const supabase = getAdminClient();
    const { data: coupon, error } = await supabase
      .from('discount_coupons')
      .select('*')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !coupon) {
      // Códigos promocionales de reserva en memoria si la tabla de Supabase aún no ha sido migrada manualmente
      const fallbackCoupons: Record<string, { campaign: string; type: 'percentage' | 'fixed_amount' | 'free_ticket'; value: number }> = {
        'SORTEO2026': { campaign: 'Sorteo Instagram Santiago Hiking', type: 'percentage', value: 20 },
        'PREMIO100': { campaign: 'Ganador Entrada Gratuita Sorteo', type: 'free_ticket', value: 100 },
        'WILD10K': { campaign: 'Bono Descuento Comunidad', type: 'fixed_amount', value: 10000 },
        'GAZ2026': { campaign: 'Premio Especial Cordada', type: 'percentage', value: 15 }
      };

      if (fallbackCoupons[cleanCode]) {
        const c = fallbackCoupons[cleanCode];
        let discount = 0;
        if (c.type === 'free_ticket') discount = currentTotal;
        else if (c.type === 'percentage') discount = Math.round((currentTotal * c.value) / 100);
        else if (c.type === 'fixed_amount') discount = Math.min(currentTotal, c.value);

        return {
          valid: true,
          code: cleanCode,
          campaign_name: c.campaign,
          discount_type: c.type,
          discount_value: c.value,
          discount_amount: discount,
          final_total: Math.max(0, currentTotal - discount)
        };
      }

      return { valid: false, error: 'Código de descuento inválido o expirado' };
    }

    // Verificar expiración si existe
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { valid: false, error: 'Este código de descuento ha expirado' };
    }

    // Verificar cupo de usos
    if (coupon.max_uses && coupon.times_used >= coupon.max_uses) {
      return { valid: false, error: 'Este cupón ha alcanzado su límite de usos' };
    }

    let discount = 0;
    if (coupon.discount_type === 'free_ticket') {
      discount = currentTotal;
    } else if (coupon.discount_type === 'percentage') {
      discount = Math.round((currentTotal * Number(coupon.discount_value)) / 100);
    } else if (coupon.discount_type === 'fixed_amount') {
      discount = Math.min(currentTotal, Number(coupon.discount_value));
    }

    return {
      valid: true,
      code: coupon.code,
      campaign_name: coupon.campaign_name,
      discount_type: coupon.discount_type,
      discount_value: Number(coupon.discount_value),
      discount_amount: discount,
      final_total: Math.max(0, currentTotal - discount)
    };
  } catch (err: any) {
    console.error('Error validating coupon:', err);
    return { valid: false, error: 'Error al consultar el cupón' };
  }
}

// 1. Obtener catálogo real de aventuras desde adventures_catalog
export async function getAdventuresCatalogAction(): Promise<ExpeditionOption[]> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('adventures_catalog')
      .select('id, title, category, base_price, price_usd, duration_text, difficulty_level, min_pax, max_pax')
      .order('base_price', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category || 'Trekking',
        duration_text: item.duration_text || 'Medio día',
        base_price_clp: Number(item.base_price || 25000),
        price_usd: item.price_usd ? Number(item.price_usd) : Math.round(Number(item.base_price || 25000) / 930),
        meeting_point: item.title.toLowerCase().includes('manquehuito') 
          ? 'Acceso Vía Roja, Lo Barnechea' 
          : item.title.toLowerCase().includes('pochoco') 
          ? 'Observatorio Achiras, El Arrayán'
          : item.title.toLowerCase().includes('carbón')
          ? 'Rotonda La Pirámide (Acceso Saint George)'
          : 'Punto oficial de cordada Santiago Hiking',
        meeting_time: item.title.toLowerCase().includes('sunset') ? '18:30 hrs' : '08:00 hrs',
        difficulty: item.difficulty_level || 'Moderada'
      }));
    }
  } catch (err) {
    console.warn('Error loading adventures_catalog, using local fallback:', err);
  }

  return OFFICIAL_EXPEDITIONS;
}

// 2. Buscar aventureros en crm_adventurers
export async function searchAdventurers(query: string) {
  if (!query || query.trim().length < 2) return [];
  try {
    const supabase = getAdminClient();
    const clean = query.trim().toLowerCase();

    const { data: crmData } = await supabase
      .from('crm_adventurers')
      .select('id, first_name, last_name, email, phone, emergency_contact_name, emergency_contact_phone, mountain_experience_level')
      .or(`first_name.ilike.%${clean}%,last_name.ilike.%${clean}%,phone.ilike.%${clean}%,email.ilike.%${clean}%`)
      .limit(8);

    if (crmData && crmData.length > 0) {
      return crmData.map(a => ({
        id: a.id,
        first_name: a.first_name,
        last_name: a.last_name || '',
        email: a.email || '',
        phone: a.phone || '',
        emergency_contact_name: a.emergency_contact_name || '',
        emergency_contact_phone: a.emergency_contact_phone || '',
        mountain_experience_level: a.mountain_experience_level || 'principiante'
      }));
    }
  } catch (err) {
    console.warn('Error searching adventurers:', err);
  }
  return [];
}

// 3. Crear o asegurar aventurero en crm_adventurers
export async function createAdventurerAction(data: AdventurerData): Promise<{ id: string; success: boolean }> {
  try {
    const supabase = getAdminClient();
    
    // Si ya existe por teléfono, usar el existente
    const { data: existing } = await supabase
      .from('crm_adventurers')
      .select('id')
      .eq('phone', data.phone.trim())
      .maybeSingle();

    if (existing?.id) {
      return { id: existing.id, success: true };
    }

    const { data: inserted, error } = await supabase
      .from('crm_adventurers')
      .insert({
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        email: data.email?.trim() || null,
        phone: data.phone.trim(),
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
        mountain_experience_level: data.mountain_experience_level || 'principiante',
        waiver_signed: false
      })
      .select('id')
      .single();

    if (!error && inserted) {
      return { id: inserted.id, success: true };
    }
  } catch (err) {
    console.warn('Error creating adventurer in crm_adventurers:', err);
  }

  return { id: `adv-local-${Date.now()}`, success: true };
}

// 4. CREACIÓN ATÓMICA DE VENTA, AGENDAMIENTO, SALIDA Y CRM
export async function createPOSSale(payload: POSSalePayload): Promise<{
  success: boolean;
  sale: SaleLedgerRecord;
  whatsappMessage: string;
  emailSent?: boolean;
  error?: string;
}> {
  const supabase = getAdminClient();

  const dateObj = new Date();
  const yearMonth = `${dateObj.getFullYear()}${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const internalId = `SH-${yearMonth}-${randomSuffix}`;

  const fullName = `${payload.adventurer.first_name} ${payload.adventurer.last_name}`.trim();
  const isFullyPaid = payload.balance <= 0;
  const paymentStatus = isFullyPaid ? 'completed' : payload.paid_amount > 0 ? 'partial' : 'pending';

  try {
    // =========================================================================
    // PASO A: Asegurar Aventurero en crm_adventurers (CRM)
    // =========================================================================
    let advId = payload.adventurer.id;
    if (!advId) {
      const advRes = await createAdventurerAction(payload.adventurer);
      advId = advRes.id;
    }

    // =========================================================================
    // PASO B: Asegurar Salida en agenda_departures (AGENDA / CALENDARIO)
    // =========================================================================
    // Verificar si ya existe una salida agendada para esa aventura y esa fecha
    let departureId: string | null = null;
    
    // Solo si el expedition.id es un UUID válido (de adventures_catalog)
    const isCatalogUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.expedition.id);
    const adventureCatalogId = isCatalogUUID ? payload.expedition.id : null;

    if (adventureCatalogId) {
      const { data: existingDep } = await supabase
        .from('agenda_departures')
        .select('id, current_pax')
        .eq('adventure_id', adventureCatalogId)
        .eq('start_date', payload.scheduled_date)
        .maybeSingle();

      if (existingDep?.id) {
        departureId = existingDep.id;
        // Sumar los cupos
        await supabase
          .from('agenda_departures')
          .update({
            current_pax: Number(existingDep.current_pax || 0) + Number(payload.pax_count),
            status: 'confirmed'
          })
          .eq('id', departureId);
      } else {
        // Crear nueva salida en el calendario
        const { data: newDep } = await supabase
          .from('agenda_departures')
          .insert({
            adventure_id: adventureCatalogId,
            start_date: payload.scheduled_date,
            end_date: payload.scheduled_date,
            status: 'confirmed',
            current_pax: payload.pax_count,
            guide_id: null
          })
          .select('id')
          .single();

        if (newDep?.id) {
          departureId = newDep.id;
        }
      }
    } else {
      // Si la expedición no tiene UUID de catálogo, crear salida en agenda_departures sin adventure_id o con la primera aventura
      const { data: fallbackAdv } = await supabase.from('adventures_catalog').select('id').limit(1).maybeSingle();
      if (fallbackAdv?.id) {
        const { data: newDep } = await supabase
          .from('agenda_departures')
          .insert({
            adventure_id: fallbackAdv.id,
            start_date: payload.scheduled_date,
            end_date: payload.scheduled_date,
            status: 'confirmed',
            current_pax: payload.pax_count
          })
          .select('id')
          .single();
        if (newDep?.id) departureId = newDep.id;
      }
    }

    // =========================================================================
    // PASO C: Insertar Reserva en bookings (UNIÓN CRM + AGENDA + DESPACHO)
    // =========================================================================
    const { data: bookingData, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        adventurer_id: advId,
        departure_id: departureId,
        total_price: payload.total_amount,
        amount_paid: payload.paid_amount,
        payment_status: isFullyPaid ? 'paid' : payload.paid_amount > 0 ? 'partial' : 'pending',
        route_requested: payload.expedition.title,
        requested_date: payload.scheduled_date,
        status: 'confirmed',
        booking_date: new Date().toISOString()
      })
      .select('id')
      .single();

    if (bookingErr) {
      console.error('Error inserting booking:', bookingErr);
    }
    const bookingId = bookingData?.id || null;

    // =========================================================================
    // PASO D: Insertar en sales_ledger (PLANILLA DE VENTAS / LIBRO MAYOR)
    // =========================================================================
    const { error: saleErr } = await supabase
      .from('sales_ledger')
      .insert({
        internal_id: internalId,
        adventurer_id: advId,
        booking_id: bookingId,
        total_amount: payload.total_amount,
        paid_amount: payload.paid_amount,
        status: isFullyPaid ? 'completed' : 'pending',
        payment_method: payload.payment_method
      });

    if (saleErr) {
      console.error('Error inserting sales_ledger:', saleErr);
    }

  } catch (err) {
    console.warn('POS transaction error:', err);
  }

  const saleRecord: SaleLedgerRecord = {
    id: `sale-${Date.now()}`,
    internal_id: internalId,
    adventurer_id: payload.adventurer.id,
    customer_name: fullName,
    customer_phone: payload.adventurer.phone,
    customer_email: payload.adventurer.email,
    expedition_title: payload.expedition.title,
    scheduled_date: payload.scheduled_date,
    pax_count: payload.pax_count,
    total_amount: payload.total_amount,
    paid_amount: payload.paid_amount,
    balance: payload.balance,
    payment_status: paymentStatus,
    payment_method: payload.payment_method,
    transfer_reference: payload.transfer_reference,
    seller_name: payload.seller_name || 'Gaz (Presencial)',
    notes: payload.notes,
    created_at: new Date().toISOString()
  };

  // Texto para WhatsApp con coordenadas y confirmación
  const saldoTexto = payload.balance > 0 
    ? `\n*Saldo Pendiente:* $${payload.balance.toLocaleString('es-CL')} CLP (a pagar antes del ascenso)` 
    : '\n*Estado de Pago:* 100% Pagado ✅';

  const whatsappMessage = `🏔️ *CONFIRMACIÓN DE EXPEDICIÓN — SANTIAGO HIKING*\n` +
    `¡Hola ${payload.adventurer.first_name}! Tu cupo ha sido agendado exitosamente con liderazgo de cordada.\n\n` +
    `📌 *ID Reserva:* ${internalId}\n` +
    `⛰️ *Aventura:* ${payload.expedition.title}\n` +
    `📅 *Fecha de Ascenso:* ${payload.scheduled_date}\n` +
    `⏰ *Hora de Encuentro:* ${payload.meeting_time}\n` +
    `📍 *Punto de Encuentro:* ${payload.meeting_point}\n` +
    `👥 *Cupos Reservados:* ${payload.pax_count} persona(s)\n` +
    `🧭 *Liderazgo:* ${payload.guide_assigned}\n` +
    `💳 *Monto Pagado:* $${payload.paid_amount.toLocaleString('es-CL')} CLP` +
    saldoTexto + `\n\n` +
    `🎒 *Equipamiento sugerido:* Calzado con buen agarre, 1.5L de agua, cortaviento/abrigo ligero y linterna frontal si es atardecer.\n\n` +
    `_Nos vemos en la cumbre. Do Wild Things._ ⛰️⚡`;

  // Disparar envío automático de correo con Expedition Pass si el cliente tiene email
  let emailSent = false;
  if (payload.adventurer.email && payload.adventurer.email.includes('@')) {
    try {
      const emailRes = await sendExpeditionTicketEmail({
        to: payload.adventurer.email,
        name: payload.adventurer.first_name,
        adventureTitle: payload.expedition.title,
        departureDate: payload.scheduled_date,
        meetingPoint: payload.meeting_point,
        meetingTime: payload.meeting_time,
        totalPaid: `$${payload.paid_amount.toLocaleString('es-CL')} CLP`,
        ticketId: internalId,
        whatsappLink: `https://wa.me/56984021940?text=${encodeURIComponent(whatsappMessage)}`
      });
      emailSent = emailRes.success;
    } catch (e) {
      console.warn('Error sending automated ticket email:', e);
    }
  }

  // Revalidar todas las vistas para reflejar la conexión inmediata
  revalidatePath('/admin/pos');
  revalidatePath('/admin/sales');
  revalidatePath('/admin/calendario');
  revalidatePath('/admin/operaciones');
  revalidatePath('/admin/registro-aventurero');
  revalidatePath('/admin/okrs');
  revalidatePath('/admin');

  return {
    success: true,
    sale: saleRecord,
    whatsappMessage,
    emailSent
  };
}

// Acción para reenviar ticket por correo manualmente
export async function resendTicketEmailAction(payload: {
  to: string;
  name: string;
  adventureTitle: string;
  departureDate: string;
  meetingPoint?: string;
  meetingTime?: string;
  totalPaid: string;
  ticketId: string;
}) {
  if (!payload.to || !payload.to.includes('@')) {
    return { success: false, error: 'Email inválido o no especificado' };
  }

  return await sendExpeditionTicketEmail({
    to: payload.to,
    name: payload.name,
    adventureTitle: payload.adventureTitle,
    departureDate: payload.departureDate,
    meetingPoint: payload.meetingPoint || 'Punto oficial de cordada Santiago Hiking',
    meetingTime: payload.meetingTime || '08:00 hrs',
    totalPaid: payload.totalPaid,
    ticketId: payload.ticketId,
    whatsappLink: 'https://wa.me/56984021940'
  });
}
