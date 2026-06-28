'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface ProductDetail {
  id: string; title: string; slug: string; price: number; stock: number
  description: string | null; cultural_lineage: string | null; materials: string[]
  sale_mode: string; whatsapp_number: string | null; views: number
  artisan_id: string; artisan_name: string; artisan_avatar: string | null
  artisan_bio: string | null; artisan_verified: boolean; artisan_rating: number
  category_name: string; region_name: string | null
  images: Array<{ url: string; alt_text: string | null; is_primary: boolean }>
}

export default function ProductDetailPage() {
  const params  = useParams()
  const slug    = params.slug as string
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    fetch(`/api/products/${slug}`).then(r => r.json()).then(d => {
      if (d.data) setProduct(d.data)
    }).catch(() => toast.error('Error al cargar')).finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-8" style={{ background: '#0B0804' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="aspect-square rounded-3xl bg-[#1A1208] shimmer-bg" />
          <div className="space-y-4">
            <div className="h-8 bg-[#F0EAE0]/5 rounded shimmer-bg w-3/4" />
            <div className="h-6 bg-[#F0EAE0]/5 rounded shimmer-bg w-1/3" />
            <div className="h-24 bg-[#F0EAE0]/5 rounded shimmer-bg" />
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0B0804' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-[#F0EAE0]/50 mb-4">Producto no encontrado</p>
          <Link href="/marketplace" className="btn-press text-sm text-[#C84B2F] hover:underline">← Volver al marketplace</Link>
        </div>
      </main>
    )
  }

  const images = product.images.length > 0 ? product.images : [{ url: '', alt_text: null, is_primary: true }]

  const buyWhatsApp = () => {
    const num = product.whatsapp_number?.replace(/\D/g, '')
    if (!num) { toast.error('WhatsApp no disponible'); return }
    const msg = encodeURIComponent(`Hola! Me interesa "${product.title}" en Kuska. ¿Está disponible?`)
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank')
  }

  return (
    <main className="min-h-screen" style={{ background: '#0B0804' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 glass-cream border-b border-[#F0EAE0]/[0.06] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/marketplace" className="btn-press flex items-center gap-2 text-[#F0EAE0]/50 hover:text-[#F0EAE0] text-sm transition-colors duration-150">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <div className="aspect-square rounded-3xl overflow-hidden bg-[#1A1208] relative mb-3">
              {images[activeImg].url ? (
                <Image src={images[activeImg].url} alt={product.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🏺</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="btn-press w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0 transition-all duration-150"
                    style={{ border: activeImg === i ? '2px solid #C84B2F' : '2px solid transparent', opacity: activeImg === i ? 1 : 0.5 }}>
                    {img.url ? <Image src={img.url} alt="" fill className="object-cover" /> : <div className="w-full h-full bg-[#1A1208] flex items-center justify-center text-xl">🏺</div>}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}>
            <p className="text-xs text-[#F0EAE0]/35 mb-2">{product.category_name}{product.region_name ? ` · ${product.region_name}` : ''}</p>
            <h1 className="text-3xl font-bold text-[#F0EAE0] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{product.title}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-[#D4920A]">S/. {product.price.toFixed(2)}</span>
              {product.stock <= 3 && product.stock > 0 && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(212,146,10,0.15)', color: '#D4920A' }}>
                  Últimas {product.stock} unidades
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-[#F0EAE0]/60 text-sm leading-relaxed mb-6">{product.description}</p>
            )}

            {product.materials.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">Materiales</p>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map(m => (
                    <span key={m} className="text-xs px-3 py-1 rounded-full glass border border-[#F0EAE0]/10 text-[#F0EAE0]/60">{m}</span>
                  ))}
                </div>
              </div>
            )}

            {product.cultural_lineage && (
              <div className="mb-6 rounded-2xl p-4 border" style={{ background: 'rgba(200,75,47,0.06)', borderColor: 'rgba(200,75,47,0.15)' }}>
                <p className="text-xs text-[#C84B2F] uppercase tracking-wider mb-1">📖 Linaje cultural</p>
                <p className="text-[#F0EAE0]/70 text-sm">{product.cultural_lineage}</p>
              </div>
            )}

            {/* Buy buttons */}
            <div className="flex gap-3 mb-6">
              {product.sale_mode === 'WHATSAPP' ? (
                <button onClick={buyWhatsApp}
                  className="btn-press flex-1 flex items-center justify-center gap-2 font-semibold text-white py-3.5 rounded-xl transition-colors duration-150"
                  style={{ background: '#25D366' }}>
                  💬 Comprar por WhatsApp
                </button>
              ) : (
                <button onClick={() => toast.success('Función de compra próximamente')}
                  className="btn-press flex-1 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold py-3.5 rounded-xl transition-colors duration-150">
                  Comprar ahora
                </button>
              )}
            </div>

            {/* Artisan */}
            <Link href={`/artesanos/${product.artisan_id}`}
              className="block glass card-hover rounded-2xl p-4">
              <div className="flex items-center gap-3">
                {product.artisan_avatar ? (
                  <Image src={product.artisan_avatar} alt={product.artisan_name} width={44} height={44} className="rounded-full" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#3D1C02] flex items-center justify-center text-sm font-bold text-[#F0EAE0]">
                    {product.artisan_name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#F0EAE0] font-semibold text-sm">{product.artisan_name}</span>
                    {product.artisan_verified && <span className="text-xs text-[#2E7A6E]">✓ Verificado</span>}
                  </div>
                  {product.artisan_bio && <p className="text-[#F0EAE0]/40 text-xs truncate mt-0.5">{product.artisan_bio}</p>}
                </div>
                <span className="text-[#F0EAE0]/30 text-xs">★ {product.artisan_rating.toFixed(1)}</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
