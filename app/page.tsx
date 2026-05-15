import { getPublishedMovies } from '@/lib/queries';
import CarouselSection from '@/components/portal/CarouselSection';

export const revalidate = 3600;

export default async function HomePage() {
  const limit = 15; // Limit per carousel row

  // Fetch all sections in parallel
  const [
    { movies: newest },
    { movies: ongoing },
    { movies: completed },
    { movies: movies },
    { movies: series },
    { movies: romantic },
    { movies: thriller },
    { movies: action }
  ] = await Promise.all([
    getPublishedMovies({ limit }),
    getPublishedMovies({ tag: 'ongoing', limit }),
    getPublishedMovies({ tag: 'completed', limit }),
    getPublishedMovies({ type: 'movie', limit }),
    getPublishedMovies({ type: 'series', limit }),
    getPublishedMovies({ genre: 'romantic', limit }),
    getPublishedMovies({ genre: 'thriller', limit }),
    getPublishedMovies({ genre: 'action', limit })
  ]);

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12 sm:space-y-16 overflow-x-hidden">
      {/* Hero / Promo Area */}
      

      <div className="space-y-12 sm:space-y-16">
        <CarouselSection 
          title="Newest" 
          movies={newest}
        />
        <CarouselSection 
          title="Ongoing" 
          movies={ongoing} 
          viewAllLink="/search?tag=ongoing"
        />
        <CarouselSection 
          title="Completed" 
          movies={completed} 
          viewAllLink="/search?tag=completed"
        />
        <CarouselSection 
          title="Movies" 
          movies={movies} 
          viewAllLink="/search?type=movie"
        />
        <CarouselSection 
          title="Series" 
          movies={series} 
          viewAllLink="/search?type=series"
        />
        <CarouselSection 
          title="Romantic" 
          movies={romantic} 
          viewAllLink="/search?genre=romantic"
        />
        <CarouselSection 
          title="Thriller" 
          movies={thriller} 
          viewAllLink="/search?genre=thriller"
        />
        <CarouselSection 
          title="Action" 
          movies={action} 
          viewAllLink="/search?genre=action"
        />
      </div>
    </div>
  );
}

