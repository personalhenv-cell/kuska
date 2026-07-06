'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ background: '#F5F0E8', color: '#1A0A00', fontFamily: 'system-ui, sans-serif' }}>
        <main
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 24px',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Se nos cruzaron los hilos</h1>
          <p style={{ marginTop: 8, maxWidth: 420, color: '#6B4C35' }}>
            Ocurrió un error inesperado cargando la página. Intenta de nuevo.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 32,
              padding: '12px 28px',
              borderRadius: 12,
              background: '#C84B2F',
              color: '#F5F0E8',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Intentar de nuevo
          </button>
        </main>
      </body>
    </html>
  )
}
