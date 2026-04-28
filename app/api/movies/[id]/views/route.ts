import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/queries';

export async function POST(
  request: NextRequest,
  ctx: RouteContext<'/api/movies/[id]/views'>
) {
  const { id: rawId } = await ctx.params;
  const id = parseInt(rawId);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
  }

  try {
    await incrementViews(id);
    return NextResponse.json({ counted: true });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}
