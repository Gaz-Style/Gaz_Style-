import React from 'react';
import InventoryClient from './InventoryClient';
import { getInventory } from './actions';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    const items = await getInventory();
    return <InventoryClient items={items} />;
}
