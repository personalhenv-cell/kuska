import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartClient } from './CartClient'

export const metadata: Metadata = {
  title: 'Mi Carrito',
  description: 'Revisa los productos en tu carrito de compras',
}

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-kuska-cream pt-24">
        <CartClient />
      </main>
      <Footer />
    </>
  )
}
