export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado. Apenas administradores.' }, { status: 403 })
    }

    const userId = params.id

    // Garante que a coluna stripeAccountType existe na tabela do banco de dados (Supabase)
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE therapist_payment_details 
        ADD COLUMN IF NOT EXISTS "stripeAccountType" TEXT DEFAULT 'express';
      `)
    } catch (dbErr) {
      console.warn('[MIGRATE DB COLUMN NOTICE]', dbErr)
    }

    // Buscar o perfil do terapeuta vinculado ao usuário
    const therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId },
      include: { paymentDetails: true },
    })

    if (!therapistProfile) {
      return NextResponse.json({ success: false, error: 'Perfil de terapeuta não encontrado.' }, { status: 404 })
    }

    // Se possui registro de paymentDetails, zera cirurgicamente apenas o id da Stripe
    if (therapistProfile.paymentDetails) {
      await prisma.therapistPaymentDetails.update({
        where: { therapistId: therapistProfile.id },
        data: {
          stripeAccountId: null,
          stripeAccountType: null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Integração com a Stripe resetada com sucesso. O terapeuta poderá realizar uma nova conexão.',
    })
  } catch (error: any) {
    console.error('[ADMIN RESET STRIPE ERROR]', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao resetar integração da Stripe.' },
      { status: 500 }
    )
  }
}
