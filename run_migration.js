const { Client } = require('pg');
require('dotenv').config({ path: '.env' });
const fs = require('fs');

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const projectRef = url.match(/https:\/\/(.*?)\.supabase\.co/)[1];
  const dbPass = process.env.DB_PASS;
  
  const connectionString = `postgresql://postgres:${dbPass}@db.${projectRef}.supabase.co:5432/postgres`;
  
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to database.");
    const sql = fs.readFileSync('supabase/migrations/20260712120000_admin_modules.sql', 'utf8');
    await client.query(sql);
    console.log("Migration applied successfully!");
  } catch(e) {
    console.error("Migration failed:", e);
  } finally {
    await client.end();
  }
}
run();
