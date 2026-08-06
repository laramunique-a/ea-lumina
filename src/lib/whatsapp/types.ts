export interface SendTextInput {
  to: string;
  text: string;
}

export interface SendTemplateInput {
  to: string;
  templateName: string;
  languageCode?: string;
  components?: any[];
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: any;
}

export interface WhatsAppHealthResult {
  status: 'up' | 'down';
  provider: string;
  details?: any;
}

export interface WhatsAppProvider {
  sendText(input: SendTextInput): Promise<WhatsAppSendResult>;
  sendTemplate(input: SendTemplateInput): Promise<WhatsAppSendResult>;
  checkHealth(): Promise<WhatsAppHealthResult>;
}

// Eventos padronizados de agendamento
export const WA_EVENTS = {
  // Terapeuta recebe quando um novo agendamento é criado (após pagamento ou via pacote)
  BOOKING_REQUESTED_THERAPIST: 'BOOKING_REQUESTED_THERAPIST',
  // Paciente recebe quando o terapeuta confirma o agendamento
  BOOKING_CONFIRMED_PATIENT: 'BOOKING_CONFIRMED_PATIENT',
  // Terapeuta recebe quando o agendamento é confirmado
  BOOKING_CONFIRMED_THERAPIST: 'BOOKING_CONFIRMED_THERAPIST',
  // Paciente recebe lembrete ~24h antes
  BOOKING_REMINDER_PATIENT: 'BOOKING_REMINDER_PATIENT',
  // Terapeuta recebe lembrete ~24h antes
  BOOKING_REMINDER_THERAPIST: 'BOOKING_REMINDER_THERAPIST',
  // Terapeuta recebe quando paciente cancela
  BOOKING_CANCELLED_THERAPIST: 'BOOKING_CANCELLED_THERAPIST',
  // Paciente recebe quando terapeuta cancela
  BOOKING_CANCELLED_PATIENT: 'BOOKING_CANCELLED_PATIENT',
  // Mantido para compatibilidade — NÃO deve mais ser disparado
  BOOKING_RECEIVED_PATIENT: 'BOOKING_RECEIVED_PATIENT',
} as const;

export type WaEvent = typeof WA_EVENTS[keyof typeof WA_EVENTS];
