'use client'

import { DashboardNav, type DashNavSection } from '@/components/dashboard/DashboardNav'
import type { Session } from 'next-auth'

type User = Session['user']

export function ClientSidebar({ user }: { user: User }) {
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
      items: user.is_entrepreneur
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
