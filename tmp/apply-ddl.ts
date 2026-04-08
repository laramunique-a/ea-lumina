import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Iniciando Migração Raw (Pacotes de Terapias) ---')
  try {
    // 1. Criar tabela therapy_packages
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "therapy_packages" (
        "id" TEXT NOT NULL,
        "serviceId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "sessionCount" INTEGER NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        "expirationDays" INTEGER,
        "isMultiTherapy" BOOLEAN NOT NULL DEFAULT false,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "therapy_packages_pkey" PRIMARY KEY ("id")
      );
    `)
    console.log('✅ Tabela "therapy_packages" criada/verificada')

    // 2. Criar tabela patient_packages
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "patient_packages" (
        "id" TEXT NOT NULL,
        "patientId" TEXT NOT NULL,
        "packageId" TEXT NOT NULL,
        "totalSessions" INTEGER NOT NULL,
        "remainingSessions" INTEGER NOT NULL,
        "expiresAt" TIMESTAMP(3),
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "patient_packages_pkey" PRIMARY KEY ("id")
      );
    `)
    console.log('✅ Tabela "patient_packages" criada/verificada')

    // 3. Adicionar coluna patientPackageId em appointments
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='patientPackageId') THEN
          ALTER TABLE "appointments" ADD COLUMN "patientPackageId" TEXT;
        END IF;
      END $$;
    `)
    console.log('✅ Coluna "patientPackageId" adicionada em appointments')

    // 4. Adicionar Constraints de Foreign Key (somente se não existirem)
    // Nota: Em SQL puro no Postgres, checar constraints é mais complexo, 
    // mas o "IF NOT EXISTS" no ALTER TABLE não é padrão. 
    // Vamos usar blocos anônimos para segurança.

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='therapy_packages_serviceId_fkey') THEN
          ALTER TABLE "therapy_packages" ADD CONSTRAINT "therapy_packages_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "therapist_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `)

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='patient_packages_patientId_fkey') THEN
          ALTER TABLE "patient_packages" ADD CONSTRAINT "patient_packages_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `)

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='patient_packages_packageId_fkey') THEN
          ALTER TABLE "patient_packages" ADD CONSTRAINT "patient_packages_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "therapy_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
      END $$;
    `)

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='appointments_patientPackageId_fkey') THEN
          ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientPackageId_fkey" FOREIGN KEY ("patientPackageId") REFERENCES "patient_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        END IF;
      END $$;
    `)
    console.log('✅ Constraints de chaves estrangeiras verificadas/aplicadas')

    console.log('--- Migração de Pacotes concluída com sucesso! ---')
  } catch (error) {
    console.error('❌ Erro na migração de pacotes:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
