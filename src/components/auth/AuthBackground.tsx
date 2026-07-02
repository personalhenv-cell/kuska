import Image from 'next/image'
import type { ReactNode } from 'react'

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  left: `${((i * 4.13 + 7) % 100).toFixed(1)}%`,
  size: 4 + (i % 4) * 4,
  duration: `${6 + (i % 5)}s`,
  delay: `${(i * 0.65).toFixed(1)}s`,
  isGold: i % 3 !== 0,
}))

export function AuthBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/*
        Fondo fijado al viewport real (fixed, no absolute dentro de un
        contenedor min-h-screen). min-height no es una altura definida, así
        que los hijos con alturas en % (ej. h-[45%]) colapsaban a 0 y la
        imagen con `fill` terminaba estirándose a pantalla completa — bug
        real reproducido en móvil. `fixed inset-0` siempre mide 100dvh.
      */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient base */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'linear-gradient(135deg, #1a1410 0%, #3D1C02 50%, #2E7A6E 100%)' }}
        />

        {/* Foto real de los Andes — protagonista, sin montañas SVG genéricas */}
        <div className="absolute inset-0 z-0" aria-hidden>
          <div
            className="absolute bottom-0 h-[62%] w-full opacity-[0.45]"
            style={{
              maskImage: 'linear-gradient(180deg, transparent 0%, black 30%)',
              WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 30%)',
            }}
          >
            <Image
              src="/mountains-peru-view.png"
              alt=""
              fill
              className="object-cover"
              style={{ objectPosition: '50% 30%' }}
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(26,20,16,0.55) 0%, rgba(61,28,2,0.35) 45%, rgba(26,20,16,0.85) 100%)',
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-[2]" aria-hidden>
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute bottom-0 rounded-full"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                background: p.isGold
                  ? 'rgba(212,146,10,0.4)'
                  : 'rgba(245,240,232,0.18)',
                animation: `kusi-float ${p.duration} ease-in-out ${p.delay} infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
