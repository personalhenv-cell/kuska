'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { ARTISAN_PLANS, CLIENT_PLANS, type MembershipPlan } from '@/lib/memberships'

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

function PlanCard({ plan, onSelect, busy }: { plan: MembershipPlan; onSelect: (p: MembershipPlan) => void; busy: boolean }) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-glass border bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 ${
        plan.highlight
          ? 'border-kuska-gold shadow-[0_16px_48px_rgba(212,146,10,0.18)]'
          : 'border-kuska-border shadow-[0_8px_32px_rgba(61,28,2,0.06)]'
      }`}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-kuska-gold px-4 py-1 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-brown">
          Más popular
        </span>
      )}

      <h3 className="font-display text-xl font-bold text-kuska-text">{plan.name}</h3>
      <p className="mt-1 font-body text-sm text-kuska-text-mid">{plan.tagline}</p>

      <p className="mt-5 font-display text-4xl font-bold text-kuska-text">
        {plan.price === 0 ? (
          'Gratis'
        ) : (
          <>
            S/ {plan.price}
            <span className="font-body text-base font-normal text-kuska-text-mid">/mes</span>
          </>
        )}
      </p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 font-body text-sm text-kuska-text">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-kuska-teal" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <RippleButton className="block w-full">
          <Button
            variant={plan.highlight ? 'primary' : 'ghost'}
            size="lg"
            className="w-full"
            onClick={() => onSelect(plan)}
            disabled={busy}
          >
            {plan.price === 0 ? 'Empezar gratis' : `Elegir ${plan.name.split(' ')[1]}`}
          </Button>
        </RippleButton>
      </div>
    </div>
  )
}

export function PreciosClient() {
  const router = useRouter()
  const { data: session } = useSession()
  const [tab, setTab] = useState<'artesano' | 'cliente'>('artesano')
  const [busy, setBusy] = useState(false)

  const plans = tab === 'artesano' ? ARTISAN_PLANS : CLIENT_PLANS

  async function selectPlan(plan: MembershipPlan) {
    if (!session) {
      router.push(plan.role === 'artesano' ? '/registro/artesano' : '/registro/cliente')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/membresias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.id }),
      })
      const data: { ok?: boolean; error?: string } = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'No se pudo activar el plan')
        return
      }
      toast.success(`¡Plan ${plan.name} activado! 🦙`)
      router.push('/dashboard')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="premium" className="mb-4">
          Membresías
        </Badge>
        <h1 className="font-display text-h3 text-kuska-text sm:text-h2">
          Empieza gratis. Crece cuando quieras.
        </h1>
        <p className="mt-4 font-body text-kuska-text-mid">
          Los puntos, niveles e insignias de Kuska se ganan con tu actividad y
          son para todos, tengas el plan que tengas.
        </p>
      </div>

      {/* Toggle Artesanos / Clientes */}
      <div className="mt-10 flex justify-center">
        <div className="relative inline-flex rounded-full bg-kuska-cream-dark p-1">
          {(['artesano', 'cliente'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`relative z-10 rounded-full px-6 py-2.5 font-body text-sm font-semibold transition-colors ${
                tab === t ? 'text-white' : 'text-kuska-text-mid hover:text-kuska-text'
              }`}
            >
              {tab === t && (
                <motion.span
                  layoutId="precios-tab"
                  className="absolute inset-0 -z-10 rounded-full bg-kuska-brown"
                  transition={{ duration: 0.35, ease: EASE }}
                />
              )}
              {t === 'artesano' ? 'Para artesanos' : 'Para clientes'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={`mt-12 grid gap-6 ${tab === 'artesano' ? 'lg:grid-cols-3' : 'mx-auto max-w-3xl sm:grid-cols-2'}`}
        >
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} onSelect={selectPlan} busy={busy} />
          ))}
        </motion.div>
      </AnimatePresence>

      <p className="mt-10 text-center font-nunito text-xs text-kuska-text-mid">
        Los pagos de membresía son simulados en esta demo. El nivel de
        gamificación (Aprendiz → Leyenda) es independiente del plan y no se
        puede comprar.
      </p>
    </div>
  )
}
