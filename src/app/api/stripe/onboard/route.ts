export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

import { getStripeAccountType, normalizeCountryCode, isStripeSupportedAccountCountry } from '@/lib/stripe-account-type'
import { getCountryFromRequest } from '@/lib/geo'

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || (session.role !== 'TERAPEUTA' && session.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 401 })
    }

    // Garante que a coluna stripeAccountType existe no banco de dados
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE therapist_payment_details 
        ADD COLUMN IF NOT EXISTS "stripeAccountType" TEXT DEFAULT 'express';
      `)
    } catch (dbErr) {
      console.warn('[MIGRATE DB COLUMN NOTICE]', dbErr)
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

    // Se o terapeuta ainda não tem uma conta Stripe vinculada, criar uma conta Express ou Standard
    if (!stripeAccountId) {
      const user = await prisma.user.findUnique({ where: { id: session.sub } })
      
      let finalAccountType = getStripeAccountType(therapistProfile.country)
      let countryCode = normalizeCountryCode(therapistProfile.country)

      // Fallback por IP se o perfil não tiver país definido
      if (!therapistProfile.country) {
        const ipCountry = getCountryFromRequest(request)
        if (ipCountry) {
          countryCode = ipCountry
          finalAccountType = getStripeAccountType(ipCountry)
        }
      }
      if (!isStripeSupportedAccountCountry(countryCode)) {
        return NextResponse.json({
          success: false,
          error: `A Stripe ainda não suporta a criação de contas de recebimento no país (${countryCode}). Para receber via Stripe, conecte uma conta registrada em um país suportado (como Brasil, Portugal, Espanha ou EUA) ou utilize os outros meios de recebimento (PIX/Transferência).`
        }, { status: 400 })
      }

      let account: any
      try {
        const accountCreateParams: any = {
          type: finalAccountType,
          country: countryCode,
          email: user?.email,
        }

        if (finalAccountType === 'express') {
          accountCreateParams.capabilities = {
            card_payments: { requested: true },
            transfers: { requested: true },
          }
        }

        account = await stripe.accounts.create(accountCreateParams)
      } catch (stripeErr: any) {
        // Se Express falhar devido a restrição territorial, tenta criar Standard como fallback automático
        if (finalAccountType === 'express') {
          console.warn('[STRIPE ONBOARD FALLBACK] Express falhou na Stripe, realizando fallback para Standard:', stripeErr.message)
          finalAccountType = 'standard'
          account = await stripe.accounts.create({
            type: 'standard',
            country: countryCode,
            email: user?.email,
          })
        } else {
          throw stripeErr
        }
      }

      stripeAccountId = account.id

      // Salva o ID e tipo no banco, criando o registro de paymentDetails se não existir
      await prisma.therapistPaymentDetails.upsert({
        where: { therapistId: therapistProfile.id },
        create: {
          therapistId: therapistProfile.id,
          stripeAccountId: stripeAccountId,
          stripeAccountType: finalAccountType,
        },
        update: {
          stripeAccountId: stripeAccountId,
          stripeAccountType: finalAccountType,
        },
      })
    }

    if (!stripeAccountId) {
      return NextResponse.json({ success: false, error: 'Falha ao obter ID da conta Stripe' }, { status: 500 })
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
