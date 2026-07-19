/**
 * Meta WhatsApp Cloud API Service
 * Documentação: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

interface SendTemplateParams {
  to: string;
  templateName: string;
  languageCode?: string;
  components?: any[];
}

/**
 * Envia uma mensagem baseada em Template (exigência da Meta para iniciar conversas)
 */
export async function sendMetaTemplateMessage({
  to,
  templateName,
  languageCode = 'pt_BR',
  components = []
}: SendTemplateParams) {
  const token = process.env.META_WA_ACCESS_TOKEN;
  const phoneId = process.env.META_WA_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    console.error('[WhatsApp] META_WA_ACCESS_TOKEN ou META_WA_PHONE_NUMBER_ID não configurados.');
    return { success: false, error: 'Configuração ausente' };
  }

  // Remove caracteres não numéricos e garante formato internacional
  const cleanPhone = to.replace(/\D/g, '');
  
  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;

  const body = {
    messaging_product: 'whatsapp',
    to: cleanPhone,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components: components,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[WhatsApp] Erro Meta API:', data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[WhatsApp] Erro de rede/servidor:', error);
    return { success: false, error };
  }
}

/**
 * Envia uma mensagem de texto simples (só funciona se o usuário tiver respondido nas últimas 24h)
 */
export async function sendMetaTextMessage(to: string, message: string) {
  const token = process.env.META_WA_ACCESS_TOKEN;
  const phoneId = process.env.META_WA_PHONE_NUMBER_ID;

  if (!token || !phoneId) return { success: false };

  const cleanPhone = to.replace(/\D/g, '');
  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;

  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanPhone,
    type: 'text',
    text: { body: message },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return await response.json();
  } catch (error) {
    console.error('[WhatsApp] Erro ao enviar texto:', error);
    return { success: false };
  }
}
