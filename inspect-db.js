const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ebwvhneiinvjxlitxxkh.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVid3ZobmVpaW52anhsaXR4eGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQzNTk5NCwiZXhwIjoyMDg1MDExOTk0fQ.mbPDyrtWibcAkweExrmPpxXgrxlJnrnY71JLYSVv7o8';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function inspect() {
    console.log('Checking "wallets" table...');
    const { data, error } = await supabase.from('wallets').select('*').limit(1);
    if (error) {
        console.log('Result "wallets":', error.message);
    } else {
        console.log('Result "wallets": Exists. Rows:', data.length);
        if (data.length > 0) console.log('Sample:', data[0]);
    }

    console.log('Checking "user_wallets" table...');
    const { data: data2, error: error2 } = await supabase.from('user_wallets').select('*').limit(1);
    if (error2) {
        console.log('Result "user_wallets":', error2.message);
    } else {
        console.log('Result "user_wallets": Exists. Rows:', data2.length);
        if (data2.length > 0) console.log('Sample:', data2[0]);
    }
}

inspect();
