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
  geminiCopy: any;
  gptCopy: any;
  copyTitle?: string;
  copyCaption: string;
  contextUsed: {
    contentType: string;
    theme: string;
    notes: string;
    cosmicContext: string;
    therapeuticIntention?: string;
  };
}

export interface MasterCreativeContext {
  emotionalAngle: string;
  emotionalAngleEN: string;
  centralMetaphor: string;
  centralMetaphorEN: string;
  visualScene: string;
  visualScenePT: string;
  colorPalette: string;
  colorPalettePT: string;
  symbolicElements: string[];
  therapeuticIntention: string;
  audienceState: string;
  transformationPromiseSafe: string;
}

export function buildMasterCreativeContext(params: {
  contentType: string;
  theme: string;
  notes?: string;
  cosmicContext: string;
  therapistProfile?: any;
}): MasterCreativeContext {
  const themeLower = params.theme.toLowerCase();
  
  if (themeLower.includes('ansiedade') || themeLower.includes('calma')) {
    return {
      emotionalAngle: "Serenidade profunda, respiração aliviada e centramento",
      emotionalAngleEN: "Deep serenity, relieved breathing, and centering",
      centralMetaphor: "A névoa se dissolvendo para revelar um céu claro e tranquilo",
      centralMetaphorEN: "Mist dissolving to reveal a clear and tranquil sky",
      visualScene: "A calm, serene environment with soft morning mist slowly clearing, gentle light touching still water",
      visualScenePT: "Um ambiente calmo e sereno com névoa suave matinal se dissipando lentamente sobre águas tranquilas",
      colorPalette: "Soft blues, silver, pale lavender, misty white",
      colorPalettePT: "Azuis suaves, prata, lavanda pálida, branco enevoado",
      symbolicElements: ["gentle ripples", "soft glowing light", "open hands receiving peace", "floating particles"],
      therapeuticIntention: "Trazer os pacientes de volta ao corpo, incentivando a respiração consciente e a regulação do sistema nervoso",
      audienceState: "Sobrecarga, mente acelerada, sensação de falta de ar",
      transformationPromiseSafe: "Um convite para pausar, reencontrar o centro e lembrar que o agora é um lugar seguro"
    };
  }

  if (themeLower.includes('prosperidade') || themeLower.includes('merecimento') || themeLower.includes('abundância') || themeLower.includes('dinheiro') || themeLower.includes('relacionamento')) {
    return {
      emotionalAngle: "Expansão, valor próprio, abundância fluida e alegria radiante",
      emotionalAngleEN: "Expansion, self-worth, fluid abundance, and radiant joy",
      centralMetaphor: "Um portal de luz dourada se abrindo, derramando energia de oportunidades",
      centralMetaphorEN: "A golden portal of light opening, pouring out energy of opportunities",
      visualScene: "A radiant golden portal opening in a sacred architectural space, overflowing with warm expanding light",
      visualScenePT: "Um radiante portal dourado se abrindo em um espaço arquitetônico sagrado, transbordando uma luz quente e expansiva",
      colorPalette: "Warm golds, amber, glowing white, subtle emerald touches",
      colorPalettePT: "Tons de ouro quente, âmbar, branco brilhante, toques sutis de esmeralda",
      symbolicElements: ["glowing portal", "expansive architecture", "radiant light beams", "open upward posture"],
      therapeuticIntention: "Desbloquear a sensação de escassez e conectar o paciente com seu merecimento inato",
      audienceState: "Sensação de bloqueio, escassez, falta de merecimento",
      transformationPromiseSafe: "Um movimento interno para reconhecer o próprio valor e se abrir para receber"
    };
  }

  return {
    emotionalAngle: "Acolhimento amoroso, reflexão profunda e reconexão interna",
    emotionalAngleEN: "Loving acceptance, deep reflection, and inner reconnection",
    centralMetaphor: "Uma jornada por um jardim interno que começa a florescer após uma longa estação fria",
    centralMetaphorEN: "A journey through an inner garden beginning to bloom after a long cold season",
    visualScene: "An elegant mystic inner garden slowly blooming, soft celestial light piercing through ancient trees",
    visualScenePT: "Um elegante jardim interno místico florescendo lentamente, com uma luz celestial suave perfurando árvores ancestrais",
    colorPalette: "Earthy tones, soft greens, warm sunburst, gentle peach",
    colorPalettePT: "Tons terrosos, verdes suaves, raios de sol quentes, pêssego gentil",
    symbolicElements: ["blooming flora", "ancient roots", "celestial sunlight", "path of light"],
    therapeuticIntention: "Fomentar o acolhimento de todas as partes de si mesmo, promovendo integração emocional",
    audienceState: "Desconexão, dúvidas sobre o próprio caminho, exaustão emocional",
    transformationPromiseSafe: "Um espaço seguro para olhar para dentro e acolher a própria história com gentileza"
  };
}

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

