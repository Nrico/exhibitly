const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
    console.log('Fetching profiles...');
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log('Found profiles:', profiles.length);
    profiles.forEach(p => {
        console.log(`- ID: ${p.id}`);
        console.log(`  Email: ${p.email}`); // Email might not be in profiles depending on schema, usually it's in auth.users
        console.log(`  Username: ${p.username}`);
        console.log(`  Full Name: ${p.full_name}`);
        console.log(`  Account Type: ${p.account_type}`);
        console.log('---');
    });
}

run();
