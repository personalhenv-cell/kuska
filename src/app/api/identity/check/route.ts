import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const schema = z.object({
  dni: z.string().regex(/^\d{8}$/, 'DNI debe tener 8 dígitos'),
})

async function queryReniec(dni: string) {
  try {
    // API gratuita de apis.net.pe
    const res = await fetch(
      `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.RENIEC_API_TOKEN || 'apis-token-demo'}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      }
    )

    if (!res.ok) {
      // Modo demo — devuelve datos de prueba
      return {
        success:   true,
        firstName: 'NOMBRE',
        lastName:  'APELLIDO PATERNO MATERNO',
        demo:      true,
      }
    }

    const data = await res.json()
    return {
      success:   true,
      firstName: data.nombres,
      lastName:  `${data.apellidoPaterno} ${data.apellidoMaterno}`.trim(),
      demo:      false,
    }
  } catch {
    // Si falla la API, modo demo para no bloquear el registro
    return {
      success:   true,
      firstName: 'NOMBRE',
      lastName:  'APELLIDO DEMO',
      demo:      true,
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body        = await req.json()
    const { dni }     = schema.parse(body)

    // Verificar si el DNI ya está registrado
    const existing = await prisma.identityVerification.findUnique({
      where: { dni },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Este DNI ya está registrado en Kuska' },
        { status: 409 }
      )
    }

    const result = await queryReniec(dni)

    return NextResponse.json({
      success:      true,
      firstName:    result.firstName,
      lastName:     result.lastName,
      demo:         result.demo,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 422 })
    }
    return NextResponse.json({ error: 'Error al consultar RENIEC' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const res = await fetch('https://api.apis.net.pe/v2/reniec/dni?numero=00000000', {
      headers: { 'Authorization': `Bearer ${process.env.RENIEC_API_TOKEN || 'apis-token-demo'}` },
      signal: AbortSignal.timeout(3000),
    })
    return NextResponse.json({ status: res.ok ? 'OK' : 'DEGRADED' })
  } catch {
    return NextResponse.json({ status: 'DEMO_MODE' })
  }
}
