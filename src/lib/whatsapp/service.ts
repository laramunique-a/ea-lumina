import { prisma } from '../prisma';
import { getWhatsAppProvider } from './factory';
import { normalizeBrazilianPhone } from './phone';
import { WaEvent, WA_EVENTS } from './types';
import { getPlainText, getMetaTemplateConfig } from './templates';

/** Formata data e hora com fuso horário do terapeuta ou fallback Brazil */
function formatAppointmentDateTime(
  date: Date,
  timezone?: string | null
): { dateStr: string; timeStr: string } {
  const tz = timezone || 'America/Sao_Paulo';
  const dateStr = date.toLocaleDateString('pt-BR', { timeZone: tz });
  const timeStr = date.toLocaleTimeString('pt-BR', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
  });
  return { dateStr, timeStr };
}

export class WhatsAppService {
  /**
   * Tenta enviar uma notificação baseada no provedor configurado.
   * Garante idempotência via restrição única na tabela WhatsAppNotification.
   * Falhas nunca quebram a rota HTTP principal.
   */
  public static async notify(
    appointmentId: string,
    event: WaEvent,
    recipientType: 'PATIENT' | 'THERAPIST',
    rawPhone: string | null | undefined,
    templateParams: {
      patientName: string;
      patientPhone?: string;
      therapyName?: string;
      therapistName: string;
      date: string;
      time: string;
      dashboardUrl: string;
    }
  ): Promise<boolean> {
    try {
      if (!rawPhone) {
        console.warn(
          `[WhatsAppService] Número não fornecido para agendamento ${appointmentId} (${recipientType}). Abortando.`
        );
        return false;
      }

      let phone: string;
      try {
        phone = normalizeBrazilianPhone(rawPhone);
      } catch (err: any) {
        console.warn(
          `[WhatsAppService] Número inválido para agendamento ${appointmentId} (${recipientType}). Erro: ${err.message}`
        );
        return false;
      }

      // 1. Verificar idempotência: se já existe notificação bem-sucedida, abortar
      const existing = await prisma.whatsAppNotification.findUnique({
        where: {
          appointmentId_event_recipientType: {
            appointmentId,
            event,
            recipientType,
          },
        },
      });

      if (existing) {
        if (['SENT', 'DELIVERED', 'READ'].includes(existing.status)) {
          console.log(
            `[WhatsAppService] Notificação já enviada (${existing.status}) para ${event}. Ignorando duplicata.`
          );
          return true;
        }

        if (existing.attempts >= 5) {
          console.warn(
            `[WhatsAppService] Número máximo de tentativas (5) excedido para ${event}.`
          );
          return false;
        }
      }

      const providerType = process.env.WHATSAPP_PROVIDER || 'evolution';

      // 2. Preparar payload conforme provedor
      let payload: any = {};

      if (providerType === 'meta') {
        payload = getMetaTemplateConfig(event, templateParams);
      } else {
        // zapi e evolution usam texto plano
        payload = { text: getPlainText(event, templateParams) };
      }

      // 3. Persistir registro (PROCESSING) antes de chamar API externa
      const notification = await prisma.whatsAppNotification.upsert({
        where: {
          appointmentId_event_recipientType: {
            appointmentId,
            event,
            recipientType,
          },
        },
        create: {
          appointmentId,
          event,
          recipientType,
          recipientPhone: phone,
          provider: providerType,
          templateName: payload.templateName || null,
          payload: payload,
          status: 'PROCESSING',
          attempts: 1,
        },
        update: {
          status: 'PROCESSING',
          attempts: { increment: 1 },
          payload: payload,
          provider: providerType,
          templateName: payload.templateName || null,
        },
      });

      // 4. Enviar usando o provedor — NUNCA dentro de transação Prisma
      const provider = getWhatsAppProvider();
      let result;

      if (providerType === 'meta') {
        result = await provider.sendTemplate({
          to: phone,
          templateName: payload.templateName,
          components: payload.components,
        });
      } else {
        // zapi e evolution: texto plano
        result = await provider.sendText({ to: phone, text: payload.text });
      }

      // 5. Atualizar resultado no banco
      if (result.success) {
        await prisma.whatsAppNotification.update({
          where: { id: notification.id },
          data: {
            status: 'SENT',
            providerMessageId: result.messageId,
            sentAt: new Date(),
            errorMessage: null,
            nextRetryAt: null,
          },
        });
        return true;
      } else {
        const backoffMinutes = notification.attempts * 5;
        const nextRetryAt = new Date(Date.now() + backoffMinutes * 60000);

        await prisma.whatsAppNotification.update({
          where: { id: notification.id },
          data: {
            status: 'FAILED',
            errorMessage:
              typeof result.error === 'string' ? result.error : JSON.stringify(result.error),
            failedAt: new Date(),
            nextRetryAt: notification.attempts < 5 ? nextRetryAt : null,
          },
        });
        return false;
      }
    } catch (err: any) {
      console.error(`[WhatsAppService] Erro fatal interno em notify(${event}):`, err.message);
      try {
        const existing = await prisma.whatsAppNotification.findFirst({
          where: { appointmentId, event, recipientType },
        });
        if (existing) {
          const backoffMinutes = existing.attempts * 5;
          const nextRetryAt = new Date(Date.now() + backoffMinutes * 60000);
          await prisma.whatsAppNotification.update({
            where: { id: existing.id },
            data: {
              status: 'FAILED',
              errorMessage: err.message || String(err),
              failedAt: new Date(),
              nextRetryAt: existing.attempts < 5 ? nextRetryAt : null,
            },
          });
        }
      } catch (dbErr) {
        console.error(`[WhatsAppService] Erro ao salvar falha no banco:`, dbErr);
      }
      return false; // Nunca quebra a rota HTTP principal
    }
  }

