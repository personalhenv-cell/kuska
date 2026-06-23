'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const REGIONES = ['Todas','Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca','Cusco','Huancavelica','Huánuco','Ica','Junín','La Libertad','Lambayeque','Lima','Loreto','Madre de Dios','Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali']
const RUBROS  = ['Todos','Textilería','Cerámica','Joyería','Madera tallada','Cestería','Pintura','Bordados','Instrumentos']
const PRECIOS = ['Cualquier precio','Menos de S/50','S/50 - S/100','S/100 - S/200','Más de S/200']

const PRODUCTOS = [
  { id:1, nombre:"Chullo andino Q'ero",    artesano:'Familia Quispe',      region:'Cusco',     rubro:'Textilería', precio:85,  linaje:true,  rating:4.9, ventas:124 },
  { id:2, nombre:'Cerámica Chulucanas',     artesano:'Taller Vicus',        region:'Piura',     rubro:'Cerámica',   precio:120, linaje:true,  rating:4.8, ventas:89 },
  { id:3, nombre:'Aretes de filigrana',     artesano:'Platería Catacaos',   region:'Piura',     rubro:'Joyería',    precio:95,  linaje:true,  rating:5.0, ventas:56 },
  { id:4, nombre:'Retablo ayacuchano',      artesano:'Familia Jiménez',     region:'Ayacucho',  rubro:'Pintura',    precio:200, linaje:true,  rating:4.7, ventas:34 },
  { id:5, nombre:'Tejido de Taquile',       artesano:'Comunidad Taquile',   region:'Puno',      rubro:'Textilería', precio:150, linaje:true,  rating:4.9, ventas:78 },
  { id:6, nombre:'Canasta de palma',        artesano:'Artesanas de Loreto', region:'Loreto',    rubro:'Cestería',   precio:60,  linaje:false, rating:4.6, ventas:45 },
  { id:7, nombre:'Charango cusqueño',       artesano:'Luis Huamán',         region:'Cusco',     rubro:'Instrumentos',precio:320,linaje:true,  rating:4.8, ventas:23 },
  { id:8, nombre:'Mate burilado',           artesano:'Taller Cochas',       region:'Junín',     rubro:'Madera tallada',precio:75,linaje:true, rating:4.7, ventas:67 },
]

