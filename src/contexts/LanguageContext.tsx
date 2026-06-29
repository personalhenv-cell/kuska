'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type Lang = 'es' | 'qu'

const STORAGE_KEY = 'kuska_lang_v7'

/** Diccionario base ES/QU para la UI pública. Las claves faltantes caen a ES. */
const DICT: Record<string, { es: string; qu: string }> = {
  'nav.marketplace':  { es: 'Marketplace',          qu: 'Qhatu' },
  'nav.alianzas':     { es: 'Alianzas',             qu: 'Yanapaqkuna' },
  'nav.nosotros':     { es: 'Nosotros',             qu: 'Ñuqayku' },
  'nav.login':        { es: 'Ingresar',             qu: 'Yaykuy' },
  'nav.registro':     { es: 'Únete',                qu: 'Hukllachakuy' },
  'cta.explore':      { es: 'Explorar artesanías',  qu: 'Maki ruwaykuna' },
  'cta.sell':         { es: 'Vender mis productos', qu: 'Ruwayniyta qhatuy' },
  'hero.tagline':     { es: 'Juntos, tejemos el futuro de la artesanía peruana',
                        qu: 'Kuska, Perú maki ruwaypa hamuq pachanta awanchik' },
  'common.greeting':  { es: '¡Hola!',               qu: '¡Napaykullayki!' },
  'common.together':  { es: '¡Todos juntos!',       qu: '¡Llapanchik kuska!' },
  'common.loading':   { es: 'Cargando…',            qu: 'Aysamushan…' },
  'footer.support':   { es: 'Con el apoyo de',      qu: 'Yanapaywan' },
  'allies.title':     { es: 'Confían en Kuska',     qu: 'Kuskapi iñinku' },
}

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: string) => string
  ready: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (stored === 'es' || stored === 'qu') setLangState(stored)
    } catch { /* localStorage no disponible */ }
    setReady(true)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(STORAGE_KEY, l) } catch { /* noop */ }
    if (typeof document !== 'undefined') document.documentElement.lang = l === 'qu' ? 'qu' : 'es'
  }, [])

  const toggle = useCallback(() => setLang(lang === 'es' ? 'qu' : 'es'), [lang, setLang])

  const t = useCallback(
    (key: string) => {
      const entry = DICT[key]
      if (!entry) return key
      return entry[lang] ?? entry.es
    },
    [lang],
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t, ready }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>')
  return ctx
}
