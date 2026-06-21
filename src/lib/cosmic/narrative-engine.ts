export interface SmartCopyContext {
  contentType: string; // 'feed' | 'story'
  theme: string;
  additionalNotes?: string;
  collectiveEnergy?: string;
  therapeuticIntention?: string;
}

export interface SmartCopyResult {
  copyTitle: string;
  copyCaption: string;
}

type ThemeCategory = 'ansiedade' | 'prosperidade' | 'autocuidado';

function getThemeCategory(theme: string): ThemeCategory {
  const t = theme.toLowerCase();
  if (t.includes('ansiedade') || t.includes('calma') || t.includes('estresse') || t.includes('medo') || t.includes('preocupação') || t.includes('pânico')) {
    return 'ansiedade';
  }
  if (t.includes('prosperidade') || t.includes('merecimento') || t.includes('abundância') || t.includes('dinheiro') || t.includes('carreira') || t.includes('sucesso') || t.includes('finanças')) {
    return 'prosperidade';
  }
  return 'autocuidado';
}

const TITULOS: Record<ThemeCategory, { text: string; keywords: string[] }[]> = {
  ansiedade: [
    { text: "Você não precisa resolver tudo hoje.", keywords: ["hoje", "tempo", "urgência", "resolver"] },
    { text: "A calma também pode ser construída aos poucos.", keywords: ["calma", "construção", "tempo", "ritmo"] },
    { text: "Sua mente não precisa carregar o mundo.", keywords: ["mente", "carregar", "mundo", "peso"] },
    { text: "Respire antes de se cobrar tanto.", keywords: ["respire", "respirar", "cobrança", "cobrar", "pressão"] },
    { text: "Nem toda urgência do dia é real.", keywords: ["urgência", "real", "dia", "calma"] },
    { text: "A pressa tenta nos convencer de que tudo é perigo.", keywords: ["pressa", "perigo", "mente", "correr"] },
    { text: "Há um lugar seguro dentro do momento presente.", keywords: ["presente", "seguro", "abrigo", "agora"] },
    { text: "Deixe que o amanhã se resolva no tempo dele.", keywords: ["amanhã", "tempo", "espera", "futuro"] },
    { text: "Seus pensamentos não são fatos absolutos.", keywords: ["pensamentos", "mente", "fatos", "realidade"] },
    { text: "O medo do futuro consome a beleza do agora.", keywords: ["medo", "futuro", "beleza", "agora", "presente"] },
    { text: "Menos cobrança, mais espaço para respirar.", keywords: ["cobrança", "respirar", "espaço", "peito", "alívio"] },
    { text: "O silêncio da mente é um exercício diário.", keywords: ["silêncio", "exercício", "mente", "calma"] },
    { text: "Onde está a sua atenção neste exato segundo?", keywords: ["atenção", "segundo", "agora", "presente"] },
    { text: "Desacelerar não significa parar de crescer.", keywords: ["desacelerar", "crescer", "movimento", "ritmo"] },
    { text: "Sua mente acelerada não define quem você é.", keywords: ["mente", "acelerada", "identidade", "quem sou"] },
    { text: "Há força na suavidade e na paciência.", keywords: ["suavidade", "paciência", "força", "calma"] },
    { text: "O ritmo do mundo não precisa ser o seu ritmo.", keywords: ["ritmo", "mundo", "tempo", "velocidade"] },
    { text: "Quem você seria se parasse de correr por um instante?", keywords: ["correr", "parar", "instante", "presença"] },
    { text: "Um suspiro profundo é o início de toda calma.", keywords: ["suspiro", "profundo", "calma", "respiração"] },
    { text: "Permita-se ser humano e imperfeito hoje.", keywords: ["humano", "imperfeito", "hoje", "permissão"] },
    { text: "Soltar a necessidade de controle traz leveza.", keywords: ["soltar", "controle", "leveza", "liberdade"] },
    { text: "Nem todo pensamento acelerado merece ser escutado.", keywords: ["pensamento", "acelerado", "escutar", "mente"] },
    { text: "Estabilidade emocional começa na aceitação do sentir.", keywords: ["estabilidade", "aceitação", "sentir", "emoções"] },
    { text: "A tempestade de pensamentos também vai passar.", keywords: ["tempestade", "pensamentos", "passar", "tempo"] },
    { text: "Volte para o seu corpo, sinta o seu chão.", keywords: ["corpo", "chão", "pés", "presença", "terra"] },
    { text: "Onde está o seu centro quando tudo se agita?", keywords: ["centro", "agitação", "tempestade", "calma"] },
    { text: "A paz que você busca está na presença.", keywords: ["paz", "presença", "agora", "silêncio"] },
    { text: "Você é maior do que o barulho da sua mente.", keywords: ["barulho", "mente", "caos", "maior"] },
    { text: "Dê a si mesmo a permissão de apenas estar aqui.", keywords: ["permissão", "aqui", "agora", "presente"] },
    { text: "Silenciar o caos externo exige coragem interna.", keywords: ["caos", "silêncio", "coragem", "interno"] },
    { text: "Nem toda resposta precisa ser imediata.", keywords: ["resposta", "imediata", "tempo", "espera"] },
    { text: "O que na sua vida pede menos pressa agora?", keywords: ["pressa", "agora", "vida", "desacelerar"] },
    { text: "Um passo de cada vez já é um grande avanço.", keywords: ["passo", "vez", "avanço", "caminho"] },
    { text: "Acolha a incerteza para aliviar o peso.", keywords: ["incerteza", "aliviar", "peso", "acolhimento"] },
    { text: "Você não está atrasado em relação a ninguém.", keywords: ["atrasado", "tempo", "comparação", "ritmo"] },
    { text: "Sua mente pode ser um abrigo seguro.", keywords: ["mente", "abrigo", "seguro", "paz"] },
    { text: "A pressa nos impede de ver as saídas.", keywords: ["pressa", "saídas", "clareza", "visão"] },
    { text: "O agora é o único lugar que existe.", keywords: ["agora", "lugar", "existe", "presente"] },
    { text: "Respire fundo e traga a mente para casa.", keywords: ["respire", "mente", "casa", "retorno"] },
    { text: "Não lute contra os pensamentos, apenas observe-os passar.", keywords: ["lute", "pensamentos", "observe", "passar", "nuvens"] },
    { text: "Acalmar a mente é um ato de autocompaixão.", keywords: ["acalmar", "mente", "autocompaixão", "gentileza"] },
    { text: "A urgência mental costuma ser uma ilusão.", keywords: ["urgência", "ilusão", "mente", "calma"] },
    { text: "Proteja o seu direito de ficar em silêncio.", keywords: ["direito", "silêncio", "proteção", "pausa"] },
    { text: "O amanhã não precisa ser antecipado.", keywords: ["amanhã", "antecipado", "tempo", "futuro"] },
    { text: "Deixe ir o que você não pode controlar.", keywords: ["deixe ir", "controlar", "soltar", "controle"] },
    { text: "Sua paz interior não está à venda.", keywords: ["paz", "interior", "valor", "limites"] },
    { text: "Sentir medo faz parte, deixar que ele controle não.", keywords: ["medo", "controle", "sentir", "coragem"] },
    { text: "Há um ritmo natural para todas as coisas.", keywords: ["ritmo", "natural", "tempo", "estação"] },
    { text: "O peso que você carrega na mente pode ser solto.", keywords: ["peso", "carrega", "mente", "soltar"] },
    { text: "Menos ansiedade e mais espaço para viver o agora.", keywords: ["ansiedade", "espaço", "viver", "agora", "presente"] }
  ],
  prosperidade: [
    { text: "Prosperidade começa quando você se permite receber.", keywords: ["prosperidade", "receber", "permissão", "fluxo"] },
    { text: "O crescimento verdadeiro começa de dentro para fora.", keywords: ["crescimento", "crescer", "dentro", "interno"] },
    { text: "Você não precisa se diminuir para caber no medo.", keywords: ["diminuir", "medo", "cabe", "tamanho"] },
    { text: "Receber também exige coragem e merecimento.", keywords: ["receber", "coragem", "merecimento", "direito"] },
    { text: "Qual é o tamanho da sua permissão para crescer?", keywords: ["permissão", "crescer", "tamanho", "expansão"] },
    { text: "Riqueza sem paz é apenas outra forma de cansaço.", keywords: ["riqueza", "paz", "cansaço", "sucesso"] },
    { text: "A abundância flui onde a escassez não faz morada.", keywords: ["abundância", "escassez", "fluxo", "morada"] },
    { text: "O seu valor não está na sua conta bancária.", keywords: ["valor", "conta", "dinheiro", "identidade"] },
    { text: "Você se permite desfrutar do que já conquistou?", keywords: ["permitir", "desfrutar", "conquistas", "prazer"] },
    { text: "O fluxo da prosperidade exige aprender a soltar.", keywords: ["fluxo", "prosperidade", "soltar", "confiança"] },
    { text: "Reconheça o seu merecimento inato antes de realizar.", keywords: ["merecimento", "inato", "realizar", "valor"] },
    { text: "O sucesso verdadeiro respeita a sua saúde mental.", keywords: ["sucesso", "respeito", "saúde", "equilíbrio"] },
    { text: "Dinheiro é energia de troca; como está a sua?", keywords: ["dinheiro", "energia", "troca", "relação"] },
    { text: "Atreva-se a cobrar o preço justo pelo seu valor.", keywords: ["preço", "justo", "valor", "cobrar", "trabalho"] },
    { text: "A gratidão atrai as circunstâncias certas para a colheita.", keywords: ["gratidão", "colheita", "circunstâncias", "frequência"] },
    { text: "Liberar crenças de limitação é um ato de prosperidade.", keywords: ["liberar", "crenças", "limitação", "escassez"] },
    { text: "O medo da falta cria barreiras para a abundância.", keywords: ["medo", "falta", "barreiras", "abundância"] },
    { text: "Você não precisa de esforço extremo para ser merecedor.", keywords: ["esforço", "merecedor", "esforçar", "facilidade"] },
    { text: "A abundância é a certeza de que sempre há o essencial.", keywords: ["abundância", "certeza", "essencial", "segurança"] },
    { text: "Quando você se valoriza, o mundo reflete essa verdade.", keywords: ["valoriza", "mundo", "reflete", "verdade", "merecimento"] },
    { text: "Realização profissional exige coerência com a sua essência.", keywords: ["realização", "profissional", "coerência", "essência"] },
    { text: "Você tem medo de brilhar mais do que os outros?", keywords: ["brilhar", "medo", "outros", "sucesso", "comparação"] },
    { text: "A generosidade abre portas para o fluxo da vida.", keywords: ["generosidade", "portas", "fluxo", "vida"] },
    { text: "Investir em si mesmo sinaliza o seu próprio valor.", keywords: ["investir", "si mesmo", "valor", "autoestima"] },
    { text: "A prosperidade engloba tempo livre, saúde e conexões.", keywords: ["prosperidade", "tempo livre", "saúde", "conexões"] },
    { text: "Deixe ir a necessidade de esforço doloroso para vencer.", keywords: ["esforço", "doloroso", "vencer", "trabalho", "luta"] },
    { text: "Sua criatividade é a sua fonte de riqueza mais valiosa.", keywords: ["criatividade", "fonte", "riqueza", "valiosa"] },
    { text: "Confie no ritmo natural das suas conquistas.", keywords: ["ritmo", "natural", "conquistas", "tempo", "confiança"] },
    { text: "O sucesso duradouro é construído sobre a integridade.", keywords: ["sucesso", "integridade", "duradouro", "valores"] },
    { text: "Dizer sim para si mesmo atrai novas oportunidades.", keywords: ["oportunidades", "dizer sim", "si mesmo", "abertura"] },
    { text: "O merecimento inato não exige justificativas.", keywords: ["merecimento", "inato", "justificativas", "valor"] },
    { text: "Você é digno de prosperar simplesmente por ser quem é.", keywords: ["digno", "prosperar", "ser", "identidade"] },
    { text: "Rompa com o ciclo de escassez da sua história.", keywords: ["ciclo", "escassez", "história", "ancestralidade", "família"] },
    { text: "A abundância é um estado mental de presença.", keywords: ["abundância", "estado", "presença", "agora"] },
    { text: "Seus talentos merecem ser remunerados de forma justa.", keywords: ["talentos", "remunerados", "justa", "remuneração"] },
    { text: "O que na sua carreira está pedindo mais expansão?", keywords: ["carreira", "expansão", "trabalho", "crescer"] },
    { text: "Conecte seu trabalho ao seu propósito de vida.", keywords: ["trabalho", "propósito", "vida", "alinhamento"] },
    { text: "O fluxo do dinheiro acompanha a clareza da intenção.", keywords: ["dinheiro", "fluxo", "clareza", "intenção"] },
    { text: "Menos comparação profissional, mais foco na sua jornada.", keywords: ["comparação", "jornada", "foco", "carreira"] },
    { text: "A prosperidade começa no reconhecimento do seu valor próprio.", keywords: ["prosperidade", "reconhecimento", "valor próprio", "merecimento"] },
    { text: "Abundância não é acumular, é saber que nada falta.", keywords: ["abundância", "acumular", "falta", "suficiente"] },
    { text: "Não sabote o seu crescimento por medo de incomodar.", keywords: ["sabote", "crescimento", "incomodar", "brilhar"] },
    { text: "A atitude de abundância transforma pequenos recursos em riqueza.", keywords: ["atitude", "recursos", "riqueza", "abundância"] },
    { text: "A generosidade consigo mesmo é o primeiro passo da colheita.", keywords: ["generosidade", "consigo mesmo", "colheita", "passo"] },
    { text: "O merecimento se cultiva aceitando o melhor da vida.", keywords: ["merecimento", "aceitando", "melhor", "vida"] },
    { text: "A sua fonte interna de criatividade é inesgotável.", keywords: ["fonte", "criatividade", "inesgotável", "criação"] },
    { text: "Abra as mãos para doar e receber na mesma medida.", keywords: ["mãos", "doar", "receber", "medida", "equilíbrio"] },
    { text: "A stabilidade profissional nasce do seu alinhamento interno.", keywords: ["estabilidade", "alinhamento", "interno", "carreira"] },
    { text: "O que você escolhe nutrir hoje trará frutos amanhã.", keywords: ["nutrir", "hoje", "frutos", "amanhã", "tempo"] },
    { text: "Permita-se sonhar grande e agir com consistência.", keywords: ["sonhar", "grande", "agir", "consistência", "realização"] }
  ],
  autocuidado: [
    { text: "Nem toda pausa é perda de tempo.", keywords: ["pausa", "tempo", "perda", "descanso"] },
    { text: "Você tem se escutado ou apenas sobrevivido?", keywords: ["escutado", "sobrevivido", "vida", "presença"] },
    { text: "O corpo fala antes da mente entender.", keywords: ["corpo", "mente", "entender", "fala", "sinais"] },
    { text: "Cuidar de si também é um compromisso sério.", keywords: ["cuidar", "compromisso", "sério", "si mesmo"] },
    { text: "O excesso de autocobrança adoece a alma.", keywords: ["excesso", "autocobrança", "adoece", "alma"] },
    { text: "Acolher-se é o primeiro passo para a cura.", keywords: ["acolher", "primeiro passo", "cura", "acolhimento"] },
    { text: "Colocar limites nas demandas externas é amor-próprio.", keywords: ["limites", "demandas", "amor-próprio", "proteção"] },
    { text: "Você é o seu maior aliado nessa caminhada.", keywords: ["maior aliado", "caminhada", "si mesmo", "aliado"] },
    { text: "O autocuidado profundo vai além do superficial.", keywords: ["autocuidado", "profundo", "superficial", "essência"] },
    { text: "Dizer não aos outros pode ser o seu melhor sim.", keywords: ["dizer não", "melhor sim", "limites", "outros"] },
    { text: "A exaustão não deveria ser o preço do sucesso.", keywords: ["exaustão", "preço", "sucesso", "descanso"] },
    { text: "O amor-próprio é a base de todas as relações.", keywords: ["amor-próprio", "base", "relações", "autoestima"] },
    { text: "Trate a si mesmo com a gentileza que você dá ao mundo.", keywords: ["gentileza", "mundo", "tratamento", "autocompaixão"] },
    { text: "Sua história de vida merece ser acolhida por completo.", keywords: ["história", "vida", "acolhida", "passado"] },
    { text: "O acolhimento interno cura as dores do passado.", keywords: ["acolhimento", "interno", "cura", "dores", "passado"] },
    { text: "O que o seu corpo está tentando lhe dizer hoje?", keywords: ["corpo", "dizer", "hoje", "sinais", "mensagens"] },
    { text: "Você não precisa carregar o mundo nas costas.", keywords: ["carregar", "mundo", "costas", "peso", "responsabilidade"] },
    { text: "Autocompaixão é o antídoto para a perfeição paralisante.", keywords: ["autocompaixão", "antídoto", "perfeição", "paralisante"] },
    { text: "Qual foi a última vez que você cuidou de si?", keywords: ["cuidar", "última vez", "si", "pausa"] },
    { text: "Nenhum sucesso externo compensa a falta de paz interna.", keywords: ["sucesso", "paz interna", "paz", "compensação"] },
    { text: "Seu corpo é o seu templo; como você o habita?", keywords: ["corpo", "templo", "habita", "casa"] },
    { text: "Aprender a receber cuidado exige vulnerabilidade e coragem.", keywords: ["receber", "cuidado", "vulnerabilidade", "coragem"] },
    { text: "Não espere esgotar-se para decidir descansar.", keywords: ["esgotar", "descansar", "decisão", "pausa"] },
    { text: "Afastar-se do que te desgasta é legítima defesa.", keywords: ["afastar", "desgasta", "defesa", "limites"] },
    { text: "Autoestima nasce da aceitação das suas imperfeições.", keywords: ["autoestima", "aceitação", "imperfeições", "autocompaixão"] },
    { text: "Você tem o direito de recomeçar quantas vezes quiser.", keywords: ["direito", "recomeçar", "vezes", "renovação"] },
    { text: "O que na sua rotina drena a sua energia vital?", keywords: ["rotina", "drena", "energia", "vital"] },
    { text: "Resgatar a conexão consigo mesmo exige silêncio.", keywords: ["conexão", "consigo mesmo", "silêncio", "interior"] },
    { text: "O descanso é produtivo e restaura a sua alma.", keywords: ["descanso", "produtivo", "restaura", "alma"] },
    { text: "Seja paciente com o tempo das suas sementes brotarem.", keywords: ["paciente", "tempo", "sementes", "brotar", "crescimento"] },
    { text: "Você merece o mesmo cuidado que dispensa aos outros.", keywords: ["merece", "cuidado", "outros", "equilíbrio"] },
    { text: "Cuidar de si é um ato revolucionário de liberdade.", keywords: ["cuidar de si", "revolucionário", "liberdade", "amor-próprio"] },
    { text: "Sua paz de espírito deve vir sempre em primeiro lugar.", keywords: ["paz de espírito", "paz", "primeiro lugar", "prioridade"] },
    { text: "Acolha suas vulnerabilidades com ternura e respeito.", keywords: ["vulnerabilidades", "ternura", "respeito", "acolhimento"] },
    { text: "O autoconhecimento nos devolve a nossa essência.", keywords: ["autoconhecimento", "essência", "identidade", "retorno"] },
    { text: "Você não precisa provar nada para ninguém hoje.", keywords: ["provar", "ninguém", "hoje", "expectativas"] },
    { text: "A autovalorização começa no respeito aos seus limites.", keywords: ["autovalorização", "respeito", "limites", "valor"] },
    { text: "Silencie as cobranças para escutar a sua intuição.", keywords: ["silencie", "cobranças", "escutar", "intuição"] },
    { text: "O que na sua vida hoje pede mais gentileza?", keywords: ["vida", "hoje", "gentileza", "autocompaixão"] },
    { text: "Aprenda a nutrir a si mesmo antes de transbordar.", keywords: ["nutrir", "si mesmo", "transbordar", "copo"] },
    { text: "Suas cicatrizes contam a sua força de sobrevivência.", keywords: ["cicratizes", "força", "sobrevivência", "história", "superação"] },
    { text: "A autoestima saudável é construída em pequenas escolhas.", keywords: ["autoestima", "saudável", "construída", "escolhas"] },
    { text: "Liberte-se do peso de tentar agradar a todos.", keywords: ["peso", "agradar", "todos", "liberdade"] },
    { text: "O autocuidado diário evita o esgotamento futuro.", keywords: ["autocuidado", "diário", "esgotamento", "futuro"] },
    { text: "Cada amanhecer traz uma nova chance de se priorizar.", keywords: ["amanhecer", "chance", "priorizar", "hoje"] },
    { text: "A sua história merece ser contada com carinho.", keywords: ["história", "merece", "carinho", "narrativa"] },
    { text: "Fazer pausas conscientes restaura a sua vitalidade.", keywords: ["pausas", "conscientes", "restaura", "vitalidade"] },
    { text: "Menos autocrítica e mais espaço para ser você mesmo.", keywords: ["autocrítica", "espaço", "ser você", "liberdade"] },
    { text: "O acolhimento começa na escuta atenta das suas dores.", keywords: ["acolhimento", "escuta", "atenta", "dores"] },
    { text: "Confie na sabedoria invisível do seu crescimento.", keywords: ["confie", "sabedoria", "crescimento", "tempo"] }
  ]
};

