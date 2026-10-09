'use client';

import React, { useState } from 'react';
import { 
  CalendarDays, Plus, Mountain, Users, Flag, Trash2, CheckCircle, 
  Clock, MapPin, UserSquare2
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans selection:bg-blue-900 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2">
              <CalendarDays className="w-4 h-4" /> Schedule Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
              Agenda <span className="font-bold">Operativa</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2">
              Orquestación de salidas en el tiempo, disponibilidad de cupos y control de estado.
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Programar Salida</span>
          </button>
        </header>

        {/* Agenda List */}
        <div className="space-y-4 pt-4">
          {departures.length === 0 && adventuresCatalog.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-slate-700 rounded-xl bg-slate-900/50">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300">No hay salidas ni rutas disponibles</h3>
              <p className="text-slate-500 text-sm mt-1">Crea una ruta en tu catálogo DMC primero para poder programarla.</p>
            </div>
          ) : (
            <>
              {departures.map(dep => {
                const adv = dep.adventures_catalog;
                if (!adv) return null; // Fallback si la ruta base fue borrada (Cascade delete debería prevenirlo en BD real)

                const capacityPct = adv.max_pax > 0 ? (dep.current_pax / adv.max_pax) * 100 : 0;
                
                return (
                  <div key={dep.id} className="group bg-slate-900 border border-slate-800 hover:border-blue-500/30 rounded-xl overflow-hidden transition-all flex flex-col md:flex-row items-stretch">
                    
                    {/* Date Block */}
                    <div className="bg-slate-950 p-6 flex flex-col justify-center items-center min-w-[140px] border-b md:border-b-0 md:border-r border-slate-800">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Inicio</span>
                      <span className="text-3xl font-black text-white">{new Date(dep.start_date).toLocaleDateString('es-ES', { timeZone: 'UTC', day: 'numeric' })}</span>
                      <span className="text-sm font-semibold text-blue-500 uppercase">
                        {new Date(dep.start_date).toLocaleDateString('es-ES', { timeZone: 'UTC', month: 'short' })} {new Date(dep.start_date).getFullYear()}
                      </span>
                    </div>

                    {/* Info Block */}
                    <div className="flex-grow p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{adv.category} • {adv.duration_days} Días</span>
                          <h3 className="text-xl font-bold text-white line-clamp-1">{adv.title}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(dep.status)}`}>
                          {getStatusText(dep.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-6 mt-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-semibold">Ocupación</p>
                            <p className="text-sm font-bold text-slate-200">{dep.current_pax} / {adv.max_pax} Pax</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-semibold">Término</p>
                            <p className="text-sm font-bold text-slate-200">{new Date(dep.end_date).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <UserSquare2 className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-semibold">Guía Lead</p>
                            <p className="text-sm font-bold text-slate-400 italic">No Asignado</p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-5 w-full bg-slate-950 rounded-full h-1.5 border border-slate-800 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${capacityPct >= 100 ? 'bg-red-500' : capacityPct > 0 ? 'bg-blue-500' : 'bg-slate-700'}`} 
                          style={{ width: `${Math.min(capacityPct, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions Block */}
                    <div className="p-4 bg-slate-900/50 flex flex-row md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-slate-800">
                      {dep.status === 'scheduled' && (
                        <button 
                          onClick={async () => { await updateDepartureStatus(dep.id, 'confirmed'); window.location.reload(); }}
                          className="px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs font-bold rounded-lg border border-green-500/20 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Go
                        </button>
                      )}
                      {(dep.status === 'confirmed' || dep.status === 'scheduled') && (
                        <button 
                          onClick={() => { setExpenseDepId(dep.id); setExpenseDesc(''); setExpenseAmt(''); }}
                          className="px-4 py-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 text-xs font-bold rounded-lg border border-orange-500/20 transition-colors flex items-center gap-2"
                        >
                          + Gasto
                        </button>
                      )}
                      {dep.status !== 'cancelled' && dep.status !== 'completed' && (
                        <button 
                          onClick={async () => {
                            if(confirm('¿Seguro que deseas cancelar esta salida?')) {
                              await updateDepartureStatus(dep.id, 'cancelled');
                              window.location.reload();
                            }
                          }}
                          className="px-4 py-2 bg-slate-800 text-slate-400 hover:bg-red-900/40 hover:text-red-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Cancelar
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
              
              {/* Unscheduled Adventures */}
              {adventuresCatalog.filter(adv => !departures.some(d => d.adventure_id === adv.id && (d.status === 'scheduled' || d.status === 'confirmed'))).map(adv => (
                  <div key={adv.id} className="group bg-slate-950/50 border border-slate-800 border-dashed rounded-xl overflow-hidden flex flex-col md:flex-row items-stretch opacity-80 hover:opacity-100 transition-opacity">
                    <div className="bg-slate-900/30 p-6 flex flex-col justify-center items-center min-w-[140px] border-b md:border-b-0 md:border-r border-slate-800 border-dashed">
                      <span className="text-3xl font-black text-slate-700">--</span>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">Sin Fecha</span>
                    </div>
                    <div className="flex-grow p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">{adv.category} • {adv.duration_days} Días</span>
                          <h3 className="text-xl font-bold text-slate-400 line-clamp-1">{adv.title}</h3>
                        </div>
                        <span className="px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50 text-slate-500 text-xs font-bold">
                          No Programada
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900/30 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-slate-800 border-dashed">
                        <button 
                          onClick={() => { setSelectedAdventureId(adv.id); setIsModalOpen(true); }}
                          className="px-4 py-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 text-xs font-bold rounded-lg border border-blue-500/20 transition-colors w-full flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Programar
                        </button>
                    </div>
                  </div>
              ))}
            </>
          )}
        </div>

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
