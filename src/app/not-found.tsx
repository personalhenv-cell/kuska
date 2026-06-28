import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0B0804' }}>
      <div className="text-center">
        <div className="text-7xl mb-6">🏺</div>
        <h1 className="text-4xl font-bold text-[#F0EAE0] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>404</h1>
        <p className="text-[#F0EAE0]/40 mb-8">Esta página no existe o fue movida.</p>
        <Link href="/"
          className="inline-flex items-center gap-2 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors duration-150">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
