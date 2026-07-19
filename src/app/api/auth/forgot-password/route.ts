import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/mail.service';
import crypto from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Rate limiting: máx 5 solicitações por IP em 1 hora
  const ip = getClientIp(req);
  const rl = checkRateLimit(`forgot-password:${ip}`, { limit: 5, windowSeconds: 60 * 60 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Muitas solicitações de recuperação de senha. Tente novamente em 1 hora.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Segurança: Retornamos sucesso mesmo se o usuário não existir para evitar a enumeração de emails
    if (user) {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
      
      // Invalida tokens antigos gerados para este usuário
      await prisma.passwordResetToken.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
      });

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    return NextResponse.json({
      message: 'Se o email existir, enviaremos instruções.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Falha ao processar solicitação.' },
      { status: 500 }
    );
  }
}
