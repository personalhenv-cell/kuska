import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "users" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"phone" TEXT NOT NULL,"email" TEXT,"role" TEXT NOT NULL DEFAULT 'CLIENTE',"preferredLang" TEXT NOT NULL DEFAULT 'es',"isActive" BOOLEAN NOT NULL DEFAULT true,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "users_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "users_phone_key" ON "users"("phone")`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "sessions" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"userId" TEXT NOT NULL,"token" TEXT NOT NULL,"expiresAt" TIMESTAMP(3) NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "sessions_token_key" ON "sessions"("token")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "identity_verifications" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"userId" TEXT NOT NULL,"dni" TEXT NOT NULL,"firstName" TEXT,"lastName" TEXT,"fullName" TEXT,"selfieUrl" TEXT,"reniecStatus" TEXT NOT NULL DEFAULT 'PENDING',"reniecPayload" JSONB,"verifiedAt" TIMESTAMP(3),"expiresAt" TIMESTAMP(3),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "identity_verifications_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "identity_verifications_userId_key" ON "identity_verifications"("userId")`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "identity_verifications_dni_key" ON "identity_verifications"("dni")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "regions" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"name" TEXT NOT NULL,"code" TEXT NOT NULL,"latitude" DOUBLE PRECISION,"longitude" DOUBLE PRECISION,CONSTRAINT "regions_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "regions_name_key" ON "regions"("name")`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "regions_code_key" ON "regions"("code")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "artisan_profiles" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"userId" TEXT NOT NULL,"displayName" TEXT NOT NULL,"bio" TEXT,"craftLineage" TEXT,"regionId" TEXT,"community" TEXT,"workshopAddress" TEXT,"phone" TEXT,"whatsapp" TEXT,"avatarUrl" TEXT,"coverUrl" TEXT,"isVerified" BOOLEAN NOT NULL DEFAULT false,"totalSales" INTEGER NOT NULL DEFAULT 0,"avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "artisan_profiles_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "artisan_profiles_userId_key" ON "artisan_profiles"("userId")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "client_profiles" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"userId" TEXT NOT NULL,"displayName" TEXT NOT NULL,"avatarUrl" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "client_profiles_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "client_profiles_userId_key" ON "client_profiles"("userId")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "categories" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"name" TEXT NOT NULL,"slug" TEXT NOT NULL,"iconUrl" TEXT,"parentId" TEXT,CONSTRAINT "categories_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "categories_name_key" ON "categories"("name")`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_key" ON "categories"("slug")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "products" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"artisanId" TEXT NOT NULL,"categoryId" TEXT NOT NULL,"regionId" TEXT,"title" TEXT NOT NULL,"slug" TEXT NOT NULL,"description" TEXT,"price" DOUBLE PRECISION NOT NULL,"stock" INTEGER NOT NULL DEFAULT 1,"status" TEXT NOT NULL DEFAULT 'DRAFT',"culturalLineage" TEXT,"materials" TEXT[] DEFAULT ARRAY[]::TEXT[],"dimensions" JSONB,"saleMode" TEXT NOT NULL DEFAULT 'PLATFORM',"whatsappNumber" TEXT,"views" INTEGER NOT NULL DEFAULT 0,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "products_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_key" ON "products"("slug")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "product_images" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"productId" TEXT NOT NULL,"url" TEXT NOT NULL,"altText" TEXT,"isPrimary" BOOLEAN NOT NULL DEFAULT false,"position" INTEGER NOT NULL DEFAULT 0,CONSTRAINT "product_images_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "heritage_stories" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"productId" TEXT NOT NULL,"artisanId" TEXT NOT NULL,"title" TEXT NOT NULL,"narrative" TEXT NOT NULL,"audioUrl" TEXT,"videoUrl" TEXT,"lineageTree" JSONB,"symbolsMeaning" JSONB,"culturalRegion" TEXT,"generationNum" INTEGER,"langVersions" JSONB,"views" INTEGER NOT NULL DEFAULT 0,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "heritage_stories_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "heritage_stories_productId_key" ON "heritage_stories"("productId")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "raices_media" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"storyId" TEXT NOT NULL,"type" TEXT NOT NULL,"url" TEXT NOT NULL,"caption" TEXT,"position" INTEGER NOT NULL DEFAULT 0,CONSTRAINT "raices_media_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "linaje_cultural" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"artisanId" TEXT NOT NULL,"techniqueName" TEXT NOT NULL,"originRegion" TEXT,"originYear" INTEGER,"description" TEXT,"ancestors" JSONB,"certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "linaje_cultural_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "memberships" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"artisanId" TEXT NOT NULL,"plan" TEXT NOT NULL DEFAULT 'BASIC',"startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"expiresAt" TIMESTAMP(3),"isActive" BOOLEAN NOT NULL DEFAULT true,"paidAt" TIMESTAMP(3),"amount" DOUBLE PRECISION NOT NULL DEFAULT 10,CONSTRAINT "memberships_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "memberships_artisanId_key" ON "memberships"("artisanId")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "notifications" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"userId" TEXT NOT NULL,"type" TEXT NOT NULL,"title" TEXT NOT NULL,"body" TEXT NOT NULL,"data" JSONB,"isRead" BOOLEAN NOT NULL DEFAULT false,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "notifications_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "financial_records" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"artisanId" TEXT NOT NULL,"type" TEXT NOT NULL,"amount" DOUBLE PRECISION NOT NULL,"description" TEXT,"category" TEXT,"referenceId" TEXT,"recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "financial_records_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "credit_scores" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"artisanId" TEXT NOT NULL,"score" INTEGER NOT NULL DEFAULT 0,"tier" TEXT NOT NULL DEFAULT 'BRONCE',"salesCount" INTEGER NOT NULL DEFAULT 0,"salesTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,"reputationAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,"activityDays" INTEGER NOT NULL DEFAULT 0,"scoreBreakdown" JSONB,"lastCalculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "credit_scores_pkey" PRIMARY KEY ("id"))`)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "credit_scores_artisanId_key" ON "credit_scores"("artisanId")`)

    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "cfo_conversations" ("id" TEXT NOT NULL DEFAULT gen_random_uuid(),"artisanId" TEXT NOT NULL,"messages" JSONB NOT NULL DEFAULT '[]',"context" JSONB,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "cfo_conversations_pkey" PRIMARY KEY ("id"))`)

    // Seed categorías
    const cats = [
      ['Textilería','textileria'],['Cerámica','ceramica'],
      ['Joyería y orfebrería','joyeria'],['Madera tallada','madera'],
      ['Cestería','cesteria'],['Pintura y arte','pintura'],
      ['Bordados','bordados'],['Instrumentos musicales','instrumentos'],
    ]
    for (const [name, slug] of cats) {
      await prisma.$executeRawUnsafe(`INSERT INTO "categories" ("id","name","slug") VALUES (gen_random_uuid(),'${name}','${slug}') ON CONFLICT ("slug") DO NOTHING`)
    }

    // Seed regiones
    const regs = [
      ['Amazonas','amazonas'],['Ancash','ancash'],['Apurimac','apurimac'],
      ['Arequipa','arequipa'],['Ayacucho','ayacucho'],['Cajamarca','cajamarca'],
      ['Callao','callao'],['Cusco','cusco'],['Huancavelica','huancavelica'],
      ['Huanuco','huanuco'],['Ica','ica'],['Junin','junin'],
      ['La Libertad','la-libertad'],['Lambayeque','lambayeque'],['Lima','lima'],
      ['Loreto','loreto'],['Madre de Dios','madre-de-dios'],['Moquegua','moquegua'],
      ['Pasco','pasco'],['Piura','piura'],['Puno','puno'],
      ['San Martin','san-martin'],['Tacna','tacna'],['Tumbes','tumbes'],['Ucayali','ucayali'],
    ]
    for (const [name, code] of regs) {
      await prisma.$executeRawUnsafe(`INSERT INTO "regions" ("id","name","code") VALUES (gen_random_uuid(),'${name}','${code}') ON CONFLICT ("code") DO NOTHING`)
    }

    return NextResponse.json({
      success: true,
      message: '✅ Base de datos inicializada correctamente. Ya puedes registrarte.',
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
