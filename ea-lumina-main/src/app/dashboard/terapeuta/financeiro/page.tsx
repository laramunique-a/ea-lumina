import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { prisma } from '@/lib/prisma'
import StripeConnectButton from './stripe-connect-button'
import StripeDashboardButton from './stripe-dashboard-button'
import StripeHelpModal from './stripe-help-modal'
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { 
  Clock, 
  CreditCard, 
  Landmark, 
  HelpCircle, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Globe
} from 'lucide-react'

async function getUserServer() {
  const cookieStore = cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) return null
  try {
    const defaultSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    const { payload } = await jose.jwtVerify(token, defaultSecret)
    return payload as { sub: string, role: string }
  } catch (e) {
    return null
  }
}

export default async function FinanceiroPage() {
  const session = await getUserServer()
  if (!session || session.role !== 'TERAPEUTA') {
    return redirect('/login')
  }

  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId: session.sub },
    include: { paymentDetails: true },
  })

  const stripeAccountId = therapist?.paymentDetails?.stripeAccountId
  const stripeAccountType = (therapist?.paymentDetails?.stripeAccountType ?? 'express') as 'express' | 'standard'

  // Calcular ganhos do mês (meramente ilustrativo para o painel)
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  const [totalAppointments, thisMonthRevenueAggregation] = await Promise.all([
    prisma.appointment.count({
      where: { 
        therapistId: therapist?.id, 
        status: 'CONCLUIDO',
      }
    }),
    prisma.appointment.aggregate({
      _sum: {
        therapistNet: true,
      },
      where: {
        therapistId: therapist?.id,
        status: 'CONCLUIDO',
        date: { gte: firstDayOfMonth },
      }
    })
  ])

  const thisMonthEarnings = Number(thisMonthRevenueAggregation._sum.therapistNet || 0)

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-8 pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <span>💼</span> Painel Financeiro
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Gerencie seus recebimentos, consulte seus prazos de repasse e configure sua conta bancária de forma segura.
        </p>
      </div>

      {!stripeAccountId ? (
        <div className="space-y-8">
          {/* Card Principal de Conexão Pendente */}
          <div className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-slate-100 flex flex-col lg:flex-row items-stretch justify-between gap-8">
            <div className="space-y-6 max-w-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0090FF] bg-blue-100/50 px-3 py-1 rounded-full w-max">
                  Configuração Obrigatória
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  Ative sua Conta de Recebimentos Seguros
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Para começar a oferecer consultas pagas e pacotes de terapia, você precisa configurar sua carteira financeira. 
                  Utilizamos a <strong>Stripe Connect Express</strong>, garantindo que o dinheiro caia direto no seu banco com total segurança.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <StripeConnectButton />
                <StripeHelpModal />
              </div>
            </div>

            <div className="hidden lg:flex flex-col justify-center items-center bg-white rounded-3xl p-6 border border-slate-100 shadow-sm max-w-xs w-full text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0090FF]">
                <ShieldCheck size={32} />
              </div>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-widest leading-none">Parceria Stripe Connect</p>
              <p className="text-[11px] font-medium text-slate-500 leading-normal">
                Seus dados bancários e fiscais são processados e armazenados com criptografia militar direto na infraestrutura do Stripe.
              </p>
            </div>
          </div>

          {/* Guia Informativo e Explicativo para Novos Terapeutas */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div>
              <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <HelpCircle className="text-[#0090FF]" size={20} />
                Como funcionam seus ganhos e repasses?
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-1">Esclareça todas as dúvidas antes de conectar sua conta</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Meios de Pagamento */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 bg-blue-100/50 text-[#0090FF] rounded-xl flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <h5 className="font-bold text-sm text-slate-900">Meios de Pagamento Disponíveis</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Seus pacientes poderão pagar suas consultas de forma simplificada por <strong>Cartão de Crédito</strong> (em até 12x) ou carteiras digitais como <strong>Apple Pay</strong> e <strong>Google Pay</strong>.
                </p>
              </div>

              {/* Prazos de Compensação */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 bg-teal-100/50 text-teal-600 rounded-xl flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <h5 className="font-bold text-sm text-slate-900">Prazos para Liberação do Dinheiro</h5>
                <ul className="text-xs text-slate-500 font-medium space-y-1.5 leading-normal">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0" />
                    <strong>Cartão de Crédito:</strong> cai em 30 dias corridos.
                  </li>
                </ul>
              </div>

              {/* Antecipação e Taxas */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 bg-amber-100/50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <h5 className="font-bold text-sm text-slate-900">Opção de Antecipação de Saldo</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Precisa do dinheiro antes? Você pode habilitar a **Antecipação Imediata** de cartões direto no seu painel Stripe Express (sujeito a taxas adicionais do Stripe Connect).
                </p>
              </div>

              {/* Contas Internacionais */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 bg-purple-100/50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <h5 className="font-bold text-sm text-slate-900">Contas Bancárias Internacionais</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Se você mora fora do Brasil (ex: Portugal ou Uruguai), a plataforma criará a conta Connect no país correto para que você informe sua conta bancária local (em Euros ou Dólares) de forma nativa.
                </p>
              </div>

              {/* Transferência ao Banco */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 bg-emerald-100/50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Landmark size={20} />
                </div>
                <h5 className="font-bold text-sm text-slate-900">Saque Automático (Payouts)</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Não é necessário solicitar saque manual! Todo dinheiro liberado é transferido automaticamente pela Stripe para sua conta corrente de acordo com a frequência configurada (diária, semanal ou mensal).
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Status Ativo e Visão Geral dos Ganhos */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Receita Líquida */}
            <Card padding="none" className="p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm flex flex-col justify-between min-h-[160px]">
              <CardHeader className="flex flex-row items-center justify-between pb-0 mb-0">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Ganhos Líquidos (Este Mês)
                </CardTitle>
                <div className="w-8 h-8 bg-blue-50 text-[#0090FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={16} />
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="text-3xl font-black text-slate-950">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(thisMonthEarnings)}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-wider">
                  Reflete consultas já concluídas
                </p>
              </CardContent>
            </Card>

            {/* Prazos de Recebimento */}
            <Card padding="none" className="p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm flex flex-col justify-between min-h-[160px]">
              <CardHeader className="flex flex-row items-center justify-between pb-0 mb-0">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Prazos de Compensação
                </CardTitle>
                <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={16} />
                </div>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col justify-center flex-grow">
                <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                  <span>Cartão de Crédito</span>
                  <span className="font-extrabold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md">30 dias corridos</span>
                </div>
              </CardContent>
            </Card>

            {/* Antecipação e Taxas adicionais */}
            <Card padding="none" className="p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm flex flex-col justify-between min-h-[160px]">
              <CardHeader className="flex flex-row items-center justify-between pb-0 mb-0">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Antecipação e Taxas
                </CardTitle>
                <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap size={16} />
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="text-xs text-slate-500 font-medium leading-relaxed">
                  Você pode antecipar seus recebíveis de cartão diretamente no seu painel Stripe Express (sujeito às taxas adicionais da adquirente).
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gerenciamento do Painel Stripe Express */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-80 h-80 bg-[#C5A03F]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Conexão Ativa
                  </span>
                  <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                    ID: {stripeAccountId}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Gerencie sua Carteira pelo Painel Stripe Express
                </h3>
                <p className="text-slate-300 text-sm font-medium leading-relaxed">
                  Para visualizar seu extrato detalhado de consultas pagas, configurar antecipações de saldo, gerenciar a frequência de saques ou atualizar sua conta bancária de repasse, acesse a central financeira da Stripe clicando abaixo.
                </p>
              </div>

              <div className="flex-shrink-0 w-full lg:w-auto">
                <StripeDashboardButton stripeAccountId={stripeAccountId} accountType={stripeAccountType} />
              </div>
            </div>
          </div>

          {/* Seção Informativa de Suporte e Instruções */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-4">
              <h4 className="font-extrabold text-slate-800 flex items-center gap-2 text-base">
                <HelpCircle className="text-[#0090FF]" size={18} />
                Central de Ajuda Financeira
              </h4>
              <StripeHelpModal />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h5 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#0090FF] rounded-full" />
                  Como funcionam as taxas de comissão?
                </h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  A plataforma EA Lumina retém apenas a taxa de comissão administrativa acordada por agendamento concluído. O restante do valor cai direto no seu saldo Stripe limpo de qualquer taxa de transação.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#0090FF] rounded-full" />
                  O que acontece se um paciente cancelar a consulta?
                </h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Caso o cancelamento ocorra dentro do prazo estipulado nas políticas da plataforma, o reembolso será processado de forma automática e a Stripe deduzirá o valor de volta da sua carteira ou saldo disponível.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#0090FF] rounded-full" />
                  Como eu mudo meus dados bancários de saque?
                </h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Para sua segurança, os dados bancários não podem ser modificados diretamente na EA Lumina. Acesse o Painel Stripe Express acima e vá na aba **Configurações de Repasse** para atualizar seu banco com segurança.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#0090FF] rounded-full" />
                  Preciso fazer declaração fiscal desses valores?
                </h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Sim, o terapeuta é responsável pela emissão de notas fiscais ou recibos para os pacientes das sessões realizadas. O Stripe disponibiliza um relatório anual de rendimentos na aba fiscal para auxiliar sua contabilidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
