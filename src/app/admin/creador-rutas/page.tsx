import React from 'react';
import RoutesClient from './RoutesClient';
import { getAdventuresWithCosts } from './actions';

export const dynamic = 'force-dynamic';

export default async function CreadorRutasPage() {
    const adventures = await getAdventuresWithCosts();
    
    return <RoutesClient initialRoutes={adventures} />;
}
