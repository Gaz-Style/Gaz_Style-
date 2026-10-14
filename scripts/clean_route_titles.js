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

const TITLE_CLEANUP_MAP = {
  // Salidas Grupales
  'Cerro Carbón · Mirador Panorámico del Parque Metropolitano': 'Cerro Carbón',
  'Cerro Pochoco · La Escuela Vertical de Santiago': 'Cerro Pochoco',
  'Cuevas del Manzano · Aventura Precordillerana': 'Cuevas del Manzano',
  'Alto del Naranjo · Bosque & Mirador de Los Andes': 'Alto del Naranjo',
  'Cerro Manquehuito Sunset · Café sobre las Nubes': 'Cerro Manquehuito Sunset',
  'Cerro Manquehue Clásico · La Cumbre Ícono': 'Cerro Manquehue',
  
  // Travesías & Desafíos
  'Cerro La Cruz 2.552m · Aristas de la Sierra': 'Cerro La Cruz 2.552m',
  'Cerro Carpa & Conchalí 2.776m · El Balcón del Arrayán': 'Cerro Carpa & Conchalí 2.776m',
  'Cerro Provincia · El Titán de la Sierra de Ramón': 'Cerro Provincia',
  'La Triple Corona Andina · 3 Cumbres en 1 Día': 'La Triple Corona Andina',
  'Cerro San Ramón 3.253m · El Techo de la Cuenca': 'Cerro San Ramón 3.253m',
  
  // High Mountain
  'Expedición Cerro El Plomo 5.424m · Apu Sagrado': 'Expedición Cerro El Plomo 5.424m',
  'Expedición Cerro Leonera 4.954m · Cancha de Carreras': 'Expedición Cerro Leonera 4.954m',
  'Expedición Volcán San José 5.856m · Cráter Activo': 'Expedición Volcán San José 5.856m',
  
  // Boutique / Pass
  'Cerro Pintor 4.180m VIP · Expedition Pass': 'Cerro Pintor 4.180m VIP',
  'Monumento Natural El Morado VIP · Expedition Pass': 'Monumento Natural El Morado VIP',
  'Cerro Manquehue Sunset · Expedition Pass': 'Cerro Manquehue Sunset VIP',
  'Glaciar Nieves Negras & Termas de Colina VIP · Expedition Pass': 'Glaciar Nieves Negras & Termas de Colina VIP',
};

async function cleanTitles() {
  console.log('--- Limpiando títulos en adventures_catalog ---');
  for (const [oldTitle, newTitle] of Object.entries(TITLE_CLEANUP_MAP)) {
    const { data, error } = await supabase
      .from('adventures_catalog')
      .update({ title: newTitle })
      .ilike('title', `%${oldTitle.split('·')[0].trim()}%`)
      .select('id, title');
    
    if (error) {
      console.error(`Error actualizando "${oldTitle}":`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✓ Actualizado a: "${newTitle}" (${data.length} fila/s)`);
    } else {
      console.log(`- No se encontró coincidencia para: "${oldTitle}"`);
    }
  }

  console.log('\n--- Verificación final de catálogo ---');
  const { data: all } = await supabase.from('adventures_catalog').select('id, title, vertical_type');
  all.forEach(a => console.log(`[${a.vertical_type}] ${a.title}`));
}

cleanTitles();
