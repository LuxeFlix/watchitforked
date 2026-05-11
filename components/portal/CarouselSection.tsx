import MovieCard from './MovieCard';
import { Movie } from '@/types';
import Link from 'next/link';

export default function CarouselSection({ 
  title, 
  movies,
  viewAllLink
}: { 
  title: string; 
  movies: Movie[];
  viewAllLink?: string;
}) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="space-y-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-portal-text">
            {title}
          </h2>
          <div className="h-1 w-12 bg-portal-accent rounded-full" />
        </div>
        {viewAllLink && (
          <Link 
            href={viewAllLink}
            className="text-[10px] font-black text-portal-muted uppercase tracking-[0.2em] hover:text-portal-accent transition-colors"
          >
            View All
          </Link>
        )}
      </div>
      
      <div className="flex overflow-x-auto pb-6 pt-2 gap-3 sm:gap-5 snap-x snap-mandatory scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {movies.map((movie, index) => (
          <div key={movie.id} className="snap-start shrink-0 w-[120px] sm:w-[150px] md:w-[180px]">
            <MovieCard movie={movie} priority={index < 4} />
          </div>
        ))}
      </div>
    </section>
  );
}
