'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Kusi from '@/components/ui/Kusi'

interface ProductDetail {
  id: string; title: string; slug: string; price: number; stock: number
  description: string | null; cultural_lineage: string | null; materials: string[]
  sale_mode: string; whatsapp_number: string | null; views: number
  artisan_id: string; artisan_name: string; artisan_avatar: string | null
  artisan_bio: string | null; artisan_verified: boolean; artisan_rating: number
  category_name: string; region_name: string | null
  images: Array<{ url: string; alt_text: string | null; is_primary: boolean }>
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const

export default function ProductDetailPage() {
  const params  = useParams()
  const slug    = params.slug as string
  const [product, setProduct]   = useState<ProductDetail | null>(null)
  const [loading, setLoading]   = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    fetch(`/api/products/${slug}`).then(r => r.json()).then(d => {
      if (d.data) setProduct(d.data)
    }).catch(() => toast.error('Error al cargar')).finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-8" style={{ background: '#F5F0E8' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 pt-16">
          <div className="aspect-square rounded-3xl shimmer-bg" style={{ background: '#EFE7DA' }} />
          <div className="space-y-4">
            <div className="h-8 rounded shimmer-bg w-3/4" style={{ background: 'rgba(61,28,2,0.06)' }} />
            <div className="h-6 rounded shimmer-bg w-1/3" style={{ background: 'rgba(61,28,2,0.06)' }} />
            <div className="h-24 rounded shimmer-bg" style={{ background: 'rgba(61,28,2,0.06)' }} />
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#F5F0E8' }}>
        <div className="text-center">
          <div className="flex justify-center mb-4"><Kusi size="lg" animation="think" /></div>
          <p className="text-k-ink/60 mb-4">Producto no encontrado</p>
          <Link href="/marketplace" className="btn-press text-sm font-bold text-k-red hover:underline">← Volver al marketplace</Link>
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
    <main className="min-h-screen" style={{ background: '#F5F0E8' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 liquid-glass px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/marketplace" className="btn-press flex items-center gap-2 text-k-ink/60 hover:text-k-red text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Imágenes */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <div className="aspect-square rounded-3xl overflow-hidden relative mb-3" style={{ background: '#EFE7DA' }}>
              {images[activeImg].url ? (
                <Image src={images[activeImg].url} alt={product.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl opacity-60">🏺</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="btn-press w-16 h-16 rounded-xl overflow-hidden relative shrink-0"
                    style={{ border: activeImg === i ? '2px solid #C84B2F' : '2px solid transparent', opacity: activeImg === i ? 1 : 0.55 }}>
                    {img.url ? <Image src={img.url} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl" style={{ background: '#EFE7DA' }}>🏺</div>}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.08 }}>
            <p className="text-xs text-k-ink/45 mb-2">{product.category_name}{product.region_name ? ` · ${product.region_name}` : ''}</p>
            <h1 className="font-display font-extrabold text-3xl text-k-ink mb-3">{product.title}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-extrabold text-k-red">S/. {product.price.toFixed(2)}</span>
              {product.stock <= 3 && product.stock > 0 && (
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(212,146,10,0.15)', color: '#B97A06' }}>
                  Últimas {product.stock} unidades
                </span>
              )}
            </div>

            {product.description && <p className="text-k-ink/70 text-sm leading-relaxed mb-6">{product.description}</p>}

            {product.materials.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-k-ink/45 uppercase tracking-wider font-bold mb-2">Materiales</p>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map(m => (
                    <span key={m} className="text-xs px-3 py-1 rounded-full bg-white/60 border border-k-ink/10 text-k-ink/70">{m}</span>
                  ))}
                </div>
              </div>
            )}

            {product.cultural_lineage && (
              <div className="mb-6 rounded-2xl p-4 border" style={{ background: 'rgba(200,75,47,0.06)', borderColor: 'rgba(200,75,47,0.18)' }}>
                <p className="text-xs text-k-red uppercase tracking-wider font-bold mb-1">📖 Linaje cultural</p>
                <p className="text-k-ink/75 text-sm">{product.cultural_lineage}</p>
              </div>
            )}

            {/* Compra */}
            <div className="flex gap-3 mb-6">
              {product.sale_mode === 'WHATSAPP' ? (
                <button onClick={buyWhatsApp}
                  className="btn-press flex-1 flex items-center justify-center gap-2 font-bold text-white py-3.5 rounded-xl"
                  style={{ background: '#25D366' }}>
                  💬 Comprar por WhatsApp
                </button>
              ) : (
                <button onClick={() => toast.success('Función de compra próximamente')}
                  className="btn-press flex-1 text-white font-bold py-3.5 rounded-xl" style={{ background: '#C84B2F' }}>
                  Comprar ahora
                </button>
              )}
            </div>

            {/* Artesano */}
            <Link href={`/artesanos/${product.artisan_id}`} className="block liquid-glass card-hover rounded-2xl p-4">
              <div className="flex items-center gap-3">
                {product.artisan_avatar ? (
                  <Image src={product.artisan_avatar} alt={product.artisan_name} width={44} height={44} className="rounded-full" />
                ) : (
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: '#3D1C02' }}>
                    {product.artisan_name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-k-ink font-bold text-sm">{product.artisan_name}</span>
                    {product.artisan_verified && <span className="text-xs text-k-teal font-semibold">✓ Verificado</span>}
                  </div>
                  {product.artisan_bio && <p className="text-k-ink/50 text-xs truncate mt-0.5">{product.artisan_bio}</p>}
                </div>
                <span className="text-k-ink/45 text-xs">★ {product.artisan_rating.toFixed(1)}</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
