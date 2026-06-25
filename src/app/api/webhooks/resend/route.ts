import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (webhookSecret && secret !== webhookSecret) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
    }

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
      // Busca o log para encontrar o campaignId
      const emailLog = await prisma.emailLog.findFirst({
        where: { providerId }
      })

      await prisma.emailLog.updateMany({
        where: { providerId },
        data: {
          status: statusToUpdate,
          ...(errorMessage && { errorMessage }),
        },
      })

      // Se foi bounce, atualizar também o status da campanha para WITH_FAILURES
      if (statusToUpdate === 'BOUNCED' && emailLog?.campaignId) {
        await prisma.emailCampaign.update({
          where: { id: emailLog.campaignId },
          data: { status: 'WITH_FAILURES' },
        })
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WEBHOOK_RESEND_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Erro Interno' }, { status: 500 });
  }
}
