import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/queries';
import { revalidateTag } from 'next/cache';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
    }

    await incrementViews(id);
    revalidateTag('movie-details');
    return NextResponse.json({ counted: true });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}
