import { getThemeVisualDna, getSensoryDetails } from './src/lib/cosmic/theme-visual-library';
import { pickVisualElement } from './src/lib/cosmic/provider';

function runTest() {
  const themes = ['Família', 'Emoções', 'Prosperidade', 'Ansiedade'];
  const format = 'feed';
  const composition = `Instagram Feed vertical 4:5 composition, ideal size 1080x1350px, centered subject, premium editorial framing, safe margins.`;

  console.log("================================================================================");
  console.log("TESTING COSMIC OBSERVER VISUAL PROMPT GENERATION (GPT & GEMINI)");
  console.log("================================================================================");

  themes.forEach(theme => {
    const visualDna = getThemeVisualDna(theme);
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
