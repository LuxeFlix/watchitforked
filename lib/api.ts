import { getMovieById } from './queries';
import { Movie } from '@/types';
import { unstable_cache } from 'next/cache';

/**
 * Server-side data fetching for movie details.
 * Optimized for React Server Components (RSC) using unstable_cache.
 * This avoids internal fetch calls to local API routes.
 */
export const getMovieDetails = unstable_cache(
  async (id: string) => {
    const movieId = parseInt(id, 10);
    if (isNaN(movieId)) return null;

    const movie = await getMovieById(movieId);
    if (!movie) return null;

    // Map DB model to the requested frontend structure
    return {
      title: movie.title,
      year: movie.year,
      rating: movie.rating || 8.5,
      votes: movie.votes || 1250,
      description: movie.description,
      genres: movie.genre || [],
      bannerImage: movie.sample_images?.[0] || movie.poster_url,
      thumbnail: movie.poster_url,
      downloads: [
        movie.download_480p && { quality: '480p', name: `${movie.title} - 480p`, size: '952.42 MB', tag: 'Good Encode', url: movie.download_480p },
        movie.download_720p && { quality: '720p', name: `${movie.title} - 720p`, size: '1.2 GB', tag: 'Good Encode', url: movie.download_720p },
        movie.download_1080p && { quality: '1080p', name: `${movie.title} - 1080p`, size: '2.4 GB', tag: 'Good Encode', url: movie.download_1080p },
        movie.download_2k && { quality: '4K', name: `${movie.title} - 4K UHD`, size: '5.8 GB', tag: 'Ultra HD', url: movie.download_2k },
      ].filter(Boolean) as { quality: string; name: string; size: string; tag: string; url: string }[]
    };
  },
  ['movie-details'],
  { revalidate: 3600 } // Cache for 1 hour
);
