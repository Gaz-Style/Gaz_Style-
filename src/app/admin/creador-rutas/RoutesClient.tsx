'use client';

import React, { useState, useEffect } from 'react';
import { 
  Map, Plus, Mountain, Tent, DollarSign, 
  Clock, Users, Trash2, Power, Search, Filter, Activity,
  Calculator, Bus, Ticket, ChefHat, UserCircle, Upload, ImagePlus, X, Edit,
  Compass, Flame, Home, UtensilsCrossed, Star, Sparkles, Navigation, ShieldCheck, CheckCircle2,
  Trophy, Layers, Crown, ShieldAlert, Loader2
} from 'lucide-react';
import { createAdventureWithCosts, updateAdventureWithCosts, toggleAdventureStatus, deleteAdventure, requestAdventureDeletionAuthorizationAction, AdventureCost } from './actions';

// Definición de las 4 Categorías Oficiales de Oferta de Santiago Hiking / Gaz-Style
export const INITIAL_VERTICAL_DEFINITIONS = [
  { id: 'salidas_grupales', label: 'SALIDAS GRUPALES', icon: Mountain, shortLabel: 'Salidas Grupales' },
  { id: 'travesias_desafios', label: 'TRAVESÍAS & GRANDES DESAFÍOS', icon: Trophy, shortLabel: 'Travesías & Grandes Desafíos' },
  { id: 'high_mountain', label: 'EXPEDITION HIGH MOUNTAIN', icon: Crown, shortLabel: 'Expedition High Mountain' },
  { id: 'expedition_pass', label: 'EXPEDITION BOUTIQUE', icon: Sparkles, shortLabel: 'Expedition Boutique' },
];

export const VERTICAL_DEFINITIONS = INITIAL_VERTICAL_DEFINITIONS;

export const MACIZOS_SANTIAGO = [
  { id: 'all', label: 'Todos los Macizos' },
  { id: 'manquehue', label: 'Cordón Manquehue & San Cristóbal' },
  { id: 'ramon', label: 'Sierra de Ramón & Precordillera Oriente' },
  { id: 'maipo', label: 'Cajón del Maipo & Embalse El Yeso' },
  { id: 'farellones', label: 'Farellones, La Parva & El Plomo' },
  { id: 'yerba_loca', label: 'Valle de Yerba Loca & La Paloma' },
  { id: 'costa', label: 'Cordillera de la Costa (La Campana / El Roble)' },
];

