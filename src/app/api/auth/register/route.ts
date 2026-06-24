export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateAccessToken, generateRefreshToken, saveRefreshToken, getAuthCookieOptions } from '@/lib/auth'
import { Role } from '@prisma/client'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { transporter } from '@/lib/mail.service'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter ao menos 6 caracteres')
    .regex(/[0-9]/, 'Senha deve conter ao menos um número'),
  role: z.enum(['TERAPEUTA', 'PACIENTE']),
  // Campos opcionais do terapeuta
  therapies: z.array(z.string()).optional(),
  price: z.number().positive().optional(),
  modality: z.enum(['ONLINE', 'PRESENCIAL', 'AMBOS']).optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  professionalName: z.string().optional(),
  nationality: z.string().optional(),
  documentId: z.string().optional(),
  languages: z.array(z.string()).optional(),
  bio: z.string().optional(),
  whatsapp: z.string().optional(),
  professionalEmail: z.string().email().optional().or(z.literal('')),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  // Data de nascimento (terapeuta ou paciente)
  birthDate: z.string().optional(),
  // Campos opcionais do paciente
  anamnese: z.record(z.unknown()).optional(),
  gender: z.enum(['MASCULINO', 'FEMININO', 'NAO_BINARIO', 'PREFIRO_NAO_INFORMAR']).optional(),
})

export async function POST(request: NextRequest) {
  // Rate limiting: máx. 5 registros por IP em 1 hora
  const ip = getClientIp(request)
  const rl = checkRateLimit(`register:${ip}`, { limit: 5, windowSeconds: 60 * 60 })
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Muitos cadastros realizados. Tente novamente em 1 hora.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    )
  }

  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    console.error('[REGISTER] Missing JWT_SECRET or JWT_REFRESH_SECRET')
    return NextResponse.json(
      { success: false, error: 'Erro de configuração do servidor. Tente novamente mais tarde.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const validated = registerSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, email, password, role, therapies, price, modality, location, city, state, country, professionalName, nationality, documentId, languages, bio, whatsapp, professionalEmail, instagram, facebook, websiteUrl, anamnese, gender, birthDate } = validated.data

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Este e-mail já está cadastrado' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário com perfil correspondente à role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
        ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
        ...(role === 'TERAPEUTA' && {
          therapistProfile: {
            create: {
              bio: bio || '',
              therapies: therapies || [],
              price: price || 0,
              modality: (modality as any) || 'AMBOS',
              location: location || '',
              city: city || '',
              state: state || '',
              country: country || null,
              professionalName: professionalName || null,
              nationality: nationality || null,
              documentId: documentId || null,
              languages: languages?.length ? languages : ['Português'],
              whatsapp: whatsapp || null,
              professionalEmail: professionalEmail || null,
              instagram: instagram || null,
              facebook: facebook || null,
              websiteUrl: websiteUrl || null,
              approved: false,
            },
          },
        }),
        ...(role === 'PACIENTE' && {
          patientProfile: {
            create: {
              gender: gender as any || undefined,
              birthDate: birthDate ? new Date(birthDate) : undefined,
              anamnese: (anamnese || {}) as any,
            },
          },
        }),
      },
    })

    // Gerar tokens
    const tokenPayload = { sub: user.id, email: user.email, role: user.role, name: user.name }
    const accessToken = await generateAccessToken(tokenPayload)
    const refreshToken = await generateRefreshToken(tokenPayload)

    await saveRefreshToken(user.id, refreshToken)

    // Notificação de boas-vindas
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Bem-vindo ao EA Lumina!',
        message: role === 'TERAPEUTA'
          ? 'Seu cadastro foi recebido. Aguarde a aprovação da equipe EA Lumina para começar a atender.'
          : 'Sua conta foi criada com sucesso. Explore os terapeutas disponíveis e agende sua primeira sessão!',
        type: 'SUCCESS',
      },
    })

    // Envio do e-mail automático de boas-vindas
    try {
      const triggerType = role === 'TERAPEUTA' ? 'WELCOME_THERAPIST' : 'WELCOME_PATIENT'
      let automation = await prisma.emailAutomation.findUnique({
        where: { trigger: triggerType }
      })

      if (!automation) {
        const defaultSubject = role === 'TERAPEUTA' 
          ? 'Seja muito bem-vindo(a) ao EA Lumina, {{nome}}!' 
          : 'Bem-vindo(a) ao EA Lumina, {{nome}}!'
        const defaultContent = role === 'TERAPEUTA'
          ? `<div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
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
          : `<div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
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

        automation = await prisma.emailAutomation.create({
          data: {
            trigger: triggerType,
            subject: defaultSubject,
            content: defaultContent,
            active: true
          }
        })
      }

      if (automation && automation.active) {
        const campaign = await prisma.emailCampaign.create({
          data: {
            subject: automation.subject,
            content: automation.content,
            type: 'AUTOMATIC',
            trigger: triggerType,
            status: 'SENDING',
            recipientsCount: 1
          }
        })

        const personalizedSubject = automation.subject.replace(/\{\{nome\}\}/g, name || 'Usuário')
        const personalizedContent = automation.content.replace(/\{\{nome\}\}/g, name || 'Usuário')

        const emailFrom = process.env.EMAIL_FROM || '"EA Lumina" <contato@ealumina.com>'

        transporter.sendMail({
          from: emailFrom,
          to: email,
          subject: personalizedSubject,
          html: personalizedContent
        }).then(async () => {
          await prisma.$transaction([
            prisma.emailCampaign.update({
              where: { id: campaign.id },
              data: { status: 'SUCCESS' }
            }),
            prisma.emailLog.create({
              data: {
                campaignId: campaign.id,
                userId: user.id,
                recipientEmail: email,
                recipientName: name,
                status: 'SUCCESS'
              }
            })
          ])
        }).catch(async (err: any) => {
          console.error(`[WELCOME_EMAIL_SEND_ERROR] Error:`, err)
          await prisma.$transaction([
            prisma.emailCampaign.update({
              where: { id: campaign.id },
              data: { status: 'FAILED' }
            }),
            prisma.emailLog.create({
              data: {
                campaignId: campaign.id,
                userId: user.id,
                recipientEmail: email,
                recipientName: name,
                status: 'FAILED',
                errorMessage: err.message || 'Erro SMTP'
              }
            })
          ])
        })
      }
    } catch (mailError) {
      console.error('[WELCOME_EMAIL_ERROR]', mailError)
    }

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
          accessToken,
        },
        message: 'Conta criada com sucesso!',
      },
      { status: 201 }
    )

    const cookieOptions = getAuthCookieOptions()
    response.cookies.set('access_token', accessToken, { ...cookieOptions, maxAge: 8 * 60 * 60 })
    response.cookies.set('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 })

    return response
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('[REGISTER]', err.message, err.stack)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
