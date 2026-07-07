import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Integrations } from '@/components/Integrations'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const siteUrl = 'https://kuska-cyan.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kuska — Innovación Artesanal del Perú',
    template: '%s · Kuska',
  },
  description:
    'La primera plataforma nacional de innovación artesanal del Perú. ' +
    'Conectamos las manos que crean mundos con quienes valoran el arte con alma andina.',
  keywords: [
    'artesanía peruana',
    'marketplace artesanal',
    'arte andino',
    'Kuska',
    'Perú',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: siteUrl,
    siteName: 'Kuska',
    title: 'Kuska — Innovación Artesanal del Perú',
    description:
      'Conectamos artesanos peruanos con el mundo. Arte con alma andina.',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Kuska' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuska — Innovación Artesanal del Perú',
    description: 'Arte con alma andina, conectado al mundo.',
    images: ['/logo.png'],
  },
  icons: { icon: '/logo.png' },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#3D1C02',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} ${nunito.variable}`}
    >
      <body>
        <Providers>
          {children}
          <Integrations />
        </Providers>
      </body>
    </html>
  )
}
