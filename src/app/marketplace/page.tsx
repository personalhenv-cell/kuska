'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Kusi from '@/components/ui/Kusi'

interface Product {
  id: string; title: string; slug: string; price: number; stock: number
  artisan_name: string; artisan_avatar: string | null; is_verified: boolean
  primary_image: string | null; avg_rating: number; category_name: string; region_name: string | null
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay: Math.min(index * 0.04, 0.4) }}
    >
      <Link href={`/marketplace/${product.slug}`} className="block group">
        <div className="liquid-glass card-hover rounded-2xl overflow-hidden">
          <div className="aspect-square relative" style={{ background: '#EFE7DA' }}>
            {product.primary_image ? (
              <Image src={product.primary_image} alt={product.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl opacity-60">🏺</div>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <div className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: '#D4920A' }}>
                Últimas {product.stock}
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs text-k-ink/45 mb-1 truncate">{product.category_name}{product.region_name ? ` · ${product.region_name}` : ''}</p>
            <h3 className="text-k-ink font-semibold text-sm leading-tight mb-2 line-clamp-2">{product.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-k-red font-extrabold text-base">S/. {product.price.toFixed(2)}</span>
              <div className="flex items-center gap-1.5">
                {product.artisan_avatar ? (
                  <Image src={product.artisan_avatar} alt={product.artisan_name} width={20} height={20} className="rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] text-white" style={{ background: '#3D1C02' }}>
                    {product.artisan_name[0]}
                  </div>
                )}
                <span className="text-k-ink/50 text-xs truncate max-w-[80px]">{product.artisan_name}</span>
                {product.is_verified && <span className="text-[10px] text-k-teal">✓</span>}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="liquid-glass rounded-2xl overflow-hidden">
      <div className="aspect-square shimmer-bg" style={{ background: '#EFE7DA' }} />
      <div className="p-4 space-y-2">
        <div className="h-3 rounded shimmer-bg w-2/3" style={{ background: 'rgba(61,28,2,0.06)' }} />
        <div className="h-4 rounded shimmer-bg" style={{ background: 'rgba(61,28,2,0.06)' }} />
        <div className="flex justify-between mt-2">
          <div className="h-5 rounded shimmer-bg w-20" style={{ background: 'rgba(61,28,2,0.06)' }} />
          <div className="h-5 rounded shimmer-bg w-20" style={{ background: 'rgba(61,28,2,0.06)' }} />
        </div>
      </div>
    </div>
  )
}

const CATEGORIES = ['Todos', 'Textiles', 'Cerámica', 'Joyería', 'Madera', 'Cuero', 'Metal']

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [q,        setQ]        = useState('')
  const [category, setCategory] = useState('Todos')
  const [page,     setPage]     = useState(1)
  const [hasMore,  setHasMore]  = useState(false)
  const [total,    setTotal]    = useState(0)

  const fetchProducts = useCallback(async (reset = false) => {
    setLoading(true)
    try {
      const currentPage = reset ? 1 : page
      const params = new URLSearchParams({ page: String(currentPage), pageSize: '20' })
      if (q) params.set('q', q)
      if (category !== 'Todos') params.set('category', category.toLowerCase())

      const res  = await fetch(`/api/products?${params}`)
      const data = await res.json()

      if (reset) { setProducts(data.data ?? []); setPage(1) }
      else        setProducts(prev => [...prev, ...(data.data ?? [])])

      setHasMore(data.hasMore ?? false)
      setTotal(data.total ?? 0)
    } catch { /* network error — keep existing */ }
    finally  { setLoading(false) }
  }, [q, category, page])

  useEffect(() => { fetchProducts(true) }, [q, category]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="min-h-screen" style={{ background: '#F5F0E8' }}>
      <Navbar />

      {/* Sub-header búsqueda */}
      <section className="pt-24 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-k-ink">Marketplace</h1>
              <p className="text-k-ink/55 text-sm mt-1">Artesanía peruana con historia, directo del taller a tu hogar.</p>
            </div>
            <div className="w-full md:max-w-sm">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-white/60 border border-k-ink/10 focus-within:border-k-red/50 transition-colors">
                <svg className="w-4 h-4 text-k-ink/40 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar artesanías…"
                  className="flex-1 bg-transparent text-k-ink placeholder:text-k-ink/35 outline-none text-sm" />
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className="btn-press shrink-0 text-sm px-4 py-2 rounded-full border transition-all font-semibold"
                style={category === cat
                  ? { background: '#C84B2F', borderColor: '#C84B2F', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.5)', borderColor: 'rgba(61,28,2,0.12)', color: 'rgba(42,24,16,0.6)' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {!loading && <p className="text-k-ink/45 text-sm mb-5">{total} productos encontrados</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading && products.length === 0
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4"><Kusi size="lg" animation="think" /></div>
            <p className="text-k-ink/60">No encontramos productos con esa búsqueda.</p>
            <button onClick={() => { setQ(''); setCategory('Todos') }} className="btn-press mt-4 text-sm font-bold text-k-red hover:underline">
              Limpiar filtros
            </button>
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-10">
            <button onClick={() => { setPage(p => p + 1); fetchProducts() }} disabled={loading}
              className="btn-press px-8 py-3 liquid-glass text-k-ink font-semibold text-sm rounded-xl hover:bg-white/50 transition-colors">
              {loading ? 'Cargando…' : 'Ver más productos'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
