import React from 'react';
import CRMClient from './CRMClient';
import { getAdventurers } from './actions';

export const dynamic = 'force-dynamic';

export default async function CRMPage() {
    const adventurers = await getAdventurers();
    return <CRMClient adventurers={adventurers} />;
}
