const themeVisualLibrary = {
  familia: {
    subjects: [
      "a warm intergenerational family gathered in a cozy luminous home",
      "symbolic family silhouettes connected by subtle golden threads",
      "parent and child sharing a quiet moment of emotional safety",
      "generations standing near a large ancestral tree"
    ],
    scenes: [
      "family members around a wooden table illuminated by soft morning light",
      "an ancestral tree with glowing roots connecting different generations",
      "a cozy living room filled with warmth, memory, and belonging",
      "hands from different generations gently touching"
    ],
    environments: [
      "warm home interior",
      "ancestral garden",
      "cozy family room",
      "sunlit wooden table",
      "symbolic forest of family roots"
    ],
    symbols: [
      "roots",
      "ancestral tree",
      "golden threads",
      "shared table",
      "warm hands",
      "family circle"
    ],
    moods: [
      "belonging",
      "emotional safety",
      "reconciliation",
      "tenderness",
      "connection with roots"
    ],
    palettes: [
      "warm beige, terracotta, soft gold, cream",
      "amber, clay, ivory, warm brown",
      "peach, honey, muted earth tones"
    ],
    metaphors: [
      "roots that hold without imprisoning",
      "golden threads connecting generations",
      "a home inside the heart",
      "a tree that remembers every season"
    ]
  },
  emocoes: {
    subjects: [
      "a person observing their reflection in calm water",
      "a human silhouette surrounded by soft emotional waves",
      "a figure standing between mist and colored light",
      "a person holding a glowing sphere near the heart"
    ],
    scenes: [
      "emotional waves moving through a quiet reflective lake",
      "a mirror-like surface revealing inner feelings",
      "a sky shifting from stormy blue to soft violet",
      "a calm body of water reflecting different emotional colors"
    ],
    environments: [
      "reflective lake",
      "misty emotional landscape",
      "abstract inner ocean",
      "twilight sky",
      "quiet room with water reflections"
    ],
    symbols: [
      "water",
      "mirror",
      "mist",
      "emotional waves",
      "glowing heart",
      "changing sky"
    ],
    moods: [
      "emotional awareness",
      "sensitivity",
      "inner listening",
      "acceptance",
      "emotional release"
    ],
    palettes: [
      "deep blue, violet, silver, soft white",
      "lavender, midnight blue, pearl, mist gray",
      "aqua, indigo, moonlight silver"
    ],
    metaphors: [
      "emotions as waves that need space to move",
      "a mirror revealing what was hidden",
      "a sky changing without losing itself",
      "water carrying what words cannot explain"
    ]
  },
  ansiedade: {
    subjects: [
      "a person breathing calmly as mist dissolves around them",
      "a seated figure finding stillness under a quiet sky",
      "a person walking slowly through soft fog toward light",
      "hands resting on the heart during a moment of grounding"
    ],
    scenes: [
      "fog dissolving as sunlight enters the scene",
      "a calm breath represented by soft circular waves",
      "a quiet horizon after a storm",
      "a person surrounded by gentle air currents becoming still"
    ],
    environments: [
      "misty morning field",
      "calm minimal room",
      "quiet shoreline",
      "open sky after rain",
      "peaceful path through fog"
    ],
    symbols: [
      "breath",
      "mist",
      "horizon",
      "soft wind",
      "open sky",
      "gentle light"
    ],
    moods: [
      "calm",
      "grounding",
      "safety",
      "slowing down",
      "inner quiet"
    ],
    palettes: [
      "pale blue, white, silver, soft gray",
      "sky blue, pearl, light lavender",
      "cool blue, mist white, gentle silver"
    ],
    metaphors: [
      "breath as an anchor",
      "fog slowly clearing",
      "a storm becoming silence",
      "the body returning home"
    ]
  },
  prosperidade: {
    subjects: [
      "a person standing before a luminous golden portal",
      "hands receiving soft golden light",
      "a figure walking on an illuminated path of expansion",
      "symbolic abundance flowing as golden particles"
    ],
    scenes: [
      "a golden portal opening in a serene landscape",
      "light flowing like a river through open hands",
      "a path expanding toward a bright horizon",
      "seeds of light growing into a radiant garden"
    ],
    environments: [
      "luminous pathway",
      "golden field",
      "emerald garden",
      "open horizon",
      "sacred portal space"
    ],
    symbols: [
      "golden light",
      "portal",
      "seeds",
      "flowing river",
      "open hands",
      "expanding path"
    ],
    moods: [
      "expansion",
      "permission to receive",
      "confidence",
      "abundance",
      "inner worth"
    ],
    palettes: [
      "gold, emerald green, warm white, champagne",
      "deep green, soft gold, ivory",
      "honey gold, jade, cream"
    ],
    metaphors: [
      "receiving as an open doorway",
      "prosperity as inner expansion",
      "a river of abundance finding passage",
      "seeds becoming visible harvest"
    ]
  },
  fallback: {
    subjects: [
      "a serene person finding alignment in a peaceful landscape",
      "a quiet silhouette in harmony with their surroundings",
      "a figure standing calmly under a soft sky"
    ],
    scenes: [
      "light gently filtering through a calm atmosphere",
      "a peaceful pathway winding through a soft landscape",
      "a serene moment of reflection in nature"
    ],
    environments: [
      "serene natural landscape",
      "calm quiet room",
      "open peaceful horizon"
    ],
    symbols: [
      "gentle light",
      "calm path",
      "soft wind"
    ],
    moods: [
      "alignment",
      "peace",
      "stillness"
    ],
    palettes: [
      "soft green, warm beige, gentle blue",
      "cream, pastel lavender, ivory"
    ],
    metaphors: [
      "finding balance within",
      "a path appearing step by step",
      "listening to the silence"
    ]
  }
};

