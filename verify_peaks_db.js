const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const envConfig = {};
envFile.split('\n').forEach(l => {
  const [k, ...v] = l.trim().split('=');
  if (k && v.length) envConfig[k.trim()] = v.join('=').trim().replace(/^['"]|['"]$/g, '');
});
const { createClient } = require('@supabase/supabase-js');
const s = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: peaks, error: pErr } = await s.from('peaks').select('id, name, altitude_msnm, slug');
  const { data: trailheads, error: thErr } = await s.from('trailheads').select('id, name, slug');
  const { data: routes, error: rErr } = await s.from('routes').select('id, variant_name, distance_km, elevation_gain_m');

  console.log('=== VERIFICACIÓN EN VIVO SUPABASE ===');
  console.log(`Cumbres (peaks): ${peaks ? peaks.length : pErr?.message}`);
  if (peaks) peaks.forEach(p => console.log(`  • [${p.slug}] ${p.name} (${p.altitude_msnm}m)`));

  console.log(`\nAccesos (trailheads): ${trailheads ? trailheads.length : thErr?.message}`);
  if (trailheads) trailheads.forEach(th => console.log(`  • ${th.name} (${th.slug})`));

  console.log(`\nVariantes (routes): ${routes ? routes.length : rErr?.message}`);
  if (routes) routes.forEach(r => console.log(`  • ${r.variant_name} (${r.distance_km} km / +${r.elevation_gain_m}m)`));
}

check().catch(console.error);
