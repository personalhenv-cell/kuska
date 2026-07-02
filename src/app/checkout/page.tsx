import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CheckoutClient } from './CheckoutClient'

export const metadata: Metadata = { title: 'Checkout — Kuska' }

interface CheckoutPageProps {
  searchParams: { producto?: string; cantidad?: string }
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/login?callbackUrl=/checkout?producto=${searchParams.producto ?? ''}`)
  }

  const slug = searchParams.producto
  if (!slug) redirect('/marketplace')

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { artisan: { include: { user: { select: { name: true } } } } },
  })
  if (!product || !product.is_available || product.stock < 1) {
    redirect('/marketplace')
  }

  const initialQty = Math.max(1, Math.min(product.stock, Number(searchParams.cantidad) || 1))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-kuska-cream pt-28 pb-16">
        <CheckoutClient
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            stock: product.stock,
            image: product.images[0] ?? null,
            region: product.region,
            technique: product.technique,
            artisanName: product.artisan.user.name,
          }}
          initialQty={initialQty}
        />
      </main>
      <Footer />
    </>
  )
}
