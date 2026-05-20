import { prisma } from '@/lib/prisma';

export interface CosmicContext {
  id?: string;
  weekStart: string;
  weekEnd: string;
  weekTheme: string;
  collectiveEnergy: string;
  bestTopics: string[];
  recommendedCta: string;
}

export interface CosmicGenerationResult {
  copy: string;
  hashtags: string[];
  cta: string;
  imagePrompt: string;
  contentTheme: string;
  cosmicAlignment: string;
}

// Busca a energia da semana automaticamente no banco
export async function getWeeklyCosmicContext(): Promise<CosmicContext> {
  const latestWeek = await prisma.cosmicWeek.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (latestWeek) {
    return {
      id: latestWeek.id,
      weekStart: latestWeek.weekStart,
      weekEnd: latestWeek.weekEnd,
      weekTheme: latestWeek.weekTheme,
      collectiveEnergy: latestWeek.collectiveEnergy,
      bestTopics: latestWeek.bestTopics,
      recommendedCta: latestWeek.recommendedCta,
    };
  }

  // Se não existir, insere o mock automaticamente
  const mockWeek = await prisma.cosmicWeek.create({
    data: {
      weekStart: "18/05/2026",
      weekEnd: "25/05/2026",
      weekTheme: "Abundância e Merecimento",
      collectiveEnergy: "Semana favorável para autoestima, expansão emocional e desbloqueio financeiro.",
      bestTopics: [
        "prosperidade",
        "autocuidado",
        "limites",
        "merecimento"
      ],
      recommendedCta: "agendamento terapêutico"
    }
  });

  return {
    id: mockWeek.id,
    weekStart: mockWeek.weekStart,
    weekEnd: mockWeek.weekEnd,
    weekTheme: mockWeek.weekTheme,
    collectiveEnergy: mockWeek.collectiveEnergy,
    bestTopics: mockWeek.bestTopics,
    recommendedCta: mockWeek.recommendedCta,
  };
}

// Mock da geração de conteúdo utilizando o contexto da semana
export async function generateCosmicContent(
  therapistId: string,
  contentType: string,
  theme: string,
  additionalNotes?: string
): Promise<CosmicGenerationResult> {
  // Simula buscar o contexto atual para integrar na geração
  const currentWeek = await getWeeklyCosmicContext();

  return new Promise((resolve) => {
    setTimeout(() => {
      const copy = `A energia da semana nos convida a olhar para dentro e reconhecer nosso verdadeiro valor. Quando falamos sobre ${theme}, estamos na verdade abrindo espaço para curar velhas feridas e abraçar a nossa jornada de autodescoberta.\n\nSinta como seu corpo reage a essa possibilidade. Permita-se soltar o que não serve mais.\n\nVocê está pronto para dar o próximo passo rumo ao seu bem-estar emocional? ${additionalNotes ? `\n\nLembre-se: ${additionalNotes}` : ''}`;
      
      resolve({
        copy,
        hashtags: ["#autoconhecimento", `#${theme.replace(/\s+/g, '')}`, "#terapiaholistica", "#expansaodaconsciencia", "#energiaastral"],
        cta: `Agende sua sessão e vamos juntos desbloquear esse caminho. (${currentWeek.recommendedCta})`,
        imagePrompt: `Cinematic, ultra realistic, elegant wellness aesthetic, soft golden hour lighting, a subtle and modern spiritual environment, a peaceful space with minimalist natural elements, highly detailed, 8k, instagram aesthetic, focusing on the concept of ${theme}. Theme of the week: ${currentWeek.weekTheme}.`,
        contentTheme: theme,
        cosmicAlignment: `Alinhado com a energia coletiva: ${currentWeek.collectiveEnergy}`
      });
    }, 1500); // 1.5 seconds delay to simulate AI generation
  });
}
