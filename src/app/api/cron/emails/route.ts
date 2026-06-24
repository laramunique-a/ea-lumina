export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getProfileCompleteness } from '@/lib/profile-completeness'
import { transporter } from '@/lib/mail.service'

// GET /api/cron/emails
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // Em desenvolvimento permitimos rodar sem secret para testes, em produção exigimos
    if (process.env.NODE_ENV === 'production') {
      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
      }
    }

    // Buscar a automação configurada para Perfil Incompleto
    const automation = await prisma.emailAutomation.findUnique({
      where: { trigger: 'INCOMPLETE_PROFILE' }
    })

    if (!automation || !automation.active) {
      return NextResponse.json({ success: true, message: 'Automação de perfil incompleto inativa ou não cadastrada.' })
    }

    // Data de 4 dias atrás
    const fourDaysAgo = new Date()
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)

    // Buscar usuários (terapeutas e pacientes) criados há 4 dias ou mais
    const users = await prisma.user.findMany({
      where: {
        createdAt: { lte: fourDaysAgo },
        role: { in: ['TERAPEUTA', 'PACIENTE'] },
        active: true
      },
      include: {
        therapistProfile: true,
        patientProfile: true
      }
    })

    let emailsSent = 0
    let emailsFailed = 0
    let emailsSkipped = 0

    const emailFrom = process.env.EMAIL_FROM || '"EA Lumina" <contato@ealumina.com>'

    for (const user of users) {
      // 1. Verificar completude
      const completeness = getProfileCompleteness(user)
      if (completeness.missingMandatory.length === 0) {
        emailsSkipped++
        continue // Perfil completo
      }

      // 2. Verificar se já recebeu este e-mail de automação
      const alreadySent = await prisma.emailLog.findFirst({
        where: {
          recipientEmail: user.email,
          campaign: {
            trigger: 'INCOMPLETE_PROFILE'
          }
        }
      })

      if (alreadySent) {
        emailsSkipped++
        continue // Já enviado anteriormente
      }

      // 3. Criar campanha automática individual
      const campaign = await prisma.emailCampaign.create({
        data: {
          subject: automation.subject,
          content: automation.content,
          type: 'AUTOMATIC',
          trigger: 'INCOMPLETE_PROFILE',
          status: 'SENDING',
          recipientsCount: 1
        }
      })

      // Substituir placeholders
      const personalizedSubject = automation.subject.replace(/\{\{nome\}\}/g, user.name || 'Usuário')
      const personalizedContent = automation.content.replace(/\{\{nome\}\}/g, user.name || 'Usuário')

      const mailOptions = {
        from: emailFrom,
        to: user.email,
        subject: personalizedSubject,
        html: personalizedContent
      }

      try {
        await transporter.sendMail(mailOptions)

        // Registrar log de sucesso
        await prisma.$transaction([
          prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: { status: 'SUCCESS' }
          }),
          prisma.emailLog.create({
            data: {
              campaignId: campaign.id,
              userId: user.id,
              recipientEmail: user.email,
              recipientName: user.name,
              status: 'SUCCESS'
            }
          })
        ])

        emailsSent++
      } catch (err: any) {
        console.error(`[CRON_EMAIL_ERROR] Erro ao enviar e-mail de perfil incompleto para ${user.email}:`, err)

        // Registrar log de falha
        await prisma.$transaction([
          prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: { status: 'FAILED' }
          }),
          prisma.emailLog.create({
            data: {
              campaignId: campaign.id,
              userId: user.id,
              recipientEmail: user.email,
              recipientName: user.name,
              status: 'FAILED',
              errorMessage: err.message || 'Erro de conexão SMTP'
            }
          })
        ])

        emailsFailed++
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalEvaluated: users.length,
        sent: emailsSent,
        failed: emailsFailed,
        skipped: emailsSkipped
      }
    })
  } catch (error: any) {
    console.error('[CRON_ROUTE_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}
