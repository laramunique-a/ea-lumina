/**
 * Determina o tipo de conta Stripe com base no país do terapeuta.
 *
 * Regra: EA Lumina é baseada no Brasil (BR).
 * Cross-border payouts via Express só funciona para plataformas em: US, UK, EEA, CA, CH.
 * Logo, terapeutas fora do Brasil DEVEM usar Standard accounts.
 */
export function getStripeAccountType(
  country: string | null | undefined
): 'express' | 'standard' {
  if (!country) return 'express' // sem país = assume Brasil
  const raw = country.trim().toLowerCase()
  const isBrazil = raw === 'brasil' || raw === 'brazil' || raw === 'br'
  return isBrazil ? 'express' : 'standard'
}

/**
 * Normaliza o país para código ISO 3166-1 Alpha-2 (ex: "Portugal" → "PT").
 */
export function normalizeCountryCode(
  country: string | null | undefined
): string {
  if (!country) return 'BR'
  const raw = country.trim().toLowerCase()
  const map: Record<string, string> = {
    brasil: 'BR', brazil: 'BR', br: 'BR',
    portugal: 'PT', pt: 'PT',
    uruguai: 'UY', uruguay: 'UY', uy: 'UY',
    argentina: 'AR', ar: 'AR',
    espanha: 'ES', spain: 'ES', es: 'ES',
    'estados unidos': 'US', usa: 'US', us: 'US',
    colombia: 'CO', co: 'CO',
    chile: 'CL', cl: 'CL',
    mexico: 'MX', méxico: 'MX', mx: 'MX',
  }
  return map[raw] ?? (raw.length === 2 ? raw.toUpperCase() : 'BR')
}

/**
 * Retorna a moeda padrão (ISO 4217) para um dado país.
 * Usada para determinar a currency do PaymentIntent.
 */
export function getDefaultCurrencyForCountry(
  country: string | null | undefined
): string {
  const code = normalizeCountryCode(country)
  const currencyMap: Record<string, string> = {
    BR: 'brl',
    PT: 'eur',
    ES: 'eur',
    UY: 'uyu',
    AR: 'ars',
    CO: 'cop',
    CL: 'clp',
    MX: 'mxn',
    US: 'usd',
  }
  return currencyMap[code] ?? 'brl'
}
