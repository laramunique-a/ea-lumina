export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { transporter } from '@/lib/mail.service'

// POST /api/admin/emails/send-batch
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const { campaignId, recipients, subject, content } = body

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ success: false, error: 'Lista de destinatários vazia ou inválida' }, { status: 400 })
    }

    if (!subject || !content) {
      return NextResponse.json({ success: false, error: 'Assunto e Conteúdo são obrigatórios' }, { status: 400 })
    }

    const results = []
    const emailFrom = process.env.EMAIL_FROM || '"EA Lumina" <contato@ealumina.com>'

    // Enviar para cada destinatário sequencialmente no lote
    for (const recipient of recipients) {
      const { id: userId, email, name } = recipient

      if (!email) {
        results.push({ email, status: 'FAILED', error: 'Email ausente' })
        continue
      }

      // Substituir placeholders como {{nome}}
      const personalizedSubject = subject.replace(/\{\{nome\}\}/g, name || 'Usuário')
      const personalizedContent = content.replace(/\{\{nome\}\}/g, name || 'Usuário')

      const mailOptions = {
        from: emailFrom,
        to: email,
        subject: personalizedSubject,
        html: personalizedContent
      }

      try {
        await transporter.sendMail(mailOptions)

        // Registrar log de sucesso
        await prisma.emailLog.create({
          data: {
            campaignId: campaignId || null,
            userId: userId || null,
            recipientEmail: email,
            recipientName: name || null,
            status: 'SUCCESS'
          }
        })

        results.push({ email, status: 'SUCCESS' })
      } catch (err: any) {
        console.error(`[SEND_BATCH_EMAIL_ERROR] Error sending to ${email}:`, err)

        // Registrar log de erro
        await prisma.emailLog.create({
          data: {
            campaignId: campaignId || null,
            userId: userId || null,
            recipientEmail: email,
            recipientName: name || null,
            status: 'FAILED',
            errorMessage: err.message || 'Erro de transporte SMTP'
          }
        })

        results.push({ email, status: 'FAILED', error: err.message || 'Erro SMTP' })
      }
    }

    const successCount = results.filter(r => r.status === 'SUCCESS').length
    const failedCount = results.filter(r => r.status === 'FAILED').length

    return NextResponse.json({
      success: true,
      successCount,
      failedCount,
      results
    })
  } catch (error: any) {
    console.error('[SEND_BATCH_ROUTE_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}