export async function generateCosmicContent(
  therapistId: string,
  contentType: string,
  theme: string,
  additionalNotes?: string
): Promise<CosmicGenerationResult> {
  const currentWeek = await getWeeklyCosmicContext();

  const master = buildMasterCreativeContext({
    contentType,
    theme,
    notes: additionalNotes,
    cosmicContext: currentWeek.collectiveEnergy,
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      const isFeed = contentType.toLowerCase() === 'feed';
      
      const gptComposition = isFeed
        ? `Instagram Feed vertical 4:5 composition, ideal size 1080x1350px, premium editorial framing, centered subject, safe margins.`
        : `Instagram Story vertical 9:16 composition, ideal size 1080x1920px, immersive full-screen framing, safe top and bottom margins.`;

      const geminiComposition = isFeed
        ? `Create the image for Instagram Feed, vertical 4:5 ratio, ideal size 1080x1350px, with a clean centered composition.`
        : `Create the image for Instagram Story, vertical 9:16 ratio, ideal size 1080x1920px, with immersive vertical composition and safe space at the top and bottom.`;

      const gptPrompt = `Create a cinematic premium therapeutic artwork.

Subject:
${master.visualScene}

Environment:
${master.centralMetaphorEN}

Lighting:
soft volumetric light, cinematic atmosphere

Composition:
${gptComposition}

Camera:
85mm lens, shallow depth of field

Color palette:
${master.colorPalette}

Style:
luxury wellness campaign, premium editorial photography

Quality:
ultra detailed, photorealistic, award-winning photography

Negative prompts:
text, watermark, logo, blurry elements`;

      const geminiPrompt = `${geminiComposition}

Main scene:
${master.visualScene}

Emotional intention:
${master.emotionalAngleEN}

Symbolic metaphor:
${master.centralMetaphorEN}

Sensory details:
${master.symbolicElements.join(", ")}

Artistic direction:
modern spiritual editorial aesthetic, elegant, human-centered, premium wellness branding

Color palette:
${master.colorPalette}

No text.

No logos.

No watermarks.`;

      const geminiCopy = {
        title: undefined,
        copy: geminiPrompt,
        cta: ``,
        hashtags: []
      } as any;

      const gptCopy = {
        title: undefined,
        copy: gptPrompt,
        cta: ``,
        hashtags: []
      } as any;

      let suggestedTitle = `✨ A verdadeira jornada de ${theme.toLowerCase()} começa quando você se escuta`;
      const themeLower = theme.toLowerCase();
      if (themeLower.includes('ansiedade') || themeLower.includes('calma')) {
        suggestedTitle = `🌿 A calma que você procura começa quando você se escuta`;
      } else if (themeLower.includes('prosperidade') || themeLower.includes('abundância') || themeLower.includes('dinheiro')) {
        suggestedTitle = `✨ O portal para sua prosperidade começa a se abrir por dentro`;
      } else {
        suggestedTitle = `💫 Nem toda jornada de ${theme.toLowerCase()} acontece do lado de fora`;
      }

      resolve({
        geminiCopy,
        gptCopy,
        copyTitle: suggestedTitle,
        copyCaption: 'Exemplo de legenda do provedor mock',
        contextUsed: {
          contentType,
          theme,
          notes: additionalNotes || "",
          cosmicContext: currentWeek.collectiveEnergy,
          therapeuticIntention: master.therapeuticIntention
        }
      });
    }, 1500);
  });
}
