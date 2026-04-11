export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || (session.role !== 'TERAPEUTA' && session.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 401 })
    }

    // Buscar o perfil do terapeuta vinculado a este usuário
    const therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
      include: { paymentDetails: true },
    })

    if (!therapistProfile) {
      return NextResponse.json({ success: false, error: 'Perfil de terapeuta não encontrado' }, { status: 404 })
    }

    let stripeAccountId = therapistProfile.paymentDetails?.stripeAccountId

    // Se o terapeuta ainda não tem uma conta Stripe vinculada, criar uma conta Express
    if (!stripeAccountId) {
      const user = await prisma.user.findUnique({ where: { id: session.sub } })
      
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'BR', // Ajuste dinamicamente se a plataforma operar em outros países
        email: user?.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      })
      stripeAccountId = account.id

      // Salva o ID no banco, criando o registro de paymentDetails se não existir
      await prisma.therapistPaymentDetails.upsert({
        where: { therapistId: therapistProfile.id },
        create: {
          therapistId: therapistProfile.id,
          stripeAccountId: stripeAccountId,
        },
        update: {
          stripeAccountId: stripeAccountId,
        },
      })
    }

    // Gera o link de onboarding da Stripe
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${appUrl}/dashboard/terapeuta/financeiro?refresh=true`,
      return_url: `${appUrl}/dashboard/terapeuta/financeiro?success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ success: true, url: accountLink.url })
  } catch (error: any) {
    console.error('[STRIPE ONBOARD ERROR]', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno ao gerar onboarding Stripe' },
      { status: 500 }
    )
  }
}
