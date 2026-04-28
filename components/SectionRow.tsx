import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '@/types';

interface SectionRowProps {
  title: string;
  movies: Movie[];
  seeAllLink: string;
  emoji?: string;
}

export default function SectionRow({ title, movies, seeAllLink, emoji }: SectionRowProps) {
  if (movies.length === 0) return null;

  return (
    <section className="py-10">
      <div className="flex items-center justify-between px-6 mb-4">
        <div className="flex items-center space-x-2">
          {emoji && <span className="text-xl">{emoji}</span>}
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h2>
        </div>
        <Link 
          href={seeAllLink} 
          className="group flex items-center text-xs font-semibold text-text-secondary hover:text-white transition-colors"
        >
          SEE ALL 
          <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="relative">
        <div className="flex overflow-x-auto gap-4 px-6 no-scrollbar scroll-smooth">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-[160px] sm:w-[180px]">
              <MovieCard movie={movie} />
            </div>
          ))}
          {/* Spacer for end of scroll */}
          <div className="flex-none w-4 sm:w-8" />
        </div>
      </div>
    </section>
  );
}
