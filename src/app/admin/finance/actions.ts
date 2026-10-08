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

export async function getFinancialSummary() {
    const supabase = getAdminClient();

    const [expensesRes, incomeRes, bookingsRes, payrollRes] = await Promise.all([
        supabase.from('general_expenses').select('*').order('expense_date', { ascending: false }),
        supabase.from('general_income').select('*').order('income_date', { ascending: false }),
        supabase.from('bookings').select('*'),
        supabase.from('payroll').select('*').order('created_at', { ascending: false }),
    ]);

    const expenses = expensesRes.data || [];
    const generalIncome = incomeRes.data || [];
    const bookings = bookingsRes.data || [];
    const payroll = payrollRes.data || [];

    const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
    const totalPayroll = payroll.filter(p => p.status === 'paid').reduce((acc, p) => acc + Number(p.net_pay), 0);
    const totalIncome = generalIncome.reduce((acc, i) => acc + Number(i.amount), 0);
    const totalBookingRevenue = bookings.reduce((acc, b) => acc + Number(b.amount_paid), 0);
    const totalRevenue = totalIncome + totalBookingRevenue;
    const totalCosts = totalExpenses + totalPayroll;
    const netResult = totalRevenue - totalCosts;

    return { expenses, generalIncome, bookings, payroll, totalExpenses, totalPayroll, totalIncome, totalBookingRevenue, totalRevenue, totalCosts, netResult };
}

export async function createExpense(formData: FormData) {
    const supabase = getAdminClient();
    const { error } = await supabase.from('general_expenses').insert({
        expense_date: formData.get('expense_date') as string,
        description: formData.get('description') as string,
        amount: parseFloat(formData.get('amount') as string),
        category: formData.get('category') as string,
        payment_method: formData.get('payment_method') as string,
        notes: formData.get('notes') as string,
    });
    if (error) return { error: error.message };
    revalidatePath('/admin/finance');
    return { success: true };
}

export async function createPayroll(formData: FormData) {
    const supabase = getAdminClient();
    const { error } = await supabase.from('payroll').insert({
        period: formData.get('period') as string,
        staff_name: formData.get('staff_name') as string,
        role: formData.get('role') as string,
        base_salary: parseFloat(formData.get('base_salary') as string),
        bonuses: parseFloat(formData.get('bonuses') as string) || 0,
        deductions: parseFloat(formData.get('deductions') as string) || 0,
        payment_date: formData.get('payment_date') as string,
        status: 'pending',
    });
    if (error) return { error: error.message };
    revalidatePath('/admin/finance');
    return { success: true };
}

export async function markPayrollPaid(id: string) {
    const supabase = getAdminClient();
    const { error } = await supabase.from('payroll').update({ status: 'paid' }).eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/admin/finance');
    return { success: true };
}
