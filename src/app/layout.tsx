import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'EA Lumina — Marketplace de Terapias Holísticas',
    template: '%s | EA Lumina',
  },
  description: 'Encontre os melhores terapeutas holísticos e agende sua sessão online ou presencial.',
  keywords: ['terapia holística', 'reiki', 'yoga', 'meditação', 'bem-estar', 'terapeutas', 'EA Lumina'],
  authors: [{ name: 'EA Lumina Team' }],
  creator: 'EA Lumina Team',
  publisher: 'EA Lumina',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ealumina.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EA Lumina',
    description: 'Sua plataforma de saúde holística',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* viewport: width=device-width evita zoom; viewport-fit=cover expõe safe-area-inset-* */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '14px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              boxShadow: '0 8px 24px rgba(28,28,28,0.10)',
              background: '#ffffff',
              color: '#1C1C1C',
              border: '1px solid #E5E2DC',
            },
            success: { iconTheme: { primary: '#3A8D7B', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#e05252', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
