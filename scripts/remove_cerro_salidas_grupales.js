const fs = require('fs');
const path = require('path');
const { createClient } = require(path.join(__dirname, '..', 'node_modules', '@supabase', 'supabase-js'));

const env = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        env[key] = val;
      }
    }
  });
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('--- Eliminando "Cerro" de salidas grupales en Supabase ---');
  const { data: routes, error } = await supabase
    .from('adventures_catalog')
    .select('id, title, vertical_type, category')
    .or('vertical_type.eq.salidas_grupales,category.eq.grupales');

  if (error) {
    console.error('Error fetching routes:', error.message);
    return;
  }

  for (const r of routes) {
    if (/^cerro\s+/i.test(r.title)) {
      const newTitle = r.title.replace(/^cerro\s+/i, '').trim();
      const { error: updateError } = await supabase
        .from('adventures_catalog')
        .update({ title: newTitle })
        .eq('id', r.id);

      if (updateError) {
        console.error(`Error actualizando ID ${r.id}:`, updateError.message);
      } else {
        console.log(`✓ "${r.title}" -> "${newTitle}"`);
      }
    }
  }

  console.log('\n--- Estado final de Salidas Grupales ---');
  const { data: updated } = await supabase
    .from('adventures_catalog')
    .select('title, vertical_type')
    .or('vertical_type.eq.salidas_grupales,category.eq.grupales');
  updated.forEach(u => console.log(`• ${u.title}`));
}

run();
