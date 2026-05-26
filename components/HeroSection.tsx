import Link from 'next/link';
import Badge from './Badge';
import { Movie } from '@/types';
import { Play } from 'lucide-react';
import LoadingImage from './portal/LoadingImage';

interface HeroSectionProps {
  movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
  if (!movie) return null;

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden flex items-center animate-fade-in">
      {/* Background with Blur */}
      <div className="absolute inset-0 z-0">
        <LoadingImage
          src={`${movie.poster_url}?w=1200&q=auto&f=auto`}
          alt=""
          fill
          eager={false}
          sizes="100vw"
          wrapperClassName="absolute inset-0"
          className="object-cover blur-2xl scale-110 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Main Poster */}
          <div className="relative hidden md:block w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-border">
            <LoadingImage
              src={`${movie.poster_url}?w=400&q=auto&f=auto`}
              alt={movie.title}
              fill
              eager
              sizes="256px"
              wrapperClassName="absolute inset-0"
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-4 max-w-2xl pb-4">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
              <Badge variant="quality">{movie.quality}</Badge>
              <Badge variant="language">{movie.language}</Badge>
              <span className="text-xs font-medium text-text-secondary">{movie.year}</span>
              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">{movie.type}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-sm">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {movie.genre.map((g) => (
                <Badge key={g} variant="genre">{g}</Badge>
              ))}
            </div>

            <p className="text-text-secondary text-sm md:text-base line-clamp-3 md:line-clamp-4 leading-relaxed">
              {movie.description}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
              <Link
                href={`/movie/${movie.id}`}
                className="bg-primary hover:bg-red-700 text-white px-8 py-3.5 rounded-lg font-bold flex items-center space-x-2 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Watch Now</span>
              </Link>
              <Link
                href={`/search?genre=${movie.genre[0]}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-8 py-3.5 rounded-lg font-bold transition-all duration-300 ease-out transform hover:scale-105 active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
