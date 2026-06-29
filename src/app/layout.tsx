import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Kuska — Plataforma Artesanal Peruana',
    template: '%s | Kuska',
  },
  description: 'Primera plataforma nacional de innovación artesanal del Perú. Conectamos historias, cultura y oportunidades.',
  keywords: ['artesanía peruana', 'artesanos Perú', 'marketplace cultural', 'kuska'],
  openGraph: {
    title: 'Kuska — Plataforma Artesanal Peruana',
    description: 'Conectamos historias, cultura y oportunidades.',
    type: 'website',
    locale: 'es_PE',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F0E8',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`scroll-smooth ${playfair.variable} ${inter.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
