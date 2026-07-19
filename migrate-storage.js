const { createClient } = require('@supabase/supabase-js');

const OLD_URL = "https://qcemykqrksvfyghwfvxd.supabase.co";
const OLD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZW15a3Fya3N2ZnlnaHdmdnhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NTc5OCwiZXhwIjoyMDg4NTcxNzk4fQ.PG7e58Gm47PLky1jQxH5HfTGw31cdyteFmvIrkBKpHY";

const NEW_URL = "https://ppukadiraruyoeknqtbd.supabase.co";
const NEW_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwdWthZGlyYXJ1eW9la25xdGJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3MjU0OSwiZXhwIjoyMDkyNDQ4NTQ5fQ.s1y1qtZTgvN37EY8hDpRLX3ie0JNdjzMV_aI4i-Ur0w";

const oldSupabase = createClient(OLD_URL, OLD_KEY);
const newSupabase = createClient(NEW_URL, NEW_KEY);

const BUCKETS = [
  { name: 'avatars', public: true },
  { name: 'documents', public: false } // Apenas um palpite, depois validamos
];

async function migrateStorage() {
  console.log("Iniciando migração de arquivos do Storage...");

  // 1. Criar buckets no novo projeto
  for (const bucket of BUCKETS) {
    console.log(`Verificando/Criando bucket '${bucket.name}'...`);
    const { data: existingBuckets } = await newSupabase.storage.listBuckets();
    const exists = existingBuckets?.find(b => b.name === bucket.name);
    
    if (!exists) {
      const { error } = await newSupabase.storage.createBucket(bucket.name, { public: bucket.public });
      if (error) console.log(`Erro ao criar bucket ${bucket.name}:`, error.message);
      else console.log(`Bucket '${bucket.name}' criado com sucesso!`);
    } else {
      console.log(`Bucket '${bucket.name}' já existe.`);
    }
  }

  // 2. Migrar arquivos
  for (const bucket of BUCKETS) {
    console.log(`\nListando arquivos no bucket '${bucket.name}' do projeto antigo...`);
    
    // Função recursiva para listar arquivos em pastas
    async function listAllFiles(folderPath = '') {
      let allFiles = [];
      const { data, error } = await oldSupabase.storage.from(bucket.name).list(folderPath, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
      
      if (error) {
        console.error(`Erro ao listar ${folderPath}:`, error.message);
        return [];
      }
      
      for (const item of data) {
        if (item.name === '.emptyFolderPlaceholder') continue;
        const currentPath = folderPath ? `${folderPath}/${item.name}` : item.name;
        
        // Se não tiver id, é uma pasta (no Supabase, pastas são listadas sem id)
        if (!item.id) {
           const subFiles = await listAllFiles(currentPath);
           allFiles = [...allFiles, ...subFiles];
        } else {
           allFiles.push(currentPath);
        }
      }
      return allFiles;
    }

    const files = await listAllFiles();
    console.log(`- Encontrados ${files.length} arquivos no bucket '${bucket.name}'.`);

    for (const filePath of files) {
      console.log(`- Baixando: ${filePath}...`);
      const { data: fileData, error: downloadError } = await oldSupabase.storage.from(bucket.name).download(filePath);
      
      if (downloadError) {
        console.error(`  x Erro ao baixar ${filePath}:`, downloadError.message);
        continue;
      }

      console.log(`  > Fazendo upload para o novo projeto...`);
      const { error: uploadError } = await newSupabase.storage.from(bucket.name).upload(filePath, fileData, {
        upsert: true,
        contentType: fileData.type
      });

      if (uploadError) {
         console.error(`  x Erro ao subir ${filePath}:`, uploadError.message);
      } else {
         console.log(`  ✓ Upload concluído: ${filePath}`);
      }
    }
  }

  console.log("\n✅ MIGRAÇÃO DO STORAGE CONCLUÍDA COM SUCESSO!");
}

migrateStorage();
