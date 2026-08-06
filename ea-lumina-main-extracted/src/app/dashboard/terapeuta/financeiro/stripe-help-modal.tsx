'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { 
  HelpCircle, 
  CheckCircle2, 
  Smartphone, 
  UserCheck, 
  CreditCard, 
  Building, 
  AlertTriangle 
} from 'lucide-react'

export default function StripeHelpModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full px-6 py-3 text-sm font-semibold transition-all"
      >
        <HelpCircle className="mr-2 h-4 w-4 text-[#0090FF]" />
        Como funciona o cadastro?
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Guia de Configuração - Stripe Connect" 
        size="lg"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 text-slate-600 text-sm leading-relaxed">
          {/* Introdução */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-[#0090FF] flex items-center gap-1.5 text-sm">
              <CheckCircle2 size={16} />
              O que é a Stripe?
            </h4>
            <p className="text-xs text-slate-600">
              A Stripe é uma das maiores processadoras de pagamentos do mundo. Ela gerencia o fluxo de repasses da <strong>EA Lumina</strong>, garantindo que o dinheiro das suas sessões caia direto no seu banco com total conformidade e segurança fiscal.
            </p>
          </div>

          {/* O que precisa ter em mãos */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-800 text-sm">📋 O que você precisa ter em mãos:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Smartphone className="text-[#0090FF] shrink-0" size={16} />
                <span>Celular ativo para receber SMS</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <UserCheck className="text-[#0090FF] shrink-0" size={16} />
                <span>CPF, Data de Nascimento e Endereço</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Building className="text-[#0090FF] shrink-0" size={16} />
                <span>CNPJ e Razão Social (caso receba como PJ)</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <CreditCard className="text-[#0090FF] shrink-0" size={16} />
                <span>Dados da sua Conta Bancária pessoal ou jurídica</span>
              </li>
            </ul>
          </div>

          {/* Passo a passo */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm">🚀 Passo a Passo no Painel Stripe:</h4>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="w-5 h-5 bg-blue-100 text-[#0090FF] rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <div>
                  <h5 className="font-bold text-slate-800 text-xs">Verificação de Segurança</h5>
                  <p className="text-xs text-slate-500">Insira seu número de celular com o DDD e digite o código de 6 dígitos que receber por SMS.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 bg-blue-100 text-[#0090FF] rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <div>
                  <h5 className="font-bold text-slate-800 text-xs">Tipo de Conta (Pessoa Física ou Jurídica)</h5>
                  <p className="text-xs text-slate-500">Selecione "Autônomo/Pessoa Física" para usar seu CPF, ou "Sociedade/MEI/PJ" para usar o CNPJ de sua clínica.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 bg-blue-100 text-[#0090FF] rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                <div>
                  <h5 className="font-bold text-slate-800 text-xs">Dados Pessoais e Setor</h5>
                  <p className="text-xs text-slate-500">Preencha seus dados exatamente como constam na Receita Federal. No campo de site, pode informar a URL do seu perfil profissional ou da EA Lumina.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 bg-blue-100 text-[#0090FF] rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                <div>
                  <h5 className="font-bold text-slate-800 text-xs">Vincular Conta Bancária</h5>
                  <p className="text-xs text-slate-500">Insira os dados da conta corrente onde você deseja receber seus repasses automáticos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Avisos */}
          <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl flex gap-3 text-amber-900">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <p className="font-bold text-xs">Regra Crucial sobre a Titularidade da Conta Bancária</p>
              <p className="text-[11px] leading-relaxed text-amber-800">
                A conta bancária informada deve obrigatoriamente ter o **mesmo titular** (CPF ou CNPJ) cadastrado na Stripe. A Stripe rejeitará e bloqueará transferências para contas de terceiros (como parentes ou cônjuges) por questões de prevenção à fraude.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button onClick={() => setIsOpen(false)} size="sm" className="bg-[#0090FF] hover:bg-blue-600">
              Entendi, Fechar Guia
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
