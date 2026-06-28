'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Product {
  id: string; title: string; slug: string; price: number; stock: number
  artisan_name: string; artisan_avatar: string | null; is_verified: boolean
  primary_image: string | null; avg_rating: number; category_name: string; region_name: string | null
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.04 }}
    >
      <Link href={`/marketplace/${product.slug}`} className="block group">
        <div className="glass card-hover rounded-2xl overflow-hidden">
          <div className="aspect-square relative bg-[#1A1208]">
            {product.primary_image ? (
              <Image src={product.primary_image} alt={product.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">🏺</div>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <div className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full"
                style={{ background: 'rgba(212,146,10,0.9)', color: '#060402' }}>
                Últimas {product.stock}
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs text-[#F0EAE0]/35 mb-1 truncate">{product.category_name}{product.region_name ? ` · ${product.region_name}` : ''}</p>
            <h3 className="text-[#F0EAE0] font-medium text-sm leading-tight mb-2 line-clamp-2">{product.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-[#D4920A] font-bold text-base">S/. {product.price.toFixed(2)}</span>
              <div className="flex items-center gap-1.5">
                {product.artisan_avatar ? (
                  <Image src={product.artisan_avatar} alt={product.artisan_name} width={20} height={20} className="rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#3D1C02] flex items-center justify-center text-[8px] text-[#F0EAE0]">
                    {product.artisan_name[0]}
                  </div>
                )}
                <span className="text-[#F0EAE0]/40 text-xs truncate max-w-[80px]">{product.artisan_name}</span>
                {product.is_verified && <span className="text-[10px] text-[#2E7A6E]">✓</span>}
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
    <div className="glass rounded-2xl overflow-hidden">
      <div className="aspect-square bg-[#1A1208] shimmer-bg" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-[#F0EAE0]/5 rounded shimmer-bg w-2/3" />
        <div className="h-4 bg-[#F0EAE0]/5 rounded shimmer-bg" />
        <div className="h-4 bg-[#F0EAE0]/5 rounded shimmer-bg w-3/4" />
        <div className="flex justify-between mt-2">
          <div className="h-5 bg-[#F0EAE0]/5 rounded shimmer-bg w-20" />
          <div className="h-5 bg-[#F0EAE0]/5 rounded shimmer-bg w-24" />
        </div>
      </div>
    </div>
  )
}

const CATEGORIES = ['Todos', 'Textiles', 'Cerámica', 'Joyería', 'Madera', 'Cuero', 'Metal']

export default function MarketplacePage() {
  const [products, setProducts]   = useState<Product[]>([])
  const [loading,  setLoading]    = useState(true)
  const [q,        setQ]          = useState('')
  const [category, setCategory]   = useState('Todos')
  const [page,     setPage]       = useState(1)
  const [hasMore,  setHasMore]    = useState(false)
  const [total,    setTotal]      = useState(0)

  const fetchProducts = useCallback(async (reset = false) => {
    setLoading(true)
    try {
      const currentPage = reset ? 1 : page
      const params = new URLSearchParams({ page: String(currentPage), pageSize: '20' })
      if (q)        params.set('q', q)
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
    <main className="min-h-screen" style={{ background: '#0B0804' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 glass-cream border-b border-[#F0EAE0]/[0.06] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/images/logo.jpeg" alt="Kuska" width={32} height={32} className="rounded-xl" />
            <span className="text-[#F0EAE0] font-bold hidden sm:block" style={{ fontFamily: 'Playfair Display, serif' }}>Kuska</span>
          </Link>
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 border border-[#F0EAE0]/10 rounded-xl px-3 py-2.5"
              style={{ background: 'rgba(240,234,224,0.04)' }}>
              <svg className="w-4 h-4 text-[#F0EAE0]/30 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar artesanías…"
                className="flex-1 bg-transparent text-[#F0EAE0] placeholder:text-[#F0EAE0]/25 outline-none text-sm" />
            </div>
          </div>
          <Link href="/login" className="btn-press text-sm bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-4 py-2 rounded-xl transition-colors duration-150 flex-shrink-0">
            Ingresar
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className="btn-press flex-shrink-0 text-sm px-4 py-2 rounded-full border transition-all duration-150 font-medium"
              style={category === cat
                ? { background: '#C84B2F', borderColor: '#C84B2F', color: '#fff' }
                : { background: 'rgba(240,234,224,0.04)', borderColor: 'rgba(240,234,224,0.1)', color: 'rgba(240,234,224,0.55)' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Total */}
        {!loading && (
          <p className="text-[#F0EAE0]/35 text-sm mb-6">{total} productos encontrados</p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading && products.length === 0
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
          }
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-[#F0EAE0]/40">No encontramos productos con esa búsqueda.</p>
            <button onClick={() => { setQ(''); setCategory('Todos') }}
              className="btn-press mt-4 text-sm text-[#C84B2F] hover:underline">
              Limpiar filtros
            </button>
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-10">
            <button onClick={() => { setPage(p => p + 1); fetchProducts() }}
              disabled={loading}
              className="btn-press px-8 py-3 glass border border-[#F0EAE0]/10 text-[#F0EAE0]/70 hover:text-[#F0EAE0] text-sm rounded-xl transition-colors duration-150">
              {loading ? 'Cargando…' : 'Ver más productos'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
