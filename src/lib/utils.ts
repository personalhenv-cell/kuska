import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Combina clases de Tailwind resolviendo conflictos. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Formatea un precio en Soles peruanos: 49.9 -> "S/ 49.90". */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(value)
}

/** Formatea una fecha en español peruano: "29 de junio de 2026". */
export function formatDate(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** Saludo según la hora local: "Buenos días" / "Buenas tardes" / "Buenas noches". */
export function timeGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

/** Genera un slug URL-safe a partir de un texto. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/**
 * Normaliza y valida un teléfono peruano.
 * Acepta: 999888777, +51999888777, 51 999 888 777, etc.
 * Devuelve el número de 9 dígitos (sin prefijo país) o null si es inválido.
 */
export function normalizePeruPhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-()+]/g, '')
  const match = cleaned.match(/^(?:51)?(9\d{8})$/)
  return match ? match[1] : null
}

/** Genera un código OTP numérico de 6 dígitos. */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/** Saludo según la hora del día (zona horaria de Perú). */
export function greetingByHour(date: Date = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat('es-PE', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'America/Lima',
    }).format(date),
  )
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}
