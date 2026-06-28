// Kuska — Global TypeScript types

export type UserRole = 'ARTESANO' | 'CLIENTE' | 'ADMIN'
export type Lang = 'es' | 'qu' | 'ay' | 'aw'
export type ProductStatus = 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'PAUSED' | 'SOLD_OUT'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'AT_HUB' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
export type FairType = 'FISICA' | 'DIGITAL' | 'HIBRIDA'
export type FairStatus = 'DRAFT' | 'OPEN' | 'FULL' | 'ACTIVE' | 'CLOSED'
export type WorkshopStatus = 'DRAFT' | 'PUBLISHED' | 'FULL' | 'COMPLETED' | 'CANCELLED'
export type PlanType = 'BASIC' | 'PRO' | 'COLLECTIVE'

export interface User {
  id: string
  phone: string
  email?: string | null
  role: UserRole
  preferredLang: Lang
  isActive: boolean
  createdAt: string
  artisanProfile?: ArtisanProfile | null
  clientProfile?: ClientProfile | null
}

export interface ArtisanProfile {
  id: string
  userId: string
  displayName: string
  bio?: string | null
  craftLineage?: string | null
  community?: string | null
  avatarUrl?: string | null
  coverUrl?: string | null
  isVerified: boolean
  totalSales: number
  avgRating: number
  region?: Region | null
  membership?: Membership | null
  creditScore?: CreditScore | null
}

export interface ClientProfile {
  id: string
  userId: string
  displayName: string
  avatarUrl?: string | null
}

export interface Region {
  id: string
  name: string
  code: string
  latitude?: number | null
  longitude?: number | null
}

export interface Category {
  id: string
  name: string
  slug: string
  iconUrl?: string | null
  parentId?: string | null
  children?: Category[]
}

export interface Product {
  id: string
  artisanId: string
  categoryId: string
  title: string
  slug: string
  description?: string | null
  price: number
  stock: number
  status: ProductStatus
  culturalLineage?: string | null
  materials: string[]
  views: number
  createdAt: string
  artisan?: ArtisanProfile
  category?: Category
  images?: ProductImage[]
  heritageStory?: HeritageStory | null
  reviews?: Review[]
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  altText?: string | null
  isPrimary: boolean
  position: number
}

export interface HeritageStory {
  id: string
  productId: string
  artisanId: string
  title: string
  narrative: string
  audioUrl?: string | null
  videoUrl?: string | null
  lineageTree?: unknown
  culturalRegion?: string | null
  generationNum?: number | null
  langVersions?: unknown
  views: number
  createdAt: string
}

export interface Fair {
  id: string
  name: string
  type: FairType
  status: FairStatus
  description?: string | null
  startDate: string
  endDate: string
  locationName?: string | null
  latitude?: number | null
  longitude?: number | null
  streamUrl?: string | null
  maxArtisans?: number | null
  bannerUrl?: string | null
  region?: Region | null
}

export interface Workshop {
  id: string
  artisanId: string
  title: string
  description?: string | null
  price: number
  isFree: boolean
  maxStudents: number
  durationHrs?: number | null
  modality: string
  status: WorkshopStatus
  scheduledAt?: string | null
  coverUrl?: string | null
  artisan?: ArtisanProfile
}

export interface CreditScore {
  id: string
  artisanId: string
  score: number
  tier: string
  salesCount: number
  salesTotal: number
  reputationAvg: number
  lastCalculated: string
}

export interface Membership {
  id: string
  artisanId: string
  plan: PlanType
  isActive: boolean
  expiresAt?: string | null
}

export interface Review {
  id: string
  productId: string
  clientId: string
  rating: number
  comment?: string | null
  createdAt: string
}

export interface CfoConversation {
  id: string
  artisanId: string
  messages: ChatMessage[]
  createdAt: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface FinancialRecord {
  id: string
  artisanId: string
  type: 'INGRESO' | 'EGRESO' | 'INVERSION' | 'DEVOLUCION'
  amount: number
  description?: string | null
  category?: string | null
  recordedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'SALE' | 'MESSAGE' | 'FAIR' | 'SYSTEM' | 'PAYMENT'
  title: string
  body: string
  data?: unknown
  isRead: boolean
  createdAt: string
}

export interface AcademyCourse {
  id: string
  title: string
  description?: string | null
  provider?: string | null
  category?: string | null
  durationHrs?: number | null
  level: string
  coverUrl?: string | null
  isFree: boolean
  langVersions: string[]
}

export interface AcademyProgress {
  id: string
  artisanId: string
  courseId: string
  completedPct: number
  completedAt?: string | null
  startedAt: string
}

export interface CommunityPost {
  id: string
  artisanId: string
  content: string
  mediaUrls: string[]
  tags: string[]
  likes: number
  isPinned: boolean
  createdAt: string
  artisan?: ArtisanProfile
  comments?: PostComment[]
}

export interface PostComment {
  id: string
  postId: string
  userId: string
  content: string
  createdAt: string
}

export interface Order {
  id: string
  clientId: string
  status: OrderStatus
  subtotal: number
  shippingCost: number
  commission: number
  total: number
  notes?: string | null
  paidAt?: string | null
  createdAt: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  artisanId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product?: Product
}

// API response wrappers
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Session user (from next-auth)
export interface SessionUser {
  id: string
  phone: string
  role: UserRole
  name?: string | null
  image?: string | null
}
