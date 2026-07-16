const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dmadyjivioztkrxeolyj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtYWR5aml2aW96dGtyeGVvbHlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzY2NTcwMywiZXhwIjoyMDk5MjQxNzAzfQ.qEe-B-Vx710h_WQVjj6m1E0fxn_nm0txTS53KdQ_KKk';

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('Creating auth user...');
  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email: 'Shivam@shivyamservices.com',
    password: 'Shivyam@1425',
    email_confirm: true,
  });

  if (authError) {
    console.error('Auth Error:', authError.message);
  }

  let userId;
  if (authData && authData.user) {
     userId = authData.user.id;
  } else {
      console.log('Trying to find existing user...');
      const { data: usersData } = await adminSupabase.auth.admin.listUsers();
      const existingUser = usersData.users.find(u => u.email.toLowerCase() === 'shivam@shivyamservices.com');
      if (existingUser) {
          userId = existingUser.id;
          console.log('Found existing user id:', userId);
          // Optionally update password if they just want it updated
          await adminSupabase.auth.admin.updateUserById(userId, { password: 'Shivyam@1425' });
      }
  }

  if (userId) {
      console.log('Upserting into users table with ID:', userId);
      const { error: dbError } = await adminSupabase
        .from('users')
        .upsert({
            id: userId,
            email: 'Shivam@shivyamservices.com',
            full_name: 'Shivam',
            role: 'admin',
            onboarding_completed: true,
            current_step: 4,
            updated_at: new Date().toISOString()
        });
        
      if (dbError) {
          console.error('DB Error:', dbError.message);
      } else {
          console.log('Successfully created/updated admin user!');
      }
  }
}

run();
