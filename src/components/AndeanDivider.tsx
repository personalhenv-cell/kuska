import { cn } from '@/lib/utils'

/**
 * Divider con patrón de rombos escalonados incas en dorado.
 * Usado entre secciones para dar ritmo andino a la página.
 */
export function AndeanDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex h-12 w-full items-center justify-center', className)}
      aria-hidden
    >
      <svg
        width="100%"
        height="24"
        viewBox="0 0 240 24"
        preserveAspectRatio="xMidYMid meet"
        className="max-w-md opacity-25"
        fill="none"
      >
        <g stroke="#D4920A" strokeWidth="1.5">
          {Array.from({ length: 9 }).map((_, i) => {
            const x = 16 + i * 26
            return (
              <g key={i}>
                <path d={`M${x} 4 L${x + 8} 12 L${x} 20 L${x - 8} 12 Z`} />
                <path
                  d={`M${x} 9 L${x + 3} 12 L${x} 15 L${x - 3} 12 Z`}
                  fill="#D4920A"
                  fillOpacity="0.5"
                />
              </g>
            )
          })}
          <line x1="0" y1="12" x2="8" y2="12" />
          <line x1="232" y1="12" x2="240" y2="12" />
        </g>
      </svg>
    </div>
  )
}
