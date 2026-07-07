/**
 * Módulo 13 — Membresías de Kuska.
 *
 * IMPORTANTE: el sistema de NIVELES de Gamificación (Módulo 12:
 * Aprendiz → Artesano → Maestro → Gran Maestro → Leyenda) es un sistema
 * INDEPENDIENTE que se gana con actividad y está disponible para todos
 * sin importar el plan. El plan pagado "Artesano Maestro" coincide en
 * nombre con el nivel "Maestro" por casualidad — no fusionar.
 */

export type ArtisanPlan = 'semilla' | 'pro' | 'maestro'
export type ClientPlan = 'explorador' | 'coleccionista'
export type PlanId = ArtisanPlan | ClientPlan

export interface MembershipPlan {
  id: PlanId
  role: 'artesano' | 'cliente'
  name: string
  price: number // S/ por mes; 0 = gratis
  tagline: string
  features: string[]
  highlight?: boolean
}

export const ARTISAN_PLANS: MembershipPlan[] = [
  {
    id: 'semilla',
    role: 'artesano',
    name: 'Artesano Semilla',
    price: 0,
    tagline: 'Todo lo esencial para vender, gratis para siempre.',
    features: [
      'Productos publicados sin límite',
      'Marketplace completo',
      'Chat en tiempo real con clientes',
      'Checkout y pagos',
      'Puntos y niveles (gamificación para todos)',
      'Certificado de autenticidad con QR',
      'Ferias Digitales — stand virtual',
      'Red Agrupación — ferias físicas entre artesanos',
    ],
  },
  {
    id: 'pro',
    role: 'artesano',
    name: 'Artesano Pro',
    price: 29,
    tagline: 'Herramientas para crecer y contar tu historia.',
    highlight: true,
    features: [
      'Todo lo de Semilla',
      'Módulo Raíces completo (historia, galería, video, audio, árbol genealógico)',
      'Academia Kuska',
      'Descripciones de producto con IA sin límite',
      'Reportes semanales automáticos del negocio',
    ],
  },
  {
    id: 'maestro',
    role: 'artesano',
    name: 'Artesano Maestro',
    price: 79,
    tagline: 'El taller completo de un negocio artesanal profesional.',
    features: [
      'Todo lo de Pro',
      'Hub de Capitalización (fondos y convocatorias)',
      'CFO-bot avanzado: predicción de ventas + alertas',
      'Prioridad de visibilidad en marketplace y ferias',
      'Catálogo PDF profesional',
      'Widget embebible /widget/[region]',
      'Match artesano-emprendedor vía IA',
    ],
  },
]

export const CLIENT_PLANS: MembershipPlan[] = [
  {
    id: 'explorador',
    role: 'cliente',
    name: 'Cliente Explorador',
    price: 0,
    tagline: 'Descubre y apoya el arte peruano, gratis.',
    features: [
      'Navegación y compra estándar',
      'Favoritos',
      'Chat con artesanos',
      'Wishlist pública',
      'Puntos y ruleta de descuentos diaria',
    ],
  },
  {
    id: 'coleccionista',
    role: 'cliente',
    name: 'Cliente Coleccionista',
    price: 19,
    tagline: 'Para quienes viven el arte peruano todo el año.',
    highlight: true,
    features: [
      'Todo lo de Explorador',
      'Caja mensual artesanal (suscripción)',
      'Acceso anticipado a colecciones y ferias nuevas',
      'Prioridad en pedidos personalizados',
    ],
  },
]

export const ALL_PLANS = [...ARTISAN_PLANS, ...CLIENT_PLANS]

export function getPlan(id: string): MembershipPlan | undefined {
  return ALL_PLANS.find((p) => p.id === id)
}

/**
 * MODO DEMO — desbloquea todos los módulos con gate de plan (CFO-Bot,
 * Match IA, Descripciones IA, Raíces, Academia, Capitalización) sin
 * importar la membresía del usuario. Los planes y /precios siguen
 * visibles como parte del modelo de negocio.
 * Para reactivar los gates de pago: cambiar a `false` — nada más.
 */
export const DEMO_UNLOCK_ALL_PLANS = true

const ARTISAN_PLAN_ORDER: ArtisanPlan[] = ['semilla', 'pro', 'maestro']

/** ¿El plan `tier` incluye lo que exige `required`? (respeta el modo demo) */
export function hasPlanAccess(tier: string | null | undefined, required: ArtisanPlan): boolean {
  if (DEMO_UNLOCK_ALL_PLANS) return true
  const current = ARTISAN_PLAN_ORDER.indexOf((tier ?? 'semilla') as ArtisanPlan)
  return current >= ARTISAN_PLAN_ORDER.indexOf(required)
}

/** Módulo 12 — nombres de nivel de gamificación (independiente de membresías). */
const LEVEL_NAMES = ['Aprendiz', 'Artesano', 'Maestro', 'Gran Maestro', 'Leyenda'] as const

export function levelName(level: number): string {
  return LEVEL_NAMES[Math.min(Math.max(level, 1), LEVEL_NAMES.length) - 1]
}
