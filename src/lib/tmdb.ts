import { Movie, CastMember, CrewMember, Contributor } from '../types';
import { MOCK_MOVIES, DetailedMovieData } from './mockData';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

interface RawTMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

interface RawTMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface RawTMDBCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

function getRequestHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    accept: 'application/json'
  };
  if (TMDB_ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${TMDB_ACCESS_TOKEN}`;
  }
  return headers;
}

function buildApiUrl(endpoint: string, queryParams: string = ''): string {
  const separator = endpoint.includes('?') ? '&' : '?';
  let url = `${TMDB_API_BASE}${endpoint}`;
  
  if (queryParams) {
    url += `${separator}${queryParams}`;
  }
  
  // If no Bearer token, append api_key param
  if (!TMDB_ACCESS_TOKEN && TMDB_API_KEY) {
    const hasParams = url.includes('?');
    url += `${hasParams ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  }
  
  return url;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query || query.trim().length === 0) {
    return Object.values(MOCK_MOVIES).map((item) => item.movie);
  }

  if (TMDB_ACCESS_TOKEN || TMDB_API_KEY) {
    try {
      const url = buildApiUrl('/search/movie', `query=${encodeURIComponent(query)}&include_adult=false&language=en-US`);
      const res = await fetch(url, { headers: getRequestHeaders() });

      if (res.ok) {
        const data = await res.json();
        return (data.results || []).map((m: RawTMDBMovie) => ({
          id: m.id,
          title: m.title,
          overview: m.overview,
          poster_path: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          backdrop_path: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : null,
          release_date: m.release_date,
          vote_average: m.vote_average
        }));
      }
    } catch (err) {
      console.warn("TMDB live search failed, falling back to mock data:", err);
    }
  }

  const lowerQuery = query.toLowerCase();
  const matched = Object.values(MOCK_MOVIES)
    .filter((d) => d.movie.title.toLowerCase().includes(lowerQuery))
    .map((d) => d.movie);

  return matched.length > 0 ? matched : Object.values(MOCK_MOVIES).map((d) => d.movie);
}

export async function getMovieDetailsAndCredits(movieId: number): Promise<DetailedMovieData | null> {
  // 1. Fetch live from TMDB if API key/token is configured
  if (TMDB_ACCESS_TOKEN || TMDB_API_KEY) {
    try {
      const movieUrl = buildApiUrl(`/movie/${movieId}`, 'language=en-US');
      const creditsUrl = buildApiUrl(`/movie/${movieId}/credits`, 'language=en-US');

      const [movieRes, creditsRes] = await Promise.all([
        fetch(movieUrl, { headers: getRequestHeaders() }),
        fetch(creditsUrl, { headers: getRequestHeaders() })
      ]);

      if (movieRes.ok && creditsRes.ok) {
        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();

        const movie: Movie = {
          id: movieData.id,
          title: movieData.title,
          overview: movieData.overview,
          poster_path: movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null,
          backdrop_path: movieData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}` : null,
          release_date: movieData.release_date,
          vote_average: movieData.vote_average
        };

        // Top 20 cast members
        const cast: CastMember[] = (creditsData.cast || []).slice(0, 20).map((c: RawTMDBCast) => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null,
          order: c.order
        }));

        // Key crew members (Director, Music, Writer, Cinematographer, Editor, Producer, Stunts)
        const relevantJobs = [
          'Director',
          'Original Music Composer',
          'Music',
          'Producer',
          'Executive Producer',
          'Screenplay',
          'Writer',
          'Director of Photography',
          'Editor',
          'Stunt Coordinator'
        ];

        const crew: CrewMember[] = (creditsData.crew || [])
          .filter((c: RawTMDBCrew) => relevantJobs.includes(c.job))
          .map((c: RawTMDBCrew) => ({
            id: c.id,
            name: c.name,
            job: c.job,
            department: c.department,
            profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null
          }));

        return { movie, cast, crew };
      }
    } catch (err) {
      console.error("Failed to fetch movie credits from TMDB live:", err);
    }
  }

  if (MOCK_MOVIES[movieId]) {
    return MOCK_MOVIES[movieId];
  }

  return Object.values(MOCK_MOVIES)[0];
}

/**
 * Builds the initial contributor list.
 * Starts all values at 0 so user enters their numbers manually!
 */
export function buildInitialContributors(
  data: DetailedMovieData
): Contributor[] {
  const contributors: Contributor[] = [];

  // 1. Director
  const director = data.crew.find((c) => c.job === 'Director');
  if (director) {
    contributors.push({
      id: `dir-${director.id}`,
      tmdbId: director.id,
      name: director.name,
      role: 'Director',
      profilePath: director.profile_path,
      amount: 0,
      percentage: 0
    });
  }

  // 2. Lead Actor
  if (data.cast.length > 0) {
    contributors.push({
      id: `actor-${data.cast[0].id}`,
      tmdbId: data.cast[0].id,
      name: `${data.cast[0].name} (${data.cast[0].character || 'Lead'})`,
      role: 'Actor',
      profilePath: data.cast[0].profile_path,
      amount: 0,
      percentage: 0
    });
  }

  // 3. Second Lead Actor
  if (data.cast.length > 1) {
    contributors.push({
      id: `actor-${data.cast[1].id}`,
      tmdbId: data.cast[1].id,
      name: `${data.cast[1].name} (${data.cast[1].character || 'Co-star'})`,
      role: 'Actor',
      profilePath: data.cast[1].profile_path,
      amount: 0,
      percentage: 0,
      canRemove: true
    });
  }

  // 4. Music Director / Composer
  const music = data.crew.find(
    (c) => c.job === 'Original Music Composer' || c.job === 'Music'
  );
  if (music) {
    contributors.push({
      id: `music-${music.id}`,
      tmdbId: music.id,
      name: music.name,
      role: 'Music',
      profilePath: music.profile_path,
      amount: 0,
      percentage: 0
    });
  }

  // 5. Producer
  const producer = data.crew.find((c) => c.job === 'Producer');
  if (producer) {
    contributors.push({
      id: `prod-${producer.id}`,
      tmdbId: producer.id,
      name: producer.name,
      role: 'Producer',
      profilePath: producer.profile_path,
      amount: 0,
      percentage: 0,
      canRemove: true
    });
  }

  // 6. User Custom Box ("My Entertainment / Popcorn & AC")
  contributors.push({
    id: 'user-satisfaction',
    name: 'My Entertainment (Popcorn, AC & Theatre Vibe)',
    role: 'Audience / Experience',
    profilePath: null,
    amount: 0,
    percentage: 0,
    isCustom: true
  });

  return contributors;
}
