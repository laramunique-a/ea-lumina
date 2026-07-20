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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ea-lumina.com'

    try {
      // Tenta criar link seguro para o dashboard da Stripe Express
      const loginLink = await stripe.accounts.createLoginLink(stripeAccountId)
      return NextResponse.json({ success: true, url: loginLink.url })
    } catch (linkError: any) {
      console.warn('[STRIPE LOGIN LINK FALLBACK] Redirecionando para onboarding devido a cadastro incompleto:', linkError.message)
      
      // Fallback gracioso: Se o onboarding estiver incompleto, gera o link de conclusão de cadastro
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${appUrl}/dashboard/terapeuta/financeiro?refresh=true`,
        return_url: `${appUrl}/dashboard/terapeuta/financeiro?success=true`,
        type: 'account_onboarding',
      })

      return NextResponse.json({
        success: true,
        url: accountLink.url,
        notice: 'Redirecionando para conclusão de cadastro na Stripe'
      })
    }
  } catch (error: any) {
    console.error('[STRIPE LOGIN LINK ERROR]', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao gerar link para a Stripe' },
      { status: 500 }
    )
  }
}
