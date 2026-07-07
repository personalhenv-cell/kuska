import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const UpdateSchema = z.object({
  quantity: z.number().int().min(1).max(20),
})

export async function PUT(req: Request, { params }: { params: { productId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const cart = await prisma.cart.findUnique({ where: { user_id: session.user.id } })
  if (!cart) {
    return NextResponse.json({ error: 'Carrito no encontrado' }, { status: 404 })
  }

  const item = await prisma.cartItem.findUnique({
    where: { cart_id_product_id: { cart_id: cart.id, product_id: params.productId } },
  })
  if (!item) {
    return NextResponse.json({ error: 'Producto no en carrito' }, { status: 404 })
  }

  const updated = await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: parsed.data.quantity },
  })

  return NextResponse.json({ ok: true, quantity: updated.quantity })
}

export async function DELETE(req: Request, { params }: { params: { productId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const cart = await prisma.cart.findUnique({ where: { user_id: session.user.id } })
  if (!cart) {
    return NextResponse.json({ error: 'Carrito no encontrado' }, { status: 404 })
  }

  const item = await prisma.cartItem.findUnique({
    where: { cart_id_product_id: { cart_id: cart.id, product_id: params.productId } },
  })
  if (!item) {
    return NextResponse.json({ error: 'Producto no en carrito' }, { status: 404 })
  }

  await prisma.cartItem.delete({ where: { id: item.id } })

  return NextResponse.json({ ok: true })
}
