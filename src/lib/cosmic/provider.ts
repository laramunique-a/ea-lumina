import { prisma } from '@/lib/prisma';
import { buildSmartCopySuggestion } from './narrative-engine';

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
  suggestedCopy?: any;
  copyTitle: string;
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

const ZODIAC_SEASONS = [
  { season: "Foco, Estrutura e Inovação", energy: "Energia de concretização e busca por novas perspectivas para o futuro.", topics: ["planejamento", "inovação", "carreira", "foco"] }, // Jan
  { season: "Intuição, Coletivo e Sonhos", energy: "Forte conexão com o todo, ideal para causas sociais e mergulhos intuitivos.", topics: ["intuição", "comunidade", "sonhos", "espiritualidade"] }, // Feb
  { season: "Cura Profunda e Novos Inícios", energy: "Fechamento de ciclos emocionais profundos e abertura para agir com coragem.", topics: ["cura", "coragem", "ação", "liberação"] }, // Mar
  { season: "Coragem, Materialização e Estabilidade", energy: "Impulso realizador muito forte. A energia pede que tiremos os planos do papel com consistência.", topics: ["materialização", "estabilidade", "iniciativa", "segurança"] }, // Apr
  { season: "Segurança, Comunicação e Trocas", energy: "Momento para nutrir o que tem valor e expressar nossas ideias de forma clara.", topics: ["comunicação", "valores", "trocas", "autoestima"] }, // May
  { season: "Aprendizado, Emoções e Acolhimento", energy: "Mente curiosa unida à necessidade de segurança emocional e conexão com as raízes.", topics: ["emoções", "aprendizado", "família", "acolhimento"] }, // Jun
  { season: "Autoexpressão, Brilho e Raízes", energy: "A energia favorece mostrar ao mundo quem somos e nutrir nossa criança interior.", topics: ["autoexpressão", "criatividade", "alegria", "autoconfiança"] }, // Jul
  { season: "Organização, Rotina e Detalhes", energy: "Foco no detalhe, na rotina e em ajustes necessários para que as relações floresçam.", topics: ["rotina", "equilíbrio", "saúde", "purificação"] }, // Aug
  { season: "Harmonia, Relacionamentos e Transformação", energy: "Necessidade de acordos justos e mergulhos profundos no que precisa ser transformado.", topics: ["transformação", "harmonia", "parcerias", "desapego"] }, // Sep
  { season: "Renascimento, Expansão e Verdade", energy: "Cura através de verdades profundas e otimismo para alçar novos voos.", topics: ["renascimento", "expansão", "verdade", "otimismo"] }, // Oct
  { season: "Propósito, Sabedoria e Estrutura", energy: "Busca por propósito, filosofia de vida e responsabilidade para ancorar grandes aprendizados.", topics: ["propósito", "sabedoria", "responsabilidade", "metas"] }, // Nov
  { season: "Encerramentos, Maturidade e Planejamento", energy: "Reflexão sobre as montanhas escaladas e estruturação das bases para o próximo ano.", topics: ["conclusão", "ambição", "legado", "maturidade"] } // Dec
];

const MOON_PHASES = [
  { phase: "Energia de Inícios", modifier: "É o momento perfeito para plantar sementes de intenção e iniciar movimentos.", topic: "novas intenções" }, // Sem 1
  { phase: "Energia de Crescimento", modifier: "Os desafios podem surgir, exigindo persistência, ajustes e superação.", topic: "desenvolvimento" }, // Sem 2
  { phase: "Energia de Apogeu", modifier: "A luz ilumina tudo. Momento de clareza, extroversão, transbordamento e colheita.", topic: "celebração" }, // Sem 3
  { phase: "Energia de Recolhimento", modifier: "O cosmos pede um movimento para dentro, favorecendo limpeza, descanso e desapego.", topic: "desapego" } // Sem 4
];

export async function getWeeklyCosmicContext(): Promise<CosmicContext> {
  const date = new Date();
  const day = date.getDay(); // 0 = Domingo
  const diff = date.getDate() - day;
  const startDate = new Date(date);
  startDate.setDate(diff);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const weekStartStr = formatDate(startDate);
  const weekEndStr = formatDate(endDate);

  // Busca se já existe uma leitura gerada para a semana atual
  const currentWeek = await prisma.cosmicWeek.findFirst({
    where: { weekStart: weekStartStr },
  });

  if (currentWeek) {
    return {
      id: currentWeek.id,
      weekStart: currentWeek.weekStart,
      weekEnd: currentWeek.weekEnd,
      weekTheme: currentWeek.weekTheme,
      collectiveEnergy: currentWeek.collectiveEnergy,
      bestTopics: currentWeek.bestTopics,
      recommendedCta: currentWeek.recommendedCta,
    };
  }

  // Motor Cósmico Dinâmico (Sincronizado com o ano e mês real)
  const month = startDate.getMonth(); // 0-11
  const weekOfMonth = Math.min(Math.floor(startDate.getDate() / 7), 3); // 0-3

  const seasonContext = ZODIAC_SEASONS[month];
  const moonContext = MOON_PHASES[weekOfMonth];

  const combinedTheme = `${seasonContext.season} e ${moonContext.phase}`;
  const combinedEnergy = `${seasonContext.energy} ${moonContext.modifier}`;
  const combinedTopics = [...seasonContext.topics, moonContext.topic];

  const newWeek = await prisma.cosmicWeek.create({
    data: {
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      weekTheme: combinedTheme,
      collectiveEnergy: combinedEnergy,
      bestTopics: combinedTopics,
      recommendedCta: "agendamento terapêutico"
    }
  });

  return {
    id: newWeek.id,
    weekStart: newWeek.weekStart,
    weekEnd: newWeek.weekEnd,
    weekTheme: newWeek.weekTheme,
    collectiveEnergy: newWeek.collectiveEnergy,
    bestTopics: newWeek.bestTopics,
    recommendedCta: newWeek.recommendedCta,
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

      const smartCopy = buildSmartCopySuggestion({
        contentType,
        theme,
        additionalNotes,
        collectiveEnergy: currentWeek.collectiveEnergy,
        therapeuticIntention: master.therapeuticIntention,
      });

      const suggestedTitle = smartCopy.copyTitle;
      const suggestedCaption = smartCopy.copyCaption;

      resolve({
        geminiCopy,
        gptCopy,
        copyTitle: suggestedTitle,
        copyCaption: suggestedCaption,
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
