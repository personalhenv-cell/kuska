'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Kusi } from '@/components/ui/Kusi'
import { formatDate, formatPrice } from '@/lib/utils'
import { YapePanel, PlinPanel, VisaPanel, type PaymentMethod } from '@/app/checkout/CheckoutClient'

interface Props {
  workshopId: string
  title: string
  date: string
  price: number
  isVirtual: boolean
  full: boolean
  alreadyEnrolled: boolean
}

const METHODS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: 'yape', label: 'Yape', hint: 'QR instantáneo' },
  { id: 'plin', label: 'Plin', hint: 'Banca móvil' },
  { id: 'visa', label: 'Tarjeta', hint: 'Visa / débito' },
]

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

export function EnrollButton({ workshopId, title, date, price, isVirtual, full, alreadyEnrolled }: Props) {
  const { status } = useSession()
  const router = useRouter()
  const [enrolled, setEnrolled] = useState(alreadyEnrolled)
  const [showPayment, setShowPayment] = useState(false)
  const [method, setMethod] = useState<PaymentMethod>('yape')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function enroll(paymentMethod?: PaymentMethod) {
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=/talleres/${workshopId}`)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/talleres/${workshopId}/inscribir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentMethod ? { payment_method: paymentMethod } : {}),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setEnrolled(true)
        router.refresh()
      } else if (data.alreadyEnrolled) {
        setEnrolled(true)
      } else {
        setError(data.error ?? 'No se pudo completar la inscripción')
      }
    } catch {
      setError('Error de red. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (enrolled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="rounded-card border border-kuska-teal/30 bg-kuska-teal/10 p-5"
      >
        <div className="flex items-center gap-3">
          <Kusi size="xs" expression="sorprendido" />
          <div>
            <p className="font-body font-semibold text-kuska-teal">¡Ya estás inscrito! Te esperamos 🦙</p>
            <p className="mt-0.5 font-nunito text-xs text-kuska-text-mid">
              {formatDate(date)} · {isVirtual ? 'Taller virtual' : 'Taller presencial'}
              {price > 0 && ` · ${formatPrice(price)} pagado`}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (full) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-card border border-kuska-border bg-white px-5 py-3 text-center">
        <Kusi size="xs" expression="asustado" />
        <p className="font-body text-kuska-text-mid">Cupos agotados — muy pronto habrá más talleres</p>
      </div>
    )
  }

  // Taller gratuito: inscripción directa de un clic, sin paso de pago.
  if (price <= 0) {
    return (
      <div>
        <Button size="lg" className="w-full" onClick={() => enroll()} disabled={loading}>
          {loading ? 'Inscribiendo…' : 'Inscribirme a este taller'}
        </Button>
        {error && <p className="mt-2 text-center font-body text-sm text-kuska-red">{error}</p>}
      </div>
    )
  }

  // Taller pagado: hay que elegir método de pago antes de confirmar.
  if (!showPayment) {
    return (
      <div>
        <Button
          size="lg"
          className="w-full"
          onClick={() => (status !== 'authenticated' ? enroll() : setShowPayment(true))}
        >
          Inscribirme — {formatPrice(price)}
        </Button>
        {error && <p className="mt-2 text-center font-body text-sm text-kuska-red">{error}</p>}
      </div>
    )
  }

  return (
    <div className="w-full space-y-4 rounded-card border border-kuska-border bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm font-semibold text-kuska-text">Pagar inscripción — {title}</p>
        <button
          type="button"
          onClick={() => setShowPayment(false)}
          className="font-body text-xs text-kuska-text-mid hover:text-kuska-red"
        >
          Cancelar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`rounded-btn border p-3 text-left transition-all ${
              method === m.id
                ? 'border-kuska-gold bg-kuska-gold/10 shadow-[0_4px_16px_rgba(212,146,10,0.2)]'
                : 'border-kuska-border bg-white hover:border-kuska-gold/50'
            }`}
          >
            <p className="font-body text-xs font-bold text-kuska-text">{m.label}</p>
            <p className="font-nunito text-[10px] text-kuska-text-mid">{m.hint}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={method}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {method === 'yape' && <YapePanel amount={price} />}
          {method === 'plin' && <PlinPanel amount={price} />}
          {method === 'visa' && <VisaPanel />}
        </motion.div>
      </AnimatePresence>

      <Button size="lg" className="w-full" onClick={() => enroll(method)} disabled={loading}>
        {loading ? 'Confirmando pago…' : `Confirmar pago de ${formatPrice(price)}`}
      </Button>
      {error && <p className="text-center font-body text-sm text-kuska-red">{error}</p>}
    </div>
  )
}
