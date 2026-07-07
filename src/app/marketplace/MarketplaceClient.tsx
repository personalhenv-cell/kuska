'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { FiltersSidebar } from '@/components/marketplace/FiltersSidebar'
import { SmartSearchBar } from '@/components/marketplace/SmartSearchBar'
import { SkeletonGrid } from '@/components/ui/SkeletonCard'
import { Kusi } from '@/components/ui/Kusi'
import type { FiltersState, ProductListItem, ProductsResponse } from '@/types/marketplace'

const LIMIT = 12
const EMPTY_FILTERS: FiltersState = {
  q: '', region: '', technique: '', category: '', minPrice: '', maxPrice: '',
}

function buildUrl(filters: FiltersState, page: number): string {
  const params = new URLSearchParams()
  params.set('limit', String(LIMIT))
  params.set('page', String(page))
  if (filters.q) params.set('q', filters.q)
  if (filters.region) params.set('region', filters.region)
  if (filters.technique) params.set('technique', filters.technique)
  if (filters.category) params.set('category', filters.category)
  if (filters.minPrice) params.set('minPrice', filters.minPrice)
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
  return `/api/products?${params}`
}

export function MarketplaceClient() {
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS)
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const activeFilters = useRef<FiltersState>(EMPTY_FILTERS)
  const currentPage = useRef(1)
  // Contador de secuencia: si llega una respuesta vieja después de una más
  // nueva (filtros cambiados rápido, sin debounce, o scroll rápido), se
  // descarta en vez de pisar el estado — esto era lo que dejaba la UI en un
  // estado híbrido (skeleton + estado vacío mezclados) al filtrar rápido.
  const requestSeq = useRef(0)

  const fetchProducts = useCallback(
    async (appliedFilters: FiltersState, nextPage: number, replace = false) => {
      const seq = ++requestSeq.current
      setLoading(true)
      try {
        const res = await fetch(buildUrl(appliedFilters, nextPage))
        if (seq !== requestSeq.current || !res.ok) return
        const data: ProductsResponse = await res.json()
        if (seq !== requestSeq.current) return
        setProducts((prev) => (replace ? data.products : [...prev, ...data.products]))
        setHasMore(nextPage < data.meta.pages)
        setPage(nextPage)
        currentPage.current = nextPage
      } finally {
        if (seq === requestSeq.current) setLoading(false)
      }
    },
    [],
  )

  // Carga inicial
  useEffect(() => {
    activeFilters.current = EMPTY_FILTERS
    fetchProducts(EMPTY_FILTERS, 1, true)
  }, [fetchProducts])

  // Semilla de filtros desde la URL (?region=...) — p.ej. al llegar desde el
  // mapa de artesanos de la landing. Corre una sola vez tras montar; el guard
  // de secuencia (requestSeq) descarta la respuesta inicial más vieja.
  useEffect(() => {
    const region = new URLSearchParams(window.location.search).get('region')
    if (region) setFilters((prev) => ({ ...prev, region }))
  }, [])

  // Cuando cambian los filtros, reiniciar
  useEffect(() => {
    activeFilters.current = filters
    currentPage.current = 1
    fetchProducts(filters, 1, true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  // Infinite scroll con IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && products.length > 0) {
          fetchProducts(activeFilters.current, currentPage.current + 1)
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, fetchProducts, products.length])

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-kuska-text">
            Marketplace
          </h1>
          <p className="font-body text-kuska-text-mid">
            Arte peruano hecho a mano con historia
          </p>
        </div>
        <SmartSearchBar
          value={filters.q}
          onSearch={(q) => setFilters((prev) => ({ ...prev, q }))}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FiltersSidebar
          filters={filters}
          setFilters={setFilters}
          onReset={resetFilters}
        />

        <main>
          {loading && products.length === 0 && <SkeletonGrid />}

          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <Kusi size="md" animation="think" message="No encontré piezas con esos filtros 🔍" />
              <button
                onClick={resetFilters}
                className="mt-6 font-body font-semibold text-kuska-red hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {products.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Sentinel de infinite scroll */}
          <div ref={sentinelRef} className="h-4" aria-hidden />
          {loading && products.length > 0 && (
            <div className="mt-6">
              <SkeletonGrid count={3} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
