'use client';

import React, { useState, useMemo } from 'react';
import {
  User,
  Mountain,
  Calendar,
  CreditCard,
  CheckCircle2,
  Search,
  Plus,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Phone,
  Mail,
  Shield,
  Clock,
  MapPin,
  Compass,
  AlertCircle,
  Share2,
  Printer,
  Sparkles,
  RotateCcw,
  Receipt,
  Check,
  Tag,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdventurerData, ExpeditionOption, PaymentMethodType, PaymentPlanType, POSSalePayload, SaleLedgerRecord } from '@/types/pos';
import { OFFICIAL_EXPEDITIONS, GEAR_PRICES, GUIDES_LIST } from '@/lib/pos-data';
import { searchAdventurers, createPOSSale, getAdventuresCatalogAction, validateCouponAction, resendTicketEmailAction } from './actions';

export default function POSClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Adventures loaded from database
  const [adventures, setAdventures] = useState<ExpeditionOption[]>(OFFICIAL_EXPEDITIONS);
  const [adventureSearch, setAdventureSearch] = useState<string>('');
  const [adventureCategoryFilter, setAdventureCategoryFilter] = useState<string>('todos');

  React.useEffect(() => {
    getAdventuresCatalogAction().then(res => {
      if (res && res.length > 0) {
        setAdventures(res);
        setSelectedExpedition(res[0]);
      }
    });
  }, []);

  // STEP 1: Adventurer (CRM)
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<AdventurerData[]>([]);
  const [selectedAdventurer, setSelectedAdventurer] = useState<AdventurerData | null>(null);
  const [showNewAdventurerForm, setShowNewAdventurerForm] = useState(false);
  const [newAdvData, setNewAdvData] = useState<AdventurerData>({
    first_name: '',
    last_name: '',
    rut: '',
    email: '',
    phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    mountain_experience_level: 'principiante'
  });

  // STEP 2: Expedition & Cupos
  const [selectedExpedition, setSelectedExpedition] = useState<ExpeditionOption>(OFFICIAL_EXPEDITIONS[0]);
  const [paxCount, setPaxCount] = useState<number>(1);
  const [gearRental, setGearRental] = useState({
    poles_count: 0,
    headlamp_count: 0,
    backpack_count: 0
  });

  // STEP 3: Agendamiento de Fecha
  // Fecha por defecto: próximo sábado
  const nextSaturday = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  }, []);

  const [scheduledDate, setScheduledDate] = useState<string>(nextSaturday);
  const [meetingTime, setMeetingTime] = useState<string>(selectedExpedition.meeting_time);
  const [meetingPoint, setMeetingPoint] = useState<string>(selectedExpedition.meeting_point);
  const [guideAssigned, setGuideAssigned] = useState<string>(GUIDES_LIST[0]);
  const [notes, setNotes] = useState<string>('');

  // STEP 4: Cobro & Control de Pago
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanType>('total');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card_pos');
  const [transferRef, setTransferRef] = useState<string>('');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cupones de descuento / Premios y Sorteos
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    campaign_name: string;
    discount_type: string;
    discount_value: number;
    discount_amount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // STEP 5: Ticket & Confirmation
  const [completedSale, setCompletedSale] = useState<SaleLedgerRecord | null>(null);
  const [whatsappText, setWhatsappText] = useState<string>('');
  const [emailStatus, setEmailStatus] = useState<string>('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  // Calculations
  const baseTotal = selectedExpedition.base_price_clp * paxCount;
  const gearTotal = (gearRental.poles_count * GEAR_PRICES.poles) +
                    (gearRental.headlamp_count * GEAR_PRICES.headlamp) +
                    (gearRental.backpack_count * GEAR_PRICES.backpack);
  const subtotalBeforeDiscount = baseTotal + gearTotal;

  // Descuento aplicado
  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const totalAmount = Math.max(0, subtotalBeforeDiscount - discountAmount);

  let paidAmount = 0;
  if (paymentPlan === 'total') paidAmount = totalAmount;
  else if (paymentPlan === 'deposit_50') paidAmount = Math.round(totalAmount * 0.5);
  else if (paymentPlan === 'on_site') paidAmount = 0;

  const balanceAmount = Math.max(0, totalAmount - paidAmount);
  const changeDue = cashTendered > paidAmount ? cashTendered - paidAmount : 0;

  // Validar cupón
  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await validateCouponAction(couponCodeInput, subtotalBeforeDiscount);
      if (res.valid) {
        setAppliedCoupon({
          code: res.code!,
          campaign_name: res.campaign_name!,
          discount_type: res.discount_type!,
          discount_value: res.discount_value!,
          discount_amount: res.discount_amount!
        });
        setCouponError('');
      } else {
        setCouponError(res.error || 'Cupón inválido');
        setAppliedCoupon(null);
      }
    } catch (e: any) {
      setCouponError('Error al validar cupón');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError('');
  };

  // Search Adventurers
  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchAdventurers(q);
      setSearchResults(results as AdventurerData[]);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSearching(false);
    }
  };

  // Submit Sale & Booking
  const handleFinalizeSale = async () => {
    if (!selectedAdventurer) {
      alert('Por favor selecciona o registra un aventurero.');
      setCurrentStep(1);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: POSSalePayload = {
        adventurer: selectedAdventurer,
        expedition: selectedExpedition,
        pax_count: paxCount,
        gear_rental: gearRental,
        scheduled_date: scheduledDate,
        meeting_time: meetingTime,
        meeting_point: meetingPoint,
        guide_assigned: guideAssigned,
        notes,
        discount_coupon: appliedCoupon ? appliedCoupon.code : undefined,
        discount_amount: appliedCoupon ? appliedCoupon.discount_amount : 0,
        total_amount: totalAmount,
        paid_amount: paidAmount,
        balance: balanceAmount,
        payment_plan: paymentPlan,
        payment_method: paymentMethod,
        transfer_reference: transferRef,
        cash_tendered: cashTendered,
        change_due: changeDue,
        seller_name: 'Gaz (Presencial)'
      };

      const res = await createPOSSale(payload);
      if (res.success) {
        setCompletedSale(res.sale);
        setWhatsappText(res.whatsappMessage);
        if (res.emailSent) {
          setEmailStatus('Expedition Pass enviado por correo exitosamente ✅');
        } else if (selectedAdventurer.email) {
          setEmailStatus('Correo no enviado automáticamente (puedes reenviar abajo)');
        }
        setCurrentStep(5);
      } else {
        alert(res.error || 'Error al procesar la venta.');
      }
    } catch (e) {
      alert('Error al registrar la venta y agendamiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to new sale
  const handleResetWizard = () => {
    setSelectedAdventurer(null);
    setSearchQuery('');
    setSearchResults([]);
    setShowNewAdventurerForm(false);
    setSelectedExpedition(OFFICIAL_EXPEDITIONS[0]);
    setPaxCount(1);
    setGearRental({ poles_count: 0, headlamp_count: 0, backpack_count: 0 });
    setPaymentPlan('total');
    setPaymentMethod('card_pos');
    setTransferRef('');
    setCashTendered(0);
    setCompletedSale(null);
    setWhatsappText('');
    setCurrentStep(1);
  };

  const steps = [
    { num: 1, title: 'Aventurero', icon: User },
    { num: 2, title: 'Expedición', icon: Mountain },
    { num: 3, title: 'Agendamiento', icon: Calendar },
    { num: 4, title: 'Cobro & Pago', icon: CreditCard },
    { num: 5, title: 'Ticket', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Compass className="w-3.5 h-3.5" /> Punto de Venta Presencial (POS)
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Agendamiento & <span className="font-bold text-emerald-400">Control de Pagos</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5">
              Atención presencial para registrar aventureros, agendar cumbres y registrar ingresos en caja y banco.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetWizard}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Nueva Venta
            </button>
          </div>
        </header>

        {/* STEP PROGRESS BAR */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
            {steps.map(step => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;

              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center">
                  <div
                    onClick={() => {
                      if (isPast) setCurrentStep(step.num);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/30'
                        : isPast
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1.5 ${
                      isActive ? 'text-emerald-400 font-bold' : isPast ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: AVENTURERO (CRM) */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" /> Identificación del Aventurero
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Busca por teléfono, RUT o nombre para verificar si ya ha salido con la cordada.
                </p>
              </div>

              {!showNewAdventurerForm && (
                <button
                  onClick={() => setShowNewAdventurerForm(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
                >
                  <Plus className="w-4 h-4" /> Registrar Nuevo Aventurero
                </button>
              )}
            </div>

            {/* Búsqueda rápida */}
            {!showNewAdventurerForm ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Escribe celular (ej: 957958467), RUT o nombre..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  {isSearching && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                      Buscando...
                    </span>
                  )}
                </div>

                {/* Resultados de búsqueda */}
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Aventureros Encontrados ({searchResults.length})
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {searchResults.map(adv => (
                        <div
                          key={adv.id || adv.phone}
                          onClick={() => {
                            setSelectedAdventurer(adv);
                            setCurrentStep(2);
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            selectedAdventurer?.phone === adv.phone
                              ? 'bg-emerald-950/40 border-emerald-500 text-white'
                              : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-sm text-white">
                              {adv.first_name} {adv.last_name}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                              <span>📱 {adv.phone}</span>
                              {adv.rut && <span>RUT: {adv.rut}</span>}
                            </div>
                          </div>
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            Seleccionar <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cliente seleccionado actualmente */}
                {selectedAdventurer && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                        Aventurero Seleccionado
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        {selectedAdventurer.first_name} {selectedAdventurer.last_name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Celular: {selectedAdventurer.phone} • Email: {selectedAdventurer.email || 'No registrado'}
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      Continuar a Expedición <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                    <p className="text-sm text-slate-400">
                      No encontramos ningún aventurero registrado con "<strong>{searchQuery}</strong>".
                    </p>
                    <button
                      onClick={() => {
                        setNewAdvData({ ...newAdvData, phone: searchQuery });
                        setShowNewAdventurerForm(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" /> Registrar como Nuevo Cliente
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Formulario de Registro Rápido */
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!newAdvData.first_name || !newAdvData.phone) return;
                  setSelectedAdventurer(newAdvData);
                  setShowNewAdventurerForm(false);
                  setCurrentStep(2);
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Nombre *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Sofía"
                      value={newAdvData.first_name}
                      onChange={e => setNewAdvData({ ...newAdvData, first_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Apellido *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Silva"
                      value={newAdvData.last_name}
                      onChange={e => setNewAdvData({ ...newAdvData, last_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Celular (WhatsApp) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: +56 9 1234 5678"
                      value={newAdvData.phone}
                      onChange={e => setNewAdvData({ ...newAdvData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">RUT (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: 18.456.789-0"
                      value={newAdvData.rut}
                      onChange={e => setNewAdvData({ ...newAdvData, rut: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="cliente@gmail.com"
                      value={newAdvData.email}
                      onChange={e => setNewAdvData({ ...newAdvData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Contacto de Emergencia</label>
                    <input
                      type="text"
                      placeholder="Nombre y relación (Ej: Carlos - Hermano)"
                      value={newAdvData.emergency_contact_name}
                      onChange={e => setNewAdvData({ ...newAdvData, emergency_contact_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Teléfono Emergencia</label>
                    <input
                      type="text"
                      placeholder="+56 9 8765 4321"
                      value={newAdvData.emergency_contact_phone}
                      onChange={e => setNewAdvData({ ...newAdvData, emergency_contact_phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowNewAdventurerForm(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Volver a Búsqueda
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow"
                  >
                    Guardar & Continuar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: EXPEDICIÓN & CUPOS */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-emerald-400" /> Selección de la Expedición
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Elige la cumbre o experiencia que el cliente desea contratar.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Aventurero:</span>
                <span className="text-sm font-bold text-white">
                  {selectedAdventurer?.first_name} {selectedAdventurer?.last_name}
                </span>
              </div>
            </div>

            {/* Buscador de expediciones */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar cumbre o expedición (ej: Manquehuito, Pochoco, Pintor, Plomo)..."
                  value={adventureSearch}
                  onChange={e => setAdventureSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0">
                {adventures.length} experiencias disponibles
              </span>
            </div>

            {/* Catálogo de Expediciones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {adventures
                .filter(exp => adventureSearch === '' || exp.title.toLowerCase().includes(adventureSearch.toLowerCase()) || exp.category.toLowerCase().includes(adventureSearch.toLowerCase()))
                .map(exp => {
                  const isSelected = selectedExpedition.id === exp.id;
                  return (
                    <div
                      key={exp.id}
                      onClick={() => {
                        setSelectedExpedition(exp);
                        setMeetingTime(exp.meeting_time);
                        setMeetingPoint(exp.meeting_point);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 relative ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                          : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                          {exp.category}
                        </span>
                        <span className="text-sm font-black text-white font-mono">
                          ${exp.base_price_clp.toLocaleString('es-CL')}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-100 leading-snug">
                        {exp.title}
                      </h3>

                      <div className="text-[11px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-800/80">
                        <div>⏱️ Duración: {exp.duration_text}</div>
                        <div>🏔️ Dificultad: {exp.difficulty}</div>
                        <div>📍 Punto: {exp.meeting_point}</div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Configuración de Cupos y Equipamiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              {/* Cupos */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Número de Cupos (Aventureros en Cordada)
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setPaxCount(Math.max(1, paxCount - 1))}
                    className="w-10 h-10 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-lg text-white"
                  >
                    -
                  </button>
                  <span className="text-2xl font-black text-white font-mono w-12 text-center">
                    {paxCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPaxCount(Math.min(10, paxCount + 1))}
                    className="w-10 h-10 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-lg text-white"
                  >
                    +
                  </button>
                  <span className="text-xs text-slate-400">
                    (${selectedExpedition.base_price_clp.toLocaleString('es-CL')} c/u) ={' '}
                    <strong className="text-emerald-400 font-mono">
                      ${baseTotal.toLocaleString('es-CL')} CLP
                    </strong>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Grupos de cordada reducidos (máx 8 a 10 pax) para resguardar la seguridad técnica.
                </p>
              </div>

              {/* Renta de Equipo Opcional */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Equipamiento Adicional en Préstamo
                </label>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Bastones de Trekking ($4.000)</span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={gearRental.poles_count}
                      onChange={e => setGearRental({ ...gearRental, poles_count: Number(e.target.value) || 0 })}
                      className="w-16 bg-slate-900 border border-slate-800 rounded p-1 text-right text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Linterna Frontal Petzl ($3.000)</span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={gearRental.headlamp_count}
                      onChange={e => setGearRental({ ...gearRental, headlamp_count: Number(e.target.value) || 0 })}
                      className="w-16 bg-slate-900 border border-slate-800 rounded p-1 text-right text-xs font-mono"
                    />
                  </div>
                </div>
                {gearTotal > 0 && (
                  <div className="text-right text-xs text-emerald-400 font-mono pt-1">
                    +${gearTotal.toLocaleString('es-CL')} equipo adicional
                  </div>
                )}
              </div>
            </div>

            {/* Total acumulado */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Volver a Aventurero
              </button>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Subtotal</span>
                  <span className="text-xl font-black text-white font-mono">
                    ${totalAmount.toLocaleString('es-CL')} CLP
                  </span>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40"
                >
                  Continuar a Agendar Fecha <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: AGENDAMIENTO DE FECHA */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" /> Agendamiento de la Expedición
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Define la fecha del ascenso, horario de salida y punto de reunión de la cordada.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">{selectedExpedition.title}</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {paxCount} cupo(s)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Fecha y Atajos */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-slate-300 font-bold uppercase tracking-wider">
                  Fecha del Ascenso *
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setScheduledDate(nextSaturday)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[11px]"
                  >
                    Próximo Sábado
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date(nextSaturday);
                      d.setDate(d.getDate() + 1);
                      setScheduledDate(d.toISOString().split('T')[0]);
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[11px]"
                  >
                    Próximo Domingo
                  </button>
                </div>
              </div>

              {/* Horario y Liderazgo */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                    Hora de Encuentro
                  </label>
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={e => setMeetingTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                    placeholder="Ej: 18:30 hrs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                    Liderazgo de Cordada Asignado
                  </label>
                  <select
                    value={guideAssigned}
                    onChange={e => setGuideAssigned(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium"
                  >
                    {GUIDES_LIST.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Punto de Encuentro */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-slate-300 font-bold uppercase tracking-wider">
                  Punto de Encuentro Oficial
                </label>
                <input
                  type="text"
                  value={meetingPoint}
                  onChange={e => setMeetingPoint(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Ej: Estacionamiento Acceso Vía Roja, Lo Barnechea"
                />
              </div>

              {/* Notas del agendamiento */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-slate-300 font-bold uppercase tracking-wider">
                  Notas de Operación / Requerimientos Especiales
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Ej: Cliente sube con su hijo adolescente; solicita bastones para ambos."
                />
              </div>
            </div>

            {/* Botones de navegación */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Volver a Expedición
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                Continuar al Cobro <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: COBRO & CONTROL DE PAGO */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" /> Control de Pago Presencial
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Registra el ingreso en caja o banco, o el abono del 50% para asegurar el cupo.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Contrato</span>
                <span className="text-2xl font-black text-white font-mono">
                  ${totalAmount.toLocaleString('es-CL')} CLP
                </span>
              </div>
            </div>

            {/* Cupones de Descuento & Premios / Sorteos */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Cupón de Descuento / Premios y Sorteos
                </label>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-red-400 hover:text-red-300 underline"
                  >
                    Quitar cupón
                  </button>
                )}
              </div>

              {!appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="Ej: SORTEO2026, PREMIO100, WILD10K..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono uppercase text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCodeInput.trim()}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors"
                    >
                      {isValidatingCoupon ? 'Validando...' : 'Aplicar'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-400 font-mono">{couponError}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 font-mono">Sugeridos:</span>
                    <button
                      type="button"
                      onClick={() => setCouponCodeInput('SORTEO2026')}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-400/50"
                    >
                      SORTEO2026 (-20%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponCodeInput('PREMIO100')}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-400/50"
                    >
                      PREMIO100 (100% Gratis)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponCodeInput('WILD10K')}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-400/50"
                    >
                      WILD10K (-$10.000)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-300 text-sm">{appliedCoupon.code}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                        {appliedCoupon.campaign_name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 block">
                      Subtotal original: ${(subtotalBeforeDiscount).toLocaleString('es-CL')} CLP
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400 font-mono block">
                      -${appliedCoupon.discount_amount.toLocaleString('es-CL')} CLP
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Descuento aplicado</span>
                  </div>
                </div>
              )}
            </div>

            {/* Plan de Pago */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. Modalidad de Cobro
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div
                  onClick={() => setPaymentPlan('total')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentPlan === 'total'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500'
                      : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>100% Pagado Total</span>
                    <span className="text-emerald-400 font-mono">${totalAmount.toLocaleString('es-CL')}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Cupo 100% asegurado y liquidado. Sin saldo pendiente.
                  </p>
                </div>

                <div
                  onClick={() => setPaymentPlan('deposit_50')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentPlan === 'deposit_50'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500'
                      : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>Abono Reserva (50%)</span>
                    <span className="text-amber-400 font-mono">
                      ${Math.round(totalAmount * 0.5).toLocaleString('es-CL')}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Paga la mitad hoy; el saldo restante se cobra antes de la salida.
                  </p>
                </div>

                <div
                  onClick={() => setPaymentPlan('on_site')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentPlan === 'on_site'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500'
                      : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>Pago en Terreno (0%)</span>
                    <span className="text-rose-400 font-mono">$0 hoy</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Se agenda la fecha y el cliente pagará el 100% en el punto de encuentro.
                  </p>
                </div>
              </div>
            </div>

            {/* Medio de Pago */}
            {paymentPlan !== 'on_site' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  2. Medio de Pago Real
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {[
                    { id: 'card_pos', name: '💳 Tarjeta POS Físico', desc: 'Transbank / MP Point' },
                    { id: 'transfer', name: '📲 Transferencia', desc: 'Comprobante verificado' },
                    { id: 'cash', name: '💵 Efectivo en Caja', desc: 'Billete en mano' },
                    { id: 'mixed', name: '🔄 Pago Mixto', desc: 'Parte efectivo, parte tarjeta' }
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as PaymentMethodType)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500'
                          : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-white text-xs">{m.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Campos condicionales */}
                {paymentMethod === 'transfer' && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <label className="text-[11px] text-slate-400 font-semibold">
                      N° de Comprobante / Referencia de Transferencia
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Op-849201 Banco de Chile"
                      value={transferRef}
                      onChange={e => setTransferRef(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white font-mono"
                    />
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                        Efectivo Recibido
                      </label>
                      <input
                        type="number"
                        placeholder="Monto entregado por cliente"
                        value={cashTendered || ''}
                        onChange={e => setCashTendered(Number(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                        Vuelto a Entregar
                      </label>
                      <div className="text-sm font-bold text-emerald-400 font-mono py-2">
                        ${changeDue.toLocaleString('es-CL')} CLP
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resumen Financiero de la Transacción */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total de la Expedición ({paxCount} pax):</span>
                <span className="font-mono text-white">${totalAmount.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-400 font-bold">
                <span>Monto a Cobrar Hoy:</span>
                <span className="font-mono">${paidAmount.toLocaleString('es-CL')} CLP</span>
              </div>
              {balanceAmount > 0 && (
                <div className="flex justify-between text-xs text-amber-400 font-bold pt-1 border-t border-slate-800">
                  <span>Saldo Pendiente (a cobrar en punto de encuentro):</span>
                  <span className="font-mono">${balanceAmount.toLocaleString('es-CL')} CLP</span>
                </div>
              )}
            </div>

            {/* Botones de navegación */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Volver a Agendamiento
              </button>

              <button
                onClick={handleFinalizeSale}
                disabled={isSubmitting}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-black flex items-center gap-2 shadow-xl shadow-emerald-950/50 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isSubmitting ? 'Procesando Venta...' : 'Confirmar & Emitir Ticket'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: TICKET & VOUCHER DE CORDADA */}
        {/* ========================================================================= */}
        {currentStep === 5 && completedSale && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white">
                ¡Expedición Agendada y Cobrada con Éxito!
              </h2>
              <p className="text-slate-400 text-xs">
                La venta fue registrada en el libro mayor (<code className="text-emerald-400">{completedSale.internal_id}</code>) y el cupo está bloqueado en el calendario.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />
              
              <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                    Santiago Hiking by Gaz_Style
                  </div>
                  <div className="text-base font-black text-white mt-0.5">
                    Ticket de Cordada Oficial
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-1 bg-slate-900 text-slate-300 rounded border border-slate-800 font-bold">
                  {completedSale.internal_id}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Aventurero:</span>
                  <span className="font-bold text-white">{completedSale.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expedición:</span>
                  <span className="font-bold text-white text-right max-w-[200px] truncate">
                    {completedSale.expedition_title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fecha del Ascenso:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {completedSale.scheduled_date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hora de Encuentro:</span>
                  <span className="font-mono text-white">{meetingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Punto de Encuentro:</span>
                  <span className="text-right text-slate-300 max-w-[180px] truncate">
                    {meetingPoint}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cupos:</span>
                  <span className="font-bold text-white font-mono">{completedSale.pax_count} pax</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Medio de Pago:</span>
                  <span className="font-semibold text-slate-200 capitalize">
                    {completedSale.payment_method.replace('_', ' ')}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-white text-sm">
                    <span>Total:</span>
                    <span className="font-mono">${completedSale.total_amount.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Pagado:</span>
                    <span className="font-mono">${completedSale.paid_amount.toLocaleString('es-CL')}</span>
                  </div>
                  {completedSale.balance > 0 && (
                    <div className="flex justify-between text-xs text-amber-400 font-bold">
                      <span>Saldo Pendiente:</span>
                      <span className="font-mono">${completedSale.balance.toLocaleString('es-CL')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Estado de Envío de Correo */}
            {completedSale.customer_email && (
              <div className="max-w-md mx-auto p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-white block font-bold">Correo de Confirmación</span>
                    <span className="text-[11px] text-slate-400">{completedSale.customer_email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isResendingEmail}
                  onClick={async () => {
                    setIsResendingEmail(true);
                    try {
                      const res = await resendTicketEmailAction({
                        to: completedSale.customer_email!,
                        name: completedSale.customer_name,
                        adventureTitle: completedSale.expedition_title,
                        departureDate: completedSale.scheduled_date,
                        meetingPoint: meetingPoint,
                        meetingTime: meetingTime,
                        totalPaid: `$${completedSale.paid_amount.toLocaleString('es-CL')} CLP`,
                        ticketId: completedSale.internal_id
                      });
                      if (res.success) {
                        alert('¡Expedition Pass reenviado exitosamente por correo!');
                        setEmailStatus('Expedition Pass enviado exitosamente ✅');
                      } else {
                        alert('Error al reenviar correo: ' + res.error);
                      }
                    } catch (e: any) {
                      alert('Error al reenviar correo.');
                    } finally {
                      setIsResendingEmail(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/30 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isResendingEmail ? 'Enviando...' : 'Reenviar Correo'}
                </button>
              </div>
            )}

            {/* Acciones del Ticket */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${completedSale.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <Share2 className="w-4 h-4" /> Enviar Comprobante por WhatsApp
              </a>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Imprimir Comprobante
              </button>

              <button
                onClick={handleResetWizard}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Nueva Atención
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
