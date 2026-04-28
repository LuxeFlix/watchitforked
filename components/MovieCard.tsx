import Link from 'next/link';
import Badge from './Badge';
import { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  // Optimization params for Cloudinary
  const optimizedPoster = `${movie.poster_url}?w=400&q=auto&f=auto`;

  return (
    <Link href={`/movies/${movie.id}`} className="group">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card border border-border transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black/50">
        <img
          src={optimizedPoster}
          alt={movie.title}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-40"
          loading="lazy"
        />
        
        {/* Quality Badge Top Right */}
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="quality">{movie.quality}</Badge>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-white font-bold text-sm leading-tight mb-1">{movie.title}</p>
          <div className="flex items-center space-x-2 text-[10px] text-gray-400">
            <span>{movie.year}</span>
            <span>•</span>
            <span className="uppercase">{movie.type}</span>
          </div>
        </div>
      </div>

      <div className="p-3 pt-2 space-y-1">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>{movie.year}</span>
          <span>•</span>
          <span className="truncate">{movie.language}</span>
          <span>•</span>
          <Badge variant="language" className="bg-transparent border border-border py-0 px-1">{movie.quality}</Badge>
        </div>
      </div>
    </Link>
  );
}
