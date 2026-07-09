'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { type ReactNode } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { CartProvider } from '@/contexts/CartContext'
import { RememberSessionGuard } from '@/components/auth/RememberSessionGuard'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <CartProvider>
          <RememberSessionGuard />
          {children}
        </CartProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#1A0A00',
              border: '1px solid rgba(212,146,10,0.35)',
              borderRadius: '16px',
              fontFamily: 'var(--font-nunito)',
            },
          }}
        />
      </LanguageProvider>
    </SessionProvider>
  )
}
