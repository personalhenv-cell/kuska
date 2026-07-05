import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const CheckoutSchema = z.object({
  product_id: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
  payment_method: z.enum(['yape', 'plin', 'visa']),
  donation: z.number().min(0).max(500).default(0),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Debes iniciar sesión para comprar' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const parsed = CheckoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { product_id, quantity, payment_method, donation } = parsed.data

  const product = await prisma.product.findUnique({ where: { id: product_id } })
  if (!product || !product.is_available) {
    return NextResponse.json({ error: 'Producto no disponible' }, { status: 404 })
  }
  if (product.stock < quantity) {
    return NextResponse.json({ error: `Solo quedan ${product.stock} unidades` }, { status: 409 })
  }

  const total = product.price * quantity + donation

  // Pago SIMULADO: se marca como pagado de inmediato, no hay pasarela real.
  try {
    const order = await prisma.$transaction(async (tx) => {
      // updateMany con `stock: { gte: quantity }` en el where hace el
      // chequeo-y-descuento atómico a nivel de fila: si dos compras
      // simultáneas del último stock llegan aquí, Postgres serializa los
      // UPDATE y la segunda ve el stock ya decrementado por la primera —
      // su propio `gte` falla y `count` da 0, sin vender de más.
      const stockUpdate = await tx.product.updateMany({
        where: { id: product_id, stock: { gte: quantity } },
        data: {
          stock: { decrement: quantity },
          sales_count: { increment: quantity },
        },
      })
      if (stockUpdate.count === 0) {
        throw new Error('STOCK_INSUFICIENTE')
      }

      const created = await tx.order.create({
        data: {
          client_id: session.user.id,
          status: 'confirmado',
          total,
          payment_method,
          payment_status: 'pagado',
          impact_score: quantity,
          items: {
            create: [{ product_id, quantity, price: product.price }],
          },
        },
      })

      if (donation > 0) {
        await tx.solidarityFund.create({
          data: { order_id: created.id, amount: donation, donor_id: session.user.id },
        })
      }

      return created
    })

    return NextResponse.json({ ok: true, orderId: order.id, total })
  } catch (e) {
    if (e instanceof Error && e.message === 'STOCK_INSUFICIENTE') {
      return NextResponse.json(
        { error: 'Alguien más acaba de comprar las últimas unidades. Actualiza la página.' },
        { status: 409 },
      )
    }
    throw e
  }
}
