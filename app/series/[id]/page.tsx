import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { getMovieDetails } from '@/lib/api'
import MovieDetailPage from '@/components/portal/MovieDetailPage'
import { getMovieDetailPath } from '@/lib/routes'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const movie = await getMovieDetails(id)

  if (!movie) {
    return {}
  }

  return {
    title: movie.title,
  }
}

export default async function SeriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ quality?: string }>
}) {
  const { id } = await params
  const { quality: selectedQuality } = await searchParams
  const movie = await getMovieDetails(id)

  if (!movie) notFound()

  if (movie.type === 'movie') {
    redirect(getMovieDetailPath(movie))
  }

  return <MovieDetailPage movie={movie} selectedQuality={selectedQuality} />
}
