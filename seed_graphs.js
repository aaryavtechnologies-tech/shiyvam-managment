const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seed() {
  console.log("Starting seed...");
  
  // Create an employer to own the jobs
  const { data: employerData, error: empErr } = await supabase.from('users').insert({
    email: 'fake_employer_for_seed@example.com',
    full_name: 'Mock Employer',
    role: 'employer',
    created_at: new Date().toISOString()
  }).select();
  
  if (empErr) {
    console.error("Failed to create mock employer", empErr);
    // Maybe an employer already exists? Let's try to get one.
  }
  
  const { data: existingEmp } = await supabase.from('users').select('id').eq('role', 'employer').limit(1);
  const employerId = existingEmp && existingEmp.length > 0 ? existingEmp[0].id : null;
  
  if (!employerId) {
     console.error("No employer ID found, aborting job seed.");
     return;
  }
  
  const users = [];
  const jobs = [];
  const departments = ['Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations'];
  
  // Generate data for the past 6 months
  for (let i = 0; i < 150; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 180));
    
    users.push({
      email: `mock${i}_${Date.now()}@example.com`,
      full_name: `Mock User ${i}`,
      role: Math.random() > 0.8 ? 'employer' : 'candidate',
      created_at: date.toISOString()
    });
    
    jobs.push({
      title: `Mock Job ${i}`,
      employer_id: employerId,
      department: departments[Math.floor(Math.random() * departments.length)],
      status: 'published',
      created_at: date.toISOString()
    });
  }
  
  const { error: err1 } = await supabase.from('users').insert(users);
  console.log("Users seed error:", err1);
  
  const { error: err2 } = await supabase.from('jobs').insert(jobs);
  console.log("Jobs seed error:", err2);
  
  console.log("Seeding complete. Check graphs!");
}

seed();
