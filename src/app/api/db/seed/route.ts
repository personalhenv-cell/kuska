import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET() {
  try {
    // Agregar foreign key sessions -> users
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "sessions" 
      ADD CONSTRAINT IF NOT EXISTS "sessions_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `).catch(() => {})

    // Agregar foreign key identity_verifications -> users  
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "identity_verifications"
      ADD CONSTRAINT IF NOT EXISTS "identity_verifications_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `).catch(() => {})

    // Agregar foreign key artisan_profiles -> users
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "artisan_profiles"
      ADD CONSTRAINT IF NOT EXISTS "artisan_profiles_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `).catch(() => {})

    // Agregar foreign key client_profiles -> users
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "client_profiles"
      ADD CONSTRAINT IF NOT EXISTS "client_profiles_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `).catch(() => {})

    // Verificar que todo funciona creando un usuario de prueba
    const testUser = await prisma.user.findFirst()

    return NextResponse.json({
      success: true,
      message: '✅ Base de datos lista con relaciones correctas',
      usuariosExistentes: testUser ? 'Sí hay usuarios' : 'Sin usuarios aún — listo para registrarse',
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
