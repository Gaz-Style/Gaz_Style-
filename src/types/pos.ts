export interface AdventurerData {
  id?: string;
  first_name: string;
  last_name: string;
  rut?: string;
  email: string;
  phone: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  mountain_experience_level?: 'principiante' | 'intermedio' | 'avanzado';
}

export interface ExpeditionOption {
  id: string;
  title: string;
  category: string;
  duration_text: string;
  base_price_clp: number;
  price_usd?: number;
  meeting_point: string;
  meeting_time: string;
  difficulty: string;
}

export type PaymentMethodType = 'cash' | 'transfer' | 'card_pos' | 'webpay' | 'mixed';
export type PaymentPlanType = 'total' | 'deposit_50' | 'on_site';

export interface POSSalePayload {
  adventurer: AdventurerData;
  expedition: ExpeditionOption;
  pax_count: number;
  gear_rental: {
    poles_count: number; // bastones
    headlamp_count: number; // linterna frontal
    backpack_count: number; // mochila
  };
  scheduled_date: string;
  meeting_time: string;
  meeting_point: string;
  guide_assigned: string;
  notes?: string;
  
  // Finanzas
  total_amount: number;
  paid_amount: number;
  balance: number;
  discount_coupon?: string;
  discount_amount?: number;
  payment_plan: PaymentPlanType;
  payment_method: PaymentMethodType;
  transfer_reference?: string;
  cash_tendered?: number;
  change_due?: number;
  seller_name?: string;
}

export interface SaleLedgerRecord {
  id: string;
  internal_id: string; // e.g. SH-202610-001
  adventurer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  expedition_title: string;
  scheduled_date: string;
  pax_count: number;
  total_amount: number;
  paid_amount: number;
  balance: number;
  payment_status: 'completed' | 'partial' | 'pending' | 'cancelled';
  payment_method: PaymentMethodType;
  transfer_reference?: string;
  seller_name?: string;
  notes?: string;
  created_at: string;
}
