import { PrismaClient } from '@prisma/client'

// تعريف global type للـ Prisma Client
declare global {
  var prisma: PrismaClient | undefined
}

// إنشاء Prisma Client مع إعدادات محسنة لـ Vercel
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// تجنب إنشاء عدة instances من Prisma Client في development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// إضافة health check function
export async function prismaHealthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', message: 'Database connection is healthy' }
  } catch (error) {
    return { status: 'unhealthy', message: 'Database connection failed', error }
  }
}

export default prisma