const GANCHOS: Record<ThemeCategory, string[]> = {
  ansiedade: [
    "Nem toda urgência é real; às vezes é apenas o hábito de correr.",
    "Sua mente acelerada não define quem você é.",
    "Você não precisa resolver todo o seu futuro no dia de hoje.",
    "Há uma força imensa em saber quando é hora de desacelerar.",
    "O silêncio da pausa não é tempo perdido, é espaço conquistado.",
    "A ansiedade tenta nos fazer viver no futuro, mas a vida só acontece agora.",
    "Respirar fundo é o primeiro ato de rebeldia contra a pressa.",
    "Não gaste a energia de hoje tentando controlar o vento de amanhã.",
    "Nem sempre o corpo pede mais esforço; às vezes ele implora por espaço.",
    "O medo do pior cenário costuma cegar os caminhos que já estão abertos.",
    "Seus pensamentos são como nuvens: eles passam, mas você é o céu.",
    "O peso que você carrega na mente não precisa se tornar sua identidade.",
    "Quando tudo parecer confuso, volte a atenção para o ritmo da sua respiração.",
    "Desacelerar não é fraqueza; é a sabedoria de preservar o próprio ser.",
    "A pressa nos dá a ilusão de controle, mas o controle é apenas um mito.",
    "Há momentos em que dar um passo para trás é a única forma de seguir em frente.",
    "O que aconteceria se você soltasse a necessidade de prever o próximo passo?",
    "Sentir medo é humano; deixar que ele guie cada escolha é uma armadilha.",
    "A paz que você busca não está na ausência de ruído, mas na presença de si.",
    "Acolher a incerteza é o início de uma relação mais leve com a própria mente.",
    "Você é maior do que a tempestade que está acontecendo dentro de você.",
    "Nem todo pensamento acelerado merece ser levado a sério.",
    "Estar vivo exige pausas; a exaustão não deveria ser o seu motor de busca.",
    "Dê a si mesmo a permissão de não ter todas as respostas agora.",
    "O que na sua vida hoje está pedindo menos velocidade e mais presença?",
    "Aprender a silenciar a mente começa por aceitar o barulho que ela faz.",
    "Sua mente não precisa ser um campo de batalha constante contra o amanhã.",
    "Estabilidade não significa nunca oscilar, mas saber voltar ao próprio centro.",
    "Acalmar a mente é um exercício diário de paciência com as próprias sombras.",
    "O amanhã chegará no seu próprio tempo; hoje, apenas habite o seu corpo."
  ],
  prosperidade: [
    "Prosperidade começa onde a mentalidade de escassez termina.",
    "Receber também é uma habilidade que precisa ser cultivada.",
    "Crescer financeiramente e profissionalmente exige criar espaço interno primeiro.",
    "Nem todo bloqueio financeiro tem a ver com dinheiro; muitos nascem do merecimento.",
    "A verdadeira expansão começa de dentro para fora.",
    "Você se permite desfrutar do que já conquistou ou vive apenas para o próximo ganho?",
    "A escassez nos faz acreditar que o sucesso do outro limita o nosso.",
    "Riqueza sem paz de espírito é apenas outra forma de prisão.",
    "Qual é a história que você conta para si mesmo sobre o seu direito de prosperar?",
    "O fluxo da abundância exige aprender a soltar o controle e confiar no seu valor.",
    "Sua produtividade não é a única régua para medir seu merecimento.",
    "Dizer 'sim' para novas oportunidades exige coragem de dizer 'não' ao que te diminui.",
    "O dinheiro é uma energia de troca; como você tem se relacionado com ela?",
    "Atrair prosperidade é, antes de tudo, alinhar o que você faz com quem você é.",
    "Seu valor como ser humano é absoluto e não flutua com a sua conta bancária.",
    "Romper com as crenças de limitação da nossa história familiar é um ato de cura.",
    "O medo da falta costuma criar exatamente as barreiras que impedem o fluxo.",
    "A abundância não é sobre acumular, mas sobre sentir que o essencial sempre flui.",
    "Quando você reconhece seu próprio valor, o mundo começa a refletir essa verdade.",
    "O trabalho duro é importante, mas o trabalho alinhado com o propósito é próspero.",
    "Você tem medo de brilhar muito e incomodar quem está ao seu redor?",
    "A generosidade com os outros começa com a generosidade consigo mesmo.",
    "O que você herdou sobre dinheiro que hoje não serve mais para o seu caminho?",
    "Expandir sua vida profissional exige despedir-se da necessidade de agradar a todos.",
    "A prosperidade verdadeira engloba tempo livre, saúde mental e conexões reais.",
    "Investir em si mesmo é o primeiro sinal que você dá ao universo sobre seu valor.",
    "Tentar controlar cada centavo pelo medo da perda afasta a energia da abundância.",
    "Seu potencial de realização está diretamente ligado ao tamanho do seu merecimento.",
    "A gratidão pelo presente abre os portais para a colheita do futuro.",
    "Abundância é a certeza de que a fonte da sua criatividade nunca seca."
  ],
  autocuidado: [
    "O excesso de autocobrança também adoece o corpo e a mente.",
    "Nem todo dia é para produzir; alguns são exclusivamente para acolher.",
    "Colocar limites nas demandas externas é a forma mais pura de amor-próprio.",
    "Você tem sido o seu próprio aliado ou o seu pior juiz?",
    "O autocuidado vai muito além de um banho quente; é sobre as decisões difíceis.",
    "Dizer não para o outro pode ser a única forma de dizer sim para si mesmo.",
    "A exaustão não deve ser o preço a pagar para se sentir digno de descanso.",
    "Como você reage quando a vida te pede para simplesmente parar e respirar?",
    "O amor-próprio não é egoísmo, é a base para conseguir se conectar com o mundo.",
    "Trate a si mesmo com a mesma gentileza que você dedica a quem ama.",
    "Sua história merece ser acolhida por completo, inclusive os capítulos difíceis.",
    "O acolhimento interno é a chave para curar as feridas da rejeição.",
    "A pressa nos desconecta do corpo; o que o seu corpo está tentando te dizer agora?",
    "Você não precisa carregar o mundo nas costas para provar o seu valor.",
    "Cuidar de si é um compromisso diário com a sua própria saúde mental.",
    "O que você precisa deixar ir hoje para que seu peito possa respirar mais leve?",
    "Acolher as próprias vulnerabilidades é onde reside a nossa verdadeira força.",
    "A autocompaixão é o antídoto contra a busca incessante por perfeição.",
    "Qual foi a última vez que você fez algo apenas pelo prazer de estar vivo?",
    "Nenhum sucesso externo compensa a perda da sua paz interior.",
    "Seu corpo é a sua casa; como você tem cuidado do seu templo interno?",
    "Aprender a receber cuidado é tão importante quanto saber cuidar.",
    "Não espere adoecer para perceber que precisa descansar.",
    "O autocuidado silencioso é aquele que escolhe afastar-se de relações tóxicas.",
    "A autoestima não nasce de ser perfeito, mas de se aceitar imperfeito.",
    "Você tem o direito de mudar de ideia, de rota e de recomeçar quando quiser.",
    "O que na sua rotina atual tem drenado sua energia sem trazer retorno?",
    "Resgatar a conexão consigo mesmo exige coragem de olhar para dentro.",
    "O descanso é produtivo; ele restaura a sua capacidade de criar e amar.",
    "Ser gentil com seus processos é aceitar que cada semente tem seu tempo de brotar."
  ]
};

