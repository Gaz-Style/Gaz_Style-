import React from 'react';
import RoutesClient from './RoutesClient';
import { getAdventuresWithCosts } from './actions';

export const dynamic = 'force-dynamic';

export default async function CreadorRutasPage({ searchParams }: { searchParams?: Promise<{ vertical?: string }> }) {
    const params = await searchParams;
    const adventures = await getAdventuresWithCosts();
    
    return <RoutesClient initialRoutes={adventures} initialVertical={params?.vertical || 'all'} />;
}
