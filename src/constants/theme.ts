/**
 * EALUMINI - Design System / Style Tokens
 * Centraliza as classes do Tailwind CSS para manter a consistência visual em todo o app.
 */

export const LANDING_THEME = {
  // Configurações de layout das seções da Landing Page
  section: {
    // Wrapper principal de cada seção (fundo gradiente escuro com snap)
    wrapper: "min-w-full h-full snap-center bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f172a_50%,_#020617_100%)] relative flex items-center justify-center p-4 md:p-6 overflow-hidden",
    
    // Contêiner centralizado de coluna (usado em Cursos, Terapeutas)
    containerCenter: "max-w-5xl mx-auto px-4 md:px-12 w-full flex flex-col justify-center items-center text-center relative",
    
    // Contêiner grid de duas colunas (usado em Empresas)
    containerGrid: "max-w-6xl mx-auto px-4 md:px-12 w-full grid md:grid-cols-2 gap-8 md:gap-16 items-center justify-center relative",
  },

  // Tags/Badges de categoria no topo de cada seção (ex: "Para Pacientes", "Para Empresas")
  tag: {
    blue: "text-[10px] md:text-xs font-black text-[#0090FF] uppercase tracking-[0.3em] mb-2 md:mb-3",
    gold: "text-[10px] md:text-xs font-black text-[#C5A03F] uppercase tracking-[0.3em] mb-2 md:mb-3",
  },

  // Tipografia padrão
  typography: {
    // Título principal com o gradiente dourado/azul padrão do projeto
    titleGradient: "text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 md:mb-6 leading-tight bg-clip-text text-transparent",
    
    // O estilo CSS inline necessário para o gradiente de texto
    titleGradientStyle: {
      backgroundImage: 'linear-gradient(90deg, rgba(196, 135, 35, 1) 11%, rgba(37, 102, 148, 1) 74%, rgba(29, 13, 255, 1) 100%, rgba(47, 18, 179, 1) 100%, rgba(34, 83, 135, 1) 100%)'
    },
    
    // Descrições padrão da Landing Page
    paragraph: "text-slate-300 text-xs md:text-base lg:text-lg leading-relaxed",
  },

  // Botões padronizados
  button: {
    // Botão dourado com sombra brilhante/neon
    gold: "bg-[#C5A03F] text-black px-8 py-3.5 md:px-10 md:py-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#d6af4b] transition-transform hover:scale-105 shadow-[0_0_20px_rgba(197,160,63,0.3)]",
    
    // Botão secundário translúcido (ex: "Criar conta")
    ghost: "bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 backdrop-blur-md"
  }
}
