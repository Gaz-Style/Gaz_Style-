'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
  User,
  Share2,
  RefreshCw,
  X
} from 'lucide-react';
import { SaleLedgerRecord } from '@/types/pos';
import { payRemainingBalanceAction, exportSalesToExcelAction } from './actions';

interface SalesClientProps {
  initialSales: SaleLedgerRecord[];
}

export default function SalesClient({ initialSales }: SalesClientProps) {
  const [sales, setSales] = useState<SaleLedgerRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('santiago_hiking_sales_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // merge with initialSales
            const ids = new Set(initialSales.map(s => s.id));
            const extra = parsed.filter((p: any) => !ids.has(p.id));
            return [...initialSales, ...extra];
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return initialSales;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [methodFilter, setMethodFilter] = useState<string>('todos');
  const [isExporting, setIsExporting] = useState(false);

  // Modal Pagar Saldo
  const [selectedSaleForPayment, setSelectedSaleForPayment] = useState<SaleLedgerRecord | null>(null);
  const [payingAmount, setPayingAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<string>('cash');
  const [isPaying, setIsPaying] = useState(false);

  // Modal Ver Detalle / Ticket
  const [selectedSaleForView, setSelectedSaleForView] = useState<SaleLedgerRecord | null>(null);

  // KPIs
  const totalSalesRevenue = useMemo(() => sales.reduce((sum, s) => sum + s.total_amount, 0), [sales]);
  const totalCollectedRevenue = useMemo(() => sales.reduce((sum, s) => sum + s.paid_amount, 0), [sales]);
  const totalPendingBalance = useMemo(() => sales.reduce((sum, s) => sum + s.balance, 0), [sales]);
  const totalPaxCount = useMemo(() => sales.reduce((sum, s) => sum + (s.pax_count || 1), 0), [sales]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchesSearch =
        searchQuery === '' ||
        s.internal_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.expedition_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customer_phone.includes(searchQuery);

      const matchesStatus = statusFilter === 'todos' || s.payment_status === statusFilter;
      const matchesMethod = methodFilter === 'todos' || s.payment_method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [sales, searchQuery, statusFilter, methodFilter]);

  // Handle Pay Balance
  const handleConfirmBalancePayment = async () => {
    if (!selectedSaleForPayment || payingAmount <= 0) return;
    setIsPaying(true);
    try {
      await payRemainingBalanceAction(selectedSaleForPayment.id, payingAmount, payMethod);

      // Actualizar localmente
      const updated = sales.map(s => {
        if (s.id === selectedSaleForPayment.id) {
          const newPaid = s.paid_amount + payingAmount;
          const newBal = Math.max(0, s.total_amount - newPaid);
          return {
            ...s,
            paid_amount: newPaid,
            balance: newBal,
            payment_status: newBal === 0 ? ('completed' as const) : ('partial' as const)
          };
        }
        return s;
      });

      setSales(updated);
      try {
        localStorage.setItem('santiago_hiking_sales_cache', JSON.stringify(updated));
      } catch (e) {}

      setSelectedSaleForPayment(null);
    } catch (e) {
      alert('Error al registrar el pago de saldo');
    } finally {
      setIsPaying(false);
    }
  };

  // Export to Excel
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const res = await exportSalesToExcelAction(sales);
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.base64}`;
      link.download = res.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert('Error al exportar la planilla');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Wallet className="w-3.5 h-3.5" /> Libro Mayor de Ingresos
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Planilla de <span className="font-bold text-emerald-400">Ventas & Cobros</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5">
              Control de pagos reales, abonos del 50%, saldos pendientes y trazabilidad de cordadas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              {isExporting ? 'Exportando...' : 'Descargar Excel'}
            </button>

            <Link
              href="/admin/pos"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
            >
              <Plus className="w-4 h-4" /> Nueva Venta / Agendar (POS)
            </Link>
          </div>
        </header>

        {/* FINANCIAL SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Ventas Brutas Totales
            </span>
            <div className="text-2xl md:text-3xl font-black text-white font-mono">
              ${totalSalesRevenue.toLocaleString('es-CL')}
            </div>
            <p className="text-xs text-slate-500 mt-1">Valor contractual de expediciones</p>
          </div>

          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Recaudado Real (Caja/Banco)
            </span>
            <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
              ${totalCollectedRevenue.toLocaleString('es-CL')}
            </div>
            <p className="text-xs text-slate-500 mt-1">Dinero efectivamente recibido</p>
          </div>

          <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-5 backdrop-blur">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Saldos por Cobrar
            </span>
            <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">
              ${totalPendingBalance.toLocaleString('es-CL')}
            </div>
            <p className="text-xs text-slate-500 mt-1">Abonos pendientes de liquidar</p>
          </div>

          <div className="bg-slate-900/80 border border-sky-500/20 rounded-2xl p-5 backdrop-blur">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
              Cupos Agendados
            </span>
            <div className="text-2xl md:text-3xl font-black text-sky-400 font-mono">
              {totalPaxCount} <span className="text-sm font-normal text-slate-400">pax</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Aventureros en cordadas</p>
          </div>
        </div>

        {/* FILTERS & SEARCH */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por ID, aventurero o cumbre..."
                className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 md:w-72"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="todos">Todos los Estados</option>
              <option value="completed">100% Pagado</option>
              <option value="partial">Abono 50% (Saldo Pendiente)</option>
              <option value="pending">Pendiente de Pago</option>
            </select>

            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="todos">Todos los Medios de Pago</option>
              <option value="card_pos">Tarjeta POS Físico</option>
              <option value="transfer">Transferencia Bancaria</option>
              <option value="cash">Efectivo en Caja</option>
              <option value="mixed">Pago Mixto</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {filteredSales.length} transacciones registradas
          </div>
        </div>

        {/* TABLA PRINCIPAL DE VENTAS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <th className="p-3.5">ID Venta</th>
                  <th className="p-3.5">Fecha</th>
                  <th className="p-3.5 min-w-[180px]">Aventurero</th>
                  <th className="p-3.5 min-w-[200px]">Expedición</th>
                  <th className="p-3.5">Fecha Ascenso</th>
                  <th className="p-3.5 text-right">Total ($)</th>
                  <th className="p-3.5 text-right">Pagado ($)</th>
                  <th className="p-3.5 text-right">Saldo ($)</th>
                  <th className="p-3.5 text-center">Estado</th>
                  <th className="p-3.5 text-center">Medio</th>
                  <th className="p-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-10 text-center text-slate-500">
                      <div className="space-y-3">
                        <p className="text-sm">No hay ventas registradas en la planilla aún.</p>
                        <Link
                          href="/admin/pos"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow"
                        >
                          <Plus className="w-4 h-4" /> Registrar Primera Venta en el POS
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map(sale => {
                    const isFullyPaid = sale.balance === 0;
                    const isPartial = sale.balance > 0 && sale.paid_amount > 0;

                    return (
                      <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-emerald-400">
                          {sale.internal_id}
                        </td>
                        <td className="p-3.5 font-mono text-slate-400">
                          {sale.created_at.slice(0, 10)}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-white">{sale.customer_name}</div>
                          <div className="text-[11px] text-slate-400">{sale.customer_phone}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-slate-200">{sale.expedition_title}</div>
                          <div className="text-[10px] text-slate-500">{sale.pax_count} cupo(s)</div>
                        </td>
                        <td className="p-3.5 font-mono text-sky-400 font-semibold">
                          {sale.scheduled_date}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-white">
                          ${sale.total_amount.toLocaleString('es-CL')}
                        </td>
                        <td className="p-3.5 text-right font-mono text-emerald-400 font-semibold">
                          ${sale.paid_amount.toLocaleString('es-CL')}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold">
                          {sale.balance > 0 ? (
                            <span className="text-amber-400">${sale.balance.toLocaleString('es-CL')}</span>
                          ) : (
                            <span className="text-slate-600">$0</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isFullyPaid
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : isPartial
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {isFullyPaid && '🟢 100% Pagado'}
                            {isPartial && '🟡 Abono 50%'}
                            {!isFullyPaid && !isPartial && '🔴 Pendiente'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center text-[11px] text-slate-300 font-medium capitalize">
                          {sale.payment_method.replace('_', ' ')}
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {sale.balance > 0 && (
                              <button
                                onClick={() => {
                                  setSelectedSaleForPayment(sale);
                                  setPayingAmount(sale.balance);
                                }}
                                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition-all"
                                title="Registrar pago del saldo restante"
                              >
                                Pagar Saldo
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedSaleForView(sale)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                              title="Ver comprobante de cordada"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL: PAGAR SALDO PENDIENTE */}
      {selectedSaleForPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" /> Liquidar Saldo Pendiente
              </h3>
              <button
                onClick={() => setSelectedSaleForPayment(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white">{selectedSaleForPayment.customer_name}</div>
                <div className="text-slate-400">{selectedSaleForPayment.expedition_title}</div>
                <div className="text-amber-400 font-mono font-bold pt-1">
                  Saldo por Cobrar: ${selectedSaleForPayment.balance.toLocaleString('es-CL')} CLP
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Monto a Abonar / Pagar</label>
                <input
                  type="number"
                  value={payingAmount}
                  onChange={e => setPayingAmount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Medio de Pago</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="cash">💵 Efectivo en Terreno</option>
                  <option value="transfer">📲 Transferencia Bancaria</option>
                  <option value="card_pos">💳 Tarjeta POS Físico</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedSaleForPayment(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmBalancePayment}
                disabled={isPaying}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                {isPaying ? 'Guardando...' : 'Confirmar Pago de Saldo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VER TICKET / DETALLE */}
      {selectedSaleForView && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  Santiago Hiking — Ticket
                </span>
                <h3 className="text-base font-black text-white">{selectedSaleForView.internal_id}</h3>
              </div>
              <button
                onClick={() => setSelectedSaleForView(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Aventurero:</span>
                <span className="font-bold text-white">{selectedSaleForView.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Celular:</span>
                <span className="font-mono text-slate-300">{selectedSaleForView.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expedición:</span>
                <span className="font-bold text-white text-right max-w-[200px] truncate">
                  {selectedSaleForView.expedition_title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fecha Agendada:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {selectedSaleForView.scheduled_date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Medio de Pago:</span>
                <span className="capitalize text-slate-300">
                  {selectedSaleForView.payment_method.replace('_', ' ')}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-white font-bold">
                  <span>Total Contrato:</span>
                  <span className="font-mono">${selectedSaleForView.total_amount.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Monto Pagado:</span>
                  <span className="font-mono">${selectedSaleForView.paid_amount.toLocaleString('es-CL')}</span>
                </div>
                {selectedSaleForView.balance > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>Saldo por Cobrar:</span>
                    <span className="font-mono">${selectedSaleForView.balance.toLocaleString('es-CL')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedSaleForView(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
