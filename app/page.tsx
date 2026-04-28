import Link from 'next/link';
import SectionRow from '@/components/SectionRow';
import MovieGrid from '@/components/MovieGrid';
import { getTrending, getHotNew, getMostWatched, getPublishedMovies } from '@/lib/queries';

export const revalidate = 3600;

export default async function HomePage(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const sp = await props.searchParams;
  const page = Math.max(1, parseInt(typeof sp.page === 'string' ? sp.page : '1', 10));

  const [trending, hotNew, mostWatched, { movies: allMovies, total }] = await Promise.all([
    getTrending(),
    getHotNew(),
    getMostWatched(),
    getPublishedMovies({ sort: 'newest', page, limit: 30 }),
  ]);

  const totalPages = Math.ceil(total / 30);

  return (
    <div className="pb-20">
      <div className="space-y-2">
        <SectionRow
          title="Trending This Week"
          emoji="🔥"
          movies={trending}
          seeAllLink="/search?sort=trending"
        />

        <SectionRow
          title="Hot & New"
          emoji="🆕"
          movies={hotNew}
          seeAllLink="/search?sort=newest"
        />

        <SectionRow
          title="Most Watched"
          emoji="👁"
          movies={mostWatched}
          seeAllLink="/search?sort=most_watched"
        />

        <div className="pt-12 px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🍿</span>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">All Movies</h2>
            </div>
            <p className="text-sm text-text-secondary">{total} titles</p>
          </div>

          <MovieGrid movies={allMovies} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {page > 1 ? (
                <Link
                  href={`/?page=${page - 1}`}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-card border border-border text-white hover:bg-elevated transition-colors"
                >
                  Previous
                </Link>
              ) : (
                <span className="px-4 py-2 text-sm font-medium rounded-lg bg-card border border-border text-white opacity-30 cursor-not-allowed">
                  Previous
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="px-1 text-text-secondary">...</span>
                    )}
                    <Link
                      href={`/?page=${p}`}
                      className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                        p === page
                          ? 'bg-primary text-white'
                          : 'bg-card border border-border text-text-secondary hover:bg-elevated hover:text-white'
                      }`}
                    >
                      {p}
                    </Link>
                  </span>
                ))}

              {page < totalPages ? (
                <Link
                  href={`/?page=${page + 1}`}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-card border border-border text-white hover:bg-elevated transition-colors"
                >
                  Next
                </Link>
              ) : (
                <span className="px-4 py-2 text-sm font-medium rounded-lg bg-card border border-border text-white opacity-30 cursor-not-allowed">
                  Next
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
