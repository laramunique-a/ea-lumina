import { WhatsAppProvider, SendTextInput, SendTemplateInput, WhatsAppSendResult, WhatsAppHealthResult } from '../types';

export class MetaWhatsAppProvider implements WhatsAppProvider {
  private accessToken: string;
  private phoneNumberId: string;
  private apiVersion: string;

  constructor() {
    this.accessToken = process.env.META_WA_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.META_WA_PHONE_NUMBER_ID || '';
    this.apiVersion = process.env.META_GRAPH_API_VERSION || 'v21.0';
  }

  private validateConfig() {
    if (!this.accessToken || !this.phoneNumberId) {
      throw new Error('Configuração incompleta para Meta Cloud API (META_WA_ACCESS_TOKEN, META_WA_PHONE_NUMBER_ID)');
    }
  }

  private getUrl() {
    return `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
  }

  async sendText(input: SendTextInput): Promise<WhatsAppSendResult> {
    this.validateConfig();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: input.to,
      type: 'text',
      text: { body: input.text },
    };

    try {
      const response = await fetch(this.getUrl(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data?.error?.message || `HTTP ${response.status} - Erro Meta API`
        };
      }

      const messageId = data?.messages?.[0]?.id;

      return {
        success: true,
        messageId
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: error.name === 'AbortError' ? 'Timeout ao conectar com Meta API' : error.message
      };
    }
  }

  async sendTemplate(input: SendTemplateInput): Promise<WhatsAppSendResult> {
    this.validateConfig();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const body = {
      messaging_product: 'whatsapp',
      to: input.to,
      type: 'template',
      template: {
        name: input.templateName,
        language: {
          code: input.languageCode || 'pt_BR',
        },
        components: input.components || [],
      },
    };

    try {
      const response = await fetch(this.getUrl(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data?.error?.message || `HTTP ${response.status} - Erro Meta API Template`
        };
      }

      const messageId = data?.messages?.[0]?.id;

      return {
        success: true,
        messageId
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: error.name === 'AbortError' ? 'Timeout ao conectar com Meta API Template' : error.message
      };
    }
  }

  async checkHealth(): Promise<WhatsAppHealthResult> {
    try {
      this.validateConfig();
      // Podemos verificar chamando um endpoint de business profile, mas a forma mais simples 
      // é verificar se o token consegue acessar a conta (requer business_account_id)
      const wabaId = process.env.META_WA_BUSINESS_ACCOUNT_ID;
      
      if (!wabaId) {
        return { status: 'up', provider: 'meta', details: 'Falta META_WA_BUSINESS_ACCOUNT_ID para checagem completa' };
      }

      const url = `https://graph.facebook.com/${this.apiVersion}/${wabaId}?fields=id,name`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return { status: 'down', provider: 'meta', details: 'Não autorizado ou WABA ID inválido' };
      }
      
      return { status: 'up', provider: 'meta' };
    } catch (error: any) {
      return { status: 'down', provider: 'meta', details: error.message };
    }
  }
}
