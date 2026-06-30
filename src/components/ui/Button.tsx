'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary:
    'bg-kuska-red text-white hover:shadow-[0_10px_30px_-8px_rgba(200,75,47,0.6)]',
  secondary:
    'bg-kuska-brown text-white hover:shadow-[0_10px_30px_-8px_rgba(61,28,2,0.55)]',
  gold: 'bg-kuska-gold text-kuska-brown font-bold hover:shadow-[0_10px_30px_-8px_rgba(212,146,10,0.7)]',
  ghost:
    'bg-transparent text-kuska-brown border border-kuska-border hover:bg-kuska-cream-dark',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-btn font-body font-semibold',
          'transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
          'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuska-gold/40',
          'disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
