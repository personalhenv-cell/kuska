import Link from 'next/link'
import type { Metadata } from 'next'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Error de autenticación' }

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-kuska-cream px-6 text-center">
      <Kusi size="md" animation="think" message="Algo salió mal 🦙" />
      <h1 className="mt-6 font-display text-3xl font-bold text-kuska-text">
        No pudimos iniciar tu sesión
      </h1>
      <p className="mt-2 max-w-md font-body text-kuska-text-mid">
        El código pudo expirar o ser incorrecto. Inténtalo de nuevo.
      </p>
      <Link href="/login" className="mt-8">
        <Button variant="primary" size="lg">
          Volver a ingresar
        </Button>
      </Link>
    </main>
  )
}
