import { DefaultSession } from 'next-auth'

type KuskaRole = 'artesano' | 'cliente' | 'admin'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      phone: string
      role: KuskaRole
      artisan_profile_id: string | null
      is_entrepreneur: boolean
      nickname: string | null
    } & DefaultSession['user']
  }

  interface User {
    id: string
    phone: string
    role: KuskaRole
    artisan_profile_id: string | null
    is_entrepreneur: boolean
    nickname: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    phone: string
    role: KuskaRole
    artisan_profile_id: string | null
    is_entrepreneur: boolean
    nickname: string | null
  }
}
