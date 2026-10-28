import { NextRequest, NextResponse } from 'next/server';
import { getMovieDetailsAndCredits } from '@/lib/tmdb';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = parseInt(params.id, 10);

  if (isNaN(movieId)) {
    return NextResponse.json({ success: false, error: 'Invalid movie ID' }, { status: 400 });
  }

  try {
    const data = await getMovieDetailsAndCredits(movieId);
    if (!data) {
      return NextResponse.json({ success: false, error: 'Movie not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
