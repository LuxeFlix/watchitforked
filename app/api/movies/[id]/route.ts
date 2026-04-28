import { NextRequest, NextResponse } from 'next/server';
import { getMovieById } from '@/lib/queries';

export async function GET(
  request: NextRequest,
  ctx: RouteContext<'/api/movies/[id]'>
) {
  const { id: rawId } = await ctx.params;
  const id = parseInt(rawId);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
  }

  try {
    const movie = await getMovieById(id);
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}
