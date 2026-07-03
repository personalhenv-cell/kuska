/**
 * Coordenadas aproximadas (capital / centroide) de las regiones/departamentos
 * del Perú, para ubicar a los artesanos en el mapa interactivo.
 *
 * La lista base de regiones seleccionables está en el registro de artesano y
 * en el filtro del marketplace; aquí cubrimos esas y algunas más por si un
 * artesano se registró con otra región válida. La clave se normaliza (sin
 * tildes, minúsculas) para tolerar variaciones de escritura.
 */
export interface PeruRegion {
  name: string
  lat: number
  lng: number
}

const REGION_LIST: PeruRegion[] = [
  { name: 'Amazonas', lat: -6.2299, lng: -77.8719 },
  { name: 'Áncash', lat: -9.5278, lng: -77.5278 },
  { name: 'Apurímac', lat: -13.6339, lng: -72.8814 },
  { name: 'Arequipa', lat: -16.409, lng: -71.5375 },
  { name: 'Ayacucho', lat: -13.1588, lng: -74.2239 },
  { name: 'Cajamarca', lat: -7.1638, lng: -78.5003 },
  { name: 'Callao', lat: -12.0566, lng: -77.1181 },
  { name: 'Cusco', lat: -13.5319, lng: -71.9675 },
  { name: 'Huancavelica', lat: -12.7867, lng: -74.9762 },
  { name: 'Huánuco', lat: -9.93, lng: -76.2422 },
  { name: 'Ica', lat: -14.0678, lng: -75.7286 },
  { name: 'Junín', lat: -12.0651, lng: -75.2049 },
  { name: 'La Libertad', lat: -8.1118, lng: -79.0288 },
  { name: 'Lambayeque', lat: -6.7011, lng: -79.9061 },
  { name: 'Lima', lat: -12.0464, lng: -77.0428 },
  { name: 'Loreto', lat: -3.7491, lng: -73.2538 },
  { name: 'Madre de Dios', lat: -12.5933, lng: -69.1891 },
  { name: 'Moquegua', lat: -17.1934, lng: -70.9351 },
  { name: 'Pasco', lat: -10.6828, lng: -76.2564 },
  { name: 'Piura', lat: -5.1945, lng: -80.6328 },
  { name: 'Puno', lat: -15.8402, lng: -70.0219 },
  { name: 'San Martín', lat: -6.4855, lng: -76.3729 },
  { name: 'Tacna', lat: -18.0066, lng: -70.2463 },
  { name: 'Tumbes', lat: -3.5669, lng: -80.4515 },
  { name: 'Ucayali', lat: -8.3791, lng: -74.5539 },
]

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

const BY_KEY = new Map<string, PeruRegion>(
  REGION_LIST.map((r) => [normalize(r.name), r]),
)

/** Devuelve las coordenadas de una región por nombre (tolerante a tildes/caso). */
export function regionCoords(region: string): PeruRegion | null {
  return BY_KEY.get(normalize(region)) ?? null
}

/** Centro y zoom por defecto del mapa del Perú. */
export const PERU_CENTER: [number, number] = [-9.19, -75.0152]
export const PERU_ZOOM = 5
