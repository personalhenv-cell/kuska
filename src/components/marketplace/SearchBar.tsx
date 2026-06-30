'use client'

import { useEffect, useRef, useState } from 'react'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Buscar arte peruano…' }: SearchBarProps) {
  const [local, setLocal] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setLocal(value)
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setLocal(v)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange(v), 300)
  }

  return (
    <div className="relative w-full max-w-xl">
      <svg
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-kuska-text-mid"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="search"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-12 w-full rounded-btn border border-kuska-border bg-white pl-11 pr-4 font-body text-kuska-text placeholder-kuska-text-mid shadow-sm transition-all focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
      />
    </div>
  )
}
