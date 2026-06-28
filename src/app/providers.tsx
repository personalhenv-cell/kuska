'use client'

import { SessionProvider } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

function CustomCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const dot  = document.createElement('div'); dot.id  = 'kuska-cursor'
    const ring = document.createElement('div'); ring.id = 'kuska-cursor-ring'
    document.body.appendChild(dot)
    document.body.appendChild(ring)

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY
      dot.style.left = `${mouseX}px`
      dot.style.top  = `${mouseY}px`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = `${ringX}px`
      ring.style.top  = `${ringY}px`
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    const onEnter = () => { dot.classList.add('hover');  ring.classList.add('hover') }
    const onLeave = () => { dot.classList.remove('hover'); ring.classList.remove('hover') }

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a,button,[role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      dot.remove(); ring.remove()
    }
  }, [])

  return null
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CustomCursor />
      <PageTransition>{children}</PageTransition>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1208',
            color: '#F0EAE0',
            border: '1px solid rgba(240,234,224,0.1)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#2E7A6E', secondary: '#F0EAE0' } },
          error:   { iconTheme: { primary: '#C84B2F', secondary: '#F0EAE0' } },
        }}
      />
    </SessionProvider>
  )
}
