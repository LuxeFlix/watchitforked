import { toggleMovieStatus } from '@/lib/queries'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const movie = await toggleMovieStatus(Number(id))

    if (!movie) {
      return Response.json({ error: 'Movie not found' }, { status: 404 })
    }

    return Response.json(movie)
  } catch {
    return Response.json(
      { error: 'Failed to toggle status' },
      { status: 500 }
    )
  }
}
