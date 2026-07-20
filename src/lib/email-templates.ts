export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function getBaseAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'https://ea-lumina.com'
  return url.replace(/\/$/, '')
}

export interface EmailTemplateResult {
  subject: string
  html: string
  text: string
}

const EMAIL_HEADER = `
  <div style="background-color: #010409; padding: 32px 24px; text-align: center; border-bottom: 2px solid #C5A03F;">
    <h1 style="color: #ffffff; font-family: 'Inter', system-ui, sans-serif; font-size: 22px; font-weight: 900; margin: 0; tracking: 0.15em; text-transform: uppercase;">
      EA Lumina
    </h1>
    <p style="color: #0090FF; font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 700; margin: 6px 0 0 0; letter-spacing: 0.1em; text-transform: uppercase;">
      Rede Integrativa & Tecnológica
    </p>
  </div>
`

const getEmailFooter = (appUrl: string) => `
  <div style="background-color: #0f172a; padding: 24px; text-align: center; border-top: 1px solid #1e293b; font-family: 'Inter', system-ui, sans-serif;">
    <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0 0 12px 0;">
      A EA Lumina promove abordagens integrativas voltadas ao bem-estar e autocuidado. Nossos serviços não substituem consultas médicas, psicológicas ou de urgência.
    </p>
    <p style="color: #64748b; font-size: 11px; margin: 0 0 12px 0;">
      <a href="${appUrl}/privacidade" style="color: #0090FF; text-decoration: none; font-weight: 600;">Política de Privacidade</a> &nbsp;|&nbsp;
      <a href="${appUrl}/termos" style="color: #0090FF; text-decoration: none; font-weight: 600;">Termos de Uso</a> &nbsp;|&nbsp;
      <a href="mailto:privacidade@ealumina.com" style="color: #0090FF; text-decoration: none; font-weight: 600;">Privacidade & DPO</a>
    </p>
    <p style="color: #475569; font-size: 10px; margin: 0;">
      Equipe EA Lumina &copy; ${new Date().getFullYear()} — Todos os direitos reservados.
    </p>
  </div>
`

/**
 * Template: WELCOME_PATIENT
 */
