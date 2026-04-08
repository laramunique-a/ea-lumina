export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

/**
 * GET /api/patient/packages
 * Lista os pacotes ativos do paciente logado.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'PACIENTE') {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
    }

    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: session.sub },
      select: { id: true }
    })

    if (!patientProfile) {
      return NextResponse.json({ success: false, error: 'Perfil não encontrado' }, { status: 404 })
    }

    const packages = await prisma.patientPackage.findMany({
      where: {
        patientId: patientProfile.id,
        remainingSessions: { gt: 0 },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ],
        status: 'ACTIVE'
      },
      include: {
        package: {
          include: {
            service: {
              select: { 
                id: true,
                name: true,
                therapistId: true,
                therapist: {
                  select: {
                    user: { select: { name: true } }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const data = packages.map(p => ({
      id: p.id,
      packageName: p.package.name,
      therapyName: p.package.service?.name || 'Multi-terapia',
      therapistName: p.package.service.therapist.user.name,
      remainingSessions: p.remainingSessions,
      totalSessions: p.totalSessions,
      expiresAt: p.expiresAt,
      isMultiTherapy: p.package.isMultiTherapy,
      therapyId: p.package.serviceId,
      therapistId: p.package.service.therapistId
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[GET PATIENT PACKAGES]', error)
    return NextResponse.json({ success: false, error: 'Erro ao carregar pacotes' }, { status: 500 })
  }
}