function getThemeVisualDna(themeName) {
  const normalized = themeName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (normalized.includes("familia")) return themeVisualLibrary.familia;
  if (normalized.includes("emocoes") || normalized.includes("emocao")) return themeVisualLibrary.emocoes;
  if (normalized.includes("ansiedade") || normalized.includes("calma")) return themeVisualLibrary.ansiedade;
  if (normalized.includes("prosperidade") || normalized.includes("abundancia") || normalized.includes("dinheiro")) return themeVisualLibrary.prosperidade;

  return themeVisualLibrary.fallback;
}

function getSensoryDetails(themeName, environment, mood) {
  const normalized = themeName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (normalized.includes("familia")) {
    return "warm textures of wood and fabrics, soft glowing morning light, cozy emotional warmth of belonging, feeling of safety and ancestral connection";
  }
  if (normalized.includes("emocoes") || normalized.includes("emocao")) {
    return "liquid textures, gentle ripples on water, cool silver and blue light, shifting emotional temperature, deep introspective feeling of flowing water";
  }
  if (normalized.includes("ansiedade") || normalized.includes("calma")) {
    return "misty air textures, soft clearing sunlight, cooling calming temperature, feeling of space expanding and breathing deeply";
  }
  if (normalized.includes("prosperidade") || normalized.includes("abundancia") || normalized.includes("dinheiro")) {
    return "luminous golden particles, warm radiant portal glow, welcoming and expanding emotional temperature, feeling of abundance and sacred space";
  }

  return "balanced natural textures, soft ambient lighting, comfortable stable temperature, feeling of inner peace and alignment";
}

function pickVisualElement(themeName, pool, seed) {
  if (!pool || pool.length === 0) return "";
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index];
}

function runTest() {
  const themes = ['Família', 'Emoções', 'Prosperidade', 'Ansiedade'];
  const format = 'feed';
  const composition = `Instagram Feed vertical 4:5 composition, ideal size 1080x1350px, centered subject, premium editorial framing, safe margins.`;

  console.log("================================================================================");
  console.log("TESTING COSMIC OBSERVER VISUAL PROMPT GENERATION (GPT & GEMINI)");
  console.log("================================================================================");

  themes.forEach(theme => {
    const visualDna = getThemeVisualDna(theme);
    // Simulating multiple generations with slightly different seeds (e.g. timestamp variations)
    // to show determinism works, but we print one representative generation per theme here.
    const baseSeed = `${theme.toLowerCase()}_${format}_test_seed_12345`;

    const selectedSubject = pickVisualElement(theme, visualDna.subjects, baseSeed + "_subject");
    const selectedEnvironment = pickVisualElement(theme, visualDna.environments, baseSeed + "_environment");
    const selectedMood = pickVisualElement(theme, visualDna.moods, baseSeed + "_mood");
    const selectedSymbol = pickVisualElement(theme, visualDna.symbols, baseSeed + "_symbol");
    const selectedMetaphor = pickVisualElement(theme, visualDna.metaphors, baseSeed + "_metaphor");
    const selectedPalette = pickVisualElement(theme, visualDna.palettes, baseSeed + "_palette");
    const selectedScene = pickVisualElement(theme, visualDna.scenes, baseSeed + "_scene");
    const selectedSensory = getSensoryDetails(theme, selectedEnvironment, selectedMood);

    // GPT Prompt Formatting
    const gptPrompt = `Create a premium cinematic therapeutic artwork.

Subject:
${selectedSubject}

Environment:
${selectedEnvironment}

Emotional mood:
${selectedMood}

Symbolic elements:
${selectedSymbol}

Visual metaphor:
${selectedMetaphor}

Lighting:
soft volumetric lighting, cinematic glow

Composition:
${composition}

Camera:
85mm lens, shallow depth of field

Color palette:
${selectedPalette}

Visual style:
luxury editorial wellness campaign, premium photography, emotionally engaging

Quality:
ultra detailed, photorealistic, award-winning composition

Negative prompts:
text, watermark, logo, blurry elements, low quality, distorted hands, extra fingers`;

    // Gemini Prompt Formatting
    const geminiPrompt = `Create an emotionally resonant visual scene.

Main scene:
${selectedScene}

Emotional intention:
${selectedMood}

Symbolic metaphor:
${selectedMetaphor}

Atmosphere:
${selectedEnvironment}

Sensory details:
${selectedSensory}

Artistic direction:
modern spiritual editorial aesthetic, elegant, human-centered, premium wellness branding

Symbolic elements:
${selectedSymbol}

Color palette:
${selectedPalette}

Composition:
${composition}

No text.
No logos.
No watermarks.`;

    console.log(`\n### THEME: ${theme.toUpperCase()} ###`);
    console.log("--------------------------------------------------------------------------------");
    console.log(`[GPT PROMPT]`);
    console.log(gptPrompt);
    console.log("--------------------------------------------------------------------------------");
    console.log(`[GEMINI PROMPT]`);
    console.log(geminiPrompt);
    console.log("================================================================================");
  });
}

runTest();
