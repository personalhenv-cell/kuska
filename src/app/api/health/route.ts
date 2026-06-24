import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({
      status: 'OK',
      database: 'Conectada ✅',
      message: 'Kuska está funcionando con base de datos real'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      database: 'Sin conexión ❌',
      error: String(error)
    }, { status: 500 })
  }
}
