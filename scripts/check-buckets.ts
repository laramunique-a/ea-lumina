import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ppukadiraruyoeknqtbd.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwdWthZGlyYXJ1eW9la25xdGJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3MjU0OSwiZXhwIjoyMDkyNDQ4NTQ5fQ.s1y1qtZTgvN37EY8hDpRLX3ie0JNdjzMV_aI4i-Ur0w'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  const { data, error } = await supabaseAdmin.storage.listBuckets()
  if (error) {
    console.error('Error listing buckets:', error)
  } else {
    console.log('Buckets:', data)
  }
}

main()
