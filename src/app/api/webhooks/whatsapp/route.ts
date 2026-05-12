import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Endpoint de Webhook para o WhatsApp Cloud API (Meta)
 * Usado para verificação do domínio e para receber atualizações de mensagens.
 */

/**
 * Verifica a assinatura HMAC-SHA256 do payload enviado pela Meta.
 * Evita que qualquer terceiro injete eventos falsos no endpoint.
 */
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

  // Verifica se o modo e o token conferem com o definido no seu .env
  if (mode === 'subscribe' && token === process.env.META_WA_VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verificado com sucesso!');
    return new Response(challenge, { status: 200 });
  }

  console.error('[WhatsApp Webhook] Falha na verificação. Token incorreto.');
  return new Response('Forbidden', { status: 403 });
}

// POST: Recebimento de eventos (mensagens, status de leitura, etc)
export async function POST(request: NextRequest) {
  try {
    // Ler o body como texto para verificar a assinatura HMAC antes de parsear
    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');
    const secret = process.env.META_WA_APP_SECRET;

    if (!secret) {
      console.error('[WhatsApp Webhook] META_WA_APP_SECRET não configurado — rejeitando todos os requests.');
      return new Response('Internal Server Error', { status: 500 });
    }

    if (!verifyMetaSignature(rawBody, signature, secret)) {
      console.error('[WhatsApp Webhook] Assinatura HMAC inválida — request rejeitado.');
      return new Response('Forbidden', { status: 403 });
    }

    const body = JSON.parse(rawBody);

    // Log básico para depuração (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('[WhatsApp Webhook] Evento recebido:', JSON.stringify(body, null, 2));
    }

    // A estrutura da Meta é profunda: entry[0].changes[0].value
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (value?.messages) {
      const message = value.messages[0];
      const from = message.from;
      const text = message.text?.body;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[WhatsApp] Mensagem de ${from}: ${text}`);
      }
      // Aqui você poderia disparar lógica de chatbot ou salvar no banco
    }

    if (value?.statuses) {
      // Atualizações de status (sent, delivered, read)
      const status = value.statuses[0];
      if (process.env.NODE_ENV === 'development') {
        console.log(`[WhatsApp] Status da mensagem ${status.id}: ${status.status}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Webhook] Erro ao processar POST:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
