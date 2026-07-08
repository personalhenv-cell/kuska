'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'
import { activateEntrepreneurMode } from '@/app/dashboard/cliente/perfil/actions'

interface EntrepreneurGateProps {
  title: string
  description: string
}

/** Pantalla de bloqueo para módulos exclusivos de clientes emprendedores
 *  (Emprendedor IA, Hub de Capitalización) — mismo patrón visual en ambos
 *  para que activar "¿Eres emprendedor?" se sienta como una sola promesa
 *  coherente, no dos textos sueltos. */
export function EntrepreneurGate({ title, description }: EntrepreneurGateProps) {
  const router = useRouter()
  const { update } = useSession()
  const [activating, setActivating] = useState(false)

  async function activate() {
    setActivating(true)
    try {
      await activateEntrepreneurMode()
      // Refresca el JWT de la sesión activa para que sidebars y gates vean el
      // cambio sin re-login, y recarga la ruta para mostrar ya el módulo.
      await update({ is_entrepreneur: true })
      toast.success('¡Modo emprendedor activado! 🚀')
      router.refresh()
    } catch {
      toast.error('No se pudo activar. Intenta de nuevo.')
      setActivating(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-lg overflow-hidden rounded-glass border border-kuska-border bg-white p-10 text-center shadow-xl"
      >
        <div className="andean-texture pointer-events-none absolute inset-0 opacity-[0.03]" />

        <div className="relative">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-kuska-gold/12 px-3.5 py-1 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold"
          >
            🚀 Exclusivo para emprendedores
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-5 flex justify-center"
          >
            <Kusi size="lg" expression="dudoso" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-5 font-display text-2xl font-bold text-kuska-text"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5 }}
            className="mx-auto mt-3 max-w-sm font-body text-sm leading-relaxed text-kuska-text-mid"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-7 flex flex-col items-center gap-3"
          >
            <Button variant="primary" size="lg" onClick={activate} disabled={activating}>
              {activating ? 'Activando…' : '🚀 Activar ahora'}
            </Button>
            <Link
              href="/dashboard/cliente/perfil"
              className="font-body text-sm text-kuska-text-mid transition-colors hover:text-kuska-red"
            >
              o configúralo desde tu perfil
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
