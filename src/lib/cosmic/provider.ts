export interface CosmicContext {
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

// Mock de dados da energia da semana
export async function getWeeklyCosmicContext(): Promise<CosmicContext> {
  // Simulando delay de API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        weekTheme: "Abundância e merecimento",
        collectiveEnergy: "Momento favorável para autoestima, expansão financeira e desbloqueio emocional.",
        bestTopics: [
          "prosperidade",
          "merecimento",
          "autocuidado",
          "limites"
        ],
        recommendedCta: "agendamento de sessão"
      });
    }, 300);
  });
}

// Mock da geração de conteúdo
export async function generateCosmicContent(
  therapistId: string,
  contentType: string,
  theme: string,
  additionalNotes?: string
): Promise<CosmicGenerationResult> {
  // Simulando delay de geração via IA (ex: OpenAI)
  return new Promise((resolve) => {
    setTimeout(() => {
      const copy = `A energia da semana nos convida a olhar para dentro e reconhecer nosso verdadeiro valor. Quando falamos sobre ${theme}, estamos na verdade abrindo espaço para curar velhas feridas e abraçar a nossa jornada de autodescoberta.\n\nSinta como seu corpo reage a essa possibilidade. Permita-se soltar o que não serve mais.\n\nVocê está pronto para dar o próximo passo rumo ao seu bem-estar emocional? ${additionalNotes ? `\n\nLembre-se: ${additionalNotes}` : ''}`;
      
      resolve({
        copy,
        hashtags: ["#autoconhecimento", `#${theme.replace(/\s+/g, '')}`, "#terapiaholistica", "#expansaodaconsciencia", "#energiaastral"],
        cta: "Agende sua sessão e vamos juntos desbloquear esse caminho.",
        imagePrompt: `Cinematic, ultra realistic, elegant wellness aesthetic, soft golden hour lighting, a subtle and modern spiritual environment, a peaceful space with minimalist natural elements, highly detailed, 8k, instagram aesthetic, focusing on the concept of ${theme}.`,
        contentTheme: theme,
        cosmicAlignment: "Alinhado com a forte energia de Júpiter em Touro, favorecendo a expansão no campo material e emocional."
      });
    }, 1500); // 1.5 seconds delay to simulate AI generation
  });
}
