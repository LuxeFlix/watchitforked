import Link from 'next/link';
import { Star, Calendar, Monitor } from 'lucide-react';
import { Movie } from '@/types';
import LoadingImage from './LoadingImage';

export default function MovieCard({ movie, priority }: { movie: Movie, priority?: boolean }) {
  return (
    <Link 
      href={`/movie/${movie.id}`} 
      className="group bg-white border border-portal-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {movie.poster_url ? (
          <LoadingImage 
            src={movie.poster_url} 
            alt={movie.title}
            fill
            eager={priority}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 224px"
            wrapperClassName="absolute inset-0"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
            <div className="absolute inset-0 flex items-end justify-start bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_55%)] p-3">
              <span className="max-w-full truncate rounded-full border border-white/70 bg-white/80 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                No poster
              </span>
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2">
           {movie.language && (
             <div className="bg-white text-black px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm max-w-[60px] truncate">
                {movie.language}
             </div>
           )}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col">
        <h3 className="font-bold text-xs sm:text-sm line-clamp-1 group-hover:text-portal-accent transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-portal-border/50">
           <div className="flex items-center gap-1.5 sm:gap-3 text-[9px] sm:text-[10px] font-bold text-portal-muted uppercase tracking-tighter">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 hidden sm:block" /> {movie.year}</span>
              <span className="flex items-center gap-0.5 sm:gap-1 text-yellow-500"><Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-500" /> {movie.rating || 8.5}</span>
           </div>
           <div className="text-[9px] sm:text-[10px] font-bold text-portal-muted uppercase flex-shrink-0 ml-1">
              {movie.type === 'movie' ? 'Movie' : 'Series'}
           </div>
        </div>
      </div>
    </Link>
  );
}
