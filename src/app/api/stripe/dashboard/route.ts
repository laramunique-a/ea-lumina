export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 401 })
    }

    const therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
      include: { paymentDetails: true },
    })

    const stripeAccountId = therapistProfile?.paymentDetails?.stripeAccountId

    if (!stripeAccountId) {
      return NextResponse.json({ success: false, error: 'Conta Stripe não encontrada' }, { status: 404 })
    }

    // Cria link seguro para o dashboard da Stripe Express
    const loginLink = await stripe.accounts.createLoginLink(stripeAccountId)

    return NextResponse.json({ success: true, url: loginLink.url })
  } catch (error: any) {
    console.error('[STRIPE LOGIN LINK ERROR]', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao gerar link para a Stripe' },
      { status: 500 }
    )
  }
}
