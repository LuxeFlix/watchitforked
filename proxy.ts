import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE_NAME = 'admin_session'

async function getCanonicalMediaPath(request: NextRequest, pathname: string) {
  const match = pathname.match(/^\/(movie|series)\/(\d+)$/)
  if (!match) return null

  const [, currentKind, id] = match
  try {
    const response = await fetch(new URL(`/api/movies/${id}`, request.url))
    if (!response.ok) return null

    const movie = await response.json()
    const canonicalKind = movie?.type === 'series' ? 'series' : 'movie'

    if (canonicalKind !== currentKind) {
      return `/${canonicalKind}/${id}`
    }
  } catch {
    return null
  }

  return null
}

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  const canonicalMediaPath = await getCanonicalMediaPath(request, pathname)
  if (canonicalMediaPath) {
    const redirectUrl = new URL(canonicalMediaPath, request.url)
    redirectUrl.search = request.nextUrl.search
    return NextResponse.redirect(redirectUrl)
  }

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
  matcher: ['/admin/:path*', '/api/admin/:path*', '/movie/:path*', '/series/:path*'],
}

export default proxy
