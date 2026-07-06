'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[error-boundary]', error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-kuska-cream px-6 text-center">
      <Kusi size="lg" expression="molesto" message="Algo salió mal 🦙" />
      <h1 className="mt-6 font-display text-3xl font-bold text-kuska-text sm:text-4xl">
        Se nos cruzaron los hilos
      </h1>
      <p className="mt-2 max-w-md font-body text-lg text-kuska-text-mid">
        Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="lg" onClick={() => reset()}>
          Intentar de nuevo
        </Button>
        <Link href="/">
          <Button variant="ghost" size="lg">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </main>
  )
}
