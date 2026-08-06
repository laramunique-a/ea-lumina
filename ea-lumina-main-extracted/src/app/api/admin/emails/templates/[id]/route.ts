export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// PUT /api/admin/emails/templates/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { name, subject, content } = body

    if (!name || !subject || !content) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios ausentes (name, subject, content)' }, { status: 400 })
    }

    // Verificar se o template existe
    const existing = await prisma.emailTemplate.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Template não encontrado' }, { status: 404 })
    }

    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name,
        subject,
        content
      }
    })

    return NextResponse.json({ success: true, template, message: 'Template atualizado com sucesso!' })
  } catch (error: any) {
    console.error('[PUT_TEMPLATE_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE /api/admin/emails/templates/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const { id } = params

    // Verificar se o template existe
    const existing = await prisma.emailTemplate.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Template não encontrado' }, { status: 404 })
    }

    await prisma.emailTemplate.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Template excluído com sucesso!' })
  } catch (error: any) {
    console.error('[DELETE_TEMPLATE_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}
