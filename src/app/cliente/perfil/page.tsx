'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function ClientePerfilPage() {
  const { data: session } = useSession()
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    fetch('/api/cliente/profile').then(r => r.json()).then(d => {
      if (d.data?.displayName) setDisplayName(d.data.displayName)
    }).catch(() => {})
  }, [])

  const save = async () => {
    if (!displayName.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/cliente/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: displayName.trim() }),
      })
      if (res.ok) toast.success('Perfil actualizado')
      else { const d = await res.json(); toast.error(d.error || 'Error') }
    } catch { toast.error('Error de conexión')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Mi Perfil</h1>
        <p className="text-[#F0EAE0]/40 text-sm mt-1">Información de tu cuenta Kuska.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
        className="glass rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold" style={{ background: 'rgba(46,122,110,0.15)', color: '#2E7A6E' }}>
            {displayName?.[0] ?? session?.user.phone?.slice(-2) ?? '?'}
          </div>
          <div>
            <p className="text-[#F0EAE0] font-medium">{displayName || 'Sin nombre'}</p>
            <p className="text-[#F0EAE0]/40 text-sm">{session?.user.phone}</p>
          </div>
        </div>
        <div>
          <label className="block text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">Tu nombre</label>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Tu nombre completo"
            className="w-full px-4 py-3 rounded-xl border border-[#F0EAE0]/10 text-[#F0EAE0] placeholder:text-[#F0EAE0]/20 outline-none focus:border-[#2E7A6E]/60 transition-colors duration-150 text-sm"
            style={{ background: 'rgba(240,234,224,0.04)' }} />
        </div>
        <div>
          <label className="block text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">Teléfono</label>
          <div className="px-4 py-3 rounded-xl border border-[#F0EAE0]/[0.06] text-[#F0EAE0]/40 text-sm" style={{ background: 'rgba(240,234,224,0.02)' }}>
            {session?.user.phone}
          </div>
        </div>
        <button onClick={save} disabled={loading || !displayName.trim()}
          className="btn-press w-full py-3.5 font-semibold text-white rounded-xl transition-colors duration-150 disabled:opacity-30 text-sm"
          style={{ background: '#2E7A6E' }}>
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </motion.div>
    </div>
  )
}
