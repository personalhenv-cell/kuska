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

        {/* Textura fotográfica de montañas reales, integrada al tono nocturno */}
        <div className="absolute inset-0 z-0" aria-hidden>
          <div className="absolute bottom-0 h-[45%] w-full opacity-[0.2] mix-blend-luminosity">
            <Image
              src="/mountains-peru-view.png"
              alt=""
              fill
              className="object-cover"
              style={{ objectPosition: '50% 35%' }}
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(26,20,16,0.7) 55%, #1a1410 100%)',
            }}
          />
        </div>

        {/* Mountains — 3 planes (same as loading screen) */}
        <div className="absolute inset-0 z-[1]" aria-hidden>
          <svg
            className="absolute bottom-0 animate-mountain-far"
            style={{ width: '200%', height: '35%', filter: 'drop-shadow(0 0 8px rgba(212,146,10,0.5))' }}
            viewBox="0 0 3840 400"
            preserveAspectRatio="none"
          >
            <path
              d="M0 400 L0 250 L240 80 L480 190 L720 50 L960 180 L1200 70 L1440 190 L1680 80 L1920 250 L2160 80 L2400 190 L2640 50 L2880 180 L3120 70 L3360 190 L3600 80 L3840 250 L3840 400 Z"
              fill="#1a4a42"
            />
          </svg>
          <svg
            className="absolute bottom-0 animate-mountain-mid"
            style={{ width: '200%', height: '27%', filter: 'drop-shadow(0 0 8px rgba(212,146,10,0.4))' }}
            viewBox="0 0 3840 320"
            preserveAspectRatio="none"
          >
            <path
              d="M0 320 L0 200 L300 90 L600 155 L900 70 L1200 155 L1500 90 L1920 200 L2220 90 L2520 155 L2820 70 L3120 155 L3420 90 L3840 200 L3840 320 Z"
              fill="#2E7A6E"
            />
          </svg>
          <svg
            className="absolute bottom-0 animate-mountain-near"
            style={{ width: '200%', height: '18%', filter: 'drop-shadow(0 0 10px rgba(212,146,10,0.55))' }}
            viewBox="0 0 3840 220"
            preserveAspectRatio="none"
          >
            <path
              d="M0 220 L0 140 L250 90 L450 130 L700 60 L900 120 L1150 80 L1400 130 L1920 140 L2170 90 L2370 130 L2620 60 L2820 120 L3070 80 L3320 130 L3840 140 L3840 220 Z"
              fill="#3D1C02"
            />
          </svg>
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
