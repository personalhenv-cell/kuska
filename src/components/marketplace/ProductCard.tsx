'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { cn, formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { TiltCard } from '@/components/ui/TiltCard'
import { useCart } from '@/contexts/CartContext'
import type { ProductListItem } from '@/types/marketplace'

interface ProductCardProps {
  product: ProductListItem
  initialFavorited?: boolean
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn('h-3.5 w-3.5', i < Math.round(value) ? 'text-kuska-gold' : 'text-kuska-cream-dark')}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 font-nunito text-xs text-kuska-text-mid">
        {value.toFixed(1)}
      </span>
    </span>
  )
}

export function ProductCard({ product, initialFavorited = false }: ProductCardProps) {
  const { data: session } = useSession()
  const { addItem } = useCart()
  const [favorited, setFavorited] = useState(initialFavorited)
  const [toggling, setToggling] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const hasImage = product.images.length > 0

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (toggling) return
      setToggling(true)
      setFavorited((prev) => !prev)
      try {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: product.id }),
        })
        if (!res.ok) setFavorited((prev) => !prev)
      } catch {
        setFavorited((prev) => !prev)
      } finally {
        setToggling(false)
      }
    },
    [product.id, toggling],
  )

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!session) {
        window.location.href = '/login'
        return
      }
      setAddingToCart(true)
      const ok = await addItem(product.id, 1)
      setAddingToCart(false)
      if (ok) {
        toast.success(`${product.name} se agregó al carrito 🛒`)
      } else {
        toast.error('No se pudo agregar al carrito. Intenta de nuevo.')
      }
    },
    [product.id, product.name, session, addItem],
  )

  return (
    <TiltCard>
      <Link href={`/producto/${product.slug}`} className="block">
        <article className="group overflow-hidden rounded-card border border-kuska-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
          {/* Imagen / placeholder */}
          <div className="relative h-52 overflow-hidden bg-kuska-cream-dark">
            {hasImage ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl opacity-50">
                🏺
              </div>
            )}
            {/* Botón favorito */}
            <button
              onClick={toggleFavorite}
              aria-label={favorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-transform hover:scale-110 active:scale-95"
            >
              <svg
                className={cn(
                  'h-5 w-5 transition-colors',
                  favorited ? 'text-kuska-red fill-current' : 'text-kuska-text-mid',
                )}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={favorited ? 0 : 1.5}
                fill={favorited ? 'currentColor' : 'none'}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>

            {/* Badges de estado */}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
              {product.is_featured && <Badge variant="premium">Destacado</Badge>}
              {product.artisan.is_verified && <Badge variant="verified">✓</Badge>}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-body text-xs text-kuska-text-mid">
                  {product.artisan.user.name} · {product.artisan.region}
                </p>
                <h3 className="mt-0.5 line-clamp-2 font-display text-base font-semibold leading-snug text-kuska-text">
                  {product.name}
                </h3>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Badge variant="technique">{product.technique}</Badge>
              <Badge variant="region">{product.region}</Badge>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <StarRating value={product.rating} />
              <span className="font-nunito text-xs text-kuska-text-mid">
                {product._count.reviews} reseñas
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="font-display text-xl font-bold text-kuska-text">
                {formatPrice(product.price)}
              </p>
              <span className="font-nunito text-xs text-kuska-text-mid">
                {product._count.favorites} ♥
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="mt-3 w-full rounded-btn bg-kuska-gold py-2 font-body font-semibold text-kuska-brown transition-transform hover:scale-105 disabled:opacity-50 active:scale-95"
            >
              {product.stock === 0 ? 'Agotado' : addingToCart ? 'Agregando...' : '🛒 Agregar al carrito'}
            </button>
          </div>
        </article>
      </Link>
    </TiltCard>
  )
}
