import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE_NAME = 'admin_session'

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // Protect /admin/* (except /admin) and /api/admin/* (except login)
  const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin'
  const isAdminApi = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login'

  if (isAdminPath || isAdminApi) {
    const cookie = request.cookies.get(ADMIN_COOKIE_NAME)

    if (!cookie?.value) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

export default proxy;
