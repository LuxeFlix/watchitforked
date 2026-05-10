import { sql } from './db';
import { Movie } from '@/types';

export async function getPublishedMovies(filters?: {
  genre?: string;
  type?: string;
  language?: string;
  quality?: string;
  sort?: string;
  page?: number;
  limit?: number;
  tag?: string;
}): Promise<{ movies: Movie[]; total: number }> {
  let where = "WHERE status = 'published'";
  const params: string[] = [];
  let paramCount = 0;

  if (filters?.genre && filters.genre.toLowerCase() !== 'all') {
    paramCount++;
    where += ` AND $${paramCount} = ANY(genre)`;
    params.push(filters.genre);
  }
  if (filters?.type && filters.type.toLowerCase() !== 'all') {
    paramCount++;
    where += ` AND type = $${paramCount}`;
    params.push(filters.type.toLowerCase());
  }
  if (filters?.language && filters.language.toLowerCase() !== 'all') {
    paramCount++;
    where += ` AND language = $${paramCount}`;
    params.push(filters.language);
  }
  if (filters?.quality && filters.quality.toLowerCase() !== 'all') {
    paramCount++;
    where += ` AND quality = $${paramCount}`;
    params.push(filters.quality);
  }
  if (filters?.tag && filters.tag.toLowerCase() !== 'all') {
    paramCount++;
    // Case-insensitive array search
    where += ` AND EXISTS (SELECT 1 FROM unnest(tags) AS t WHERE t ILIKE $${paramCount})`;
    params.push(filters.tag);
  }

  const countResult = await sql.query(`SELECT COUNT(*) FROM movies ${where}`, params);
  const total = parseInt(countResult[0].count as string, 10);

  const sort = filters?.sort || 'newest';
  let orderBy = ' ORDER BY created_at DESC';
  if (sort === 'trending' || sort === 'most_watched') {
    orderBy = ' ORDER BY views DESC';
  }

  const limit = filters?.limit || 30;
  const page = filters?.page || 1;
  const offset = (page - 1) * limit;

  paramCount++;
  const limitParam = `$${paramCount}`;
  params.push(String(limit));
  paramCount++;
  const offsetParam = `$${paramCount}`;
  params.push(String(offset));

  const result = await sql.query(
    `SELECT * FROM movies ${where}${orderBy} LIMIT ${limitParam} OFFSET ${offsetParam}`,
    params
  );
  return { movies: result as Movie[], total };
}

export async function getMovieById(id: number) {
  const result = await sql`SELECT * FROM movies WHERE id = ${id} AND status = 'published'`;
  return (result[0] as Movie) || null;
}

export async function getTrending() {
  // top 10 by views in last 7 days - assuming created_at is usable or just by views for simplicity
  const result = await sql`SELECT * FROM movies WHERE status = 'published' AND created_at > NOW() - INTERVAL '7 days' ORDER BY views DESC LIMIT 10`;
  if (result.length === 0) {
    // Fallback to top views if nothing in last 7 days
    return getMostWatched();
  }
  return result as Movie[];
}

export async function getHotNew() {
  const result = await sql`SELECT * FROM movies WHERE status = 'published' ORDER BY created_at DESC LIMIT 10`;
  return result as Movie[];
}

export async function getMostWatched() {
  const result = await sql`SELECT * FROM movies WHERE status = 'published' ORDER BY views DESC LIMIT 10`;
  return result as Movie[];
}

export async function incrementViews(id: number) {
  await sql`UPDATE movies SET views = views + 1 WHERE id = ${id}`;
}

export async function searchMovies(query: string) {
  const searchTerm = `%${query}%`;
  const result = await sql`SELECT * FROM movies WHERE status = 'published' AND (title ILIKE ${searchTerm} OR description ILIKE ${searchTerm} OR ${query} = ANY(tags))`;
  return result as Movie[];
}

export async function getRelatedMovies(id: number, genres: string[]) {
    // 6 related movies (same genre), excluding current
    const result = await sql`SELECT * FROM movies WHERE status = 'published' AND id != ${id} AND genre && ${genres} LIMIT 6`;
    return result as Movie[];
}

// ── Admin Queries ──

export async function getAllMoviesAdmin() {
  const result = await sql`SELECT * FROM movies ORDER BY created_at DESC`;
  return result as Movie[];
}

export async function createMovie(data: Omit<Movie, 'id' | 'views' | 'created_at'>) {
  const result = await sql`
    INSERT INTO movies (
      title, type, genre, year, language, quality,
      description, poster_url, sample_images,
      download_480p, download_720p, download_1080p, download_2k,
      status, tags
    ) VALUES (
      ${data.title}, ${data.type}, ${data.genre}, ${data.year},
      ${data.language}, ${data.quality}, ${data.description},
      ${data.poster_url}, ${data.sample_images || []},
      ${data.download_480p || null}, ${data.download_720p || null},
      ${data.download_1080p || null}, ${data.download_2k || null},
      ${data.status || 'published'}, ${data.tags || []}
    )
    RETURNING *
  `;
  return result[0] as Movie;
}

export async function updateMovie(id: number, data: Omit<Movie, 'id' | 'views' | 'created_at'>) {
  const result = await sql`
    UPDATE movies SET
      title = ${data.title},
      type = ${data.type},
      genre = ${data.genre},
      year = ${data.year},
      language = ${data.language},
      quality = ${data.quality},
      description = ${data.description},
      poster_url = ${data.poster_url},
      sample_images = ${data.sample_images || []},
      download_480p = ${data.download_480p || null},
      download_720p = ${data.download_720p || null},
      download_1080p = ${data.download_1080p || null},
      download_2k = ${data.download_2k || null},
      status = ${data.status},
      tags = ${data.tags || []}
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] as Movie) || null;
}

export async function deleteMovie(id: number) {
  const result = await sql`DELETE FROM movies WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

export async function toggleMovieStatus(id: number) {
  const result = await sql`
    UPDATE movies SET
      status = CASE WHEN status = 'published' THEN 'draft' ELSE 'published' END
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] as Movie) || null;
}
