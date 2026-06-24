export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

const DEFAULT_AUTOMATIONS = [
  {
    trigger: 'WELCOME_THERAPIST',
    subject: 'Seja muito bem-vindo(a) ao EA Lumina, {{nome}}!',
    content: `<div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #4f46e5; font-size: 26px; margin: 0; font-weight: 700;">Olá, {{nome}}!</h1>
  </div>
  <p style="color: #374151; font-size: 16px; line-height: 1.6;">Seja bem-vindo(a) ao <strong>EA Lumina</strong> como terapeuta!</p>
  <p style="color: #374151; font-size: 16px; line-height: 1.6;">Seu cadastro foi recebido com sucesso. Nossa equipe administrativa analisará sua documentação e perfil profissional nas próximas horas para ativação.</p>
  <p style="color: #374151; font-size: 16px; line-height: 1.6;">Assim que seu perfil for aprovado, você receberá uma notificação e seu consultório virtual estará visível para milhares de pacientes agendarem consultas.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://ealumina.com/dashboard/terapeuta" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block;">
      Acessar Painel do Terapeuta
    </a>
  </div>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
  <p style="color: #9ca3af; font-size: 12px; text-align: center;">Equipe EA Lumina &copy; 2026</p>
</div>`
  },
  {
    trigger: 'WELCOME_PATIENT',
    subject: 'Bem-vindo(a) ao EA Lumina, {{nome}}!',
    content: `<div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #0090ff; font-size: 26px; margin: 0; font-weight: 700;">Olá, {{nome}}!</h1>
  </div>
  <p style="color: #374151; font-size: 16px; line-height: 1.6;">É um grande prazer receber você no <strong>EA Lumina</strong>!</p>
  <p style="color: #374151; font-size: 16px; line-height: 1.6;">Nossa plataforma conecta você aos melhores terapeutas holísticos do país. Agora você pode pesquisar profissionais, filtrar por terapias (como Reiki, Yoga, Constelação Familiar) e agendar suas sessões de forma 100% online.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://ealumina.com/dashboard/paciente/buscar" style="background-color: #0090ff; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block;">
      Buscar Terapeutas
    </a>
  </div>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
  <p style="color: #9ca3af; font-size: 12px; text-align: center;">Equipe EA Lumina &copy; 2026</p>
</div>`
  },
  {
    trigger: 'INCOMPLETE_PROFILE',
    subject: 'Complete seu perfil no EA Lumina e aumente sua visibilidade!',
    content: `<div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #e11d48; font-size: 26px; margin: 0; font-weight: 700;">Olá, {{nome}}!</h1>
  </div>
  <p style="color: #374151; font-size: 16px; line-height: 1.6;">Percebemos que você ainda não completou todas as informações do seu perfil no <strong>EA Lumina</strong>.</p>
  <p style="color: #374151; font-size: 16px; line-height: 1.6;">Ter um perfil completo e detalhado é fundamental para transmitir credibilidade, ajudar os usuários a conhecerem seu trabalho e aumentar suas chances de agendamento.</p>
  <p style="color: #374151; font-size: 16px; line-height: 1.6;">Não perca tempo, clique no link abaixo para completar seu perfil agora mesmo:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://ealumina.com/dashboard" style="background-color: #e11d48; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block;">
      Completar meu Cadastro
    </a>
  </div>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
  <p style="color: #9ca3af; font-size: 12px; text-align: center;">Equipe EA Lumina &copy; 2026</p>
</div>`
  }
]

// GET /api/admin/emails/automations
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    // Obter ou criar automações padrão
    const automations = await prisma.emailAutomation.findMany()

    if (automations.length < DEFAULT_AUTOMATIONS.length) {
      // Cria registros que estão faltando
      for (const def of DEFAULT_AUTOMATIONS) {
        const found = automations.find(a => a.trigger === def.trigger)
        if (!found) {
          await prisma.emailAutomation.create({
            data: {
              trigger: def.trigger,
              subject: def.subject,
              content: def.content,
              active: true
            }
          })
        }
      }
      
      const updatedList = await prisma.emailAutomation.findMany({
        orderBy: { trigger: 'asc' }
      })
      return NextResponse.json({ success: true, automations: updatedList })
    }

    return NextResponse.json({ success: true, automations })
  } catch (error: any) {
    console.error('[GET_AUTOMATIONS_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT /api/admin/emails/automations
export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const { trigger, subject, content, active } = body

    if (!trigger || !subject || !content) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const automation = await prisma.emailAutomation.upsert({
      where: { trigger },
      update: {
        subject,
        content,
        active: active ?? true
      },
      create: {
        trigger,
        subject,
        content,
        active: active ?? true
      }
    })

    return NextResponse.json({ success: true, automation, message: 'Automação atualizada com sucesso!' })
  } catch (error: any) {
    console.error('[PUT_AUTOMATION_ERROR]', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}
