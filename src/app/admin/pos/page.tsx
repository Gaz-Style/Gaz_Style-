import React from 'react';
import POSClient from './POSClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Punto de Venta & Agendamiento (POS) | Admin Santiago Hiking',
  description: 'Punto de venta presencial para agendamiento de fechas de ascensos y control de cobros de cordada.'
};

export default function POSPage() {
  return <POSClient />;
}
