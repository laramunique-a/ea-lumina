export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const therapist = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
      include: { consent: true }
    })

    if (!therapist) {
      return NextResponse.json({ success: false, error: 'Perfil de terapeuta não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      consent: {
        manifestoAccepted: therapist.consent?.manifestoAccepted ?? false,
        manifestoAcceptedAt: therapist.consent?.manifestoAcceptedAt ?? null,
        manifestoVersion: therapist.consent?.manifestoVersion ?? null,
      }
    })
  } catch (error: any) {
    console.error('[GET MANIFESTO CONSENT]', error)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const { accepted, version = '1.0' } = body

    if (!accepted) {
      return NextResponse.json({ success: false, error: 'Você precisa aceitar o manifesto para prosseguir' }, { status: 400 })
    }

    const therapist = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
      include: { consent: true }
    })

    if (!therapist) {
      return NextResponse.json({ success: false, error: 'Perfil de terapeuta não encontrado' }, { status: 404 })
    }

    const now = new Date()

    if (therapist.consent) {
      await prisma.therapistConsent.update({
        where: { id: therapist.consent.id },
        data: {
          manifestoAccepted: true,
          manifestoAcceptedAt: now,
          manifestoVersion: version,
        }
      })
    } else {
      await prisma.therapistConsent.create({
        data: {
          therapistId: therapist.id,
          manifestoAccepted: true,
          manifestoAcceptedAt: now,
          manifestoVersion: version,
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Manifesto da Rede Lumina aceito com sucesso.',
      acceptedAt: now.toISOString(),
      version
    })
  } catch (error: any) {
    console.error('[POST MANIFESTO CONSENT]', error)
    return NextResponse.json({ success: false, error: 'Erro ao processar aceite' }, { status: 500 })
  }
}
