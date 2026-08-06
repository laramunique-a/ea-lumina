import {
  WhatsAppProvider,
  SendTextInput,
  SendTemplateInput,
  WhatsAppSendResult,
  WhatsAppHealthResult,
} from '../types';

/**
 * Mascara o número exibindo apenas os últimos 4 dígitos para logs seguros.
 */
function maskPhone(phone: string): string {
  if (phone.length <= 4) return '****';
  return `****${phone.slice(-4)}`;
}

export class ZApiWhatsAppProvider implements WhatsAppProvider {
  private baseUrl: string;
  private instanceId: string;
  private instanceToken: string;
  private clientToken: string;

  constructor() {
    this.baseUrl = (process.env.ZAPI_BASE_URL || 'https://api.z-api.io').replace(/\/$/, '');
    this.instanceId = process.env.ZAPI_INSTANCE_ID || '';
    this.instanceToken = process.env.ZAPI_INSTANCE_TOKEN || '';
    this.clientToken = process.env.ZAPI_CLIENT_TOKEN || '';
  }

  private validateConfig(): void {
    if (!this.instanceId || !this.instanceToken || !this.clientToken) {
      throw new Error(
        'Configuração incompleta para Z-API (ZAPI_INSTANCE_ID, ZAPI_INSTANCE_TOKEN, ZAPI_CLIENT_TOKEN)'
      );
    }
  }

  private getEndpointBase(): string {
    return `${this.baseUrl}/instances/${this.instanceId}/token/${this.instanceToken}`;
  }

  async sendText(input: SendTextInput): Promise<WhatsAppSendResult> {
    try {
      this.validateConfig();

      const url = `${this.getEndpointBase()}/send-text`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response: Response;
      let data: any;

      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Client-Token': this.clientToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: input.to,
            message: input.text,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        const isTimeout = fetchErr.name === 'AbortError';
        console.error(
          `[ZApi] Erro de rede ao enviar para ${maskPhone(input.to)}: ${isTimeout ? 'Timeout (10s)' : fetchErr.message}`
        );
        return {
          success: false,
          error: isTimeout ? 'Timeout ao conectar com Z-API (10s)' : fetchErr.message,
        };
      }

      // Leitura segura do JSON
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        const errMsg = data?.message || data?.error || `HTTP ${response.status} da Z-API`;
        console.error(`[ZApi] Falha no envio para ${maskPhone(input.to)}: ${errMsg}`);
        return { success: false, error: errMsg };
      }

      // Captura messageId em ordem de prioridade
      const messageId: string | undefined =
        data?.messageId ?? data?.zaapId ?? data?.id ?? undefined;

      console.log(`[ZApi] Mensagem enviada para ${maskPhone(input.to)}. MessageId: ${messageId ?? 'n/a'}`);
      return { success: true, messageId };
    } catch (err: any) {
      // Nunca expõe credenciais
      console.error(`[ZApi] Erro inesperado em sendText: ${err.message}`);
      return { success: false, error: err.message || 'Erro interno no provider Z-API' };
    }
  }

  /**
   * Z-API usa mensagens de texto livres, não templates da Meta.
   * Este método existe apenas para satisfazer a interface — nunca é chamado pelo fluxo Z-API.
   */
  async sendTemplate(_input: SendTemplateInput): Promise<WhatsAppSendResult> {
    return {
      success: false,
      error:
        'O provider Z-API desta integração não utiliza templates estruturados. Use sendText.',
    };
  }

  async checkHealth(): Promise<WhatsAppHealthResult> {
    try {
      this.validateConfig();

      const url = `${this.getEndpointBase()}/status`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      let response: Response;
      let data: any;

      try {
        response = await fetch(url, {
          method: 'GET',
          headers: { 'Client-Token': this.clientToken },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        return {
          status: 'down',
          provider: 'zapi',
          details: fetchErr.name === 'AbortError' ? 'Timeout no health check' : fetchErr.message,
        };
      }

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // Considera operacional apenas se response.ok E connected === true
      const isConnected = response.ok && data?.connected === true;

      return {
        status: isConnected ? 'up' : 'down',
        provider: 'zapi',
        details: {
          httpStatus: response.status,
          connected: data?.connected ?? false,
          phone: data?.phone ? maskPhone(String(data.phone)) : undefined,
        },
      };
    } catch (err: any) {
      return { status: 'down', provider: 'zapi', details: err.message };
    }
  }
}