const METAFORAS: Record<ThemeCategory, { name: string; text: string; keywords: string[] }[]> = {
  ansiedade: [
    { name: "âncora", text: "uma âncora firme que nos estabiliza no fundo do oceano, impedindo que sejamos levados pelas ondas", keywords: ["estabilidade", "segurança", "corpo", "firmeza", "terra"] },
    { name: "vento nos galhos", text: "o vento forte que balança a copa das árvores, lembrando-nos que as folhas agitam, mas o tronco permanece firme", keywords: ["pensamentos", "agitação", "tempestade", "vento", "tronco"] },
    { name: "mar agitado", text: "um oceano em meio à ressaca, onde a calmaria não está em lutar contra a água, mas em mergulhar abaixo das ondas", keywords: ["mar", "oceano", "profundidade", "luta", "água"] },
    { name: "névoa matinal", text: "uma névoa densa que cobre o caminho, mas que inevitavelmente se dissipa com os primeiros raios de sol", keywords: ["névoa", "neblina", "caminho", "visão", "sol", "clareza"] },
    { name: "céu após a chuva", text: "o céu limpo que surge logo após uma tempestade, revelando que as nuvens carregadas eram passageiras", keywords: ["chuva", "tempestade", "nuvem", "céu", "passagem", "tempo"] },
    { name: "bússola interna", text: "uma bússola antiga que aponta para o norte mesmo no meio da neblina mais escura", keywords: ["direção", "norte", "bússola", "guia", "caminho", "certeza"] },
    { name: "rio caudaloso", text: "um rio correndo rápido, onde resistir à correnteza cansa, mas flutuar com ela nos poupa a energia", keywords: ["rio", "correnteza", "fluxo", "resistência", "soltar"] },
    { name: "farol na costa", text: "um farol na rocha que brilha silencioso na noite escura, guiando os barcos perdidos sem tentar acalmar o mar", keywords: ["farol", "luz", "guia", "noite", "rocha", "silêncio"] },
    { name: "casulo protetor", text: "um casulo de seda onde a lagarta se recolhe no escuro antes de descobrir que pode voar", keywords: ["casulo", "recolhimento", "escuro", "proteção", "mudança", "tempo"] },
    { name: "raízes profundas", text: "raízes centenárias que se estendem sob a terra, segurando a árvore inteira mesmo nos ventos mais fortes", keywords: ["raízes", "terra", "árvore", "fundação", "sustentação"] },
    { name: "lago espelhado", text: "um lago calmo e imóvel, que só consegue refletir a beleza do céu quando a agitação da superfície cessa", keywords: ["lago", "espelho", "calma", "superfície", "reflexo", "imagem"] },
    { name: "estação do ano", text: "o inverno rigoroso que prepara a terra no silêncio para que a primavera volte a florescer", keywords: ["estação", "inverno", "primavera", "tempo", "ciclo", "silêncio"] },
    { name: "caminho de pedras", text: "um carreiro sinuoso onde cada pedra nos força a dar passos mais conscientes e atentos", keywords: ["caminho", "pedras", "passo", "atenção", "presença", "chão"] },
    { name: "barco à deriva", text: "um barco que solta as velas rasgadas para simplesmente boiar e descansar até que o vento mude", keywords: ["barco", "vela", "vento", "descanso", "deriva", "soltar"] },
    { name: "pássaro em repouso", text: "um pássaro que pousa no galho mais alto, sabendo que sua segurança não vem da força do galho, mas das suas asas", keywords: ["pássaro", "asa", "confiança", "segurança", "galho"] },
    { name: "porto seguro", text: "um porto calmo cercado por quebra-mares, onde os barcos podem descansar das tempestades do oceano", keywords: ["porto", "abrigo", "descanso", "segurança", "proteção"] },
    { name: "sussurro do vento", text: "o vento suave do entardecer que desfaz as nuvens pesadas e traz o frescor da noite", keywords: ["vento", "sussurro", "noite", "frescor", "nuvens"] },
    { name: "solo sagrado", text: "um pedaço de terra firme sob os pés descalços, trazendo de volta a sensação de realidade e pertencimento", keywords: ["solo", "pés", "chão", "realidade", "presença", "terra"] },
    { name: "casca de semente", text: "a casca dura da semente que racha sob a pressão da terra, não como destruição, mas para dar vida ao broto", keywords: ["semente", "casca", "pressão", "brotar", "vida", "nascimento"] },
    { name: "respiração da floresta", text: "a floresta que inspira oxigênio e expira vida, lembrando que tudo tem um ritmo natural de entrada e saída", keywords: ["floresta", "ritmo", "respiração", "vida", "natureza"] },
    { name: "tenda no deserto", text: "uma tenda firme no meio da tempestade de areia, nos convidando a sentar e esperar o vento passar", keywords: ["tenda", "deserto", "tempestade", "vento", "espera"] },
    { name: "espelho d'água", text: "a água cristalina de uma fonte que se acalma logo após a folha cair, recuperando sua transparência", keywords: ["transparência", "água", "fonte", "calma", "limpeza"] },
    { name: "sombra da árvore", text: "a sombra fresca de uma grande árvore que nos acolhe quando o calor do sol se torna insuportável", keywords: ["sombra", "árvore", "acolhimento", "frescor", "sol", "calor"] },
    { name: "noite estrelada", text: "a escuridão da noite que, longe de ser vazia, revela a beleza das estrelas que o dia ocultava", keywords: ["noite", "estrelas", "escuridão", "beleza", "revelação"] },
    { name: "cascata suave", text: "uma queda d'água contínua que lava a poeira das pedras, restaurando a leveza e a fluidez do caminho", keywords: ["cascata", "água", "limpeza", "leveza", "fluidez"] },
    { name: "fogueira acesa", text: "o fogo brando de uma lareira que aquece o corpo e acalma o olhar com sua dança hipnótica", keywords: ["fogo", "lareira", "calor", "corpo", "aconchego"] },
    { name: "horizonte infinito", text: "a linha do horizonte onde o céu encontra a terra, lembrando que nossos limites são apenas perspectivas", keywords: ["horizonte", "limite", "perspectiva", "espaço", "liberdade"] },
    { name: "orvalho da manhã", text: "as pequenas gotas de orvalho que nutrem a relva no silêncio da madrugada, preparando-a para o sol", keywords: ["orvalho", "nutrição", "silêncio", "madrugada", "delicadeza"] },
    { name: "ponte suspensa", text: "uma ponte de madeira que balança com o vento, mas cujos cabos de aço garantem a travessia segura", keywords: ["ponte", "travessia", "balanço", "segurança", "passagem"] },
    { name: "raiz na rocha", text: "uma pequena planta que cresce na fresta da rocha, mostrando que a vida sempre encontra um caminho para brotar", keywords: ["rocha", "planta", "vida", "caminho", "resistência"] }
  ],
  prosperidade: [
    { name: "portal dourado", text: "um portal de luz dourada que se abre à nossa frente, convidando-nos a cruzar a linha do merecimento", keywords: ["portal", "ouro", "luz", "merecimento", "abertura"] },
    { name: "semente fértil", text: "uma semente que carrega em si o código genético de uma floresta inteira, aguardando apenas o solo certo", keywords: ["semente", "solo", "potencial", "floresta", "crescimento"] },
    { name: "rio abundante", text: "um rio largo e constante que irriga os vales por onde passa, sem medo de que sua água vá acabar na próxima curva", keywords: ["rio", "abundância", "água", "fluxo", "confiança"] },
    { name: "jardim florido", text: "um jardim bem cuidado que atrai as borboletas naturalmente, sem que precisemos correr atrás delas", keywords: ["jardim", "borboletas", "atração", "cuidado", "beleza"] },
    { name: "colheita farta", text: "o momento de colher os frutos maduros de árvores que plantamos e regamos com paciência no passado", keywords: ["colheita", "frutos", "paciência", "tempo", "trabalho"] },
    { name: "mina de ouro", text: "uma reserva oculta de talentos e capacidades dentro de nós, esperando pelo trabalho consciente de escavação", keywords: ["mina", "talento", "capacidade", "trabalho", "descoberta"] },
    { name: "fonte inesgotável", text: "uma nascente de água cristalina no topo da montanha, que transborda e alimenta a vida ao redor sem nunca secar", keywords: ["fonte", "nascente", "montanha", "transbordo", "vida"] },
    { name: "árvore frutífera", text: "uma macieira carregada cujos galhos se curvam pelo peso dos frutos, oferecendo fartura a quem passa", keywords: ["árvore", "frutos", "galhos", "fartura", "generosidade"] },
    { name: "sol do meio-dia", text: "a luz intensa do sol que ilumina todos os cantos, dissipando as sombras da escassez e aquecendo a terra", keywords: ["sol", "luz", "escassez", "terra", "calor", "claridade"] },
    { name: "oceano de oportunidades", text: "um oceano vasto e azul onde as marés sempre trazem novos tesouros e possibilidades para a praia", keywords: ["oceano", "marés", "tesouros", "oportunidades", "praia"] },
    { name: "chama da lareira", text: "o fogo constante que aquece a casa inteira e se multiplica sem perder sua força quando acende outras velas", keywords: ["fogo", "lareira", "multiplicação", "força", "energia"] },
    { name: "floresta tropical", text: "um ecossistema rico e interconectado, onde a abundância de uma espécie serve de adubo para o crescimento da outra", keywords: ["floresta", "ecossistema", "riqueza", "conexão", "crescimento"] },
    { name: "chove na terra seca", text: "a chuva de verão que cai sobre a terra árida, fazendo brotar a vida que estava adormecida no solo", keywords: ["chuva", "terra", "vida", "solo", "renascimento"] },
    { name: "portal de oportunidades", text: "uma porta que se abre onde antes víamos apenas uma parede de limitações e bloqueios", keywords: ["porta", "parede", "limitações", "abertura", "liberdade"] },
    { name: "bússola de ouro", text: "um instrumento de navegação que nos guia em direção aos nossos maiores talentos e realizações", keywords: ["bússola", "ouro", "direção", "navegação", "talento"] },
    { name: "adubo nutritivo", text: "os erros e dificuldades do passado que se transformam em adubo rico para fortalecer as novas conquistas", keywords: ["adubo", "passado", "erros", "fortalecimento", "conquistas"] },
    { name: "corrente de água", text: "um canal limpo onde a água corre livre, sem barreiras ou galhos secos para impedir seu movimento natural", keywords: ["canal", "água", "movimento", "liberdade", "limpeza"] },
    { name: "ponte para o futuro", text: "uma ponte sólida que conecta nosso estado atual de esforço ao nosso destino de merecimento e paz", keywords: ["ponte", "esforço", "merecimento", "destino", "paz"] },
    { name: "farol da abundância", text: "uma luz forte que emitimos ao reconhecer nosso valor, atraindo as circunstâncias certas para nossa vida", keywords: ["farol", "luz", "valor", "atração", "circunstâncias"] },
    { name: "raiz forte", text: "raízes que penetram fundo no solo rico, garantindo que a planta cresça alta e suporte o peso de suas flores", keywords: ["raízes", "solo", "crescimento", "flores", "sustentação"] },
    { name: "as asas da águia", text: "asas fortes que aproveitam as correntes de ar quente para subir alto sem precisar bater asas freneticamente", keywords: ["asas", "águia", "altura", "esforço", "corrente", "leveza"] },
    { name: "campo de trigo", text: "um campo dourado ondulando ao vento, simbolizando que a fartura vem da união de muitas sementes individuais", keywords: ["trigo", "campo", "fartura", "sementes", "dourado"] },
    { name: "chave mestra", text: "uma chave dourada que abre as portas trancadas pelas crenças limitantes de escassez da nossa infância", keywords: ["chave", "portas", "crenças", "escassez", "libertação"] },
    { name: "vaso transbordante", text: "um vaso de barro que continua recebendo água e transborda para nutrir a terra ao redor, sem nunca reter o fluxo", keywords: ["vaso", "água", "transbordo", "nutrição", "fluxo"] },
    { name: "amanhecer dourado", text: "os primeiros raios de sol que iluminam a colina, prometendo um dia de produtividade alinhada e prosperidade", keywords: ["amanhecer", "sol", "colina", "produtividade", "promessa"] },
    { name: "rede de pescador", text: "uma rede tecida com fios de paciência e estudo, que traz do mar os recursos necessários para a vida", keywords: ["rede", "mar", "recursos", "paciência", "trabalho"] },
    { name: "espiral ascendente", text: "um movimento constante para cima, onde cada conquista nos dá uma visão mais ampla e próspera da vida", keywords: ["espiral", "movimento", "visão", "conquista", "expansão"] },
    { name: "terra preta", text: "um solo escuro e incrivelmente fértil, onde qualquer ideia plantada com amor e foco brota com vigor", keywords: ["solo", "fértil", "ideia", "foco", "vigor", "crescimento"] },
    { name: "orquestra em harmonia", text: "diferentes instrumentos tocando em sintonia, mostrando que a prosperidade vem do equilíbrio de todas as áreas da vida", keywords: ["orquestra", "harmonia", "instrumentos", "equilíbrio", "vida"] },
    { name: "joia lapidada", text: "um diamante que brilha intensamente após passar pelo processo necessário de lapidação e pressão", keywords: ["joia", "diamante", "pressão", "brilho", "processo"] }
  ],
  autocuidado: [
    { name: "jardim interno", text: "um jardim interno secreto que precisa ser regado, podado e protegido das ervas daninhas da autocobrança", keywords: ["jardim", "cuidado", "autocobrança", "flores", "cultivo"] },
    { name: "rio que contorna", text: "um rio de águas calmas que contorna os obstáculos de pedra com suavidade, em vez de tentar destruí-los à força", keywords: ["rio", "obstáculos", "suavidade", "força", "contorno"] },
    { name: "ponte de retorno", text: "uma ponte pênsil que nos leva de volta para casa após um longo dia de exaustão no mundo externo", keywords: ["ponte", "retorno", "casa", "exaustão", "mundo"] },
    { name: "portal do acolhimento", text: "uma porta de madeira rústica que se abre para um quarto quente com lareira, convidando ao repouso", keywords: ["portal", "acolhimento", "quarto", "lareira", "repouso"] },
    { name: "farol de si mesmo", text: "um farol cujas lentes voltamos para dentro, iluminando nossas próprias necessidades em vez de focar nos outros", keywords: ["farol", "iluminação", "necessidades", "interior", "si mesmo"] },
    { name: "floresta silenciosa", text: "uma mata densa onde o som das folhas e da natureza acalma o coração e nos conecta com a nossa essência", keywords: ["floresta", "essência", "natureza", "coração", "silêncio"] },
    { name: "semente no escuro", text: "uma semente plantada no solo escuro, que precisa de tempo no silêncio e na umidade para poder germinar", keywords: ["semente", "escuro", "silêncio", "tempo", "germinação"] },
    { name: "estação de repouso", text: "a estação do outono que nos ensina a arte de deixar cair as folhas secas para poupar a energia das raízes", keywords: ["estação", "outono", "folhas", "energia", "raízes", "soltar"] },
    { name: "amanhecer suave", text: "o amanhecer calmo com neblina que clareia aos poucos, sem pressa para que o sol atinja o meio do céu", keywords: ["amanhecer", "neblina", "pressa", "sol", "tempo", "calma"] },
    { name: "bússola do coração", text: "uma bússola cujos ponteiros se alinham com a nossa verdade interna, ignorando as expectativas alheias", keywords: ["bússola", "coração", "verdade", "expectativas", "alinhamento"] },
    { name: "raízes de árvore", text: "raízes fortes que absorvem os nutrientes da terra profunda, garantindo a sustentação de quem cuida dos outros", keywords: ["raízes", "nutrientes", "sustentação", "cuidado", "terra"] },
    { name: "céu sem nuvens", text: "o céu azul e límpido que surge quando decidimos esvaziar a mente dos excessos de tarefas acumuladas", keywords: ["céu", "azul", "mente", "tarefas", "excesso", "esvaziar"] },
    { name: "abrigo na floresta", text: "uma cabana de madeira acolhedora no meio da mata, oferecendo refúgio e silêncio das pressões externas", keywords: ["cabana", "refúgio", "silêncio", "pressões", "madeira"] },
    { name: "espelho de água", text: "a superfície perfeitamente lisa de uma fonte que nos permite enxergar nossa imagem real, sem distorções", keywords: ["superfície", "fonte", "imagem", "realidade", "transparência"] },
    { name: "chama interna", text: "uma pequena vela que queima constante no centro do peito, e que precisa ser protegida dos ventos da autocrítica", keywords: ["vela", "chama", "peito", "autocrítica", "proteção"] },
    { name: "terra fértil", text: "o solo rico da nossa vida que precisa de períodos de pousio (descanso) para recuperar sua força produtiva", keywords: ["solo", "descanso", "pousio", "força", "terra", "fértil"] },
    { name: "copo cheio", text: "um copo que só consegue transbordar água para os outros se for preenchido primeiro em sua própria fonte", keywords: ["copo", "água", "transbordo", "fonte", "preenchimento"] },
    { name: "abraço da terra", text: "o toque macio da grama úmida sob o corpo cansado, ancorando as tensões e trazendo paz imediata", keywords: ["grama", "terra", "corpo", "tensões", "paz", "abraço"] },
    { name: "casca protetora", text: "a casca protetora de um fruto que guarda sua polpa macia e doce das intempéries do ambiente externo", keywords: ["casca", "fruto", "polpa", "proteção", "limites"] },
    { name: "pássaro no ninho", text: "um pássaro que se recolhe no ninho quente ao entardecer, aceitando que a busca por alimento terminou por hoje", keywords: ["pássaro", "ninho", "recolhimento", "entardecer", "descanso"] },
    { name: "cascata de cura", text: "uma queda de água morna que escorre pelas costas lavando o estresse físico e as dores acumuladas", keywords: ["cascata", "água", "estresse", "corpo", "físico", "cura"] },
    { name: "fita métrica real", text: "uma régua própria de avaliação que mede nossos sucessos pelo tamanho da nossa paz, não pelo aplauso externo", keywords: ["régua", "avaliação", "sucesso", "paz", "aplauso"] },
    { name: "sussurro da alma", text: "a voz calma e baixa que fala no peito quando silenciamos o barulho das cobranças e obrigações", keywords: ["voz", "peito", "silêncio", "cobranças", "obrigações"] },
    { name: "escudo de cristal", text: "um escudo transparente que nos protege de energias densas externas sem nos fechar para a beleza do mundo", keywords: ["escudo", "proteção", "transparente", "energias", "beleza"] },
    { name: "clareira na mata", text: "um espaço aberto e ensolarado no meio da floresta fechada, onde podemos nos deitar e contemplar o céu", keywords: ["clareira", "espaço", "floresta", "céu", "contemplação"] },
    { name: "raio de luar", text: "a luz suave da lua que clareia o quarto silencioso, trazendo uma sensação de recolhimento e paz", keywords: ["luar", "lua", "quarto", "silêncio", "recolhimento"] },
    { name: "poço de águas profundas", text: "um poço antigo alimentado por lençóis freáticos intocados, simbolizando a nossa reserva interna de sabedoria", keywords: ["poço", "sabedoria", "água", "lençol", "reserva"] },
    { name: "trama tecida à mão", text: "um tecido macio que envolve o corpo, lembrando que a vida é construída com fios de paciência e carinho", keywords: ["tecido", "corpo", "vida", "fios", "paciência", "carinho"] },
    { name: "seixos do rio", text: "pedras arredondadas e macias pelo atrito constante da água, mostrando que o tempo suaviza todas as arestas", keywords: ["pedras", "rio", "água", "tempo", "suavidade", "arestas"] },
    { name: "orvalho restaurador", text: "a umidade fresca da manhã que hidrata a planta e a prepara para suportar o calor do novo dia", keywords: ["orvalho", "manhã", "planta", "calor", "restauração"] }
  ]
};

