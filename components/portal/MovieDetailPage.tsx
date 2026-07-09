import Link from 'next/link'
import { ChevronLeft, Star, Calendar, Monitor, Users, Info } from 'lucide-react'
import MonetagSideBanners from '@/components/ads/MonetagSideBanners'
import DownloadSection from '@/components/portal/DownloadSection'
import ViewTracker from '@/components/ViewTracker'
import LoadingImage from '@/components/portal/LoadingImage'

export type MovieDetailsData = {
  id: number
  title: string
  year: number
  rating: number
  views: number
  description: string
  genres: string[]
  bannerImage: string
  thumbnail: string
  type: 'movie' | 'series'
  downloads: Array<{
    quality: string
    name: string
    size: string
    tag: string
    url: string
  }>
}

export default function MovieDetailPage({
  movie,
  selectedQuality,
}: {
  movie: MovieDetailsData
  selectedQuality?: string
}) {
  void selectedQuality

  const posterSrc = movie.thumbnail || movie.bannerImage

  return (
    <div className="min-h-screen bg-portal-bg text-portal-text font-sans">
      <MonetagSideBanners />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 lg:space-y-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-portal-muted hover:text-portal-text transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>

        <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)] items-start">
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-3xl border border-portal-border bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
              <div className="relative aspect-[2/3] w-full">
                <LoadingImage
                  src={posterSrc}
                  alt={movie.title}
                  fill
                  eager
                  priority
                  sizes="(max-width: 1024px) 100vw, 380px"
                  wrapperClassName="absolute inset-0"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-portal-muted bg-white w-fit px-4 py-2 rounded-full border border-portal-border shadow-sm">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {movie.year}</span>
              <span className="flex items-center gap-1.5 capitalize"><Monitor className="w-3.5 h-3.5" /> {movie.type}</span>
              <span className="flex items-center gap-1.5 text-yellow-500"><Star className="w-3.5 h-3.5 fill-yellow-500" /> {movie.rating}</span>
            </div>
          </div>

          <div className="space-y-6 lg:pt-2">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-portal-text">{movie.title}</h1>
              <div className="flex items-center gap-2 text-xs font-bold text-portal-muted">
                <Users className="w-3.5 h-3.5" /> {movie.views?.toLocaleString()} views
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                Description
              </h2>
              <p className="text-portal-muted text-sm leading-relaxed font-medium max-w-3xl">
                {movie.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black tracking-tight">Genres</h2>
                <div className="p-1.5 bg-white border border-portal-border rounded-lg shadow-sm">
                  <Info className="w-4 h-4 text-portal-muted" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <div key={g} className="flex items-center gap-2 bg-white border border-portal-border px-4 py-1.5 rounded-lg text-xs font-bold text-portal-muted shadow-sm hover:border-portal-accent transition-colors">
                    <div className="w-3.5 h-3.5 bg-portal-muted/10 rounded" />
                    {g}
                  </div>
                ))}
              </div>
            </div>

            <DownloadSection downloads={movie.downloads} />
          </div>
        </section>
      </main>

      <ViewTracker movieId={movie.id} />
    </div>
  )
}
