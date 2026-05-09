import { updateMovie, deleteMovie } from '@/lib/queries'
import { sql } from '@/lib/db'
import { Movie } from '@/types'
import { revalidateTag, revalidatePath } from 'next/cache'
import { sendTelegramNotification } from '@/lib/telegram'

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
    
    // Fetch old movie to compare changes
    const oldMovieResult = await sql`SELECT * FROM movies WHERE id = ${Number(id)}`
    const oldMovie = oldMovieResult[0] as Movie | undefined
    
    const body = await request.json()
    const movie = await updateMovie(Number(id), body)

    if (!movie) {
      return Response.json({ error: 'Movie not found' }, { status: 404 })
    }

    revalidateTag('movie-details', 'default')
    revalidatePath('/')

    if (movie.status === 'published') {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const typeLabel = movie.type === 'series' ? 'Series' : 'Movie'
      
      let message = `🔄 <b>${typeLabel} Updated!</b>\n\n` +
        `<b>Title:</b> ${movie.title}\n` +
        `<b>Year:</b> ${movie.year}\n` +
        `<b>Quality:</b> ${movie.quality}\n`

      // Calculate changes
      if (oldMovie) {
        const getEps = (m: Movie) => {
          const eps = new Set<string>()
          const parse = (str: string | null) => {
            if (!str) return
            try {
              const arr = JSON.parse(str)
              if (Array.isArray(arr)) {
                arr.forEach(a => { if (a.episode) eps.add(String(a.episode)) })
              }
            } catch {}
          }
          parse(m.download_480p)
          parse(m.download_720p)
          parse(m.download_1080p)
          parse(m.download_2k)
          return Array.from(eps)
        }

        const getQualities = (m: Movie) => {
          const q = []
          if (m.download_480p && m.download_480p !== '[]') q.push('480p')
          if (m.download_720p && m.download_720p !== '[]') q.push('720p')
          if (m.download_1080p && m.download_1080p !== '[]') q.push('1080p')
          if (m.download_2k && m.download_2k !== '[]') q.push('2K')
          return q
        }

        const oldEps = getEps(oldMovie)
        const newEps = getEps(movie)
        const addedEps = newEps.filter(ep => !oldEps.includes(ep))

        const oldQ = getQualities(oldMovie)
        const newQ = getQualities(movie)
        const addedQ = newQ.filter(q => !oldQ.includes(q))

        let changesText = ''
        if (movie.type === 'series' && addedEps.length > 0) {
          changesText += `\n• New Episode(s): ${addedEps.join(', ')}`
        }
        if (addedQ.length > 0) {
          changesText += `\n• Quality Added: ${addedQ.join(', ')}`
        }

        if (changesText) {
          message += `\n<b>🔥 What's New:</b>${changesText}\n`
        }
      }

      message += `\nCheck out the latest updates and links below:\n`
      
      const linkUrl = `${siteUrl}/movie/${movie.id}`
      await sendTelegramNotification(message, movie.poster_url, linkUrl)
    }

    return Response.json(movie)
  } catch (error) {
    console.error('Update error:', error)
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

    revalidateTag('movie-details', 'default')
    revalidatePath('/')
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Failed to delete movie' }, { status: 500 })
  }
}
