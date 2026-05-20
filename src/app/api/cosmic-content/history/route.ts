import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
    });

    if (!therapistProfile) {
      return NextResponse.json({ error: 'Therapist profile not found' }, { status: 404 });
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
