'use client'

import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  /** Muestra un checkmark verde animado cuando el valor es válido. */
  valid?: boolean
}

/** Input con float label, validación visual y shake en error. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, valid, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const showCheck = valid && !error

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
              showCheck && 'pr-11',
              error
                ? 'border-kuska-red focus:ring-kuska-red/30'
                : showCheck
                  ? 'border-kuska-teal focus:ring-kuska-teal/30'
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
          {showCheck && (
            <svg
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-kuska-teal animate-[kusi-celebrate_0.5s_ease]"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
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