export function getWelcomePatientEmail(recipientName: string): EmailTemplateResult {
  const appUrl = getBaseAppUrl()
  const safeName = escapeHtml(recipientName || 'Paciente')

  const subject = 'Boas-vindas à EA Lumina — Sua Jornada de Bem-estar Integrativo'
  
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          ${EMAIL_HEADER}
          
          <div style="padding: 36px 32px; color: #1e293b; font-size: 15px; line-height: 1.7;">
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">
              Olá, ${safeName}!
            </h2>
            <p style="margin-top: 0; margin-bottom: 16px;">
              Seja muito bem-vindo(a) à <strong>EA Lumina</strong>. É uma alegria ter você conosco em nossa plataforma voltada à saúde integrativa e ao desenvolvimento pessoal.
            </p>
            <p style="margin-bottom: 24px;">
              Nosso objetivo é proporcionar um espaço seguro, acolhedor e transparente para conectar você a profissionais credenciados que atuam em abordagens complementares de bem-estar.
            </p>

            <div style="background-color: #f0f9ff; border-left: 4px solid #0090FF; padding: 16px 20px; border-radius: 8px; margin-bottom: 28px;">
              <p style="color: #0369a1; font-weight: 700; font-size: 14px; margin: 0 0 4px 0;">Sua Autonomia e Privacidade</p>
              <p style="color: #0c4a6e; font-size: 13px; margin: 0;">
                Você tem controle total sobre suas preferências, histórico de agendamentos e dados de perfil. Suas informações pessoais e sensíveis são tratadas com sigilo absoluto.
              </p>
            </div>

            <p style="margin-bottom: 28px; font-weight: 600; text-align: center; color: #0f172a;">
              Pronto para dar o primeiro passo?
            </p>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${appUrl}/terapeutas" style="background-color: #0090FF; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 144, 255, 0.25);">
                Conhecer a Rede de Terapeutas
              </a>
            </div>

            <p style="font-size: 12px; color: #64748b; text-align: center; margin-bottom: 0;">
              Se tiver dúvidas ou precisar de ajuda, acesse nossa central de ajuda ou responda a este e-mail.
            </p>
          </div>

          ${getEmailFooter(appUrl)}
        </div>
      </body>
    </html>
  `

  const text = `
Olá, ${safeName}!

Seja muito bem-vindo(a) à EA Lumina. É uma alegria ter você conosco em nossa plataforma voltada à saúde integrativa e ao desenvolvimento pessoal.

Nosso objetivo é proporcionar um espaço seguro, acolhedor e transparente para conectar você a profissionais credenciados.

Acesse a Rede de Terapeutas: ${appUrl}/terapeutas
Sua Privacidade: ${appUrl}/privacidade
Termos de Uso: ${appUrl}/termos

Equipe EA Lumina
  `.trim()

  return { subject, html, text }
}

/**
 * Template: WELCOME_THERAPIST
 */
export function getWelcomeTherapistEmail(recipientName: string): EmailTemplateResult {
  const appUrl = getBaseAppUrl()
  const safeName = escapeHtml(recipientName || 'Terapeuta')

  const subject = 'Bem-vindo(a) à Rede Lumina — Manifesto e Configuração de Perfil'

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          ${EMAIL_HEADER}
          
          <div style="padding: 36px 32px; color: #1e293b; font-size: 15px; line-height: 1.7;">
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">
              Olá, ${safeName}!
            </h2>
            <p style="margin-top: 0; margin-bottom: 16px;">
              Parabéns por iniciar sua jornada de credenciamento na <strong>Rede Lumina</strong>. Nosso ecossistema reúne profissionais comprometidos com a ética, o profissionalismo e a coerência nas práticas integrativas.
            </p>

            <div style="background-color: #faf5ff; border-left: 4px solid #C5A03F; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px;">
              <p style="color: #78350f; font-weight: 700; font-size: 14px; margin: 0 0 6px 0;">Próximos Passos Obrigatórios:</p>
              <ol style="color: #92400e; font-size: 13px; margin: 0; padding-left: 18px; line-height: 1.6;">
                <li>Completar as informações e especialidades do seu perfil.</li>
                <li>Leitura e aceite auditável do <strong>Manifesto do Terapeuta</strong>.</li>
                <li>Envio para análise e aprovação da equipe de curadoria.</li>
              </ol>
            </div>

            <p style="margin-bottom: 28px; font-size: 13px; color: #475569;">
              Importante: Seu perfil profissional somente ficará visível na vitrine pública da plataforma após o cumprimento do checklist de onboarding e a devida aprovação administrativa.
            </p>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${appUrl}/dashboard/terapeuta/manifesto" style="background-color: #0f172a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block; border: 1px solid #C5A03F; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);">
                Acessar Manifesto & Painel
              </a>
            </div>
          </div>

          ${getEmailFooter(appUrl)}
        </div>
      </body>
    </html>
  `

  const text = `
Olá, ${safeName}!

Parabéns por iniciar sua jornada de credenciamento na Rede Lumina.

Próximos passos:
1. Complete seu perfil profissional.
2. Leia e assine o Manifesto da Rede Lumina.
3. Aguarde a aprovação da curadoria.

Acesse o Manifesto: ${appUrl}/dashboard/terapeuta/manifesto

Equipe EA Lumina
  `.trim()

  return { subject, html, text }
}

/**
 * Template: INCOMPLETE_PROFILE
 */
export function getIncompleteProfileEmail(recipientName: string, role: string): EmailTemplateResult {
  const appUrl = getBaseAppUrl()
  const safeName = escapeHtml(recipientName || 'Usuário')
  const isTherapist = role === 'TERAPEUTA'

  const subject = 'EA Lumina — Complete seu cadastro para aproveitar todos os recursos'
  const redirectPath = isTherapist ? '/dashboard/terapeuta/perfil' : '/dashboard/paciente/perfil'

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          ${EMAIL_HEADER}
          
          <div style="padding: 36px 32px; color: #1e293b; font-size: 15px; line-height: 1.7;">
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">
              Olá, ${safeName}!
            </h2>
            <p style="margin-top: 0; margin-bottom: 16px;">
              Notamos que seu perfil na <strong>EA Lumina</strong> ainda possui pendências de preenchimento.
            </p>
            <p style="margin-bottom: 24px;">
              Manter suas informações atualizadas permite que você desfrute de uma experiência completa, personalizada e segura dentro da plataforma.
            </p>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${appUrl}${redirectPath}" style="background-color: #0090FF; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block;">
                Concluir Meu Cadastro
              </a>
            </div>
          </div>

          ${getEmailFooter(appUrl)}
        </div>
      </body>
    </html>
  `

  const text = `
Olá, ${safeName}!

Notamos que seu perfil na EA Lumina possui dados pendentes.
Conclua seu cadastro para acessar todos os recursos: ${appUrl}${redirectPath}

Equipe EA Lumina
  `.trim()

  return { subject, html, text }
}
