import { cookies } from 'next/headers'
import { sql } from '@/lib/db'
import bcrypt from 'bcryptjs'

const ADMIN_COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return Response.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const result = await sql`
      SELECT id, username, password_hash FROM admin_users WHERE username = ${username}
    `

    if (result.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = result[0]
    const isValid = await bcrypt.compare(password, user.password_hash as string)

    if (!isValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE_NAME, String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })

    return Response.json({ success: true, username: user.username })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
