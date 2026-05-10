import { getPublishedMovies, searchMovies } from '@/lib/queries';
import MovieCard from '@/components/portal/MovieCard';
import Link from 'next/link';

export const revalidate = 3600;

export default async function SearchPage(
  props: { searchParams: Promise<{ [key: string]: string | undefined }> }
) {
  const sp = await props.searchParams;
  const q = sp.q;
  const page = Math.max(1, parseInt(sp.page || '1', 10));
  const type = sp.type;
  const genre = sp.genre;
  const tag = sp.tag;
  const limit = 24;

  let movies = [];
  let total = 0;

  if (q) {
    movies = await searchMovies(q);
    total = movies.length;
    // Basic slicing for search results (since searchMovies doesn't support pagination yet)
    movies = movies.slice((page - 1) * limit, page * limit);
  } else {
    const result = await getPublishedMovies({
      type,
      genre,
      tag,
      page,
      limit,
      sort: sp.sort || 'newest'
    });
    movies = result.movies;
    total = result.total;
  }

  const totalPages = Math.ceil(total / limit);
  const title = q ? `Search: ${q}` : (type || genre || tag || 'All Content');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <div className="space-y-2">
         <h1 className="text-3xl font-black tracking-tighter uppercase">{title}</h1>
         <div className="flex items-center justify-between text-[10px] font-bold text-portal-muted uppercase tracking-[0.2em]">
            <span>{total} Results found</span>
            <div className="flex items-center gap-4">
               <span>Page {page} of {totalPages || 1}</span>
            </div>
         </div>
         <div className="h-1 w-20 bg-portal-accent rounded-full" />
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center rounded-[2.5rem] bg-white border border-portal-border">
           <p className="text-sm font-bold text-portal-muted uppercase tracking-[0.2em]">No movies found matching your criteria</p>
           <Link href="/" className="inline-block mt-6 text-xs font-black uppercase text-portal-accent hover:underline">Return Home</Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          {page > 1 && (
            <Link
              href={`/search?${new URLSearchParams({...sp, page: String(page - 1)}).toString()}`}
              className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-white border border-portal-border text-portal-text hover:border-portal-accent transition-all shadow-sm"
            >
              Prev
            </Link>
          )}
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-portal-border rounded-2xl shadow-sm">
             <span className="text-xs font-black text-portal-accent">{page}</span>
             <span className="text-xs font-bold text-portal-muted">/</span>
             <span className="text-xs font-bold text-portal-muted">{totalPages}</span>
          </div>

          {page < totalPages && (
            <Link
              href={`/search?${new URLSearchParams({...sp, page: String(page + 1)}).toString()}`}
              className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-white border border-portal-border text-portal-text hover:border-portal-accent transition-all shadow-sm"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
