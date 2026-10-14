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

async function syncVerticals() {
  const { data: routes, error } = await supabase.from('adventures_catalog').select('id, title, category, vertical_type');
  if (error) {
    console.error('Error fetching routes:', error);
    return;
  }

  console.log(`Analyzing ${routes.length} routes...`);

  for (const r of routes) {
    let targetVertical = 'salidas_grupales';
    let targetCategory = r.category;

    if (r.category === 'high_mountain' || r.vertical_type === 'high_mountain' || r.title.toLowerCase().includes('plomo') || r.title.toLowerCase().includes('leonera') || r.title.toLowerCase().includes('volcán san josé') || r.title.toLowerCase().includes('volcan san jose')) {
      targetVertical = 'high_mountain';
      targetCategory = 'high_mountain';
    } else if (r.category === 'expedition_pass' || r.title.toLowerCase().includes('expedition pass') || r.title.toLowerCase().includes('vip')) {
      targetVertical = 'expedition_pass';
      targetCategory = 'expedition_pass';
    } else if (r.category === 'desafios' || r.category === 'Desafío' || r.vertical_type === 'challenges' || r.title.toLowerCase().includes('desafío') || r.title.toLowerCase().includes('desafio') || r.title.toLowerCase().includes('provincia') || r.title.toLowerCase().includes('ramón') || r.title.toLowerCase().includes('ramon') || r.title.toLowerCase().includes('triple corona') || r.title.toLowerCase().includes('la cruz') || r.title.toLowerCase().includes('carpa') || r.title.toLowerCase().includes('buitrero')) {
      targetVertical = 'travesias_desafios';
      targetCategory = 'travesias_desafios';
    } else {
      targetVertical = 'salidas_grupales';
      targetCategory = 'salidas_grupales';
    }

    if (r.vertical_type !== targetVertical || r.category !== targetCategory) {
      const { error: updateErr } = await supabase
        .from('adventures_catalog')
        .update({ vertical_type: targetVertical, category: targetCategory })
        .eq('id', r.id);
      
      if (updateErr) {
        console.error(`Error updating ${r.title}:`, updateErr.message);
      } else {
        console.log(`Updated [${r.title.substring(0, 30)}] -> vertical: ${targetVertical}, category: ${targetCategory}`);
      }
    } else {
      console.log(`OK [${r.title.substring(0, 30)}] already ${targetVertical}`);
    }
  }

  console.log('Sync finished successfully.');
}

syncVerticals();
