import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint de Webhook para o WhatsApp Cloud API (Meta)
 * Usado para verificação do domínio e para receber atualizações de mensagens.
 */

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
    const body = await request.json();

    // Log básico para depuração (em produção você pode querer remover)
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

      console.log(`[WhatsApp] Mensagem de ${from}: ${text}`);
      
      // Aqui você poderia disparar lógica de chatbot ou salvar no banco
    }

    if (value?.statuses) {
      // Atualizações de status (sent, delivered, read)
      const status = value.statuses[0];
      console.log(`[WhatsApp] Status da mensagem ${status.id}: ${status.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Webhook] Erro ao processar POST:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
