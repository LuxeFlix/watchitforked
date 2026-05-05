import { getPublishedMovies } from '@/lib/queries';
import MovieCard from '@/components/portal/MovieCard';
import Link from 'next/link';

export const revalidate = 3600;

export default async function HomePage(
  props: { searchParams: Promise<{ page?: string }> }
) {
  const sp = await props.searchParams;
  const page = Math.max(1, parseInt(sp.page || '1', 10));
  const limit = 24;

  const { movies, total } = await getPublishedMovies({ 
    sort: 'newest', 
    page, 
    limit 
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Hero / Promo Area */}
      <section className="relative rounded-[2.5rem] bg-portal-text text-white p-8 sm:p-12 overflow-hidden shadow-2xl">
         <div className="relative z-10 max-w-sm space-y-6">
            <div className="bg-portal-accent w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
               New Release
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none">
               STREAM WITHOUT LIMITS.
            </h1>
            <p className="text-sm font-medium text-white/60 leading-relaxed">
               Discover the latest movies and series. No subscriptions, just high-quality entertainment delivered directly to your screen.
            </p>
            <button className="bg-white text-portal-text px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-portal-accent hover:text-white transition-all shadow-xl">
               Browse All
            </button>
         </div>
         
         {/* Abstract Decoration */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-portal-accent/20 to-transparent pointer-events-none" />
         <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-portal-accent/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Grid Header */}
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight uppercase">Latest Updates</h2>
            <div className="h-1 w-12 bg-portal-accent rounded-full" />
         </div>
         <span className="text-[10px] font-black text-portal-muted uppercase tracking-[0.2em] bg-white border border-portal-border px-4 py-2 rounded-xl shadow-sm">
            {total} Titles Found
         </span>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}`}
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
              href={`/?page=${page + 1}`}
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
