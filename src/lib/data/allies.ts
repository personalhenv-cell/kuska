/**
 * Aliados estratégicos de Kuska.
 * `slug` → nombre del archivo en /public/alianzas/<slug>.png (logo oficial).
 * `color` → color de marca usado por el chip de respaldo cuando no hay logo.
 */
export interface Ally {
  slug: string
  name: string
  tagline: string
  color: string
  url?: string
}

export const ALLIES_INCUBA: Ally[] = [
  { slug: 'scale',       name: 'Scale',              tagline: 'Incubadora de Triple Impacto (ProInnóvate)', color: '#8B7FE8', url: 'https://scaleximpacto.com' },
  { slug: 'wichay',      name: 'Wichay Continental', tagline: 'Hub Multirregional · Universidad Continental', color: '#6D28D9', url: 'https://ucontinental.edu.pe' },
  { slug: 'utec',        name: 'UTEC Ventures',      tagline: 'Aceleradora Tecnológica · UTEC',              color: '#1B4D5C', url: 'https://utecventures.com' },
  { slug: 'emprende-up', name: 'Emprende UP',        tagline: 'Incubadora Multisectorial · U. del Pacífico', color: '#16A6E9', url: 'https://emprendeup.pe' },
]

export const ALLIES_FINANCIAN: Ally[] = [
  { slug: 'bcp',         name: 'BCP Contigo Emprendedor', tagline: 'Programa de impulso emprendedor del BCP', color: '#003087', url: 'https://www.viabcp.com' },
  { slug: 'intercorp',   name: 'Intercorp',               tagline: 'Grupo empresarial · Prompro',             color: '#0E4DA4', url: 'https://intercorp.com.pe' },
  { slug: 'proinnovate', name: 'ProInnóvate',             tagline: 'Startup Perú · Ministerio de la Producción', color: '#E0314B', url: 'https://proinnovate.gob.pe' },
  { slug: 'wiese',       name: 'Fundación Wiese',         tagline: 'Educación, cultura y desarrollo social',  color: '#8E2A6B', url: 'https://www.fundacionwiese.org' },
]

export const ALLIES_INSTITUCIONAL: Ally[] = [
  { slug: 'grupo-romero', name: 'Grupo Romero', tagline: 'Responsabilidad Social Empresarial', color: '#D24E33', url: 'https://www.gruporomero.com.pe' },
  { slug: 'becas-romero', name: 'Becas Romero', tagline: 'Material educativo para artesanos',  color: '#B23A2E', url: 'https://www.becaromero.pe' },
]

export const ALLIES_ALL: Ally[] = [
  ...ALLIES_INCUBA,
  ...ALLIES_FINANCIAN,
  ...ALLIES_INSTITUCIONAL,
]

/** Subconjunto para la tira "Confían en Kuska" / footer. */
export const ALLIES_STRIP: Ally[] = [
  ALLIES_INCUBA[0],     // Scale
  ALLIES_INCUBA[1],     // Wichay Continental
  ALLIES_FINANCIAN[2],  // ProInnóvate
  ALLIES_FINANCIAN[0],  // BCP
  ALLIES_FINANCIAN[1],  // Intercorp
  ALLIES_INSTITUCIONAL[0], // Grupo Romero
]
