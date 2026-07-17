/**
 * Redimensiona y comprime una imagen en el navegador antes de subirla — una
 * foto de cámara de celular sin comprimir (3-8 MB) puede tardar minutos en
 * subir con mala señal; el mismo producto a 1600px/JPEG 82% pesa una
 * fracción de eso y sube en segundos sin perder calidad visible en la web.
 */
export async function compressImage(file: File, maxDimension = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob || blob.size >= file.size) return file

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } catch {
    // Si algo falla (formato no soportado, navegador sin createImageBitmap),
    // seguimos con el archivo original en vez de bloquear la subida.
    return file
  }
}
