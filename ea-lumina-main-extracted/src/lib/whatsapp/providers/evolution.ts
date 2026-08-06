import { WhatsAppProvider, SendTextInput, SendTemplateInput, WhatsAppSendResult, WhatsAppHealthResult } from '../types';

export class EvolutionWhatsAppProvider implements WhatsAppProvider {
  private baseUrl: string;
  private apiKey: string;
  private instance: string;

  constructor() {
    this.baseUrl = (process.env.EVOLUTION_API_URL || '').replace(/\/$/, '');
    this.apiKey = process.env.EVOLUTION_API_KEY || '';
    this.instance = process.env.EVOLUTION_API_INSTANCE || '';
  }

  private validateConfig() {
    if (!this.baseUrl || !this.apiKey || !this.instance) {
      throw new Error('Configuração incompleta para Evolution API (EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_API_INSTANCE)');
    }
  }

  async sendText(input: SendTextInput): Promise<WhatsAppSendResult> {
    this.validateConfig();

    const url = `${this.baseUrl}/message/sendText/${this.instance}`;
    
    // Evolution API geralmente recebe o telefone com @s.whatsapp.net ou apenas o número (dependendo da versão)
    // Usaremos apenas o número, pois a API costuma tratar internamente, mas vamos adicionar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey
        },
        body: JSON.stringify({
          number: input.to,
          text: input.text
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data?.message || data?.error || `HTTP ${response.status} - Erro Evolution API`
        };
      }

      // O ID da mensagem geralmente vem em data.key.id ou similar na resposta da Evolution
      const messageId = data?.key?.id || data?.messageId || undefined;

      return {
        success: true,
        messageId
      };

    } catch (error: any) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: error.name === 'AbortError' ? 'Timeout ao conectar com Evolution API' : error.message
      };
    }
  }

  async sendTemplate(input: SendTemplateInput): Promise<WhatsAppSendResult> {
    // Evolution tipicamente não usa Templates rígidos como a Meta (apenas para conexões oficiais no Baileys, o que é raro em instâncias normais)
    // Para simplificar, o Provider Evolution pode falhar se pedirem Template explícito, ou tentar mandar como texto se for configurado
    throw new Error('Templates não são suportados nativamente pelo provedor Evolution na configuração atual. Use sendText.');
  }

  async checkHealth(): Promise<WhatsAppHealthResult> {
    try {
      this.validateConfig();
      const url = `${this.baseUrl}/instance/connectionState/${this.instance}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': this.apiKey
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return { status: 'down', provider: 'evolution', details: 'Status HTTP inválido' };
      }
      
      const data = await response.json();
      const isUp = data?.instance?.state === 'open' || data?.state === 'open';
      
      return {
        status: isUp ? 'up' : 'down',
        provider: 'evolution',
        details: data
      };
    } catch (error: any) {
      return { status: 'down', provider: 'evolution', details: error.message };
    }
  }
}
