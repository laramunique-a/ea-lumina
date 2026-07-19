const { Client } = require('pg');

const OLD_URL = "postgresql://postgres.qcemykqrksvfyghwfvxd:EALumina2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres";
const NEW_URL = "postgresql://postgres.ppukadiraruyoeknqtbd:YDONl5H6Z4gtsWbl@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

// Ordem correta das tabelas baseada no Prisma Schema
const TABLES = [
  "User",
  "TherapyType",
  "PlatformConfig",
  "TherapistProfile",
  "PatientProfile",
  "Notification",
  "Availability",
  "TherapistService",
  "TherapistConsent",
  "TherapistAdminData",
  "TherapistAiConfig",
  "TherapistTargetAudience",
  "TherapistMarketingMaterial",
  "TherapistPaymentMethod",
  "TherapistPaymentDetails",
  "TherapistCertificate",
  "TherapyPackage",
  "PatientPackage",
  "Appointment",
  "Review",
  "RefreshToken"
];

async function migrate() {
  const oldClient = new Client({ connectionString: OLD_URL });
  const newClient = new Client({ connectionString: NEW_URL });

  try {
    console.log("Conectando aos bancos de dados...");
    await oldClient.connect();
    await newClient.connect();
    console.log("Conectado com sucesso!");

    console.log("Desabilitando restrições de Foreign Keys no banco novo...");
    await newClient.query("SET session_replication_role = 'replica';");

    for (const table of TABLES) {
      console.log(`\nMigrando tabela: ${table}...`);
      
      try {
        const res = await oldClient.query(`SELECT * FROM "${table}"`);
        const rows = res.rows;
        console.log(`- Encontrados ${rows.length} registros em ${table}.`);

        if (rows.length === 0) continue;

        const columns = Object.keys(rows[0]);
        let successCount = 0;
        
        for (const row of rows) {
          const values = columns.map(col => row[col]);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          const colNames = columns.map(c => `"${c}"`).join(', ');

          const insertQuery = `INSERT INTO "${table}" (${colNames}) VALUES (${placeholders})`;
          
          try {
            await newClient.query(insertQuery, values);
            successCount++;
          } catch (err) {
            // Se for duplicate key, ignora silenciosamente
            if (!err.message.includes('duplicate key')) {
              console.error(`  x Erro ao inserir na tabela ${table}:`, err.message);
            }
          }
        }
        console.log(`- ${successCount} registros novos inseridos com sucesso em ${table}!`);
      } catch (err) {
        console.error(`- Erro ao ler a tabela ${table} do banco antigo:`, err.message);
      }
    }

    console.log("\nReabilitando restrições de Foreign Keys no banco novo...");
    await newClient.query("SET session_replication_role = 'origin';");

    console.log("\n✅ MIGRAÇÃO DE DADOS CONCLUÍDA COM SUCESSO!");

  } catch (error) {
    console.error("Erro fatal durante a migração:", error);
  } finally {
    await oldClient.end();
    await newClient.end();
  }
}

migrate();
