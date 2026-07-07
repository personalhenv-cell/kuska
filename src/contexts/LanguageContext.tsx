'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'es' | 'qu' | 'en'

type Dict = Record<string, string>

const translations: Record<Lang, Dict> = {
  es: {
    login: 'Ingresar',
    register: 'Registrarse',
    logout: 'Salir',
    myPanel: 'Mi panel',
    hello: 'Hola',
    home: 'Inicio',
    marketplace: 'Marketplace',
    community: 'Comunidad',
    academy: 'Academia',
    products: 'Productos',
    dashboard: 'Panel',
    search: 'Buscar',
    profile: 'Perfil',
    favorites: 'Favoritos',
    orders: 'Pedidos',
    artisan: 'Artesano',
    goodbye: 'Hasta luego',
    welcome: 'Bienvenido',
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    send: 'Enviar',
    upload: 'Subir',
  },
  qu: {
    login: 'Yaykuy',
    register: 'Qillqakuy',
    logout: 'Lluqsiy',
    myPanel: 'Tinkuyniy',
    hello: 'Rimaykullayki',
    home: 'Qallariy',
    marketplace: 'Rantikunay',
    community: 'Llaqta',
    academy: 'Yachay Wasi',
    products: 'Llamkay',
    dashboard: 'Tinkuy',
    search: 'Maskay',
    profile: 'Ñuqamanta',
    favorites: 'Munasqa',
    orders: 'Mañasqa',
    artisan: 'Llamkaqkuna',
    goodbye: 'Tupananchiskama',
    welcome: 'Allin Hamusqayki',
    loading: 'Rikurimushan...',
    save: 'Waqaychay',
    cancel: 'Saqiy',
    send: 'Kachay',
    upload: 'Wichariy',
  },
  en: {
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Sign Out',
    myPanel: 'My Panel',
    hello: 'Hi',
    home: 'Home',
    marketplace: 'Marketplace',
    community: 'Community',
    academy: 'Academy',
    products: 'Products',
    dashboard: 'Dashboard',
    search: 'Search',
    profile: 'Profile',
    favorites: 'Favorites',
    orders: 'Orders',
    artisan: 'Artisan',
    goodbye: 'Goodbye',
    welcome: 'Welcome',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    send: 'Send',
    upload: 'Upload',
  },
}

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: keyof typeof translations.es) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'kuska-lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
    if (stored && stored in translations) setLangState(stored)
  }, [])

  const setLang = (next: Lang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next === 'qu' ? 'qu' : next
  }

  const t = (key: keyof typeof translations.es) =>
    translations[lang][key] ?? translations.es[key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage debe usarse dentro de <LanguageProvider>')
  }
  return ctx
}
