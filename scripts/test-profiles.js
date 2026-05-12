const { Client } = require('pg');

const OLD_URL = "postgresql://postgres.qcemykqrksvfyghwfvxd:EALumina2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres";
const NEW_URL = "postgresql://postgres.ppukadiraruyoeknqtbd:YDONl5H6Z4gtsWbl@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

async function test() {
  const oldClient = new Client({ connectionString: OLD_URL });
  const newClient = new Client({ connectionString: NEW_URL });

  await oldClient.connect();
  await newClient.connect();

  await newClient.query("SET session_replication_role = 'replica';");

  const table = "therapist_profiles";
  const res = await oldClient.query(`SELECT * FROM "${table}"`);
  const rows = res.rows;
  
  const columns = Object.keys(rows[0]);
  for (const row of rows) {
    const values = columns.map(col => row[col]);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const colNames = columns.map(c => `"${c}"`).join(', ');

    const insertQuery = `INSERT INTO "${table}" (${colNames}) VALUES (${placeholders})`;
    try {
      await newClient.query(insertQuery, values);
      console.log(`Success for user_id = ${row.user_id}`);
    } catch (err) {
      console.error(`Erro:`, err.message);
    }
  }

  await newClient.query("SET session_replication_role = 'origin';");

  await oldClient.end();
  await newClient.end();
}

test();
