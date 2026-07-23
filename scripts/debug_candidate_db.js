const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: user } = await supabaseAdmin.from("users").select("id").eq("role", "candidate").limit(1).single();
  
  if (!user) {
    console.log("No candidate found");
    return;
  }
  
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(`
      *,
      candidate_profiles:candidate_profiles!candidate_profiles_user_id_fkey (*),
      applications (
        id, status, created_at,
        jobs (id, title, companies (name))
      )
    `)
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("ERROR:", error);
  } else {
    console.log("SUCCESS:", data);
  }
}

run();
