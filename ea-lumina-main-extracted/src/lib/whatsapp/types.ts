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
  BOOKING_REQUESTED_THERAPIST: 'BOOKING_REQUESTED_THERAPIST',
  BOOKING_RECEIVED_PATIENT: 'BOOKING_RECEIVED_PATIENT',
  BOOKING_CONFIRMED_PATIENT: 'BOOKING_CONFIRMED_PATIENT',
  BOOKING_CANCELLED_THERAPIST: 'BOOKING_CANCELLED_THERAPIST',
  BOOKING_CANCELLED_PATIENT: 'BOOKING_CANCELLED_PATIENT',
} as const;

export type WaEvent = typeof WA_EVENTS[keyof typeof WA_EVENTS];
