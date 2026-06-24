import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const artisanSchema = z.object({
  phone:        z.string().regex(/^\+51\d{9}$/),
  role:         z.literal('ARTESANO'),
  displayName:  z.string().min(2).max(150),
  dni:          z.string().length(8),
  firstName:    z.string().min(2),
  lastName:     z.string().min(2),
  regionId:     z.string().optional(),
  craftLineage: z.string().optional(),
  whatsapp:     z.string().optional(),
  lang:         z.enum(['es','qu','ay','aw']).default('es'),
})

const clientSchema = z.object({
  phone:       z.string().regex(/^\+51\d{9}$/),
  role:        z.literal('CLIENTE'),
  displayName: z.string().min(2).max(150),
  lang:        z.enum(['es','qu','ay','aw']).default('es'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const existingUser = await prisma.user.findUnique({
      where: { phone: body.phone },
    })
    if (!existingUser) {
      return NextResponse.json({ error: 'Debes verificar tu número primero' }, { status: 401 })
    }

    if (body.role === 'ARTESANO') {
      const data = artisanSchema.parse(body)

      const existingDni = await prisma.identityVerification.findUnique({
        where: { dni: data.dni },
      })
      if (existingDni) {
        return NextResponse.json({ error: 'Este DNI ya está registrado' }, { status: 409 })
      }

      const [user, profile] = await prisma.$transaction([
        prisma.user.update({
          where: { id: existingUser.id },
          data:  { role: 'ARTESANO', preferredLang: data.lang },
        }),
        prisma.artisanProfile.upsert({
          where:  { userId: existingUser.id },
          update: { displayName: data.displayName },
          create: {
            userId:       existingUser.id,
            displayName:  data.displayName,
            craftLineage: data.craftLineage,
            whatsapp:     data.whatsapp,
          },
        }),
      ])

      await prisma.identityVerification.upsert({
        where:  { userId: existingUser.id },
        update: {
          dni: data.dni, firstName: data.firstName, lastName: data.lastName,
          fullName: `${data.firstName} ${data.lastName}`,
          reniecStatus: 'VERIFIED', verifiedAt: new Date(),
          expiresAt: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
        },
        create: {
          userId: existingUser.id, dni: data.dni,
          firstName: data.firstName, lastName: data.lastName,
          fullName: `${data.firstName} ${data.lastName}`,
          reniecStatus: 'VERIFIED', verifiedAt: new Date(),
          expiresAt: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
        },
      })

      await prisma.membership.upsert({
        where:  { artisanId: profile.id },
        update: {},
        create: { artisanId: profile.id, plan: 'BASIC', amount: 10 },
      })

      return NextResponse.json({
        success: true, userId: user.id,
        profileId: profile.id, role: 'ARTESANO',
        message: '¡Bienvenido a Kuska, artesano!',
      })

    } else {
      const data = clientSchema.parse(body)

      const [user, profile] = await prisma.$transaction([
        prisma.user.update({
          where: { id: existingUser.id },
          data:  { role: 'CLIENTE', preferredLang: data.lang },
        }),
        prisma.clientProfile.upsert({
          where:  { userId: existingUser.id },
          update: { displayName: data.displayName },
          create: { userId: existingUser.id, displayName: data.displayName },
        }),
      ])

      return NextResponse.json({
        success: true, userId: user.id,
        profileId: profile.id, role: 'CLIENTE',
        message: '¡Bienvenido a Kuska!',
      })
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 422 })
    }
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 })
  }
}
