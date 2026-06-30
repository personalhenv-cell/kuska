import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/** Genera un slug URL-safe. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

interface SeedArtisan {
  name: string
  phone: string
  region: string
  community: string
  specialty: string
  technique: string
  years: number
  story: string
  products: { name: string; price: number; category: string; description: string }[]
}

const artisans: SeedArtisan[] = [
  {
    name: 'Rosa Quispe Mamani',
    phone: '999000001',
    region: 'Cusco',
    community: 'Chinchero',
    specialty: 'Textilería',
    technique: 'Telar de cintura',
    years: 28,
    story:
      'Aprendí a tejer con mi abuela mirando las estrellas. Cada manta cuenta la historia de nuestra comunidad.',
    products: [
      { name: 'Manta Chinchero Inti', price: 320, category: 'Textiles', description: 'Manta tejida a mano con tintes naturales de cochinilla y nogal.' },
      { name: 'Chullo Andino Tradicional', price: 85, category: 'Textiles', description: 'Chullo de lana de alpaca con iconografía inca.' },
      { name: 'Camino del Sol — Tapiz', price: 540, category: 'Textiles', description: 'Tapiz ceremonial inspirado en el camino del Inti.' },
    ],
  },
  {
    name: 'Julián Mamani Apaza',
    phone: '999000002',
    region: 'Puno',
    community: 'Pucará',
    specialty: 'Cerámica',
    technique: 'Modelado y bruñido',
    years: 22,
    story:
      'El barro de Pucará tiene memoria. Mis toritos protegen los hogares como lo hicieron por siglos.',
    products: [
      { name: 'Torito de Pucará Mediano', price: 140, category: 'Cerámica', description: 'Torito ceremonial pintado a mano, símbolo de protección.' },
      { name: 'Vasija Tiwanaku', price: 260, category: 'Cerámica', description: 'Vasija decorativa con motivos prehispánicos.' },
    ],
  },
  {
    name: 'Elena Huamán Flores',
    phone: '999000003',
    region: 'Ayacucho',
    community: 'Quinua',
    specialty: 'Retablos',
    technique: 'Retablo ayacuchano',
    years: 19,
    story:
      'En cada retablo guardo un pedazo de mi pueblo: sus fiestas, su fe y su gente trabajadora.',
    products: [
      { name: 'Retablo Fiesta Andina', price: 410, category: 'Retablos', description: 'Retablo de tres pisos con escenas costumbristas.' },
      { name: 'Retablo Nacimiento', price: 230, category: 'Retablos', description: 'Nacimiento andino en caja de madera tallada.' },
    ],
  },
  {
    name: 'Marcelino Quispe Ríos',
    phone: '999000004',
    region: 'Junín',
    community: 'San Pedro de Cajas',
    specialty: 'Tapicería',
    technique: 'Tapiz anudado',
    years: 31,
    story:
      'Convierto la lana en paisajes. Mis tapices llevan los valles del centro del Perú a otras tierras.',
    products: [
      { name: 'Tapiz Valle del Mantaro', price: 620, category: 'Textiles', description: 'Paisaje andino tejido con lana de oveja teñida a mano.' },
      { name: 'Tapiz Pastores', price: 380, category: 'Textiles', description: 'Escena de pastoreo con degradados naturales.' },
    ],
  },
  {
    name: 'Carmen Saavedra León',
    phone: '999000005',
    region: 'Lima',
    community: 'Lurín',
    specialty: 'Joyería',
    technique: 'Filigrana de plata',
    years: 16,
    story:
      'La plata peruana cobra vida en mis manos. Cada pieza es ligera como un suspiro y fuerte como una raíz.',
    products: [
      { name: 'Aretes Filigrana Colibrí', price: 175, category: 'Joyería', description: 'Aretes de plata 950 en filigrana, motivo colibrí.' },
      { name: 'Collar Chakana', price: 290, category: 'Joyería', description: 'Collar con cruz andina en plata trabajada a mano.' },
    ],
  },
]

const badges = [
  { name: 'Primer Tejido', description: 'Publicaste tu primer producto', icon: '🧶', condition: 'first_product', points: 50 },
  { name: 'Maestro Verificado', description: 'Tu cuenta fue verificada', icon: '✓', condition: 'verified', points: 100 },
  { name: 'Corazón Andino', description: 'Recibiste 10 favoritos', icon: '💛', condition: 'favorites_10', points: 75 },
  { name: 'Embajador Kuska', description: 'Invitaste a 5 personas', icon: '🌟', condition: 'referrals_5', points: 150 },
]

const missions = [
  { title: 'Completa tu historia', description: 'Cuenta tu historia personal', points: 30, type: 'profile', target: 1, role: 'artesano' },
  { title: 'Sube 3 productos', description: 'Publica al menos 3 piezas', points: 60, type: 'product', target: 3, role: 'artesano' },
  { title: 'Explora el marketplace', description: 'Visita 5 productos', points: 20, type: 'browse', target: 5, role: 'cliente' },
]

async function main() {
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { id: badge.condition },
      update: {},
      create: { id: badge.condition, ...badge },
    })
  }

  for (const mission of missions) {
    await prisma.mission.create({ data: mission })
  }

  for (const a of artisans) {
    const user = await prisma.user.upsert({
      where: { phone: a.phone },
      update: {},
      create: {
        name: a.name,
        phone: a.phone,
        role: 'artesano',
        artisan_profile: {
          create: {
            specialty: a.specialty,
            technique: a.technique,
            region: a.region,
            community: a.community,
            years_experience: a.years,
            story: a.story,
            is_verified: true,
            rating: 4.8,
          },
        },
      },
      include: { artisan_profile: true },
    })

    const profileId = user.artisan_profile!.id
    for (const p of a.products) {
      await prisma.product.create({
        data: {
          artisan_id: profileId,
          name: p.name,
          slug: `${slugify(p.name)}-${Math.random().toString(36).slice(2, 7)}`,
          description: p.description,
          price: p.price,
          stock: 5,
          category: p.category,
          technique: a.technique,
          region: a.region,
          materials: ['Materiales naturales'],
          is_featured: true,
        },
      })
    }
  }

  console.log('✅ Seed completado: artesanos, productos, badges y misiones.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
