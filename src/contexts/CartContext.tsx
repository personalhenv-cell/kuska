'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
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

interface CartContextValue extends CartState {
  loading: boolean
  addItem: (productId: string, quantity: number) => Promise<boolean>
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>
  removeItem: (productId: string) => Promise<boolean>
  clear: () => Promise<void>
  refetch: () => Promise<void>
}

const EMPTY_CART: CartState = { items: [], total: 0, count: 0 }

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [cart, setCart] = useState<CartState>(EMPTY_CART)
  const [loading, setLoading] = useState(true)

  // fetchCart no depende de nada que pueda cambiar — solo fetch de datos
  const fetchCart = useCallback(async () => {
    if (!session) {
      setCart(EMPTY_CART)
      setLoading(false)
      return
    }
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        setCart(data)
      } else {
        // Si el servidor retorna error, resetea a carrito vacío en lugar de
        // dejar el estado viejo que podría estar desincronizado.
        setCart(EMPTY_CART)
      }
    } catch {
      // Network error — deja el estado actual, no resetea
      console.error('Error fetching cart')
    } finally {
      setLoading(false)
    }
  }, [session])

  // Refetch cuando la sesión cambia
  useEffect(() => {
    void fetchCart()
  }, [session])

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, quantity }),
        })
        if (res.ok) {
          await fetchCart()
          return true
        }
        console.error('Failed to add item:', await res.json().catch(() => res.statusText))
      } catch (e) {
        console.error('Error adding to cart:', e)
      }
      return false
    },
    [fetchCart],
  )

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      try {
        const res = await fetch(`/api/cart/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity }),
        })
        if (res.ok) {
          await fetchCart()
          return true
        }
        console.error('Failed to update quantity:', await res.json().catch(() => res.statusText))
      } catch (e) {
        console.error('Error updating quantity:', e)
      }
      return false
    },
    [fetchCart],
  )

  const removeItem = useCallback(
    async (productId: string) => {
      try {
        const res = await fetch(`/api/cart/${productId}`, { method: 'DELETE' })
        if (res.ok) {
          await fetchCart()
          return true
        }
        console.error('Failed to remove item:', await res.json().catch(() => res.statusText))
      } catch (e) {
        console.error('Error removing from cart:', e)
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

  return (
    <CartContext.Provider
      value={{
        items: cart.items,
        total: cart.total,
        count: cart.count,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        refetch: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>')
  }
  return ctx
}
