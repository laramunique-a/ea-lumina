const { Client } = require('pg');

const OLD_URL = "postgresql://postgres.qcemykqrksvfyghwfvxd:EALumina2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres";
const NEW_URL = "postgresql://postgres.ppukadiraruyoeknqtbd:YDONl5H6Z4gtsWbl@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

async function migrateAuth() {
  const oldClient = new Client({ connectionString: OLD_URL });
  const newClient = new Client({ connectionString: NEW_URL });

  try {
    console.log("Conectando aos bancos para migrar Autenticação (auth)...");
    await oldClient.connect();
    await newClient.connect();

    await newClient.query("SET session_replication_role = 'replica';");

    // 1. Migrar auth.users
    console.log("\nMigrando auth.users...");
    const resUsers = await oldClient.query(`SELECT * FROM auth.users`);
    const users = resUsers.rows;
    console.log(`- Encontrados ${users.length} usuários.`);

    if (users.length > 0) {
      const columns = Object.keys(users[0]);
      for (const row of users) {
        const values = columns.map(col => row[col]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const colNames = columns.map(c => `"${c}"`).join(', ');

        try {
          await newClient.query(`INSERT INTO auth.users (${colNames}) VALUES (${placeholders})`, values);
        } catch (err) {
          // Ignora conflitos
          if (!err.message.includes('duplicate key')) {
             console.error(`Erro usuário ${row.email}:`, err.message);
          }
        }
      }
    }

    // 2. Migrar auth.identities
    console.log("\nMigrando auth.identities...");
    const resIdentities = await oldClient.query(`SELECT * FROM auth.identities`);
    const identities = resIdentities.rows;
    console.log(`- Encontradas ${identities.length} identidades.`);

    if (identities.length > 0) {
      const columnsId = Object.keys(identities[0]);
      for (const row of identities) {
        const values = columnsId.map(col => row[col]);
        const placeholders = columnsId.map((_, i) => `$${i + 1}`).join(', ');
        const colNames = columnsId.map(c => `"${c}"`).join(', ');

        try {
          await newClient.query(`INSERT INTO auth.identities (${colNames}) VALUES (${placeholders})`, values);
        } catch (err) {
          if (!err.message.includes('duplicate key')) {
             console.error(`Erro identidade ${row.id}:`, err.message);
          }
        }
      }
    }

    await newClient.query("SET session_replication_role = 'origin';");
    console.log("\n✅ MIGRAÇÃO DE AUTENTICAÇÃO CONCLUÍDA!");

  } catch (error) {
    console.error("Erro fatal:", error);
  } finally {
    await oldClient.end();
    await newClient.end();
  }
}

migrateAuth();
