const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const { data: tables } = await supabaseAdmin.from('information_schema.tables').select('table_name').eq('table_schema', 'public');
  console.log("Tables:", tables?.map(t => t.table_name));
  
  // Check applications table columns
  const { data: appCols } = await supabaseAdmin.from('information_schema.columns').select('column_name, data_type').eq('table_name', 'applications');
  console.log("App cols:", appCols);
  
  // Check jobs table columns
  const { data: jobCols } = await supabaseAdmin.from('information_schema.columns').select('column_name, data_type').eq('table_name', 'jobs');
  console.log("Job cols:", jobCols);
}
test();
