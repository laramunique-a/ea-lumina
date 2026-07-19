/**
 * Evolution API Service for WhatsApp notifications
 */

export class EvolutionApiService {
  private static getCredentials() {
    const url = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_API_INSTANCE;

    if (!url || !apiKey || !instance) {
      console.warn('[Evolution API] Configuração ausente: EVOLUTION_API_URL, EVOLUTION_API_KEY ou EVOLUTION_API_INSTANCE.');
      return null;
    }

    return { url, apiKey, instance };
  }

  /**
   * Sanitizes a phone number for the Evolution API format.
   * Standard format is the country code followed by area code and number.
   * e.g., 5511999999999
   */
  public static sanitizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  /**
   * Validates if the WhatsApp instance connection is active.
   */
  public static async validateConnection(): Promise<boolean> {
    const credentials = this.getCredentials();
    if (!credentials) return false;

    const { url, apiKey, instance } = credentials;
    const requestUrl = `${url.replace(/\/$/, '')}/instance/connectionState/${instance}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'apikey': apiKey,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[Evolution API] Falha na validação da conexão: HTTP ${response.status}`);
        return false;
      }

      const data = await response.json();
      const isConnected = data.instance?.state === 'open' || data.state === 'open';
      
      if (!isConnected) {
        console.warn(`[Evolution API] Instância '${instance}' não está conectada (state: ${data.instance?.state || data.state}).`);
      } else {
        console.log(`[Evolution API] Conexão com instância '${instance}' validada com sucesso.`);
      }

      return isConnected;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('[Evolution API] Timeout ao validar conexão com a API.');
      } else {
        console.error('[Evolution API] Erro ao validar conexão:', error);
      }
      return false;
    }
  }

  /**
   * Sends a plain text message to a specific number using Evolution API.
   */
  public static async sendMessage(to: string, text: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const credentials = this.getCredentials();
    if (!credentials) {
      return { success: false, error: 'Variáveis de ambiente da Evolution API não configuradas.' };
    }

    const { url, apiKey, instance } = credentials;
    const requestUrl = `${url.replace(/\/$/, '')}/message/sendText/${instance}`;
    const cleanNumber = this.sanitizePhone(to);

    if (!cleanNumber) {
      return { success: false, error: 'Número de telefone inválido ou vazio.' };
    }

    // Evolution API expects standard format
    const body = {
      number: cleanNumber,
      text: text,
      options: {
        delay: 1200,
        presence: 'composing',
        linkPreview: true,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      console.log(`[Evolution API] Enviando notificação WhatsApp para: ${cleanNumber}...`);

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        console.error('[Evolution API] Erro retornado pela API:', data);
        return { 
          success: false, 
          error: `Erro HTTP ${response.status}: ${data.message || JSON.stringify(data)}` 
        };
      }

      console.log(`[Evolution API] Notificação enviada com sucesso para ${cleanNumber}. Response ID:`, data.key?.id || data.id);
      return { success: true, data };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error(`[Evolution API] Timeout ao enviar mensagem para ${cleanNumber}.`);
        return { success: false, error: 'Timeout na requisição de envio.' };
      }
      console.error(`[Evolution API] Falha de conexão ao enviar mensagem para ${cleanNumber}:`, error);
      return { success: false, error: error.message || String(error) };
    }
  }
}
