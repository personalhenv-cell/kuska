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

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'quantity es requerido y debe ser >= 1' }, { status: 400 })
  }

  try {
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
  } catch (e) {
    console.error('Error updating cart item:', e)
    return NextResponse.json({ error: 'Error al actualizar carrito' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { productId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
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
  } catch (e) {
    console.error('Error removing from cart:', e)
    return NextResponse.json({ error: 'Error al eliminar del carrito' }, { status: 500 })
  }
}
