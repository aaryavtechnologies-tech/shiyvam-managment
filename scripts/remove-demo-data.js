const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDemoData() {
  console.log("Starting removal of demo data...");

  // 1. Find all demo users
  const demoEmails = [
    'employer@demo.com',
    'candidate1@demo.com',
    'candidate2@demo.com',
    'candidate3@demo.com',
    'candidate@demo.com'
  ];

  try {
    // List all users to find the demo ones
    const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) {
      console.error("Error listing users:", listErr);
      return;
    }

    const demoUsers = users.filter(u => demoEmails.includes(u.email) || u.email.endsWith('@demo.com') && u.email !== 'admin@demo.com');

    for (const user of demoUsers) {
      console.log(`Deleting user: ${user.email} (${user.id})`);
      const { error: delErr } = await supabase.auth.admin.deleteUser(user.id);
      if (delErr) {
        console.error(`Failed to delete ${user.email}:`, delErr);
      } else {
        console.log(`Successfully deleted ${user.email}`);
      }
    }

    // 2. Also delete any orphaned demo jobs just in case
    const { error: jobErr } = await supabase
      .from("jobs")
      .delete()
      .like('title', '%Demo%');
      
    if (jobErr) console.log("Error deleting demo jobs:", jobErr);
    else console.log("Deleted demo jobs (if any orphaned).");

    // 3. Delete any orphaned Demo Tech Corp companies
    const { error: compErr } = await supabase
      .from("companies")
      .delete()
      .like('name', '%Demo%');

    if (compErr) console.log("Error deleting demo companies:", compErr);
    else console.log("Deleted demo companies (if any orphaned).");

    console.log("Demo data removal complete!");

  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

removeDemoData();
