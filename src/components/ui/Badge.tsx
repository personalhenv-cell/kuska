import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'region' | 'technique' | 'new' | 'premium' | 'verified'

const variants: Record<BadgeVariant, string> = {
  region: 'bg-kuska-teal/15 border-kuska-teal/30 text-kuska-teal',
  technique: 'bg-kuska-gold/15 border-kuska-gold/30 text-[#9a6a07]',
  new: 'bg-kuska-red/15 border-kuska-red/30 text-kuska-red',
  premium:
    'bg-gradient-to-r from-kuska-gold to-[#e9a93a] border-transparent text-kuska-brown font-bold',
  verified: 'bg-kuska-teal border-transparent text-white',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'region', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1',
        'font-nunito text-xs font-bold',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
