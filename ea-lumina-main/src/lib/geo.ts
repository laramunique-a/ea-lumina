import { NextRequest } from 'next/server'

/**
 * Obtém o código ISO 3166-1 alpha-2 do país de origem da requisição (ex: 'BR', 'PT', 'UY', 'US').
 * Utiliza os cabeçalhos de geolocalização injetados pela infraestrutura Vercel / Cloudflare.
 */
export function getCountryFromRequest(request: NextRequest): string | null {
  const vercelCountry = request.headers.get('x-vercel-ip-country')
  if (vercelCountry && vercelCountry.length === 2) {
    return vercelCountry.toUpperCase()
  }

  const cfCountry = request.headers.get('cf-ipcountry')
  if (cfCountry && cfCountry.length === 2 && cfCountry.toUpperCase() !== 'XX') {
    return cfCountry.toUpperCase()
  }

  return null
}
