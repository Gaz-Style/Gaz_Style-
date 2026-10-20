import React from 'react';
import OKRsClient from './OKRsClient';
import { getOKRs } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Metodología OKRs | Admin Santiago Hiking',
  description: 'Cuadro de mando y seguimiento mensual de Objetivos y Resultados Clave (OKRs) para Santiago Hiking.'
};

export default async function OKRsPage() {
  const initialData = await getOKRs();
  return <OKRsClient initialData={initialData} />;
}
