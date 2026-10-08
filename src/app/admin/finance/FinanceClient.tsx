'use client';

import React, { useState } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, Users,
  Plus, CheckCircle2, Clock, Building2, Truck, Coffee,
  BarChart3, CreditCard, FileText, ChevronDown
} from 'lucide-react';
import { createExpense, createPayroll, markPayrollPaid } from './actions';

const EXPENSE_CATEGORIES = [
  'Arriendo', 'Remuneraciones', 'Alojamiento', 'Combustible',
  'Alimentación', 'Marketing', 'Seguros', 'Mantención Equipo',
  'Transporte', 'Servicios Básicos', 'Capacitación', 'Otros'
];

type Tab = 'resumen' | 'egresos' | 'remuneraciones';

export default function FinanceClient({ data }: { data: any }) {
  const [tab, setTab] = useState<Tab>('resumen');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleExpenseSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const res = await createExpense(fd);
    if (res?.error) alert(res.error);
    else { setShowExpenseModal(false); window.location.reload(); }
    setIsSubmitting(false);
  }

  async function handlePayrollSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const res = await createPayroll(fd);
    if (res?.error) alert(res.error);
    else { setShowPayrollModal(false); window.location.reload(); }
    setIsSubmitting(false);
  }

  const { expenses, payroll, totalRevenue, totalCosts, netResult, totalExpenses, totalPayroll, totalBookingRevenue } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2">
              <BarChart3 className="w-4 h-4" /> ERP — Libro Mayor General
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
              Control <span className="font-bold">Financiero</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2">
              Ingresos por expediciones, gastos operativos generales y remuneraciones de personal.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowExpenseModal(true)} className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 font-semibold rounded-lg transition-all flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Registrar Gasto
            </button>
            <button onClick={() => setShowPayrollModal(true)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" /> Liquidar Sueldo
            </button>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className={`bg-slate-900 border rounded-xl p-6 ${netResult >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Resultado Neto</p>
            <h2 className={`text-2xl font-black ${netResult >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${netResult.toLocaleString('es-CL')}
            </h2>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              {netResult >= 0 ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
              {netResult >= 0 ? 'Empresa rentable' : 'Resultado negativo'}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Ingresos Totales</p>
            <h2 className="text-2xl font-black text-white">${totalRevenue.toLocaleString('es-CL')}</h2>
            <p className="text-xs text-slate-500 mt-2">Tours: ${totalBookingRevenue.toLocaleString('es-CL')}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Egresos Operativos</p>
            <h2 className="text-2xl font-black text-red-400">${totalExpenses.toLocaleString('es-CL')}</h2>
            <p className="text-xs text-slate-500 mt-2">Arriendo, Hostal, Combustible, etc.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Nómina Pagada</p>
            <h2 className="text-2xl font-black text-orange-400">${totalPayroll.toLocaleString('es-CL')}</h2>
            <p className="text-xs text-slate-500 mt-2">Sueldos liquidados</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1.5 w-fit">
          {(['resumen', 'egresos', 'remuneraciones'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-semibold capitalize rounded-lg transition-all ${tab === t ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
              {t === 'resumen' ? 'Libro Mayor' : t === 'egresos' ? 'Egresos' : 'Nómina'}
            </button>
          ))}
        </div>

        {/* Egresos Tab */}
        {tab === 'egresos' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-800">
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4 font-semibold">Descripción</th>
                  <th className="p-4 font-semibold">Categoría</th>
                  <th className="p-4 font-semibold">Método</th>
                  <th className="p-4 font-semibold text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">Sin egresos registrados. Usa "Registrar Gasto" para comenzar.</td></tr>
                ) : expenses.map((e: any) => (
                  <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 text-sm text-slate-400">{new Date(e.expense_date).toLocaleDateString('es-ES')}</td>
                    <td className="p-4 font-medium text-slate-200">{e.description}</td>
                    <td className="p-4"><span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">{e.category}</span></td>
                    <td className="p-4 text-sm text-slate-400">{e.payment_method}</td>
                    <td className="p-4 text-right font-bold text-red-400">${Number(e.amount).toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Nómina Tab */}
        {tab === 'remuneraciones' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-800">
                  <th className="p-4 font-semibold">Personal</th>
                  <th className="p-4 font-semibold">Cargo</th>
                  <th className="p-4 font-semibold">Período</th>
                  <th className="p-4 font-semibold">Sueldo Base</th>
                  <th className="p-4 font-semibold">Neto a Pagar</th>
                  <th className="p-4 font-semibold text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {payroll.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">Sin registros de nómina. Usa "Liquidar Sueldo" para comenzar.</td></tr>
                ) : payroll.map((p: any) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-medium text-slate-200">{p.staff_name}</td>
                    <td className="p-4 text-sm text-slate-400">{p.role}</td>
                    <td className="p-4 text-sm text-slate-400">{p.period}</td>
                    <td className="p-4 text-sm text-slate-300">${Number(p.base_salary).toLocaleString('es-CL')}</td>
                    <td className="p-4 font-bold text-white">${Number(p.net_pay).toLocaleString('es-CL')}</td>
                    <td className="p-4 text-center">
                      {p.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded">
                          <CheckCircle2 className="w-3 h-3" /> Pagado
                        </span>
                      ) : (
                        <button onClick={async () => { await markPayrollPaid(p.id); window.location.reload(); }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors">
                          Marcar Pagado
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Resumen Tab — simple ledger */}
        {tab === 'resumen' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Ingresos por Origen</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Tours y Expediciones</span><span className="font-bold text-white">${data.totalBookingRevenue.toLocaleString('es-CL')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Otros Ingresos</span><span className="font-bold text-white">${data.totalIncome.toLocaleString('es-CL')}</span></div>
                  <div className="flex justify-between text-sm border-t border-slate-800 pt-3"><span className="font-bold text-slate-200">Total Ingresos</span><span className="font-black text-green-400">${totalRevenue.toLocaleString('es-CL')}</span></div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-500" /> Egresos por Origen</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Gastos Operativos</span><span className="font-bold text-red-400">${totalExpenses.toLocaleString('es-CL')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Nómina (Sueldos)</span><span className="font-bold text-red-400">${totalPayroll.toLocaleString('es-CL')}</span></div>
                  <div className="flex justify-between text-sm border-t border-slate-800 pt-3"><span className="font-bold text-slate-200">Total Egresos</span><span className="font-black text-red-400">${totalCosts.toLocaleString('es-CL')}</span></div>
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-xl border-2 ${netResult >= 0 ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Resultado del Período</p>
                  <p className="text-xs text-slate-500 mt-1">Ingresos Totales — Egresos Totales</p>
                </div>
                <span className={`text-4xl font-black ${netResult >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${netResult.toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Registrar Gasto */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-950">
              <h2 className="text-xl font-semibold text-white">Registrar Egreso</h2>
              <p className="text-slate-400 text-sm mt-1">Arriendo, hostal, combustible, marketing, etc.</p>
            </div>
            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Fecha</label>
                  <input required type="date" name="expense_date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Categoría</label>
                  <select required name="category" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Descripción del Gasto</label>
                <input required name="description" type="text" placeholder="Ej: Arriendo bodega octubre, Hostal Cajón del Maipo" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Monto ($)</label>
                  <input required name="amount" type="number" min="1" placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Método de Pago</label>
                  <select name="payment_method" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                    <option>Transferencia</option>
                    <option>Efectivo</option>
                    <option>Tarjeta</option>
                    <option>Cheque</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Notas (opcional)</label>
                <input name="notes" type="text" placeholder="N° factura, proveedor, etc." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
                  {isSubmitting ? 'Guardando...' : 'Registrar Egreso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Liquidar Sueldo */}
      {showPayrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-950">
              <h2 className="text-xl font-semibold text-white">Liquidación de Sueldo</h2>
              <p className="text-slate-400 text-sm mt-1">Guías, administrativos y personal de operaciones.</p>
            </div>
            <form onSubmit={handlePayrollSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Nombre</label>
                  <input required name="staff_name" type="text" placeholder="Nombre Apellido" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Cargo</label>
                  <select name="role" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                    <option>Guía Senior</option>
                    <option>Guía Trainee</option>
                    <option>Administrativo</option>
                    <option>Operaciones</option>
                    <option>Freelance</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Período</label>
                  <input required name="period" type="text" placeholder="Ej: Octubre 2026" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Fecha de Pago</label>
                  <input required name="payment_date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Sueldo Base ($)</label>
                  <input required name="base_salary" type="number" min="0" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Bonos ($)</label>
                  <input name="bonuses" type="number" min="0" defaultValue={0} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Descuentos ($)</label>
                  <input name="deductions" type="number" min="0" defaultValue={0} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowPayrollModal(false)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
                  {isSubmitting ? 'Guardando...' : 'Crear Liquidación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
