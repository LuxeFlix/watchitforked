import { getAllMoviesAdmin, createMovie } from '@/lib/queries'
import { revalidatePath } from 'next/cache'
import { sendTelegramNotification } from '@/lib/telegram'

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

    revalidatePath('/')

    if (movie.status === 'published') {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const typeLabel = movie.type === 'series' ? 'Series' : 'Movie'
      const message = `🎬 <b>New ${typeLabel} Uploaded!</b>\n\n` +
        `📌<b>Title:</b> ${movie.title}\n` +
        `📅 <b>Year:</b> ${movie.year}\n` +
        `🎭 <b>Type:</b> ${typeLabel}\n` +
        `🎬 <b>Quality:</b> ${movie.quality}\n\n` +
        `Check out the latest updates and links below:`
      
      const linkUrl = `${siteUrl}/movie/${movie.id}`
      await sendTelegramNotification(message, movie.poster_url, linkUrl)
    }

    return Response.json(movie, { status: 201 })
  } catch {
    return Response.json({ error: 'Failed to create movie' }, { status: 500 })
  }
}
