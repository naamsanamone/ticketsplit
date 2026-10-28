import { NextRequest, NextResponse } from 'next/server';
import { searchMovies } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  try {
    const movies = await searchMovies(query);
    return NextResponse.json({ success: true, movies });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
