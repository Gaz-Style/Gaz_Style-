import React from 'react';
import CouponsClient from './CouponsClient';
import { getCouponsAction } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Códigos de Descuento & Premios | Admin Santiago Hiking',
  description: 'Gestión de cupones para sorteos, premios de comunidad y promociones de cordada.'
};

export default async function CouponsPage() {
  const coupons = await getCouponsAction();
  return <CouponsClient initialCoupons={coupons} />;
}
