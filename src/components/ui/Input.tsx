'use client'

import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/** Input con float label, validación visual y shake en error. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className="w-full">
        <div className={cn('relative', error && 'animate-[kusi-wave_0.4s_ease]')}>
          <input
            ref={ref}
            id={inputId}
            placeholder=" "
            className={cn(
              'peer h-14 w-full rounded-btn border bg-white px-4 pt-4 font-body text-kuska-text',
              'transition-all duration-200 placeholder-transparent',
              'focus:outline-none focus:ring-2',
              error
                ? 'border-kuska-red focus:ring-kuska-red/30'
                : 'border-kuska-border focus:border-kuska-gold focus:ring-kuska-gold/30',
              className,
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              'pointer-events-none absolute left-4 top-1.5 font-body text-xs text-kuska-text-mid',
              'transition-all duration-200',
              'peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px]',
              'peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-kuska-gold',
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1.5 font-body text-sm text-kuska-red" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
