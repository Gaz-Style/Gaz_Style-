const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbigguuhpzjqvfjgypmi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdndXVocHpqcXZmamd5cG1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQyMTgxOSwiZXhwIjoyMTA2OTk3ODE5fQ.VD5OaAw_8b0rsoMhCqnUk6cgnvazCaDYXyjb0W6kqj8'
);

async function fixImage() {
    // Foto de una persona en la cima de una montaña al atardecer
    const betterUrl = 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=2000&auto=format&fit=crop';
    
    console.log('Updating database for WildTrek...');
    const { data, error } = await supabase
      .from('adventures_catalog')
      .update({ image_url: betterUrl })
      .ilike('title', '%WildTrek%');

    if (error) {
      console.error('Database update error:', error);
    } else {
      console.log('Database updated successfully with better image!');
    }
}

fixImage();