const REFLEXOES: Record<ThemeCategory, string[]> = {
  ansiedade: [
    "A necessidade constante de antecipar o amanhã é apenas uma tentativa da mente de criar uma ilusão de segurança. A segurança real não está em prever os fatos, mas em desenvolver a confiança de que você será capaz de lidar com o que vier.",
    "Quando a respiração fica curta e os pensamentos disparam, o corpo está enviando um sinal de alerta de que saímos do momento presente. Retornar ao agora não é ignorar os problemas futuros, mas reconhecer que eles não podem ser resolvidos antes do tempo.",
    "A pressa nos rouba a capacidade de saborear a caminhada. Passamos tanto tempo focados na linha de chegada que nos esquecemos de que a maior parte da vida acontece durante o trajeto. Permita-se andar mais devagar hoje.",
    "A ansiedade costuma fantasiar monstros gigantescos na escuridão da nossa mente. No entanto, quando lançamos a luz da presença e da racionalidade sobre eles, descobrimos que eram apenas sombras projetadas pelas nossas próprias inseguranças.",
    "Carregar o peso do controle é exaustivo. A verdade é que pouco ou quase nada está sob nosso comando direto. Quando aceitamos essa realidade, o peito relaxa e a mente finalmente encontra espaço para descansar.",
    "Dizer que está tudo bem não ter todas as respostas é um ato de autocompaixão profunda. Você não precisa carregar o mapa completo do seu futuro; basta dar o próximo passo com clareza e intenção.",
    "O ritmo acelerado do mundo contemporâneo nos faz acreditar que a lentidão é um erro. Contudo, na natureza, nada floresce sem o devido tempo de maturação. Respeite o seu tempo de gestação interna.",
    "A mente ansiosa funciona como um rádio sintonizado na frequência da escassez e do perigo. Desligar esse ruído exige um esforço consciente de voltar ao corpo, de sentir o chão sob os pés e o ar entrando nos pulmões.",
    "O medo de falhar ou de decepcionar os outros costuma ser o combustível que acelera nossos pensamentos. Lembrar que sua dignidade não depende da aprovação externa é o início da verdadeira libertação emocional.",
    "Toda tempestade de pensamentos tem um fim. Por mais forte que pareça o vendaval interno no momento, lembre-se de que você é a estrutura que sustenta a casa, e as nuvens de preocupação são apenas passageiras.",
    "Quando tentamos controlar o incontrolável, geramos uma fricção interna que se manifesta como aperto no peito. O caminho para a paz não é a força, mas a flexibilidade de fluir com os acontecimentos.",
    "A mente mente com frequência. Ela cria cenários de desastre que quase nunca se realizam, mas o seu corpo reage a eles como se fossem reais. Questione seus pensamentos antes de sofrer por eles.",
    "A calmaria não é a ausência de problemas, mas a capacidade de manter-se centrado enquanto a tempestade acontece ao redor. Esse centro é construído na prática diária de voltar a si.",
    "Há uma diferença crucial entre planejar o futuro e sofrer por ele. O planejamento organiza as ações; a preocupação consome a energia vital que você precisa para agir no presente.",
    "A ansiedade nos afasta de quem realmente somos, criando um personagem que precisa estar sempre alerta. Desarmar-se e aceitar a vulnerabilidade é o primeiro passo para a autocura.",
    "Seus limites não são barreiras para o seu sucesso, mas proteções para a sua integridade física e emocional. Respeitar o momento de parar é o que garante que você continuará caminhando.",
    "O excesso de estímulos externos fragmenta a nossa atenção e gera ansiedade. Criar momentos de silêncio e desconexão digital é essencial para restabelecer a harmonia do sistema nervoso.",
    "Cada vez que você respira consciente, você diz ao seu corpo que o momento presente é seguro. É um lembrete físico de que, neste exato segundo, está tudo bem.",
    "O medo do futuro é o medo de não dar conta. Mas olhe para trás: você sobreviveu a todos os dias difíceis que achou que não superaria. Você tem os recursos necessários dentro de si.",
    "A autocrítica severa apenas aumenta a tensão mental. Substituir o julgamento pela curiosidade gentil ('por que estou me sentindo assim?') desarma a ansiedade de forma imediata.",
    "Não tente acalmar a mente à força; isso só gera mais conflito. Em vez disso, acolha a agitação como quem acolhe uma criança assustada, e o barulho começará a diminuir.",
    "O tempo da cura não segue o relógio do mercado ou das redes sociais. A alma tem seu próprio tempo de integração e repouso. Honre o ritmo natural da sua jornada.",
    "A ansiedade nos faz sentir sozinhos na nossa dor. Mas a verdade é que o medo da incerteza é um traço compartilhado por toda a humanidade. Você não está isolado nessa busca por paz.",
    "A mente acelerada consome mais oxigênio e energia do que o necessário. Aprender a relaxar os músculos do rosto, dos ombros e do abdômen é uma forma prática de sinalizar calma ao cérebro.",
    "Você não é obrigado a carregar as expectativas que os outros projetam em você. Devolver esse peso ao remetente limpa o caminho para que você ande com os próprios pés.",
    "A incerteza é o único espaço onde a criação e a novidade podem acontecer. Quando paramos de temer o desconhecido, abrimo-nos para a surpresa bonita da vida.",
    "O silêncio interno não é vazio; é o espaço onde a nossa intuição consegue finalmente falar. Afaste-se do barulho para conseguir escutar a sua sabedoria interior.",
    "Tentar ser forte o tempo todo é o que nos quebra. A verdadeira resiliência está em aceitar o momento de fragilidade, chorar se necessário, e descansar para recompor as forças.",
    "A preocupação é um uso ineficiente da imaginação. Direcione a sua mente para criar imagens de paz, superação e harmonia, em vez de focar apenas no que pode dar errado.",
    "Você está no lugar certo, vivendo o processo necessário para o seu amadurecimento. Confie na sabedoria do caminho, mesmo quando a neblina temporariamente ocultar a paisagem."
  ],
  prosperidade: [
    "A verdadeira abundância não se mede pelo que acumulamos, mas pela nossa capacidade de sentir que o que temos e quem somos já é o suficiente para iniciar qualquer movimento de criação.",
    "Muitas vezes, a nossa relação com o dinheiro reflete a nossa relação com o próprio valor. Se nos sentimos inadequados ou indignos internamente, sabotamos as oportunidades externas de crescimento financeiro.",
    "A prosperidade exige fluxo. Reter recursos por medo da escassez é o mesmo que bloquear a passagem de um rio, gerando estagnação. Aprender a gastar com consciência e receber com gratidão mantém o ciclo ativo.",
    "Crenças familiares antigas sobre o dinheiro ser 'sujo' ou sobre a necessidade de sofrimento extremo para vencer na vida atuam como freios invisíveis na nossa carreira. Identificar e liberar essas histórias é um ato de liberdade.",
    "O sucesso que não permite tempo livre, saúde e paz de espírito não é prosperidade real; é apenas uma forma disfarçada de exaustão corporativa. O verdadeiro merecimento engloba todas as dimensões da vida.",
    "Você tem espaço interno para receber o que está pedindo ao universo? Às vezes, o peito está tão cheio de mágoas e medos que a abundância não encontra um canal livre para se manifestar.",
    "A comparação com a jornada alheia alimenta a ilusão de que os recursos são limitados e de que a vitória de alguém representa a sua derrota. O universo é infinitamente abundante e há espaço para o brilho de todos.",
    "A prosperidade verdadeira nasce da conexão profunda com os nossos talentos únicos. Quando colocamos nossa essência a serviço do mundo, o retorno financeiro torna-se uma consequência natural do valor que geramos.",
    "O merecimento não é algo que você precisa conquistar através de esforço desumano; é um direito de nascimento. Você é merecedor simplesmente por existir e por trazer sua presença única ao planeta.",
    "O medo de cobrar um preço justo pelo seu trabalho costuma revelar uma ferida de desvalorização. Valorizar sua energia, seu tempo e seus estudos é o primeiro passo para que o cliente também os valorize.",
    "Quando você agradece genuinamente pelas pequenas coisas que já possui, você muda sua frequência vibracional da falta para a abundância. A gratidão é o portal de entrada para novas conquistas.",
    "Tentar controlar cada detalhe da vida financeira pela ansiedade afasta a criatividade necessária para gerar novos recursos. Confie na sua capacidade de encontrar soluções e de criar caminhos inovadores.",
    "A prosperidade financeira sem generosidade perde a alma. Compartilhar o que temos, seja conhecimento, tempo ou recursos, expande a nossa própria capacidade de receber de volta do fluxo da vida.",
    "A escassez nos faz focar apenas no que falta, cegando-nos para as inúmeras riquezas e oportunidades que já estão ao nosso redor. Mude o foco da sua lente e veja a abundância que já te cerca.",
    "Sua capacidade de realização profissional está diretamente ligada ao respeito que você tem pelos seus próprios limites. Um corpo exausto e uma mente saturada não conseguem criar projetos prósperos.",
    "Romper com o ciclo de escassez da nossa ancestralidade exige coragem para fazer diferente do que nos foi ensinado, aceitando que prosperar não é trair nossas origens, mas honrar a vida que recebemos.",
    "O dinheiro é neutro; ele potencializa quem você já é. Se você for uma pessoa generosa e consciente, a riqueza aumentará seu poder de fazer o bem e de gerar transformação no mundo.",
    "O medo de brilhar muito e incomodar os outros com o seu sucesso pode estar limitando seus passos. Permita-se ocupar o seu espaço de direito no mundo e irradiar toda a sua luz.",
    "A abundância não é uma meta a ser atingida no futuro, mas um estado de presença que escolhemos cultivar no agora, reconhecendo a riqueza da nossa própria existência.",
    "Quando você investe no seu autoconhecimento e na sua saúde mental, você está sinalizando ao mundo que se valoriza. Esse é o investimento mais próspero e com maior retorno da vida.",
    "O trabalho duro sem alinhamento interno gera cansaço; o trabalho com propósito e direcionamento gera expansão. Busque a coerência entre o que você faz e o que a sua alma pede.",
    "A generosidade com o próprio corpo e mente é o primeiro passo da prosperidade. Nutrir-se bem, descansar e ter momentos de lazer limpa a mente para a entrada de ideias ricas.",
    "O que na sua história sobre dinheiro hoje parece um peso herdado? Pode ser a ideia de que 'dinheiro é difícil' ou de que 'quem tem muito não é feliz'. Devolva esses mitos e crie suas regras.",
    "Expandir seus limites profissionais exige dizer adeus à zona de conforto do anonimato. Coloque sua voz e seus projetos no mundo com a confiança de quem sabe o valor do próprio serviço.",
    "Prosperar de verdade é deitar a cabeça no travesseiro com a certeza de que sua integridade está intacta e de que suas relações são baseadas na cooperação e no afeto.",
    "O merecimento inato se manifesta na capacidade de dizer 'sim, eu aceito' quando o universo nos traz presentes, ajuda ou oportunidades, sem pressa de ter que retribuir imediatamente.",
    "A avareza de sentimentos ou de recursos fecha os canais de entrada da abundância. Abra as mãos, dê o que você quer receber e observe como a vida responde com generosidade.",
    "A criatividade é a moeda mais valiosa da nova era. Ela não se esgota; quanto mais você usa, mais ideias ricas e prósperas surgem no horizonte da sua mente.",
    "A verdadeira riqueza engloba a liberdade de tempo: poder escolher como usar as horas do seu dia para nutrir o que realmente importa para a sua felicidade e paz.",
    "Sua trajetória é única e não deve ser comparada com a velocidade de ninguém. Cada árvore tem sua própria época de floração e de colheita. Confie no seu ritmo."
  ],
  autocuidado: [
    "O autocuidado autêntico não é uma fuga das responsabilidades da vida, mas um retorno necessário para a nossa base. É o compromisso de não se abandonar no meio das tormentas externas.",
    "Muitas vezes, confundimos acolhimento com passividade. Acolher-se é aceitar nossas limitações com ternura, mas mantendo a firmeza de tomar as decisões necessárias para a nossa saúde mental.",
    "Os limites que impomos nas relações não servem para afastar as pessoas, mas para preservar a qualidade do vínculo. Sem limites claros, o cuidado com o outro se transforma em ressentimento.",
    "A autoestima saudável não se baseia em estarmos sempre seguros e perfeitos, mas na nossa disposição de acolher com compaixão a nossa própria humanidade, inclusive os dias de erro.",
    "Tratar-se com gentileza exige desaprender a linguagem da autocrítica feroz que internalizamos ao longo dos anos. Mude a voz interna para um tom de apoio e encorajamento.",
    "O descanso não é um prêmio a ser conquistado apenas após o esgotamento total; é uma necessidade biológica e emocional contínua. Pare antes que o seu corpo decida parar por você.",
    "O que aconteceria se você decidisse olhar para as suas feridas do passado com curiosidade em vez de julgamento? A cura começa quando permitimos que a dor seja sentida sem repressão.",
    "Amar a si mesmo é um processo diário construído em pequenos gestos: uma pausa para respirar, um copo de água tomado com calma, a decisão de não entrar em discussões desgastantes.",
    "Você não é responsável pelas expectativas e projeções dos outros. Aprender a diferenciar o que é seu do que pertence ao outro limpa a sua carga emocional e traz leveza.",
    "A autocompaixão é a chave para desarmar a busca incessante por perfeição que nos paralisa. Aceitar a imperfeição nos liberta para criar e viver de forma mais autêntica.",
    "O corpo acumula as tensões que a mente tenta ignorar. Escute os sinais de dor, cansaço ou aperto como mensagens de que a sua casa interna precisa de cuidado imediato.",
    "Resgatar a autoestima exige coragem para se olhar no espelho e reconhecer a beleza da própria história, honrando cada marca e aprendizado que te trouxe até o dia de hoje.",
    "Quando você aprende a nutrir a si mesmo com afeto, a dependência da aprovação externa começa a enfraquecer. A fonte da sua segurança passa a residir dentro do seu peito.",
    "O autocuidado profundo envolve despedir-se de ambientes, hábitos e dinâmicas relacionais que exigem a negação da sua verdade para que você possa ser aceito.",
    "A vida não é apenas sobre o que entregamos ao mundo, mas sobre como sustentamos nossa energia vital. Ninguém consegue transbordar a partir de um poço que está seco por dentro.",
    "Acolher a sua vulnerabilidade não é sinal de fraqueza, mas a maior demonstração de coragem. É aceitar que somos humanos e que precisamos de apoio e descanso.",
    "A autovalorização começa quando paramos de pedir desculpas por ocupar espaço, por ter necessidades e por expressar os nossos sentimentos de forma honesta.",
    "Cuidar de si mesmo é uma atitude revolucionária em uma sociedade que valoriza a exaustão como símbolo de status. Escolha a sua paz interior em vez do aplauso pelo esgotamento.",
    "Qual foi a última vez que você reservou um momento do dia exclusivamente para você, sem metas, sem tarefas e sem a obrigação de ser produtivo? Permita-se apenas existir.",
    "Seu valor próprio não flutua com as suas conquistas ou fracassos momentâneos. Você é digno de amor, respeito e cuidado pelo simples fato de fazer parte da teia da vida.",
    "A autoestima é cultivada na coerência entre os seus valores internos e as suas ações externas. Seja fiel à sua essência mesmo quando a pressão externa pedir para mudar.",
    "Aprender a receber cuidado é um exercício de vulnerabilidade que cura a ferida do isolamento. Permita que os outros te apoiem e sintam o prazer de contribuir com você.",
    "A autocrítica severa atua como uma barreira que impede a entrada da cura. Experimente acolher seus erros com a mesma ternura que um pai dedica ao filho que está aprendendo.",
    "O autocuidado diário é o que impede o acúmulo das pequenas tensões que, ao final do ano, se manifestam como crises físicas ou emocionais. Cuide das pequenas pausas.",
    "Você tem o direito de se reconstruir quantas vezes for necessário. A vida é um processo contínuo de renovação e cada amanhecer traz uma folha em branco para novas escolhas.",
    "O que na sua rotina hoje drena a sua energia e o que a reabastece? Fazer essa contabilidade emocional é essencial para manter o equilíbrio e a vitalidade interna.",
    "A verdadeira beleza nasce da paz de espírito e da harmonia com quem somos por inteiro. Quando a mente está em paz, o corpo irradia uma beleza que o tempo não apaga.",
    "O silêncio do recolhimento nos permite escutar as respostas que as redes sociais e o ruído externo tentam ocultar. Dedique tempo para ficar a sós com seus pensamentos.",
    "Seja paciente com os seus processos de mudança. A árvore não dá frutos no mesmo dia em que a semente é plantada. Confie na sabedoria invisível do crescimento.",
    "Acolher a própria história com gentileza é o maior ato de cura que você pode realizar por si mesmo. Suas cicatrizes são marcas de sobrevivência e de força."
  ]
};

