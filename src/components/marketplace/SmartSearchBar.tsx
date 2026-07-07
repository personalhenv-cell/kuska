'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Suggestion {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
}

interface SmartSearchBarProps {
  onSearch?: (query: string) => void
  onRegionFilter?: (region: string) => void
}

const POPULAR_SEARCHES = ['Textiles', 'Cerámica', 'Joyería', 'Cusco', 'Ayacucho']

export function SmartSearchBar({ onSearch }: SmartSearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('search_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(q)}&limit=8`)
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data.suggestions)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(query), 300)
    return () => clearTimeout(timer)
  }, [query, fetchSuggestions])

  const handleSearch = (q: string = query) => {
    if (!q.trim()) return
    const newHistory = [q, ...history.filter((h) => h !== q)].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem('search_history', JSON.stringify(newHistory))
    onSearch?.(q)
    router.push(`/marketplace?q=${encodeURIComponent(q)}`)
    setShowSuggestions(false)
    setQuery('')
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Busca por nombre, región, técnica..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full rounded-btn border border-kuska-border bg-white px-4 py-2 font-body text-sm placeholder:text-kuska-text-mid focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
        />
        <button
          onClick={() => handleSearch()}
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-kuska-text-mid hover:text-kuska-gold"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {showSuggestions && (query || history.length > 0 || POPULAR_SEARCHES) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-card border border-kuska-border bg-white shadow-lg">
          {query ? (
            <>
              {loading && (
                <div className="px-4 py-3 text-center font-body text-sm text-kuska-text-mid">
                  Buscando...
                </div>
              )}
              {!loading && suggestions.length > 0 && (
                <div>
                  <p className="px-4 pt-3 font-nunito text-xs font-bold uppercase text-kuska-text-mid">Productos</p>
                  {suggestions.map((s) => (
                    <Link
                      key={s.id}
                      href={`/producto/${s.slug}`}
                      className="flex gap-2 px-4 py-2 hover:bg-kuska-cream"
                      onClick={() => setShowSuggestions(false)}
                    >
                      {s.images[0] && (
                        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded">
                          <Image src={s.images[0]} alt={s.name} fill className="object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body text-sm font-medium text-kuska-text">{s.name}</p>
                        <p className="font-nunito text-xs text-kuska-gold">{s.price.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {!loading && suggestions.length === 0 && query.length >= 2 && (
                <div className="px-4 py-3 text-center font-body text-sm text-kuska-text-mid">
                  No encontramos productos con "{query}"
                </div>
              )}
            </>
          ) : (
            <>
              {history.length > 0 && (
                <div>
                  <p className="px-4 pt-3 font-nunito text-xs font-bold uppercase text-kuska-text-mid">Últimas búsquedas</p>
                  {history.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => {
                        setQuery(h)
                        handleSearch(h)
                      }}
                      className="block w-full px-4 py-2 text-left font-body text-sm text-kuska-text hover:bg-kuska-cream"
                    >
                      🔍 {h}
                    </button>
                  ))}
                </div>
              )}
              <div>
                <p className="px-4 pt-3 font-nunito text-xs font-bold uppercase text-kuska-text-mid">Trending</p>
                {POPULAR_SEARCHES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setQuery(p)
                      handleSearch(p)
                    }}
                    className="block w-full px-4 py-2 text-left font-body text-sm text-kuska-text-mid hover:bg-kuska-cream hover:text-kuska-text"
                  >
                    ⭐ {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
