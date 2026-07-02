import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductDetailClient } from './ProductDetail'
import type { ProductDetail } from '@/types/marketplace'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      description: true,
      images: true,
      seo_title: true,
      seo_description: true,
    },
  })
  if (!product) return {}

  return {
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? product.description.slice(0, 160),
    openGraph: {
      images: product.images.length > 0 ? [product.images[0]] : ['/logo.png'],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const raw = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      artisan: {
        include: {
          user: { select: { id: true, name: true, avatar_url: true, phone: true } },
        },
      },
      reviews: {
        include: { reviewer: { select: { name: true, avatar_url: true } } },
        orderBy: { created_at: 'desc' },
        take: 20,
      },
      _count: { select: { favorites: true, reviews: true } },
    },
  })

  if (!raw) notFound()

  // Incrementar vistas de forma no bloqueante
  prisma.product.update({ where: { id: raw.id }, data: { views: { increment: 1 } } }).catch(() => null)

  // Mapeo a tipo del cliente (fechas → strings)
  const product: ProductDetail = {
    ...raw,
    artisan: {
      ...raw.artisan,
      user: {
        id: raw.artisan.user.id,
        name: raw.artisan.user.name,
        avatar_url: raw.artisan.user.avatar_url,
        phone: raw.artisan.user.phone ?? null,
      },
    },
    reviews: raw.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      is_verified: r.is_verified,
      created_at: r.created_at.toISOString(),
      reviewer: r.reviewer,
    })),
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-kuska-cream pt-24">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  )
}
