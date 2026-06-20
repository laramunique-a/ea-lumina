import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadTherapistVideo, deleteTherapistVideo } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
    });

    if (!therapistProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado.' }, { status: 404 });
    }

    // Se já tinha vídeo, tenta excluir do storage primeiro (opcional mas recomendado)
    if (therapistProfile.presentationVideoUrl) {
      await deleteTherapistVideo(therapistProfile.presentationVideoUrl);
    }

    const { url, error } = await uploadTherapistVideo(file, therapistProfile.id);

    if (error || !url) {
      return NextResponse.json({ error: error || 'Erro ao salvar vídeo' }, { status: 500 });
    }

    // Salvar no banco de dados
    await prisma.therapistProfile.update({
      where: { id: therapistProfile.id },
      data: { presentationVideoUrl: url },
    });

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
    });

    if (!therapistProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado.' }, { status: 404 });
    }

    if (therapistProfile.presentationVideoUrl) {
      await deleteTherapistVideo(therapistProfile.presentationVideoUrl);
      
      await prisma.therapistProfile.update({
        where: { id: therapistProfile.id },
        data: { presentationVideoUrl: null },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
