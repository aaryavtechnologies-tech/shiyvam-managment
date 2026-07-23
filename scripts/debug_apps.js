const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: apps, error } = await supabaseAdmin
      .from("applications")
      .select(`
        id, status, applied_at,
        jobs (title),
        users!candidate_id (full_name)
      `);
      
  console.log("error:", error);
  console.log("data:", apps);
}

run();
