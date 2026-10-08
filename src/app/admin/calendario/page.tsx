import React from 'react';
import CalendarClient from './CalendarClient';
import { getDepartures, getActiveAdventures } from './actions';

export const dynamic = 'force-dynamic';

export default async function CalendarioPage() {
    const [departures, activeAdventures] = await Promise.all([
        getDepartures(),
        getActiveAdventures()
    ]);
    
    return <CalendarClient departures={departures} adventuresCatalog={activeAdventures} />;
}
