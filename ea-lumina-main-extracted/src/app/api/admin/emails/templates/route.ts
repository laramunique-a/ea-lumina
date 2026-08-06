export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// GET /api/admin/emails/templates
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, templates })
  } catch (error: any) {
    console.error('[GET_TEMPLATES_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST /api/admin/emails/templates
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const { name, subject, content } = body

    if (!name || !subject || !content) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios ausentes (name, subject, content)' }, { status: 400 })
    }

    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        content
      }
    })

    return NextResponse.json({ success: true, template, message: 'Template criado com sucesso!' }, { status: 201 })
  } catch (error: any) {
    console.error('[POST_TEMPLATES_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}