const TRANSFORMACOES: string[] = [
  "sair da autocobrança exaustiva para abraçar a autocompaixão",
  "mover-se do medo paralisante em direção à presença consciente",
  "transformar a dúvida constante em clareza interna e foco",
  "transitar da exaustão mental para um acolhimento profundo do corpo",
  "libertar-se da necessidade de controle para fluir com o ritmo da vida",
  "deixar de lado a pressa imposta para habitar o momento com calma",
  "sair da sensação de escassez para se conectar com seu merecimento inato",
  "abandonar a autocrítica feroz para ser seu próprio aliado diário",
  "transformar o ruído da mente acelerada no silêncio que traz respostas",
  "sair do isolamento da dor para se abrir ao acolhimento e à cura",
  "liberar as expectativas alheias para andar no seu próprio ritmo",
  "transitar da fragmentação do estresse para a integridade da presença",
  "deixar de viver no futuro para habitar a segurança que o agora oferece",
  "transformar a ansiedade do amanhã na estabilidade do momento presente",
  "sair da exaustão de tentar agradar a todos para priorizar sua paz",
  "mover-se do bloqueio do merecimento para a atração da abundância",
  "transformar crenças limitantes herdadas em novas regras de prosperidade",
  "sair da pressa do mercado para honrar o ritmo natural do seu amadurecimento",
  "transitar do medo do julgamento alheio para a força da autoexpressão",
  "abandonar a necessidade de ser forte o tempo todo para aceitar o descanso",
  "transformar a dor da rejeição em autovalorização e acolhimento interno",
  "sair do esgotamento físico para restaurar a vitalidade e a criatividade",
  "transitar da preocupação constante para o foco no que é realizável",
  "libertar-se das culpas do passado para focar nas escolhas do presente",
  "transformar a ansiedade social na segurança de ocupar seu espaço no mundo",
  "deixar de lado a comparação com os outros para focar na sua própria jornada",
  "sair do piloto automático da rotina para viver com intenção e presença",
  "transformar a resistência emocional em aceitação suave e fluidez",
  "transitar da negação de si mesmo para a aceitação plena da sua história",
  "liberar as tensões acumuladas para respirar com leveza e alívio"
];

