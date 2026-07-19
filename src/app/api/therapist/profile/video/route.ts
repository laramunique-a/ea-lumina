import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteTherapistVideo, createTherapistVideoUploadUrl } from '@/lib/supabase';

/**
 * GET /api/therapist/profile/video?ext=mp4
 * Gera uma URL de upload assinada diretamente para o Supabase Storage.
 * Isso contorna o limite de 4.5MB da Vercel.
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const ext = searchParams.get('ext') || 'mp4';

    const therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
    });

    if (!therapistProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado.' }, { status: 404 });
    }

    const { signedUrl, token, publicUrl, error } = await createTherapistVideoUploadUrl(
      therapistProfile.id,
      ext
    );

    if (error || !signedUrl) {
      return NextResponse.json({ error: error || 'Erro ao gerar URL de upload' }, { status: 500 });
    }

    return NextResponse.json({ success: true, signedUrl, token, publicUrl });
  } catch (error: any) {
    console.error('Error generating signed upload URL:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

/**
 * POST /api/therapist/profile/video
 * Salva a URL do vídeo de apresentação (já enviado diretamente para o Storage) no perfil do terapeuta.
 * Também exclui o vídeo anterior do storage.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { videoUrl } = body;

    if (!videoUrl) {
      return NextResponse.json({ error: 'Nenhuma URL de vídeo fornecida.' }, { status: 400 });
    }

    const therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
    });

    if (!therapistProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado.' }, { status: 404 });
    }

    // Se já tinha vídeo anterior e é diferente do novo, exclui do storage
    if (therapistProfile.presentationVideoUrl && therapistProfile.presentationVideoUrl !== videoUrl) {
      await deleteTherapistVideo(therapistProfile.presentationVideoUrl);
    }

    // Salvar a nova URL no banco de dados
    await prisma.therapistProfile.update({
      where: { id: therapistProfile.id },
      data: { presentationVideoUrl: videoUrl },
    });

    return NextResponse.json({ success: true, url: videoUrl });
  } catch (error: any) {
    console.error('Error saving video URL:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

/**
 * DELETE /api/therapist/profile/video
 * Remove o vídeo de apresentação atual do perfil do terapeuta e do Storage.
 */
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
