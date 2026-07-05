import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatPrice } from '@/lib/utils'

interface PageProps {
  params: { id: string }
}

async function getArtisan(id: string) {
  return prisma.artisanProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, avatar_url: true } },
      products: {
        where: { is_available: true },
        orderBy: { created_at: 'desc' },
        take: 12,
      },
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const artisan = await getArtisan(params.id)
  if (!artisan) return {}
  return {
    title: `${artisan.user.name} — Raíces Kuska`,
    description: artisan.story?.slice(0, 160) ?? `${artisan.specialty} de ${artisan.region}, Perú.`,
  }
}

export default async function ArtisanRaicesPage({ params }: PageProps) {
  const artisan = await getArtisan(params.id)
  if (!artisan) notFound()

  return (
    <div className="min-h-screen bg-kuska-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-28 pb-12 sm:pt-32">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-kuska-gold bg-white">
            {artisan.user.avatar_url ? (
              <Image src={artisan.user.avatar_url} alt={artisan.user.name} width={80} height={80} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-kuska-brown">
                {artisan.user.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-kuska-text">{artisan.user.name}</h1>
            <p className="font-body text-kuska-text-mid">
              {artisan.specialty} · {artisan.technique} · {artisan.community}, {artisan.region}
            </p>
            {artisan.is_verified && (
              <span className="mt-1 inline-block rounded-full bg-kuska-teal/15 px-2.5 py-0.5 font-nunito text-xs font-bold uppercase text-kuska-teal">
                Verificado ✓
              </span>
            )}
          </div>
        </div>

        {artisan.story && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold text-kuska-text">Su historia</h2>
            <p className="mt-3 whitespace-pre-line font-body leading-relaxed text-kuska-text">{artisan.story}</p>
          </section>
        )}

        {artisan.story_audio_url && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold text-kuska-text">Escucha su historia</h2>
            <audio controls src={artisan.story_audio_url} className="mt-3 w-full" />
          </section>
        )}

        {artisan.genealogy && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold text-kuska-text">Legado familiar</h2>
            <p className="mt-3 whitespace-pre-line font-body leading-relaxed text-kuska-text">{artisan.genealogy}</p>
          </section>
        )}

        {artisan.workshop_photos.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold text-kuska-text">Galería del taller</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {artisan.workshop_photos.map((url) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-card">
                  <Image src={url} alt="Foto del taller" fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {artisan.products.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold text-kuska-text">Sus piezas</h2>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {artisan.products.map((p) => (
                <Link key={p.id} href={`/producto/${p.slug}`} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-card bg-white">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover transition-transform group-hover:scale-105" />
                    )}
                  </div>
                  <p className="mt-1.5 font-body text-sm font-semibold text-kuska-text">{p.name}</p>
                  <p className="font-body text-sm text-kuska-text-mid">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
