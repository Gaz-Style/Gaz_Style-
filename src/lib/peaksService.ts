import { createClient } from '@supabase/supabase-js';
import { Peak, PEAKS_DIRECTORY } from '@/data/peaksDirectory';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function getPeaks(): Promise<Peak[]> {
  if (!supabase) return PEAKS_DIRECTORY;

  try {
    const { data: peaks, error: pErr } = await supabase
      .from('peaks')
      .select(`
        *,
        trailheads (
          *,
          routes (*)
        )
      `)
      .order('altitude_msnm', { ascending: false });

    if (pErr || !peaks || peaks.length === 0) {
      return PEAKS_DIRECTORY;
    }

    return peaks as Peak[];
  } catch (error) {
    console.error('Error fetching peaks from Supabase, falling back to directory:', error);
    return PEAKS_DIRECTORY;
  }
}

export async function getPeakBySlug(slug: string): Promise<Peak | null> {
  if (!supabase) {
    return PEAKS_DIRECTORY.find(p => p.slug === slug) || null;
  }

  try {
    const { data: peak, error } = await supabase
      .from('peaks')
      .select(`
        *,
        trailheads (
          *,
          routes (*)
        )
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (error || !peak) {
      return PEAKS_DIRECTORY.find(p => p.slug === slug) || null;
    }

    return peak as Peak;
  } catch (error) {
    console.error(`Error fetching peak ${slug} from Supabase:`, error);
    return PEAKS_DIRECTORY.find(p => p.slug === slug) || null;
  }
}
