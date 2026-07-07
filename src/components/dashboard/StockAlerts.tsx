'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface StockProduct {
  id: string
  name: string
  slug: string
  stock: number
  price: number
  images: string[]
  salesPerDay: number
  daysUntilOutOfStock: number | null
}

interface StockAlertsData {
  lowStockProducts: StockProduct[]
  critical: StockProduct[]
  totalProducts: number
}

export function StockAlerts() {
  const [data, setData] = useState<StockAlertsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/artesano/stock-alerts')
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="h-64 bg-gradient-to-r from-kuska-cream to-transparent animate-pulse rounded-card" />
  }

  if (!data || data.lowStockProducts.length === 0) {
    return (
      <div className="rounded-card border border-kuska-border bg-white p-6">
        <h2 className="font-display font-bold text-kuska-text">Stock Disponible</h2>
        <p className="mt-2 font-body text-sm text-kuska-text-mid">
          ✓ Todos tus productos tienen stock suficiente
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-card border border-kuska-border bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-kuska-text">Alertas de Stock</h2>
          <p className="mt-1 font-body text-sm text-kuska-text-mid">
            {data.critical.length} producto{data.critical.length !== 1 ? 's' : ''} crítico{data.critical.length !== 1 ? 's' : ''} • {data.lowStockProducts.length} bajo stock
          </p>
        </div>
      </div>

      {data.critical.length > 0 && (
        <div className="mt-4 rounded-btn border-l-4 border-kuska-red bg-kuska-red/5 p-3">
          <p className="font-nunito text-xs font-bold uppercase text-kuska-red">🚨 Crítico: Reponer ahora</p>
          <p className="mt-1 font-body text-sm text-kuska-text">
            {data.critical.map((p) => p.name).join(', ')}
          </p>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {data.lowStockProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-btn border border-kuska-border/50 bg-kuska-cream/30 p-3">
            <div className="min-w-0 flex-1">
              <Link href={`/dashboard/artesano/productos/${product.slug}`} className="font-body font-semibold text-kuska-text hover:text-kuska-gold">
                {product.name}
              </Link>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={product.stock <= 2 ? 'region' : 'technique'}>
                  {product.stock} en stock
                </Badge>
                {product.salesPerDay > 0 && (
                  <>
                    <span className="font-nunito text-xs text-kuska-text-mid">
                      {product.salesPerDay}/día
                    </span>
                    {product.daysUntilOutOfStock && product.daysUntilOutOfStock <= 7 && (
                      <span className="font-nunito text-xs font-bold text-kuska-red">
                        Se agota en {product.daysUntilOutOfStock} día{product.daysUntilOutOfStock !== 1 ? 's' : ''}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="ml-4 text-right flex-shrink-0">
              <p className="font-display font-bold text-kuska-text">{formatPrice(product.price)}</p>
              <Link
                href={`/dashboard/artesano/productos/nuevo?edit=${product.slug}`}
                className="mt-1 inline-block font-body text-xs font-semibold text-kuska-gold hover:underline"
              >
                Actualizar
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/artesano/productos/nuevo"
        className="mt-4 block rounded-btn bg-kuska-gold py-2 text-center font-body font-semibold text-kuska-brown transition-transform hover:scale-105"
      >
        + Agregar Nuevo Producto
      </Link>
    </div>
  )
}
