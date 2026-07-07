'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface CartProduct {
  id: string
  name: string
  price: number
  images: string[]
  stock: number
  slug: string
  artisan: { user: { name: string } }
}

export interface CartItem {
  id: string
  product_id: string
  product: CartProduct
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  count: number
}

const EMPTY_CART: CartState = { items: [], total: 0, count: 0 }

export function useCart() {
  const { data: session } = useSession()
  const [cart, setCart] = useState<CartState>(EMPTY_CART)
  const [loading, setLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    if (!session) {
      setCart(EMPTY_CART)
      setLoading(false)
      return
    }
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        setCart(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity }),
      })
      if (res.ok) {
        await fetchCart()
        return true
      }
      return false
    },
    [fetchCart],
  )

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      const res = await fetch(`/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      if (res.ok) {
        await fetchCart()
        return true
      }
      return false
    },
    [fetchCart],
  )

  const removeItem = useCallback(
    async (productId: string) => {
      const res = await fetch(`/api/cart/${productId}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchCart()
        return true
      }
      return false
    },
    [fetchCart],
  )

  const clear = useCallback(async () => {
    for (const item of cart.items) {
      await removeItem(item.product_id)
    }
  }, [cart.items, removeItem])

  return {
    items: cart.items,
    total: cart.total,
    count: cart.count,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    refetch: fetchCart,
  }
}
