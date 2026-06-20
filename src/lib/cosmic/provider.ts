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

      const themeLower = theme.toLowerCase();

      // 1. Determine Title dynamically
      let suggestedTitle = "";
      if (themeLower.includes('ansiedade') || themeLower.includes('calma')) {
        suggestedTitle = "🌿 A calma que você procura começa quando você se escuta";
      } else if (themeLower.includes('prosperidade') || themeLower.includes('abundância') || themeLower.includes('merecimento') || themeLower.includes('dinheiro')) {
        suggestedTitle = "✨ O fluxo da abundância começa dentro de você";
      } else if (themeLower.includes('relacionamento') || themeLower.includes('amor')) {
        suggestedTitle = "💖 A qualidade de suas conexões reflete o amor que você nutre por si";
      } else {
        suggestedTitle = `✨ A verdadeira jornada de ${theme.toLowerCase()} começa quando você se escuta`;
      }

      // 2. Generate Caption parts dynamically
      // P1: Gancho emocional (Emotional Hook)
      let hook = "";
      if (themeLower.includes('ansiedade') || themeLower.includes('calma')) {
        hook = `Diante de um mundo acelerado, sentir a mente inquieta e o peito apertado tornou-se um peso invisível que muitos carregam. A sobrecarga mental e a constante sensação de urgência silenciam nossa paz. A energia coletiva desta semana nos convida a dar um passo atrás, buscar o acolhimento interno e silenciar o ruído externo.`;
      } else if (themeLower.includes('prosperidade') || themeLower.includes('abundância') || themeLower.includes('merecimento') || themeLower.includes('dinheiro')) {
        hook = `Muitas vezes, sem perceber, operamos a partir de crenças de escassez, sentindo que estamos travados ou que o fluxo da vida não flui para nós. A energia coletiva desta semana atua diretamente no fortalecimento da autoestima e no destravamento desse fluxo, nos provocando a questionar onde estamos fechando as portas para receber.`;
      } else {
        hook = `A rotina e as pressões cotidianas frequentemente nos afastam do que realmente importa, gerando uma exaustão silenciosa e uma desconexão profunda com nosso propósito. Esta semana, o cosmos nos convida a abrir um espaço seguro de reflexão e acolhimento para reencontrar nosso centro.`;
      }

      // P2: Reflexão baseada na metáfora principal (Main Metaphor Reflection)
      let reflection = "";
      if (themeLower.includes('ansiedade') || themeLower.includes('calma')) {
        reflection = `Olhar para a nossa relação com a ansiedade é como observar uma névoa densa matinal. Ela parece permanente e obstrui a visão, mas, sob a luz certa, ela começa a se dissipar lentamente, revelando um céu claro e tranquilo que sempre esteve lá. O caminho para a serenidade não é lutar contra a névoa, mas permitir que ela passe.`;
      } else if (themeLower.includes('prosperidade') || themeLower.includes('abundância') || themeLower.includes('merecimento') || themeLower.includes('dinheiro')) {
        reflection = `Compreender o nosso merecimento é como abrir um portal de luz dourada em nossa própria essência. Não se trata de buscar a riqueza no mundo externo, mas sim de ativar essa arquitetura interna expansiva, permitindo que a luz quente e abundante flua de dentro para fora, iluminando cada nova oportunidade.`;
      } else {
        reflection = `Nossa jornada interna assemelha-se a um jardim secreto que, após enfrentar uma longa e fria estação, começa lentamente a desabrochar. Cada nova folha e flor representa uma parte de nós que escolhemos acolher e integrar, sob a luz de nossa própria consciência.`;
      }

      // P3: Transformação segura (Safe Transformation)
      let safeTransformation = "";
      if (themeLower.includes('ansiedade') || themeLower.includes('calma')) {
        safeTransformation = `No espaço terapêutico, minha intenção é guiar você de volta ao seu corpo, incentivando a respiração consciente e promovendo a regulação do seu sistema nervoso. Lembre-se: este é um convite seguro e gentil para pausar, reencontrar a sua âncora e lembrar que você está seguro no aqui e agora.`;
      } else if (themeLower.includes('prosperidade') || themeLower.includes('abundância') || themeLower.includes('merecimento') || themeLower.includes('dinheiro')) {
        safeTransformation = `Na terapia, trabalhamos para identificar e transmutar os sentimentos de inadequação, conectando você com o seu valor inestimável e inato. Este é um convite para reconhecer suas qualidades únicas e se abrir de forma segura e consciente para receber o melhor da vida.`;
      } else {
        safeTransformation = `Através do acompanhamento terapêutico, criamos um espaço de escuta qualificada para acolher todas as suas vivências com amorosidade. Minha missão é ajudar você a reconectar-se com suas raízes e trilhar um caminho de crescimento integrado e respeitoso com seu próprio ritmo.`;
      }

      if (additionalNotes) {
        safeTransformation += `\n\nFoco especial do nosso trabalho: ${additionalNotes}`;
      }

      // P4: CTA terapêutico (Therapeutic CTA)
      let ctaText = "";
      const ctaRecommended = currentWeek.recommendedCta || "agendamento terapêutico";
      if (themeLower.includes('ansiedade') || themeLower.includes('calma')) {
        ctaText = `Permita-se viver com mais leveza e presença. Se você sente que é hora de desacelerar, clique no link da bio para realizar seu ${ctaRecommended} e iniciar esse processo de acolhimento.`;
      } else if (themeLower.includes('prosperidade') || themeLower.includes('abundância') || themeLower.includes('merecimento') || themeLower.includes('dinheiro')) {
        ctaText = `Você está pronto para permitir que a abundância flua em sua vida? Dê esse passo em direção ao seu merecimento. Clique no link da bio para realizar o seu ${ctaRecommended}.`;
      } else {
        ctaText = `Que tal abrir espaço para cuidar de você e da sua saúde emocional? Convido você a agendar sua consulta. Clique no link da bio e faça seu ${ctaRecommended}.`;
      }

      // P5: Hashtags
      const cleanTheme = theme.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toLowerCase();
      const hashtagsList = [
        `#${cleanTheme}`,
        "#autoconhecimento",
        "#saudeemocional",
        "#terapiaholistica",
        "#bemestar",
        "#observadorcosmico",
        "#transformacao"
      ];
      const hashtagsStr = hashtagsList.join(" ");

      const dynamicCaption = `${hook}\n\n${reflection}\n\n${safeTransformation}\n\n${ctaText}\n\n${hashtagsStr}`;

      const geminiCopy = {
        title: suggestedTitle,
        copy: geminiPrompt,
        cta: ctaText,
        hashtags: hashtagsList
      } as any;

      const gptCopy = {
        title: suggestedTitle,
        copy: gptPrompt,
        cta: ctaText,
        hashtags: hashtagsList
      } as any;

      resolve({
        geminiCopy,
        gptCopy,
        copyTitle: suggestedTitle,
        copyCaption: dynamicCaption,
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
