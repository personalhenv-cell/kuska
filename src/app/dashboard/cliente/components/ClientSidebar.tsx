'use client'

import { useSession } from 'next-auth/react'
import { DashboardNav, type DashNavSection } from '@/components/dashboard/DashboardNav'
import type { Session } from 'next-auth'

type User = Session['user']

export function ClientSidebar({ user }: { user: User }) {
  // El prop `user` viene del server (getServerSession) y solo cambia tras un
  // router.refresh(); la sesión de cliente (useSession) se actualiza al
  // instante cuando el perfil llama a update({ is_entrepreneur }). Tomamos el
  // valor más "encendido" de los dos para que activar el modo emprendedor
  // revele las herramientas IA de inmediato, sin re-login ni recarga.
  const { data: liveSession } = useSession()
  const isEntrepreneur = liveSession?.user?.is_entrepreneur ?? user.is_entrepreneur

  const sections: DashNavSection[] = [
    {
      items: [{ href: '/dashboard/cliente', label: 'Inicio', icon: 'home', exact: true }],
    },
    {
      title: 'Mis compras',
      items: [
        { href: '/dashboard/cliente/pedidos', label: 'Mis pedidos', icon: 'box' },
        { href: '/dashboard/cliente/favoritos', label: 'Favoritos', icon: 'heart' },
        { href: '/marketplace', label: 'Explorar marketplace', icon: 'store' },
      ],
    },
    {
      title: 'Comunidad',
      items: [
        { href: '/dashboard/cliente/mensajes', label: 'Mensajes', icon: 'chat' },
        { href: '/dashboard/cliente/talleres', label: 'Mis talleres', icon: 'workshop' },
        { href: '/dashboard/cliente/comunidad', label: 'Red Cuéntame', icon: 'megaphone' },
      ],
    },
    {
      title: 'Emprendedor',
      items: isEntrepreneur
        ? [
            { href: '/dashboard/cliente/emprendedor', label: 'Emprendedor IA', icon: 'rocket', ia: true },
            { href: '/dashboard/cliente/capitalizacion', label: 'Capitalización', icon: 'wallet' },
          ]
        : [
            // Descubrible aunque no esté activo: lleva al perfil, donde se
            // enciende el modo emprendedor con un toggle.
            { href: '/dashboard/cliente/perfil', label: 'Activa modo emprendedor', icon: 'rocket' },
          ],
    },
    {
      items: [{ href: '/dashboard/cliente/perfil', label: 'Mi perfil', icon: 'user' }],
    },
  ]

  return (
    <DashboardNav
      user={user}
      roleLabel="Cliente"
      accent="red"
      kusiMessage="¡Gracias por apoyar el arte peruano! 🦙"
      sections={sections}
    />
  )
}
