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

async function list() {
  const { data, error } = await supabase.from('adventures_catalog').select('id, title, vertical_type, category, max_altitude, difficulty_level, story_paragraphs, tagline');
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  console.log(`Total: ${data.length} rutas`);
  data.forEach((r, i) => {
    const count = Array.isArray(r.story_paragraphs) ? r.story_paragraphs.length : 0;
    console.log(`${i + 1}. [${r.vertical_type}] ID: ${r.id} | ${r.title} | Story paragraphs: ${count}`);
  });
}

list();
