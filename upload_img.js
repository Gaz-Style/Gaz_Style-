const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://gbigguuhpzjqvfjgypmi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdndXVocHpqcXZmamd5cG1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQyMTgxOSwiZXhwIjoyMTA2OTk3ODE5fQ.VD5OaAw_8b0rsoMhCqnUk6cgnvazCaDYXyjb0W6kqj8'
);

async function uploadAndSetImage() {
  try {
    const filePath = 'C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\43734b58-5970-4d3c-8ea7-287d5719676b\\wildtrek_sunset_1791498212949.png';
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = 'wildtrek_sunset_' + Date.now() + '.png';

    console.log('Uploading image to Supabase storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
        console.error('Storage error (might not exist):', uploadError);
        console.log('Falling back to a known Unsplash URL...');
        
        // Fallback to a stunning Unsplash sunset mountain/city URL if bucket fails
        const fallbackUrl = 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=2800&auto=format&fit=crop';
        await updateDatabase(fallbackUrl);
        return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;
    console.log('Image uploaded successfully:', imageUrl);
    
    await updateDatabase(imageUrl);

  } catch (err) {
    console.error('Error:', err);
  }
}

async function updateDatabase(imageUrl) {
    console.log('Updating database for WildTrek...');
    const { data, error } = await supabase
      .from('adventures_catalog')
      .update({ image_url: imageUrl })
      .ilike('title', '%WildTrek%');

    if (error) {
      console.error('Database update error:', error);
    } else {
      console.log('Database updated successfully!');
    }
}

uploadAndSetImage();
