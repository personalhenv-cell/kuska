'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATEGORIAS = [
  { id: 'textileria',   nombre: 'Textilería' },
  { id: 'ceramica',     nombre: 'Cerámica' },
  { id: 'joyeria',      nombre: 'Joyería y orfebrería' },
  { id: 'madera',       nombre: 'Madera tallada' },
  { id: 'cesteria',     nombre: 'Cestería' },
  { id: 'pintura',      nombre: 'Pintura y arte' },
  { id: 'bordados',     nombre: 'Bordados' },
  { id: 'instrumentos', nombre: 'Instrumentos musicales' },
]

export default function NuevoProductoPage() {
  const router = useRouter()
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)
  const [saleMode, setSaleMode] = useState<'PLATFORM' | 'WHATSAPP'>('PLATFORM')

  const [form, setForm] = useState({
    title:           '',
    description:     '',
    price:           '',
    stock:           '1',
    categoryId:      '',
    culturalLineage: '',
    materials:       '',
    whatsappNumber:  '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.categoryId) {
      setError('Completa los campos obligatorios')
      return
    }
    setLoading(true); setError('')

    try {
      const res = await fetch('/api/products', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:           form.title,
          description:     form.description,
          price:           parseFloat(form.price),
          stock:           parseInt(form.stock),
          categoryId:      form.categoryId,
          culturalLineage: form.culturalLineage,
          materials:       form.materials.split(',').map(m => m.trim()).filter(Boolean),
          saleMode,
          whatsappNumber:  saleMode === 'WHATSAPP' ? `+51${form.whatsappNumber}` : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error); return }

      setSuccess(true)
      setTimeout(() => router.push('/artesano/productos'), 2000)
    } catch {
      setError('Error al crear el producto')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="text-2xl font-bold text-[#3D1C02] mb-2" style={{ fontFamily: 'serif' }}>
            ¡Producto creado!
          </h2>
          <p className="text-[#3D1C02]/60">En revisión — pronto estará visible en el marketplace</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="bg-white border-b border-[#3D1C02]/10 px-6 py-4 flex items-center gap-4">
        <Link href="/artesano/dashboard" className="text-[#3D1C02]/50 hover:text-[#C84B2F] transition-colors text-sm">
          ← Dashboard
        </Link>
        <h1 className="text-lg font-bold text-[#3D1C02]" style={{ fontFamily: 'serif' }}>
          Nuevo producto
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
        )}

        <div className="space-y-6">

          {/* Info básica */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3D1C02]/8">
            <h2 className="font-bold text-[#3D1C02] mb-4">Información básica</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">
                  Nombre del producto *
                </label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="Ej: Chullo andino Q'ero"
                  className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02] text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">
                  Descripción
                </label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={3} placeholder="Describe tu pieza, su proceso de elaboración..."
                  className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02] text-sm resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">
                    Precio (S/) *
                  </label>
                  <input name="price" value={form.price} onChange={handleChange}
                    type="number" min="1" placeholder="85"
                    className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02] text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">
                    Stock disponible
                  </label>
                  <input name="stock" value={form.stock} onChange={handleChange}
                    type="number" min="1" placeholder="1"
                    className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02] text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">
                  Categoría *
                </label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02] text-sm bg-white">
                  <option value="">Selecciona una categoría...</option>
                  {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Linaje cultural */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3D1C02]/8">
            <h2 className="font-bold text-[#3D1C02] mb-1">Linaje cultural</h2>
            <p className="text-xs text-[#3D1C02]/50 mb-4">Esto aparecerá en el Módulo Raíces de tu producto</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">
                  Tradición o técnica ancestral
                </label>
                <input name="culturalLineage" value={form.culturalLineage} onChange={handleChange}
                  placeholder="Ej: Textilería Q'ero, 4ta generación familiar"
                  className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">
                  Materiales (separados por coma)
                </label>
                <input name="materials" value={form.materials} onChange={handleChange}
                  placeholder="Ej: lana de alpaca, tintes naturales, telar andino"
                  className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02] text-sm" />
              </div>
            </div>
          </div>

          {/* Modo de venta */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3D1C02]/8">
            <h2 className="font-bold text-[#3D1C02] mb-4">Modo de venta</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setSaleMode('PLATFORM')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  saleMode === 'PLATFORM'
                    ? 'border-[#C84B2F] bg-[#FDF1EE]'
                    : 'border-[#3D1C02]/15 hover:border-[#C84B2F]/40'
                }`}>
                <span className="text-2xl block mb-2">🛒</span>
                <p className="font-bold text-[#3D1C02] text-sm">Venta en Kuska</p>
                <p className="text-xs text-[#3D1C02]/50 mt-1">Pago seguro en la plataforma. Kuska cobra 5-8%</p>
              </button>
              <button onClick={() => setSaleMode('WHATSAPP')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  saleMode === 'WHATSAPP'
                    ? 'border-[#2E7A6E] bg-[#EEF6F5]'
                    : 'border-[#3D1C02]/15 hover:border-[#2E7A6E]/40'
                }`}>
                <span className="text-2xl block mb-2">📱</span>
                <p className="font-bold text-[#3D1C02] text-sm">Contacto WhatsApp</p>
                <p className="text-xs text-[#3D1C02]/50 mt-1">El cliente te contacta directo. Sin comisión.</p>
              </button>
            </div>

            {saleMode === 'WHATSAPP' && (
              <div>
                <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">
                  Tu número de WhatsApp
                </label>
                <div className="flex items-center border-2 border-[#3D1C02]/15 rounded-xl focus-within:border-[#2E7A6E] overflow-hidden">
                  <div className="px-3 py-3 bg-[#F5F0E8] border-r border-[#3D1C02]/10">
                    <span className="text-sm">📱 +51</span>
                  </div>
                  <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange}
                    type="tel" inputMode="numeric" maxLength={9} placeholder="9XXXXXXXX"
                    className="flex-1 px-4 py-3 text-sm text-[#3D1C02] outline-none bg-transparent placeholder:text-[#3D1C02]/30" />
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Link href="/artesano/dashboard"
              className="flex-1 py-3.5 text-center border-2 border-[#3D1C02]/20 text-[#3D1C02] font-semibold rounded-xl hover:border-[#3D1C02]/40 transition-colors text-sm">
              Cancelar
            </Link>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-3.5 bg-[#C84B2F] disabled:bg-[#3D1C02]/20 text-white font-bold rounded-xl transition-all hover:bg-[#A83A22] hover:scale-[1.02] hover:shadow-lg text-sm">
              {loading ? 'Guardando...' : 'Publicar producto →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
