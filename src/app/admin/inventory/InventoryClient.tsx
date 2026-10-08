'use client';

import React, { useState } from 'react';
import { 
  Tent, Plus, Package, Shield, Mountain, Trash2, 
  Settings2, Wrench, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { createInventoryItem, updateInventoryQty, deleteInventoryItem } from './actions';

export default function InventoryClient({ items }: { items: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createInventoryItem(formData);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Error al registrar ítem.');
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  }

  function getCategoryIcon(cat: string) {
    if (cat === 'Camping') return <Tent className="w-5 h-5 text-blue-500" />;
    if (cat === 'Seguridad') return <Shield className="w-5 h-5 text-red-500" />;
    if (cat === 'Alta Montaña') return <Mountain className="w-5 h-5 text-emerald-500" />;
    return <Package className="w-5 h-5 text-slate-500" />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans selection:bg-blue-900 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2">
              <Tent className="w-4 h-4" /> Resource Pooling
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
              Gear <span className="font-bold">Room</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2">
              Inventario físico y bloqueo transaccional. Previene la sobre-asignación de equipo.
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Equipo</span>
          </button>
        </header>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-4 bg-slate-950 rounded-lg text-blue-500"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Ítems</p>
              <p className="text-2xl font-black text-white">{items.reduce((acc, curr) => acc + curr.total_owned, 0)}</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-4 bg-slate-950 rounded-lg text-green-500"><CheckCircle2 className="w-6 h-6" /></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Disponibles Ahora</p>
              <p className="text-2xl font-black text-green-400">{items.reduce((acc, curr) => acc + curr.available_qty, 0)}</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-4 bg-slate-950 rounded-lg text-orange-500"><Wrench className="w-6 h-6" /></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">En Uso / Reparación</p>
              <p className="text-2xl font-black text-orange-400">
                {items.reduce((acc, curr) => acc + (curr.total_owned - curr.available_qty), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-800">
                <th className="p-4 font-semibold">Ítem Físico</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold">Total Stock</th>
                <th className="p-4 font-semibold">Disponible</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Bodega vacía. Registra tu primer equipo.
                  </td>
                </tr>
              ) : (
                items.map(item => {
                  const usagePct = item.total_owned > 0 ? ((item.total_owned - item.available_qty) / item.total_owned) * 100 : 0;
                  
                  return (
                    <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 font-medium text-slate-200">{item.item_name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(item.category)}
                          <span className="text-sm text-slate-400">{item.category}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <input 
                          type="number" 
                          min="0"
                          defaultValue={item.total_owned}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if(val !== item.total_owned) updateInventoryQty(item.id, val);
                          }}
                          className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-center focus:border-blue-500 outline-none"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${item.available_qty === 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {item.available_qty}
                          </span>
                          <div className="w-24 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className={`h-full ${usagePct > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${usagePct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={async () => {
                            if(confirm('¿Eliminar ítem del inventario permanentemente?')) {
                              await deleteInventoryItem(item.id);
                            }
                          }}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal Registrar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-950">
              <h2 className="text-xl font-semibold text-white">Ingresar Activo Físico</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Nombre / Modelo</label>
                <input required name="item_name" placeholder="Ej: Carpa Doite Himalaya 2P" type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Categoría</label>
                <select required name="category" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="Camping">Camping (Carpas, Sacos)</option>
                  <option value="Alta Montaña">Alta Montaña (Crampones, Piolet)</option>
                  <option value="Seguridad">Seguridad (Radios, Botiquín)</option>
                  <option value="General">General (Bastones, Cocinillas)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Cantidad Total Fija (Stock)</label>
                <input required name="total_owned" type="number" min="1" defaultValue="1" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>

              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
