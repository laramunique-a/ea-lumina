import { WhatsAppProvider } from './types';
import { EvolutionWhatsAppProvider } from './providers/evolution';
import { MetaWhatsAppProvider } from './providers/meta';

export function getWhatsAppProvider(): WhatsAppProvider {
  const provider = process.env.WHATSAPP_PROVIDER;

  if (provider === 'evolution') {
    return new EvolutionWhatsAppProvider();
  }

  if (provider === 'meta') {
    return new MetaWhatsAppProvider();
  }

  throw new Error(`Configuração de WHATSAPP_PROVIDER inválida ou não definida: "${provider}". Use "evolution" ou "meta".`);
}
