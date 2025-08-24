import { prisma } from './prisma'

// تصدير prisma client المحسن للاستخدام في جميع أنحاء التطبيق
export { prisma as db }

// إعادة تصدير health check function
export { prismaHealthCheck } from './prisma'