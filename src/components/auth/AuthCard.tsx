'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
  className?: string
}

export function AuthCard({ children, className = '' }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`w-full max-w-[440px] ${className}`}
    >
      <div
        className="rounded-[28px] px-10 py-10"
        style={{
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(52px) saturate(180%)',
          WebkitBackdropFilter: 'blur(52px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow:
            '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
