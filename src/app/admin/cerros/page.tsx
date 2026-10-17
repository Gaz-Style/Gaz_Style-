import React from 'react';
import { getAllPeaksFromDb, supabase } from '@/lib/atlasService';
import CerrosAdminClient from './CerrosAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminCerrosPage() {
  const peaks = await getAllPeaksFromDb();

  // Also fetch trailheads count and trails count for admin metrics
  const { data: trailheads } = await supabase.from('trailheads').select('*').order('name');
  const { data: trails } = await supabase.from('trails').select('*').order('name');

  return (
    <CerrosAdminClient 
      initialPeaks={peaks} 
      initialTrailheads={trailheads || []} 
      initialTrails={trails || []} 
    />
  );
}
