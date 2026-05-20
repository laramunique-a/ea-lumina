import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
    });

    if (!therapistProfile) {
      // Fallback seguro: se a role é TERAPEUTA mas o perfil físico ainda não foi criado no banco
      therapistProfile = await prisma.therapistProfile.create({
        data: {
          userId: session.sub,
          price: 0,
        }
      });
    }

    // Busca o histórico ordenado pelo mais recente
    const history = await prisma.cosmicContentGeneration.findMany({
      where: { therapistId: therapistProfile.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    console.error('Error fetching cosmic history:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao carregar o histórico.' },
      { status: 500 }
    );
  }
}
