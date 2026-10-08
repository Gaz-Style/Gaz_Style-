'use server';

import { createWebpayTransaction } from '@/lib/transbank';
import { createClient } from '@supabase/supabase-js';

export async function createReservationAndPay(formData: any, routeType: string, amount: number) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Check if Adventurer exists by email or rut, otherwise create
  let adventurerId = '';
  const { data: existingAdv } = await supabase.from('adventurers').select('id').or(`email.eq.${formData.email},rut.eq.${formData.rut}`).limit(1).single();
  
  if (existingAdv) {
      adventurerId = existingAdv.id;
  } else {
      const { data: newAdv, error: errAdv } = await supabase.from('adventurers').insert([{
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          rut: formData.rut
      }]).select('id').single();
      
      if (errAdv || !newAdv) throw new Error('Error al crear aventurero');
      adventurerId = newAdv.id;
      
      // Insert medical profile
      await supabase.from('medical_profiles').insert([{
          adventurer_id: adventurerId,
          experience_level: formData.experience || 'principiante'
      }]);
  }

  // 2. Create Booking
  const { data: booking, error: errBooking } = await supabase
    .from('bookings')
    .insert([{
      adventurer_id: adventurerId,
      route_requested: routeType,
      requested_date: formData.date || null,
      status: 'pending_payment',
      payment_status: 'pending',
      amount_paid: amount
    }])
    .select('id')
    .single();

  if (errBooking || !booking) {
    throw new Error('Error al guardar la reserva en la base de datos');
  }

  // 3. Webpay integration
  const buyOrder = booking.id.substring(0, 26);
  const sessionId = `SESSION_${Date.now()}`;
  
  const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhooks/transbank`;

  const webpayRes = await createWebpayTransaction(buyOrder, sessionId, amount, returnUrl);

  if (webpayRes.success) {
    return { success: true, redirectUrl: `${webpayRes.url}?token_ws=${webpayRes.token}` };
  } else {
    throw new Error('Error al conectar con Transbank');
  }
}
