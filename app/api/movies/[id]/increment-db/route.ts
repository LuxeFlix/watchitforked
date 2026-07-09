import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/queries';
import { revalidateTag } from 'next/cache';

// This is a Node.js runtime endpoint for database persistence
// Called after Redis deduplication confirms it's a new view

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

    // Update database
    await incrementViews(id);
    revalidateTag('movie-details', 'default');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing database views:', error);
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}
