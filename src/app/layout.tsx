import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Kuska — Plataforma Artesanal Peruana',
    template: '%s | Kuska',
  },
  description: 'Primera plataforma nacional de innovación artesanal del Perú.',
  keywords: ['artesanía peruana', 'artesanos Peru', 'marketplace cultural'],
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
  themeColor: '#3D1C02',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}
