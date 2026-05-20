import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateCosmicContent } from '@/lib/cosmic/provider';
import { z } from 'zod';

const generateSchema = z.object({
  contentType: z.string().min(1, "O tipo de conteúdo é obrigatório"),
  theme: z.string().min(1, "O tema é obrigatório"),
  additionalNotes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'TERAPEUTA') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let therapistProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.sub },
    });

    if (!therapistProfile) {
      // Fallback seguro para evitar erro 404 em contas de teste sem perfil completo
      therapistProfile = await prisma.therapistProfile.create({
        data: {
          userId: session.sub,
          price: 0,
        }
      });
    }

    const body = await req.json();
    const result = generateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos', details: result.error.errors },
        { status: 400 }
      );
    }

    const { contentType, theme, additionalNotes } = result.data;

    // TODO na V2: Buscar dados detalhados do terapeuta para alimentar o prompt (bio, especialidades, etc.)
    // const therapistData = await prisma.therapistProfile.findUnique({...})

    // Gera o conteúdo (atualmente mock)
    const generated = await generateCosmicContent(
      therapistProfile.id,
      contentType,
      theme,
      additionalNotes
    );

    // Salva o resultado no banco
    const savedGeneration = await prisma.cosmicContentGeneration.create({
      data: {
        therapistId: therapistProfile.id,
        contentType,
        theme,
        copy: generated.copy,
        hashtags: generated.hashtags,
        cta: generated.cta,
        imagePrompt: generated.imagePrompt,
        cosmicContext: generated.cosmicAlignment,
      },
    });

    return NextResponse.json({ success: true, data: savedGeneration });
  } catch (error: any) {
    console.error('Error generating cosmic content:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao gerar o conteúdo cósmico.' },
      { status: 500 }
    );
  }
}
