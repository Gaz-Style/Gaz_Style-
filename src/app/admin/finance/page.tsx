import React from 'react';
import FinanceClient from './FinanceClient';
import { getFinancialSummary } from './actions';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
    const data = await getFinancialSummary();
    return <FinanceClient data={data} />;
}
