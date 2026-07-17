import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const AddItemSchema = z.object({
  product_id: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
})

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const cart = await prisma.cart.findUnique({
    where: { user_id: session.user.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              stock: true,
              slug: true,
              artisan: { select: { user: { select: { name: true } } } },
            },
          },
        },
      },
    },
  })

  if (!cart) {
    return NextResponse.json({ items: [], total: 0, count: 0 })
  }

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return NextResponse.json({
    items: cart.items.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      product: item.product,
      quantity: item.quantity,
    })),
    total,
    count,
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const parsed = AddItemSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'product_id y quantity son requeridos' }, { status: 400 })
  }

  const { product_id, quantity } = parsed.data

  try {
    const product = await prisma.product.findUnique({ where: { id: product_id } })
    if (!product || !product.is_available) {
      return NextResponse.json({ error: 'Producto no disponible' }, { status: 404 })
    }

    let cart = await prisma.cart.findUnique({ where: { user_id: session.user.id } })
    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id: session.user.id },
      })
    }

    const existing = await prisma.cartItem.findUnique({
      where: { cart_id_product_id: { cart_id: cart.id, product_id } },
    })

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: { cart_id: cart.id, product_id, quantity },
      })
    }

    return NextResponse.json({ ok: true, added: quantity }, { status: 201 })
  } catch (e) {
    console.error('Error adding to cart:', e)
    return NextResponse.json({ error: 'Error al agregar al carrito' }, { status: 500 })
  }
}
