import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface PeakDetail {
  id: string;
  slug: string;
  name: string;
  altitude_msnm: number;
  prominence_m: number;
  massif: string;
  comunas: string[];
  basin: string;
  latitude: number;
  longitude: number;
  summary: string;
  summary_i18n?: Record<string, string>;
  panoramic_summary?: string;
  panoramic_summary_i18n?: Record<string, string>;
  history_and_cosmovision?: string;
  history_and_cosmovision_i18n?: Record<string, string>;
  search_keywords?: string[];
  cover_image_url: string;
  trail_peaks?: Array<{
    summit_order: number;
    is_main_summit: boolean;
    trails: {
      id: string;
      slug: string;
      name: string;
      trail_type: string;
      distance_km: number;
      elevation_gain_m: number;
      elevation_loss_m: number;
      max_altitude_m: number;
      avg_duration_up_hours: number;
      avg_duration_down_hours: number;
      technical_difficulty: string;
      physical_exertion: string;
      trail_surface: string;
      water_available: boolean;
      water_detail: string;
      shade_percentage: string;
      best_time_of_day: string;
      description: string;
      crux_highlights: string[];
      required_equipment: string[];
      escape_routes_info: string;
      glow_color: string;
      elevation_profile: Array<{ km: number; alt: number; label?: string }>;
      trailhead_start?: {
        name: string;
        comuna: string;
        address_description: string;
        latitude: number;
        longitude: number;
        google_maps_link: string;
        waze_deep_link: string;
        parking_type: string;
        parking_fee_clp: number;
        parking_security_tip: string;
        public_transit_info: string;
        operating_hours: string;
      };
      trailhead_end?: {
        name: string;
        comuna: string;
        address_description: string;
        google_maps_link: string;
        waze_deep_link: string;
      };
      expedition_dates?: Array<{
        id: string;
        departure_date: string;
        departure_time: string;
        title_theme: string;
        total_slots: number;
        available_slots: number;
        price_clp: number;
        price_usd: number;
        status: string;
      }>;
    };
  }>;
}


function sortPeakTrails(trailPeaks: any[]) {
  if (!trailPeaks || !Array.isArray(trailPeaks)) return;
  trailPeaks.sort((a, b) => {
    // 1. Direct summit routes first, cordon traverses last
    const aIsTraverse = a.trails?.trail_type === 'travesia_cordon' ? 1 : 0;
    const bIsTraverse = b.trails?.trail_type === 'travesia_cordon' ? 1 : 0;
    if (aIsTraverse !== bIsTraverse) return aIsTraverse - bIsTraverse;

    // 2. Main summit route first
    if (a.is_main_summit !== b.is_main_summit) return a.is_main_summit ? -1 : 1;

    // 3. Summit order ascending
    return (a.summit_order || 1) - (b.summit_order || 1);
  });
}

export async function getAllPeaksFromDb(): Promise<PeakDetail[]> {
  try {
    const { data, error } = await supabase
      .from('peaks')
      .select(`
        *,
        trail_peaks (
          summit_order,
          is_main_summit,
          trails (
            id,
            slug,
            name,
            trail_type,
            distance_km,
            elevation_gain_m,
            elevation_loss_m,
            max_altitude_m,
            avg_duration_up_hours,
            avg_duration_down_hours,
            technical_difficulty,
            physical_exertion,
            trail_surface,
            water_available,
            water_detail,
            shade_percentage,
            best_time_of_day,
            description,
            crux_highlights,
            required_equipment,
            escape_routes_info,
            glow_color,
            elevation_profile,
            trailhead_start:trailhead_start_id (*),
            trailhead_end:trailhead_end_id (*),
            expedition_dates (*)
          )
        )
      `)
      .order('altitude_msnm', { ascending: false });

    if (error) {
      console.error('Error fetching all peaks:', error);
      return [];
    }

    const peaks = (data || []) as PeakDetail[];
    peaks.forEach(p => sortPeakTrails(p.trail_peaks as any));
    return peaks;
  } catch (err) {
    console.error('Unexpected error fetching peaks:', err);
    return [];
  }
}

export function getCleanSlug(slug: string): string {
  return slug.replace(/^cerro-/, '');
}

export async function getPeakBySlugFromDb(rawSlug: string): Promise<PeakDetail | null> {
  const clean = rawSlug.replace(/^cerro-/, '');
  const possibleSlugs = [rawSlug, `cerro-${clean}`, clean];
  try {
    const { data, error } = await supabase
      .from('peaks')
      .select(`
        *,
        trail_peaks (
          summit_order,
          is_main_summit,
          trails (
            id,
            slug,
            name,
            trail_type,
            distance_km,
            elevation_gain_m,
            elevation_loss_m,
            max_altitude_m,
            avg_duration_up_hours,
            avg_duration_down_hours,
            technical_difficulty,
            physical_exertion,
            trail_surface,
            water_available,
            water_detail,
            shade_percentage,
            best_time_of_day,
            description,
            crux_highlights,
            required_equipment,
            escape_routes_info,
            glow_color,
            elevation_profile,
            trailhead_start:trailhead_start_id (*),
            trailhead_end:trailhead_end_id (*),
            expedition_dates (*)
          )
        )
      `)
      .in('slug', possibleSlugs).limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error(`Error fetching peak with slug ${rawSlug}:`, error);
      return null;
    }

    const peak = data as PeakDetail;
    sortPeakTrails(peak.trail_peaks as any);
    return peak;
  } catch (err) {
    console.error(`Unexpected error fetching peak ${rawSlug}:`, err);
    return null;
  }
}
