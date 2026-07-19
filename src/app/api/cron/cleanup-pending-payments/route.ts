export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Cron: Limpar pré-reservas aguardando pagamento há mais de 2 horas
 * Deve ser acionado a cada 30 minutos pelo provedor de cron (ex: Vercel Cron, Supabase CRON)
 */
export async function GET(request: NextRequest) {
  // Em desenvolvimento permitimos rodar sem secret para testes, em produção exigimos
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (process.env.NODE_ENV === 'production') {
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
  }

  try {
    const PAYMENT_TTL_MS = 2 * 60 * 60 * 1000 // 2 horas
    const expiryThreshold = new Date(Date.now() - PAYMENT_TTL_MS)

    // Buscar agendamentos AGUARDANDO_PAGAMENTO criados há mais de 2h
    const expired = await prisma.appointment.findMany({
      where: {
        status: 'AGUARDANDO_PAGAMENTO',
        createdAt: { lt: expiryThreshold },
      },
      select: { id: true, patientPackageId: true },
    })

    if (expired.length === 0) {
      return NextResponse.json({ success: true, cancelled: 0, message: 'Nenhuma pré-reserva expirada encontrada.' })
    }

    const expiredIds = expired.map(a => a.id)

    // Restaurar créditos de pacotes que foram descontados preventivamente
    const packageAppointments = expired.filter(a => a.patientPackageId)
    if (packageAppointments.length > 0) {
      for (const apt of packageAppointments) {
        if (apt.patientPackageId) {
          await prisma.patientPackage.update({
            where: { id: apt.patientPackageId },
            data: { remainingSessions: { increment: 1 } },
          }).catch(() => null) // Ignora se pacote não existir
        }
      }
    }

    // Cancelar todos os expirados
    const result = await prisma.appointment.updateMany({
      where: { id: { in: expiredIds } },
      data: {
        status: 'CANCELADO',
        cancelReason: 'Pré-reserva cancelada automaticamente por falta de pagamento (TTL 2h expirado)',
      },
    })

    console.log(`[Cron CleanupPendingPayments] ${result.count} pré-reservas expiradas canceladas.`)

    return NextResponse.json({
      success: true,
      cancelled: result.count,
      ids: expiredIds,
    })
  } catch (error) {
    console.error('[Cron CleanupPendingPayments] Erro:', error)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
