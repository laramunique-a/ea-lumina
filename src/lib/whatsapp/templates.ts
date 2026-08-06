import { WaEvent, WA_EVENTS } from './types';

interface TemplateParams {
  patientName: string;
  patientPhone?: string;
  therapyName?: string;
  therapistName: string;
  date: string;
  time: string;
  dashboardUrl: string;
}

/**
 * Gera o texto plano para Z-API e Evolution API.
 * Substitui getEvolutionText — compatibilidade mantida via alias exportado abaixo.
 */
export function getPlainText(event: WaEvent, params: TemplateParams): string {
  switch (event) {
    case WA_EVENTS.BOOKING_REQUESTED_THERAPIST:
      return (
        `📅 *Nova solicitação de consulta*\n\n` +
        `Olá, ${params.therapistName}.\n\n` +
        `Você recebeu uma nova solicitação de consulta.\n\n` +
        `*Paciente:* ${params.patientName}\n` +
        `*Data:* ${params.date}\n` +
        `*Horário:* ${params.time}\n\n` +
        `Acesse sua agenda para confirmar ou recusar:\n${params.dashboardUrl}`
      );

    case WA_EVENTS.BOOKING_CONFIRMED_PATIENT:
      return (
        `✅ *Consulta confirmada*\n\n` +
        `Olá, ${params.patientName}.\n\n` +
        `Sua consulta com ${params.therapistName} foi confirmada.\n\n` +
        `*Data:* ${params.date}\n` +
        `*Horário:* ${params.time}\n\n` +
        `Acesse seus agendamentos:\n${params.dashboardUrl}`
      );

    case WA_EVENTS.BOOKING_CONFIRMED_THERAPIST:
      return (
        `✅ *Consulta confirmada*\n\n` +
        `Olá, ${params.therapistName}.\n\n` +
        `A consulta com ${params.patientName} está confirmada.\n\n` +
        `*Data:* ${params.date}\n` +
        `*Horário:* ${params.time}\n\n` +
        `Acesse sua agenda:\n${params.dashboardUrl}`
      );

    case WA_EVENTS.BOOKING_REMINDER_PATIENT:
      return (
        `⏰ *Lembrete de consulta*\n\n` +
        `Olá, ${params.patientName}.\n\n` +
        `Sua consulta com ${params.therapistName} acontecerá em aproximadamente 24 horas.\n\n` +
        `*Data:* ${params.date}\n` +
        `*Horário:* ${params.time}\n\n` +
        `Confira seu agendamento:\n${params.dashboardUrl}`
      );

    case WA_EVENTS.BOOKING_REMINDER_THERAPIST:
      return (
        `⏰ *Lembrete de consulta*\n\n` +
        `Olá, ${params.therapistName}.\n\n` +
        `Sua consulta com ${params.patientName} acontecerá em aproximadamente 24 horas.\n\n` +
        `*Data:* ${params.date}\n` +
        `*Horário:* ${params.time}\n\n` +
        `Acesse sua agenda:\n${params.dashboardUrl}`
      );

    case WA_EVENTS.BOOKING_CANCELLED_THERAPIST:
      return (
        `❌ *Consulta cancelada*\n\n` +
        `A sua consulta com o paciente ${params.patientName} no dia ${params.date} às ${params.time} foi cancelada.\n\n` +
        `Acesse a plataforma:\n${params.dashboardUrl}`
      );

    case WA_EVENTS.BOOKING_CANCELLED_PATIENT:
      return (
        `❌ *Consulta cancelada*\n\n` +
        `Olá, ${params.patientName}. A sua consulta com ${params.therapistName} no dia ${params.date} às ${params.time} foi cancelada pelo terapeuta.\n\n` +
        `Acesse a plataforma para reagendar:\n${params.dashboardUrl}`
      );

    // Mantido por compatibilidade — não deve mais ser disparado pelo fluxo principal
    case WA_EVENTS.BOOKING_RECEIVED_PATIENT:
      return (
        `Olá, ${params.patientName}.\n\n` +
        `Recebemos sua solicitação de consulta com ${params.therapistName} para ${params.date} às ${params.time}.\n\n` +
        `Você receberá uma nova mensagem assim que o terapeuta confirmar.`
      );

    default:
      throw new Error(`Evento desconhecido: ${event}`);
  }
}

/** @deprecated Use getPlainText */
export const getEvolutionText = getPlainText;

/**
 * Mapeia o evento para o nome do template da Meta Cloud API e seus componentes de parâmetros
 */
export function getMetaTemplateConfig(event: WaEvent, params: TemplateParams) {
  switch (event) {
    case WA_EVENTS.BOOKING_REQUESTED_THERAPIST:
      return {
        templateName: process.env.META_TPL_REQUESTED_THERAPIST || 'nova_solicitacao_terapeuta',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: params.therapistName },
              { type: 'text', text: params.patientName },
              { type: 'text', text: params.date },
              { type: 'text', text: params.time },
            ],
          },
        ],
      };

    case WA_EVENTS.BOOKING_CONFIRMED_PATIENT:
      return {
        templateName: process.env.META_TPL_CONFIRMED_PATIENT || 'agendamento_confirmado_paciente',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: params.patientName },
              { type: 'text', text: params.therapistName },
              { type: 'text', text: params.date },
              { type: 'text', text: params.time },
            ],
          },
        ],
      };

    case WA_EVENTS.BOOKING_CONFIRMED_THERAPIST:
      return {
        templateName: process.env.META_TPL_CONFIRMED_THERAPIST || 'agendamento_confirmado_terapeuta',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: params.therapistName },
              { type: 'text', text: params.patientName },
              { type: 'text', text: params.date },
              { type: 'text', text: params.time },
            ],
          },
        ],
      };

    case WA_EVENTS.BOOKING_REMINDER_PATIENT:
      return {
        templateName: process.env.META_TPL_REMINDER_PATIENT || 'lembrete_consulta_paciente',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: params.patientName },
              { type: 'text', text: params.therapistName },
              { type: 'text', text: params.date },
              { type: 'text', text: params.time },
            ],
          },
        ],
      };

    case WA_EVENTS.BOOKING_REMINDER_THERAPIST:
      return {
        templateName: process.env.META_TPL_REMINDER_THERAPIST || 'lembrete_consulta_terapeuta',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: params.therapistName },
              { type: 'text', text: params.patientName },
              { type: 'text', text: params.date },
              { type: 'text', text: params.time },
            ],
          },
        ],
      };

    case WA_EVENTS.BOOKING_CANCELLED_THERAPIST:
      return {
        templateName: process.env.META_TPL_CANCELLED_THERAPIST || 'agendamento_cancelado_terapeuta',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: params.patientName },
              { type: 'text', text: params.date },
              { type: 'text', text: params.time },
            ],
          },
        ],
      };

    case WA_EVENTS.BOOKING_CANCELLED_PATIENT:
      return {
        templateName: process.env.META_TPL_CANCELLED_PATIENT || 'agendamento_cancelado_paciente',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: params.patientName },
              { type: 'text', text: params.therapistName },
              { type: 'text', text: params.date },
              { type: 'text', text: params.time },
            ],
          },
        ],
      };

    // Compatibilidade
    case WA_EVENTS.BOOKING_RECEIVED_PATIENT:
      return {
        templateName: process.env.META_TPL_RECEIVED_PATIENT || 'solicitacao_recebida_paciente',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: params.patientName },
              { type: 'text', text: params.therapistName },
              { type: 'text', text: params.date },
              { type: 'text', text: params.time },
            ],
          },
        ],
      };

    default:
      throw new Error(`Evento desconhecido: ${event}`);
  }
}
