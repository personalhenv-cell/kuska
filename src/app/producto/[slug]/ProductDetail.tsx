'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ProductDetail } from '@/types/marketplace'

function StarDisplay({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < Math.round(value) ? 'text-kuska-gold fill-current' : 'text-kuska-cream-dark fill-current'}`}
            viewBox="0 0 20 20"
            aria-hidden
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="font-body text-sm text-kuska-text-mid">
        {value.toFixed(1)} · {count} reseñas
      </span>
    </div>
  )
}

function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-glass bg-kuska-cream-dark text-6xl">
        🏺
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-glass bg-kuska-cream-dark">
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${active === i ? 'border-kuska-gold' : 'border-transparent'}`}
            >
              <Image src={img} alt={`Vista ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ImpactCard({ region }: { region: string }) {
  return (
    <div className="liquid-glass-gold rounded-card p-4">
      <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
        Impacto de tu compra
      </p>
      <ul className="mt-2 space-y-1.5 font-body text-sm text-kuska-text">
        <li className="flex items-center gap-2">
          <span className="text-kuska-teal">✓</span> Apoya directamente a una familia artesana en {region}
        </li>
        <li className="flex items-center gap-2">
          <span className="text-kuska-teal">✓</span> 5% de tu compra va al Fondo Solidario Kuska
        </li>
        <li className="flex items-center gap-2">
          <span className="text-kuska-teal">✓</span> Preservas una técnica ancestral
        </li>
      </ul>
    </div>
  )
}

interface ProductDetailClientProps {
  product: ProductDetail
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { data: session } = useSession()
  const isOwnProduct = session?.user.id === product.artisan.user.id
  const chatHref = !session
    ? `/login?callbackUrl=/producto/${product.slug}`
    : `/dashboard/cliente/mensajes?with=${product.artisan.user.id}`

  const waLink = product.artisan.whatsapp
    ? `https://wa.me/${product.artisan.whatsapp}?text=Hola, vi tu ${encodeURIComponent(product.name)} en Kuska y me interesa.`
    : null

  const shareText = encodeURIComponent(`¡Mira esta pieza artesanal peruana única: ${product.name} por ${product.artisan.user.name}!`)
  const shareUrl = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')
  const waShareLink = `https://wa.me/?text=${shareText}%20${shareUrl}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 font-body text-sm text-kuska-text-mid" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-kuska-red">Inicio</Link>
        <span>/</span>
        <Link href="/marketplace" className="hover:text-kuska-red">Marketplace</Link>
        <span>/</span>
        <span className="text-kuska-text">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Galería */}
        <ImageGallery images={product.images} name={product.name} />

        {/* Info */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="technique">{product.technique}</Badge>
            <Badge variant="region">{product.region}</Badge>
            {product.artisan.is_verified && <Badge variant="verified">✓ Artesano verificado</Badge>}
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight text-kuska-text sm:text-4xl">
            {product.name}
          </h1>

          <div className="flex items-center gap-4">
            <StarDisplay value={product.rating} count={product.reviews.length} />
            <span className="font-body text-sm text-kuska-text-mid">
              {product.views} visitas
            </span>
          </div>

          <p className="font-display text-4xl font-bold text-kuska-text">
            {formatPrice(product.price)}
          </p>

          <p className="font-body leading-relaxed text-kuska-text-mid">
            {product.description}
          </p>

          {product.materials.length > 0 && (
            <div>
              <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
                Materiales
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {product.materials.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-kuska-border bg-white px-3 py-1 font-body text-xs text-kuska-text"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/checkout?producto=${product.slug}`} className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
                Comprar ahora
              </Button>
            </Link>
          </div>

          {!isOwnProduct && (
            <Link
              href={chatHref}
              className="flex items-center gap-2 rounded-btn border border-kuska-teal/30 bg-kuska-teal/10 px-4 py-3 font-body text-sm font-semibold text-kuska-teal transition-all hover:bg-kuska-teal/15"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.05-3.15A7.95 7.95 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Chatear con {product.artisan.user.name.split(' ')[0]} en Kuska
            </Link>
          )}

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-btn border border-green-500/30 bg-green-50 px-4 py-3 font-body text-sm font-semibold text-green-700 transition-all hover:bg-green-100"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contactar al artesano por WhatsApp
            </a>
          )}

          <ImpactCard region={product.region} />

          {/* Compartir */}
          <div>
            <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
              Compartir
            </p>
            <div className="mt-2 flex gap-3">
              <a
                href={waShareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-btn border border-kuska-border bg-white px-3 py-2 font-body text-xs font-semibold text-kuska-text hover:bg-kuska-cream-dark"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-btn border border-kuska-border bg-white px-3 py-2 font-body text-xs font-semibold text-kuska-text hover:bg-kuska-cream-dark"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Historia del artesano */}
      <section className="mt-16 rounded-glass border border-kuska-border bg-white p-8">
        <h2 className="font-display text-2xl font-bold text-kuska-text">
          Sobre el artesano
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-[auto_1fr]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-kuska-cream-dark text-3xl">
            {product.artisan.user.avatar_url ? (
              <Image
                src={product.artisan.user.avatar_url}
                alt={product.artisan.user.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              '🧑‍🎨'
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl font-semibold text-kuska-text">
                {product.artisan.user.name}
              </h3>
              {product.artisan.is_verified && <Badge variant="verified">✓ Verificado</Badge>}
            </div>
            <p className="mt-0.5 font-body text-sm text-kuska-text-mid">
              📍 {product.artisan.region} · {product.artisan.technique} ·{' '}
              {product.artisan.years_experience} años de experiencia
            </p>
            {product.artisan.story && (
              <p className="mt-3 font-body leading-relaxed text-kuska-text-mid">
                {product.artisan.story}
              </p>
            )}
            <p className="mt-2 font-body text-sm text-kuska-text-mid">
              ⭐ {product.artisan.rating.toFixed(1)} de calificación ·{' '}
              {product.artisan.total_sales} ventas
            </p>
          </div>
        </div>
      </section>

      {/* Reseñas */}
      {product.reviews.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-kuska-text">
            Reseñas verificadas
          </h2>
          <div className="mt-6 space-y-4">
            {product.reviews.map((r) => (
              <article key={r.id} className="rounded-card border border-kuska-border bg-white p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-body font-semibold text-kuska-text">
                      {r.reviewer.name}
                    </p>
                    <div className="mt-0.5 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < r.rating ? 'text-kuska-gold fill-current' : 'text-kuska-cream-dark fill-current'}`}
                          viewBox="0 0 20 20"
                          aria-hidden
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {r.is_verified && (
                      <Badge variant="verified">Compra verificada</Badge>
                    )}
                    <span className="font-body text-xs text-kuska-text-mid">
                      {new Date(r.created_at).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                </div>
                <p className="mt-3 font-body text-kuska-text-mid">{r.comment}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
