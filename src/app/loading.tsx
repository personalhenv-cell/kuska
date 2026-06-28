export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0804' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#F0EAE0]/10 border-t-[#C84B2F] animate-spin" />
        <p className="text-[#F0EAE0]/30 text-sm">Cargando…</p>
      </div>
    </div>
  )
}
