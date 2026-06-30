export interface ProductArtisan {
  id: string
  region: string
  technique: string
  is_verified: boolean
  user: { name: string; avatar_url: string | null }
}

export interface ProductListItem {
  id: string
  slug: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  technique: string
  region: string
  rating: number
  sales_count: number
  is_featured: boolean
  is_boosted: boolean
  artisan: ProductArtisan
  _count: { favorites: number; reviews: number }
}

export interface ProductDetail extends ProductListItem {
  stock: number
  materials: string[]
  dominant_colors: string[]
  is_custom_order: boolean
  views: number
  artisan: ProductArtisan & {
    user: { name: string; avatar_url: string | null; phone: string | null }
    bio?: string | null
    story?: string | null
    whatsapp?: string | null
    years_experience: number
    rating: number
    total_sales: number
  }
  reviews: ReviewItem[]
}

export interface ReviewItem {
  id: string
  rating: number
  comment: string
  is_verified: boolean
  created_at: string
  reviewer: { name: string; avatar_url: string | null }
}

export interface ProductsResponse {
  products: ProductListItem[]
  meta: { total: number; page: number; limit: number; pages: number }
}

export interface FiltersState {
  q: string
  region: string
  technique: string
  category: string
  minPrice: string
  maxPrice: string
}
