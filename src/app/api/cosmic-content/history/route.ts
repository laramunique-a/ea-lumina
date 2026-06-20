import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
    });

    if (!therapistProfile) {
      return NextResponse.json(
        { error: 'Para usar o Observador Cósmico, você precisa ter um Perfil de Terapeuta ativo.' }, 
        { status: 400 }
      );
    }

    // Busca o histórico ordenado pelo mais recente
    const history = await prisma.cosmicContentGeneration.findMany({
      where: { therapistId: therapistProfile.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const mappedHistory = history.map((item) => ({
      ...item,
      copyTitle: item.title,
      copyCaption: item.copy,
    }));

    return NextResponse.json({ success: true, data: mappedHistory });
  } catch (error: any) {
    console.error('Error fetching cosmic history:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao carregar o histórico.' },
      { status: 500 }
    );
  }
}
