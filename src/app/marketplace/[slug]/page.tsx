'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string; title: string; description: string; price: number
  stock: number; culturalLineage: string; materials: string[]
  saleMode: string; whatsappNumber: string
  images: { url: string; isPrimary: boolean }[]
  artisan: { displayName: string; region: { name: string }|null; avgRating: number; totalSales: number; whatsapp: string }
  category: { name: string }
  heritageStory: { title: string; narrative: string; culturalRegion: string; generationNum: number; symbolsMeaning: any }|null
}

export default function ProductoDetallePage() {
  const params  = useParams()
  const slug    = params?.slug as string
  const [product, setProduct] = useState<Product|null>(null)
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState<'info'|'raices'>('info')

  useEffect(() => {
    if (!slug) return
    fetch(`/api/products/${slug}`)
      .then(r => r.json())
      .then(d => { if (d.product) setProduct(d.product) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  const handleWhatsApp = () => {
    const number = product?.whatsappNumber || product?.artisan?.whatsapp
    if (!number) return
    const msg = encodeURIComponent(`Hola, vi tu producto "${product?.title}" en Kuska y me interesa. ¿Está disponible?`)
    window.open(`https://wa.me/${number.replace('+','')}?text=${msg}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-[#3D1C02]/10 rounded-2xl mx-auto mb-4" />
          <p className="text-[#3D1C02]/40 text-sm">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-4">🔍</span>
          <p className="text-[#3D1C02]/60">Producto no encontrado</p>
          <Link href="/marketplace" className="mt-4 inline-block text-[#C84B2F] hover:underline text-sm">
            ← Volver al marketplace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <nav className="bg-white border-b border-[#3D1C02]/10 px-6 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/marketplace" className="text-[#3D1C02]/50 hover:text-[#C84B2F] transition-colors text-sm">
            ← Marketplace
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.jpeg" alt="Kuska" width={30} height={30} className="rounded-lg" />
            <span className="font-bold text-[#3D1C02] text-sm" style={{ fontFamily: 'serif' }}>Kuska</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-[#C84B2F] hover:underline">Ingresar</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">

          <div className="space-y-3">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#3D1C02]/8 aspect-square flex items-center justify-center">
              {product.images?.[0]?.url
                ? <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                : <span className="text-8xl">📷</span>
              }
            </div>
            {product.heritageStory && (
              <button onClick={() => setTab('raices')}
                className="w-full flex items-center gap-3 p-3 bg-[#2E7A6E]/10 border border-[#2E7A6E]/20 rounded-xl hover:bg-[#2E7A6E]/15 transition-colors">
                <span className="text-2xl">🌿</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#2E7A6E]">Esta pieza tiene historia</p>
                  <p className="text-xs text-[#3D1C02]/50">Ver el Módulo Raíces →</p>
                </div>
              </button>
            )}
          </div>

          <div>
            <div className="flex gap-2 mb-6">
              {[
                { key: 'info',   label: 'Información' },
                { key: 'raices', label: '🌿 Raíces', disabled: !product.heritageStory },
              ].map(t => (
                <button key={t.key} onClick={() => !t.disabled && setTab(t.key as any)}
                  disabled={t.disabled}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    tab === t.key
                      ? 'bg-[#3D1C02] text-white'
                      : t.disabled
                        ? 'text-[#3D1C02]/30 cursor-not-allowed'
                        : 'bg-white text-[#3D1C02] hover:bg-[#F5F0E8] border border-[#3D1C02]/15'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'info' && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-[#C84B2F] font-semibold uppercase tracking-wider mb-1">{product.category?.name}</p>
                  <h1 className="text-2xl font-bold text-[#3D1C02]" style={{ fontFamily: 'serif' }}>{product.title}</h1>
                </div>
                <p className="text-3xl font-bold text-[#3D1C02]">S/ {product.price}</p>
                {product.description && <p className="text-sm text-[#3D1C02]/70 leading-relaxed">{product.description}</p>}

                <div className="bg-[#F5F0E8] rounded-xl p-4">
                  <p className="text-xs font-semibold text-[#3D1C02]/50 uppercase tracking-wider mb-2">Artesano</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#3D1C02] text-sm">{product.artisan?.displayName}</p>
                      {product.artisan?.region && (
                        <p className="text-xs text-[#3D1C02]/50 mt-0.5">📍 {product.artisan.region.name}</p>
                      )}
                    </div>
                    {product.artisan?.avgRating > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-600">★ {product.artisan.avgRating}</p>
                        <p className="text-xs text-[#3D1C02]/40">{product.artisan.totalSales} ventas</p>
                      </div>
                    )}
                  </div>
                </div>

                {product.culturalLineage && (
                  <div className="flex items-start gap-2 p-3 bg-[#2E7A6E]/8 rounded-xl border border-[#2E7A6E]/15">
                    <span>🌿</span>
                    <p className="text-xs text-[#2E7A6E] font-medium">{product.culturalLineage}</p>
                  </div>
                )}

                {product.materials?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#3D1C02]/50 uppercase tracking-wider mb-2">Materiales</p>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map(m => (
                        <span key={m} className="text-xs px-2.5 py-1 bg-white border border-[#3D1C02]/15 rounded-full text-[#3D1C02]/70">{m}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  {product.saleMode === 'WHATSAPP' ? (
                    <button onClick={handleWhatsApp}
                      className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2">
                      📱 Contactar por WhatsApp
                    </button>
                  ) : (
                    <button className="w-full py-4 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-bold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg">
                      Agregar al carrito
                    </button>
                  )}
                  {product.saleMode === 'PLATFORM' && (product.whatsappNumber || product.artisan?.whatsapp) && (
                    <button onClick={handleWhatsApp}
                      className="w-full py-3 border-2 border-green-500 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors text-sm flex items-center justify-center gap-2">
                      📱 También contactar por WhatsApp
                    </button>
                  )}
                </div>
              </div>
            )}

            {tab === 'raices' && product.heritageStory && (
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-[#2E7A6E] to-[#1a5049] rounded-2xl p-5 text-white">
                  <span className="text-3xl block mb-2">🌿</span>
                  <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'serif' }}>{product.heritageStory.title}</h2>
                  {product.heritageStory.culturalRegion && (
                    <p className="text-white/60 text-xs">📍 {product.heritageStory.culturalRegion}</p>
                  )}
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#3D1C02]/8">
                  <p className="text-sm text-[#3D1C02]/80 leading-relaxed whitespace-pre-wrap">{product.heritageStory.narrative}</p>
                </div>
                {product.heritageStory.generationNum && (
                  <div className="flex items-center gap-3 p-3 bg-[#D4920A]/10 rounded-xl border border-[#D4920A]/20">
                    <span className="text-2xl">🌳</span>
                    <p className="text-sm font-medium text-[#D4920A]">
                      Técnica de {product.heritageStory.generationNum} generaciones familiares
                    </p>
                  </div>
                )}
                {product.heritageStory.symbolsMeaning?.descripcion && (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#3D1C02]/8">
                    <p className="text-xs font-bold text-[#3D1C02]/50 uppercase tracking-wider mb-2">Significado</p>
                    <p className="text-sm text-[#3D1C02]/70 leading-relaxed">{product.heritageStory.symbolsMeaning.descripcion}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
