export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// GET /api/admin/emails/campaigns/[id] (Obter detalhes e logs individuais)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const { id } = params

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
      include: {
        logs: {
          orderBy: { sentAt: 'desc' }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json({ success: false, error: 'Campanha não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true, campaign })
  } catch (error: any) {
    console.error('[GET_CAMPAIGN_DETAIL_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}

// PATCH /api/admin/emails/campaigns/[id] (Atualizar status da campanha)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { status, recipientsCount } = body

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status é obrigatório' }, { status: 400 })
    }

    const campaign = await prisma.emailCampaign.update({
      where: { id },
      data: {
        status,
        ...(recipientsCount !== undefined ? { recipientsCount } : {})
      }
    })

    return NextResponse.json({ success: true, campaign })
  } catch (error: any) {
    console.error('[PATCH_CAMPAIGN_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}
