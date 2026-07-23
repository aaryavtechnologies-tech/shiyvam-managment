const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// using anon key to simulate unauthenticated / candidate read
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: jobs, error } = await supabase.from("jobs").select("id").limit(1);
  console.log("Anon jobs fetch:", jobs?.length, error);
}

run();
