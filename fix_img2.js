const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbigguuhpzjqvfjgypmi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdndXVocHpqcXZmamd5cG1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQyMTgxOSwiZXhwIjoyMTA2OTk3ODE5fQ.VD5OaAw_8b0rsoMhCqnUk6cgnvazCaDYXyjb0W6kqj8'
);

async function setLocalImage() {
    const localUrl = '/images/wildtrek_sunset.png';
    
    console.log('Updating database for WildTrek...');
    const { data, error } = await supabase
      .from('adventures_catalog')
      .update({ image_url: localUrl })
      .ilike('title', '%WildTrek%');

    if (error) {
      console.error('Database update error:', error);
    } else {
      console.log('Database updated successfully with local image!');
    }
}

setLocalImage();
