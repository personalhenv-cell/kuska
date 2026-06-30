'use client'

import { type Dispatch, type SetStateAction } from 'react'
import { cn } from '@/lib/utils'
import type { FiltersState } from '@/types/marketplace'

const REGIONS = [
  'Cusco', 'Puno', 'Ayacucho', 'Junín', 'Lima', 'Arequipa',
  'Amazonas', 'Piura', 'Loreto', 'Cajamarca',
]
const TECHNIQUES = [
  'Telar de cintura', 'Telar de pedal', 'Modelado', 'Cerámica', 'Retablo',
  'Filigrana', 'Tapicería', 'Tallado', 'Bordado', 'Macramé',
]
const CATEGORIES = [
  'Textiles', 'Cerámica', 'Joyería', 'Retablos', 'Madera', 'Cuero', 'Gobelino',
]

interface FiltersSidebarProps {
  filters: FiltersState
  setFilters: Dispatch<SetStateAction<FiltersState>>
  onReset: () => void
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <h4 className="mb-2.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
        {title}
      </h4>
      <div className="space-y-1">
        <button
          onClick={() => onChange('')}
          className={cn(
            'block w-full rounded-lg px-3 py-1.5 text-left font-body text-sm transition-colors',
            value === ''
              ? 'bg-kuska-brown text-kuska-cream'
              : 'text-kuska-text-mid hover:bg-kuska-cream-dark',
          )}
        >
          Todos
        </button>
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(value === o ? '' : o)}
            className={cn(
              'block w-full rounded-lg px-3 py-1.5 text-left font-body text-sm transition-colors',
              value === o
                ? 'bg-kuska-brown text-kuska-cream'
                : 'text-kuska-text-mid hover:bg-kuska-cream-dark',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

export function FiltersSidebar({ filters, setFilters, onReset }: FiltersSidebarProps) {
  const set =
    (key: keyof FiltersState) => (value: string) =>
      setFilters((prev) => ({ ...prev, [key]: value }))

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')

  return (
    <aside className="space-y-6 rounded-glass border border-kuska-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-kuska-text">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="font-body text-xs font-semibold text-kuska-red hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Precio */}
      <div>
        <h4 className="mb-2.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
          Precio (S/)
        </h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => set('minPrice')(e.target.value)}
            className="h-9 w-full rounded-btn border border-kuska-border px-3 font-body text-sm focus:border-kuska-gold focus:outline-none"
          />
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice')(e.target.value)}
            className="h-9 w-full rounded-btn border border-kuska-border px-3 font-body text-sm focus:border-kuska-gold focus:outline-none"
          />
        </div>
      </div>

      <FilterGroup title="Región" options={REGIONS} value={filters.region} onChange={set('region')} />
      <FilterGroup title="Técnica" options={TECHNIQUES} value={filters.technique} onChange={set('technique')} />
      <FilterGroup title="Categoría" options={CATEGORIES} value={filters.category} onChange={set('category')} />
    </aside>
  )
}
