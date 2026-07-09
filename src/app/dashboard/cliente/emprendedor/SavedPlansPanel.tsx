'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

interface BusinessPlanRecord {
  id: string
  title: string
  data: unknown
  created_at: string
}

function planContent(data: unknown): string {
  if (data && typeof data === 'object' && 'content' in data) {
    const content = (data as { content: unknown }).content
    if (typeof content === 'string') return content
  }
  return ''
}

function SkeletonPlanRow() {
  return (
    <div className="rounded-card border border-kuska-border bg-white p-5">
      <div className="skeleton h-4 w-1/2 rounded-full" />
      <div className="skeleton mt-2 h-3 w-1/3 rounded-full" />
    </div>
  )
}

/** Paso 4 del wizard de Emprendedor IA: lista de planes guardados por el
 *  cliente (persistidos en `BusinessPlan` vía Prisma), con vista expandida y
 *  eliminación real — no es una vitrina simulada. */
export function SavedPlansPanel() {
  const [plans, setPlans] = useState<BusinessPlanRecord[] | null>(null)
  const [error, setError] = useState<string>()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(undefined)
    try {
      const res = await fetch('/api/business-plan')
      if (!res.ok) {
        setError('No se pudieron cargar tus planes guardados')
        return
      }
      const data: { plans: BusinessPlanRecord[] } = await res.json()
      setPlans(data.plans)
    } catch {
      setError('No se pudieron cargar tus planes guardados')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function remove(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/business-plan/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('No se pudo eliminar el plan')
        return
      }
      setPlans((prev) => (prev ? prev.filter((p) => p.id !== id) : prev))
      toast.success('Plan eliminado')
    } catch {
      toast.error('No se pudo eliminar el plan')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-card border border-kuska-border bg-white p-6">
        <h3 className="font-display text-lg font-bold text-kuska-text">Mis planes guardados</h3>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Cada plan que guardas queda aquí para que lo retomes, lo edites de nuevo o lo uses para postular al Hub de
          Capitalización.
        </p>
      </div>

      {error && (
        <div className="rounded-card border border-kuska-red/30 bg-kuska-red/5 p-4">
          <p className="font-body text-sm text-kuska-red">{error}</p>
        </div>
      )}

      {plans === null && !error ? (
        <div className="space-y-3">
          <SkeletonPlanRow />
          <SkeletonPlanRow />
        </div>
      ) : plans && plans.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-10 text-center">
          <span className="text-3xl">📋</span>
          <p className="mt-2 font-body text-sm text-kuska-text-mid">
            Todavía no guardas ningún plan. Genera uno en el Paso 1 y guárdalo desde el Paso 3.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans?.map((plan) => {
            const isOpen = expandedId === plan.id
            return (
              <div key={plan.id} className="rounded-card border border-kuska-border bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-body font-semibold text-kuska-text">{plan.title}</p>
                    <p className="font-body text-xs text-kuska-text-mid">Guardado el {formatDate(plan.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setExpandedId(isOpen ? null : plan.id)}
                      className="font-body text-sm font-semibold text-kuska-brown hover:underline"
                    >
                      {isOpen ? 'Ocultar' : 'Ver plan'}
                    </button>
                    <button
                      onClick={() => remove(plan.id)}
                      disabled={deletingId === plan.id}
                      className="font-body text-sm font-semibold text-kuska-red hover:underline disabled:opacity-50"
                    >
                      {deletingId === plan.id ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <p className="mt-4 whitespace-pre-line border-t border-kuska-border pt-4 font-body text-sm leading-relaxed text-kuska-text">
                    {planContent(plan.data) || 'Este plan no tiene contenido guardado.'}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="rounded-card border border-kuska-gold/30 bg-kuska-gold/10 p-6 text-center">
        <p className="font-body text-sm text-kuska-text">
          ¿Tu plan ya está listo? Postula con él a convocatorias reales de financiamiento.
        </p>
        <Link
          href="/dashboard/cliente/capitalizacion"
          className="mt-3 inline-block rounded-btn bg-kuska-red px-5 py-2.5 font-body text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          💰 Ir al Hub de Capitalización
        </Link>
      </div>
    </div>
  )
}
