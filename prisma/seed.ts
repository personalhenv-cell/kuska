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

  // name → { profileId, userId } para atar el contenido de demo a artesanos reales
  const refs: Record<string, { profileId: string; userId: string }> = {}

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
    refs[a.name] = { profileId, userId: user.id }

    // Los productos no son idempotentes por sí solos (no hay clave natural),
    // así que solo se siembran si el artesano aún no tiene ninguno.
    const existingProducts = await prisma.product.count({ where: { artisan_id: profileId } })
    if (existingProducts === 0) {
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
  }

  await seedDemoContent(refs)

  console.log('✅ Seed completado: artesanos, productos, badges, misiones y contenido de demo.')
}

/**
 * Contenido de demo (talleres, ferias, academia, comunidad) atado a los
 * artesanos reales. Todo con ids fijos + upsert → 100% idempotente:
 * re-ejecutar `prisma db seed` no duplica nada.
 */
async function seedDemoContent(refs: Record<string, { profileId: string; userId: string }>) {
  const rosa = refs['Rosa Quispe Mamani']
  const julian = refs['Julián Mamani Apaza']
  const elena = refs['Elena Huamán Flores']
  const marcelino = refs['Marcelino Quispe Ríos']
  const carmen = refs['Carmen Saavedra León']
  if (!rosa || !julian || !elena || !marcelino || !carmen) {
    console.warn('⚠️  No se encontraron todos los artesanos de referencia; se omite el contenido de demo.')
    return
  }

  const at = (iso: string) => new Date(`${iso}T18:00:00Z`)

  const workshops = [
    { id: 'seed-ws-1', artisan_id: rosa.profileId, title: 'Telar de cintura: teje tu primera faja andina', description: 'Aprende la técnica ancestral del telar de cintura paso a paso. Prepararemos la urdimbre, veremos los íconos andinos más usados y tejerás tu propia faja. Ideal para principiantes.', date: at('2026-07-20'), capacity: 15, price: 45, is_virtual: true },
    { id: 'seed-ws-2', artisan_id: julian.profileId, title: 'Cerámica de Pucará: del barro a la vasija', description: 'Taller presencial en el que modelarás una pieza inspirada en los toritos de Pucará. Incluye arcilla y engobes naturales.', date: at('2026-08-03'), capacity: 10, price: 60, is_virtual: false },
    { id: 'seed-ws-3', artisan_id: elena.profileId, title: 'Retablos ayacuchanos: arma tu caja de historias', description: 'Descubre el arte del retablo. Armaremos una caja de dos niveles y modelaremos figuras en pasta para contar una escena de tu propia vida.', date: at('2026-07-27'), capacity: 12, price: 50, is_virtual: true },
    { id: 'seed-ws-4', artisan_id: marcelino.profileId, title: 'Introducción al tapiz andino', description: 'Sesión gratuita abierta a toda la comunidad Kuska. Conoce las bases del tapiz, los tintes naturales y cómo empezar tu primer proyecto.', date: at('2026-07-18'), capacity: 40, price: 0, is_virtual: true },
    { id: 'seed-ws-5', artisan_id: carmen.profileId, title: 'Filigrana peruana: aretes en plata', description: 'Taller presencial de joyería en filigrana. Trabajarás hilos de plata para crear un par de aretes con motivos coloniales limeños.', date: at('2026-08-10'), capacity: 8, price: 80, is_virtual: false },
  ]
  for (const w of workshops) {
    await prisma.workshop.upsert({ where: { id: w.id }, update: {}, create: w })
  }

  const fairs = [
    { id: 'seed-fair-1', title: 'Gran Feria de Fiestas Patrias', theme: 'Fiestas Patrias', description: 'Celebra el mes patrio con lo mejor del arte peruano. Stands virtuales de artesanos de todo el país con piezas edición limitada.', start_date: at('2026-07-20'), end_date: at('2026-07-31'), is_active: true },
    { id: 'seed-fair-2', title: 'Ruta del Textil Andino', theme: 'Textilería', description: 'Una feria dedicada al textil: mantas, chalinas, fajas y tapices tejidos a mano por maestros de Cusco, Puno y Junín.', start_date: at('2026-08-01'), end_date: at('2026-08-15'), is_active: true },
  ]
  for (const f of fairs) {
    await prisma.digitalFair.upsert({ where: { id: f.id }, update: {}, create: f })
  }

  const blogPosts = [
    { id: 'seed-bp-1', slug: 'como-contar-la-historia-de-tu-producto', title: 'Cómo contar la historia detrás de tu producto', excerpt: 'Aprende a transformar la historia de tu taller en tu mejor herramienta de venta.', author: 'Equipo Kuska', tags: ['Marketing', 'Historias'], content: 'Cada pieza artesanal lleva horas de trabajo, una técnica heredada y una historia. Contar esa historia es lo que convierte un producto en algo memorable.\n\nEmpieza por lo esencial: ¿quién la hizo, dónde y con qué técnica? Luego suma el detalle humano: una anécdota del taller, el significado de un símbolo, el nombre de quien te enseñó. Los clientes no compran solo un objeto: compran pertenecer a esa historia.' },
    { id: 'seed-bp-2', slug: 'fotografia-tus-artesanias-con-tu-celular', title: 'Fotografía tus artesanías con solo tu celular', excerpt: 'Trucos simples para que tus productos se vean profesionales usando solo tu teléfono.', author: 'Equipo Kuska', tags: ['Fotografía', 'Ventas'], content: 'No necesitas una cámara profesional para tener buenas fotos. Con luz natural y algunos trucos, tu celular es suficiente.\n\nUsa la luz de una ventana por la mañana, evita el flash, coloca un fondo neutro (una tela lisa funciona) y toma varias fotos desde distintos ángulos. Muestra el detalle de la textura: ahí está el valor de lo hecho a mano.' },
    { id: 'seed-bp-3', slug: 'ponle-un-precio-justo-a-tu-trabajo', title: 'Ponle un precio justo a tu trabajo', excerpt: 'Una fórmula sencilla para cobrar lo que realmente vale tu arte.', author: 'Equipo Kuska', tags: ['Precios', 'Negocio'], content: 'Uno de los errores más comunes es cobrar solo los materiales y regalar las horas de trabajo. Tu tiempo y tu conocimiento valen.\n\nCalcula: costo de materiales + (horas de trabajo × cuánto vale tu hora) + un margen para crecer. No compitas por ser el más barato; compite por ser el más auténtico. Un precio justo también dignifica el oficio.' },
    { id: 'seed-bp-4', slug: 'del-taller-al-mundo-vende-fuera-del-peru', title: 'Del taller al mundo: vende fuera del Perú', excerpt: 'Todo lo que necesitas saber para que tu arte cruce fronteras.', author: 'Equipo Kuska', tags: ['Exportación', 'Crecimiento'], content: 'Internet borró las fronteras. Hoy una manta tejida en Chinchero puede llegar a una sala en Berlín. Kuska te ayuda a dar ese salto.\n\nPrepara descripciones claras, cuida el empaque, y ten lista la historia de tu pieza en un par de frases. La demanda internacional por lo auténtico y sostenible nunca fue tan alta como ahora.' },
  ]
  for (const b of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: {},
      create: { ...b, views: 0, is_published: true, published_at: new Date() },
    })
  }

  const communityPosts = [
    { id: 'seed-cp-1', author_id: rosa.userId, content: 'Terminé una manta de 3 metros después de dos semanas en el telar 🧶. Cada línea es un río de mi comunidad en Chinchero. ¡Feliz de compartirla con ustedes!' },
    { id: 'seed-cp-2', author_id: julian.userId, content: 'Nueva hornada saliendo del horno de leña 🔥. Los toritos de Pucará ya están listos para cuidar hogares. El barro de Puno tiene su propia magia.' },
    { id: 'seed-cp-3', author_id: elena.userId, content: 'Un retablo nuevo contando la fiesta de mi pueblo en Ayacucho. Dos niveles, veinte figuritas y muchas horas de amor. 🎨' },
    { id: 'seed-cp-4', author_id: marcelino.userId, content: 'Compartiendo mi proceso de teñido natural con cochinilla y hojas. Los colores del ande no se imitan, se cultivan. 🌿' },
    { id: 'seed-cp-5', author_id: carmen.userId, content: 'Aretes de filigrana en plata terminados para un pedido especial ✨. La filigrana limeña es paciencia hecha joya.' },
  ]
  for (const c of communityPosts) {
    await prisma.post.upsert({
      where: { id: c.id },
      update: {},
      create: { ...c, images: [], type: 'post', views: 0 },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
