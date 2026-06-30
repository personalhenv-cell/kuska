import Link from 'next/link'
import type { Metadata } from 'next'
import { Kusi } from '@/components/ui/Kusi'
import { AuthBackground } from '@/components/auth/AuthBackground'
import { RegistroCards } from './RegistroCards'

export const metadata: Metadata = { title: 'Crear cuenta — Kuska' }

export default function RegistroPage() {
  return (
    <AuthBackground>
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <Kusi size="md" animation="wave" message="¿Cómo quieres unirte? 🦙" />
          <h1 className="mt-4 font-display text-3xl font-bold text-kuska-cream sm:text-4xl">
            Únete a Kuska
          </h1>
          <p className="mt-3 font-body text-kuska-cream/70">
            Elige cómo quieres ser parte de la comunidad artesanal del Perú.
          </p>
        </div>

        <RegistroCards />

        <p className="mt-8 text-center font-body text-sm text-kuska-cream/55">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-semibold text-kuska-gold hover:text-kuska-gold/80 transition-colors">
            Ingresa aquí
          </Link>
        </p>
      </div>
    </AuthBackground>
  )
}
