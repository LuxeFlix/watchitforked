import { connection } from 'next/server';
import { getPublishedMovies } from '@/lib/queries';
import CarouselSection from '@/components/portal/CarouselSection';

export const revalidate = 3600;

export default async function HomePage() {
  await connection();
  const limit = 15; // Limit per carousel row

  // Fetch all sections in parallel, but do not fail the whole page if one query errors.
  const sections = await Promise.allSettled([
    getPublishedMovies({ limit }),
    getPublishedMovies({ tag: 'ongoing', limit }),
    getPublishedMovies({ tag: 'completed', limit }),
    getPublishedMovies({ type: 'movie', limit }),
    getPublishedMovies({ type: 'series', limit }),
    getPublishedMovies({ genre: 'romantic', limit }),
    getPublishedMovies({ genre: 'thriller', limit }),
    getPublishedMovies({ genre: 'action', limit })
  ]);

  const getMovies = (index: number) => {
    const section = sections[index];
    if (section.status === 'fulfilled') {
      return section.value.movies;
    }

    console.error('Failed to load homepage section', index, section.reason);
    return [];
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12 sm:space-y-16 overflow-x-hidden">
      {/* Hero / Promo Area */}
      

      <div className="space-y-12 sm:space-y-16">
        <CarouselSection 
          title="Newest" 
          movies={getMovies(0)}
        />
        <CarouselSection 
          title="Ongoing" 
          movies={getMovies(1)} 
          viewAllLink="/search?tag=ongoing"
        />
        <CarouselSection 
          title="Completed" 
          movies={getMovies(2)} 
          viewAllLink="/search?tag=completed"
        />
        <CarouselSection 
          title="Movies" 
          movies={getMovies(3)} 
          viewAllLink="/search?type=movie"
        />
        <CarouselSection 
          title="Series" 
          movies={getMovies(4)} 
          viewAllLink="/search?type=series"
        />
        <CarouselSection 
          title="Romantic" 
          movies={getMovies(5)} 
          viewAllLink="/search?genre=romantic"
        />
        <CarouselSection 
          title="Thriller" 
          movies={getMovies(6)} 
          viewAllLink="/search?genre=thriller"
        />
        <CarouselSection 
          title="Action" 
          movies={getMovies(7)} 
          viewAllLink="/search?genre=action"
        />
      </div>
    </div>
  );
}