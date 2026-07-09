import { Movie } from '@/types'

export function getMovieDetailPath(movie: Pick<Movie, 'id' | 'type'>) {
  return movie.type === 'series' ? `/series/${movie.id}` : `/movie/${movie.id}`
}

export function getMovieDetailUrl(movie: Pick<Movie, 'id' | 'type'>, siteUrl: string) {
  return `${siteUrl}${getMovieDetailPath(movie)}`
}
