import React from 'react';
import SalesClient from './SalesClient';
import { getSalesLedger } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Planilla de Ventas & Libro Mayor | Admin Santiago Hiking',
  description: 'Control de pagos reales, abonos, saldos pendientes y trazabilidad financiera de cordadas.'
};

export default async function SalesPage() {
  const initialSales = await getSalesLedger();
  return <SalesClient initialSales={initialSales} />;
}
