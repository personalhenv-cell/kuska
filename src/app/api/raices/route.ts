import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const schema = z.object({
  productId:      z.string().optional(),
  title:          z.string().min(3).max(250),
  narrative:      z.string().min(10),
  culturalRegion: z.string().optional(),
  generationNum:  z.number().optional().nullable(),
  symbolsMeaning: z.any().optional(),
  technique:      z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ARTESANO') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body    = await req.json()
    const data    = schema.parse(body)
    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!artisan) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })

    if (data.productId) {
      const story = await prisma.heritageStory.upsert({
        where:  { productId: data.productId },
        update: {
          title: data.title, narrative: data.narrative,
          culturalRegion: data.culturalRegion,
          generationNum:  data.generationNum,
          symbolsMeaning: data.symbolsMeaning,
        },
        create: {
          productId:      data.productId,
          artisanId:      artisan.id,
          title:          data.title,
          narrative:      data.narrative,
          culturalRegion: data.culturalRegion,
          generationNum:  data.generationNum,
          symbolsMeaning: data.symbolsMeaning,
        },
      })
      return NextResponse.json({ success: true, story })
    }

    const linaje = await prisma.linajeCultural.create({
      data: {
        artisanId:     artisan.id,
        techniqueName: data.technique || data.title,
        description:   data.narrative,
        originRegion:  data.culturalRegion,
      },
    })
    return NextResponse.json({ success: true, linaje })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 422 })
    }
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    if (!productId) return NextResponse.json({ error: 'productId requerido' }, { status: 400 })
    const story = await prisma.heritageStory.findUnique({
      where:   { productId },
      include: { media: true },
    })
    return NextResponse.json({ story })
  } catch {
    return NextResponse.json({ error: 'Error al obtener historia' }, { status: 500 })
  }
}
