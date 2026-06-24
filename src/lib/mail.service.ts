import { Resend } from 'resend';

// Inicializa o cliente do Resend
// O RESEND_API_KEY deve ser configurado no painel da Vercel e no .env local
export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (to: string, resetUrl: string) => {
  const from = process.env.EMAIL_FROM || 'EA Lumina <contato@ealumina.com>';

  await resend.emails.send({
    from,
    to,
    subject: 'Recuperação de Senha - EA Lumina',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4338ca; font-size: 28px; margin: 0; font-weight: 700;">Recuperação de Senha</h1>
        </div>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">Recebemos uma solicitação para redefinir sua senha no <strong>EA Lumina</strong>.</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">Clique no botão abaixo para criar uma nova senha de forma segura:</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
            Redefinir Senha
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">Se você não solicitou a redefinição de senha, ignore este e-mail.</p>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 10px;">Equipe EA Lumina &copy; ${new Date().getFullYear()}</p>
      </div>
    `,
  });
};
