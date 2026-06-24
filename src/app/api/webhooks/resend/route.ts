import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Webhooks do Resend (via Svix ou direto). 
    // Por simplicidade, estamos lendo diretamente o payload.
    // Em um cenário de alta segurança, recomenda-se validar a assinatura Svix.
    const body = await request.json();

    if (!body || !body.type || !body.data || !body.data.email_id) {
      return NextResponse.json({ success: false, error: 'Payload inválido' }, { status: 400 });
    }

    const { type, data } = body;
    const providerId = data.email_id;

    let statusToUpdate: string | null = null;
    let errorMessage: string | null = null;

    // Mapeia eventos do Resend para nossos status locais
    if (type === 'email.delivered') {
      statusToUpdate = 'DELIVERED';
    } else if (type === 'email.bounced') {
      statusToUpdate = 'BOUNCED';
      errorMessage = data.reason || 'O e-mail destino não existe ou rejeitou a mensagem.';
    } else if (type === 'email.complained') {
      statusToUpdate = 'BOUNCED';
      errorMessage = 'O usuário marcou o e-mail como SPAM.';
    } else if (type === 'email.delivery_delayed') {
      // Opcional
    }

    if (statusToUpdate) {
      // updateMany não quebra caso o emailLog não exista 
      // (ex: teste enviado manualmente via painel do Resend)
      await prisma.emailLog.updateMany({
        where: { providerId },
        data: {
          status: statusToUpdate,
          ...(errorMessage && { errorMessage }),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WEBHOOK_RESEND_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Erro Interno' }, { status: 500 });
  }
}
