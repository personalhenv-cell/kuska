'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { Kusi } from '@/components/ui/Kusi'
import { SkeletonProductCard } from '@/components/ui/SkeletonCard'
import { formatPrice } from '@/lib/utils'
import { YapePanel, PlinPanel, VisaPanel, type PaymentMethod } from '@/app/checkout/CheckoutClient'

const DONATION_OPTIONS = [0, 2, 5, 10]
const METHODS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: 'yape', label: 'Yape', hint: 'QR instantáneo' },
  { id: 'plin', label: 'Plin', hint: 'Banca móvil' },
  { id: 'visa', label: 'Tarjeta', hint: 'Visa / débito' },
]

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

export function CartClient() {
  const { data: session } = useSession()
  const { items, total, loading, removeItem, updateQuantity, refetch } = useCart()
  const [updating, setUpdating] = useState<string | null>(null)
  const [step, setStep] = useState<'carrito' | 'pago'>('carrito')
  const [method, setMethod] = useState<PaymentMethod>('yape')
  const [donation, setDonation] = useState(0)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string>()
  const [orderId, setOrderId] = useState<string | null>(null)

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <Kusi size="md" expression="dudoso" className="mx-auto" />
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
    return <SkeletonProductCard />
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="rounded-glass border border-kuska-border bg-white px-8 py-12"
        >
          <Kusi size="lg" animation="celebrate" message="¡Gracias por tu compra! 🦙" />
          <h1 className="mt-6 font-display text-3xl font-bold text-kuska-text">¡Pedido confirmado!</h1>
          <p className="mt-3 font-body text-kuska-text-mid">
            Tu compra apoya directamente a los artesanos detrás de cada pieza.
          </p>
          {donation > 0 && (
            <p className="mt-2 font-body text-sm text-kuska-teal">
              +{formatPrice(donation)} donados al Fondo Solidario Kuska 💛
            </p>
          )}
          <p className="mt-4 font-nunito text-xs text-kuska-text-mid">Pedido Nº {orderId}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard/cliente/pedidos">
              <Button variant="primary" size="lg">Ver mis pedidos</Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="ghost" size="lg">Seguir explorando</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
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
    const ok = await removeItem(productId)
    setUpdating(null)
    if (ok) toast.success('Producto eliminado del carrito')
  }

  const total_ = total + donation

  const handlePay = async () => {
    setPaying(true)
    setError(undefined)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
          payment_method: method,
          donation,
        }),
      })
      const data: { ok?: boolean; orderId?: string; error?: string | object } = await res.json()
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'No se pudo procesar el pago')
        return
      }
      setOrderId(data.orderId ?? null)
      await refetch()
    } finally {
      setPaying(false)
    }
  }

  if (step === 'pago') {
    return (
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <button
            onClick={() => setStep('carrito')}
            className="font-body text-sm font-semibold text-kuska-text-mid hover:text-kuska-gold"
          >
            ← Volver al carrito
          </button>
          <h1 className="font-display text-2xl font-bold text-kuska-text sm:text-3xl">Finalizar compra</h1>

          <div className="grid grid-cols-3 gap-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`rounded-card border p-4 text-left transition-all ${
                  method === m.id
                    ? 'border-kuska-gold bg-kuska-gold/10 shadow-[0_4px_16px_rgba(212,146,10,0.2)]'
                    : 'border-kuska-border bg-white hover:border-kuska-gold/50'
                }`}
              >
                <p className="font-body text-sm font-bold text-kuska-text">{m.label}</p>
                <p className="font-nunito text-xs text-kuska-text-mid">{m.hint}</p>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {method === 'yape' && <YapePanel amount={total_} />}
              {method === 'plin' && <PlinPanel amount={total_} />}
              {method === 'visa' && <VisaPanel />}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="h-fit space-y-5 rounded-glass border border-kuska-border bg-white p-6">
          <h2 className="font-display font-bold text-kuska-text">
            {items.length} producto{items.length !== 1 ? 's' : ''}
          </h2>
          <div className="max-h-56 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-btn bg-kuska-cream-dark">
                  {item.product.images[0] && (
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-semibold text-kuska-text">{item.product.name}</p>
                  <p className="font-nunito text-xs text-kuska-text-mid">× {item.quantity}</p>
                </div>
                <p className="font-body text-sm font-semibold text-kuska-text">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-card border border-kuska-teal/20 bg-kuska-teal/8 p-4">
            <p className="font-body text-sm font-semibold text-kuska-text">Donación solidaria (opcional)</p>
            <p className="mt-0.5 font-nunito text-xs text-kuska-text-mid">
              Suma al Fondo Solidario Kuska para artesanos en emergencia.
            </p>
            <div className="mt-3 flex gap-2">
              {DONATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDonation(d)}
                  className={`rounded-full border px-3 py-1.5 font-nunito text-xs font-bold transition-all ${
                    donation === d
                      ? 'border-kuska-teal bg-kuska-teal text-white'
                      : 'border-kuska-border bg-white text-kuska-text-mid hover:border-kuska-teal'
                  }`}
                >
                  {d === 0 ? 'Sin donación' : `S/ ${d}`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 border-t border-kuska-border pt-4 font-body text-sm">
            <div className="flex justify-between text-kuska-text-mid">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            {donation > 0 && (
              <div className="flex justify-between text-kuska-teal">
                <span>Donación</span>
                <span>{formatPrice(donation)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 font-display text-lg font-bold text-kuska-text">
              <span>Total</span>
              <span>{formatPrice(total_)}</span>
            </div>
          </div>

          {error && <p className="font-body text-sm text-kuska-red" role="alert">{error}</p>}

          <RippleButton className="block w-full">
            <Button size="lg" className="w-full" onClick={handlePay} disabled={paying}>
              {paying ? 'Procesando…' : `Pagar ${formatPrice(total_)}`}
            </Button>
          </RippleButton>
          <p className="text-center font-nunito text-xs text-kuska-text-mid">
            Pago 100% simulado para la demo — no se realizará ningún cobro.
          </p>
        </aside>
      </div>
    )
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
              <span>Gratis</span>
            </div>
          </div>
          <div className="mt-4 border-t border-kuska-border pt-4">
            <div className="flex justify-between font-display text-lg font-bold text-kuska-text">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <RippleButton className="mt-6 block w-full">
            <Button className="w-full" size="lg" onClick={() => setStep('pago')}>
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
