export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// GET /api/admin/emails/campaigns (Histórico de envios)
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'MANUAL' ou 'AUTOMATIC'
    const search = searchParams.get('search') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const where: any = {}
    if (type) {
      where.type = type
    }
    if (search) {
      where.subject = { contains: search, mode: 'insensitive' }
    }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        where.createdAt.lte = end
      }
    }

    const skip = (page - 1) * limit

    const [campaigns, totalItems] = await prisma.$transaction([
      prisma.emailCampaign.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.emailCampaign.count({ where })
    ])

    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({ success: true, campaigns, totalPages, totalItems, page })
  } catch (error: any) {
    console.error('[GET_CAMPAIGNS_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST /api/admin/emails/campaigns (Cria a entrada de campanha manual/em lote antes de iniciar o envio de batches)
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const { subject, content, type = 'MANUAL', trigger, recipientsCount = 0 } = body

    if (!subject || !content) {
      return NextResponse.json({ success: false, error: 'Assunto e Conteúdo são obrigatórios' }, { status: 400 })
    }

    const campaign = await prisma.emailCampaign.create({
      data: {
        subject,
        content,
        type,
        trigger: trigger || null,
        status: 'SENDING',
        recipientsCount
      }
    })

    return NextResponse.json({ success: true, campaign })
  } catch (error: any) {
    console.error('[POST_CAMPAIGNS_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}
