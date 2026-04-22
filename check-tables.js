const { Client } = require('pg');
const OLD_URL = "postgresql://postgres.qcemykqrksvfyghwfvxd:EALumina2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres";

async function run() {
  const c = new Client({ connectionString: OLD_URL });
  await c.connect();
  const res = await c.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log(res.rows.map(r => r.table_name));
  await c.end();
}
run();
