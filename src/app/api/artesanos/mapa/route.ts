import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { regionCoords } from '@/lib/peru-regions'

export const dynamic = 'force-dynamic'

interface MapRegion {
  region: string
  lat: number
  lng: number
  count: number
  artisans: { id: string; name: string; specialty: string }[]
}

/**
 * GET /api/artesanos/mapa
 * Devuelve los artesanos reales agrupados por región para el mapa del Perú.
 * Solo datos reales de la base de datos — sin arrays hardcodeados.
 */
export async function GET() {
  const profiles = await prisma.artisanProfile.findMany({
    select: {
      id: true,
      region: true,
      specialty: true,
      user: { select: { id: true, name: true } },
    },
    orderBy: { total_sales: 'desc' },
  })

  const byRegion = new Map<string, MapRegion>()

  for (const p of profiles) {
    const coords = regionCoords(p.region)
    if (!coords) continue // región desconocida → no la ubicamos en el mapa

    let entry = byRegion.get(coords.name)
    if (!entry) {
      entry = { region: coords.name, lat: coords.lat, lng: coords.lng, count: 0, artisans: [] }
      byRegion.set(coords.name, entry)
    }
    entry.count += 1
    // Guardamos hasta 5 nombres por región para el popup (los más vendidos primero).
    if (entry.artisans.length < 5) {
      entry.artisans.push({ id: p.user.id, name: p.user.name, specialty: p.specialty })
    }
  }

  const regions = Array.from(byRegion.values()).sort((a, b) => b.count - a.count)
  const total = profiles.length

  return NextResponse.json({ regions, total })
}
