import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';

function verifyMetaSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const [algo, hash] = signature.split('=');
  if (algo !== 'sha256' || !hash) return false;
  try {
    const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

// GET: Verificação do Webhook pela Meta
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.META_WA_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

// POST: Recebimento de eventos (status de leitura, etc)
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');
    const secret = process.env.META_WA_APP_SECRET;

    if (!secret) {
      console.error('[WhatsApp Webhook] META_WA_APP_SECRET não configurado.');
      return new Response('Internal Server Error', { status: 500 });
    }

    if (!verifyMetaSignature(rawBody, signature, secret)) {
      console.error('[WhatsApp Webhook] Assinatura HMAC inválida.');
      return new Response('Forbidden', { status: 403 });
    }

    const body = JSON.parse(rawBody);
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (value?.statuses) {
      for (const status of value.statuses) {
        const messageId = status.id;
        const statusType = status.status; // sent, delivered, read, failed

        if (!messageId) continue;

        const notification = await prisma.whatsAppNotification.findFirst({
          where: { providerMessageId: messageId }
        });

        if (notification) {
          const updateData: any = {};
          if (statusType === 'sent') {
            updateData.status = 'SENT';
            updateData.sentAt = new Date();
          } else if (statusType === 'delivered') {
            updateData.status = 'DELIVERED';
            updateData.deliveredAt = new Date();
          } else if (statusType === 'read') {
            updateData.status = 'READ';
            updateData.readAt = new Date();
          } else if (statusType === 'failed') {
            updateData.status = 'FAILED';
            updateData.failedAt = new Date();
            updateData.errorMessage = JSON.stringify(status.errors || 'Desconhecido');
          }

          if (Object.keys(updateData).length > 0) {
            await prisma.whatsAppNotification.update({
              where: { id: notification.id },
              data: updateData
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Webhook] Erro ao processar POST:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
