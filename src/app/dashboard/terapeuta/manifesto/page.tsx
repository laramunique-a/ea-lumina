'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, CheckCircle2, Shield, Heart, Award, ArrowRight, Lock, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const MANIFESTO_PILLARS = [
  {
    number: '01',
    title: 'A União da Rede Lumina',
    desc: 'Somos um coletivo de terapeutas comprometidos com a evolução humana. Trabalhamos em rede, valorizando a colaboração, o respeito mútuo e a constante troca de saberes.'
  },
  {
    number: '02',
    title: 'A Jornada Pessoal do Terapeuta',
    desc: 'Reconhecemos que nossa capacidade de cuidar dos outros depende diretamente do nosso próprio desenvolvimento pessoal, cuidado contínuo e autocuidado diário.'
  },
  {
    number: '03',
    title: 'Presença Consciente',
    desc: 'Em cada atendimento, entregamos presença plena, escuta empática e acolhimento livre de julgamentos, criando um espaço sagrado e seguro para o paciente.'
  },
  {
    number: '04',
    title: 'Coerência entre Prática e Comunicação',
    desc: 'Comunicamos nossas práticas com clareza, transparência e verdade. Não prometemos curas milagrosas nem utilizamos gatilhos de escassez ou manipulação.'
  },
  {
    number: '05',
    title: 'Responsabilidade Coletiva',
    desc: 'Honramos a reputação da Rede Lumina e da classe de terapeutas integrativos, agindo sempre com altíssimo padrão ético e responsabilidade social.'
  },
  {
    number: '06',
    title: 'Profissionalismo e Pontualidade',
    desc: 'Tratamos nossa prática como profissão sagrada. Mantemos compromisso rigoroso com horários, organização de prontuários e excelência na gestão.'
  },
  {
    number: '07',
    title: 'Autonomia do Paciente',
    desc: 'Incentivamos o paciente a ser o protagonista do seu próprio processo de cura e transformação, sem gerar dependências terapêuticas.'
  },
  {
    number: '08',
    title: 'Privacidade e Confidencialidade',
    desc: 'Guardamos sigilo absoluto sobre todas as informações relativas aos pacientes, atendimentos, prontuários e conteúdos compartilhados.'
  },
  {
    number: '09',
    title: 'Limites Éticos e Complementaridade',
    desc: 'Respeitamos as medicinas tradicionais e a ciência. Nossas práticas são complementares e nunca orientamos a interrupção de tratamentos médicos ou psiquiátricos.'
  },
  {
    number: '10',
    title: 'Compromisso com a Rede',
    desc: 'Ao integrar a Rede Lumina, assumimos o compromisso vivo de seguir estes princípios, mantendo nossa prática alinhada à luz, ética e verdade.'
  }
]

export default function TherapistManifestoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [alreadyAccepted, setAlreadyAccepted] = useState(false)
  const [acceptedAt, setAcceptedAt] = useState<string | null>(null)
  const [version, setVersion] = useState<string>('1.0')
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    fetch('/api/therapist/manifesto')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.consent) {
          if (data.consent.manifestoAccepted) {
            setAlreadyAccepted(true)
            setAcceptedAt(data.consent.manifestoAcceptedAt)
            setVersion(data.consent.manifestoVersion || '1.0')
            setChecked(true)
          }
        }
      })
      .catch(err => console.error('Erro ao carregar manifesto:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleAccept = async () => {
    if (!checked) {
      toast.error('Você precisa marcar a caixa de confirmação para aceitar o manifesto.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/therapist/manifesto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted: true, version: '1.0' })
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Manifesto da Rede Lumina aceito com sucesso!')
        setAlreadyAccepted(true)
        setAcceptedAt(data.acceptedAt)
        setTimeout(() => {
          router.push('/dashboard/terapeuta')
        }, 1500)
      } else {
        toast.error(data.error || 'Erro ao processar o aceite.')
      }
    } catch (error) {
      toast.error('Erro de conexão ao salvar aceite.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#C5A03F]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A03F]/10 border border-[#C5A03F]/30 px-4 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-[#C5A03F]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#C5A03F]">Compromisso Ético e Profissional</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Manifesto da Rede Lumina
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Os 10 pilares fundamentais que regem a conduta, a ética e a presença de todos os terapeutas da nossa rede.
          </p>

          {alreadyAccepted && (
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-2xl text-xs font-bold mt-2">
              <CheckCircle2 className="w-4 h-4" />
              Manifesto aceito em {acceptedAt ? new Date(acceptedAt).toLocaleDateString('pt-BR') : ''} (Versão {version})
            </div>
          )}
        </div>

        {/* OS 10 PILARES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MANIFESTO_PILLARS.map((pilar) => (
            <div
              key={pilar.number}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-[#C5A03F]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-[#C5A03F] bg-[#C5A03F]/10 px-3 py-1 rounded-xl">
                    Pilar {pilar.number}
                  </span>
                  <BookOpen className="w-4 h-4 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">{pilar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{pilar.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ACEITE OBRIGATÓRIO */}
        <div className="bg-slate-900 border border-[#C5A03F]/30 rounded-3xl p-8 space-y-6">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-[#C5A03F] shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Declaração de Aceite Auditável (Versão 1.0)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ao clicar em aceitar, você confirma ter lido, compreendido e concordado integralmente com os 10 pilares do Manifesto da Rede Lumina. Este aceite é registrado com data, hora e versão para fins de auditoria e habilitação do seu perfil.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checked}
                disabled={alreadyAccepted || submitting}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-800 text-[#C5A03F] focus:ring-[#C5A03F] focus:ring-offset-slate-900"
              />
              <span className="text-xs text-slate-300 group-hover:text-white transition-colors leading-relaxed">
                Declaro que li e aceito integralmente os 10 pilares do Manifesto da Rede Lumina e me comprometo a manter minha prática terapêutica alinhada a estes princípios.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push('/dashboard/terapeuta')}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors px-4 py-2"
              >
                Voltar ao Painel
              </button>

              {!alreadyAccepted ? (
                <button
                  type="button"
                  disabled={!checked || submitting}
                  onClick={handleAccept}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C5A03F] hover:bg-[#ab8a36] disabled:opacity-50 text-[#020617] font-black text-sm uppercase tracking-wider px-8 py-4 rounded-2xl transition-all duration-200"
                >
                  {submitting ? 'Gravando aceite...' : 'Confirmar e Aceitar Manifesto'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                  ✓ Aceite registrado com sucesso
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
