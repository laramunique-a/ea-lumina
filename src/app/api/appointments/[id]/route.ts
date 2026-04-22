export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'
import { calculateCommission } from '@/lib/utils'
import { sendMetaTemplateMessage } from '@/lib/whatsapp'

const updateSchema = z.object({
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO']).optional(),
  cancelReason: z.string().max(500).optional(),
  date: z.string().datetime().optional(), // ISO string from frontend
})

// PATCH — atualizar status do agendamento
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const validated = updateSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message || 'Dados inválidos' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        therapist: { 
          select: { 
            userId: true, 
            whatsapp: true, 
            professionalName: true,
            user: { select: { name: true } }
          } 
        },
        patient: { 
          select: { 
            userId: true, 
            socialName: true, 
            user: { select: { name: true, phone: true } } 
          } 
        },
      },
    })

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Agendamento não encontrado' }, { status: 404 })
    }

    const isTherapist = appointment.therapist.userId === session.sub
    const isPatient = appointment.patient.userId === session.sub

    if (!isTherapist && !isPatient && session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Sem permissão' }, { status: 403 })
    }

    if (validated.data.status === 'CANCELADO') {
      const isTherapist = appointment.therapist.userId === session.sub
      const isPatient = appointment.patient.userId === session.sub

      if (!isTherapist && !isPatient && session.role !== 'ADMIN') {
        return NextResponse.json({ success: false, error: 'Sem permissão' }, { status: 403 })
      }

      // Restrição de 24h para cancelamento pelo paciente com estorno de 50%
      const now = new Date()
      const appointmentDate = new Date(appointment.date)
      const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)

      if (isPatient && hoursUntilAppointment < 24) {
        return NextResponse.json({ 
          success: false, 
          error: 'Cancelamentos só são permitidos com no mínimo 24 horas de antecedência.' 
        }, { status: 400 })
      }

      await prisma.$transaction(async (tx) => {
        // 1. Atualizar agendamento
        await tx.appointment.update({
          where: { id: params.id },
          data: {
            status: 'CANCELADO',
            cancelReason: validated.data.cancelReason || (isPatient ? 'Cancelado pelo paciente' : 'Cancelado pelo terapeuta'),
          },
        })

        // 2. Devolver crédito do pacote se existir
        if (appointment.patientPackageId) {
          await tx.patientPackage.update({
            where: { id: appointment.patientPackageId },
            data: { remainingSessions: { increment: 1 } }
          })
        }
        
        // 3. Lógica de Estorno Stripe (50%)
        if (appointment.stripePaymentIntentId) {
          // Calcula 50% do valor estornado
          const refundAmount = Number(appointment.price) / 2
          const amountInCents = Math.round(refundAmount * 100)
          
          await stripe.refunds.create({
            payment_intent: appointment.stripePaymentIntentId,
            amount: amountInCents,
            // reverse_transfer manual se necessário ou absorvido pela plataforma
          })

          await tx.appointment.update({
             where: { id: params.id },
             data: { refundAmount: refundAmount },
          })
        }
      })

      // Notificações de Cancelamento
      const patientPhone = appointment.patient.user?.phone
      const therapistPhone = appointment.therapist.whatsapp
      const formattedDate = appointment.date.toLocaleDateString('pt-BR')

      if (isTherapist && patientPhone) {
        void sendMetaTemplateMessage({
          to: patientPhone,
          templateName: 'agendamento_cancelado_terapeuta',
          components: [{ type: 'body', parameters: [{ type: 'text', text: formattedDate }] }]
        })
      } else if (isPatient && therapistPhone) {
        void sendMetaTemplateMessage({
          to: therapistPhone,
          templateName: 'agendamento_cancelado_paciente',
          components: [{ type: 'body', parameters: [{ type: 'text', text: formattedDate }] }]
        })
      }

      return NextResponse.json({ success: true, message: 'Agendamento cancelado com sucesso.' })
    }

    if (validated.data.status === 'CONFIRMADO' && isTherapist && appointment.status === 'PENDENTE') {
      const price = Number(appointment.price)
      const commissionRate = Number(appointment.commissionRate)
      const { commission, therapistNet, platformRevenue } = calculateCommission(price, commissionRate)

      await prisma.appointment.update({
        where: { id: params.id },
        data: {
          status: 'CONFIRMADO',
          commission,
          therapistNet,
          platformRevenue,
        },
      })

      // Notificação de Confirmação para o Paciente
      const patientPhone = appointment.patient.user?.phone
      if (patientPhone) {
        void sendMetaTemplateMessage({
          to: patientPhone,
          templateName: 'agendamento_confirmado',
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: appointment.therapist.professionalName || appointment.therapist.user?.name || 'Seu terapeuta' },
                { type: 'text', text: appointment.date.toLocaleDateString('pt-BR') }
              ]
            }
          ]
        })
      }

      return NextResponse.json({ success: true, message: 'Agendamento confirmado' })
    }

    if (validated.data.status === 'CONCLUIDO' && isTherapist) {
      await prisma.appointment.update({
        where: { id: params.id },
        data: { status: 'CONCLUIDO' },
      })
      return NextResponse.json({ success: true, message: 'Agendamento concluído' })
    }

    await prisma.appointment.update({
      where: { id: params.id },
      data: {
        status: validated.data.status || appointment.status,
        date: validated.data.date ? new Date(validated.data.date) : appointment.date,
        ...(validated.data.cancelReason && { cancelReason: validated.data.cancelReason }),
      },
    })

    return NextResponse.json({ success: true, message: 'Agendamento atualizado' })
  } catch (error) {
    console.error('[PATCH APPOINTMENT]', error)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar' }, { status: 500 })
  }
}