export default function MarketplacePage() {
  const [region,     setRegion]     = useState('Todas')
  const [rubro,      setRubro]      = useState('Todos')
  const [precio,     setPrecio]     = useState('Cualquier precio')
  const [query,      setQuery]      = useState('')
  const [soloLinaje, setSoloLinaje] = useState(false)
  const [orden,      setOrden]      = useState('relevancia')

  const filtrados = PRODUCTOS.filter(p => {
    if (region !== 'Todas' && p.region !== region) return false
    if (rubro  !== 'Todos' && p.rubro  !== rubro)  return false
    if (soloLinaje && !p.linaje) return false
    if (query && !p.nombre.toLowerCase().includes(query.toLowerCase()) && !p.artesano.toLowerCase().includes(query.toLowerCase())) return false
    if (precio === 'Menos de S/50'   && p.precio >= 50)  return false
    if (precio === 'S/50 - S/100'    && (p.precio < 50  || p.precio > 100)) return false
    if (precio === 'S/100 - S/200'   && (p.precio < 100 || p.precio > 200)) return false
    if (precio === 'Más de S/200'    && p.precio <= 200) return false
    return true
  }).sort((a,b) => orden === 'precio_asc' ? a.precio - b.precio : orden === 'precio_desc' ? b.precio - a.precio : orden === 'rating' ? b.rating - a.rating : b.ventas - a.ventas)

  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <nav className="sticky top-0 z-40 glass-cream border-b border-[#3D1C02]/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.jpeg" alt="Kuska" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-[#3D1C02]" style={{ fontFamily:'serif' }}>Kuska</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-[#C84B2F] hover:underline">Ingresar</Link>
            <Link href="/registro/artesano" className="text-sm font-semibold bg-[#C84B2F] text-white px-4 py-1.5 rounded-lg hover:bg-[#A83A22] transition-colors">Registrarse</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3D1C02] mb-2" style={{ fontFamily:'serif' }}>Marketplace de Herencia</h1>
          <p className="text-[#3D1C02]/60">Descubre piezas únicas con historia y linaje cultural</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(61,28,2,0.08)] p-5 mb-8">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D1C02]/40">🔍</span>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Buscar productos o artesanos..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#3D1C02]/15 text-sm focus:outline-none focus:border-[#C84B2F] transition-colors text-[#3D1C02]" />
            </div>
            <select value={region} onChange={e => setRegion(e.target.value)} className="px-4 py-2.5 rounded-xl border border-[#3D1C02]/15 text-sm text-[#3D1C02] focus:outline-none focus:border-[#C84B2F] transition-colors">
              {REGIONES.map(r => <option key={r}>{r}</option>)}
            </select>
            <select value={rubro} onChange={e => setRubro(e.target.value)} className="px-4 py-2.5 rounded-xl border border-[#3D1C02]/15 text-sm text-[#3D1C02] focus:outline-none focus:border-[#C84B2F] transition-colors">
              {RUBROS.map(r => <option key={r}>{r}</option>)}
            </select>
            <select value={precio} onChange={e => setPrecio(e.target.value)} className="px-4 py-2.5 rounded-xl border border-[#3D1C02]/15 text-sm text-[#3D1C02] focus:outline-none focus:border-[#C84B2F] transition-colors">
              {PRECIOS.map(p => <option key={p}>{p}</option>)}
            </select>
            <button onClick={() => setSoloLinaje(!soloLinaje)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${soloLinaje ? 'bg-[#2E7A6E] border-[#2E7A6E] text-white' : 'border-[#3D1C02]/15 text-[#3D1C02] hover:border-[#2E7A6E]'}`}>
              🌿 Con Linaje
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <p className="text-sm text-[#3D1C02]/60"><strong className="text-[#3D1C02]">{filtrados.length}</strong> productos encontrados</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#3D1C02]/50">Ordenar:</span>
            <select value={orden} onChange={e => setOrden(e.target.value)} className="text-xs px-3 py-1.5 rounded-lg border border-[#3D1C02]/15 text-[#3D1C02] focus:outline-none">
              <option value="relevancia">Relevancia</option>
              <option value="rating">Mejor valorados</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtrados.map(p => (
            <div key={p.id} className="group bg-white rounded-2xl shadow-[0_4px_24px_rgba(61,28,2,0.08)] overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(61,28,2,0.15)] transition-all duration-300">
              <div className="h-44 bg-gradient-to-br from-[#F5F0E8] to-[#EDE5D8] flex items-center justify-center relative">
                <span className="text-5xl">📷</span>
                {p.linaje && (
                  <span className="absolute top-2 right-2 text-xs bg-[#2E7A6E] text-white font-semibold px-2 py-0.5 rounded-full">🌿 Linaje</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#3D1C02] text-sm mb-1 group-hover:text-[#C84B2F] transition-colors">{p.nombre}</h3>
                <p className="text-xs text-[#3D1C02]/50 mb-0.5">{p.artesano}</p>
                <p className="text-xs text-[#3D1C02]/40 mb-3">📍 {p.region} · {p.rubro}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-[#3D1C02]">S/ {p.precio}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-xs">★</span>
                    <span className="text-xs text-[#3D1C02]/60">{p.rating}</span>
                    <span className="text-xs text-[#3D1C02]/30 ml-1">({p.ventas})</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-[#C84B2F] text-white text-sm font-semibold rounded-xl hover:bg-[#A83A22] transition-colors">
                  Ver producto
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtrados.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-[#3D1C02]/60 mb-2">No encontramos productos con esos filtros.</p>
            <button onClick={() => { setRegion('Todas'); setRubro('Todos'); setQuery(''); setSoloLinaje(false); setPrecio('Cualquier precio') }}
              className="text-sm text-[#C84B2F] hover:underline">Limpiar todos los filtros</button>
          </div>
        )}
      </div>
    </main>
  )
}
