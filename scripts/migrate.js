const { Client } = require('pg');
const fs = require('fs');

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error('Provide a migration file');
  const sql = fs.readFileSync(file, 'utf8');
  
  const client = new Client({ connectionString: "postgres://postgres:KRgh4Uxu6pT6KYpa@db.dmadyjivioztkrxeolyj.supabase.co:5432/postgres" });
  await client.connect();
  
  try {
    await client.query(sql);
    console.log('Migration applied successfully');
  } catch (err) {
    console.error('Migration failed', err);
  } finally {
    await client.end();
  }
}
main();
