const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: jobs } = await supabaseAdmin.from("jobs").select("*");
  console.log("Jobs count:", jobs.length);
  jobs.forEach(j => {
    console.log(`Job ${j.id}: company_id=${j.company_id}, employer_id=${j.employer_id}`);
  });
}

run();
