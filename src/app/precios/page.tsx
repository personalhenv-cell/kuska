import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PreciosClient } from './PreciosClient'

export const metadata: Metadata = {
  title: 'Membresías — Kuska',
  description:
    'Planes para artesanos y clientes: empieza gratis y crece con herramientas de IA, academia y fondos de capitalización.',
}

export default function PreciosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-kuska-cream pt-32 pb-20">
        <PreciosClient />
      </main>
      <Footer />
    </>
  )
}
