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
 * Gera o texto plano para a Evolution API.
 */
export function getEvolutionText(event: WaEvent, params: TemplateParams): string {
  switch (event) {
    case WA_EVENTS.BOOKING_REQUESTED_THERAPIST:
      return `📅 Nova solicitação de agendamento\n\nPaciente: ${params.patientName}${params.patientPhone ? `\nContato: ${params.patientPhone}` : ''}${params.therapyName ? `\nTerapia: ${params.therapyName}` : ''}\nData: ${params.date}\nHorário: ${params.time}\n\n⚠️ Acesse a plataforma para aceitar ou recusar o agendamento:\n${params.dashboardUrl}`;
    
    case WA_EVENTS.BOOKING_RECEIVED_PATIENT:
      return `Olá, ${params.patientName}.\n\nRecebemos sua solicitação de consulta com ${params.therapistName} para ${params.date} às ${params.time}.\n\nVocê receberá uma nova mensagem assim que o terapeuta confirmar.`;
    
    case WA_EVENTS.BOOKING_CONFIRMED_PATIENT:
      return `✅ Consulta confirmada\n\nOlá, ${params.patientName}.\n\nSua consulta com ${params.therapistName} está confirmada para ${params.date} às ${params.time}.\n\nGerencie seu agendamento:\n${params.dashboardUrl}`;
    
    case WA_EVENTS.BOOKING_CANCELLED_THERAPIST:
      return `❌ Consulta cancelada\n\nA sua consulta com o paciente ${params.patientName} no dia ${params.date} às ${params.time} foi cancelada.\n\nAcesse a plataforma:\n${params.dashboardUrl}`;
    
    case WA_EVENTS.BOOKING_CANCELLED_PATIENT:
      return `❌ Consulta cancelada\n\nOlá, ${params.patientName}. A sua consulta com ${params.therapistName} no dia ${params.date} às ${params.time} foi cancelada pelo terapeuta.\n\nAcesse a plataforma para reagendar:\n${params.dashboardUrl}`;
    
    default:
      throw new Error(`Evento desconhecido: ${event}`);
  }
}

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
              { type: 'text', text: params.patientName },
              { type: 'text', text: params.date },
              { type: 'text', text: params.time },
            ]
          }
        ]
      };
    
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
            ]
          }
        ]
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
            ]
          }
        ]
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
            ]
          }
        ]
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
            ]
          }
        ]
      };

    default:
      throw new Error(`Evento desconhecido: ${event}`);
  }
}
