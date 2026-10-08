const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => envLocal.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim();

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createUser() {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'gazstylechile@gmail.com',
      password: 'Mcruz1232',
      email_confirm: true
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        console.log('User already exists. Updating password and confirming email...');
        
        // Find user by querying auth.users is not possible via standard JS API without knowing ID, 
        // but we can try to get users list
        const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
        if (usersData && usersData.users) {
            const user = usersData.users.find(u => u.email === 'gazstylechile@gmail.com');
            if (user) {
                const { error: updateError } = await supabase.auth.admin.updateUserById(
                    user.id,
                    { password: 'Mcruz1232', email_confirm: true }
                );
                if (updateError) {
                    console.error('Failed to update existing user:', updateError);
                } else {
                    console.log('Existing user updated and email auto-confirmed.');
                }
            }
        }
      } else {
          console.error('Error creating user:', error);
      }
    } else {
      console.log('User created successfully and email auto-confirmed:', data.user.email);
    }
}
createUser();
