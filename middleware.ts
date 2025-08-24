import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

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

  // إذا كان المسار محميًا ولا يوجد session، إعادة التوجيه لتسجيل الدخول
  if (isProtectedPath && !session) {
    const url = new URL('/auth/signin', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/orders/:path*',
    '/api/reservations/:path*',
    '/profile/:path*',
  ],
}