'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

export interface AcademiaArticle {
  id: string
  title: string
  excerpt: string
  cover_url: string | null
  tags: string[]
  author: string
  published_label: string | null
}

const EASE = [0.4, 0, 0.2, 1] as const

export function AcademiaBrowser({ articles }: { articles: AcademiaArticle[] }) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string>('all')

  // Categorías reales derivadas de los tags de los artículos publicados.
  const tags = useMemo(() => {
    const set = new Set<string>()
    articles.forEach((a) => a.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
  }, [articles])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return articles.filter((a) => {
      const matchesTag = activeTag === 'all' || a.tags.includes(activeTag)
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      return matchesTag && matchesQuery
    })
  }, [articles, query, activeTag])

  return (
    <div className="mt-6">
      {/* Buscador */}
      <div className="relative max-w-md">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-kuska-text-mid"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar lección, autor o tema…"
          className="w-full rounded-input border border-kuska-border bg-white py-2.5 pl-11 pr-4 font-body text-sm text-kuska-text placeholder:text-kuska-text-mid/60 focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/25"
        />
      </div>

      {/* Filtro por categoría */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {[['all', 'Todas'] as const, ...tags.map((t) => [t, t] as const)].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setActiveTag(value)}
              className={`rounded-full border px-3.5 py-1.5 font-nunito text-xs font-bold transition-colors ${
                activeTag === value
                  ? 'border-kuska-teal/40 bg-kuska-teal/12 text-kuska-teal'
                  : 'border-kuska-border bg-white text-kuska-text-mid hover:border-kuska-teal/25 hover:text-kuska-teal'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <span className="text-4xl">🔍</span>
          <p className="mt-3 font-body text-kuska-text-mid">
            No encontramos lecciones con esos filtros. Prueba con otra búsqueda.
          </p>
        </div>
      ) : (
        <motion.div layout className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="overflow-hidden rounded-card border border-kuska-border bg-white transition-transform hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(61,28,2,0.10)]"
              >
                {p.cover_url && (
                  <div className="relative h-40 w-full">
                    <Image src={p.cover_url} alt={p.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  {p.tags[0] && (
                    <span className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-teal">
                      {p.tags[0]}
                    </span>
                  )}
                  <h3 className="mt-1 font-display text-lg font-bold text-kuska-text">{p.title}</h3>
                  <p className="mt-1.5 font-body text-sm text-kuska-text-mid line-clamp-3">{p.excerpt}</p>
                  <p className="mt-3 font-body text-xs text-kuska-text-mid">
                    {p.author}
                    {p.published_label && <> · {p.published_label}</>}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
