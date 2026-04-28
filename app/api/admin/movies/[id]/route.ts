import { updateMovie, deleteMovie } from '@/lib/queries'
import { sql } from '@/lib/db'
import { Movie } from '@/types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Admin GET: no status filter (can see drafts too)
    const result = await sql`SELECT * FROM movies WHERE id = ${Number(id)}`

    if (result.length === 0) {
      return Response.json({ error: 'Movie not found' }, { status: 404 })
    }

    return Response.json(result[0] as Movie)
  } catch {
    return Response.json({ error: 'Failed to fetch movie' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const movie = await updateMovie(Number(id), body)

    if (!movie) {
      return Response.json({ error: 'Movie not found' }, { status: 404 })
    }

    return Response.json(movie)
  } catch {
    return Response.json({ error: 'Failed to update movie' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = await deleteMovie(Number(id))

    if (!deleted) {
      return Response.json({ error: 'Movie not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Failed to delete movie' }, { status: 500 })
  }
}
