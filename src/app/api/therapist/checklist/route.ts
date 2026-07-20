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
      include: {
        paymentDetails: true,
        consent: true
      }
    })

    if (!therapist) {
      return NextResponse.json({ success: false, error: 'Perfil de terapeuta não encontrado' }, { status: 404 })
    }

    const availabilityCount = await prisma.availability.count({
      where: { therapistId: therapist.id, active: true }
    })

    const hasBio = !!therapist.bio && therapist.bio.length > 10
    const hasProfessionalName = !!therapist.professionalName
    const hasCountry = !!therapist.country
    const hasState = !!therapist.state
    const hasWhatsapp = !!therapist.whatsapp
    const hasProfessionalEmail = !!therapist.professionalEmail
    const hasModality = !!therapist.modality

    const profileComplete = hasBio && hasProfessionalName && hasCountry && hasState && hasWhatsapp && hasProfessionalEmail && hasModality
    const therapiesComplete = therapist.therapies.length > 0
    const documentComplete = !!therapist.documentUrl
    const financialComplete = !!therapist.paymentDetails?.stripeAccountId
    const agendaComplete = availabilityCount > 0
    const manifestoComplete = !!therapist.consent?.manifestoAccepted

    const allComplete = profileComplete && therapiesComplete && documentComplete && financialComplete && agendaComplete && manifestoComplete

    return NextResponse.json({
      success: true,
      checklist: {
        profileComplete,
        therapiesComplete,
        documentComplete,
        financialComplete,
        agendaComplete,
        manifestoComplete,
        allComplete
      }
    })
  } catch (error: any) {
    console.error('[GET THERAPIST CHECKLIST]', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
