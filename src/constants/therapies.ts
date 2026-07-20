export interface TherapyTaxonomyItem {
  id: string
  name: string
  officialName: string
  slug: string
  shortDescription: string
  fullDescription: string
  category: 'ENERGETICA' | 'QUANTICA' | 'SISTEMICA' | 'INTEGRATIVA'
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'DEPRECATED'
  isPics: boolean
  highlightOrder: number
  iconName: string
  aliases?: string[]
}

export class TaxonomyRegistry {
  static readonly THERAPIES: TherapyTaxonomyItem[] = [
    {
      id: 'thetahealing',
      name: 'ThetaHealing',
      officialName: 'ThetaHealing®',
      slug: 'thetahealing',
      shortDescription: 'Identifique e transforme crenças limitantes no nível subconsciente.',
      fullDescription: 'Terapia de cura energética que utiliza a frequência de onda cerebral Theta para identificar e liberar crenças bloqueadoras e padrões emocionais limitantes no subconsciente.',
      category: 'ENERGETICA',
      status: 'ACTIVE',
      isPics: false,
      highlightOrder: 1,
      iconName: 'Sparkles',
    },
    {
      id: 'tqa',
      name: 'TQA — Terapia Quântica Atlante',
      officialName: 'TQA — Terapia Quântica Atlante',
      slug: 'tqa-terapia-quantica-atlante',
      shortDescription: 'Reequilíbrio vibracional profundo nos campos sutis.',
      fullDescription: 'Sistema vibracional quântico focado no alinhamento dos corpos sutis, desobstrução de meridianos energéticos e harmonização eletromagnética do campo humano.',
      category: 'QUANTICA',
      status: 'ACTIVE',
      isPics: false,
      highlightOrder: 2,
      iconName: 'Zap',
      aliases: ['TQA', 'Terapia Quântica'],
    },
    {
      id: 'terapia-multidimensional',
      name: 'Terapia Multidimensional',
      officialName: 'Terapia Multidimensional',
      slug: 'terapia-multidimensional',
      shortDescription: 'Cura através do coração e dos campos energéticos.',
      fullDescription: 'Prática de cura energética focada no Chakra do Coração, que atua na resolução de registros do passado e transmutação de bloqueios nas dimensões sutis.',
      category: 'ENERGETICA',
      status: 'ACTIVE',
      isPics: false,
      highlightOrder: 3,
      iconName: 'Heart',
    },
    {
      id: 'mesa-metatronica-mac',
      name: 'Mesa Metatrônica MAC',
      officialName: 'Mesa Metatrônica MAC (Mesa de Ancoramento Metatrônico)',
      slug: 'mesa-metatronica-mac',
      shortDescription: 'Realinhamento quântico com geometrias sagradas e Arcanjo Metatron.',
      fullDescription: 'Ferramenta radiestésica e quanticamente ancorada na frequência de Metatron para limpeza de resíduos sutis, harmonização de chakras e ativação geométrica.',
      category: 'QUANTICA',
      status: 'ACTIVE',
      isPics: false,
      highlightOrder: 4,
      iconName: 'Compass',
      aliases: ['Mesa Metrônica MAQ', 'Mesa Metatrônica'],
    },
    {
      id: 'emf-balancing',
      name: 'EMF Balancing Technique',
      officialName: 'EMF Balancing Technique®',
      slug: 'emf-balancing-technique',
      shortDescription: 'Harmonização da malha de calibração universal e campo eletromagnético.',
      fullDescription: 'Procedimento de calibração do campo eletromagnético humano para fortalecer a estrutura energética pessoal, promovendo paz interior e equilíbrio.',
      category: 'ENERGETICA',
      status: 'ACTIVE',
      isPics: false,
      highlightOrder: 5,
      iconName: 'Wind',
    },
    {
      id: 'mesa-arturiana',
      name: 'Mesa Arturiana Multidimensional',
      officialName: 'Mesa Arturiana Multidimensional',
      slug: 'mesa-arturiana-multidimensional',
      shortDescription: 'Sistema de elevação de frequência e transmutação energética.',
      fullDescription: 'Mesa radiestésica ancorada na frequência arturiana de luz, voltada para limpeza espiritual profunda, desativação de padrões repetitivos e ativação do corpo de luz.',
      category: 'QUANTICA',
      status: 'ACTIVE',
      isPics: false,
      highlightOrder: 6,
      iconName: 'Sun',
      aliases: ['Mesa Arcturiana Multidimensional', 'Mesa Arcturiana'],
    },
    {
      id: 'constelacao-familiar',
      name: 'Constelação Familiar',
      officialName: 'Constelação Sistêmica Familiar',
      slug: 'constelacao-familiar',
      shortDescription: 'Libere padrões sistêmicos e emaranhamentos ancestrais.',
      fullDescription: 'Abordagem terapêutica sistêmica desenvolvida por Bert Hellinger para trazer à luz dinâmicas occultas e emaranhamentos familiares.',
      category: 'SISTEMICA',
      status: 'ACTIVE',
      isPics: true,
      highlightOrder: 7,
      iconName: 'Brain',
    },
    {
      id: 'meditacao',
      name: 'Meditação Guiada',
      officialName: 'Meditação Guiada e Mindfulness',
      slug: 'meditacao-guiada',
      shortDescription: 'Acalme a mente e reconecte-se com sua essência.',
      fullDescription: 'Técnicas de atenção plena e relaxamento profundo para redução do estresse, ansiedade e expansão do autoconhecimento.',
      category: 'INTEGRATIVA',
      status: 'ACTIVE',
      isPics: true,
      highlightOrder: 8,
      iconName: 'Moon',
    },
  ]

  static getActiveTherapies(): TherapyTaxonomyItem[] {
    return this.THERAPIES.filter(t => t.status === 'ACTIVE').sort((a, b) => a.highlightOrder - b.highlightOrder)
  }

  static findBySlug(slug: string): TherapyTaxonomyItem | undefined {
    return this.THERAPIES.find(t => t.slug === slug || t.id === slug)
  }

  static findByNameOrAlias(name: string): TherapyTaxonomyItem | undefined {
    const search = name.trim().toLowerCase()
    return this.THERAPIES.find(t =>
      t.name.toLowerCase() === search ||
      t.officialName.toLowerCase() === search ||
      t.aliases?.some(a => a.toLowerCase() === search)
    )
  }
}

// Compatibilidade e exportações legadas
export const SEED_THERAPY_TYPE_NAMES = [
  'ThetaHealing',
  'TQA — Terapia Quântica Atlante',
  'Terapia Multidimensional',
  'Mesa Metatrônica MAC',
  'EMF Balancing Technique',
  'Mesa Arturiana Multidimensional',
  'Constelação Familiar',
  'Meditação Guiada',
] as const

export const THERAPIST_THERAPY_MODAL_OPTIONS = [
  'ThetaHealing',
  'TQA — Terapia Quântica Atlante',
  'Terapia Multidimensional',
  'Mesa Metatrônica MAC',
  'EMF Balancing Technique',
  'Mesa Arturiana Multidimensional',
  'Constelação Familiar',
  'Meditação Guiada',
  'Outras',
] as const

export type TherapistTherapyModalOption = (typeof THERAPIST_THERAPY_MODAL_OPTIONS)[number]

export function isTherapistTherapyPresetName(name: string): boolean {
  return THERAPIST_THERAPY_MODAL_OPTIONS.includes(name as TherapistTherapyModalOption) && name !== 'Outras'
}
