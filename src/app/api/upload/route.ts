import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { authOptions } from '@/auth/config'

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
        if (!pathname.startsWith(`products/${session.user.id}/`)) {
          throw new Error('Ruta de subida no autorizada')
        }
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
          maximumSizeInBytes: 8 * 1024 * 1024,
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
