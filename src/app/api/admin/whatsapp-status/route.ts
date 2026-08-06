export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WhatsAppService } from '@/lib/whatsapp/service';
import { getWhatsAppProvider } from '@/lib/whatsapp/factory';
import { WA_EVENTS } from '@/lib/whatsapp/types';
import { getServerSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Autenticação: admin logado OU WHATSAPP_DEBUG_TOKEN via query param
  const tokenParam = searchParams.get('token');
  const debugToken = process.env.WHATSAPP_DEBUG_TOKEN;
  let authorized = false;

  if (debugToken && tokenParam === debugToken) {
    authorized = true;
  } else {
    try {
      const session = await getServerSession();
      if (session?.role === 'ADMIN') authorized = true;
    } catch {
      // Não autenticado via sessão
    }
  }

  if (!authorized) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const providerType = process.env.WHATSAPP_PROVIDER || 'evolution';

    // Configurações mascaradas (sem expor segredos)
    const configs: Record<string, string> = {
      WHATSAPP_PROVIDER: providerType,
      ZAPI_BASE_URL: process.env.ZAPI_BASE_URL ? 'Configurado' : 'Ausente',
      ZAPI_INSTANCE_ID: process.env.ZAPI_INSTANCE_ID ? 'Configurado' : 'Ausente',
      ZAPI_INSTANCE_TOKEN: process.env.ZAPI_INSTANCE_TOKEN ? 'Configurado' : 'Ausente',
      ZAPI_CLIENT_TOKEN: process.env.ZAPI_CLIENT_TOKEN ? 'Configurado' : 'Ausente',
      EVOLUTION_API_URL: process.env.EVOLUTION_API_URL ? 'Configurado' : 'Ausente',
      EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY ? 'Configurado' : 'Ausente',
      EVOLUTION_API_INSTANCE: process.env.EVOLUTION_API_INSTANCE || 'Ausente',
      META_WA_ACCESS_TOKEN: process.env.META_WA_ACCESS_TOKEN ? 'Configurado' : 'Ausente',
      META_WA_PHONE_NUMBER_ID: process.env.META_WA_PHONE_NUMBER_ID || 'Ausente',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'Ausente',
    };

    // Health check via provider atual
    let health = null;
    try {
      const provider = getWhatsAppProvider();
      health = await provider.checkHealth();
    } catch (err: any) {
      health = { status: 'down', provider: providerType, details: err.message };
    }

    // Últimos 15 registros de notificação (sem telefones completos)
    const rawLogs = await prisma.whatsAppNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    // Mascarar telefones nos logs
    const logs = rawLogs.map((log) => ({
      id: log.id,
      appointmentId: log.appointmentId,
      event: log.event,
      recipientType: log.recipientType,
      recipientPhone: log.recipientPhone
        ? `****${log.recipientPhone.slice(-4)}`
        : null,
      provider: log.provider,
      status: log.status,
      attempts: log.attempts,
      providerMessageId: log.providerMessageId,
      sentAt: log.sentAt,
      deliveredAt: log.deliveredAt,
      readAt: log.readAt,
      failedAt: log.failedAt,
      errorMessage: log.errorMessage,
      createdAt: log.createdAt,
    }));

    // Teste opcional: enviar mensagem de diagnóstico para um telefone
    const testPhone = searchParams.get('testPhone');
    let testResult = null;
    if (testPhone) {
      const someAppointment = await prisma.appointment.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      if (someAppointment) {
        // Limpar registro anterior para forçar nova tentativa
        await prisma.whatsAppNotification.deleteMany({
          where: {
            appointmentId: someAppointment.id,
            event: WA_EVENTS.BOOKING_REQUESTED_THERAPIST,
            recipientType: 'THERAPIST',
          },
        });

        testResult = await WhatsAppService.notify(
          someAppointment.id,
          WA_EVENTS.BOOKING_REQUESTED_THERAPIST,
          'THERAPIST',
          testPhone,
          {
            patientName: 'Teste Paciente',
            therapistName: 'Teste Terapeuta',
            date: '2026-07-21',
            time: '09:30',
            dashboardUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://ealumina.com',
          }
        );
      } else {
        testResult = 'Nenhum agendamento encontrado para teste';
      }
    }

    return NextResponse.json({
      success: true,
      configs,
      health,
      logs,
      testResult,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
