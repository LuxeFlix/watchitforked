import { getAllMoviesAdmin, createMovie } from '@/lib/queries'

export async function GET() {
  try {
    const movies = await getAllMoviesAdmin()
    return Response.json(movies)
  } catch {
    return Response.json({ error: 'Failed to fetch movies' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.title || !body.type || !body.quality || !body.poster_url) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const movie = await createMovie({
      ...body,
      year: typeof body.year === 'number' ? body.year : 0,
      language: typeof body.language === 'string' ? body.language : '',
      genre: Array.isArray(body.genre) ? body.genre : [],
      description: typeof body.description === 'string' ? body.description : '',
      status: body.status || 'published',
    })

    return Response.json(movie, { status: 201 })
  } catch {
    return Response.json({ error: 'Failed to create movie' }, { status: 500 })
  }
}
