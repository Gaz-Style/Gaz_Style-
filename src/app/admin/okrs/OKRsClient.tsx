'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Target,
  TrendingUp,
  BarChart3,
  Calendar,
  Download,
  Save,
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  Compass,
  DollarSign,
  Users,
  Star,
  Globe,
  Flame,
  ChevronRight,
  Filter,
  Search,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  Settings2,
  Trash2,
  Calculator,
  RefreshCw,
  Sparkles,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyResult, CalculatedKR, OKRStatus, MetricType } from '@/types/okrs';
import {
  calculateKR,
  calculateObjectivesSummary,
  formatMetricValue,
  INITIAL_SANTIAGO_HIKING_KRS,
  DEFAULT_MONTHS
} from '@/lib/okrs-data';
import { saveOKRs, generateOKRExcel, syncRealDataFromDatabase } from './actions';

interface OKRsClientProps {
  initialData: KeyResult[];
}

export default function OKRsClient({ initialData }: OKRsClientProps) {
  const [krs, setKrs] = useState<KeyResult[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('santiago_hiking_okrs_cache_v2');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Failed to load local OKRs cache', e);
      }
    }
    return initialData.length > 0 ? initialData : INITIAL_SANTIAGO_HIKING_KRS;
  });

  const [activeTab, setActiveTab] = useState<'resumen' | 'seguimiento' | 'planificacion' | 'metodologia'>('seguimiento');
  const [selectedObjectiveFilter, setSelectedObjectiveFilter] = useState<string>('todos');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  // Month names state (editable by the user)
  const currentMonths = useMemo(() => {
    return krs[0]?.monthNames || DEFAULT_MONTHS;
  }, [krs]);

  // Calculator params
  const [calcParams, setCalcParams] = useState({
    avgTicketClp: 28000,
    hikersPerOuting: 8,
    outingsPerMonth: [2, 3, 4, 5, 6], // salidas por mes proyectadas
    usdTicket: 65,
    usdOutings: [1, 2, 3, 4, 5]
  });

  // New KR form state
  const [newKR, setNewKR] = useState({
    objectiveId: 'O1',
    objectiveTitle: 'Escalar ventas y cupos de cordada en Santiago Hiking',
    krTitle: '',
    metricName: '',
    metricType: 'flujo' as MetricType,
    unit: '$',
    baseline: 0,
    targets: [100, 200, 300, 400, 500],
    notes: ''
  });

  // Calculate live KRs and summaries
  const calculatedKRs = useMemo(() => krs.map(calculateKR), [krs]);
  const summaries = useMemo(() => calculateObjectivesSummary(krs), [krs]);

  // Global metrics
  const totalKRs = calculatedKRs.length;
  const fulfilledCount = calculatedKRs.filter(k => k.status === 'Cumplido').length;
  const inProgressCount = calculatedKRs.filter(k => k.status === 'En curso').length;
  const delayedCount = calculatedKRs.filter(k => k.status === 'Atrasado').length;
  const noDataCount = calculatedKRs.filter(k => k.status === 'Sin datos').length;

  const validKRs = calculatedKRs.filter(k => k.status !== 'Sin datos');
  const globalCompletionRate = validKRs.length > 0
    ? validKRs.reduce((acc, k) => acc + k.completionRate, 0) / validKRs.length
    : 0;

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('santiago_hiking_okrs_cache_v2', JSON.stringify(krs));
    } catch (e) {
      console.warn('Error saving to local storage', e);
    }
  }, [krs]);

  // Handle cell edits
  const handleActualChange = (krId: string, monthIdx: number, valueStr: string) => {
    setKrs(prev =>
      prev.map(item => {
        if (item.id !== krId) return item;
        const newActuals = [...item.actuals];
        if (valueStr.trim() === '') {
          newActuals[monthIdx] = null;
        } else {
          const num = parseFloat(valueStr.replace(/\./g, '').replace(',', '.'));
          newActuals[monthIdx] = isNaN(num) ? null : num;
        }
        return { ...item, actuals: newActuals };
      })
    );
    setSaveStatus('Modificado sin guardar');
  };

  const handleTargetChange = (krId: string, monthIdx: number, valueStr: string) => {
    setKrs(prev =>
      prev.map(item => {
        if (item.id !== krId) return item;
        const newTargets = [...item.targets];
        const num = parseFloat(valueStr.replace(/\./g, '').replace(',', '.'));
        newTargets[monthIdx] = isNaN(num) ? 0 : num;
        return { ...item, targets: newTargets };
      })
    );
    setSaveStatus('Modificado sin guardar');
  };

  const handleBaselineChange = (krId: string, valueStr: string) => {
    setKrs(prev =>
      prev.map(item => {
        if (item.id !== krId) return item;
        const num = parseFloat(valueStr.replace(/\./g, '').replace(',', '.'));
        return { ...item, baseline: isNaN(num) ? 0 : num };
      })
    );
    setSaveStatus('Modificado sin guardar');
  };

  const handleMonthNameChange = (monthIdx: number, newName: string) => {
    setKrs(prev =>
      prev.map(item => {
        const updated = [...item.monthNames];
        updated[monthIdx] = newName.trim() || `Mes ${monthIdx + 1}`;
        return { ...item, monthNames: updated };
      })
    );
    setSaveStatus('Meses actualizados');
  };

  // Reset all actuals to start strictly from zero
  const handleStartFromZero = () => {
    if (confirm('¿Limpiar todos los datos reales para iniciar el proyecto estrictamente desde CERO? Las metas planificadas se conservarán.')) {
      setKrs(prev =>
        prev.map(kr => ({
          ...kr,
          actuals: [null, null, null, null, null]
        }))
      );
      setSaveStatus('Proyecto iniciado desde CERO');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Apply real calculator targets
  const handleApplyCalculator = () => {
    const { avgTicketClp, hikersPerOuting, outingsPerMonth, usdTicket, usdOutings } = calcParams;

    // Calcular ventas y cupos por mes
    const calculatedPaxTargets = outingsPerMonth.map(outings => outings * hikersPerOuting);
    const calculatedSalesClp = calculatedPaxTargets.map(pax => pax * avgTicketClp);
    const calculatedSalesUsd = usdOutings.map(outings => outings * usdTicket * 2); // 2 pax promedio en salidas internacionales

    setKrs(prev =>
      prev.map(kr => {
        if (kr.id === 'kr-1-1') {
          return { ...kr, targets: calculatedSalesClp };
        }
        if (kr.id === 'kr-1-2') {
          return { ...kr, targets: calculatedPaxTargets };
        }
        if (kr.id === 'kr-4-2') {
          return { ...kr, targets: calculatedSalesUsd };
        }
        return kr;
      })
    );

    setShowCalculatorModal(false);
    setSaveStatus('Metas calculadas según modelo real');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // Sync real database bookings
  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    try {
      const res = await syncRealDataFromDatabase();
      alert(`Resultado de sincronización con Supabase:\n\n${res.message}`);
      if (res.bookingsCount > 0) {
        // Asignar al mes 1 si no hay datos aún
        setKrs(prev =>
          prev.map(kr => {
            if (kr.id === 'kr-1-1' && kr.actuals[0] === null) {
              const updated = [...kr.actuals];
              updated[0] = res.totalRevenueClp;
              return { ...kr, actuals: updated };
            }
            if (kr.id === 'kr-1-2' && kr.actuals[0] === null) {
              const updated = [...kr.actuals];
              updated[0] = res.bookingsCount;
              return { ...kr, actuals: updated };
            }
            return kr;
          })
        );
      }
    } catch (e) {
      alert('Error al consultar reservas en base de datos');
    } finally {
      setIsSyncing(false);
    }
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('Guardando...');
    try {
      const res = await saveOKRs(krs);
      setSaveStatus(res.message);
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err) {
      setSaveStatus('Guardado en caché local.');
      setTimeout(() => setSaveStatus(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('¿Restablecer todos los datos a la plantilla limpia oficial de Santiago Hiking?')) {
      setKrs(INITIAL_SANTIAGO_HIKING_KRS);
      localStorage.removeItem('santiago_hiking_okrs_cache_v2');
      setSaveStatus('Valores restablecidos');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Export to Excel
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const res = await generateOKRExcel(krs);
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.base64}`;
      link.download = res.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert('Error al generar el archivo Excel');
    } finally {
      setIsExporting(false);
    }
  };

  // Add new KR
  const handleAddKR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKR.krTitle || !newKR.metricName) return;

    const created: KeyResult = {
      id: `kr-${Date.now()}`,
      objectiveId: newKR.objectiveId,
      objectiveTitle: newKR.objectiveTitle,
      krTitle: newKR.krTitle,
      metricName: newKR.metricName,
      metricType: newKR.metricType,
      unit: newKR.unit,
      baseline: Number(newKR.baseline || 0),
      monthNames: currentMonths,
      targets: newKR.targets,
      actuals: [null, null, null, null, null],
      notes: newKR.notes,
      orderIndex: krs.length + 1
    };

    setKrs(prev => [...prev, created]);
    setShowAddModal(false);
    setSaveStatus('Nuevo KR agregado');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Delete KR
  const handleDeleteKR = (krId: string) => {
    if (confirm('¿Eliminar este Resultado Clave (KR)?')) {
      setKrs(prev => prev.filter(k => k.id !== krId));
      setSaveStatus('KR eliminado');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Filtered KRs
  const filteredKRs = useMemo(() => {
    return calculatedKRs.filter(kr => {
      const matchesObj = selectedObjectiveFilter === 'todos' || kr.objectiveId === selectedObjectiveFilter;
      const matchesStatus = selectedStatusFilter === 'todos' || kr.status === selectedStatusFilter;
      const matchesSearch = searchQuery === '' ||
        kr.krTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kr.metricName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kr.objectiveTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesObj && matchesStatus && matchesSearch;
    });
  }, [calculatedKRs, selectedObjectiveFilter, selectedStatusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* TOP BAR / HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-2">
              <Compass className="w-3.5 h-3.5" /> Metodología OKR — Proyecto Santiago Hiking
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">
              Planificación & <span className="font-bold text-emerald-400">Metas Reales</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1">
              Plantilla 100% editable: calibra los baselines, define las metas mensuales y registra avances reales desde cero.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {saveStatus && (
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg animate-pulse">
                {saveStatus}
              </span>
            )}

            <button
              onClick={() => setShowCalculatorModal(true)}
              className="px-3 py-2 rounded-lg bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-800/60 text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Calcular metas de ventas y cupos según salidas planificadas"
            >
              <Calculator className="w-4 h-4 text-sky-400" />
              Calculadora de Metas
            </button>

            <button
              onClick={handleSyncDatabase}
              disabled={isSyncing}
              className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all"
              title="Verificar ventas reales en Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isSyncing ? 'animate-spin' : ''}`} />
              Sincronizar BD
            </button>

            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Descargar planilla compatible con Microsoft Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              {isExporting ? 'Generando...' : 'Exportar Excel'}
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Guardando...' : 'Guardar Todo'}
            </button>

            <button
              onClick={handleStartFromZero}
              className="px-3 py-2 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Limpiar todos los datos reales para empezar desde cero"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpiar Reales (Desde Cero)
            </button>
          </div>
        </header>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('seguimiento')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'seguimiento'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Matriz de Seguimiento (Reales & Metas)
            <span className="text-[11px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full font-mono">
              {totalKRs}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('planificacion')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'planificacion'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Calibración de Metas & Meses
          </button>

          <button
            onClick={() => setActiveTab('resumen')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'resumen'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Scorecard Ejecutivo
          </button>

          <button
            onClick={() => setActiveTab('metodologia')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'metodologia'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Metodología & Guía Real
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: MATRIZ DE SEGUIMIENTO (SEGUIMIENTO MENSUAL) */}
        {/* ========================================================================= */}
        {activeTab === 'seguimiento' && (
          <div className="space-y-4">
            {/* INFORMATIVE BANNER FOR PROJECT STARTING FROM ZERO */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Proyecto iniciando desde CERO</h4>
                  <p className="text-slate-400">
                    Las columnas <strong className="text-emerald-400">Real</strong> están limpias para registrar cada mes a medida que ocurran las salidas. Las columnas <strong className="text-sky-400">Meta</strong> y <strong className="text-slate-300">Baseline</strong> son totalmente editables.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowCalculatorModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Calculator className="w-3.5 h-3.5" /> Ajustar Metas con Calculadora
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar KR
                </button>
              </div>
            </div>

            {/* FILTERS & SEARCH BAR */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 backdrop-blur">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar indicador o métrica..."
                    className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 md:w-64"
                  />
                </div>

                {/* Filter by Objective */}
                <select
                  value={selectedObjectiveFilter}
                  onChange={e => setSelectedObjectiveFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="todos">Todos los Objetivos</option>
                  <option value="O1">O1: Tracción & Ventas CLP</option>
                  <option value="O2">O2: Comunidad & Alcance</option>
                  <option value="O3">O3: Excelencia & Reputación</option>
                  <option value="O4">O4: Extranjeros en USD</option>
                </select>

                {/* Filter by Status */}
                <select
                  value={selectedStatusFilter}
                  onChange={e => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="Cumplido">🟢 Cumplidos</option>
                  <option value="En curso">🟡 En curso</option>
                  <option value="Atrasado">🔴 Atrasados</option>
                  <option value="Sin datos">⚪ Sin datos (Inicio)</option>
                </select>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                {validKRs.length === 0 ? (
                  <span className="text-amber-400 font-semibold">Esperando primeros registros del mes</span>
                ) : (
                  <span>
                    Cumplimiento promedio activo: <strong className="text-white">{(globalCompletionRate * 100).toFixed(1)}%</strong>
                  </span>
                )}
              </div>
            </div>

            {/* SPREADSHEET TABLE */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-950/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                      <th className="p-3.5 sticky left-0 bg-slate-950 z-20 min-w-[240px]">
                        Resultado Clave (KR)
                      </th>
                      <th className="p-3.5 min-w-[125px]">Métrica / Tipo</th>
                      <th className="p-3.5 text-right min-w-[95px] text-amber-300 bg-amber-950/20">
                        Baseline
                      </th>
                      {currentMonths.map(m => (
                        <th key={`head-meta-${m}`} className="p-3.5 text-right min-w-[95px] text-sky-400 bg-sky-950/20">
                          Meta {m}
                        </th>
                      ))}
                      {currentMonths.map(m => (
                        <th key={`head-real-${m}`} className="p-3.5 text-right min-w-[95px] text-emerald-400 bg-emerald-950/20">
                          Real {m}
                        </th>
                      ))}
                      <th className="p-3.5 text-right min-w-[100px] text-slate-200 bg-slate-950/60">
                        Avance
                      </th>
                      <th className="p-3.5 text-right min-w-[100px] text-slate-400 bg-slate-950/60">
                        Meta Mes
                      </th>
                      <th className="p-3.5 text-right min-w-[85px] text-slate-200 bg-slate-950/60">
                        % Cumpl.
                      </th>
                      <th className="p-3.5 text-center min-w-[110px] bg-slate-950/60">Estado</th>
                      <th className="p-3.5 text-center min-w-[50px] bg-slate-950/60"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredKRs.map(kr => {
                      const isComplete = kr.status === 'Cumplido';
                      const isInProgress = kr.status === 'En curso';
                      const isDelayed = kr.status === 'Atrasado';

                      return (
                        <tr
                          key={kr.id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* KR Title & Objective */}
                          <td className="p-3.5 sticky left-0 bg-slate-900 group-hover:bg-slate-850 z-10 border-r border-slate-800/60">
                            <span className="inline-block text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40 mb-1">
                              {kr.objectiveId}
                            </span>
                            <div className="font-semibold text-slate-100 leading-tight">
                              {kr.krTitle}
                            </div>
                            {kr.notes && (
                              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                                {kr.notes}
                              </div>
                            )}
                          </td>

                          {/* Metric Name & Type */}
                          <td className="p-3.5">
                            <div className="font-medium text-slate-200">{kr.metricName}</div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                              {kr.metricType === 'flujo' ? '⚡ Mensual' : '📈 Acumulado'}
                            </span>
                          </td>

                          {/* Baseline — EDITABLE INLINE */}
                          <td className="p-2 text-right bg-amber-950/10 font-mono text-amber-300">
                            <input
                              type="text"
                              defaultValue={kr.unit === '%' ? (kr.baseline * 100).toFixed(0) : kr.baseline}
                              onBlur={e => {
                                const val = kr.unit === '%'
                                  ? parseFloat(e.target.value) / 100
                                  : parseFloat(e.target.value);
                                handleBaselineChange(kr.id, isNaN(val) ? '0' : String(val));
                              }}
                              className="w-full bg-transparent text-right py-1 px-1 rounded focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-mono font-semibold"
                              title="Haz clic para editar la línea base (Baseline)"
                            />
                          </td>

                          {/* Metas (Mes 1 a Mes 5) — EDITABLE INLINE */}
                          {kr.targets.map((tgt, mIdx) => (
                            <td
                              key={`target-${kr.id}-${mIdx}`}
                              className="p-2 text-right bg-sky-950/10 font-mono text-sky-300"
                            >
                              <input
                                type="text"
                                defaultValue={kr.unit === '%' ? (tgt * 100).toFixed(0) : tgt}
                                onBlur={e => {
                                  const val = kr.unit === '%'
                                    ? parseFloat(e.target.value) / 100
                                    : parseFloat(e.target.value);
                                  handleTargetChange(kr.id, mIdx, isNaN(val) ? '0' : String(val));
                                }}
                                className="w-full bg-transparent text-right py-1 px-1 rounded focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs font-mono"
                                title={`Meta para ${currentMonths[mIdx]}`}
                              />
                            </td>
                          ))}

                          {/* Reales (Mes 1 a Mes 5) — EDITABLE INLINE */}
                          {kr.actuals.map((act, mIdx) => (
                            <td
                              key={`actual-${kr.id}-${mIdx}`}
                              className="p-2 text-right bg-emerald-950/10 font-mono"
                            >
                              <input
                                type="text"
                                defaultValue={
                                  act === null || act === undefined
                                    ? ''
                                    : kr.unit === '%'
                                    ? (act * 100).toFixed(1)
                                    : act
                                }
                                placeholder="—"
                                onBlur={e => {
                                  const raw = e.target.value;
                                  if (raw.trim() === '') {
                                    handleActualChange(kr.id, mIdx, '');
                                  } else {
                                    const val = kr.unit === '%'
                                      ? parseFloat(raw) / 100
                                      : parseFloat(raw);
                                    handleActualChange(kr.id, mIdx, isNaN(val) ? '' : String(val));
                                  }
                                }}
                                className={`w-full text-right py-1 px-1 rounded focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs font-mono transition-all ${
                                  act !== null ? 'text-emerald-300 font-semibold' : 'text-slate-600'
                                }`}
                                title={`Real para ${currentMonths[mIdx]} (dejar vacío si el mes aún no se ejecuta)`}
                              />
                            </td>
                          ))}

                          {/* Avance Actual */}
                          <td className="p-3.5 text-right font-mono font-bold text-white bg-slate-950/40">
                            {formatMetricValue(kr.currentActual, kr.unit)}
                          </td>

                          {/* Meta al Mes Actual */}
                          <td className="p-3.5 text-right font-mono text-slate-400 bg-slate-950/40">
                            {formatMetricValue(kr.currentTarget, kr.unit)}
                          </td>

                          {/* % Cumplimiento */}
                          <td className="p-3.5 text-right font-mono font-bold bg-slate-950/40">
                            {kr.status === 'Sin datos' ? (
                              <span className="text-slate-600">—</span>
                            ) : (
                              <span
                                className={
                                  isComplete
                                    ? 'text-emerald-400'
                                    : isInProgress
                                    ? 'text-amber-400'
                                    : 'text-rose-400'
                                }
                              >
                                {(kr.completionRate * 100).toFixed(1)}%
                              </span>
                            )}
                          </td>

                          {/* Estado Pill */}
                          <td className="p-3.5 text-center bg-slate-950/40">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                isComplete
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : isInProgress
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : isDelayed
                                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {isComplete && '🟢 Cumplido'}
                              {isInProgress && '🟡 En curso'}
                              {isDelayed && '🔴 Atrasado'}
                              {kr.status === 'Sin datos' && '⚪ Sin datos'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-2 text-center bg-slate-950/40">
                            <button
                              onClick={() => handleDeleteKR(kr.id)}
                              className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                              title="Eliminar este KR"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-xs text-slate-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 px-2">
              <p>
                💡 <strong>Flexibilidad Total:</strong> Puedes hacer clic sobre cualquier celda de <strong>Baseline</strong> o <strong>Meta</strong> para ajustarla a tu plan comercial. Las celdas <strong>Real</strong> permanecen vacías hasta que se complete cada mes.
              </p>
              <p className="font-mono text-[11px]">
                {filteredKRs.length} KRs activos en la matriz
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CALIBRACIÓN DE METAS & MESES (MODO PLANIFICACIÓN) */}
        {/* ========================================================================= */}
        {activeTab === 'planificacion' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8 backdrop-blur">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-950/40 px-3 py-1 rounded-full border border-sky-800/40 mb-2">
                  <Sliders className="w-3.5 h-3.5" /> Parámetros del Proyecto
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Nombres de Meses y Planificación de Metas
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Personaliza los 5 periodos del ciclo de lanzamiento (por ejemplo: Noviembre, Diciembre, Enero, Febrero, Marzo) o déjalos como Mes 1 a 5.
                </p>
              </div>

              <button
                onClick={() => setShowCalculatorModal(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs md:text-sm font-semibold rounded-lg flex items-center gap-2 shadow-lg shadow-sky-950/40"
              >
                <Calculator className="w-4 h-4" /> Asistente de Proyección Comercial
              </button>
            </div>

            {/* Custom Month Names Form */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                1. Nombres de las Columnas de Meses
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {currentMonths.map((mName, idx) => (
                  <div key={`month-input-${idx}`} className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">
                      Periodo {idx + 1}
                    </label>
                    <input
                      type="text"
                      defaultValue={mName}
                      onBlur={e => handleMonthNameChange(idx, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-sky-500 font-semibold"
                      placeholder={`Mes ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Target Tuning Table */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                2. Calibración Rápida de Metas por Indicador
              </h3>
              <div className="space-y-3">
                {krs.map(kr => (
                  <div
                    key={`tune-${kr.id}`}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="md:w-1/3">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                        {kr.objectiveId}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-100 mt-1">{kr.krTitle}</h4>
                      <p className="text-xs text-slate-400">{kr.metricName} ({kr.unit})</p>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full md:w-2/3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-amber-400 block font-mono">Baseline</label>
                        <input
                          type="text"
                          defaultValue={kr.unit === '%' ? (kr.baseline * 100).toFixed(0) : kr.baseline}
                          onBlur={e => {
                            const val = kr.unit === '%' ? parseFloat(e.target.value) / 100 : parseFloat(e.target.value);
                            handleBaselineChange(kr.id, isNaN(val) ? '0' : String(val));
                          }}
                          className="w-full bg-slate-900 border border-amber-500/30 rounded p-1.5 text-right text-xs font-mono text-amber-300"
                        />
                      </div>

                      {kr.targets.map((tgt, mIdx) => (
                        <div key={`tune-target-${kr.id}-${mIdx}`} className="space-y-1">
                          <label className="text-[10px] text-sky-400 block font-mono">
                            {currentMonths[mIdx]}
                          </label>
                          <input
                            type="text"
                            defaultValue={kr.unit === '%' ? (tgt * 100).toFixed(0) : tgt}
                            onBlur={e => {
                              const val = kr.unit === '%' ? parseFloat(e.target.value) / 100 : parseFloat(e.target.value);
                              handleTargetChange(kr.id, mIdx, isNaN(val) ? '0' : String(val));
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-right text-xs font-mono text-sky-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RESUMEN EJECUTIVO (SCORECARD) */}
        {/* ========================================================================= */}
        {activeTab === 'resumen' && (
          <div className="space-y-6">
            {/* GLOBAL SCORECARD */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Avance Global Ponderado
                  </span>
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-extrabold text-white">
                    {validKRs.length === 0 ? '0.0%' : `${(globalCompletionRate * 100).toFixed(1)}%`}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({validKRs.length} de {totalKRs} con datos)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      globalCompletionRate >= 1.0
                        ? 'bg-emerald-400'
                        : globalCompletionRate >= 0.7
                        ? 'bg-amber-400'
                        : 'bg-emerald-600/40'
                    }`}
                    style={{ width: `${Math.min(globalCompletionRate * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    🟢 Cumplidos (&ge; 100%)
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{fulfilledCount}</div>
                <p className="text-xs text-slate-400 mt-1">Superando o igualando meta</p>
              </div>

              <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-5 backdrop-blur">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    🟡 En Curso (70% – 99%)
                  </span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{inProgressCount}</div>
                <p className="text-xs text-slate-400 mt-1">En ritmo de cumplimiento</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-5 backdrop-blur">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    ⚪ Sin Datos (Inicio)
                  </span>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{noDataCount}</div>
                <p className="text-xs text-slate-400 mt-1">Meses por ejecutar</p>
              </div>
            </div>

            {/* OBJECTIVES DETAILED CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {summaries.map(obj => {
                const badgeColor =
                  obj.status === 'Cumplido'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : obj.status === 'En curso'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : obj.status === 'Atrasado'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700';

                return (
                  <div
                    key={obj.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                            {obj.id}
                          </span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badgeColor}`}>
                            {obj.status === 'Cumplido' && '🟢 '}
                            {obj.status === 'En curso' && '🟡 '}
                            {obj.status === 'Atrasado' && '🔴 '}
                            {obj.status === 'Sin datos' && '⚪ '}
                            {obj.status}
                          </span>
                        </div>
                        <span className="text-lg font-black text-white font-mono">
                          {obj.status === 'Sin datos' ? '0%' : `${(obj.averageCompletion * 100).toFixed(0)}%`}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-slate-100 mt-3 leading-snug">
                        {obj.title}
                      </h3>

                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            obj.averageCompletion >= 1.0
                              ? 'bg-emerald-400'
                              : obj.averageCompletion >= 0.7
                              ? 'bg-amber-400'
                              : 'bg-slate-700'
                          }`}
                          style={{ width: `${Math.min(obj.averageCompletion * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      {obj.krs.map(kr => (
                        <div
                          key={kr.id}
                          className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-slate-950/60 border border-slate-800/60"
                        >
                          <div className="flex-1 pr-3 truncate">
                            <span className="text-slate-300 font-medium">{kr.krTitle}</span>
                            <span className="text-slate-500 block text-[11px] truncate">
                              Meta Mes: {formatMetricValue(kr.currentTarget, kr.unit)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-slate-300 font-mono font-medium">
                              Real: {formatMetricValue(kr.currentActual, kr.unit)}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                kr.status === 'Cumplido'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : kr.status === 'En curso'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : kr.status === 'Atrasado'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {kr.status === 'Sin datos' ? '0%' : `${(kr.completionRate * 100).toFixed(0)}%`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedObjectiveFilter(obj.id);
                          setActiveTab('seguimiento');
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        Ver y registrar en matriz <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: METODOLOGÍA & GUÍA REAL */}
        {/* ========================================================================= */}
        {activeTab === 'metodologia' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8 backdrop-blur">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/40">
                <Compass className="w-3.5 h-3.5" /> Manual de Operación y Realidad del Negocio
              </div>
              <h2 className="text-2xl font-bold text-white">
                Cómo Calibrar y Conectar los OKRs con la Realidad de Santiago Hiking
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Este modelo está diseñado para acompañar el nacimiento y despegue del negocio. Los baselines parten en la realidad actual (0 ventas iniciales, seguidores existentes en redes y cero reseñas aún).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-300">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  🏔️ La Unidad Económica de la Cordada
                </h4>
                <p>
                  Cada salida a la cordillera (ej. Cerro Manquehuito Sunset o Pochoco) se opera con <strong>8 a 10 aventureros</strong> con un ticket promedio de <strong>$28.000 CLP</strong>.
                </p>
                <p className="text-slate-400">
                  • 1 salida grupal llena = ~$224.000 CLP brutos.<br />
                  • 2 salidas en Mes 1 = ~$450.000 CLP.<br />
                  • 4 salidas en Mes 3 (incluyendo 1 de alta montaña a $65k) = ~$950.000 CLP.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-sky-400 flex items-center gap-1.5">
                  💵 El Mercado Internacional en USD
                </h4>
                <p>
                  Vía Airbnb Experiences y Viator, los turistas hospedados en Santiago pagan tarifas de <strong>USD $45 a $85</strong> por experiencias guiadas al atardecer y cumbres panorámicas.
                </p>
                <p className="text-slate-400">
                  • 4 viajeros en Mes 1 = USD $200 a $260.<br />
                  • 15 viajeros en Mes 3 = USD $1.000.<br />
                  • 35 viajeros en Mes 5 = USD $2.800 en moneda dura.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 space-y-2">
              <h4 className="text-sm font-bold text-emerald-400">
                🔄 La Rutina Mensual de Medición (Cadencia)
              </h4>
              <p>
                El último domingo de cada mes, ingresa al panel en <strong>/admin/okrs</strong> y digita los valores reales del mes cerrado. Si conectas tus ventas a través de MercadoPago o Webpay en la web, puedes usar el botón <strong>"Sincronizar BD"</strong> para cargar los cupos y la facturación automáticamente.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL: CALCULADORA DE METAS SEGÚN MODELO REAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCalculatorModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Calculadora de Metas Comerciales</h3>
                    <p className="text-xs text-slate-400">Proyecta metas basadas en salidas y tamaño de cordadas</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCalculatorModal(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Precio Promedio por Cupo (CLP)
                    </label>
                    <input
                      type="number"
                      value={calcParams.avgTicketClp}
                      onChange={e => setCalcParams({ ...calcParams, avgTicketClp: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Aventureros por Cordada (Pax)
                    </label>
                    <input
                      type="number"
                      value={calcParams.hikersPerOuting}
                      onChange={e => setCalcParams({ ...calcParams, hikersPerOuting: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-400 font-semibold">
                    Número de Salidas / Cordadas por Periodo
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {calcParams.outingsPerMonth.map((outings, idx) => (
                      <div key={`outings-${idx}`} className="text-center space-y-1">
                        <span className="text-[10px] text-slate-500 block font-mono">
                          {currentMonths[idx]}
                        </span>
                        <input
                          type="number"
                          value={outings}
                          onChange={e => {
                            const updated = [...calcParams.outingsPerMonth];
                            updated[idx] = Number(e.target.value) || 0;
                            setCalcParams({ ...calcParams, outingsPerMonth: updated });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-center text-sky-400 font-bold font-mono text-xs focus:outline-none focus:border-sky-500"
                        />
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {outings * calcParams.hikersPerOuting} cupos
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-slate-300">
                  <div className="font-semibold text-white">Proyección de Ventas Calculada:</div>
                  <div className="grid grid-cols-5 gap-2 text-[11px] font-mono text-emerald-400 pt-1">
                    {calcParams.outingsPerMonth.map((outings, idx) => (
                      <div key={`res-sales-${idx}`} className="truncate">
                        ${((outings * calcParams.hikersPerOuting * calcParams.avgTicketClp) / 1000).toFixed(0)}k
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCalculatorModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyCalculator}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-sky-950/40"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Aplicar a Metas de Ventas y Cupos
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: AGREGAR NUEVO KR */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" /> Nuevo Resultado Clave (KR)
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddKR} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Objetivo Asociado</label>
                  <select
                    value={newKR.objectiveId}
                    onChange={e => {
                      const sel = summaries.find(s => s.id === e.target.value);
                      setNewKR({
                        ...newKR,
                        objectiveId: e.target.value,
                        objectiveTitle: sel?.title || 'Objetivo'
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="O1">O1: Escalar ventas y cupos de cordada</option>
                    <option value="O2">O2: Aumentar alcance, comunidad y tráfico ("Do Wild Things")</option>
                    <option value="O3">O3: Consolidar reputación 5 estrellas y retención</option>
                    <option value="O4">O4: Internacionalización & Captación de Turistas (USD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Título del KR</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Salidas privadas para empresas o grupos cerrados"
                    value={newKR.krTitle}
                    onChange={e => setNewKR({ ...newKR, krTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Nombre de la Métrica</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Salidas privadas (#)"
                      value={newKR.metricName}
                      onChange={e => setNewKR({ ...newKR, metricName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Unidad</label>
                    <select
                      value={newKR.unit}
                      onChange={e => setNewKR({ ...newKR, unit: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="#">Número (#)</option>
                      <option value="$">Pesos Chilenos ($ CLP)</option>
                      <option value="USD $">Dólares (USD $)</option>
                      <option value="%">Porcentaje (%)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Tipo de Métrica</label>
                    <select
                      value={newKR.metricType}
                      onChange={e => setNewKR({ ...newKR, metricType: e.target.value as MetricType })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="flujo">⚡ Mensual (Flujo)</option>
                      <option value="acumulado">📈 Acumulado (Stock)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Línea Base (Baseline)</label>
                    <input
                      type="number"
                      value={newKR.baseline}
                      onChange={e => setNewKR({ ...newKR, baseline: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Notas / Táctica Real</label>
                  <input
                    type="text"
                    placeholder="Detalles sobre el canal, responsable o táctica..."
                    value={newKR.notes}
                    onChange={e => setNewKR({ ...newKR, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Guardar KR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
