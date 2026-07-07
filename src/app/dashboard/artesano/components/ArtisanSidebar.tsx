'use client'

import { DashboardNav, type DashNavSection } from '@/components/dashboard/DashboardNav'
import type { Session } from 'next-auth'

type User = Session['user']

const sections: DashNavSection[] = [
  {
    items: [{ href: '/dashboard/artesano', label: 'Inicio', icon: 'home', exact: true }],
  },
  {
    title: 'Mi negocio',
    items: [
      { href: '/dashboard/artesano/productos', label: 'Mis productos', icon: 'palette' },
      { href: '/dashboard/artesano/pedidos', label: 'Pedidos', icon: 'box' },
      { href: '/dashboard/artesano/estadisticas', label: 'Estadísticas', icon: 'chart' },
      { href: '/dashboard/artesano/capitalizacion', label: 'Capitalización', icon: 'wallet' },
    ],
  },
  {
    title: 'Kuska IA',
    items: [
      { href: '/dashboard/artesano/cfo-bot', label: 'CFO-Bot', icon: 'bot', ia: true },
      { href: '/dashboard/artesano/match-ia', label: 'Match IA', icon: 'link', ia: true },
      { href: '/dashboard/artesano/productos/ia-descripcion', label: 'Descripciones IA', icon: 'sparkles', ia: true },
    ],
  },
  {
    title: 'Comunidad y crecimiento',
    items: [
      { href: '/dashboard/artesano/mensajes', label: 'Mensajes', icon: 'chat' },
      { href: '/dashboard/artesano/raices', label: 'Raíces', icon: 'tree' },
      { href: '/dashboard/artesano/academia', label: 'Academia', icon: 'academy' },
      { href: '/dashboard/artesano/talleres', label: 'Mis talleres', icon: 'workshop' },
      { href: '/dashboard/artesano/ferias', label: 'Ferias Digitales', icon: 'tent' },
      { href: '/dashboard/artesano/agrupacion', label: 'Red Agrupación', icon: 'users' },
      { href: '/dashboard/artesano/comunidad', label: 'Red Cuéntame', icon: 'megaphone' },
    ],
  },
  {
    items: [{ href: '/dashboard/artesano/perfil', label: 'Mi perfil', icon: 'user' }],
  },
]

export function ArtisanSidebar({ user }: { user: User }) {
  return (
    <DashboardNav
      user={user}
      roleLabel="Artesano"
      accent="teal"
      kusiMessage="¡Hoy es un gran día! 🦙"
      sections={sections}
    />
  )
}
