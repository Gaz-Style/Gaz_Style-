import React from 'react';
import DashboardClient from './DashboardClient';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const [
        { count: totalAdventurers },
        { count: totalRoutes },
        { data: departures },
        { data: bookings },
        { data: expenses },
        { data: payroll },
    ] = await Promise.all([
        supabase.from('crm_adventurers').select('*', { count: 'exact', head: true }),
        supabase.from('adventures_catalog').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('agenda_departures').select('*, adventures_catalog(title, category)').order('start_date', { ascending: true }),
        supabase.from('bookings').select('total_price, amount_paid, payment_status'),
        supabase.from('general_expenses').select('amount'),
        supabase.from('payroll').select('net_pay').eq('status', 'paid'),
    ]);

    const upcomingDepartures = (departures || []).filter(d => d.status === 'scheduled' || d.status === 'confirmed');
    const totalRevenue = (bookings || []).reduce((acc, b) => acc + Number(b.amount_paid), 0);
    const totalExpenses = (expenses || []).reduce((acc, e) => acc + Number(e.amount), 0);
    const totalPayroll = (payroll || []).reduce((acc, p) => acc + Number(p.net_pay), 0);
    const netResult = totalRevenue - totalExpenses - totalPayroll;

    return {
        totalAdventurers: totalAdventurers || 0,
        totalRoutes: totalRoutes || 0,
        upcomingDepartures,
        totalRevenue,
        netResult,
        pendingWaivers: 0,
    };
}

export default async function AdminPage() {
    const data = await getDashboardData();
    return <DashboardClient data={data} />;
}
