import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kuska — Innovación Artesanal del Perú',
    short_name: 'Kuska',
    description: 'Marketplace y comunidad de artesanos peruanos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F0E8',
    theme_color: '#3D1C02',
    icons: [
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
  }
}
