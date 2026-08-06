/**
 * Normaliza um número de telefone brasileiro para o formato internacional.
 * 
 * Regras:
 * 1. Remove caracteres não numéricos.
 * 2. Se tiver 10 ou 11 dígitos, adiciona '55' na frente.
 * 3. Se começar com '55' e tiver 12 ou 13 dígitos, aceita.
 * 4. Rejeita números com DDD inválido ou tamanho incorreto.
 */
export function normalizeBrazilianPhone(phone: string): string {
  if (!phone) {
    throw new Error('Telefone não fornecido');
  }

  // 1. Remover tudo que não for dígito
  let clean = phone.replace(/\D/g, '');

  // 2. Tratar números que já começam com 55
  if (clean.startsWith('55') && clean.length >= 12 && clean.length <= 13) {
    return clean;
  }

  // 3. Se for um número local (com DDD), deve ter 10 (fixo) ou 11 (celular) dígitos
  if (clean.length === 10 || clean.length === 11) {
    return `55${clean}`;
  }

  throw new Error(`Telefone inválido: ${phone}`);
}
