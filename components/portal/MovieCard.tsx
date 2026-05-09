import Link from 'next/link';
import Image from 'next/image';
import { Star, Calendar, Monitor } from 'lucide-react';
import { Movie } from '@/types';

export default function MovieCard({ movie, priority }: { movie: Movie, priority?: boolean }) {
  return (
    <Link 
      href={`/movie/${movie.id}`} 
      className="group bg-white border border-portal-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image 
          src={movie.poster_url} 
          alt={movie.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 224px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1">
           <div className="bg-portal-accent text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
              {movie.quality || 'HD'}
           </div>
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-portal-accent transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-portal-border/50">
           <div className="flex items-center gap-3 text-[10px] font-bold text-portal-muted uppercase tracking-tighter">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {movie.year}</span>
              <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-yellow-500" /> {movie.rating || 8.5}</span>
           </div>
           <div className="text-[10px] font-bold text-portal-muted uppercase">
              {movie.type === 'movie' ? 'Movie' : 'Series'}
           </div>
        </div>
      </div>
    </Link>
  );
}
