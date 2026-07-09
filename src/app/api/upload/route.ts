import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { z } from 'zod'
import { authOptions } from '@/auth/config'

const UPLOAD_PREFIXES = ['products', 'reviews', 'posts', 'raices', 'avatars'] as const

// Valida la forma exacta "<carpeta>/<userId>/<archivo>" antes de generar el
// token de subida — evita rutas con segmentos vacíos o de otra carpeta.
const PathnameSchema = z
  .string()
  .regex(new RegExp(`^(${UPLOAD_PREFIXES.join('|')})/[^/]+/[^/]+$`), 'Ruta de subida inválida')

export async function POST(req: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = (await req.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!PathnameSchema.safeParse(pathname).success) {
          throw new Error('Ruta de subida no autorizada')
        }
        const allowed = UPLOAD_PREFIXES.some((prefix) => pathname.startsWith(`${prefix}/${session.user.id}/`))
        if (!allowed) {
          throw new Error('Ruta de subida no autorizada')
        }
        const isRaicesAudio = pathname.startsWith(`raices/${session.user.id}/`)
        const isAvatar = pathname.startsWith(`avatars/${session.user.id}/`)
        return {
          allowedContentTypes: isRaicesAudio
            ? [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/avif',
                'audio/mpeg',
                'audio/mp4',
                'audio/wav',
                'audio/webm',
                'audio/ogg',
                'audio/x-m4a',
              ]
            : ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
          // La foto de perfil se muestra pequeña en toda la plataforma
          // (header, tarjetas, reseñas) — 5 MB es de sobra y evita subidas
          // pesadas innecesarias comparado con las fotos de producto (8 MB).
          maximumSizeInBytes: isAvatar ? 5 * 1024 * 1024 : 8 * 1024 * 1024,
        }
      },
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al subir la imagen' },
      { status: 400 },
    )
  }
}
