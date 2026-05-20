import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token e nova senha são obrigatórios' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres' }, { status: 400 });
    }

    // Buscar o token no banco
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json({ error: 'Token inválido ou não encontrado.' }, { status: 400 });
    }

    if (resetToken.used) {
      return NextResponse.json({ error: 'Este link de redefinição já foi utilizado.' }, { status: 400 });
    }

    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'O link de redefinição expirou. Solicite um novo.' }, { status: 400 });
    }

    // Criptografar nova senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Atualizar no banco de forma segura com transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      })
    ]);

    return NextResponse.json({ message: 'Senha atualizada com sucesso' });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Falha ao redefinir a senha.' },
      { status: 500 }
    );
  }
}
