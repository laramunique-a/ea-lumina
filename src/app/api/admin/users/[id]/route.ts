export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

const updateUserSchema = z.object({
  active: z.boolean().optional(),
  approved: z.boolean().optional(), // para terapeutas
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const validated = updateUserSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json({ success: false, error: 'Dados inválidos' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { therapistProfile: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Atualizar status do usuário
    if (validated.data.active !== undefined) {
      await prisma.user.update({
        where: { id: params.id },
        data: { active: validated.data.active },
      })
    }

    // Aprovar/reprovar terapeuta
    if (validated.data.approved !== undefined && user.therapistProfile) {
      await prisma.therapistProfile.update({
        where: { userId: params.id },
        data: { approved: validated.data.approved },
      })

      // Notificar terapeuta
      await prisma.notification.create({
        data: {
          userId: params.id,
          title: validated.data.approved ? 'Cadastro aprovado!' : 'Cadastro em revisão',
          message: validated.data.approved
            ? 'Seu perfil foi aprovado! Agora você pode receber agendamentos na plataforma.'
            : 'Seu perfil está em processo de revisão. Entre em contato com o suporte para mais informações.',
          type: validated.data.approved ? 'SUCCESS' : 'WARNING',
        },
      })
    }

    return NextResponse.json({ success: true, message: 'Usuário atualizado com sucesso' })
  } catch (error) {
    console.error('[ADMIN UPDATE USER]', error)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const userId = params.id

    // 1. Buscar o usuário com seus perfis para saber o que deletar
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        therapistProfile: true,
        patientProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 })
    }

    // 2. Executar limpeza em transação para garantir integridade
    await prisma.$transaction(async (tx) => {
      // Deletar notificações
      await tx.notification.deleteMany({ where: { userId } })
      
      // Deletar tokens de refresh
      await tx.refreshToken.deleteMany({ where: { userId } })

      // Deletar avaliações onde o usuário é o autor
      await tx.review.deleteMany({ where: { authorId: userId } })

      // Se for paciente, limpar agendamentos vinculados ao perfil
      if (user.patientProfile) {
        // Deletar pacotes do paciente
        await tx.patientPackage.deleteMany({ where: { patientId: user.patientProfile.id } })
        // Deletar agendamentos
        await tx.appointment.deleteMany({ where: { patientId: user.patientProfile.id } })
      }

      // Se for terapeuta, limpar agendamentos e dependências
      if (user.therapistProfile) {
        // Agendamentos onde ele é o terapeuta
        await tx.appointment.deleteMany({ where: { therapistId: user.therapistProfile.id } })
        
        // Avaliações vinculadas ao perfil do terapeuta
        await tx.review.deleteMany({ where: { therapistId: user.therapistProfile.id } })
      }

      // Finalmente deletar o usuário (isso dispara cascade para profiles conforme schema)
      await tx.user.delete({ where: { id: userId } })
    })

    // 3. Deletar do Supabase Auth para liberar o e-mail
    try {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (authError) {
        console.warn('[ADMIN DELETE USER] User deleted from DB but failed in Supabase Auth:', authError)
      }
    } catch (authCatchError) {
      console.warn('[ADMIN DELETE USER] Exception during Supabase Auth deletion:', authCatchError)
    }

    return NextResponse.json({ success: true, message: 'Usuário excluído permanentemente' })
  } catch (error) {
    console.error('[ADMIN DELETE USER]', error)
    return NextResponse.json({ success: false, error: 'Erro ao excluir usuário permanentemente' }, { status: 500 })
  }
}
