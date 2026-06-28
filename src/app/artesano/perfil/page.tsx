'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function PerfilPage() {
  const { data: session } = useSession()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio]                 = useState('')
  const [whatsapp, setWhatsapp]       = useState('')
  const [loading, setLoading]         = useState(false)
  const [saved, setSaved]             = useState(false)

  useEffect(() => {
    fetch('/api/artesano/profile').then(r => r.json()).then(d => {
      if (d.data) { setDisplayName(d.data.displayName ?? ''); setBio(d.data.bio ?? ''); setWhatsapp(d.data.whatsapp ?? '') }
    }).catch(() => {})
  }, [])

  const save = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/artesano/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, bio, whatsapp }),
      })
      if (res.ok) { toast.success('Perfil actualizado'); setSaved(true); setTimeout(() => setSaved(false), 2000) }
      else { const d = await res.json(); toast.error(d.error || 'Error') }
    } catch { toast.error('Error de conexión')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Mi Perfil</h1>
        <p className="text-[#F0EAE0]/40 text-sm mt-1">Información visible para compradores en el marketplace.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
        className="glass rounded-2xl p-6 space-y-5">
        {/* Avatar placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#3D1C02] flex items-center justify-center text-2xl font-bold text-[#F0EAE0]">
            {displayName?.[0] ?? session?.user.phone?.slice(-2) ?? '?'}
          </div>
          <div>
            <button className="btn-press text-sm text-[#C84B2F] hover:underline font-medium transition-colors duration-150">Cambiar foto</button>
            <p className="text-[#F0EAE0]/30 text-xs mt-0.5">JPG o PNG, máximo 2MB</p>
          </div>
        </div>

        {[
          { label: 'Nombre artesanal', value: displayName, set: setDisplayName, placeholder: 'Ej: María Quispe — Ceramista Cusqueña', type: 'input' as const },
          { label: 'Sobre ti', value: bio, set: setBio, placeholder: 'Cuéntale a tus compradores tu historia y técnica artesanal…', type: 'textarea' as const },
          { label: 'WhatsApp', value: whatsapp, set: setWhatsapp, placeholder: '+51 9XXXXXXXX', type: 'input' as const },
        ].map(field => (
          <div key={field.label}>
            <label className="block text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea value={field.value} onChange={e => field.set(e.target.value)} rows={4} placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-[#F0EAE0]/10 text-[#F0EAE0] placeholder:text-[#F0EAE0]/20 outline-none focus:border-[#C84B2F]/60 transition-colors duration-150 text-sm resize-none"
                style={{ background: 'rgba(240,234,224,0.04)' }} />
            ) : (
              <input value={field.value} onChange={e => field.set(e.target.value)} placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-[#F0EAE0]/10 text-[#F0EAE0] placeholder:text-[#F0EAE0]/20 outline-none focus:border-[#C84B2F]/60 transition-colors duration-150 text-sm"
                style={{ background: 'rgba(240,234,224,0.04)' }} />
            )}
          </div>
        ))}

        <div className="pt-2">
          <label className="block text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">Teléfono (no editable)</label>
          <div className="px-4 py-3 rounded-xl border border-[#F0EAE0]/[0.06] text-[#F0EAE0]/40 text-sm" style={{ background: 'rgba(240,234,224,0.02)' }}>
            {session?.user.phone}
          </div>
        </div>

        <button onClick={save} disabled={loading || !displayName.trim()}
          className="btn-press w-full py-3.5 bg-[#C84B2F] disabled:opacity-30 hover:bg-[#A83A22] text-white font-semibold rounded-xl transition-colors duration-150 text-sm">
          {loading ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar cambios'}
        </button>
      </motion.div>
    </div>
  )
}