const CTAs: string[] = [
  "Agende sua sessão terapêutica e dê o próximo passo da sua jornada.",
  "Permita-se olhar para dentro com mais gentileza. Agende seu atendimento.",
  "Reserve um espaço na sua agenda exclusivamente para cuidar de você. Agende uma sessão.",
  "Vamos caminhar juntos nesse processo? Agende seu atendimento hoje.",
  "Dê a si mesmo a oportunidade de aprofundar esse movimento. Reserve sua consulta.",
  "Seu processo de cura merece acompanhamento. Agende seu horário.",
  "Permita-se desacelerar e olhar para a sua história. Marque sua sessão.",
  "O primeiro passo para o acolhimento começa agora. Agende uma consulta.",
  "Vamos desbloquear o que impede seu fluxo? Agende seu atendimento.",
  "Sua saúde mental é sua maior prioridade. Reserve um espaço para você.",
  "Quer aprofundar essas reflexões na terapia? Agende seu horário.",
  "Sua jornada de autoconhecimento merece um espaço seguro. Agende sua sessão.",
  "Vamos criar novas possibilidades para o seu bem-estar? Agende um atendimento.",
  "Permita-se receber o cuidado que você tanto oferece aos outros. Marque sua sessão.",
  "Dê a si mesmo a pausa necessária para reorganizar a rota. Agende seu horário.",
  "Vamos acolher as suas vulnerabilidades juntos? Reserve seu atendimento.",
  "O caminho para a prosperidade interna começa aqui. Agende sua consulta.",
  "Sua mente merece esse espaço de calma e acolhimento. Agende uma sessão.",
  "Vamos transformar a autocobrança em autocompaixão? Agende sua terapia.",
  "Permita-se o alívio de ser escutado e acolhido. Marque seu atendimento."
];

