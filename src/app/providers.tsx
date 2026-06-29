'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from '@/contexts/LanguageContext'
import PageTransition from '@/components/PageTransition'
import LoadingScreen from '@/components/LoadingScreen'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <LoadingScreen />
        <PageTransition>{children}</PageTransition>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(245,240,232,0.92)',
              color: '#2A1810',
              border: '1px solid rgba(61,28,2,0.12)',
              borderRadius: '14px',
              backdropFilter: 'blur(20px)',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(61,28,2,0.12)',
            },
            success: { iconTheme: { primary: '#2E7A6E', secondary: '#F5F0E8' } },
            error:   { iconTheme: { primary: '#C84B2F', secondary: '#F5F0E8' } },
          }}
        />
      </LanguageProvider>
    </SessionProvider>
  )
}
