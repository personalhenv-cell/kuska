'use client'

import { useLanguage, type Lang } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

const options: { value: Lang; label: string }[] = [
  { value: 'es', label: 'ES' },
  { value: 'qu', label: 'QU' },
  { value: 'en', label: 'EN' },
]

export function LanguageToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLanguage()
  const activeIndex = options.findIndex((o) => o.value === lang)

  return (
    <div
      className={cn(
        'relative inline-flex items-center rounded-full p-1',
        dark ? 'bg-white/10' : 'bg-kuska-cream-dark',
      )}
    >
      <span
        className="absolute top-1 h-7 w-9 rounded-full bg-kuska-gold transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: `translateX(${activeIndex * 36}px)` }}
        aria-hidden
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLang(o.value)}
          aria-pressed={lang === o.value}
          className={cn(
            'relative z-10 h-7 w-9 rounded-full font-nunito text-xs font-bold transition-colors',
            lang === o.value
              ? 'text-kuska-brown'
              : dark
                ? 'text-white/70'
                : 'text-kuska-text-mid',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
