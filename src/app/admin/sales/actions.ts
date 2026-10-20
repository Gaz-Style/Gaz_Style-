'use server';

import { createClient } from '@supabase/supabase-js';
import { SaleLedgerRecord, PaymentMethodType } from '@/types/pos';
import { revalidatePath } from 'next/cache';
import * as XLSX from 'xlsx';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function getSalesLedger(): Promise<SaleLedgerRecord[]> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('sales_ledger')
      .select(`
        id,
        internal_id,
        total_amount,
        paid_amount,
        status,
        payment_method,
        created_at,
        adventurer_id,
        booking_id,
        bookings (
          id,
          route_requested,
          requested_date,
          total_price,
          amount_paid,
          payment_status,
          crm_adventurers (
            first_name,
            last_name,
            phone,
            email
          ),
          adventurers (
            full_name,
            phone,
            email
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item: any) => {
        const booking = Array.isArray(item.bookings) ? item.bookings[0] : item.bookings;
        const crmAdv = booking?.crm_adventurers ? (Array.isArray(booking.crm_adventurers) ? booking.crm_adventurers[0] : booking.crm_adventurers) : null;
        const adv = booking?.adventurers ? (Array.isArray(booking.adventurers) ? booking.adventurers[0] : booking.adventurers) : null;

        const customerName = crmAdv
          ? `${crmAdv.first_name || ''} ${crmAdv.last_name || ''}`.trim()
          : adv?.full_name || 'Aventurero';
        const customerPhone = crmAdv?.phone || adv?.phone || '—';
        const customerEmail = crmAdv?.email || adv?.email || '';

        const totalAmount = Number(item.total_amount || 0);
        const paidAmount = Number(item.paid_amount || 0);
        const balance = Math.max(0, totalAmount - paidAmount);

        return {
          id: item.id,
          internal_id: item.internal_id || `SH-${item.id.slice(0, 8)}`,
          adventurer_id: item.adventurer_id,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          expedition_title: booking?.route_requested || 'Expedición Cordillera',
          scheduled_date: booking?.requested_date || item.created_at.slice(0, 10),
          pax_count: 1,
          total_amount: totalAmount,
          paid_amount: paidAmount,
          balance: balance,
          payment_status: balance === 0 ? 'completed' : paidAmount > 0 ? 'partial' : 'pending',
          payment_method: (item.payment_method || 'transfer') as PaymentMethodType,
          created_at: item.created_at
        };
      });
    }
  } catch (err) {
    console.warn('Error fetching sales ledger from Supabase:', err);
  }

  return [];
}

export async function payRemainingBalanceAction(saleId: string, additionalPayment: number, method: string) {
  try {
    const supabase = getAdminClient();
    const { data: sale } = await supabase
      .from('sales_ledger')
      .select('id, total_amount, paid_amount, booking_id')
      .eq('id', saleId)
      .single();

    if (sale) {
      const newPaid = Number(sale.paid_amount || 0) + Number(additionalPayment);
      const isComplete = newPaid >= Number(sale.total_amount || 0);

      await supabase
        .from('sales_ledger')
        .update({
          paid_amount: newPaid,
          status: isComplete ? 'completed' : 'pending'
        })
        .eq('id', saleId);

      if (sale.booking_id) {
        await supabase
          .from('bookings')
          .update({
            amount_paid: newPaid,
            payment_status: isComplete ? 'paid' : 'partial'
          })
          .eq('id', sale.booking_id);
      }
    }

    revalidatePath('/admin/sales');
    revalidatePath('/admin/okrs');
    revalidatePath('/admin/calendario');
    revalidatePath('/admin/operaciones');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function exportSalesToExcelAction(sales: SaleLedgerRecord[]): Promise<{ base64: string; fileName: string }> {
  const wb = XLSX.utils.book_new();

  const headers = [
    'ID Venta',
    'Fecha Registro',
    'Aventurero',
    'Celular',
    'Expedición',
    'Fecha Salida Agendada',
    'Cupos',
    'Total ($ CLP)',
    'Pagado ($ CLP)',
    'Saldo Pendiente ($ CLP)',
    'Estado',
    'Medio de Pago'
  ];

  const rows = sales.map(s => [
    s.internal_id,
    s.created_at.slice(0, 10),
    s.customer_name,
    s.customer_phone,
    s.expedition_title,
    s.scheduled_date,
    s.pax_count,
    s.total_amount,
    s.paid_amount,
    s.balance,
    s.payment_status === 'completed' ? '100% Pagado' : s.payment_status === 'partial' ? 'Abono 50%' : 'Pendiente',
    s.payment_method
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  XLSX.utils.book_append_sheet(wb, ws, 'Planilla de Ventas');

  const buf = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  return {
    base64: buf,
    fileName: `Planilla_Ventas_Santiago_Hiking_${new Date().toISOString().slice(0, 10)}.xlsx`
  };
}
