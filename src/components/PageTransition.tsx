'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Transición de página tipo "cortina": un panel marrón barre la pantalla
 * y el contenido entra con un fade-up suave. Respeta prefers-reduced-motion
 * vía la regla global de globals.css (acorta duraciones).
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="contents">
        {/* Cortina */}
        <motion.div
          className="fixed inset-0 z-[9998] pointer-events-none origin-bottom"
          style={{ background: '#3D1C02' }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        />
        {/* Contenido */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
