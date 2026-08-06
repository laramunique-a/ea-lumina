import { prisma } from '../prisma';
import { getWhatsAppProvider } from './factory';
import { normalizeBrazilianPhone } from './phone';
import { WaEvent, WA_EVENTS } from './types';
import { getEvolutionText, getMetaTemplateConfig } from './templates';

export class WhatsAppService {
  /**
   * Tenta enviar uma notificação baseada no provedor configurado.
   * Se der erro no provedor, armazena como FAILED ou PENDING para retry.
   * Se já existir uma notificação SENT, DELIVERED ou READ, aborta duplicada.
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
        console.warn(`[WhatsAppService] Número não fornecido para agendamento ${appointmentId} (${recipientType}). Abortando.`);
        return false;
      }

      let phone: string;
      try {
        phone = normalizeBrazilianPhone(rawPhone);
      } catch (err: any) {
        console.warn(`[WhatsAppService] Número inválido (${rawPhone}) para agendamento ${appointmentId}. Erro: ${err.message}`);
        return false; // Não deve quebrar transações
      }

      // 1. Evitar duplicidades: verificar se já existe notificação para este evento e destinatário
      const existing = await prisma.whatsAppNotification.findUnique({
        where: {
          appointmentId_event_recipientType: {
            appointmentId,
            event,
            recipientType
          }
        }
      });

      if (existing) {
        if (['SENT', 'DELIVERED', 'READ'].includes(existing.status)) {
          console.log(`[WhatsAppService] Notificação já enviada (${existing.status}) para o evento ${event}. Ignorando.`);
          return true;
        }

        if (existing.attempts >= 5) {
          console.warn(`[WhatsAppService] Número máximo de tentativas (5) excedido para ${event}.`);
          return false;
        }
      }

      const providerType = process.env.WHATSAPP_PROVIDER || 'evolution';
      
      // 2. Preparar payload conforme provedor
      let payload: any = {};
      
      if (providerType === 'evolution') {
        payload = { text: getEvolutionText(event, templateParams) };
      } else if (providerType === 'meta') {
        payload = getMetaTemplateConfig(event, templateParams);
      }

      // 3. Criar ou atualizar registro (Status PENDING/PROCESSING)
      const notification = await prisma.whatsAppNotification.upsert({
        where: {
          appointmentId_event_recipientType: {
            appointmentId,
            event,
            recipientType
          }
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
        }
      });

      // 4. Enviar usando o provedor
      const provider = getWhatsAppProvider();
      let result;

      if (providerType === 'evolution') {
        result = await provider.sendText({
          to: phone,
          text: payload.text
        });
      } else {
        result = await provider.sendTemplate({
          to: phone,
          templateName: payload.templateName,
          components: payload.components
        });
      }

      // 5. Atualizar resultado
      if (result.success) {
        await prisma.whatsAppNotification.update({
          where: { id: notification.id },
          data: {
            status: 'SENT',
            providerMessageId: result.messageId,
            sentAt: new Date(),
            errorMessage: null,
            nextRetryAt: null
          }
        });
        return true;
      } else {
        // Backoff progressivo simples: tentativas * 5 minutos
        const backoffMinutes = notification.attempts * 5;
        const nextRetryAt = new Date(Date.now() + backoffMinutes * 60000);

        await prisma.whatsAppNotification.update({
          where: { id: notification.id },
          data: {
            status: 'FAILED',
            errorMessage: typeof result.error === 'string' ? result.error : JSON.stringify(result.error),
            failedAt: new Date(),
            nextRetryAt: notification.attempts < 5 ? nextRetryAt : null
          }
        });
        return false;
      }

    } catch (err: any) {
      console.error(`[WhatsAppService] Erro fatal interno:`, err);
      try {
        const existing = await prisma.whatsAppNotification.findFirst({
          where: {
            appointmentId,
            event,
            recipientType
          }
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
              nextRetryAt: existing.attempts < 5 ? nextRetryAt : null
            }
          });
        }
      } catch (dbErr) {
        console.error(`[WhatsAppService] Erro ao salvar falha no banco:`, dbErr);
      }
      return false; // Nunca quebra a rota HTTP principal
    }
  }

  /**
   * Helper para Notificar Novo Agendamento (Paciente e Terapeuta)
   */
  public static async notifyNewAppointment(appointmentId: string) {
    const apt = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        therapist: { include: { user: true } },
        patient: { include: { user: true } },
        service: true
      }
    });

    if (!apt) return;

    const patientName = apt.patient.socialName || apt.patient.user?.name || 'Paciente';
    const therapistName = apt.therapist.professionalName || apt.therapist.user?.name || 'Terapeuta';
    const patientPhone = apt.patient.user?.phone || undefined;
    const therapyName = apt.service?.name || undefined;
    
    // Fuso brasileiro
    const dateObj = new Date(apt.date);
    const dateStr = dateObj.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const timeStr = dateObj.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://ealumina.com').replace(/\/$/, '');
    const therapistUrl = `${appUrl}/dashboard/terapeuta/agenda`;

    // 1. Notifica o Terapeuta
    await this.notify(
      appointmentId,
      WA_EVENTS.BOOKING_REQUESTED_THERAPIST,
      'THERAPIST',
      apt.therapist.whatsapp,
      {
        patientName,
        patientPhone,
        therapyName,
        therapistName,
        date: dateStr,
        time: timeStr,
        dashboardUrl: therapistUrl
      }
    );

    // 2. Notifica o Paciente
    await this.notify(
      appointmentId,
      WA_EVENTS.BOOKING_RECEIVED_PATIENT,
      'PATIENT',
      apt.patient.user?.phone, // Ou outro campo se tiver
      {
        patientName,
        therapistName,
        date: dateStr,
        time: timeStr,
        dashboardUrl: `${appUrl}/dashboard/paciente/agendamentos`
      }
    );
  }

  /**
   * Helper para Notificar Confirmação (Somente Paciente)
   */
  public static async notifyConfirmed(appointmentId: string) {
    const apt = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        therapist: { include: { user: true } },
        patient: { include: { user: true } }
      }
    });

    if (!apt) return;

    const patientName = apt.patient.socialName || apt.patient.user?.name || 'Paciente';
    const therapistName = apt.therapist.professionalName || apt.therapist.user?.name || 'Terapeuta';
    
    const dateObj = new Date(apt.date);
    const dateStr = dateObj.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const timeStr = dateObj.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://ealumina.com').replace(/\/$/, '');

    await this.notify(
      appointmentId,
      WA_EVENTS.BOOKING_CONFIRMED_PATIENT,
      'PATIENT',
      apt.patient.user?.phone,
      {
        patientName,
        therapistName,
        date: dateStr,
        time: timeStr,
        dashboardUrl: `${appUrl}/dashboard/paciente/agendamentos`
      }
    );
  }

  /**
   * Helper para Notificar Cancelamento
   */
  public static async notifyCancelled(appointmentId: string, cancelledBy: 'PATIENT' | 'THERAPIST') {
    const apt = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        therapist: { include: { user: true } },
        patient: { include: { user: true } }
      }
    });

    if (!apt) return;

    const patientName = apt.patient.socialName || apt.patient.user?.name || 'Paciente';
    const therapistName = apt.therapist.professionalName || apt.therapist.user?.name || 'Terapeuta';
    
    const dateObj = new Date(apt.date);
    const dateStr = dateObj.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const timeStr = dateObj.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://ealumina.com').replace(/\/$/, '');

    if (cancelledBy === 'PATIENT') {
      // Paciente cancelou -> Notifica o Terapeuta
      await this.notify(
        appointmentId,
        WA_EVENTS.BOOKING_CANCELLED_THERAPIST,
        'THERAPIST',
        apt.therapist.whatsapp,
        {
          patientName,
          therapistName,
          date: dateStr,
          time: timeStr,
          dashboardUrl: `${appUrl}/dashboard/terapeuta/agenda`
        }
      );
    } else {
      // Terapeuta cancelou -> Notifica o Paciente
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
          dashboardUrl: `${appUrl}/dashboard/paciente/agendamentos`
        }
      );
    }
  }
}
