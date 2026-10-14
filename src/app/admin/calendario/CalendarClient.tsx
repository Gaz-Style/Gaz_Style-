'use client';

import React, { useState } from 'react';
import { 
  CalendarDays, Plus, Mountain, Users, Flag, Trash2, CheckCircle, 
  Clock, MapPin, UserSquare2, X
} from 'lucide-react';
import { createDeparture, updateDepartureStatus, deleteDeparture, addUnplannedExpense } from './actions';

export default function CalendarClient({ 
  departures, 
  adventuresCatalog 
}: { 
  departures: any[], 
  adventuresCatalog: any[] 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseDepId, setExpenseDepId] = useState<string | null>(null);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmt, setExpenseAmt] = useState('');
  
  // Para auto-calcular la fecha de fin
  const [selectedAdventureId, setSelectedAdventureId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Efecto simple: Si eligen aventura y fecha inicio, tratamos de auto-sugerir la fecha fin
  function handleAdventureChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const advId = e.target.value;
    setSelectedAdventureId(advId);
    autoCalcEndDate(advId, startDate);
  }

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const date = e.target.value;
    setStartDate(date);
    autoCalcEndDate(selectedAdventureId, date);
  }

  function autoCalcEndDate(advId: string, sDate: string) {
    if (!advId || !sDate) return;
    const adventure = adventuresCatalog.find(a => a.id === advId);
    if (adventure && adventure.duration_days) {
      const start = new Date(sDate);
      // Sumamos los días (duration_days - 1 porque el día 1 es el start_date)
      start.setDate(start.getDate() + (adventure.duration_days - 1));
      setEndDate(start.toISOString().split('T')[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createDeparture(formData);
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert('Error al agendar la salida.');
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  }

  function getStatusColor(status: string) {
    switch(status) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'completed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  }

  function getStatusText(status: string) {
    switch(status) {
      case 'scheduled': return 'Programada';
      case 'confirmed': return 'Confirmada (Go)';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  }



  // Vista actual del Calendario
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 1)); // Octubre 2026 (mes 9 es Octubre)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDayActivities, setSelectedDayActivities] = useState<{ date: string; items: any[] } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // Nombres de los meses y días de la semana
  const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  // Generar la cuadrícula del mes actual
  // Primer día del mes (0=Dom, 1=Lun, ..., 6=Sáb)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Ajustar para que la semana empiece el Lunes (Lun=0, ..., Dom=6)
  const startingDayIndex = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Mapear salidas a cada fecha
  function getActivitiesForDate(y: number, m: number, d: number) {
    const formattedTarget = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return departures.filter(dep => {
      if (!dep.start_date) return false;
      const depDateStr = dep.start_date.split('T')[0];
      return depDateStr === formattedTarget;
    });
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 p-4 md:p-10 font-sans selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
        
        {/* Header Superior */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1 font-mono">
              <CalendarDays className="w-4 h-4" /> Calendario & Programación Operativa
            </div>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white">
              Agenda <span className="font-bold text-amber-400">Mensual</span>
            </h1>
            <p className="text-stone-400 text-xs md:text-sm mt-1">
              Vista completa de días, mes y año con todas las actividades y cupos programados.
            </p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Alternar Vista Mes / Lista */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-1 flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'}`}
              >
                Mes Completo
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'}`}
              >
                Lista
              </button>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl font-mono transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Programar Salida</span>
            </button>
          </div>
        </header>

        {/* ── BARRA DE NAVEGACIÓN DE MES Y AÑO ────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-stone-900/90 border border-stone-800 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-400/60 text-stone-300 hover:text-white transition-colors"
              title="Mes Anterior"
            >
              ←
            </button>
            <div className="text-center sm:text-left min-w-[200px]">
              <span className="text-2xl font-bold text-white tracking-tight font-sans">
                {MONTH_NAMES[month]} <span className="text-amber-400 font-mono font-light">{year}</span>
              </span>
            </div>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-400/60 text-stone-300 hover:text-white transition-colors"
              title="Mes Siguiente"
            >
              →
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-amber-400 text-xs font-mono transition-colors"
            >
              Hoy
            </button>
          </div>

          {/* Selector Rápido de Mes y Año */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <select
              value={month}
              onChange={e => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
              className="bg-stone-950 border border-stone-800 text-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {MONTH_NAMES.map((mName, idx) => (
                <option key={mName} value={idx}>{mName}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={e => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
              className="bg-stone-950 border border-stone-800 text-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {[2025, 2026, 2027, 2028].map(yVal => (
                <option key={yVal} value={yVal}>{yVal}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── VISTA CUADRÍCULA: EL MES COMPLETO ─────────────────────── */}
        {viewMode === 'grid' && (
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Encabezado de Días de la Semana */}
            <div className="grid grid-cols-7 border-b border-stone-800 bg-stone-950/80 font-mono text-xs text-center font-bold text-stone-400 py-3">
              {DAY_NAMES.map(dayName => (
                <div key={dayName} className="uppercase tracking-wider">
                  {dayName}
                </div>
              ))}
            </div>

            {/* Celdas del Calendario (Días del Mes) */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-stone-800/60 bg-stone-950/40">
              {/* Días del mes anterior (grises) */}
              {Array.from({ length: startingDayIndex }).map((_, i) => {
                const prevDay = daysInPrevMonth - startingDayIndex + i + 1;
                return (
                  <div key={`prev-${i}`} className="min-h-[110px] md:min-h-[130px] p-2 bg-stone-950/80 opacity-30 select-none">
                    <span className="text-xs font-mono text-stone-600 block">{prevDay}</span>
                  </div>
                );
              })}

              {/* Días del mes actual */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const acts = getActivitiesForDate(year, month, dayNum);
                const hasActs = acts.length > 0;
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

                return (
                  <div 
                    key={`curr-${dayNum}`}
                    onClick={() => {
                      if (hasActs) {
                        setSelectedDayActivities({ date: dateKey, items: acts });
                      }
                    }}
                    className={`min-h-[110px] md:min-h-[130px] p-2 flex flex-col justify-between transition-colors relative group ${
                      hasActs 
                        ? 'bg-amber-400/[0.04] hover:bg-amber-400/[0.08] cursor-pointer' 
                        : 'hover:bg-stone-900/40'
                    }`}
                  >
                    {/* Número de día */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs md:text-sm font-mono font-bold rounded-md px-1.5 py-0.5 ${
                        hasActs 
                          ? 'bg-amber-400 text-stone-950 shadow-sm' 
                          : 'text-stone-400 group-hover:text-white'
                      }`}>
                        {dayNum}
                      </span>

                      {hasActs && (
                        <span className="text-[10px] font-mono text-amber-400 font-semibold hidden md:inline">
                          {acts.length} {acts.length === 1 ? 'salida' : 'salidas'}
                        </span>
                      )}
                    </div>

                    {/* Fichas de Actividades Programadas en el Día */}
                    <div className="space-y-1.5 my-1.5 flex-1 overflow-y-auto max-h-[85px] no-scrollbar">
                      {acts.map(dep => {
                        const adv = dep.adventures_catalog;
                        if (!adv) return null;
                        const isConfirmed = dep.status === 'confirmed';
                        const isCancelled = dep.status === 'cancelled';

                        return (
                          <div
                            key={dep.id}
                            className={`p-1.5 rounded-lg border text-left transition-all text-[11px] leading-tight ${
                              isCancelled 
                                ? 'bg-red-500/10 border-red-500/20 text-red-400 line-through' 
                                : isConfirmed
                                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                  : 'bg-amber-500/15 border-amber-500/30 text-amber-200 hover:border-amber-400'
                            }`}
                          >
                            <div className="font-bold truncate">{adv.title}</div>
                            <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 mt-0.5">
                              <span>{dep.current_pax}/{adv.max_pax} pax</span>
                              <span className="capitalize">{dep.status === 'confirmed' ? 'Go' : dep.status}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Botón rápido para programar en este día específico */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStartDate(dateKey);
                        autoCalcEndDate(selectedAdventureId, dateKey);
                        setIsModalOpen(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[10px] font-mono text-stone-500 hover:text-amber-400 text-left transition-opacity flex items-center gap-1"
                    >
                      <Plus className="w-2.5 h-2.5" /> Programar
                    </button>
                  </div>
                );
              })}

              {/* Rellenar días restantes para completar la grilla */}
              {Array.from({ length: (7 - ((startingDayIndex + daysInMonth) % 7)) % 7 }).map((_, i) => (
                <div key={`next-${i}`} className="min-h-[110px] md:min-h-[130px] p-2 bg-stone-950/80 opacity-30 select-none">
                  <span className="text-xs font-mono text-stone-600 block">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODAL DE DETALLE DE DÍA ─────────────────────────────────── */}
        {selectedDayActivities && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Detalle de Salidas</span>
                  <h3 className="text-xl font-bold text-white font-mono">
                    {selectedDayActivities.date}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDayActivities(null)}
                  className="text-stone-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {selectedDayActivities.items.map(dep => {
                  const adv = dep.adventures_catalog;
                  if (!adv) return null;
                  return (
                    <div key={dep.id} className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-amber-400/80 block">
                            {adv.category || 'Experiencia'} · {adv.duration_days} Días
                          </span>
                          <h4 className="text-base font-bold text-white">{adv.title}</h4>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getStatusColor(dep.status)}`}>
                          {getStatusText(dep.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-stone-400">
                        <div>Ocupación: <strong className="text-white">{dep.current_pax} / {adv.max_pax} Pax</strong></div>
                        <div>Término: <strong className="text-white">{dep.end_date?.split('T')[0]}</strong></div>
                      </div>

                      {/* Acciones del día */}
                      <div className="flex items-center gap-2 pt-2 border-t border-stone-800/80">
                        {dep.status === 'scheduled' && (
                          <button
                            onClick={async () => {
                              await updateDepartureStatus(dep.id, 'confirmed');
                              window.location.reload();
                            }}
                            className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-mono font-bold border border-emerald-500/20"
                          >
                            ✓ Confirmar (Go)
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setExpenseDepId(dep.id);
                            setExpenseDesc('');
                            setExpenseAmt('');
                            setSelectedDayActivities(null);
                          }}
                          className="px-3 py-1.5 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg text-xs font-mono font-bold border border-orange-500/20"
                        >
                          + Gasto
                        </button>
                        {dep.status !== 'cancelled' && (
                          <button
                            onClick={async () => {
                              if (confirm('¿Cancelar esta salida?')) {
                                await updateDepartureStatus(dep.id, 'cancelled');
                                window.location.reload();
                              }
                            }}
                            className="px-3 py-1.5 bg-stone-800 hover:bg-red-900/40 text-stone-400 hover:text-red-300 rounded-lg text-xs font-mono ml-auto"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── VISTA LISTA CLÁSICA (OPCIONAL) ────────────────────────── */}
        {viewMode === 'list' && (
          <div className="space-y-4 pt-2">
            {departures.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-stone-800 rounded-xl bg-stone-900/40">
                <Clock className="w-12 h-12 text-stone-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-300">No hay salidas programadas</h3>
              </div>
            ) : (
              departures.map(dep => {
                const adv = dep.adventures_catalog;
                if (!adv) return null;
                const capacityPct = adv.max_pax > 0 ? (dep.current_pax / adv.max_pax) * 100 : 0;
                return (
                  <div key={dep.id} className="group bg-stone-900 border border-stone-800 hover:border-amber-400/40 rounded-xl overflow-hidden transition-all flex flex-col md:flex-row items-stretch">
                    <div className="bg-stone-950 p-6 flex flex-col justify-center items-center min-w-[140px] border-b md:border-b-0 md:border-r border-stone-800 font-mono">
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Inicio</span>
                      <span className="text-3xl font-black text-white">{new Date(dep.start_date).toLocaleDateString('es-ES', { timeZone: 'UTC', day: 'numeric' })}</span>
                      <span className="text-sm font-semibold text-amber-400 uppercase">
                        {new Date(dep.start_date).toLocaleDateString('es-ES', { timeZone: 'UTC', month: 'short' })} {new Date(dep.start_date).getFullYear()}
                      </span>
                    </div>

                    <div className="flex-grow p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] font-semibold text-amber-400/80 uppercase tracking-wider">{adv.category} • {adv.duration_days} Días</span>
                          <h3 className="text-xl font-bold text-white line-clamp-1">{adv.title}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(dep.status)}`}>
                          {getStatusText(dep.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-6 mt-4 font-mono text-xs text-stone-400">
                        <div>Ocupación: <strong className="text-white">{dep.current_pax} / {adv.max_pax} Pax</strong></div>
                        <div>Término: <strong className="text-white">{new Date(dep.end_date).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</strong></div>
                      </div>

                      <div className="mt-4 w-full bg-stone-950 rounded-full h-1.5 border border-stone-800 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${capacityPct >= 100 ? 'bg-red-500' : capacityPct > 0 ? 'bg-amber-400' : 'bg-stone-700'}`} 
                          style={{ width: `${Math.min(capacityPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* Modal Programar Salida */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-950">
              <h2 className="text-2xl font-semibold text-white">Programar Expedición</h2>
              <p className="text-slate-400 text-sm mt-1">Selecciona una ruta de tu catálogo y asígnale fechas en la agenda operativa.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Ruta / Producto Base</label>
                {adventuresCatalog.length === 0 ? (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-sm">
                    No tienes rutas activas en tu catálogo. Ve al "Diseñador de Rutas" primero.
                  </div>
                ) : (
                  <select 
                    required 
                    name="adventure_id" 
                    value={selectedAdventureId}
                    onChange={handleAdventureChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="" disabled>-- Selecciona una Ruta DMC --</option>
                    {adventuresCatalog.map(a => (
                      <option key={a.id} value={a.id}>{a.title} ({a.duration_days} Días)</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Fecha de Inicio</label>
                  <input 
                    required 
                    name="start_date" 
                    type="date" 
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-text" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Fecha de Término</label>
                  <input 
                    required 
                    name="end_date" 
                    type="date" 
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors" 
                  />
                  <p className="text-[10px] text-slate-500">Se auto-calcula según duración de la ruta.</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting || adventuresCatalog.length === 0} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white text-sm font-semibold rounded-lg transition-colors">
                  {isSubmitting ? 'Agendando...' : 'Confirmar en Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unplanned Expense Modal */}
      {expenseDepId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-orange-500/30 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-950">
              <h2 className="text-xl font-semibold text-white">Gasto Imprevisto en Ruta</h2>
              <p className="text-slate-400 text-sm mt-1">Se registrará en el Libro Mayor General asociado a esta salida.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Descripción del Gasto</label>
                <input value={expenseDesc} onChange={e => setExpenseDesc(e.target.value)} placeholder="Ej: Agua emergencia, rescate vehicular..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Monto ($)</label>
                <input value={expenseAmt} onChange={e => setExpenseAmt(e.target.value)} type="number" min="1" placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button onClick={() => setExpenseDepId(null)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg">Cancelar</button>
                <button
                  onClick={async () => {
                    if (!expenseDesc || !expenseAmt) { alert('Completa descripción y monto.'); return; }
                    const res = await addUnplannedExpense(expenseDepId, expenseDesc, parseFloat(expenseAmt));
                    if (res?.error) alert(res.error);
                    else { setExpenseDepId(null); alert('Gasto registrado en el Libro Mayor.'); }
                  }}
                  className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg"
                >
                  Registrar Gasto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
