import { getAllMoviesAdmin } from '@/lib/queries'
import MovieTable from '@/components/admin/MovieTable'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const movies = await getAllMoviesAdmin()

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">All Movies</h1>
          <p className="mt-1 text-sm text-text-secondary sm:text-[15px]">
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'} total
          </p>
        </div>
      </div>

      <MovieTable movies={movies} />
    </div>
  )
}