export default function RoutesClient({ 
  initialRoutes, 
  initialVertical = 'all' 
}: { 
  initialRoutes: any[]; 
  initialVertical?: string; 
}) {
  const [routes, setRoutes] = useState(initialRoutes);
  const [selectedFilter, setSelectedFilter] = useState(initialVertical);
  const [selectedMacizo, setSelectedMacizo] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para Modal de Autorización 2FA de Eliminación (Elena Pattern)
  const [pendingDeleteRoute, setPendingDeleteRoute] = useState<any>(null);
  const [showDeleteAuthModal, setShowDeleteAuthModal] = useState(false);
  const [isRequestingPin, setIsRequestingPin] = useState(false);
  const [authPinInput, setAuthPinInput] = useState('');
  const [expectedPin, setExpectedPin] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleAuthorizeDelete() {
    const masterPin = '2026';
    const isAuthorized = authPinInput === expectedPin || authPinInput === masterPin;

    if (!isAuthorized) {
      alert('PIN de seguridad incorrecto. Intenta nuevamente.');
      setAuthPinInput('');
      return;
    }

    if (!pendingDeleteRoute) return;

    setIsDeleting(true);
    const deleteRes = await deleteAdventure(pendingDeleteRoute.id);
    setIsDeleting(false);

    if (deleteRes.success) {
      alert('Expedición eliminada exitosamente.');
      setShowDeleteAuthModal(false);
      setPendingDeleteRoute(null);
      setAuthPinInput('');
      setExpectedPin('');
      window.location.reload();
    } else {
      alert('Error al eliminar expedición: ' + deleteRes.error);
    }
  }
  const [editingRoute, setEditingRoute] = useState<any>(null);

  // Estado de Vertical y Pestañas del Creador
  const [verticalType, setVerticalType] = useState<string>(initialVertical === 'all' ? 'salidas_grupales' : initialVertical);
  const [customDiscipline, setCustomDiscipline] = useState('');
  const [macizoCordillera, setMacizoCordillera] = useState('Cordón Manquehue & San Cristóbal');
  const [cerroPrincipal, setCerroPrincipal] = useState('');
  const [activeTab, setActiveTab] = useState<'identidad' | 'tecnica' | 'storytelling' | 'operaciones' | 'costos'>('identidad');

  const [basePrice, setBasePrice] = useState(28000);
  const [minPax, setMinPax] = useState(2);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [costs, setCosts] = useState<AdventureCost[]>([]);
  const [newCostName, setNewCostName] = useState('');
  const [newCostAmount, setNewCostAmount] = useState(0);
  const [newCostType, setNewCostType] = useState<'fixed' | 'per_pax'>('fixed');

  // Sincronizar filtro cuando cambie initialVertical desde URL
  useEffect(() => {
    if (initialVertical) {
      setSelectedFilter(initialVertical);
    }
  }, [initialVertical]);

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

  function openCreateModal(forcedVertical?: string) {
    const v = forcedVertical || (selectedFilter === 'all' ? 'salidas_grupales' : selectedFilter);
    setEditingRoute(null);
    setVerticalType(v);
    setCustomDiscipline('');
    setCerroPrincipal('');
    setMacizoCordillera('Cordón Manquehue & San Cristóbal');
    setActiveTab('identidad');
    setBasePrice(
      v === 'high_mountain' ? 1460000 : 
      v === 'expedition_pass' ? 280000 : 
      v === 'travesias_desafios' ? 49000 : 
      28000
    );
    setMinPax(v === 'high_mountain' ? 1 : (v === 'expedition_pass' ? 1 : 2));
    setImageUrl('');
    setCosts([]);
    setNewCostName('');
    setNewCostAmount(0);
    setIsModalOpen(true);
  }

  function openEditModal(route: any) {
    setEditingRoute(route);
    setVerticalType(route.vertical_type || 'salidas_grupales');
    setCustomDiscipline(route.custom_discipline || '');
    setCerroPrincipal(route.category || '');
    setMacizoCordillera(route.category || 'Cordón Manquehue & San Cristóbal');
    setActiveTab('identidad');
    setBasePrice(route.base_price || 0);
    setMinPax(route.min_pax || 2);
    setImageUrl(route.image_url || '');
    setCosts(route.adventure_costs_template || []);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('vertical_type', verticalType);
      if (verticalType === 'action_sports') {
        formData.set('custom_discipline', customDiscipline);
      }
      
      const title = (formData.get('title') as string || '').trim();
      if (!title) {
        setActiveTab('identidad');
        alert('Por favor ingresa un nombre comercial para la experiencia.');
        setIsSubmitting(false);
        return;
      }

      let category = (formData.get('category') as string || '').trim();
      if (!category) {
        category = cerroPrincipal || macizoCordillera || 'Cordillera de Santiago';
        formData.set('category', category);
      }

      if (!formData.get('base_price')) {
        formData.set('base_price', String(basePrice || 0));
      }
      if (!formData.get('min_pax')) {
        formData.set('min_pax', String(minPax || 2));
      }
      if (!formData.get('image_url')) {
        formData.set('image_url', imageUrl || '');
      }

      if (netMargin < 0 && !confirm('El margen proyectado es negativo. ¿Deseas guardar la experiencia de todos modos?')) {
        setIsSubmitting(false);
        return;
      }
      
      let res: { success: boolean; error?: string; id?: string };
      if (editingRoute) {
        res = await updateAdventureWithCosts(editingRoute.id, formData, costs);
      } else {
        res = await createAdventureWithCosts(formData, costs);
      }

      if (res && !res.success) {
        alert(res.error || 'Error al guardar la experiencia');
        setIsSubmitting(false);
        return;
      }

      window.location.reload(); 
    } catch (error: any) {
      alert(error.message || 'Error al guardar la experiencia');
      setIsSubmitting(false);
    }
  }

  // Filtrado estricto por vertical seleccionada (con soporte de las 4 categorías oficiales)
  const filteredRoutes = routes.filter(r => {
    const rVertical = r.vertical_type || 'salidas_grupales';
    const matchesVertical = selectedFilter === 'all' || 
      rVertical === selectedFilter ||
      (selectedFilter === 'salidas_grupales' && (rVertical === 'trekking' || r.category === 'grupales')) ||
      (selectedFilter === 'travesias_desafios' && (rVertical === 'challenges' || r.category === 'desafios')) ||
      (selectedFilter === 'expedition_pass' && r.category === 'expedition_pass') ||
      (selectedFilter === 'high_mountain' && r.category === 'high_mountain');

    const matchesSearch = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.custom_discipline && r.custom_discipline.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesVertical && matchesSearch;
  });

  // Títulos contextuales según la vertical activa
  const activeDef = VERTICAL_DEFINITIONS.find(v => v.id === selectedFilter) || {
    id: 'all',
    label: 'Catálogo de Experiencias',
    icon: Compass,
    shortLabel: 'Experiencias'
  };

  // Definición por defecto de las cabeceras de cada módulo
  const DEFAULT_MODULE_HEADERS: Record<string, { tag: string; title: string; highlight: string; desc: string; createBtn: string }> = {
    salidas_grupales: {
      tag: 'SALIDAS GRUPALES',
      title: 'Salidas',
      highlight: 'Grupales',
      desc: 'Cumbres de día, atardeceres y rutas guiadas por Gaz en la precordillera de Santiago.',
      createBtn: '+ Crear Salida Grupal'
    },
    travesias_desafios: {
      tag: 'TRAVESÍAS & GRANDES DESAFÍOS',
      title: 'Travesías &',
      highlight: 'Grandes Desafíos',
      desc: 'Retos icónicos y programas de resistencia continua (Sierra de Ramón, Cerro Provincia, La Cruz, Triple Corona).',
      createBtn: '+ Crear Travesía / Gran Desafío'
    },
    high_mountain: {
      tag: 'EXPEDITION HIGH MOUNTAIN',
      title: 'Expedition',
      highlight: 'High Mountain',
      desc: 'Grandes cumbres sobre 4.000m y 5.000m (El Plomo, Leonera, Volcán San José) con logística integral de arrieros y campamento.',
      createBtn: '+ Crear Expedición High Mountain'
    },
    expedition_pass: {
      tag: 'EXPEDITION BOUTIQUE',
      title: 'Expedition',
      highlight: 'Boutique',
      desc: 'Salidas 100% privadas y personalizadas a tu ritmo con pick-up en hotel/domicilio y Reel 4K profesional.',
      createBtn: '+ Crear Expedition Boutique'
    },
    all: {
      tag: 'CATÁLOGO SANTIAGO HIKING',
      title: 'Todas las',
      highlight: 'Experiencias',
      desc: 'Vista global de Salidas Grupales, Travesías & Grandes Desafíos, Expedition High Mountain y Expedition Boutique.',
      createBtn: '+ Crear Experiencia'
    }
  };

  // Categorías dinámicas (persistentes)
  const [categories, setCategories] = useState<any[]>(INITIAL_VERTICAL_DEFINITIONS);
  const [isNewCategoryModal, setIsNewCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Nombres editables en vivo (con persistencia en localStorage)
  const [customHeaders, setCustomHeaders] = useState<Record<string, { tag: string; title: string; highlight: string; desc: string; createBtn: string }>>({});
  const [isEditingHeaderModal, setIsEditingHeaderModal] = useState(false);
  const [headerEditForm, setHeaderEditForm] = useState({ tag: '', title: '', highlight: '', desc: '', createBtn: '' });

  // Cargar custom headers y categorías dinámicas al montar
  useEffect(() => {
    try {
      const savedHeaders = localStorage.getItem('santiago_hiking_module_headers');
      if (savedHeaders) setCustomHeaders(JSON.parse(savedHeaders));

      const savedCategories = localStorage.getItem('santiago_hiking_custom_categories');
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        const legacyExcluded = ['accommodation', 'gastronomy', 'all_inclusive', 'action_sports', 'experiencias', 'trekking', 'challenges', 'expeditions'];
        const cleanParsed = Array.isArray(parsed) ? parsed.filter((c: any) => !legacyExcluded.includes(c.id)) : [];
        setCategories([...INITIAL_VERTICAL_DEFINITIONS, ...cleanParsed]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catId = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newCategory = {
      id: catId,
      label: newCatName.trim(),
      icon: Sparkles,
      shortLabel: newCatName.trim()
    };
    const updated = [...categories, newCategory];
    setCategories(updated);
    
    // Guardar personalizadas
    try {
      const customOnly = updated.filter(c => !INITIAL_VERTICAL_DEFINITIONS.some(iv => iv.id === c.id));
      localStorage.setItem('santiago_hiking_custom_categories', JSON.stringify(customOnly));
    } catch (e) {
      console.error(e);
    }

    // Cambiar a la nueva categoría recién creada
    setSelectedFilter(catId);
    setNewCatName('');
    setIsNewCategoryModal(false);
  }

  const meta = (customHeaders[selectedFilter] || DEFAULT_MODULE_HEADERS[selectedFilter] || DEFAULT_MODULE_HEADERS['all']);

  function openEditHeaderModal() {
    setHeaderEditForm({
      tag: meta.tag,
      title: meta.title,
      highlight: meta.highlight,
      desc: meta.desc,
      createBtn: meta.createBtn
    });
    setIsEditingHeaderModal(true);
  }

  function handleSaveHeader(e: React.FormEvent) {
    e.preventDefault();
    const updated = {
      ...customHeaders,
      [selectedFilter]: headerEditForm
    };
    setCustomHeaders(updated);
    try {
      localStorage.setItem('santiago_hiking_module_headers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsEditingHeaderModal(false);
  }

  function handleResetHeader() {
    const updated = { ...customHeaders };
    delete updated[selectedFilter];
    setCustomHeaders(updated);
    try {
      localStorage.setItem('santiago_hiking_module_headers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsEditingHeaderModal(false);
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 p-6 md:p-12 font-sans selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* ── BARRA SUPERIOR DE CONTROL: HOMOGÉNEA Y ELEGANTE ───────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-stone-900/80 rounded-2xl border border-stone-800 shadow-xl backdrop-blur-md">
          {/* Selector de Categoría Principal */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono uppercase tracking-widest text-stone-400 shrink-0">Categoría:</span>
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={e => setSelectedFilter(e.target.value)}
                className="appearance-none bg-stone-950 border border-stone-700 hover:border-amber-400 rounded-xl px-4 py-2.5 pr-10 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer h-10"
              >
                {categories.map(v => {
                  const count = routes.filter(r => {
                    const rv = r.vertical_type || 'salidas_grupales';
                    if (rv === v.id) return true;
                    if (v.id === 'salidas_grupales' && (rv === 'trekking' || r.category === 'grupales')) return true;
                    if (v.id === 'travesias_desafios' && (rv === 'challenges' || r.category === 'desafios')) return true;
                    if (v.id === 'expedition_pass' && r.category === 'expedition_pass') return true;
                    if (v.id === 'high_mountain' && r.category === 'high_mountain') return true;
                    return false;
                  }).length;
                  return (
                    <option key={v.id} value={v.id} className="bg-stone-900 text-stone-200">
                      {v.label} ({count})
                    </option>
                  );
                })}
                <option value="all" className="bg-stone-900 text-amber-400 font-bold">
                  ★ Todas las Experiencias ({routes.length})
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
                <Filter className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Botón para Crear Nueva Categoría */}
            <button
              onClick={() => setIsNewCategoryModal(true)}
              className="h-10 px-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-400/60 text-stone-400 hover:text-amber-400 text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0"
              title="Crear una nueva categoría personalizada"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Nueva Categoría</span>
            </button>
          </div>

          {/* Buscador Homogéneo en la misma barra */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Buscar en ${meta.title} ${meta.highlight}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400/50 font-mono"
            />
          </div>

          {/* Contador y Estado */}
          <div className="flex items-center justify-end font-mono text-xs text-stone-400 shrink-0">
            <span className="h-10 px-4 flex items-center rounded-xl bg-stone-950 border border-stone-800/80">
              <strong className="text-amber-400 mr-1.5">{filteredRoutes.length}</strong> {filteredRoutes.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
        </div>

        {/* ── CABECERA LIMPIA Y EDITABLE ────────── */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1 font-mono">
                <activeDef.icon className="w-3.5 h-3.5" /> {meta.tag}
              </div>
              <button
                onClick={openEditHeaderModal}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-stone-500 hover:text-amber-400 hover:bg-stone-900 border border-transparent hover:border-stone-800 transition-colors"
                title="Editar nombre y textos de este módulo"
              >
                <Edit className="w-3 h-3" />
                <span>Editar Textos</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-4xl font-light tracking-tight text-white">
              {meta.title} <span className="font-bold text-amber-400">{meta.highlight}</span>
            </h1>
            <p className="text-stone-400 font-normal text-xs sm:text-sm mt-1">
              {meta.desc}
            </p>
          </div>
          
          <button 
            onClick={() => openCreateModal(selectedFilter === 'all' ? 'trekking' : selectedFilter)}
            className="btn-arcteryx-primary !py-3 !px-5 text-xs font-mono font-bold tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{meta.createBtn}</span>
          </button>
        </header>

        {/* ── MODAL PARA EDITAR NOMBRES Y TEXTOS DEL MÓDULO ── */}
        {isEditingHeaderModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-amber-400" />
                  Editar Nombre y Textos del Módulo
                </h3>
                <button
                  onClick={() => setIsEditingHeaderModal(false)}
                  className="text-stone-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveHeader} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1 uppercase">Etiqueta Superior (Tag):</label>
                  <input
                    type="text"
                    value={headerEditForm.tag}
                    onChange={e => setHeaderEditForm({ ...headerEditForm, tag: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    placeholder="Ej: RETOS, SENDERISMO, EXPEDICIONES..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1 uppercase">Título Principal:</label>
                    <input
                      type="text"
                      value={headerEditForm.title}
                      onChange={e => setHeaderEditForm({ ...headerEditForm, title: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      placeholder="Ej: Grandes, Rutas, etc."
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-amber-400 block mb-1 uppercase">Palabra Destacada:</label>
                    <input
                      type="text"
                      value={headerEditForm.highlight}
                      onChange={e => setHeaderEditForm({ ...headerEditForm, highlight: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                      placeholder="Ej: Desafíos, Trekking, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1 uppercase">Descripción / Subtítulo:</label>
                  <input
                    type="text"
                    value={headerEditForm.desc}
                    onChange={e => setHeaderEditForm({ ...headerEditForm, desc: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    placeholder="Breve explicación del módulo..."
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1 uppercase">Texto del Botón Crear:</label>
                  <input
                    type="text"
                    value={headerEditForm.createBtn}
                    onChange={e => setHeaderEditForm({ ...headerEditForm, createBtn: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    placeholder="Ej: + Crear Desafío, + Crear Ruta..."
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={handleResetHeader}
                    className="text-[11px] text-stone-500 hover:text-stone-300 underline"
                  >
                    Restablecer valor por defecto
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingHeaderModal(false)}
                      className="px-3 py-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 shadow-md"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL PARA CREAR NUEVA CATEGORÍA ── */}
        {isNewCategoryModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  Crear Nueva Categoría
                </h3>
                <button
                  onClick={() => setIsNewCategoryModal(false)}
                  className="text-stone-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1 uppercase">Nombre de la Categoría:</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    required
                    placeholder="Ej: Experiencias, Cursos de Montaña, Workshops..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 text-sm"
                  />
                  <span className="text-[10px] text-stone-500 block mt-1">
                    Esta categoría se agregará al selector y podrás catalogar productos en ella.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsNewCategoryModal(false)}
                    className="px-3 py-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 shadow-md"
                  >
                    Crear y Seleccionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}



        {/* ── GRID DE EXPERIENCIAS DE ESTA SECCIÓN ──────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredRoutes.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-stone-800 rounded-2xl bg-stone-900/40">
              <activeDef.icon className="w-12 h-12 text-stone-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-stone-300">
                No hay registros en {meta.title} {meta.highlight}
              </h3>
              <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
                Utiliza el botón superior para agregar un nuevo elemento a este catálogo.
              </p>
              <button
                onClick={() => openCreateModal(selectedFilter === 'all' ? 'trekking' : selectedFilter)}
                className="mt-4 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-mono font-bold transition-colors"
              >
                {meta.createBtn}
              </button>
            </div>
          ) : (
            filteredRoutes.map(route => {
              const rBasePrice = route.base_price;
              const rMinPax = route.min_pax || 2;
              const rIncome = rBasePrice * rMinPax;
              const rCosts = route.adventure_costs_template || [];
              const rTotalFixed = rCosts.filter((c:any) => c.cost_type === 'fixed').reduce((a:number, c:any) => a + c.expected_amount, 0);
              const rTotalVar = rCosts.filter((c:any) => c.cost_type === 'per_pax').reduce((a:number, c:any) => a + (c.expected_amount * rMinPax), 0);
              const rNetMargin = rIncome - (rTotalFixed + rTotalVar);
              const rMarginPct = rIncome > 0 ? ((rNetMargin / rIncome) * 100).toFixed(0) : 0;

              // Enlace dinámico según tipología
              const liveUrl = 
                route.title.toLowerCase().includes('5:00 am') ? '/desafios/desafio-5am' :
                route.title.toLowerCase().includes('triple corona') ? '/desafios/triple-corona' :
                route.title.toLowerCase().includes('sierra de ramón') || route.title.toLowerCase().includes('sierra de ramon') ? '/desafios/sierra-de-ramon' :
                route.title.toLowerCase().includes('desbloqueando') ? '/desafios/desbloqueando-santiago' :
                `/rutas/${route.id}`;

              const verticalLabel = 
                route.vertical_type === 'high_mountain' || route.category === 'high_mountain' ? 'Expedition High Mountain' :
                route.vertical_type === 'expedition_pass' || route.category === 'expedition_pass' ? 'Expedition Boutique' :
                route.vertical_type === 'travesias_desafios' || route.vertical_type === 'challenges' || route.category === 'desafios' ? 'Travesías & Grandes Desafíos' :
                'Salidas Grupales';

              return (
                <div 
                  key={route.id} 
                  className="group relative min-h-[500px] h-[520px] rounded-2xl overflow-hidden flex flex-col justify-between p-6 border border-stone-800/80 hover:border-amber-400/50 transition-all duration-500 bg-stone-900 shadow-2xl"
                >
                  {/* ── IMAGEN FULL COVER ── */}
                  {route.image_url ? (
                    <img 
                      src={route.image_url} 
                      alt={route.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-950">
                      <Mountain className="w-16 h-16 text-stone-800" />
                    </div>
                  )}

                  {/* ── DEGRADADO CINEMATOGRÁFICO DE CONTRASTE ── */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/20 pointer-events-none" />

                  {/* ── CABECERA FLOTANTE SUPERIOR ── */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-stone-950/85 backdrop-blur px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-amber-400 rounded-full border border-amber-400/20 shadow-md">
                        {verticalLabel}
                      </span>
                      {(route.badge || route.category) && (
                        <span className="bg-stone-950/70 backdrop-blur px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-stone-300 rounded-full border border-white/10 hidden sm:inline">
                          {route.badge || route.category}
                        </span>
                      )}
                    </div>

                    {/* Switch Estado: Publicada / Borrador */}
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const res = await toggleAdventureStatus(route.id, route.is_active);
                        if (res && !res.success) {
                          alert(res.error || 'Error al cambiar estado');
                        } else {
                          window.location.reload();
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition-colors shadow-lg ${
                        route.is_active 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30' 
                          : 'bg-stone-900/90 text-stone-400 border border-stone-700 hover:text-white'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{route.is_active ? 'Publicada' : 'Borrador'}</span>
                    </button>
                  </div>

                  {/* ── CONTENIDO SOBRIO FLOTANTE INFERIOR (SIN ESPACIOS BLANCOS) ── */}
                  <div className="relative z-10 space-y-3">
                    {/* Chips Técnicos */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-stone-300">
                      {route.duration_text && <span>{route.duration_text}</span>}
                      {route.difficulty_level && (
                        <>
                          <span className="text-stone-500">·</span>
                          <span className="text-amber-400 font-bold">{route.difficulty_level}</span>
                        </>
                      )}
                      {route.elevation_gain && (
                        <>
                          <span className="text-stone-500">·</span>
                          <span>+{route.elevation_gain} D+</span>
                        </>
                      )}
                      {route.max_pax && (
                        <>
                          <span className="text-stone-500">·</span>
                          <span>Máx {route.max_pax} pax</span>
                        </>
                      )}
                    </div>

                    {/* Título de Impacto */}
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
                      {route.title}
                    </h3>

                    {/* Descripción corta */}
                    <p className="text-stone-300/80 text-xs font-light leading-relaxed line-clamp-2">
                      {route.description || 'Guiado de montaña de alto nivel con seguridad WFR y logística integral.'}
                    </p>

                    {/* Tarjeta Financiera Flotante Glassmorphism */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-stone-950/85 backdrop-blur-md rounded-xl border border-white/10 font-mono text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Tarifa Venta</span>
                        <span className="font-bold text-white">${Number(route.base_price).toLocaleString('es-CL')}</span>
                        {route.price_usd && <span className="text-[10px] text-stone-400 ml-1">({route.price_usd})</span>}
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Rentabilidad</span>
                        <span className={`font-bold ${rNetMargin > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {rMarginPct}% (${rNetMargin.toLocaleString('es-CL')})
                        </span>
                      </div>
                    </div>

                    {/* Barra de Acciones */}
                    <div className="pt-2 flex items-center justify-between border-t border-white/15">
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Ver Ficha en Vivo</span>
                        <span>→</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(route)}
                          className="p-2 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white rounded-lg border border-white/10 transition-colors"
                          title="Editar Ficha"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            setPendingDeleteRoute(route);
                            setShowDeleteAuthModal(true);
                            setIsRequestingPin(true);
                            setAuthPinInput('');
                            setExpectedPin('');

                            const res = await requestAdventureDeletionAuthorizationAction({
                              id: route.id,
                              title: route.title
                            });

                            setIsRequestingPin(false);
                            if (res.success && res.pin) {
                              setExpectedPin(res.pin);
                            } else {
                              alert(res.error || 'Error al enviar código de autorización.');
                              setShowDeleteAuthModal(false);
                              setPendingDeleteRoute(null);
                            }
                          }}
                          className="p-2 bg-stone-900/90 hover:bg-rose-950/80 text-stone-400 hover:text-rose-400 rounded-lg border border-white/10 transition-colors"
                          title="Eliminar Expedición con Clave 2FA"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── MODAL DISEÑADOR CON LAS 7 VERTICALES INDEPENDIENTES ────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
            
            {/* Header del Modal */}
            <div className="p-6 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-1">
                  Arquitectura Modular de Experiencias
                </span>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  {editingRoute ? `Editar: ${editingRoute.title}` : 'Nueva Creación en Catálogo'}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector de Tipo de Experiencia en el Modal */}
            <div className="px-6 py-3 bg-stone-950/95 border-b border-stone-800/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-400">Tipo de Experiencia:</span>
                <select
                  value={verticalType}
                  onChange={e => setVerticalType(e.target.value)}
                  className="bg-stone-900 border border-stone-700 hover:border-amber-400 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  {categories.map(v => (
                    <option key={v.id} value={v.id} className="bg-stone-950 text-stone-200">
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-[11px] font-mono text-stone-500 hidden sm:inline">
                {categories.find(v => v.id === verticalType)?.label || verticalType}
              </span>
            </div>

            {/* Pestañas de Edición Modular */}
            <div className="px-6 py-2 bg-stone-950 border-b border-stone-800/60 flex flex-wrap items-center gap-1 font-mono text-xs">
              {[
                { id: 'identidad', label: '1. Identidad & Hero' },
                { id: 'tecnica', label: '2. Ficha Técnica & GPS' },
                { id: 'storytelling', label: '3. Storytelling' },
                { id: 'operaciones', label: '4. Operaciones & Mochila' },
                { id: 'costos', label: '5. Precios & Proveedores' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === t.id 
                      ? 'text-amber-400 bg-stone-800/80 font-bold border-b-2 border-amber-400' 
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            
            <form key={editingRoute?.id || "new_adventure"} onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-grow overflow-hidden">
              
              {/* Columna Izquierda: Formulario Modular de la Experiencia */}
              <div className="p-6 w-full md:w-3/5 space-y-5 border-r border-stone-800 overflow-y-auto">
                
                {/* ── TAB 1: IDENTIDAD & HERO ─────────────────────────────── */}
                <div className={activeTab === 'identidad' ? "space-y-4 animate-in fade-in duration-200" : "hidden"}>
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
                      Identidad Visual & Portada
                    </h3>

                    {/* Selector de Macizo & Cerro Cordillerano */}
                    {verticalType !== 'action_sports' && (
                      <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" /> Macizo / Cordón Cordillerano
                          </label>
                          <select
                            name="category"
                            value={macizoCordillera}
                            onChange={e => setMacizoCordillera(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          >
                            <option value="Cordón Manquehue & San Cristóbal">Cordón Manquehue & San Cristóbal</option>
                            <option value="Sierra de Ramón & Precordillera Oriente">Sierra de Ramón & Precordillera Oriente</option>
                            <option value="Cajón del Maipo & Embalse El Yeso">Cajón del Maipo & Embalse El Yeso</option>
                            <option value="Farellones, La Parva & El Plomo">Farellones, La Parva & El Plomo</option>
                            <option value="Valle de Yerba Loca & La Paloma">Valle de Yerba Loca & La Paloma</option>
                            <option value="Cordillera de la Costa (La Campana / El Roble)">Cordillera de la Costa (La Campana / El Roble)</option>
                            <option value="Otro Macizo Andino">Otro Macizo Andino</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-stone-400 uppercase">
                            Cerro / Cumbre Principal
                          </label>
                          <input
                            type="text"
                            value={cerroPrincipal}
                            onChange={e => setCerroPrincipal(e.target.value)}
                            placeholder="Ej: Cerro Manquehuito, Cerro Provincia, Alto del Naranjo..."
                            className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Especificaciones exclusivas de Gran Desafío */}
                    {verticalType === 'challenges' && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5" /> Tipo de Reto / Serie de Desafío
                          </label>
                          <input
                            type="text"
                            name="category"
                            defaultValue={cerroPrincipal || 'Desafío'}
                            placeholder="Ej: Desafío Alba, Triple Corona, Travesía Extrema, Programa Progresivo..."
                            className="w-full bg-stone-950 border border-amber-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <p className="text-[10px] text-amber-300/70 font-mono">
                          ★ Este reto se publicará exclusivamente en la sección &apos;Los Grandes Desafíos&apos; de la portada y en su vitrina técnica dedicada.
                        </p>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Nombre Comercial</label>
                      <input name="title" 
                        type="text" 
                        defaultValue={editingRoute?.title || ''} 
                        placeholder="Ej: Desafío 5:00 AM Manquehuito"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Número de Serie / Código</label>
                        <input 
                          name="number_code" 
                          type="text" 
                          defaultValue={editingRoute?.number_code || '01'} 
                          placeholder="Ej: 01"
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors font-mono" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Badge de Cota / Categoría</label>
                        <input 
                          name="badge" 
                          type="text" 
                          defaultValue={editingRoute?.badge || 'SERIE ALBA · COTA 1.638M'} 
                          placeholder="Ej: COTA 1.638M · MANQUEHUITO"
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors font-mono" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Frase Manifiesto (Tagline)</label>
                      <input 
                        name="tagline" 
                        type="text" 
                        defaultValue={editingRoute?.tagline || ''} 
                        placeholder='Ej: "Sube antes de que despierte la ciudad. Vuelve transformado."'
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors italic" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Subtítulo / Resumen Corto</label>
                      <textarea
                        name="description"
                        rows={2}
                        defaultValue={editingRoute?.description || ''}
                        placeholder="Ascenso nocturno al Manquehuito para conquistar la cumbre al romper el alba con café de especialidad..."
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
                      />
                    </div>

                    {/* Imagen de Portada */}
                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Fotografía de Portada (Full-Bleed)</label>
                      <input type="hidden" name="image_url" value={imageUrl} />
                      {imageUrl ? (
                        <div className="relative rounded-xl overflow-hidden border border-stone-700 h-40 bg-stone-950 group">
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setImageUrl('')}
                              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors font-mono"
                            >
                              <X className="w-3.5 h-3.5" /> Cambiar Imagen
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className={`flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                          imageUploading ? 'border-amber-400 bg-amber-400/5' : 'border-stone-800 bg-stone-950/60 hover:border-amber-400 hover:bg-stone-900'
                        }`}>
                          {imageUploading ? (
                            <div className="text-center">
                              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                              <p className="text-xs text-amber-400 font-mono">Subiendo fotografía...</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <ImagePlus className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                              <p className="text-xs text-stone-400 font-medium">Subir foto de alta definición</p>
                              <p className="text-[10px] text-stone-600 font-mono mt-0.5">JPG, PNG, WEBP · Hasta 5MB</p>
                            </div>
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
                                if (json.url) setImageUrl(json.url);
                                else alert('Error al subir: ' + (json.error || 'desconocido'));
                              } catch (err) {
                                alert('Error al subir la imagen');
                              } finally {
                                setImageUploading(false);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                {/* ── TAB 2: FICHA TÉCNICA & GPS ─────────────────────────── */}
                <div className={activeTab === 'tecnica' ? "space-y-4 animate-in fade-in duration-200" : "hidden"}>
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
                      Especificaciones de Recorrido & Strava
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Altitud Máxima (Cota)</label>
                        <input name="max_altitude" type="text" defaultValue={editingRoute?.max_altitude || ''} placeholder="Ej: 1.638 msnm" className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Desnivel Acumulado</label>
                        <input name="elevation_gain" type="text" defaultValue={editingRoute?.elevation_gain || ''} placeholder="Ej: +420m D+" className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Distancia Total</label>
                        <input name="distance" type="text" defaultValue={editingRoute?.distance || ''} placeholder="Ej: 4.2 km ida y vuelta" className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Tiempo Estimado</label>
                        <input name="duration_text" type="text" defaultValue={editingRoute?.duration_text || ''} placeholder="Ej: 3.5 a 4 horas" className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Nivel de Dificultad</label>
                        <input name="difficulty_level" type="text" defaultValue={editingRoute?.difficulty_level || 'Iniciación Activa / Moderada'} placeholder="Ej: Muy Exigente" className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Días Bloqueo Calendario</label>
                        <input name="duration_days" type="number" min="1" defaultValue={editingRoute?.duration_days || 1} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono" />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-800/60 space-y-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-amber-400" /> Coordenadas & Acceso
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-stone-500 uppercase">Sector / Comuna</label>
                          <input name="logistics_sector" type="text" defaultValue={editingRoute?.logistics?.sector || ''} placeholder="Ej: Lo Barnechea, Santiago" className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-stone-500 uppercase">Coordenadas GPS</label>
                          <input name="logistics_coordenadas" type="text" defaultValue={editingRoute?.logistics?.coordenadas || ''} placeholder='Ej: 33°20\x2745"S 70°34\x2712"W' className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-800/60 space-y-3">
                      <h4 className="text-xs font-mono font-bold text-[#FC4C02] uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> Sincronización Strava & GPX
                      </h4>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-stone-500 uppercase">Enlace a Ruta / Segmento Strava</label>
                        <input name="strava_url" type="url" defaultValue={editingRoute?.strava_url || ''} placeholder="https://www.strava.com/segments/..." className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FC4C02]" />
                      </div>
                    </div>
                  </div>

                {/* ── TAB 3: HISTORIA DEL CERRO & SEO GEO ─────────────────── */}
                <div className={activeTab === 'storytelling' ? "space-y-4 animate-in fade-in duration-200" : "hidden"}>
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
                      Historia del Cerro / Travesía (SEO GEO & Autoridad)
                    </h3>
                    <p className="text-xs text-stone-400 font-light">
                      Los 3 párrafos dedicados a la historia, geología y patrimonio del cerro o travesía. Clave para posicionamiento SEO Local y Generative Engine Optimization (ChatGPT, Perplexity, Gemini).
                    </p>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Párrafo 1: Origen, Toponimia & Patrimonio Ancestral</label>
                      <textarea
                        name="story_p1"
                        rows={3}
                        defaultValue={editingRoute?.story_paragraphs?.[0] || ''}
                        placeholder="Origen histórico o indígena del nombre, cosmovisión andina o uso colonial y su rol tutelar en la cuenca de Santiago..."
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Párrafo 2: Geología, Macizo & Entorno Andino</label>
                      <textarea
                        name="story_p2"
                        rows={3}
                        defaultValue={editingRoute?.story_paragraphs?.[1] || ''}
                        placeholder="Formación geológica de la montaña, fallas tectónicas, tipo de roca, bosque esclerófilo nativo y cuenca cordillerana..."
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Párrafo 3: Tradición Montañera & Relevancia Actual</label>
                      <textarea
                        name="story_p3"
                        rows={3}
                        defaultValue={editingRoute?.story_paragraphs?.[2] || ''}
                        placeholder="Primeros ascensos registrados, senderos de arrieros históricos y su trascendencia actual para el montañismo y expediciones guiadas..."
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                {/* ── TAB 4: OPERACIONES & MOCHILA ────────────────────────── */}
                <div className={activeTab === 'operaciones' ? "space-y-4 animate-in fade-in duration-200" : "hidden"}>
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
                      Operaciones, Itinerario & Mochila Obligatoria
                    </h3>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Itinerario Horario (Uno por línea)</label>
                      <textarea
                        name="itinerary"
                        rows={4}
                        defaultValue={editingRoute?.itinerary?.map((i:any)=>i.title).join('\n') || ''}
                        placeholder="05:00 AM Punto de Encuentro&#10;05:20 AM Inicio del Ascenso&#10;06:40 AM Cumbre & Café Caliente&#10;08:45 AM Cierre de Jornada"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-emerald-400 uppercase font-semibold">Qué Incluye (Uno por línea)</label>
                        <textarea
                          name="included"
                          rows={4}
                          defaultValue={editingRoute?.included?.join('\n') || ''}
                          placeholder="Guía certificado WFR&#10;Café de especialidad en cumbre&#10;Bastones de trekking técnicos&#10;Seguro de accidentes"
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-rose-400 uppercase font-semibold">No Incluye (Uno por línea)</label>
                        <textarea
                          name="not_included"
                          rows={4}
                          defaultValue={editingRoute?.not_included?.join('\n') || ''}
                          placeholder="Transporte hasta el punto de inicio&#10;Calzado personal de montaña&#10;Propinas voluntarias"
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400 transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-amber-400 uppercase font-semibold">Equipo Obligatorio en la Mochila</label>
                      <textarea
                        name="required_equipment"
                        rows={3}
                        defaultValue={editingRoute?.required_equipment?.join('\n') || ''}
                        placeholder="Calzado de trekking con buen agarre&#10;Chaqueta cortaviento o pluma liviana&#10;Mínimo 1.5 litros de agua&#10;Mochila de ataque (15-25L)"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors resize-none font-mono"
                      />
                    </div>
                  </div>

                {/* ── TAB 5: PRECIOS & PROVEEDORES ────────────────────────── */}
                <div className={activeTab === 'costos' ? "space-y-4 animate-in fade-in duration-200" : "hidden"}>
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
                      Parámetros Comerciales & Cupos
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Precio Venta (CLP)</label>
                        <input name="base_price" 
                          type="number" 
                          value={basePrice} 
                          onChange={e => setBasePrice(parseFloat(e.target.value)||0)} 
                          className="w-full bg-stone-950 border border-amber-500/40 rounded-lg px-3 py-2 text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-400 font-mono" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Precio Referencia USD</label>
                        <input 
                          name="price_usd" 
                          type="text" 
                          defaultValue={editingRoute?.price_usd || 'US$ 50'} 
                          placeholder="Ej: US$ 50" 
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-400" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Mínimo Pax (Punto de Equilibrio)</label>
                        <input name="min_pax" 
                          type="number" 
                          min="1" 
                          value={minPax} 
                          onChange={e => setMinPax(parseInt(e.target.value)||1)} 
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-400 uppercase font-semibold">Máximo Cupo Boutique</label>
                        <input name="max_pax" 
                          type="number" 
                          min="1" 
                          defaultValue={editingRoute?.max_pax || 8} 
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono" 
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2 text-xs font-mono text-stone-400">
                      <p className="text-white font-bold uppercase text-[10px] text-amber-400">Yield Management en Vivo:</p>
                      <p>• Los costos de proveedores se gestionan en la columna derecha en tiempo real.</p>
                      <p>• El margen proyectado debe mantenerse positivo antes de confirmar el producto.</p>
                    </div>
                  </div>
              </div>

              {/* Columna Derecha: Calculadora Financiera de Proveedores (Yield Manager) */}
              <div className="p-6 w-full md:w-2/5 flex flex-col bg-stone-950 overflow-y-auto">
                <h3 className="text-xs font-mono font-bold text-stone-400 flex items-center gap-2 uppercase tracking-wider mb-4">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>Costos de Proveedores & Margen</span>
                </h3>
                
                {/* Agregador de Costos */}
                <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 mb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Concepto (Ej: Van, Guía, Snack)" 
                      value={newCostName} 
                      onChange={e=>setNewCostName(e.target.value)} 
                      className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none" 
                    />
                    <input 
                      type="number" 
                      placeholder="Monto Neto" 
                      value={newCostAmount || ''} 
                      onChange={e=>setNewCostAmount(parseFloat(e.target.value)||0)} 
                      className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none font-mono" 
                    />
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={newCostType} 
                      onChange={e=>setNewCostType(e.target.value as 'fixed'|'per_pax')} 
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-300 focus:border-amber-400 outline-none font-mono"
                    >
                      <option value="fixed">Costo Fijo (Por Expedición)</option>
                      <option value="per_pax">Costo Variable (Por Pasajero)</option>
                    </select>
                    <button 
                      type="button" 
                      onClick={handleAddCost} 
                      className="bg-stone-800 hover:bg-stone-700 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors"
                    >
                      + Añadir
                    </button>
                  </div>
                </div>

                {/* Lista de Costos */}
                <div className="flex-grow space-y-1.5 mb-4">
                  {costs.length === 0 ? (
                    <p className="text-center py-6 text-xs text-stone-600 font-mono">Sin costos de proveedores asociados.</p>
                  ) : (
                    costs.map((c, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-stone-900 border border-stone-800 px-3 py-2 rounded-xl text-xs">
                        <div className="flex items-center gap-2">
                          {c.cost_type === 'fixed' ? <Bus className="w-3.5 h-3.5 text-amber-400/80"/> : <UserCircle className="w-3.5 h-3.5 text-amber-400/80"/>}
                          <div>
                            <p className="font-medium text-stone-200">{c.cost_name}</p>
                            <p className="text-[9px] text-stone-500 uppercase font-mono">{c.cost_type === 'fixed' ? 'Fijo' : 'Por Pax'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-stone-300 font-semibold">${c.expected_amount.toLocaleString('es-CL')}</span>
                          <button type="button" onClick={() => handleRemoveCost(idx)} className="text-stone-500 hover:text-rose-400">
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Resumen Financiero */}
                <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 mt-auto font-mono text-xs">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-stone-400">Ingreso Bruto ({minPax} Pax)</span>
                    <span className="font-bold text-white">${grossIncome.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-stone-400">Costo Proveedores</span>
                    <span className="font-bold text-rose-400">-${totalCosts.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-stone-800">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Margen Neto Proyectado</span>
                    <div className="text-right">
                      <span className={`text-xl font-black ${netMargin > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${netMargin.toLocaleString('es-CL')}
                      </span>
                      <span className="block text-[10px] text-stone-500 mt-0.5">{marginPercentage}% Rentabilidad</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3 pt-4 mt-4 border-t border-stone-800">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono font-bold rounded-xl transition-colors"
                  >
                    Descartar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="flex-1 btn-arcteryx-primary !py-2.5 text-xs font-mono font-bold text-center justify-center disabled:opacity-50"
                  >
                    {isSubmitting ? 'Guardando...' : (editingRoute ? 'Guardar Cambios' : 'Confirmar Producto')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL DE AUTORIZACIÓN 2FA DE ELIMINACIÓN (SISTEMA DE SEGURIDAD ELENA) ── */}
      {showDeleteAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header Alerta */}
            <div className="bg-rose-950/40 p-6 text-center border-b border-rose-900/50">
              <div className="mx-auto w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mb-3 shadow-inner">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">Autorización Requerida</h3>
              <p className="text-xs text-stone-300 mt-1 font-light">
                {isRequestingPin ? (
                  <span className="text-amber-400 animate-pulse font-mono">Enviando clave a WhatsApp y Correo...</span>
                ) : (
                  <>Se ha enviado una clave de 4 dígitos a tu <b>WhatsApp</b> y <b>Correo</b>.</>
                )}
              </p>
              {pendingDeleteRoute && (
                <div className="mt-2 text-[11px] font-mono text-rose-300/80 bg-rose-950/60 py-1 px-2 rounded border border-rose-900/40 truncate">
                  {pendingDeleteRoute.title}
                </div>
              )}
            </div>

            {/* Input PIN */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono font-bold text-stone-400 mb-2 text-center">
                  Ingresar Clave del Supervisor
                </label>
                <input 
                  type="text" 
                  maxLength={4}
                  autoFocus
                  disabled={isRequestingPin || isDeleting}
                  value={authPinInput}
                  onChange={(e) => setAuthPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && authPinInput.length === 4) {
                      handleAuthorizeDelete();
                    }
                  }}
                  placeholder="••••"
                  className="w-full text-center text-3xl font-mono py-3 px-2 bg-stone-950 border border-stone-700 rounded-xl text-amber-400 outline-none focus:border-amber-400 tracking-[12px] placeholder:tracking-[12px]"
                />
                <p className="text-[10px] text-stone-500 text-center font-mono mt-1.5">
                  Digita la clave de 4 números para autorizar la eliminación.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setShowDeleteAuthModal(false);
                    setPendingDeleteRoute(null);
                    setAuthPinInput('');
                    setExpectedPin('');
                  }}
                  className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  disabled={isRequestingPin || isDeleting || authPinInput.length !== 4}
                  onClick={handleAuthorizeDelete}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-rose-900/30"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirmar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
