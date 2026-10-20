'use client';

import React, { useState } from 'react';
import { Tag, Plus, CheckCircle, XCircle, Gift, Sparkles, Trophy, Calendar, Users, Percent, DollarSign, Clock } from 'lucide-react';
import { CouponItem, createCouponAction, toggleCouponStatusAction } from './actions';

export default function CouponsClient({ initialCoupons }: { initialCoupons: CouponItem[] }) {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount' | 'free_ticket'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [maxUses, setMaxUses] = useState<string>('50');
  const [expiresAt, setExpiresAt] = useState<string>('');

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set('code', code);
      formData.set('campaign_name', campaignName);
      formData.set('discount_type', discountType);
      formData.set('discount_value', discountValue.toString());
      if (maxUses) formData.set('max_uses', maxUses);
      if (expiresAt) formData.set('expires_at', expiresAt);

      await createCouponAction(formData);

      // Local optimistic update
      const newCoupon: CouponItem = {
        id: `c-${Date.now()}`,
        code: code.trim().toUpperCase(),
        campaign_name: campaignName,
        discount_type: discountType,
        discount_value: discountValue,
        max_uses: maxUses ? Number(maxUses) : null,
        times_used: 0,
        is_active: true,
        expires_at: expiresAt || null,
        created_at: new Date().toISOString()
      };
      setCoupons([newCoupon, ...coupons]);
      setIsModalOpen(false);
      setCode('');
      setCampaignName('');
    } catch (err) {
      alert('Error al crear el cupón');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (coupon: CouponItem) => {
    await toggleCouponStatusAction(coupon.id, coupon.is_active);
    setCoupons(coupons.map(c => c.id === coupon.id ? { ...c, is_active: !c.is_active } : c));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            Marketing & Crecimiento Cordada
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
            Códigos de Descuento, Premios & Sorteos
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl font-mono">
            Administra promociones para sorteos de Instagram, alianzas de marca y bonos de comunidad. Se aplican automáticamente en el Punto de Venta (POS) y Checkout.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs font-mono flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> + Crear Nuevo Código de Premio
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
          <span className="text-[10px] font-mono uppercase text-stone-500 font-bold">Cupones Activos</span>
          <p className="text-2xl font-black text-white font-mono mt-1">
            {coupons.filter(c => c.is_active).length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
          <span className="text-[10px] font-mono uppercase text-stone-500 font-bold">Total Canjes / Usos</span>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">
            {coupons.reduce((acc, c) => acc + (c.times_used || 0), 0)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
          <span className="text-[10px] font-mono uppercase text-stone-500 font-bold">Integración POS</span>
          <p className="text-sm font-bold text-emerald-400 font-mono mt-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Conectado en Tiempo Real
          </p>
        </div>
      </div>

      {/* List of Coupons */}
      <div className="rounded-xl border border-stone-800 bg-stone-900 overflow-hidden">
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            Códigos de Descuento Vigentes ({coupons.length})
          </h3>
        </div>

        <div className="divide-y divide-stone-800/80">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-800/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-black font-mono text-white tracking-wider px-2 py-0.5 rounded bg-stone-950 border border-amber-400/30 text-amber-300">
                    {coupon.code}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    coupon.discount_type === 'free_ticket' 
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' 
                      : coupon.discount_type === 'percentage' 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {coupon.discount_type === 'free_ticket' ? '100% Gratis (Entrada)' : coupon.discount_type === 'percentage' ? `-${coupon.discount_value}% Descuento` : `-$${coupon.discount_value.toLocaleString('es-CL')} CLP`}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${coupon.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                    {coupon.is_active ? 'Activo' : 'Pausado'}
                  </span>
                </div>
                <p className="text-xs text-stone-300 font-semibold">{coupon.campaign_name}</p>
                <div className="flex items-center gap-4 text-[11px] font-mono text-stone-500">
                  <span>Usos: <strong className="text-stone-300">{coupon.times_used}</strong> {coupon.max_uses ? `/ ${coupon.max_uses}` : ''}</span>
                  {coupon.expires_at && (
                    <span>Expira: <strong className="text-stone-300">{coupon.expires_at.split('T')[0]}</strong></span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(coupon)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                    coupon.is_active 
                      ? 'bg-stone-950 hover:bg-stone-800 text-stone-400 border-stone-800' 
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {coupon.is_active ? 'Pausar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Crear Cupón */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">Nuevo Premio / Sorteo</span>
                <h3 className="text-lg font-black text-white font-mono">Crear Cupón Promocional</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-stone-300 font-bold mb-1">CÓDIGO (Ej: SORTEO2026) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="SORTEOCORDADA"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white uppercase text-sm font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">NOMBRE DE LA CAMPAÑA / SORTEO *</label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  placeholder="Ganadores sorteo Cerro Manquehuito Instagram"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">TIPO DE DESCUENTO</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed_amount">Monto Fijo ($ CLP)</option>
                    <option value="free_ticket">Ticket 100% Gratuito</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">VALOR DEL DESCUENTO</label>
                  <input
                    type="number"
                    disabled={discountType === 'free_ticket'}
                    value={discountType === 'free_ticket' ? 100 : discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">LÍMITE DE CANJES (CUPOS)</label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={e => setMaxUses(e.target.value)}
                    placeholder="Ej: 10"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">FECHA DE VENCIMIENTO</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={e => setExpiresAt(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold"
                >
                  {isSubmitting ? 'Guardando...' : 'Crear Cupón'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
