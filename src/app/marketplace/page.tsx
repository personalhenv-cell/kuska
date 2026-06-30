import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MarketplaceClient } from './MarketplaceClient'

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Descubre miles de piezas artesanales peruanas únicas, hechas a mano por maestros verificados.',
}

export default function MarketplacePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-kuska-cream pt-24">
        <MarketplaceClient />
      </main>
      <Footer />
    </>
  )
}
