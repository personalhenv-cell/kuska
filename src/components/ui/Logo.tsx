import Image from 'next/image'

interface LogoProps {
  /** Tamaño del círculo en px */
  size?: number
  className?: string
  /** 'dark' disuelve el fondo crema del PNG vía mix-blend-mode:multiply (fondos oscuros).
   *  'light' lo deja normal, para fondos claros donde no hace falta disolver nada. */
  variant?: 'dark' | 'light'
  priority?: boolean
}

// logo.png es el lockup completo (glifo + wordmark + tagline) sobre un
// cuadrado crema sólido. Estas constantes recortan/zoom hacia el glifo
// circular únicamente, y mix-blend-mode:multiply disuelve el fondo crema
// sobre fondos oscuros.
const ICON_CENTER_X = 50
const ICON_CENTER_Y = 33
const ZOOM = 2.3

export function Logo({ size = 40, className, variant = 'dark', priority = false }: LogoProps) {
  const scaled = size * ZOOM
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '9999px',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        background: variant === 'light' ? '#F5F0E8' : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: scaled,
          height: scaled,
          left: `calc(50% - ${(scaled * ICON_CENTER_X) / 100}px)`,
          top: `calc(50% - ${(scaled * ICON_CENTER_Y) / 100}px)`,
          mixBlendMode: variant === 'dark' ? 'multiply' : 'normal',
        }}
      >
        <Image
          src="/logo.png"
          alt="Kuska"
          width={scaled}
          height={scaled}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