  /**
   * Notifica SOMENTE o terapeuta sobre nova solicitação de consulta.
   * Paciente NÃO recebe mensagem neste momento.
   * Deve ser chamado após pagamento confirmado (Stripe) ou para agendamentos via pacote.
   */
  public static async notifyNewAppointment(appointmentId: string): Promise<void> {
    try {
      const apt = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          therapist: { include: { user: true } },
          patient: { include: { user: true } },
          service: true,
        },
      });

      if (!apt) return;

      const patientName = apt.patient.socialName || apt.patient.user?.name || 'Paciente';
      const therapistName = apt.therapist.professionalName || apt.therapist.user?.name || 'Terapeuta';
      const therapyName = apt.service?.name || undefined;

      const { dateStr, timeStr } = formatAppointmentDateTime(apt.date, apt.therapist.timezone);

      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://ealumina.com').replace(/\/$/, '');

      // Terapeuta: usa whatsapp do perfil, ou fallback para phone do user
      const therapistPhone = apt.therapist.whatsapp || apt.therapist.user?.phone;

      await this.notify(
        appointmentId,
        WA_EVENTS.BOOKING_REQUESTED_THERAPIST,
        'THERAPIST',
        therapistPhone,
        {
          patientName,
          therapyName,
          therapistName,
          date: dateStr,
          time: timeStr,
          dashboardUrl: `${appUrl}/dashboard/terapeuta/agenda`,
        }
      );

      // BOOKING_RECEIVED_PATIENT NÃO é disparado aqui (conforme especificação)
    } catch (err: any) {
      console.error(`[WhatsAppService] Erro em notifyNewAppointment(${appointmentId}):`, err.message);
    }
  }

  /**
   * Notifica PACIENTE e TERAPEUTA sobre confirmação do agendamento.
   * Deve ser chamado somente na transição PENDENTE → CONFIRMADO.
   */
  public static async notifyConfirmed(appointmentId: string): Promise<void> {
    try {
      const apt = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          therapist: { include: { user: true } },
          patient: { include: { user: true } },
        },
      });

      if (!apt) return;

      const patientName = apt.patient.socialName || apt.patient.user?.name || 'Paciente';
      const therapistName = apt.therapist.professionalName || apt.therapist.user?.name || 'Terapeuta';

      const { dateStr, timeStr } = formatAppointmentDateTime(apt.date, apt.therapist.timezone);

      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://ealumina.com').replace(/\/$/, '');
      const patientPhone = apt.patient.user?.phone;
      const therapistPhone = apt.therapist.whatsapp || apt.therapist.user?.phone;

      const commonParams = {
        patientName,
        therapistName,
        date: dateStr,
        time: timeStr,
      };

      // Enviar para paciente e terapeuta em paralelo; falha de um não impede o outro
      await Promise.allSettled([
        this.notify(appointmentId, WA_EVENTS.BOOKING_CONFIRMED_PATIENT, 'PATIENT', patientPhone, {
          ...commonParams,
          dashboardUrl: `${appUrl}/dashboard/paciente/agendamentos`,
        }),
        this.notify(
          appointmentId,
          WA_EVENTS.BOOKING_CONFIRMED_THERAPIST,
          'THERAPIST',
          therapistPhone,
          {
            ...commonParams,
            dashboardUrl: `${appUrl}/dashboard/terapeuta/agenda`,
          }
        ),
      ]);
    } catch (err: any) {
      console.error(`[WhatsAppService] Erro em notifyConfirmed(${appointmentId}):`, err.message);
    }
  }

  /**
   * Envia lembretes de ~24h para paciente e terapeuta.
   * Ignora agendamentos que não estejam CONFIRMADO, cancelados, concluídos ou no passado.
   * Idempotência garantida pela restrição única em WhatsAppNotification.
   */
  public static async notifyReminder(appointmentId: string): Promise<{
    patientSent: boolean;
    therapistSent: boolean;
    skipped: boolean;
  }> {
    const skipped = { patientSent: false, therapistSent: false, skipped: true };

    try {
      const apt = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          therapist: { include: { user: true } },
          patient: { include: { user: true } },
        },
      });

      if (!apt) return skipped;

      // Ignorar agendamentos que não estejam CONFIRMADO
      if (apt.status !== 'CONFIRMADO') return skipped;

      // Ignorar se já passou
      if (apt.date <= new Date()) return skipped;

      const patientName = apt.patient.socialName || apt.patient.user?.name || 'Paciente';
      const therapistName = apt.therapist.professionalName || apt.therapist.user?.name || 'Terapeuta';

      const { dateStr, timeStr } = formatAppointmentDateTime(apt.date, apt.therapist.timezone);

      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://ealumina.com').replace(/\/$/, '');
      const patientPhone = apt.patient.user?.phone;
      const therapistPhone = apt.therapist.whatsapp || apt.therapist.user?.phone;

      const commonParams = {
        patientName,
        therapistName,
        date: dateStr,
        time: timeStr,
      };

      const [patientResult, therapistResult] = await Promise.allSettled([
        this.notify(
          appointmentId,
          WA_EVENTS.BOOKING_REMINDER_PATIENT,
          'PATIENT',
          patientPhone,
          {
            ...commonParams,
            dashboardUrl: `${appUrl}/dashboard/paciente/agendamentos`,
          }
        ),
        this.notify(
          appointmentId,
          WA_EVENTS.BOOKING_REMINDER_THERAPIST,
          'THERAPIST',
          therapistPhone,
          {
            ...commonParams,
            dashboardUrl: `${appUrl}/dashboard/terapeuta/agenda`,
          }
        ),
      ]);

      return {
        patientSent: patientResult.status === 'fulfilled' && patientResult.value === true,
        therapistSent: therapistResult.status === 'fulfilled' && therapistResult.value === true,
        skipped: false,
      };
    } catch (err: any) {
      console.error(`[WhatsAppService] Erro em notifyReminder(${appointmentId}):`, err.message);
      return skipped;
    }
  }

  /**
   * Notifica sobre cancelamento de agendamento.
   * Se cancelledBy = PATIENT → notifica terapeuta.
   * Se cancelledBy = THERAPIST → notifica paciente.
   */
  public static async notifyCancelled(
    appointmentId: string,
    cancelledBy: 'PATIENT' | 'THERAPIST'
  ): Promise<void> {
    try {
      const apt = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          therapist: { include: { user: true } },
          patient: { include: { user: true } },
        },
      });

      if (!apt) return;

      const patientName = apt.patient.socialName || apt.patient.user?.name || 'Paciente';
      const therapistName = apt.therapist.professionalName || apt.therapist.user?.name || 'Terapeuta';

      const { dateStr, timeStr } = formatAppointmentDateTime(apt.date, apt.therapist.timezone);

      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://ealumina.com').replace(/\/$/, '');

      if (cancelledBy === 'PATIENT') {
        const therapistPhone = apt.therapist.whatsapp || apt.therapist.user?.phone;
        await this.notify(
          appointmentId,
          WA_EVENTS.BOOKING_CANCELLED_THERAPIST,
          'THERAPIST',
          therapistPhone,
          {
            patientName,
            therapistName,
            date: dateStr,
            time: timeStr,
            dashboardUrl: `${appUrl}/dashboard/terapeuta/agenda`,
          }
        );
      } else {
        await this.notify(
          appointmentId,
          WA_EVENTS.BOOKING_CANCELLED_PATIENT,
          'PATIENT',
          apt.patient.user?.phone,
          {
            patientName,
            therapistName,
            date: dateStr,
            time: timeStr,
            dashboardUrl: `${appUrl}/dashboard/paciente/agendamentos`,
          }
        );
      }
    } catch (err: any) {
      console.error(`[WhatsAppService] Erro em notifyCancelled(${appointmentId}):`, err.message);
    }
  }
}
