import { NextRequest, NextResponse } from 'next/server';
import { getPublishedMovies } from '@/lib/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || undefined;
  const type = searchParams.get('type') || undefined;
  const language = searchParams.get('language') || undefined;
  const quality = searchParams.get('quality') || undefined;
  const sort = searchParams.get('sort') || undefined;

  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    const { movies, total } = await getPublishedMovies({ genre, type, language, quality, sort, page });
    return NextResponse.json({ movies, total, page });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
