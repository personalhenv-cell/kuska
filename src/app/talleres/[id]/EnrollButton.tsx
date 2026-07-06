'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Kusi } from '@/components/ui/Kusi'

interface Props {
  workshopId: string
  full: boolean
  alreadyEnrolled: boolean
}

export function EnrollButton({ workshopId, full, alreadyEnrolled }: Props) {
  const { status } = useSession()
  const router = useRouter()
  const [enrolled, setEnrolled] = useState(alreadyEnrolled)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (enrolled) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-card border border-kuska-teal/30 bg-kuska-teal/10 px-5 py-3 text-center">
        <Kusi size="xs" expression="sorprendido" />
        <p className="font-body font-semibold text-kuska-teal">¡Ya estás inscrito! Te esperamos 🦙</p>
      </div>
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

  async function enroll() {
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=/talleres/${workshopId}`)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/talleres/${workshopId}/inscribir`, { method: 'POST' })
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

  return (
    <div>
      <Button size="lg" className="w-full" onClick={enroll} disabled={loading}>
        {loading ? 'Inscribiendo…' : 'Inscribirme a este taller'}
      </Button>
      {error && <p className="mt-2 text-center font-body text-sm text-kuska-red">{error}</p>}
    </div>
  )
}
