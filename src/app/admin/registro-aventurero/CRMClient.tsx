'use client';

import React, { useState } from 'react';
import {
  Shield, Plus, AlertTriangle, CheckCircle2, FileSignature,
  Trash2, User, Phone, Heart, Users, Search
} from 'lucide-react';
import { createAdventurer, markWaiverSigned, deleteAdventurer } from './actions';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function CRMClient({ adventurers: initial }: { adventurers: any[] }) {
  const [adventurers, setAdventurers] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = adventurers.filter(a =>
    `${a.first_name} ${a.last_name} ${a.email}`.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createAdventurer(new FormData(e.currentTarget));
    if (res?.error) { alert(res.error); setIsSubmitting(false); return; }
    setShowModal(false);
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2">
              <Shield className="w-4 h-4" /> Clienteling & Risk Management
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
              CRM <span className="font-bold">Aventureros</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2">
              Directorio médico, historial de expediciones y control legal de waivers.
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm">
            <Plus className="w-5 h-5" /> Registrar Aventurero
          </button>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total Pasajeros</p>
            <h2 className="text-3xl font-black text-white">{adventurers.length}</h2>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Waivers Firmados</p>
            <h2 className="text-3xl font-black text-green-400">{adventurers.filter(a => a.waiver_signed).length}</h2>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Sin Waiver</p>
            <h2 className="text-3xl font-black text-orange-400">{adventurers.filter(a => !a.waiver_signed).length}</h2>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-800">
                <th className="p-4 font-semibold">Pasajero</th>
                <th className="p-4 font-semibold">Contacto</th>
                <th className="p-4 font-semibold">Perfil Médico</th>
                <th className="p-4 font-semibold">Contacto Emergencia</th>
                <th className="p-4 font-semibold">Legal</th>
                <th className="p-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-slate-500">
                  {adventurers.length === 0 ? 'Sin aventureros registrados. Agrega el primero.' : 'No hay resultados para esta búsqueda.'}
                </td></tr>
              ) : filtered.map(a => (
                <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors cursor-pointer" onClick={() => setSelected(a)}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {a.first_name[0]}{a.last_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">{a.first_name} {a.last_name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{a.mountain_experience_level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                    <p>{a.email}</p>
                    <p>{a.phone}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-full border border-red-500/20">
                        {a.blood_type || 'N/D'}
                      </span>
                      {a.severe_allergies && a.severe_allergies !== 'Ninguna' && (
                        <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-[10px] font-bold rounded-full border border-orange-500/20 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" /> Alergias
                        </span>
                      )}
                      {a.medical_conditions && (
                        <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold rounded-full border border-yellow-500/20 flex items-center gap-1">
                          <Heart className="w-2.5 h-2.5" /> Condición
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    <p className="text-slate-300 font-medium">{a.emergency_contact_name || '—'}</p>
                    <p className="text-slate-500">{a.emergency_contact_phone || ''}</p>
                  </td>
                  <td className="p-4">
                    {a.waiver_signed ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Firmado
                      </span>
                    ) : (
                      <button
                        onClick={async (ev) => { ev.stopPropagation(); await markWaiverSigned(a.id); window.location.reload(); }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white text-[10px] font-bold rounded-full border border-slate-700 transition-colors">
                        <FileSignature className="w-3 h-3" /> Firmar Waiver
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={async (ev) => {
                        ev.stopPropagation();
                        if (confirm(`¿Eliminar a ${a.first_name} del CRM?`)) {
                          const res = await deleteAdventurer(a.id);
                          if (res?.error) alert(res.error);
                          else window.location.reload();
                        }
                      }}
                      className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end bg-slate-950/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-slate-900 border-l border-slate-800 w-full md:w-[420px] h-full overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">{selected.first_name} {selected.last_name}</h2>
                <p className="text-blue-400 text-sm mt-1">{selected.mountain_experience_level}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-800">✕</button>
            </div>

            <div className="space-y-6">
              <Section title="Contacto" icon={<Phone className="w-4 h-4" />}>
                <Field label="Email" value={selected.email} />
                <Field label="Teléfono" value={selected.phone} />
              </Section>

              <Section title="Ficha Médica Crítica" icon={<Heart className="w-4 h-4 text-red-500" />}>
                <Field label="Tipo de Sangre" value={selected.blood_type} accent="red" />
                <Field label="Alergias Severas" value={selected.severe_allergies} accent={selected.severe_allergies !== 'Ninguna' ? 'orange' : undefined} />
                <Field label="Condiciones Médicas" value={selected.medical_conditions || 'Ninguna'} />
              </Section>

              <Section title="Contacto de Emergencia" icon={<AlertTriangle className="w-4 h-4 text-orange-500" />}>
                <Field label="Nombre" value={selected.emergency_contact_name} />
                <Field label="Teléfono" value={selected.emergency_contact_phone} />
              </Section>

              <Section title="Estado Legal" icon={<FileSignature className="w-4 h-4" />}>
                <div className="flex items-center gap-3 mt-2">
                  {selected.waiver_signed ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                      <CheckCircle2 className="w-4 h-4" /> Asunción de riesgo firmada
                    </span>
                  ) : (
                    <button
                      onClick={async () => { await markWaiverSigned(selected.id); window.location.reload(); }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                      Marcar Waiver como Firmado
                    </button>
                  )}
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-800 bg-slate-950">
              <h2 className="text-xl font-semibold text-white">Ficha de Aventurero</h2>
              <p className="text-slate-400 text-sm mt-1">Datos personales, médicos y de emergencia.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">

              <fieldset className="space-y-4">
                <legend className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Datos Personales</legend>
                <div className="grid grid-cols-2 gap-4">
                  <Input required name="first_name" label="Nombres" placeholder="Juan" />
                  <Input required name="last_name" label="Apellidos" placeholder="Pérez" />
                  <Input required name="email" label="Correo Electrónico" type="email" placeholder="juan@mail.com" />
                  <Input name="phone" label="Teléfono" placeholder="+56 9 1234 5678" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Nivel de Experiencia</label>
                  <select name="mountain_experience_level" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                    <option>Principiante</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                    <option>Experto</option>
                  </select>
                </div>
              </fieldset>

              <fieldset className="space-y-4 pt-4 border-t border-slate-800">
                <legend className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5" /> Ficha Médica Crítica
                </legend>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Tipo de Sangre</label>
                    <select name="blood_type" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                      <option value="">No sabe / No indica</option>
                      {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                    </select>
                  </div>
                  <Input name="severe_allergies" label="Alergias Severas" placeholder="Ej: Abejas, Penicilina" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Condiciones Médicas</label>
                  <textarea name="medical_conditions" rows={2} placeholder="Ej: Asma leve, Hipertensión controlada. Dejar en blanco si ninguna." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
                </div>
              </fieldset>

              <fieldset className="space-y-4 pt-4 border-t border-slate-800">
                <legend className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Contacto de Emergencia
                </legend>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="emergency_contact_name" label="Nombre Completo" placeholder="María Pérez (Mamá)" />
                  <Input name="emergency_contact_phone" label="Teléfono" placeholder="+56 9 9876 5432" />
                </div>
              </fieldset>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
                  {isSubmitting ? 'Registrando...' : 'Crear Ficha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ name, label, placeholder, type = 'text', required = false }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase">{label}</label>
      <input required={required} name={name} type={type} placeholder={placeholder} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
    </div>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">{icon} {title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, value, accent }: any) {
  const colorMap: Record<string, string> = { red: 'text-red-400 font-bold', orange: 'text-orange-400 font-bold' };
  return (
    <div className="flex justify-between py-2 border-b border-slate-800/50">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm ${accent ? colorMap[accent] : 'text-slate-300'}`}>{value || '—'}</span>
    </div>
  );
}