const HASHTAGS: Record<ThemeCategory, string[][]> = {
  ansiedade: [
    ["#saudemental", "#ansiedade", "#presenca", "#calma", "#autocuidado"],
    ["#desacelerar", "#saudeemocional", "#vivernoagora", "#respire", "#pazinterior"],
    ["#equilibrio", "#mentecalma", "#terapia online", "#saudementalimporta", "#autoconhecimento"]
  ],
  prosperidade: [
    ["#prosperidade", "#merecimento", "#abundancia", "#mentalidade", "#sucesso"],
    ["#carreira", "#fluxodeabundancia", "#valorproprio", "#desenvolvimentopessoal", "#gratidao"],
    ["#realizacao", "#sucessoprofissional", "#crencaslimitantes", "#crescimento", "#prosperar"]
  ],
  autocuidado: [
    ["#autocuidado", "#amorproprio", "#autoestima", "#saudemental", "#acolhimento"],
    ["#autocompaixao", "#gentileza", "#limites", "#equilibrioemocional", "#bemestar"],
    ["#conexaointerna", "#saudeemocional", "#terapia", "#cuidedevoce", "#jornada"]
  ]
};

const CONJUNCOES_GANCHO_REFLEXAO = [
  "\n\nDiante do fluxo diário das coisas, percebemos que ",
  "\n\nOlhar para esse movimento nos convida a entender que ",
  "\n\nEssa dinâmica se torna ainda mais evidente quando notamos que ",
  "\n\nNo consultório, percebo diariamente que ",
  "\n\nÉ comum nos perdermos nas demandas externas, mas a verdade é que ",
  "\n\nQuando paramos um instante para observar nossos processos, notamos que "
];

