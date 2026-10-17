import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PEAKS_DIRECTORY } from '@/data/peaksDirectory';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export const dynamic = 'force-dynamic';

function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQ = (searchParams.get('q') || '').trim();
    const cleanQ = normalizeText(rawQ);

    // 1. Obtener Cumbres desde Supabase (47 cumbres oficiales)
    let peaksResults: any[] = [];
    if (supabase) {
      try {
        const { data: peaksData, error: pErr } = await supabase
          .from('peaks')
          .select('slug, name, altitude_msnm, massif, comunas, cover_image_url, summary')
          .order('altitude_msnm', { ascending: false });

        if (!pErr && peaksData && peaksData.length > 0) {
          peaksResults = peaksData;
        }
      } catch (err) {
        console.error('Error fetching peaks in search API:', err);
      }
    }

    if (peaksResults.length === 0) {
      peaksResults = PEAKS_DIRECTORY.map(p => ({
        slug: p.slug,
        name: p.name,
        altitude_msnm: p.altitude_msnm,
        massif: p.massif,
        comunas: p.comunas,
        cover_image_url: p.cover_image_url,
        summary: p.summary
      }));
    }

    // 2. Obtener Expediciones y Rutas Guiadas desde adventures_catalog
    let adventuresResults: any[] = [];
    if (supabase) {
      try {
        const { data: advData, error: aErr } = await supabase
          .from('adventures_catalog')
          .select('id, title, category, description, difficulty_level, vertical_type, image_url, base_price, duration_text, max_altitude')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!aErr && advData && advData.length > 0) {
          adventuresResults = advData;
        } else if (aErr) {
          console.error('Error fetching adventures in search API:', aErr);
        }
      } catch (err) {
        console.error('Error fetching adventures in search API:', err);
      }
    }

    // 3. Filtrar según término de búsqueda si existe
    let filteredPeaks = peaksResults;
    let filteredAdventures = adventuresResults;

    if (cleanQ) {
      filteredPeaks = peaksResults.filter(p => {
        const nameNorm = normalizeText(p.name);
        const massifNorm = normalizeText(p.massif);
        const comunasNorm = Array.isArray(p.comunas) ? p.comunas.map((c: string) => normalizeText(c)).join(' ') : '';
        const summaryNorm = normalizeText(p.summary);
        const slugNorm = normalizeText(p.slug);
        return (
          nameNorm.includes(cleanQ) ||
          massifNorm.includes(cleanQ) ||
          comunasNorm.includes(cleanQ) ||
          summaryNorm.includes(cleanQ) ||
          slugNorm.includes(cleanQ)
        );
      });

      filteredAdventures = adventuresResults.filter(a => {
        const titleNorm = normalizeText(a.title);
        const descNorm = normalizeText(a.description);
        const catNorm = normalizeText(a.category);
        const diffNorm = normalizeText(a.difficulty_level);
        const typeNorm = normalizeText(a.vertical_type);
        return (
          titleNorm.includes(cleanQ) ||
          descNorm.includes(cleanQ) ||
          catNorm.includes(cleanQ) ||
          diffNorm.includes(cleanQ) ||
          typeNorm.includes(cleanQ)
        );
      });
    }

    return NextResponse.json({
      success: true,
      query: rawQ,
      peaks: filteredPeaks,
      adventures: filteredAdventures,
      total_peaks: peaksResults.length,
      total_adventures: adventuresResults.length
    });
  } catch (error: any) {
    console.error('Search API failure:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
