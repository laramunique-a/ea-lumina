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

async function migrate() {
  const oldClient = new Client({ connectionString: OLD_URL });
  const newClient = new Client({ connectionString: NEW_URL });

  try {
    console.log("Conectando aos bancos de dados...");
    await oldClient.connect();
    await newClient.connect();

    await newClient.query("SET session_replication_role = 'replica';");

    // Pegar colunas válidas do banco novo
    const resColumns = await newClient.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
    `);
    
    const validColumnsMap = {};
    for (const row of resColumns.rows) {
      if (!validColumnsMap[row.table_name]) validColumnsMap[row.table_name] = new Set();
      validColumnsMap[row.table_name].add(row.column_name);
    }

    for (const table of TABLES) {
      console.log(`\nMigrando tabela: ${table}...`);
      
      try {
        const res = await oldClient.query(`SELECT * FROM "${table}"`);
        const rows = res.rows;

        if (rows.length === 0) continue;

        // Filtrar colunas: Só pegar colunas do banco antigo que AINDA existem no banco novo
        const oldColumns = Object.keys(rows[0]);
        const validColumns = oldColumns.filter(c => validColumnsMap[table]?.has(c));

        let successCount = 0;
        
        for (const row of rows) {
          const values = validColumns.map(col => row[col]);
          const placeholders = validColumns.map((_, i) => `$${i + 1}`).join(', ');
          const colNames = validColumns.map(c => `"${c}"`).join(', ');

          const insertQuery = `INSERT INTO "${table}" (${colNames}) VALUES (${placeholders})`;
          
          try {
            await newClient.query(insertQuery, values);
            successCount++;
          } catch (err) {
            if (!err.message.includes('duplicate key')) {
              console.error(`  x Erro na tabela ${table}:`, err.message);
            }
          }
        }
        console.log(`- ${successCount} registros migrados em ${table}!`);
      } catch (err) {
        console.error(`- Erro ao ler a tabela ${table}:`, err.message);
      }
    }

    await newClient.query("SET session_replication_role = 'origin';");
    console.log("\n✅ MIGRAÇÃO DE DADOS CORRIGIDA CONCLUÍDA!");

  } catch (error) {
    console.error("Erro fatal:", error);
  } finally {
    await oldClient.end();
    await newClient.end();
  }
}

migrate();
