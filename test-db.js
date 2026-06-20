const { Client } = require('pg');

async function testConnection(name, url) {
  const client = new Client({ 
    connectionString: url, 
    statement_timeout: 5000,
    ssl: { rejectUnauthorized: false }
  });
  try {
    console.log(`Testing ${name}...`);
    await client.connect();
    console.log(`✅ ${name} works!`);
    await client.end();
  } catch (err) {
    console.error(`❌ ${name} failed:`, err.message);
  }
}

async function run() {
  await testConnection(
    'Pooler 6543',
    'postgresql://postgres.ppukadiraruyoeknqtbd:taschibrata9@aws-1-us-east-1.pooler.supabase.com:6543/postgres'
  );
  await testConnection(
    'Pooler 5432',
    'postgresql://postgres.ppukadiraruyoeknqtbd:taschibrata9@aws-1-us-east-1.pooler.supabase.com:5432/postgres'
  );
  process.exit(0);
}

run();
