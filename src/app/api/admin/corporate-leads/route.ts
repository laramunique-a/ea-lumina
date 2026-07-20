export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const leads = await prisma.corporateLead.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      leads
    })
  } catch (error: any) {
    console.error('[GET ADMIN CORPORATE LEADS]', error)
    return NextResponse.json({ success: false, error: 'Erro ao buscar leads corporativos' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID do lead é obrigatório' }, { status: 400 })
    }

    const updated = await prisma.corporateLead.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      }
    })

    return NextResponse.json({
      success: true,
      lead: updated
    })
  } catch (error: any) {
    console.error('[PATCH ADMIN CORPORATE LEAD]', error)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar lead corporativo' }, { status: 500 })
  }
}
