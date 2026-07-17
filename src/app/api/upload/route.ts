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

  let body: HandleUploadBody
  try {
    body = (await req.json()) as HandleUploadBody
  } catch (e) {
    console.error('Error parsing upload request body:', e)
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      // El store de Blob público vive bajo el prefijo PUBLIC_* (el store
      // BLOB_* original quedó configurado como privado y nunca permitió
      // subir nada). handleUpload usa BLOB_READ_WRITE_TOKEN por defecto,
      // así que hay que pasarle el token correcto explícitamente.
      token: process.env.PUBLIC_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        console.log(`Upload validation for pathname: ${pathname}`)

        const pathValidation = PathnameSchema.safeParse(pathname)
        if (!pathValidation.success) {
          console.error(`Pathname validation failed: ${pathname}`, pathValidation.error)
          throw new Error('Ruta de subida no autorizada (formato inválido)')
        }

        const allowed = UPLOAD_PREFIXES.some((prefix) => pathname.startsWith(`${prefix}/${session.user.id}/`))
        if (!allowed) {
          console.error(`Pathname not authorized for user ${session.user.id}: ${pathname}`)
          throw new Error('Ruta de subida no autorizada (usuario no permitido)')
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
          maximumSizeInBytes: isAvatar ? 5 * 1024 * 1024 : 8 * 1024 * 1024,
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // Este callback SOLO se dispara cuando Vercel Blob confirma que el
        // archivo llegó completo al storage — es la única forma real de
        // saber si una subida terminó, a diferencia de la generación de
        // token (que solo confirma que el usuario está autorizado).
        console.log(`Upload confirmed complete by Blob storage: ${blob.url}`)
      },
    })
    console.log(`/api/upload request handled OK for user ${session.user.id} (type=${body.type})`)
    return NextResponse.json(jsonResponse)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido'
    console.error(`Upload error for user ${session.user.id}:`, errorMsg)
    return NextResponse.json(
      { error: errorMsg },
      { status: 400 },
    )
  }
}
