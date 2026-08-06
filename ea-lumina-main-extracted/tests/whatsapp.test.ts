import { normalizeBrazilianPhone } from '../src/lib/whatsapp/phone';
import { getWhatsAppProvider } from '../src/lib/whatsapp/factory';
import { EvolutionWhatsAppProvider } from '../src/lib/whatsapp/providers/evolution';
import { MetaWhatsAppProvider } from '../src/lib/whatsapp/providers/meta';

describe('WhatsApp Integration', () => {
  describe('normalizeBrazilianPhone', () => {
    it('should format 11 digit mobile numbers correctly by prepending 55', () => {
      expect(normalizeBrazilianPhone('11999998888')).toBe('5511999998888');
    });

    it('should format 10 digit landline numbers correctly by prepending 55', () => {
      expect(normalizeBrazilianPhone('1133334444')).toBe('551133334444');
    });

    it('should keep the number if it already has 55 (13 digits)', () => {
      expect(normalizeBrazilianPhone('5511999998888')).toBe('5511999998888');
    });

    it('should remove formatting characters and keep only digits', () => {
      expect(normalizeBrazilianPhone('+55 (11) 99999-8888')).toBe('5511999998888');
    });

    it('should throw error on invalid length', () => {
      expect(() => normalizeBrazilianPhone('123')).toThrow('Telefone inválido: 123');
    });
  });

  describe('Factory getWhatsAppProvider', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should return EvolutionWhatsAppProvider when provider is evolution', () => {
      process.env.WHATSAPP_PROVIDER = 'evolution';
      const provider = getWhatsAppProvider();
      expect(provider).toBeInstanceOf(EvolutionWhatsAppProvider);
    });

    it('should return MetaWhatsAppProvider when provider is meta', () => {
      process.env.WHATSAPP_PROVIDER = 'meta';
      const provider = getWhatsAppProvider();
      expect(provider).toBeInstanceOf(MetaWhatsAppProvider);
    });

    it('should throw error for unknown provider', () => {
      process.env.WHATSAPP_PROVIDER = 'unknown';
      expect(() => getWhatsAppProvider()).toThrow('Configuração de WHATSAPP_PROVIDER inválida ou não definida');
    });
  });
});
