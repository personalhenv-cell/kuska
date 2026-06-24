'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: string; title: string; price: number; status: string
  stock: number; views: number
  images: { url: string }[]
  category: { name: string }
  heritageStory: { id: string } | null
}

const STATUS: Record<string, { label: string; color: string }> = {
  DRAFT:          { label: 'Borrador',    color: 'bg-gray-100 text-gray-600' },
  PENDING_REVIEW: { label: 'En revisión', color: 'bg-amber-100 text-amber-700' },
  ACTIVE:         { label: 'Activo',      color: 'bg-green-100 text-green-700' },
  PAUSED:         { label: 'Pausado',     color: 'bg-blue-100 text-blue-700' },
  SOLD_OUT:       { label: 'Agotado',     color: 'bg-red-100 text-red-700' },
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetch('/api/products/mine')
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="bg-white border-b border-[#3D1C02]/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/artesano/dashboard" className="text-[#3D1C02]/50 hover:text-[#C84B2F] transition-colors text-sm">
            ← Dashboard
          </Link>
          <h1 className="font-bold text-[#3D1C02]" style={{ fontFamily: 'serif' }}>Mis productos</h1>
        </div>
        <Link href="/artesano/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-[#C84B2F] text-white font-semibold rounded-xl hover:bg-[#A83A22] transition-all hover:scale-105 text-sm">
          + Nuevo producto
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-[#F5F0E8]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#F5F0E8] rounded w-3/4" />
                  <div className="h-3 bg-[#F5F0E8] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">📦</span>
            <h2 className="text-xl font-bold text-[#3D1C02] mb-2" style={{ fontFamily: 'serif' }}>
              Aún no tienes productos
            </h2>
            <p className="text-[#3D1C02]/50 mb-6 text-sm">Agrega tu primera pieza al marketplace</p>
            <Link href="/artesano/productos/nuevo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C84B2F] text-white font-bold rounded-xl hover:bg-[#A83A22] transition-all hover:scale-105">
              + Subir mi primer producto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#3D1C02]/8 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="h-40 bg-gradient-to-br from-[#F5F0E8] to-[#EDE5D8] flex items-center justify-center">
                  {p.images?.[0]?.url
                    ? <img src={p.images[0].url} alt={p.title} className="h-full w-full object-cover" />
                    : <span className="text-4xl">📷</span>
                  }
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#3D1C02] text-sm">{p.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${STATUS[p.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS[p.status]?.label || p.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#3D1C02]/50 mb-3">{p.category?.name}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-[#3D1C02]">S/ {p.price}</span>
                    <div className="flex items-center gap-3 text-xs text-[#3D1C02]/40">
                      <span>👁️ {p.views}</span>
                      <span>📦 {p.stock}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/artesano/productos/${p.id}`}
                      className="flex-1 text-center py-1.5 border border-[#3D1C02]/20 text-[#3D1C02] text-xs font-medium rounded-lg hover:border-[#C84B2F] hover:text-[#C84B2F] transition-colors">
                      Editar
                    </Link>
                    {p.heritageStory
                      ? <span className="flex-1 text-center py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-lg">🌿 Con historia</span>
                      : <Link href={`/artesano/raices?productId=${p.id}`}
                          className="flex-1 text-center py-1.5 bg-[#2E7A6E]/10 text-[#2E7A6E] text-xs font-medium rounded-lg hover:bg-[#2E7A6E]/20 transition-colors">
                          + Raíces
                        </Link>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
