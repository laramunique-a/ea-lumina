const { Client } = require('pg');

const OLD_URL = "postgresql://postgres.qcemykqrksvfyghwfvxd:EALumina2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres";
const NEW_URL = "postgresql://postgres.ppukadiraruyoeknqtbd:YDONl5H6Z4gtsWbl@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

const TABLES = [
  "users",
  "therapy_types",
  "platform_config",
  "therapist_profiles",
  "patient_profiles",
  "notifications",
  "availability",
  "therapist_services",
  "therapist_consents",
  "therapist_admin_data",
  "therapist_ai_configs",
  "therapist_target_audiences",
  "therapist_marketing_materials",
  "therapist_payment_methods",
  "therapist_payment_details",
  "therapist_certificates",
  "therapy_packages",
  "patient_packages",
  "appointments",
  "reviews",
  "refresh_tokens"
];

async function compare() {
  const oldClient = new Client({ connectionString: OLD_URL });
  const newClient = new Client({ connectionString: NEW_URL });

  await oldClient.connect();
  await newClient.connect();

  console.log(padRight("TABLE", 30) + padRight("OLD COUNT", 15) + "NEW COUNT");
  console.log("-".repeat(60));

  for (const table of TABLES) {
    try {
      const oldRes = await oldClient.query(`SELECT COUNT(*) as c FROM "${table}"`);
      const newRes = await newClient.query(`SELECT COUNT(*) as c FROM "${table}"`);
      
      const oldCount = oldRes.rows[0].c;
      const newCount = newRes.rows[0].c;
      
      const mismatch = oldCount !== newCount ? " <--- MISMATCH!" : "";
      console.log(padRight(table, 30) + padRight(oldCount, 15) + newCount + mismatch);
    } catch (err) {
      console.error(`Erro ao checar ${table}:`, err.message);
    }
  }

  await oldClient.end();
  await newClient.end();
}

function padRight(str, len) {
  return String(str).padEnd(len, ' ');
}

compare();
