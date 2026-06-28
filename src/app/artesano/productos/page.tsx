'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface Product {
  id: string; title: string; slug: string; price: number; stock: number
  status: string; views: number; primary_image: string | null; created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:         '#2E7A6E',
  DRAFT:          '#D4920A',
  PENDING_REVIEW: '#C84B2F',
  PAUSED:         'rgba(240,234,224,0.3)',
  SOLD_OUT:       '#C84B2F',
}
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo', DRAFT: 'Borrador', PENDING_REVIEW: 'En revisión', PAUSED: 'Pausado', SOLD_OUT: 'Agotado',
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetch('/api/products/mine').then(r => r.json()).then(d => setProducts(d.data ?? [])).catch(() => toast.error('Error al cargar')).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Mis Productos</h1>
          <p className="text-[#F0EAE0]/40 text-sm mt-1">{products.length} productos en tu catálogo</p>
        </div>
        <Link href="/artesano/productos/nuevo"
          className="btn-press flex items-center gap-2 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors duration-150">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo producto
        </Link>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-[#1A1208] shimmer-bg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#F0EAE0]/5 rounded shimmer-bg" />
                <div className="h-3 bg-[#F0EAE0]/5 rounded shimmer-bg w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 glass rounded-3xl">
          <div className="text-5xl mb-4">🏺</div>
          <h2 className="text-[#F0EAE0]/60 font-medium mb-2">Aún no tienes productos</h2>
          <p className="text-[#F0EAE0]/30 text-sm mb-6">Crea tu primer producto y empieza a vender.</p>
          <Link href="/artesano/productos/nuevo"
            className="btn-press inline-flex items-center gap-2 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors duration-150">
            Crear primer producto
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.05 }}>
              <div className="glass card-hover rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] relative bg-[#1A1208]">
                  {p.primary_image ? (
                    <Image src={p.primary_image} alt={p.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🏺</div>
                  )}
                  <div className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background: `${STATUS_COLORS[p.status]}25`, color: STATUS_COLORS[p.status], border: `1px solid ${STATUS_COLORS[p.status]}40` }}>
                    {STATUS_LABELS[p.status] ?? p.status}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[#F0EAE0] font-medium text-sm leading-tight mb-1 line-clamp-2">{p.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#D4920A] font-bold">S/. {p.price.toFixed(2)}</span>
                    <span className="text-[#F0EAE0]/35 text-xs">👁 {p.views} vistas</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link href={`/artesano/productos/${p.id}/editar`}
                      className="btn-press flex-1 text-center text-xs py-2 rounded-xl glass border border-[#F0EAE0]/10 text-[#F0EAE0]/60 hover:text-[#F0EAE0] transition-colors duration-150">
                      Editar
                    </Link>
                    <Link href={`/marketplace/${p.slug}`}
                      className="btn-press flex-1 text-center text-xs py-2 rounded-xl glass border border-[#F0EAE0]/10 text-[#F0EAE0]/60 hover:text-[#F0EAE0] transition-colors duration-150">
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
