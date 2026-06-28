'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0B0804' }}>
      <div className="text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-[#F0EAE0] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Algo salió mal</h1>
        <p className="text-[#F0EAE0]/40 mb-8 text-sm">Ocurrió un error inesperado. Intenta de nuevo.</p>
        <button onClick={reset}
          className="btn-press inline-flex items-center gap-2 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors duration-150">
          Reintentar
        </button>
      </div>
    </main>
  )
}
