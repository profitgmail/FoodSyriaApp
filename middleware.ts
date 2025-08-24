import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const { pathname } = req.nextUrl

  // المسارات المحمية التي تتطلب مصادقة
  const protectedPaths = [
    '/dashboard',
    '/api/orders',
    '/api/reservations',
    '/profile'
  ]

  // التحقق إذا كان المسار محميًا
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )

  // إذا كان المسار محميًا ولا يوجد token، إعادة التوجيه لتسجيل الدخول
  if (isProtectedPath && !token) {
    const url = new URL('/auth/signin', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/orders/:path*',
    '/api/reservations/:path*',
    '/profile/:path*',
  ],
}