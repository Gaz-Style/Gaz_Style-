'use client';

import React, { useState, useRef } from 'react';
import { 
  Map, Plus, Mountain, Tent, DollarSign, 
  Clock, Users, Trash2, Power, Search, Filter, Activity,
  Calculator, Bus, Ticket, ChefHat, UserCircle, Upload, ImagePlus, X, Edit
} from 'lucide-react';
import { createAdventureWithCosts, updateAdventureWithCosts, toggleAdventureStatus, deleteAdventure, AdventureCost } from './actions';

export default function RoutesClient({ initialRoutes }: { initialRoutes: any[] }) {
  const [routes, setRoutes] = useState(initialRoutes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);

  const [basePrice, setBasePrice] = useState(85000);
  const [minPax, setMinPax] = useState(2);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [costs, setCosts] = useState<AdventureCost[]>([]);
  const [newCostName, setNewCostName] = useState('');
  const [newCostAmount, setNewCostAmount] = useState(0);
  const [newCostType, setNewCostType] = useState<'fixed' | 'per_pax'>('fixed');

  const grossIncome = basePrice * minPax;
  const totalFixedCosts = costs.filter(c => c.cost_type === 'fixed').reduce((acc, curr) => acc + curr.expected_amount, 0);
  const totalVariableCosts = costs.filter(c => c.cost_type === 'per_pax').reduce((acc, curr) => acc + (curr.expected_amount * minPax), 0);
  const totalCosts = totalFixedCosts + totalVariableCosts;
  const netMargin = grossIncome - totalCosts;
  const marginPercentage = grossIncome > 0 ? ((netMargin / grossIncome) * 100).toFixed(1) : 0;

  function handleAddCost() {
    if (!newCostName || newCostAmount <= 0) return;
    setCosts([...costs, { cost_name: newCostName, expected_amount: newCostAmount, cost_type: newCostType }]);
    setNewCostName('');
    setNewCostAmount(0);
  }

  function handleRemoveCost(index: number) {
    setCosts(costs.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (netMargin < 0 && !confirm('El margen proyectado es negativo. ¿Deseas guardar la ruta de todos modos?')) {
        setIsSubmitting(false);
        return;
      }
      
      if (editingRoute) {
        await updateAdventureWithCosts(editingRoute.id, formData, costs);
      } else {
        await createAdventureWithCosts(formData, costs);
      }
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert('Error al guardar la ruta.');
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  }

  function openNewModal() {
    setEditingRoute(null);
    setBasePrice(85000);
    setMinPax(2);
    setImageUrl('');
    setCosts([]);
    setNewCostName('');
    setNewCostAmount(0);
    setIsModalOpen(true);
  }

  function openEditModal(route: any) {
    setEditingRoute(route);
    setBasePrice(route.base_price || 0);
    setMinPax(route.min_pax || 2);
    setImageUrl(route.image_url || '');
    setCosts(route.adventure_costs_template || []);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans selection:bg-blue-900 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2">
              <Map className="w-4 h-4" /> Catálogo DMC & Yield Management
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
              Diseñador de <span className="font-bold">Rutas</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2">
              Empaquetador dinámico. Vincula costos de proveedores para proyectar la rentabilidad real.
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Paquete</span>
          </button>
        </header>

        {/* Rutas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {routes.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-slate-700 rounded-xl bg-slate-900/50">
              <Mountain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300">No hay paquetes creados</h3>
              <p className="text-slate-500 text-sm mt-1">Empieza a diseñar expediciones y vincular tus costos de proveedores.</p>
            </div>
          ) : (
            routes.map(route => {
              const rBasePrice = route.base_price;
              const rMinPax = route.min_pax;
              const rIncome = rBasePrice * rMinPax;
              const rCosts = route.adventure_costs_template || [];
              const rTotalFixed = rCosts.filter((c:any) => c.cost_type === 'fixed').reduce((a:number, c:any) => a + c.expected_amount, 0);
              const rTotalVar = rCosts.filter((c:any) => c.cost_type === 'per_pax').reduce((a:number, c:any) => a + (c.expected_amount * rMinPax), 0);
              const rNetMargin = rIncome - (rTotalFixed + rTotalVar);
              const rMarginPct = rIncome > 0 ? ((rNetMargin / rIncome) * 100).toFixed(0) : 0;

              return (
                <div key={route.id} className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl overflow-hidden transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-blue-500">
                          {route.category === 'Alta Montaña' ? <Mountain className="w-5 h-5" /> : <Tent className="w-5 h-5" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">{route.category}</span>
                          <h3 className="text-lg font-semibold text-white line-clamp-1">{route.title}</h3>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${route.is_active ? 'bg-green-500' : 'bg-slate-600'}`} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Base ({rMinPax} Pax)</p>
                        <p className="font-medium text-sm text-slate-300">${rIncome.toLocaleString('es-CL')}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <p className="text-[10px] text-blue-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Calculator className="w-3 h-3"/> Margen</p>
                        <p className={`font-medium text-sm ${rNetMargin > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${rNetMargin.toLocaleString('es-CL')} <span className="text-xs opacity-70">({rMarginPct}%)</span>
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-1.5">
                      {rCosts.slice(0,3).map((c:any) => (
                        <span key={c.id} className="px-2 py-1 bg-slate-800 rounded text-[10px] font-medium text-slate-400">
                          {c.cost_name}
                        </span>
                      ))}
                      {rCosts.length > 3 && <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-medium text-slate-400">+{rCosts.length - 3}</span>}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-800">
                      <button 
                        onClick={() => openEditModal(route)}
                        className="flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 bg-slate-800 text-slate-400 hover:bg-slate-700"
                        title="Editar Ruta"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button 
                        onClick={() => toggleAdventureStatus(route.id, route.is_active)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${route.is_active ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {route.is_active ? 'Pausar' : 'Activar'}
                      </button>
                      <button 
                        onClick={async () => {
                          if(confirm('¿Eliminar esta ruta y su plantilla de costos?')) {
                            try {
                              const res = await deleteAdventure(route.id);
                              if (res?.error) {
                                alert(res.error);
                              } else {
                                window.location.reload();
                              }
                            } catch (e) {
                              alert('Ocurrió un error inesperado al intentar eliminar.');
                            }
                          }
                        }}
                        className="p-2 bg-slate-800 text-slate-400 hover:bg-red-900/50 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Modal Empaquetador Dinámico (Estilo ERP) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 bg-slate-950">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Tent className="w-5 h-5 text-blue-500" />
                {editingRoute ? 'Editar Ruta' : 'Yield Manager'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">Configuración del producto y modelo de costos operativos.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-grow overflow-hidden">
              
              <div className="p-6 w-full md:w-1/2 space-y-5 border-r border-slate-800 overflow-y-auto">
                <h3 className="text-sm font-semibold text-blue-500 flex items-center gap-2 uppercase tracking-wider mb-4"><Map className="w-4 h-4"/> Detalles del Producto</h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Nombre Comercial</label>
                  <input required name="title" type="text" defaultValue={editingRoute?.title || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Categoría</label>
                    <select required name="category" defaultValue={editingRoute?.category || 'Trekking'} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
                      <option value="Trekking">Trekking</option>
                      <option value="Alta Montaña">Alta Montaña</option>
                      <option value="Familiar">Familiar</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Dificultad</label>
                    <select required name="difficulty_level" defaultValue={editingRoute?.difficulty_level || 'Media'} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                      <option value="Experto">Experto</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Mínimo Pax (Costeo)</label>
                    <input required name="min_pax" type="number" min="1" value={minPax} onChange={e => setMinPax(parseInt(e.target.value)||1)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Máximo Pax</label>
                    <input required name="max_pax" type="number" min="1" defaultValue={editingRoute?.max_pax || 12} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase" title="Días que bloquea en el calendario">Bloqueo Calendario (Días)</label>
                    <input required name="duration_days" type="number" min="1" defaultValue={editingRoute?.duration_days || 1} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Duración Comercial</label>
                    <input required name="duration_text" type="text" defaultValue={editingRoute?.duration_text || ''} placeholder="Ej: 3-4 horas" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Descripción Pública</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={editingRoute?.description || ''}
                    placeholder="Ej: Ascenso al Manquehue al atardecer. Ideal para liberar el estrés laboral..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                  <p className="text-[10px] text-slate-600">Aparece en las tarjetas del sitio web público.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Desnivel (Elevation Gain)</label>
                  <input name="elevation_gain" type="text" defaultValue={editingRoute?.elevation_gain || ''} placeholder="Ej: +1.200m" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Itinerario (Uno por línea)</label>
                  <textarea
                    name="itinerary"
                    rows={3}
                    defaultValue={editingRoute?.itinerary?.map((i:any)=>i.title).join('\n') || ''}
                    placeholder="Ej: 08:00 Punto de encuentro&#10;12:00 Cumbre"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Qué Incluye (Uno por línea)</label>
                    <textarea
                      name="included"
                      rows={3}
                      defaultValue={editingRoute?.included?.join('\n') || ''}
                      placeholder="Ej: Guía WFR&#10;Snacks"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase">No Incluye (Uno por línea)</label>
                    <textarea
                      name="not_included"
                      rows={3}
                      defaultValue={editingRoute?.not_included?.join('\n') || ''}
                      placeholder="Ej: Transporte&#10;Propinas"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Precio Unitario Venta</label>
                  <input required name="base_price" type="number" value={basePrice} onChange={e => setBasePrice(parseFloat(e.target.value)||0)} className="w-full bg-blue-900/10 border border-blue-500/30 rounded-lg px-3 py-2 text-sm font-semibold text-blue-400 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Imagen de Portada</label>
                  {/* Hidden input to store the URL in the form */}
                  <input type="hidden" name="image_url" value={imageUrl} />

                  {imageUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-700 h-36 bg-slate-900 group">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3" /> Cambiar imagen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                      imageUploading
                        ? 'border-blue-500 bg-blue-500/5'
                        : 'border-slate-700 bg-slate-900/50 hover:border-blue-500 hover:bg-blue-500/5'
                    }`}>
                      {imageUploading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="text-xs text-blue-400 font-semibold">Subiendo...</p>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-8 h-8 text-slate-600 mb-2" />
                          <p className="text-xs text-slate-400 font-semibold">Haz clic o arrastra una imagen</p>
                          <p className="text-[10px] text-slate-600 mt-1">PNG, JPG, WEBP · Máx 5MB</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={imageUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setImageUploading(true);
                          try {
                            const fd = new FormData();
                            fd.append('file', file);
                            const res = await fetch('/api/admin/media/upload', { method: 'POST', body: fd });
                            const json = await res.json();
                            if (json.url) {
                              setImageUrl(json.url);
                            } else {
                              alert('Error al subir: ' + (json.error || 'desconocido'));
                            }
                          } catch (err) {
                            alert('Error de red al subir la imagen');
                          } finally {
                            setImageUploading(false);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="p-6 w-full md:w-1/2 flex flex-col bg-slate-950 overflow-y-auto">
                <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider mb-4"><Calculator className="w-4 h-4"/> Cuentas por Pagar (Proveedores)</h3>
                
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 mb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Concepto (Ej: Van)" value={newCostName} onChange={e=>setNewCostName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none" />
                    <input type="number" placeholder="Monto Neto" value={newCostAmount || ''} onChange={e=>setNewCostAmount(parseFloat(e.target.value)||0)} className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <select value={newCostType} onChange={e=>setNewCostType(e.target.value as 'fixed'|'per_pax')} className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-300 focus:border-blue-500 outline-none">
                      <option value="fixed">Fijo (Por Expedición Completa)</option>
                      <option value="per_pax">Variable (Por Pasajero)</option>
                    </select>
                    <button type="button" onClick={handleAddCost} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">Agregar</button>
                  </div>
                </div>

                <div className="flex-grow space-y-1 mb-4">
                  {costs.map((c, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        {c.cost_type === 'fixed' ? <Bus className="w-3.5 h-3.5 text-slate-400"/> : <UserCircle className="w-3.5 h-3.5 text-slate-400"/>}
                        <div>
                          <p className="text-sm font-medium text-slate-200">{c.cost_name}</p>
                          <p className="text-[9px] text-slate-500 uppercase">{c.cost_type === 'fixed' ? 'Costo Fijo' : 'Costo Variable'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-slate-300">${c.expected_amount.toLocaleString('es-CL')}</span>
                        <button type="button" onClick={() => handleRemoveCost(idx)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mt-auto">
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="text-slate-400">Ingreso Operativo ({minPax} Pax)</span>
                    <span className="font-medium text-slate-200">${grossIncome.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between mb-3 text-sm">
                    <span className="text-slate-400">Pasivo Proveedores</span>
                    <span className="font-medium text-red-400">-${totalCosts.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Margen Operativo</span>
                    <div className="text-right">
                      <span className={`text-xl font-bold ${netMargin > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${netMargin.toLocaleString('es-CL')}
                      </span>
                      <span className="block text-[10px] font-semibold text-slate-500 mt-0.5">{marginPercentage}% Rentabilidad</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 mt-6 border-t border-slate-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors">
                    Descartar
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white text-sm font-semibold rounded-lg transition-colors">
                    {isSubmitting ? 'Procesando...' : (editingRoute ? 'Guardar Cambios' : 'Confirmar Producto')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
