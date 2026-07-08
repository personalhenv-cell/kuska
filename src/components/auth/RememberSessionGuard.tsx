'use client'

import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

/**
 * Hace real la opción "Mantener sesión iniciada" del login.
 *
 * NextAuth (JWT) persiste la cookie 30 días por defecto, así que por sí solo
 * no distingue entre "recuérdame" y "solo esta vez". Este guard cubre el caso
 * de quien DESMARCA la opción: usamos dos flags —
 *   - localStorage 'kuska_remember' = '0'  → preferencia persistente del usuario.
 *   - sessionStorage 'kuska_tab_active'      → vive solo mientras dura la
 *     sesión del navegador (se borra al cerrarlo del todo).
 *
 * Si el usuario optó por NO mantener la sesión y detectamos una sesión de
 * navegador nueva (sin 'kuska_tab_active'), cerramos su sesión. Solo actúa
 * cuando el usuario lo pidió explícitamente, nunca por defecto.
 */
export function RememberSessionGuard() {
  const { status } = useSession()

  useEffect(() => {
    if (status !== 'authenticated') return

    const remember = localStorage.getItem('kuska_remember')
    const tabActive = sessionStorage.getItem('kuska_tab_active')

    if (remember === '0' && !tabActive) {
      // Navegador reabierto y el usuario no quería persistir → cerrar sesión.
      signOut({ redirect: false })
      return
    }

    // Marca esta sesión de navegador como activa para no volver a evaluar.
    sessionStorage.setItem('kuska_tab_active', '1')
  }, [status])

  return null
}
