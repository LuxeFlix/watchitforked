import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE_NAME = 'admin_session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin/* sub-routes, allow /admin (login page) itself
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const cookie = request.cookies.get(ADMIN_COOKIE_NAME)

    if (!cookie?.value) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
