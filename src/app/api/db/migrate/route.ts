import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

/**
 * Migración idempotente de enums críticos de PostgreSQL.
 *
 * Red de seguridad para entornos donde `prisma db push` no se ejecutó y los
 * tipos enumerados no existen (error de producción 42704:
 * `type "public.UserRole" does not exist`).
 *
 * REGLA: un solo statement SQL por cada `$executeRawUnsafe`. Cada CREATE TYPE
 * se envuelve en un bloque DO que ignora el error si el tipo ya existe.
 */

const ENUMS: Record<string, string[]> = {
  UserRole:       ['ARTESANO', 'CLIENTE', 'ADMIN'],
  Lang:           ['es', 'qu', 'ay', 'aw'],
  IdentityStatus: ['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'],
  ProductStatus:  ['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'SOLD_OUT'],
  OrderStatus:    ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'AT_HUB', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
  DeliveryStatus: ['CREATED', 'PICKED_UP', 'IN_TRANSIT', 'AT_HUB', 'DELIVERED', 'FAILED'],
  FairType:       ['FISICA', 'DIGITAL', 'HIBRIDA'],
  FairStatus:     ['DRAFT', 'OPEN', 'FULL', 'ACTIVE', 'CLOSED'],
  WorkshopStatus: ['DRAFT', 'PUBLISHED', 'FULL', 'COMPLETED', 'CANCELLED'],
  RecordType:     ['INGRESO', 'EGRESO', 'INVERSION', 'DEVOLUCION'],
  SaleMode:       ['WHATSAPP', 'PLATFORM'],
  PlanType:       ['BASIC', 'PRO', 'COLLECTIVE'],
  NotifType:      ['SALE', 'MESSAGE', 'FAIR', 'SYSTEM', 'PAYMENT'],
}

export async function POST() {
  const created: string[] = []
  const skipped: string[] = []
  const failed: { type: string; error: string }[] = []

  for (const [name, values] of Object.entries(ENUMS)) {
    const labels = values.map(v => `'${v}'`).join(', ')
    // Un único statement: bloque DO idempotente.
    const sql = `DO $do$ BEGIN
      CREATE TYPE "${name}" AS ENUM (${labels});
      EXCEPTION WHEN duplicate_object THEN NULL;
    END $do$;`
    try {
      await prisma.$executeRawUnsafe(sql)
      // No podemos distinguir creado vs ignorado dentro del DO; verificamos aparte.
      const exists = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
        `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = $1) AS exists`,
        name,
      )
      if (exists?.[0]?.exists) created.push(name)
      else skipped.push(name)
    } catch (err) {
      failed.push({ type: name, error: err instanceof Error ? err.message : 'unknown' })
    }
  }

  const ok = failed.length === 0
  return NextResponse.json(
    { ok, ensured: created, skipped, failed, ts: new Date().toISOString() },
    { status: ok ? 200 : 500 },
  )
}

export async function GET() {
  const rows = await prisma.$queryRawUnsafe<Array<{ typname: string }>>(
    `SELECT typname FROM pg_type WHERE typname = ANY($1) ORDER BY typname`,
    Object.keys(ENUMS),
  )
  const present = rows.map((r: { typname: string }) => r.typname)
  const missing = Object.keys(ENUMS).filter(n => !present.includes(n))
  return NextResponse.json({ present, missing, complete: missing.length === 0 })
}