const CONJUNCOES_REFLEXAO_METAFORA = [
  " Funciona como ",
  " O processo se assemelha a ",
  " É exatamente como ",
  " Podemos enxergar esse movimento através da imagem de ",
  " Essa transformação se manifesta como ",
  " Pense nisso como "
];

const CONJUNCOES_METAFORA_TRANSFORMACAO = [
  ", permitindo-nos ",
  ", criando o espaço necessário para ",
  ", o que nos dá a coragem de ",
  ", abrindo caminhos para ",
  ", nos convidando a ",
  ", que é a chave para "
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Calcula score de compatibilidade simples de palavras-chave
function calculateKeywordScore(text: string, keywords: string[]): number {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) {
      score += 2;
    }
  }
  return score;
}

export function buildSmartCopySuggestion(context: SmartCopyContext): SmartCopyResult {
  const category = getThemeCategory(context.theme);
  const isFeed = context.contentType.toLowerCase() === 'feed';
  
  // 1. Seleciona Metáfora central usando Score de Compatibilidade + Ruído
  const searchCorpus = `${context.theme} ${context.additionalNotes || ''} ${context.collectiveEnergy || ''} ${context.therapeuticIntention || ''}`;
  const scoredMetaphors = METAFORAS[category].map(m => {
    // Score base baseado em palavras-chave
    const keywordScore = calculateKeywordScore(searchCorpus, m.keywords);
    // Adiciona ruído aleatório pequeno para garantir variedade de escolha entre as compatíveis
    const randomNoise = Math.random() * 1.5;
    return { metaphor: m, score: keywordScore + randomNoise };
  });
  
  // Ordena decrescente
  scoredMetaphors.sort((a, b) => b.score - a.score);
  // Pega uma das 6 melhores metáforas pontuadas de forma aleatória para garantir diversidade
  const topMetaphors = scoredMetaphors.slice(0, Math.min(6, scoredMetaphors.length));
  const chosenMetaphor = topMetaphors[Math.floor(Math.random() * topMetaphors.length)].metaphor;

  // 2. Seleciona Gancho, Reflexão, Transformação e CTA
  // Para ganchos e reflexões, aplicamos o mesmo princípio de pegar os top N compatíveis ou simplesmente misturar para máxima variedade
  const ganchosScored = GANCHOS[category].map(g => {
    const keywordScore = calculateKeywordScore(g, chosenMetaphor.keywords) + calculateKeywordScore(g, [context.theme]);
    return { item: g, score: keywordScore + Math.random() * 2 };
  }).sort((a, b) => b.score - a.score);
  const chosenGancho = ganchosScored[0].item;

  const reflexoesScored = REFLEXOES[category].map(r => {
    const keywordScore = calculateKeywordScore(r, chosenMetaphor.keywords) + calculateKeywordScore(r, [context.theme]);
    return { item: r, score: keywordScore + Math.random() * 2 };
  }).sort((a, b) => b.score - a.score);
  const chosenReflexao = reflexoesScored[0].item;

  // Filtra transformações que combinem com o tema
  const transformacoesScored = TRANSFORMACOES.map(t => {
    const keywordScore = calculateKeywordScore(t, chosenMetaphor.keywords) + calculateKeywordScore(t, [context.theme]);
    return { item: t, score: keywordScore + Math.random() * 2 };
  }).sort((a, b) => b.score - a.score);
  const chosenTransformacao = transformacoesScored[0].item;

  // Seleciona CTA
  const ctasScored = CTAs.map(c => {
    const keywordScore = calculateKeywordScore(c, [context.theme]);
    return { item: c, score: keywordScore + Math.random() * 2 };
  }).sort((a, b) => b.score - a.score);
  const chosenCTA = ctasScored[0].item;

  // Escolhe Hashtags
  const hashtagGroups = HASHTAGS[category];
  const chosenHashtags = hashtagGroups[Math.floor(Math.random() * hashtagGroups.length)].join(" ");

  // 3. Título selecionado da biblioteca curada usando score de compatibilidade
  const scoredTitles = TITULOS[category].map(t => {
    const keywordScore = calculateKeywordScore(searchCorpus, t.keywords);
    const randomNoise = Math.random() * 2;
    return { title: t, score: keywordScore + randomNoise };
  }).sort((a, b) => b.score - a.score);
  
  const topTitles = scoredTitles.slice(0, Math.min(6, scoredTitles.length));
  const chosenTitle = topTitles[Math.floor(Math.random() * topTitles.length)].title;
  const copyTitle = chosenTitle.text;

  // 4. Conjunções de transição dinâmicas
  const conjGanchoRefl = CONJUNCOES_GANCHO_REFLEXAO[Math.floor(Math.random() * CONJUNCOES_GANCHO_REFLEXAO.length)];
  const conjReflMetaf = CONJUNCOES_REFLEXAO_METAFORA[Math.floor(Math.random() * CONJUNCOES_REFLEXAO_METAFORA.length)];
  const conjMetafTransf = CONJUNCOES_METAFORA_TRANSFORMACAO[Math.floor(Math.random() * CONJUNCOES_METAFORA_TRANSFORMACAO.length)];

  let copyCaption = '';

  if (isFeed) {
    // ESTRUTURA FEED: Gancho -> Reflexão -> Metáfora -> Transformação -> CTA -> Hashtags
    // Comprimento esperado: 120 a 250 palavras
    const introTemplates = [
      `Como terapeuta, convido você a olhar com carinho para esta dinâmica de ${context.theme.toLowerCase()} hoje. `,
      `No caminho do autoconhecimento, olhar para ${context.theme.toLowerCase()} é um convite de coragem e acolhimento. `,
      `Se você tem sentido os desafios de lidar com ${context.theme.toLowerCase()}, saiba que você não está sozinho nessa busca. `,
      `Refletir sobre ${context.theme.toLowerCase()} é, antes de tudo, aprender a ouvir os sinais sutis que o nosso corpo envia. `
    ];
    const introText = introTemplates[Math.floor(Math.random() * introTemplates.length)];

    const conclusionTemplates = [
      ` Lembre-se de que a cura é um processo gradual e contínuo, construído passo a passo com paciência.`,
      ` Acolher o que sentimos é o início do alívio e da verdadeira transformação que tanto buscamos.`,
      ` Cada pequena pausa que fazemos hoje é uma semente de paz que plantamos para o nosso amanhã.`,
      ` A cura não é linear; respeitar o próprio ritmo é o gesto mais generoso de autocuidado.`
    ];
    const conclusionText = conclusionTemplates[Math.floor(Math.random() * conclusionTemplates.length)];

    const bodyText = `${introText}${chosenGancho}${conjGanchoRefl}${chosenReflexao}${conjReflMetaf}${chosenMetaphor.text}${conjMetafTransf}${chosenTransformacao}.${conclusionText}`;
    
    // Adiciona notas de intenção do terapeuta de forma integrada e fluida
    let notesText = '';
    if (context.additionalNotes) {
      const notesTemplates = [
        `\n\nNesta semana, ao integrar a intenção de "${context.additionalNotes}", percebemos a importância de acolher esse movimento.`,
        `\n\nTrazer à tona a intenção de "${context.additionalNotes}" nos ajuda a direcionar a atenção ao que realmente importa.`,
        `\n\nConsiderando o foco que você busca em "${context.additionalNotes}", este processo se torna um convite prático de transformação.`,
        `\n\nAo respirar esta reflexão e focar em "${context.additionalNotes}", criamos uma âncora real para o cotidiano.`
      ];
      notesText = notesTemplates[Math.floor(Math.random() * notesTemplates.length)];
    }

    copyCaption = `${bodyText}${notesText}\n\n${chosenCTA}\n\n${chosenHashtags}`;
  } else {
    // ESTRUTURA STORY: Frase Forte -> Reflexão curta -> CTA
    // Comprimento esperado: 30 a 80 palavras
    // Pega a primeira frase ou uma versão curta da reflexão
    const shortReflexao = chosenReflexao.split(".")[0] + ".";
    
    let notesText = '';
    if (context.additionalNotes) {
      notesText = ` Focando em: ${context.additionalNotes.toLowerCase()}.`;
    }
    
    copyCaption = `✨ ${chosenGancho}\n\n${shortReflexao}${notesText}\n\n👉 ${chosenCTA}`;
  }

  // Sanitização de comprimentos
  // Se feed passar de 250 palavras, encurtamos levemente. Se story passar de 80, limitamos.
  const wordCount = copyCaption.split(/\s+/).length;
  if (!isFeed && wordCount > 80) {
    // Encurta Story removendo parte do texto se necessário
    const sentences = copyCaption.split("\n\n");
    if (sentences.length > 2) {
      copyCaption = `${sentences[0]}\n\n${sentences[sentences.length - 1]}`;
    }
  }

  return {
    copyTitle,
    copyCaption
  };
}
