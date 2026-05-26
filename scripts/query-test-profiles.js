const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkProfiles() {
    console.log('Querying test profiles:');
    const usernames = ['western', 'eastern', 'southern'];
    
    for (const username of usernames) {
        console.log(`\n=== Profile: ${username} ===`);
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();
            
        if (pError) {
            console.error(`Error fetching profile: ${pError.message}`);
            continue;
        }
        
        console.log('Profile Details:', {
            id: profile.id,
            username: profile.username,
            full_name: profile.full_name,
            account_type: profile.account_type,
            subscription_status: profile.subscription_status
        });
        
        const { data: settings, error: sError } = await supabase
            .from('site_settings')
            .select('*')
            .eq('user_id', profile.id)
            .single();
            
        if (sError) {
            console.error(`Error fetching site settings: ${sError.message}`);
        } else {
            console.log('Site Settings:', {
                theme: settings.theme,
                site_title: settings.site_title,
                site_bio: settings.site_bio
            });
        }
    }
}

checkProfiles();
