'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { Kusi } from '@/components/ui/Kusi'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { formatPrice } from '@/lib/utils'

export function CartClient() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, total, loading, removeItem, updateQuantity } = useCart()
  const [updating, setUpdating] = useState<string | null>(null)

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <Kusi size="md" expression="confused" className="mx-auto" />
          <p className="mt-4 font-display text-lg font-bold text-kuska-text">Debes iniciar sesión</p>
          <p className="mt-2 font-body text-kuska-text-mid">Para ver tu carrito, por favor inicia sesión primero</p>
          <Link href="/login" className="mt-6 inline-block">
            <RippleButton>
              <Button>Ir a Iniciar Sesión</Button>
            </RippleButton>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return <SkeletonCard />
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <Kusi size="md" expression="triste" className="mx-auto" />
          <p className="mt-4 font-display text-lg font-bold text-kuska-text">Tu carrito está vacío</p>
          <p className="mt-2 font-body text-kuska-text-mid">Explora nuestro marketplace y agrega productos</p>
          <Link href="/marketplace" className="mt-6 inline-block">
            <RippleButton>
              <Button>Ver Productos</Button>
            </RippleButton>
          </Link>
        </div>
      </div>
    )
  }

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemove(productId)
      return
    }
    setUpdating(productId)
    await updateQuantity(productId, newQuantity)
    setUpdating(null)
  }

  const handleRemove = async (productId: string) => {
    setUpdating(productId)
    await removeItem(productId)
    setUpdating(null)
  }

  const handleCheckout = async () => {
    if (items.length === 0) return

    const firstItem = items[0]
    const payload = {
      product_id: firstItem.product_id,
      quantity: firstItem.quantity,
      payment_method: 'visa',
      donation: 0,
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push(`/dashboard/cliente/pedidos`)
      }
    } catch (error) {
      console.error('Error en checkout:', error)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-kuska-text">Mi Carrito</h1>
        <p className="mt-2 font-body text-kuska-text-mid">{items.length} producto{items.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-card border border-kuska-border bg-white p-4">
              <div className="flex gap-4">
                {item.product.images[0] && (
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-btn">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Link href={`/producto/${item.product.slug}`} className="font-display font-bold text-kuska-text hover:text-kuska-gold">
                    {item.product.name}
                  </Link>
                  <p className="mt-1 font-body text-sm text-kuska-text-mid">{item.product.artisan.user.name}</p>
                  <p className="mt-2 font-display font-bold text-kuska-gold">{formatPrice(item.product.price)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    type="button"
                    onClick={() => handleRemove(item.product_id)}
                    disabled={updating === item.product_id}
                    className="text-kuska-red hover:underline disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                      disabled={updating === item.product_id || item.quantity <= 1}
                      className="rounded border border-kuska-border px-2 py-1 hover:bg-kuska-cream disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                      disabled={updating === item.product_id || item.quantity >= item.product.stock}
                      className="rounded border border-kuska-border px-2 py-1 hover:bg-kuska-cream disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 border-t border-kuska-border pt-3 text-right font-semibold text-kuska-text">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-card border border-kuska-border bg-white p-6">
          <h2 className="font-display font-bold text-kuska-text">Resumen</h2>
          <div className="mt-4 space-y-2 border-t border-kuska-border pt-4">
            <div className="flex justify-between font-body text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span>Envío</span>
              <span>Calculado al checkout</span>
            </div>
          </div>
          <div className="mt-4 border-t border-kuska-border pt-4">
            <div className="flex justify-between font-display text-lg font-bold text-kuska-text">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <RippleButton className="mt-6 block w-full">
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Ir al Pago
            </Button>
          </RippleButton>
          <Link href="/marketplace" className="mt-3 block text-center font-body text-sm font-semibold text-kuska-gold hover:underline">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
