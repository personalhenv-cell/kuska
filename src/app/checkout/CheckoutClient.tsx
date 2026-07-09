'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { Kusi } from '@/components/ui/Kusi'
import { formatPrice } from '@/lib/utils'

export type PaymentMethod = 'yape' | 'plin' | 'visa'

interface CheckoutProduct {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image: string | null
  region: string
  technique: string
  artisanName: string
}

const DONATION_OPTIONS = [0, 2, 5, 10]

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

/* QR simulado: patrón determinista de módulos que pulsan. */
function YapeQR() {
  const cells = useMemo(
    () => Array.from({ length: 144 }, (_, i) => ((i * 7 + 3) % 11) % 3 !== 0),
    [],
  )
  return (
    <div className="mx-auto grid h-44 w-44 grid-cols-12 gap-[2px] rounded-xl bg-white p-3">
      {cells.map((on, i) => (
        <motion.span
          key={i}
          className="rounded-[1px]"
          style={{ background: on ? '#4A1D6A' : 'transparent' }}
          animate={on ? { opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, delay: (i % 12) * 0.08 }}
        />
      ))}
    </div>
  )
}

export function YapePanel({ amount }: { amount: number }) {
  return (
    <div
      className="rounded-card p-6 text-center text-white"
      style={{ background: 'linear-gradient(160deg, #4A1D6A 0%, #742384 100%)' }}
    >
      <p className="font-nunito text-sm font-bold uppercase tracking-wide">Yape — pago simulado</p>
      <div className="mt-4">
        <YapeQR />
      </div>
      <p className="mt-4 font-body text-sm text-white/85">
        Escanea el QR con tu app Yape y paga {formatPrice(amount)}
      </p>
      <p className="mt-1 font-nunito text-xs text-white/60">Demo: no se realizará ningún cobro real</p>
    </div>
  )
}

export function PlinPanel({ amount }: { amount: number }) {
  return (
    <div
      className="rounded-card p-6 text-center text-white"
      style={{ background: 'linear-gradient(160deg, #0E8C7F 0%, #16BFA5 100%)' }}
    >
      <p className="font-nunito text-sm font-bold uppercase tracking-wide">Plin — pago simulado</p>
      <motion.div
        className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/15"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="font-display text-3xl font-bold">P</span>
      </motion.div>
      <p className="mt-5 font-body text-sm text-white/85">
        Recibirás una notificación en tu banca móvil para aprobar {formatPrice(amount)}
      </p>
      <p className="mt-1 font-nunito text-xs text-white/60">Demo: no se realizará ningún cobro real</p>
    </div>
  )
}

export function VisaPanel() {
  const [flipped, setFlipped] = useState(false)
  const [number, setNumber] = useState('')
  const [holder, setHolder] = useState('')
  const [cvv, setCvv] = useState('')

  const shownNumber = (number.replace(/\D/g, '').padEnd(16, '•').match(/.{1,4}/g) ?? []).join(' ')

  return (
    <div className="space-y-4">
      <div className="mx-auto h-48 w-full max-w-sm" style={{ perspective: 1000 }}>
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* Frente */}
          <div
            className="absolute inset-0 flex flex-col justify-between rounded-card p-5 text-white"
            style={{
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #3D1C02 0%, #6B4C35 60%, #D4920A 130%)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="h-8 w-11 rounded-md bg-kuska-gold/80" aria-hidden />
              <span className="font-display text-lg font-bold italic">VISA</span>
            </div>
            <p className="font-mono text-xl tracking-[0.12em]">{shownNumber}</p>
            <div className="flex items-end justify-between">
              <p className="max-w-[70%] truncate font-nunito text-xs uppercase tracking-wide">
                {holder || 'NOMBRE DEL TITULAR'}
              </p>
              <p className="font-nunito text-xs">••/••</p>
            </div>
          </div>
          {/* Reverso */}
          <div
            className="absolute inset-0 rounded-card text-white"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #2a1503 0%, #4a2f16 100%)',
            }}
          >
            <div className="mt-6 h-10 w-full bg-black/70" />
            <div className="mx-5 mt-4 flex items-center justify-end rounded bg-white/90 px-3 py-2">
              <span className="font-mono text-sm tracking-[0.3em] text-kuska-text">{cvv.padEnd(3, '•')}</span>
            </div>
            <p className="px-5 pt-3 text-right font-nunito text-[10px] text-white/60">CVV</p>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-3">
        <input
          inputMode="numeric"
          maxLength={19}
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/[^\d ]/g, ''))}
          onFocus={() => setFlipped(false)}
          placeholder="Número de tarjeta (demo)"
          className="w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
        />
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            onFocus={() => setFlipped(false)}
            placeholder="Titular"
            className="w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
          />
          <input
            inputMode="numeric"
            maxLength={3}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
            onFocus={() => setFlipped(true)}
            onBlur={() => setFlipped(false)}
            placeholder="CVV"
            className="w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
          />
        </div>
        <p className="font-nunito text-xs text-kuska-text-mid">Demo: los datos no se guardan ni se envían a ninguna pasarela.</p>
      </div>
    </div>
  )
}

