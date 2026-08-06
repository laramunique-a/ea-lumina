export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WhatsAppService } from '@/lib/whatsapp/service';

/**
 * GET /api/cron/whatsapp-reminders
 *
 * Envia lembretes de ~24h antes para pacientes e terapeutas com consultas confirmadas.
 * Idempotência garantida pela tabela WhatsAppNotification.
 *
 * Segurança: exige Bearer {CRON_SECRET} em produção.
 * Agendado via vercel.json (a cada hora) ou chamado por scheduler externo com o mesmo header.
 */
export async function GET(request: NextRequest) {
  try {
    // === SEGURANÇA ===
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (process.env.NODE_ENV === 'production') {
      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
      }
    }

    // === JANELA DE BUSCA (23h–25h a partir de agora) ===
    const from = new Date(Date.now() + 23 * 60 * 60 * 1000);
    const to = new Date(Date.now() + 25 * 60 * 60 * 1000);

    const appointments = await prisma.appointment.findMany({
      where: {
        status: 'CONFIRMADO',
        date: { gte: from, lt: to },
      },
      select: { id: true },
    });

    let evaluated = 0;
    let patientSent = 0;
    let therapistSent = 0;
    let skipped = 0;
    let failed = 0;

    // Processar em lotes de 5 para não saturar Z-API ou banco
    const BATCH_SIZE = 5;
    for (let i = 0; i < appointments.length; i += BATCH_SIZE) {
      const batch = appointments.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((apt) => WhatsAppService.notifyReminder(apt.id))
      );

      for (const result of results) {
        evaluated++;
        if (result.status === 'rejected') {
          failed++;
          continue;
        }

        const { patientSent: ps, therapistSent: ts, skipped: sk } = result.value;
        if (sk) {
          skipped++;
        } else {
          if (ps) patientSent++;
          if (ts) therapistSent++;
          // Se ambos falharam (false, false, skipped=false), conta como failed
          if (!ps && !ts) failed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      evaluated,
      patientSent,
      therapistSent,
      skipped,
      failed,
    });
  } catch (error: any) {
    console.error('[CRON_WHATSAPP_REMINDERS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
