'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { type ReactNode } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
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
