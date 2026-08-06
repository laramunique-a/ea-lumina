export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/webhooks/zapi
 *
 * Recebe callbacks de status e delivery da Z-API.
 * Autenticação via header x-webhook-secret comparado com ZAPI_WEBHOOK_SECRET.
 *
 * URLs a cadastrar no painel Z-API:
 *   - Webhook de envio/delivery: https://SEU_DOMINIO/api/webhooks/zapi
 *   - Webhook de status de mensagem: https://SEU_DOMINIO/api/webhooks/zapi
 */
export async function POST(request: NextRequest) {
  try {
    const secret = process.env.ZAPI_WEBHOOK_SECRET;

    // Validar segredo do webhook
    if (secret) {
      const receivedSecret = request.headers.get('x-webhook-secret');
      if (!receivedSecret || receivedSecret !== secret) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Body JSON inválido' }, { status: 400 });
    }

    const type: string | undefined = body?.type;

    if (!type) {
      return NextResponse.json({ received: true });
    }

    // === DeliveryCallback ===
    if (type === 'DeliveryCallback') {
      const messageId: string | undefined = body?.messageId ?? body?.zaapId ?? undefined;

      if (!messageId) {
        return NextResponse.json({ received: true });
      }

      // Localizar notificação pelo providerMessageId
      const notification = await prisma.whatsAppNotification.findFirst({
        where: {
          OR: [
            { providerMessageId: body?.messageId },
            { providerMessageId: body?.zaapId },
          ],
        },
      });

      if (notification) {
        const hasError = Boolean(body?.error);

        if (hasError) {
          await prisma.whatsAppNotification.update({
            where: { id: notification.id },
            data: {
              status: 'FAILED',
              failedAt: new Date(),
              errorMessage: typeof body.error === 'string' ? body.error : JSON.stringify(body.error),
            },
          });
        } else {
          await prisma.whatsAppNotification.update({
            where: { id: notification.id },
            data: {
              status: 'SENT',
              sentAt: new Date(),
              errorMessage: null,
            },
          });
        }
      }

      return NextResponse.json({ received: true });
    }

    // === MessageStatusCallback ===
    if (type === 'MessageStatusCallback') {
      const status: string | undefined = body?.status;
      const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];

      if (!status || ids.length === 0) {
        return NextResponse.json({ received: true });
      }

      // Mapear status Z-API → status interno
      const statusMap: Record<string, string> = {
        SENT: 'SENT',
        RECEIVED: 'DELIVERED',
        READ: 'READ',
        READ_BY_ME: 'READ',
        PLAYED: 'READ',
      };

      const mappedStatus = statusMap[status];
      if (!mappedStatus) {
        // Evento desconhecido — retornar 200 sem quebrar
        return NextResponse.json({ received: true });
      }

      for (const id of ids) {
        const notification = await prisma.whatsAppNotification.findFirst({
          where: { providerMessageId: id },
        });

        if (!notification) continue;

        const updateData: Record<string, unknown> = { status: mappedStatus };

        if (mappedStatus === 'SENT') {
          updateData.sentAt = new Date();
        } else if (mappedStatus === 'DELIVERED') {
          updateData.deliveredAt = new Date();
        } else if (mappedStatus === 'READ') {
          updateData.readAt = new Date();
        }

        await prisma.whatsAppNotification.update({
          where: { id: notification.id },
          data: updateData,
        });
      }

      return NextResponse.json({ received: true });
    }

    // Tipo desconhecido — retornar 200 sem quebrar
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[ZApi Webhook] Erro ao processar POST:', error.message);
    // Retornar 200 para não fazer Z-API tentar reenviar indefinidamente
    return NextResponse.json({ received: true });
  }
}
