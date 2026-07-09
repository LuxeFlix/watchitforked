import { getMovieById } from './queries'
import type { MovieDetailsData } from '@/components/portal/MovieDetailPage'

/**
 * Server-side data fetching for movie details.
 * This avoids internal fetch calls to local API routes.
 */
export async function getMovieDetails(id: string): Promise<MovieDetailsData | null> {
  const movieId = parseInt(id, 10)
  if (isNaN(movieId)) return null

  const movie = await getMovieById(movieId)
  if (!movie) return null

  const processLinks = (quality: string, value: string | null, label: string) => {
    if (!value) return []
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.map((item: { episode?: string; url: string }) => ({
          quality,
          name: item.episode ? `${movie.title} - Ep ${item.episode} (${quality})` : `${movie.title} - ${quality}`,
          size: quality === '480p' ? '952.42 MB' : quality === '720p' ? '1.2 GB' : quality === '1080p' ? '2.4 GB' : '5.8 GB',
          tag: quality === '2k' ? 'Ultra HD' : 'Good Encode',
          url: item.url,
        }))
      }
    } catch {
      // Not JSON
    }

    return [{
      quality,
      name: `${movie.title} - ${label}`,
      size: quality === '480p' ? '952.42 MB' : quality === '720p' ? '1.2 GB' : quality === '1080p' ? '2.4 GB' : '5.8 GB',
      tag: quality === '2k' ? 'Ultra HD' : 'Good Encode',
      url: value,
    }]
  }

  return {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    rating: movie.rating || 8.5,
    views: movie.views || 0,
    description: movie.description,
    genres: movie.genre || [],
    bannerImage: movie.sample_images?.[0] || movie.poster_url,
    thumbnail: movie.poster_url,
    type: movie.type,
    downloads: [
      ...processLinks('480p', movie.download_480p, '480p'),
      ...processLinks('720p', movie.download_720p, '720p'),
      ...processLinks('1080p', movie.download_1080p, '1080p'),
      ...processLinks('2k', movie.download_2k, '4K UHD'),
    ],
  }
}
