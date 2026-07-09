import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { sendPushToUser } from '@/lib/onesignal'

const CartItemSchema = z.object({
  product_id: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
})

// Acepta tanto el flujo "Comprar ahora" (un solo producto) como el checkout
// del carrito completo (varios productos en una sola orden).
const CheckoutSchema = z
  .object({
    product_id: z.string().min(1).optional(),
    quantity: z.number().int().min(1).max(20).optional(),
    items: z.array(CartItemSchema).min(1).max(30).optional(),
    payment_method: z.enum(['yape', 'plin', 'visa']),
    donation: z.number().min(0).max(500).default(0),
  })
  .transform((data) => ({
    items:
      data.items ??
      (data.product_id ? [{ product_id: data.product_id, quantity: data.quantity ?? 1 }] : []),
    payment_method: data.payment_method,
    donation: data.donation,
  }))
  .refine((data) => data.items.length > 0, { message: 'No hay productos para comprar' })

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
  const { items, payment_method, donation } = parsed.data

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.product_id) } },
    include: { artisan: { select: { user_id: true } } },
  })
  const productById = new Map(products.map((p) => [p.id, p]))

  for (const item of items) {
    const product = productById.get(item.product_id)
    if (!product || !product.is_available) {
      return NextResponse.json({ error: 'Uno de los productos ya no está disponible' }, { status: 404 })
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Solo quedan ${product.stock} unidades de "${product.name}"` },
        { status: 409 },
      )
    }
  }

  const subtotal = items.reduce((sum, item) => sum + (productById.get(item.product_id)?.price ?? 0) * item.quantity, 0)
  const total = subtotal + donation

  // Pago SIMULADO: se marca como pagado de inmediato, no hay pasarela real.
  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        // updateMany con `stock: { gte: quantity }` en el where hace el
        // chequeo-y-descuento atómico a nivel de fila: si dos compras
        // simultáneas del último stock llegan aquí, Postgres serializa los
        // UPDATE y la segunda ve el stock ya decrementado por la primera —
        // su propio `gte` falla y `count` da 0, sin vender de más.
        const stockUpdate = await tx.product.updateMany({
          where: { id: item.product_id, stock: { gte: item.quantity } },
          data: {
            stock: { decrement: item.quantity },
            sales_count: { increment: item.quantity },
          },
        })
        if (stockUpdate.count === 0) {
          throw new Error('STOCK_INSUFICIENTE')
        }
      }

      const created = await tx.order.create({
        data: {
          client_id: session.user.id,
          status: 'confirmado',
          total,
          payment_method,
          payment_status: 'pagado',
          impact_score: items.reduce((sum, i) => sum + i.quantity, 0),
          items: {
            create: items.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price: productById.get(item.product_id)?.price ?? 0,
            })),
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

    // Si la compra vino del carrito, se vacía tras confirmarse el pago.
    const cart = await prisma.cart.findUnique({ where: { user_id: session.user.id } })
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cart_id: cart.id, product_id: { in: items.map((i) => i.product_id) } },
      })
    }

    // Fire-and-forget: un push que falla o tarda no debe bloquear ni
    // hacer fallar una compra ya confirmada y pagada.
    const notifiedArtisans = new Set<string>()
    for (const item of items) {
      const product = productById.get(item.product_id)
      if (!product || notifiedArtisans.has(product.artisan.user_id)) continue
      notifiedArtisans.add(product.artisan.user_id)
      const itemsForArtisan = items.filter((i) => productById.get(i.product_id)?.artisan.user_id === product.artisan.user_id)
      const artisanTotal = itemsForArtisan.reduce((sum, i) => sum + (productById.get(i.product_id)?.price ?? 0) * i.quantity, 0)
      sendPushToUser({
        userId: product.artisan.user_id,
        title: '¡Nueva venta! 🎉',
        message: `Vendiste ${itemsForArtisan.reduce((s, i) => s + i.quantity, 0)} producto(s) por ${new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(artisanTotal)}`,
        url: '/dashboard/artesano/pedidos',
      }).catch(() => {})
    }

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
