/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Impede que páginas sejam exibidas em iframes (clickjacking)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Impede que o browser "adivinhe" o Content-Type do arquivo
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Controla informação enviada no Referrer ao navegar
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Protecção XSS legada (browsers mais antigos)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Restringe acesso a APIs de hardware e sensores desnecessárias
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // HSTS (Strict-Transport-Security) para forçar HTTPS
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Content Security Policy — permite: próprio domínio, Supabase, Stripe, Meta/WhatsApp
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://ui-avatars.com https://image.pollinations.ai",
      "media-src 'self' blob: https://*.supabase.co",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://graph.facebook.com",
    ].join('; '),
  },
]

const nextConfig = {
  async headers() {
    return [
      {
        // Aplicar headers de segurança em todas as rotas
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // Não definir DATABASE_URL/DIRECT_URL aqui: no build da Vercel elas podem estar vazias
  // e sobrescrever o runtime. O Prisma lê process.env em tempo de execução.
}

module.exports = nextConfig
