'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import L from 'leaflet'
import Link from 'next/link'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { PERU_CENTER, PERU_ZOOM } from '@/lib/peru-regions'

/** El contenedor del mapa vive dentro de un motion.div con scale inicial —
 *  Leaflet mide el tamaño del contenedor al montar, y si en ese momento no
 *  coincide con el tamaño final (fuentes/imágenes aún cargando, animación de
 *  entrada), quedan franjas de tiles grises/incompletas. invalidateSize()
 *  fuerza a recalcular una vez que el layout ya se asentó. */
function MapResizeFix() {
  const map = useMap()
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 300)
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(id)
      window.removeEventListener('resize', onResize)
    }
  }, [map])
  return null
}

export interface MapRegion {
  region: string
  lat: number
  lng: number
  count: number
  artisans: { id: string; name: string; specialty: string }[]
}

/**
 * Marcador circular de marca Kuska con el número de artesanos de la región.
 * Se usa `divIcon` (HTML propio) en vez del ícono por defecto de Leaflet,
 * que se rompe con los bundlers (rutas de imagen inexistentes).
 */
function kuskaIcon(count: number): L.DivIcon {
  const size = Math.min(58, 34 + count * 4)
  return L.divIcon({
    className: 'kuska-map-pin',
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:9999px;
        background:radial-gradient(circle at 30% 30%, #E86A4E, #C84B2F);
        color:#fff;display:flex;align-items:center;justify-content:center;
        font-weight:800;font-size:${count > 9 ? 13 : 15}px;
        border:3px solid #F5F0E8;
        box-shadow:0 4px 14px rgba(61,28,2,0.45);
      ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

export default function ArtisanMap({ regions }: { regions: MapRegion[] }) {
  return (
    <MapContainer
      center={PERU_CENTER}
      zoom={PERU_ZOOM}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', background: '#EDE4D3' }}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapResizeFix />
      {regions.map((r) => (
        <Marker key={r.region} position={[r.lat, r.lng]} icon={kuskaIcon(r.count)}>
          <Popup>
            <div style={{ fontFamily: 'Georgia, serif', minWidth: 180 }}>
              <p style={{ margin: '0 0 4px', fontWeight: 800, color: '#3D1C02', fontSize: 15 }}>
                {r.region}
              </p>
              <p style={{ margin: '0 0 8px', color: '#C84B2F', fontWeight: 700, fontSize: 12 }}>
                {r.count} {r.count === 1 ? 'artesano' : 'artesanos'}
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {r.artisans.map((a) => (
                  <li key={a.id} style={{ marginBottom: 4 }}>
                    <Link
                      href={`/artesano/${a.id}`}
                      style={{ color: '#2E7A6E', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
                    >
                      {a.name}
                    </Link>
                    <span style={{ color: '#6B4C35', fontSize: 11 }}> · {a.specialty}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/marketplace?region=${encodeURIComponent(r.region)}`}
                style={{
                  display: 'inline-block',
                  marginTop: 8,
                  color: '#D4920A',
                  fontWeight: 700,
                  fontSize: 12,
                  textDecoration: 'none',
                }}
              >
                Ver en el marketplace →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