/* Confetti ligero en CSS/Framer — sin dependencias nuevas. */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: (i * pseudoRandom(i)) % 100,
        color: ['#C84B2F', '#D4920A', '#2E7A6E', '#F5F0E8'][i % 4],
        delay: (i % 10) * 0.12,
        duration: 2.2 + (i % 5) * 0.3,
        rotate: (i * 47) % 360,
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-[-20px] h-2.5 w-1.5 rounded-sm"
          style={{ left: `${p.left}%`, background: p.color }}
          initial={{ y: -30, rotate: p.rotate, opacity: 1 }}
          animate={{ y: '110vh', rotate: p.rotate + 540, opacity: [1, 1, 0.7] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

// Distribuye posiciones pseudo-aleatorias pero deterministas (SSR-safe)
function pseudoRandom(i: number): number {
  return ((i * 37 + 11) % 97) + 1
}

const METHODS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: 'yape', label: 'Yape', hint: 'QR instantáneo' },
  { id: 'plin', label: 'Plin', hint: 'Banca móvil' },
  { id: 'visa', label: 'Tarjeta', hint: 'Visa / débito' },
]

export function CheckoutClient({ product, initialQty }: { product: CheckoutProduct; initialQty: number }) {
  const [qty, setQty] = useState(initialQty)
  const [method, setMethod] = useState<PaymentMethod>('yape')
  const [donation, setDonation] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [orderId, setOrderId] = useState<string | null>(null)

  const subtotal = product.price * qty
  const total = subtotal + donation

  async function pay() {
    setLoading(true)
    setError(undefined)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity: qty, payment_method: method, donation }),
      })
      const data: { ok?: boolean; orderId?: string; error?: string | object } = await res.json()
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'No se pudo procesar el pago')
        return
      }
      setOrderId(data.orderId ?? null)
    } finally {
      setLoading(false)
    }
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-lg px-6 text-center">
        <Confetti />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="rounded-glass border border-kuska-border bg-white px-8 py-12"
        >
          <Kusi size="lg" animation="celebrate" message="¡Gracias por tu compra! 🦙" />
          <h1 className="mt-6 font-display text-3xl font-bold text-kuska-text">¡Pedido confirmado!</h1>
          <p className="mt-3 font-body text-kuska-text-mid">
            Tu compra de <strong>{product.name}</strong> apoya directamente a {product.artisanName} en {product.region}.
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

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-6 lg:grid-cols-[1.2fr_1fr]">
      {/* Método de pago */}
      <div className="space-y-5">
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
            {method === 'yape' && <YapePanel amount={total} />}
            {method === 'plin' && <PlinPanel amount={total} />}
            {method === 'visa' && <VisaPanel />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Resumen */}
      <aside className="h-fit space-y-5 rounded-glass border border-kuska-border bg-white p-6">
        <div className="flex gap-4">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-card bg-kuska-cream-dark">
            {product.image && (
              <Image src={product.image} alt={product.name} width={80} height={80} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-body font-semibold text-kuska-text">{product.name}</p>
            <p className="font-nunito text-xs text-kuska-text-mid">
              {product.artisanName} · {product.region}
            </p>
            <p className="mt-1 font-display font-bold text-kuska-text">{formatPrice(product.price)}</p>
          </div>
        </div>

        {/* Cantidad */}
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-kuska-text-mid">Cantidad</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-9 w-9 rounded-btn border border-kuska-border bg-white font-bold text-kuska-text transition-colors hover:bg-kuska-cream-dark"
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span className="w-6 text-center font-body font-semibold text-kuska-text">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              className="h-9 w-9 rounded-btn border border-kuska-border bg-white font-bold text-kuska-text transition-colors hover:bg-kuska-cream-dark"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>

        {/* Donación solidaria */}
        <div className="rounded-card bg-kuska-teal/8 border border-kuska-teal/20 p-4">
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

        {/* Totales */}
        <div className="space-y-1.5 border-t border-kuska-border pt-4 font-body text-sm">
          <div className="flex justify-between text-kuska-text-mid">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {donation > 0 && (
            <div className="flex justify-between text-kuska-teal">
              <span>Donación</span>
              <span>{formatPrice(donation)}</span>
            </div>
          )}
          <div className="flex justify-between pt-1 font-display text-lg font-bold text-kuska-text">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {error && <p className="font-body text-sm text-kuska-red" role="alert">{error}</p>}

        <RippleButton className="block w-full">
          <Button size="lg" className="w-full" onClick={pay} disabled={loading}>
            {loading ? 'Procesando…' : `Pagar ${formatPrice(total)}`}
          </Button>
        </RippleButton>
        <p className="text-center font-nunito text-xs text-kuska-text-mid">
          Pago 100% simulado para la demo — no se realizará ningún cobro.
        </p>
      </aside>
    </div>
  )
}
