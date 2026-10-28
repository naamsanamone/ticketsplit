import { 
  TicketSplitSubmission, 
  LeaderboardEntry, 
  MovieROIEntry, 
  Contributor, 
  MovieCommunityStats, 
  CommunityAllocationItem, 
  RecentSplitPreview, 
  ComparisonDelta,
  FilmographyCredit
} from '../types';
import { INITIAL_LEADERBOARD, INITIAL_MOVIE_ROIS, MOCK_MOVIES } from './mockData';

const STORAGE_KEYS = {
  USER_KEY: 'ticketsplit_user_key',
  SUBMISSIONS: 'ticketsplit_submissions',
  LEADERBOARD: 'ticketsplit_leaderboard',
  MOVIE_ROIS: 'ticketsplit_rois'
};

export function getUserKey(): string {
  if (typeof window === 'undefined') return 'user_server';
  let key = localStorage.getItem(STORAGE_KEYS.USER_KEY);
  if (!key) {
    key = `voter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.USER_KEY, key);
  }
  return key;
}

export function resetUserKey(): string {
  if (typeof window === 'undefined') return 'user_server';
  const newKey = `voter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem(STORAGE_KEYS.USER_KEY, newKey);
  return newKey;
}

/**
 * Generates initial starter submissions for the 4 featured movies.
 * Each movie gets 4 clean, realistic voter ballots with ticket price ₹150.
 * Pure arithmetic across these provides the initial baseline without huge vote anchors!
 */
export function generateStarterSeedSubmissions(): TicketSplitSubmission[] {
  return [
    // 1. Oppenheimer (872585)
    {
      id: 'seed-oppenheimer-1',
      userKey: 'seed_user_1',
      movieId: 872585,
      movieTitle: 'Oppenheimer',
      moviePoster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-525', tmdbId: 525, name: 'Christopher Nolan', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg', amount: 60, percentage: 40.0 },
        { id: 'actor-2037', tmdbId: 2037, name: 'Cillian Murphy (J. Robert Oppenheimer)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg', amount: 40, percentage: 26.7 },
        { id: 'actor-3223', tmdbId: 3223, name: 'Robert Downey Jr. (Lewis Strauss)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3fq0lZMBv9779.jpg', amount: 10, percentage: 6.7 },
        { id: 'actor-5081', tmdbId: 5081, name: 'Emily Blunt (Kitty Oppenheimer)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/nPJXaRMVUvgmn2SY8yQ65Z0aNfL.jpg', amount: 10, percentage: 6.7 },
        { id: 'music-64670', tmdbId: 64670, name: 'Ludwig Göransson', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/5c1kS017W4hT96U3yB6P9YtU5tU.jpg', amount: 15, percentage: 10.0 },
        { id: 'exp-872585', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 15, percentage: 10.0 }
      ],
      verdict: 'Director Led Masterpiece',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'seed-oppenheimer-2',
      userKey: 'seed_user_2',
      movieId: 872585,
      movieTitle: 'Oppenheimer',
      moviePoster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-525', tmdbId: 525, name: 'Christopher Nolan', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg', amount: 55, percentage: 36.7 },
        { id: 'actor-2037', tmdbId: 2037, name: 'Cillian Murphy (J. Robert Oppenheimer)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg', amount: 45, percentage: 30.0 },
        { id: 'actor-3223', tmdbId: 3223, name: 'Robert Downey Jr. (Lewis Strauss)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3fq0lZMBv9779.jpg', amount: 10, percentage: 6.7 },
        { id: 'actor-5081', tmdbId: 5081, name: 'Emily Blunt (Kitty Oppenheimer)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/nPJXaRMVUvgmn2SY8yQ65Z0aNfL.jpg', amount: 10, percentage: 6.7 },
        { id: 'music-64670', tmdbId: 64670, name: 'Ludwig Göransson', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/5c1kS017W4hT96U3yB6P9YtU5tU.jpg', amount: 15, percentage: 10.0 },
        { id: 'exp-872585', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 15, percentage: 10.0 }
      ],
      verdict: 'Stunning Visual Collaboration',
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
    },
    {
      id: 'seed-oppenheimer-3',
      userKey: 'seed_user_3',
      movieId: 872585,
      movieTitle: 'Oppenheimer',
      moviePoster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-525', tmdbId: 525, name: 'Christopher Nolan', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg', amount: 60, percentage: 40.0 },
        { id: 'actor-2037', tmdbId: 2037, name: 'Cillian Murphy (J. Robert Oppenheimer)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg', amount: 40, percentage: 26.7 },
        { id: 'actor-3223', tmdbId: 3223, name: 'Robert Downey Jr. (Lewis Strauss)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3fq0lZMBv9779.jpg', amount: 10, percentage: 6.7 },
        { id: 'actor-5081', tmdbId: 5081, name: 'Emily Blunt (Kitty Oppenheimer)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/nPJXaRMVUvgmn2SY8yQ65Z0aNfL.jpg', amount: 10, percentage: 6.7 },
        { id: 'music-64670', tmdbId: 64670, name: 'Ludwig Göransson', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/5c1kS017W4hT96U3yB6P9YtU5tU.jpg', amount: 15, percentage: 10.0 },
        { id: 'exp-872585', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 15, percentage: 10.0 }
      ],
      verdict: 'Nolan Delivered',
      createdAt: new Date(Date.now() - 3600000 * 16).toISOString()
    },
    {
      id: 'seed-oppenheimer-4',
      userKey: 'seed_user_4',
      movieId: 872585,
      movieTitle: 'Oppenheimer',
      moviePoster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-525', tmdbId: 525, name: 'Christopher Nolan', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg', amount: 55, percentage: 36.7 },
        { id: 'actor-2037', tmdbId: 2037, name: 'Cillian Murphy (J. Robert Oppenheimer)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg', amount: 45, percentage: 30.0 },
        { id: 'actor-3223', tmdbId: 3223, name: 'Robert Downey Jr. (Lewis Strauss)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3fq0lZMBv9779.jpg', amount: 10, percentage: 6.7 },
        { id: 'actor-5081', tmdbId: 5081, name: 'Emily Blunt (Kitty Oppenheimer)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/nPJXaRMVUvgmn2SY8yQ65Z0aNfL.jpg', amount: 10, percentage: 6.7 },
        { id: 'music-64670', tmdbId: 64670, name: 'Ludwig Göransson', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/5c1kS017W4hT96U3yB6P9YtU5tU.jpg', amount: 15, percentage: 10.0 },
        { id: 'exp-872585', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 15, percentage: 10.0 }
      ],
      verdict: 'Cinematic Brilliance',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },

    // 2. RRR (579974)
    {
      id: 'seed-rrr-1',
      userKey: 'seed_user_5',
      movieId: 579974,
      movieTitle: 'RRR',
      moviePoster: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0ye2fq0SZ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-147021', tmdbId: 147021, name: 'S. S. Rajamouli', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/qPskSZxvoYflC8Bye4tGNBSroy5.jpg', amount: 55, percentage: 36.7 },
        { id: 'actor-148037', tmdbId: 148037, name: 'N.T. Rama Rao Jr. (Komaram Bheem)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/5ycQgZ3SPUa12bq0yn1jpToBq9X.jpg', amount: 35, percentage: 23.3 },
        { id: 'actor-124314', tmdbId: 124314, name: 'Ram Charan (Alluri Sitarama Raju)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg', amount: 30, percentage: 20.0 },
        { id: 'music-225318', tmdbId: 225318, name: 'M. M. Keeravani', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/r0f7RTGIkG0ZBaQViIKrE1g82Ec.jpg', amount: 20, percentage: 13.3 },
        { id: 'exp-579974', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 10, percentage: 6.7 }
      ],
      verdict: 'High Octane Action by Rajamouli',
      createdAt: new Date(Date.now() - 3600000 * 22).toISOString()
    },
    {
      id: 'seed-rrr-2',
      userKey: 'seed_user_6',
      movieId: 579974,
      movieTitle: 'RRR',
      moviePoster: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0ye2fq0SZ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-147021', tmdbId: 147021, name: 'S. S. Rajamouli', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/qPskSZxvoYflC8Bye4tGNBSroy5.jpg', amount: 55, percentage: 36.7 },
        { id: 'actor-148037', tmdbId: 148037, name: 'N.T. Rama Rao Jr. (Komaram Bheem)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/5ycQgZ3SPUa12bq0yn1jpToBq9X.jpg', amount: 30, percentage: 20.0 },
        { id: 'actor-124314', tmdbId: 124314, name: 'Ram Charan (Alluri Sitarama Raju)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg', amount: 35, percentage: 23.3 },
        { id: 'music-225318', tmdbId: 225318, name: 'M. M. Keeravani', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/r0f7RTGIkG0ZBaQViIKrE1g82Ec.jpg', amount: 20, percentage: 13.3 },
        { id: 'exp-579974', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 10, percentage: 6.7 }
      ],
      verdict: 'Pure Theater Madness',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 'seed-rrr-3',
      userKey: 'seed_user_7',
      movieId: 579974,
      movieTitle: 'RRR',
      moviePoster: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0ye2fq0SZ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-147021', tmdbId: 147021, name: 'S. S. Rajamouli', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/qPskSZxvoYflC8Bye4tGNBSroy5.jpg', amount: 60, percentage: 40.0 },
        { id: 'actor-148037', tmdbId: 148037, name: 'N.T. Rama Rao Jr. (Komaram Bheem)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/5ycQgZ3SPUa12bq0yn1jpToBq9X.jpg', amount: 35, percentage: 23.3 },
        { id: 'actor-124314', tmdbId: 124314, name: 'Ram Charan (Alluri Sitarama Raju)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg', amount: 25, percentage: 16.7 },
        { id: 'music-225318', tmdbId: 225318, name: 'M. M. Keeravani', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/r0f7RTGIkG0ZBaQViIKrE1g82Ec.jpg', amount: 20, percentage: 13.3 },
        { id: 'exp-579974', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 10, percentage: 6.7 }
      ],
      verdict: 'Rajamouli Vision Carried',
      createdAt: new Date(Date.now() - 3600000 * 14).toISOString()
    },
    {
      id: 'seed-rrr-4',
      userKey: 'seed_user_8',
      movieId: 579974,
      movieTitle: 'RRR',
      moviePoster: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0ye2fq0SZ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-147021', tmdbId: 147021, name: 'S. S. Rajamouli', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/qPskSZxvoYflC8Bye4tGNBSroy5.jpg', amount: 55, percentage: 36.7 },
        { id: 'actor-148037', tmdbId: 148037, name: 'N.T. Rama Rao Jr. (Komaram Bheem)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/5ycQgZ3SPUa12bq0yn1jpToBq9X.jpg', amount: 30, percentage: 20.0 },
        { id: 'actor-124314', tmdbId: 124314, name: 'Ram Charan (Alluri Sitarama Raju)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg', amount: 35, percentage: 23.3 },
        { id: 'music-225318', tmdbId: 225318, name: 'M. M. Keeravani', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/r0f7RTGIkG0ZBaQViIKrE1g82Ec.jpg', amount: 20, percentage: 13.3 },
        { id: 'exp-579974', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 10, percentage: 6.7 }
      ],
      verdict: 'Naatu Naatu Euphoria',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    },

    // 3. Dune: Part Two (693134)
    {
      id: 'seed-dune-1',
      userKey: 'seed_user_9',
      movieId: 693134,
      movieTitle: 'Dune: Part Two',
      moviePoster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-137427', tmdbId: 137427, name: 'Denis Villeneuve', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/xzQYqb4nR8xT7Zdw5itbEL9K3fd.jpg', amount: 50, percentage: 33.3 },
        { id: 'actor-1190668', tmdbId: 1190668, name: 'Timothée Chalamet (Paul Atreides)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg', amount: 35, percentage: 23.3 },
        { id: 'music-947', tmdbId: 947, name: 'Hans Zimmer', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/tpQnDeHY15szIXvpnhlprufz4d.jpg', amount: 40, percentage: 26.7 },
        { id: 'exp-693134', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 25, percentage: 16.7 }
      ],
      verdict: 'Audiovisual Masterpiece',
      createdAt: new Date(Date.now() - 3600000 * 21).toISOString()
    },
    {
      id: 'seed-dune-2',
      userKey: 'seed_user_10',
      movieId: 693134,
      movieTitle: 'Dune: Part Two',
      moviePoster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-137427', tmdbId: 137427, name: 'Denis Villeneuve', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/xzQYqb4nR8xT7Zdw5itbEL9K3fd.jpg', amount: 55, percentage: 36.7 },
        { id: 'actor-1190668', tmdbId: 1190668, name: 'Timothée Chalamet (Paul Atreides)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg', amount: 35, percentage: 23.3 },
        { id: 'music-947', tmdbId: 947, name: 'Hans Zimmer', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/tpQnDeHY15szIXvpnhlprufz4d.jpg', amount: 35, percentage: 23.3 },
        { id: 'exp-693134', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 25, percentage: 16.7 }
      ],
      verdict: 'Epic Scale & Sound',
      createdAt: new Date(Date.now() - 3600000 * 17).toISOString()
    },
    {
      id: 'seed-dune-3',
      userKey: 'seed_user_11',
      movieId: 693134,
      movieTitle: 'Dune: Part Two',
      moviePoster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-137427', tmdbId: 137427, name: 'Denis Villeneuve', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/xzQYqb4nR8xT7Zdw5itbEL9K3fd.jpg', amount: 50, percentage: 33.3 },
        { id: 'actor-1190668', tmdbId: 1190668, name: 'Timothée Chalamet (Paul Atreides)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg', amount: 40, percentage: 26.7 },
        { id: 'music-947', tmdbId: 947, name: 'Hans Zimmer', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/tpQnDeHY15szIXvpnhlprufz4d.jpg', amount: 40, percentage: 26.7 },
        { id: 'exp-693134', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 20, percentage: 13.3 }
      ],
      verdict: 'Denis + Zimmer Magic',
      createdAt: new Date(Date.now() - 3600000 * 11).toISOString()
    },
    {
      id: 'seed-dune-4',
      userKey: 'seed_user_12',
      movieId: 693134,
      movieTitle: 'Dune: Part Two',
      moviePoster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'dir-137427', tmdbId: 137427, name: 'Denis Villeneuve', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/xzQYqb4nR8xT7Zdw5itbEL9K3fd.jpg', amount: 55, percentage: 36.7 },
        { id: 'actor-1190668', tmdbId: 1190668, name: 'Timothée Chalamet (Paul Atreides)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg', amount: 35, percentage: 23.3 },
        { id: 'music-947', tmdbId: 947, name: 'Hans Zimmer', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/tpQnDeHY15szIXvpnhlprufz4d.jpg', amount: 40, percentage: 26.7 },
        { id: 'exp-693134', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 20, percentage: 13.3 }
      ],
      verdict: 'Cinematic Spectacle',
      createdAt: new Date(Date.now() - 3600000 * 7).toISOString()
    },

    // 4. Jawan (872906)
    {
      id: 'seed-jawan-1',
      userKey: 'seed_user_13',
      movieId: 872906,
      movieTitle: 'Jawan',
      moviePoster: 'https://image.tmdb.org/t/p/w500/jFt1g94utjj2YKQioVJTYWzOuvZ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'actor-35742', tmdbId: 35742, name: 'Shah Rukh Khan (Vikram Rathore / Azad)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg', amount: 65, percentage: 43.3 },
        { id: 'dir-1259367', tmdbId: 1259367, name: 'Atlee', role: 'Director', profilePath: null, amount: 35, percentage: 23.3 },
        { id: 'music-1081464', tmdbId: 1081464, name: 'Anirudh Ravichander', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/xKvlrZpRaXkm2K2ZiXpqgrEedUU.jpg', amount: 35, percentage: 23.3 },
        { id: 'exp-872906', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 15, percentage: 10.0 }
      ],
      verdict: 'King Khan Domination',
      createdAt: new Date(Date.now() - 3600000 * 23).toISOString()
    },
    {
      id: 'seed-jawan-2',
      userKey: 'seed_user_14',
      movieId: 872906,
      movieTitle: 'Jawan',
      moviePoster: 'https://image.tmdb.org/t/p/w500/jFt1g94utjj2YKQioVJTYWzOuvZ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'actor-35742', tmdbId: 35742, name: 'Shah Rukh Khan (Vikram Rathore / Azad)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg', amount: 60, percentage: 40.0 },
        { id: 'dir-1259367', tmdbId: 1259367, name: 'Atlee', role: 'Director', profilePath: null, amount: 40, percentage: 26.7 },
        { id: 'music-1081464', tmdbId: 1081464, name: 'Anirudh Ravichander', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/xKvlrZpRaXkm2K2ZiXpqgrEedUU.jpg', amount: 40, percentage: 26.7 },
        { id: 'exp-872906', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 10, percentage: 6.7 }
      ],
      verdict: 'Massive BGM & SRK Screen Presence',
      createdAt: new Date(Date.now() - 3600000 * 19).toISOString()
    },
    {
      id: 'seed-jawan-3',
      userKey: 'seed_user_15',
      movieId: 872906,
      movieTitle: 'Jawan',
      moviePoster: 'https://image.tmdb.org/t/p/w500/jFt1g94utjj2YKQioVJTYWzOuvZ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'actor-35742', tmdbId: 35742, name: 'Shah Rukh Khan (Vikram Rathore / Azad)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg', amount: 65, percentage: 43.3 },
        { id: 'dir-1259367', tmdbId: 1259367, name: 'Atlee', role: 'Director', profilePath: null, amount: 35, percentage: 23.3 },
        { id: 'music-1081464', tmdbId: 1081464, name: 'Anirudh Ravichander', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/xKvlrZpRaXkm2K2ZiXpqgrEedUU.jpg', amount: 35, percentage: 23.3 },
        { id: 'exp-872906', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 15, percentage: 10.0 }
      ],
      verdict: 'Full Paisa Vasool',
      createdAt: new Date(Date.now() - 3600000 * 13).toISOString()
    },
    {
      id: 'seed-jawan-4',
      userKey: 'seed_user_16',
      movieId: 872906,
      movieTitle: 'Jawan',
      moviePoster: 'https://image.tmdb.org/t/p/w500/jFt1g94utjj2YKQioVJTYWzOuvZ.jpg',
      ticketPrice: 150,
      currency: 'INR',
      allocations: [
        { id: 'actor-35742', tmdbId: 35742, name: 'Shah Rukh Khan (Vikram Rathore / Azad)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg', amount: 60, percentage: 40.0 },
        { id: 'dir-1259367', tmdbId: 1259367, name: 'Atlee', role: 'Director', profilePath: null, amount: 40, percentage: 26.7 },
        { id: 'music-1081464', tmdbId: 1081464, name: 'Anirudh Ravichander', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/xKvlrZpRaXkm2K2ZiXpqgrEedUU.jpg', amount: 40, percentage: 26.7 },
        { id: 'exp-872906', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 10, percentage: 6.7 }
      ],
      verdict: 'SRK Stole The Entire Ticket',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];
}

export function getStoredSubmissions(): TicketSplitSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Seed initial realistic ballots across the 4 core movies
    const seed = generateStarterSeedSubmissions();
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(seed));
    return seed;
  } catch {
    return [];
  }
}

export function getUserSubmissionForMovie(movieId: number): TicketSplitSubmission | null {
  const userKey = getUserKey();
  const all = getStoredSubmissions();
  return all.find((s) => s.movieId === movieId && s.userKey === userKey) || null;
}

/**
 * PURE BUSINESS LOGIC FOR MULTI-MOVIE LEADERBOARD:
 * Aggregates verified ballots across ALL films with 100% pure arithmetic.
 * Avg % = sum(percentage) / totalBallots containing that talent.
 * Avg ₹ = sum(amount) / totalBallots containing that talent.
 * Strictly sorts descending by avgPercentage!
 */
export function calculateGlobalLeaderboard(submissions: TicketSplitSubmission[]): LeaderboardEntry[] {
  const talentMap = new Map<string, {
    id: string;
    tmdbPersonId?: number;
    name: string;
    role: 'Director' | 'Actor' | 'Music' | 'Producer';
    profilePath: string | null;
    totalPercentage: number;
    totalAmount: number;
    totalVotes: number;
    filmMap: Map<string, {
      movieId?: number;
      movieTitle: string;
      sumPercentage: number;
      voteCount: number;
    }>;
  }>();

  submissions.forEach((sub) => {
    sub.allocations.forEach((alloc) => {
      // Exclude generic audience experience / popcorn custom boxes from talent ranking
      if (
        alloc.role.toLowerCase().includes('audience') || 
        alloc.role.toLowerCase().includes('experience') || 
        alloc.role === 'Custom'
      ) {
        return;
      }

      const talentRole: 'Director' | 'Actor' | 'Music' | 'Producer' = 
        alloc.role === 'Director' ? 'Director' :
        alloc.role === 'Music' ? 'Music' :
        alloc.role === 'Producer' ? 'Producer' : 'Actor';

      const cleanName = normalizeName(alloc.name);
      const aggKey = `${cleanName.toLowerCase()}__${talentRole.toLowerCase()}`;

      let talent = talentMap.get(aggKey);
      if (!talent) {
        talent = {
          id: alloc.id || `talent-${cleanName.replace(/\s+/g, '-').toLowerCase()}`,
          tmdbPersonId: alloc.tmdbId,
          name: cleanName,
          role: talentRole,
          profilePath: alloc.profilePath || null,
          totalPercentage: 0,
          totalAmount: 0,
          totalVotes: 0,
          filmMap: new Map()
        };
        talentMap.set(aggKey, talent);
      }

      if (!talent.profilePath && alloc.profilePath) {
        talent.profilePath = alloc.profilePath;
      }

      talent.totalPercentage += alloc.percentage;
      talent.totalAmount += alloc.amount;
      talent.totalVotes += 1;

      // Track individual filmography credit
      const filmKey = sub.movieTitle.toLowerCase();
      let filmRecord = talent.filmMap.get(filmKey);
      if (!filmRecord) {
        filmRecord = {
          movieId: sub.movieId,
          movieTitle: sub.movieTitle,
          sumPercentage: 0,
          voteCount: 0
        };
        talent.filmMap.set(filmKey, filmRecord);
      }
      filmRecord.sumPercentage += alloc.percentage;
      filmRecord.voteCount += 1;
    });
  });

  const result: LeaderboardEntry[] = [];

  talentMap.forEach((talent) => {
    if (talent.totalVotes === 0) return;

    // Pure arithmetic averages:
    const avgPercentage = Number((talent.totalPercentage / talent.totalVotes).toFixed(1));
    const avgAmountRupees = Math.round(talent.totalAmount / talent.totalVotes);

    const filmography: FilmographyCredit[] = Array.from(talent.filmMap.values()).map((f) => ({
      movieId: f.movieId,
      movieTitle: f.movieTitle,
      avgPercentage: Number((f.sumPercentage / f.voteCount).toFixed(1)),
      voteCount: f.voteCount
    })).sort((a, b) => b.avgPercentage - a.avgPercentage);

    const topMovieTitle = filmography[0]?.movieTitle || 'Featured Film';

    result.push({
      id: talent.id,
      tmdbPersonId: talent.tmdbPersonId,
      name: talent.name,
      role: talent.role,
      profilePath: talent.profilePath,
      totalVotes: talent.totalVotes,
      avgPercentage,
      avgAmountRupees,
      topMovieTitle,
      filmsCount: filmography.length,
      filmography
    });
  });

  return result.sort((a, b) => b.avgPercentage - a.avgPercentage || b.avgAmountRupees - a.avgAmountRupees);
}

/**
 * PURE BUSINESS LOGIC FOR MULTI-MOVIE WORTH-IT ROI:
 * Aggregates audience satisfaction across all films with 100% pure arithmetic.
 */
export function calculateGlobalMovieROIs(submissions: TicketSplitSubmission[]): MovieROIEntry[] {
  const movieMap = new Map<number, {
    movieId: number;
    title: string;
    posterPath: string | null;
    totalVotes: number;
    sumAudienceSat: number;
    allocationsSum: Map<string, { name: string; role: string; sumPct: number }>;
  }>();

  submissions.forEach((sub) => {
    let movie = movieMap.get(sub.movieId);
    if (!movie) {
      movie = {
        movieId: sub.movieId,
        title: sub.movieTitle,
        posterPath: sub.moviePoster || null,
        totalVotes: 0,
        sumAudienceSat: 0,
        allocationsSum: new Map()
      };
      movieMap.set(sub.movieId, movie);
    }

    if (!movie.posterPath && sub.moviePoster) {
      movie.posterPath = sub.moviePoster;
    }

    movie.totalVotes += 1;

    sub.allocations.forEach((alloc) => {
      if (alloc.role.toLowerCase().includes('audience') || alloc.role.toLowerCase().includes('experience')) {
        movie!.sumAudienceSat += alloc.percentage;
      } else {
        const key = normalizeName(alloc.name);
        const existing = movie!.allocationsSum.get(key) || { name: key, role: alloc.role, sumPct: 0 };
        existing.sumPct += alloc.percentage;
        movie!.allocationsSum.set(key, existing);
      }
    });
  });

  const result: MovieROIEntry[] = [];

  movieMap.forEach((movie) => {
    if (movie.totalVotes === 0) return;

    // Pure arithmetic average satisfaction
    const avgAudienceSatisfaction = Number((movie.sumAudienceSat / movie.totalVotes).toFixed(1));
    const valueScore = Number(Math.min(9.9, Math.max(6.0, 7.0 + avgAudienceSatisfaction / 12)).toFixed(1));

    // Determine dominant contributor for this movie
    const topContrib = Array.from(movie.allocationsSum.values())
      .map((item) => ({ ...item, avgPct: Number((item.sumPct / movie.totalVotes).toFixed(1)) }))
      .sort((a, b) => b.avgPct - a.avgPct)[0];

    let dominantRole = "Cinematic Collaboration";
    if (topContrib) {
      if (topContrib.role === 'Director') {
        dominantRole = `Director Led (${topContrib.name} ${topContrib.avgPct}%)`;
      } else if (topContrib.role === 'Actor') {
        dominantRole = `Star Driven (${topContrib.name} ${topContrib.avgPct}%)`;
      } else if (topContrib.role === 'Music') {
        dominantRole = `Audiovisual Spectacle (${topContrib.name} ${topContrib.avgPct}%)`;
      } else {
        dominantRole = `${topContrib.name} (${topContrib.avgPct}%)`;
      }
    }

    result.push({
      movieId: movie.movieId,
      title: movie.title,
      posterPath: movie.posterPath,
      totalVotes: movie.totalVotes,
      avgAudienceSatisfaction,
      dominantRole,
      valueScore
    });
  });

  return result.sort((a, b) => b.valueScore - a.valueScore || b.avgAudienceSatisfaction - a.avgAudienceSatisfaction);
}

export function getStoredLeaderboard(): LeaderboardEntry[] {
  const submissions = getStoredSubmissions();
  if (submissions.length === 0) return INITIAL_LEADERBOARD;
  return calculateGlobalLeaderboard(submissions);
}

export function getStoredMovieROIs(): MovieROIEntry[] {
  const submissions = getStoredSubmissions();
  if (submissions.length === 0) return INITIAL_MOVIE_ROIS;
  return calculateGlobalMovieROIs(submissions);
}

/**
 * Normalizes contributor name for consistent aggregation across ballots
 */
function normalizeName(name: string): string {
  return name.split('(')[0].trim();
}

function getAggKey(name: string, role: string): string {
  return `${normalizeName(name).toLowerCase()}__${role.toLowerCase()}`;
}

/**
 * PURE BUSINESS LOGIC FOR FILM CENSUS:
 * When users vote, their ballots 100% strictly determine the rankings and percentages!
 * If 1 user votes evenly (₹25 each), 2 users vote for Director (₹75, ₹80), 
 * 1 for Hero (₹70), 1 for Heroine (₹70), 1 for Villain (₹70):
 * Director gets ₹228 total (25.3% avg) vs ₹156 (17.3% avg) for Hero/Heroine/Villain.
 * Director MUST be Rank #1!
 */
export function getMovieCommunityStats(
  movieId: number, 
  currentContributors?: Contributor[]
): MovieCommunityStats {
  const submissions = getStoredSubmissions().filter((s) => s.movieId === movieId);
  const totalVoters = submissions.length;

  // Case 1: No real ballots cast yet for this film
  if (totalVoters === 0) {
    const avgTicketPrice = 150;
    const valueScore = 8.0;
    const dominantVerdict = "No ballots cast yet — Be the first to valuate this film!";

    let avgAllocations: CommunityAllocationItem[] = [];
    if (currentContributors && currentContributors.length > 0) {
      const equalPct = Number((100 / currentContributors.length).toFixed(1));
      const equalAmt = Math.round(avgTicketPrice / currentContributors.length);

      avgAllocations = currentContributors.map((c, idx) => ({
        id: c.id,
        name: normalizeName(c.name),
        role: c.role,
        profilePath: c.profilePath,
        avgPercentage: equalPct,
        avgAmountRupees: equalAmt,
        voterCount: 0,
        rank: idx + 1
      }));
    }

    return {
      movieId,
      totalVoters: 0,
      avgTicketPrice,
      valueScore,
      dominantVerdict,
      avgAllocations,
      recentSplits: []
    };
  }

  // Case 2: We have real voter ballots! Calculate pure averages across all ballots.
  const totalSpent = submissions.reduce((sum, s) => sum + s.ticketPrice, 0);
  const avgTicketPrice = Math.round(totalSpent / totalVoters);

  // Map to accumulate totals per contributor
  const aggMap: Record<string, {
    id: string;
    displayName: string;
    role: string;
    profilePath: string | null;
    totalAmount: number;
    totalPercentage: number;
    voterCount: number;
  }> = {};

  // First, ensure all current movie contributors are present in the map
  if (currentContributors) {
    currentContributors.forEach((c) => {
      const key = getAggKey(c.name, c.role);
      aggMap[key] = {
        id: c.id,
        displayName: normalizeName(c.name),
        role: c.role,
        profilePath: c.profilePath,
        totalAmount: 0,
        totalPercentage: 0,
        voterCount: 0
      };
    });
  }

  // Aggregate every user ballot
  submissions.forEach((ballot) => {
    ballot.allocations.forEach((alloc) => {
      const key = getAggKey(alloc.name, alloc.role);
      const clean = normalizeName(alloc.name);

      if (!aggMap[key]) {
        aggMap[key] = {
          id: alloc.id,
          displayName: clean,
          role: alloc.role,
          profilePath: alloc.profilePath,
          totalAmount: 0,
          totalPercentage: 0,
          voterCount: 0
        };
      }

      aggMap[key].totalAmount += alloc.amount;
      aggMap[key].totalPercentage += alloc.percentage;
      aggMap[key].voterCount += 1;
    });
  });

  // Calculate pure arithmetic average across all voters who voted on this film
  const avgAllocations: CommunityAllocationItem[] = Object.values(aggMap)
    .map((item) => {
      // Average percentage = sum of percentages / total voters
      const avgPct = Number((item.totalPercentage / totalVoters).toFixed(1));
      // Average rupees = sum of amount / total voters
      const avgAmt = Number((item.totalAmount / totalVoters).toFixed(1));

      return {
        id: item.id,
        name: item.displayName,
        role: item.role,
        profilePath: item.profilePath,
        avgPercentage: avgPct,
        avgAmountRupees: Math.round(avgAmt),
        voterCount: item.voterCount,
        rank: 0
      };
    })
    // Sort STRICTLY descending: highest average cut is Rank #1!
    .sort((a, b) => b.avgPercentage - a.avgPercentage || b.avgAmountRupees - a.avgAmountRupees)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  // Determine dominant verdict based on who won Rank #1
  const top1 = avgAllocations[0];
  const top2 = avgAllocations[1];

  let dominantVerdict = "Well-Balanced Cinematic Collaboration";
  if (top1 && top1.avgPercentage > 0) {
    if (top2 && top1.avgPercentage >= top2.avgPercentage + 5) {
      dominantVerdict = `👑 ${top1.name} (${top1.role}) Carried This Film with a dominant ${top1.avgPercentage}% ticket cut!`;
    } else {
      dominantVerdict = `🎬 Lead Value Driver: ${top1.name} (${top1.role}) leads the film at ${top1.avgPercentage}% cut.`;
    }
  }

  // Calculate Value Score based on audience satisfaction cut
  const expCut = avgAllocations.find((a) => a.role.toLowerCase().includes('audience') || a.role.toLowerCase().includes('experience'))?.avgPercentage || 0;
  const valueScore = Number(Math.min(9.9, Math.max(6.0, 7.5 + (expCut / 15))).toFixed(1));

  // Build Recent Ballots feed from real submissions
  const recentSplits: RecentSplitPreview[] = submissions.slice(0, 6).map((s, idx) => {
    const topItem = [...s.allocations].sort((a, b) => b.amount - a.amount)[0];
    return {
      id: s.id,
      voterLabel: `Moviegoer #${totalVoters - idx}`,
      ticketPrice: s.ticketPrice,
      topRecipient: topItem ? normalizeName(topItem.name) : 'Cinema',
      topPercentage: topItem?.percentage || 0,
      verdict: s.verdict,
      timeAgo: idx === 0 ? 'Just now' : `${idx * 15}m ago`
    };
  });

  return {
    movieId,
    totalVoters,
    avgTicketPrice,
    valueScore,
    dominantVerdict,
    avgAllocations,
    recentSplits
  };
}

/**
 * Calculates the exact Delta between a User's split and the Crowd Consensus
 */
export function calculateComparisonDeltas(
  userAllocations: Contributor[],
  communityAllocations: CommunityAllocationItem[]
): ComparisonDelta[] {
  return userAllocations.map((userAlloc) => {
    const cleanName = normalizeName(userAlloc.name).toLowerCase();
    const match = communityAllocations.find(
      (c) => c.name.toLowerCase().includes(cleanName) || cleanName.includes(c.name.toLowerCase())
    );

    const communityPct = match ? match.avgPercentage : 0;
    const diff = Number((userAlloc.percentage - communityPct).toFixed(1));

    let insight = "Aligned with crowd consensus";
    if (diff >= 10) {
      insight = `+${diff}% higher than crowd (You strongly valued ${userAlloc.role})`;
    } else if (diff <= -10) {
      insight = `${diff}% lower than crowd average`;
    }

    return {
      contributorName: normalizeName(userAlloc.name),
      role: userAlloc.role,
      userPercentage: userAlloc.percentage,
      communityPercentage: communityPct,
      difference: diff,
      insight
    };
  });
}

export function generateVerdict(allocations: Contributor[]): string {
  if (!allocations || allocations.length === 0) return "Fair & Balanced Cinema!";

  const sorted = [...allocations].sort((a, b) => b.amount - a.amount);
  const highest = sorted[0];

  if (highest.role === 'Audience / Experience') {
    if (highest.percentage >= 40) {
      return "🍿 Popcorn & AC Carried The Movie!";
    }
    return "✨ Pure Audience Satisfaction!";
  }

  if (highest.role === 'Director') {
    if (highest.percentage >= 40) {
      return `🎬 Visionary Masterpiece! (${highest.name} Carried)`;
    }
    return `🎥 Strong Direction Led The Experience`;
  }

  if (highest.role === 'Actor') {
    if (highest.percentage >= 40) {
      return `🌟 Star-Powered Domination! (${normalizeName(highest.name)} Carried)`;
    }
    return `🎭 Superb Acting Performance`;
  }

  if (highest.role === 'Music') {
    return `🎵 Audio Symphony! BGM Was Worth The Ticket Price!`;
  }

  if (highest.role === 'Producer') {
    return `💰 Grand Scale & Production Value Spectacle!`;
  }

  return "🎟️ Well-Balanced Cinematic Value!";
}

/**
 * Saves a split submission.
 */
export function saveTicketSplit(submission: TicketSplitSubmission): { isUpdate: boolean } {
  if (typeof window === 'undefined') return { isUpdate: false };

  try {
    const existing = getStoredSubmissions();
    const index = existing.findIndex(
      (s) => s.movieId === submission.movieId && s.userKey === submission.userKey
    );

    let isUpdate = false;
    let updatedList: TicketSplitSubmission[];

    if (index >= 0) {
      isUpdate = true;
      submission.updatedAt = new Date().toISOString();
      updatedList = [...existing];
      updatedList[index] = submission;
    } else {
      updatedList = [submission, ...existing];
    }

    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updatedList));

    // Update Global Leaderboard Aggregates
    updateGlobalLeaderboard();

    return { isUpdate };
  } catch (err) {
    console.error("Failed to save split:", err);
    return { isUpdate: false };
  }
}

/**
 * Updates Global Multi-Movie Leaderboard caches using 100% pure arithmetic
 */
function updateGlobalLeaderboard() {
  if (typeof window === 'undefined') return;
  const submissions = getStoredSubmissions();
  const leaderboard = calculateGlobalLeaderboard(submissions);
  const rois = calculateGlobalMovieROIs(submissions);
  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  localStorage.setItem(STORAGE_KEYS.MOVIE_ROIS, JSON.stringify(rois));
}

/**
 * SIMULATES THE USER'S EXACT TEST SCENARIO:
 * 1 user votes evenly (₹25 for each of the 6 roles)
 * 2 users vote Director heavy (₹75, ₹80)
 * 1 user votes Hero heavy (₹70)
 * 1 user votes Heroine heavy (₹70)
 * 1 user votes Villain heavy (₹70)
 * Total: 6 distinct voters.
 * Director gets ₹228 total (25.3% avg) vs ₹156 (17.3% avg) for Hero, Heroine, Villain.
 * Director emerges as indisputable #1!
 */
export function simulateUserScenario(
  movieId: number,
  movieTitle: string,
  posterPath: string | null,
  contributors?: Contributor[]
): void {
  if (typeof window === 'undefined') return;

  const ticketPrice = 150;

  // Build a distinct set of 6 contributors (Director, Hero, Heroine, Villain, Music, Experience)
  let activeList: Contributor[] = [];
  if (contributors && contributors.length >= 6) {
    activeList = [...contributors];
  } else if (MOCK_MOVIES[movieId]) {
    const mock = MOCK_MOVIES[movieId];
    const dir = mock.crew.find((c) => c.job === 'Director');
    const music = mock.crew.find((c) => c.job.includes('Music') || c.job.includes('Composer'));
    activeList = [
      {
        id: `dir-${dir?.id || 101}`,
        name: dir?.name || 'Director',
        role: 'Director',
        profilePath: dir?.profile_path || null,
        amount: 0,
        percentage: 0
      },
      {
        id: `hero-${mock.cast[0]?.id || 102}`,
        name: mock.cast[0] ? `${mock.cast[0].name} (Hero)` : 'Hero / Lead Actor',
        role: 'Actor',
        profilePath: mock.cast[0]?.profile_path || null,
        amount: 0,
        percentage: 0
      },
      {
        id: `heroine-${mock.cast[1]?.id || 103}`,
        name: mock.cast[1] ? `${mock.cast[1].name} (Heroine)` : 'Heroine / Lead Actress',
        role: 'Actor',
        profilePath: mock.cast[1]?.profile_path || null,
        amount: 0,
        percentage: 0
      },
      {
        id: `villain-${mock.cast[2]?.id || 104}`,
        name: mock.cast[2] ? `${mock.cast[2].name} (Villain)` : 'Villain / Antagonist',
        role: 'Actor',
        profilePath: mock.cast[2]?.profile_path || null,
        amount: 0,
        percentage: 0
      },
      {
        id: `music-${music?.id || 105}`,
        name: music?.name || 'Music Director',
        role: 'Music',
        profilePath: music?.profile_path || null,
        amount: 0,
        percentage: 0
      },
      {
        id: `exp-${movieId}`,
        name: 'Popcorn & Audience Experience',
        role: 'Audience / Experience',
        profilePath: null,
        amount: 0,
        percentage: 0
      }
    ];
  } else {
    activeList = [
      { id: `dir-${movieId}`, name: 'Director', role: 'Director', profilePath: null, amount: 0, percentage: 0 },
      { id: `hero-${movieId}`, name: 'Hero / Lead Actor', role: 'Actor', profilePath: null, amount: 0, percentage: 0 },
      { id: `heroine-${movieId}`, name: 'Heroine / Lead Actress', role: 'Actor', profilePath: null, amount: 0, percentage: 0 },
      { id: `villain-${movieId}`, name: 'Villain / Antagonist', role: 'Actor', profilePath: null, amount: 0, percentage: 0 },
      { id: `music-${movieId}`, name: 'Music Director', role: 'Music', profilePath: null, amount: 0, percentage: 0 },
      { id: `exp-${movieId}`, name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: 0, percentage: 0 }
    ];
  }

  // Ensure 6 distinct objects with unique IDs
  const dir = activeList.find((c) => c.role === 'Director') || activeList[0];
  const rem1 = activeList.filter((c) => c.id !== dir.id);
  const hero = rem1.find((c) => c.role === 'Actor') || rem1[0];
  const rem2 = rem1.filter((c) => c.id !== hero.id);
  const heroine = rem2.find((c) => c.role === 'Actor') || rem2[0];
  const rem3 = rem2.filter((c) => c.id !== heroine.id);
  const villain = rem3.find((c) => c.role === 'Actor' || c.role === 'Producer') || rem3[0];
  const rem4 = rem3.filter((c) => c.id !== villain.id);
  const music = rem4.find((c) => c.role === 'Music') || rem4[0];
  const rem5 = rem4.filter((c) => c.id !== music.id);
  const exp = rem5[0] || activeList[5];

  const sixContributors = [dir, hero, heroine, villain, music, exp];

  const voters = [
    // Voter 1: Even split for all (₹25 each)
    {
      label: 'Voter 1 (Even Split ₹25 each)',
      cuts: { [dir.id]: 25, [hero.id]: 25, [heroine.id]: 25, [villain.id]: 25, [music.id]: 25, [exp.id]: 25 }
    },
    // Voter 2: Director heavy (₹75)
    {
      label: 'Voter 2 (Director Heavy ₹75)',
      cuts: { [dir.id]: 75, [hero.id]: 15, [heroine.id]: 15, [villain.id]: 15, [music.id]: 15, [exp.id]: 15 }
    },
    // Voter 3: Director heavy (₹80)
    {
      label: 'Voter 3 (Director Heavy ₹80)',
      cuts: { [dir.id]: 80, [hero.id]: 14, [heroine.id]: 14, [villain.id]: 14, [music.id]: 14, [exp.id]: 14 }
    },
    // Voter 4: Hero heavy (₹70)
    {
      label: 'Voter 4 (Hero Heavy ₹70)',
      cuts: { [hero.id]: 70, [dir.id]: 16, [heroine.id]: 16, [villain.id]: 16, [music.id]: 16, [exp.id]: 16 }
    },
    // Voter 5: Heroine heavy (₹70)
    {
      label: 'Voter 5 (Heroine Heavy ₹70)',
      cuts: { [heroine.id]: 70, [dir.id]: 16, [hero.id]: 16, [villain.id]: 16, [music.id]: 16, [exp.id]: 16 }
    },
    // Voter 6: Villain heavy (₹70)
    {
      label: 'Voter 6 (Villain Heavy ₹70)',
      cuts: { [villain.id]: 70, [dir.id]: 16, [hero.id]: 16, [heroine.id]: 16, [music.id]: 16, [exp.id]: 16 }
    }
  ];

  // Clear existing submissions for this movie first to cleanly test this scenario
  const existing = getStoredSubmissions().filter((s) => s.movieId !== movieId);

  const newSubmissions: TicketSplitSubmission[] = voters.map((v, i) => {
    const allocations: Contributor[] = sixContributors.map((c) => {
      const amt = v.cuts[c.id] || 0;
      return {
        ...c,
        amount: amt,
        percentage: Number(((amt / ticketPrice) * 100).toFixed(1))
      };
    });

    return {
      id: `sim-split-${movieId}-${i + 1}-${Date.now()}`,
      userKey: `sim_user_${i + 1}`,
      movieId,
      movieTitle,
      moviePoster: posterPath,
      ticketPrice,
      currency: 'INR',
      allocations,
      verdict: v.label,
      createdAt: new Date(Date.now() - (6 - i) * 60000).toISOString()
    };
  });

  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([...newSubmissions, ...existing]));

  // Update global leaderboard
  updateGlobalLeaderboard();
}

/**
 * Resets all votes for a specific movie
 */
export function resetMovieBallots(movieId: number): void {
  if (typeof window === 'undefined') return;
  const remaining = getStoredSubmissions().filter((s) => s.movieId !== movieId);
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(remaining));
  updateGlobalLeaderboard();
}

/**
 * SIMULATES MULTI-MOVIE USER VOTES WITH PURE ARITHMETIC:
 * Simulates verified voter splits across 4 major films:
 * 1. Oppenheimer (6 ballots, Nolan heavy -> ~25.3% avg)
 * 2. RRR (6 ballots, Rajamouli heavy -> ~38.5% avg)
 * 3. Dune: Part Two (6 ballots, Denis heavy -> ~34.0% avg)
 * 4. Jawan (6 ballots, SRK hero heavy -> ~42.5% avg)
 * Immediately updates the Global Multi-Movie Leaderboard across all categories!
 */
export function simulateMultiMovieScenario(): void {
  if (typeof window === 'undefined') return;

  const ticketPrice = 150;

  // 1. Oppenheimer Ballots (Nolan Director Heavy)
  const oppenheimerVoters = [
    { label: 'Oppenheimer #1 (Even)', cuts: { 'dir-525': 25, 'actor-2037': 25, 'actor-3223': 25, 'actor-5081': 25, 'music-64670': 25, 'exp-872585': 25 } },
    { label: 'Oppenheimer #2 (Director Heavy)', cuts: { 'dir-525': 75, 'actor-2037': 15, 'actor-3223': 15, 'actor-5081': 15, 'music-64670': 15, 'exp-872585': 15 } },
    { label: 'Oppenheimer #3 (Director Heavy)', cuts: { 'dir-525': 80, 'actor-2037': 14, 'actor-3223': 14, 'actor-5081': 14, 'music-64670': 14, 'exp-872585': 14 } },
    { label: 'Oppenheimer #4 (Hero Heavy)', cuts: { 'actor-2037': 70, 'dir-525': 16, 'actor-3223': 16, 'actor-5081': 16, 'music-64670': 16, 'exp-872585': 16 } },
    { label: 'Oppenheimer #5 (Villain Heavy)', cuts: { 'actor-3223': 70, 'dir-525': 16, 'actor-2037': 16, 'actor-5081': 16, 'music-64670': 16, 'exp-872585': 16 } },
    { label: 'Oppenheimer #6 (Heroine Heavy)', cuts: { 'actor-5081': 70, 'dir-525': 16, 'actor-2037': 16, 'actor-3223': 16, 'music-64670': 16, 'exp-872585': 16 } }
  ];

  const oppSubs: TicketSplitSubmission[] = oppenheimerVoters.map((v, i) => ({
    id: `sim-multi-opp-${i + 1}-${Date.now()}`,
    userKey: `sim_user_opp_${i + 1}`,
    movieId: 872585,
    movieTitle: 'Oppenheimer',
    moviePoster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    ticketPrice,
    currency: 'INR',
    allocations: [
      { id: 'dir-525', tmdbId: 525, name: 'Christopher Nolan', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg', amount: v.cuts['dir-525'], percentage: Number(((v.cuts['dir-525'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'actor-2037', tmdbId: 2037, name: 'Cillian Murphy (J. Robert Oppenheimer)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg', amount: v.cuts['actor-2037'], percentage: Number(((v.cuts['actor-2037'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'actor-3223', tmdbId: 3223, name: 'Robert Downey Jr. (Lewis Strauss)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3fq0lZMBv9779.jpg', amount: v.cuts['actor-3223'], percentage: Number(((v.cuts['actor-3223'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'actor-5081', tmdbId: 5081, name: 'Emily Blunt (Kitty Oppenheimer)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/nPJXaRMVUvgmn2SY8yQ65Z0aNfL.jpg', amount: v.cuts['actor-5081'], percentage: Number(((v.cuts['actor-5081'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'music-64670', tmdbId: 64670, name: 'Ludwig Göransson', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/5c1kS017W4hT96U3yB6P9YtU5tU.jpg', amount: v.cuts['music-64670'], percentage: Number(((v.cuts['music-64670'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'exp-872585', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: v.cuts['exp-872585'], percentage: Number(((v.cuts['exp-872585'] / ticketPrice) * 100).toFixed(1)) }
    ],
    verdict: v.label,
    createdAt: new Date(Date.now() - (24 - i) * 60000).toISOString()
  }));

  // 2. RRR Ballots (Rajamouli Director Dominant)
  const rrrVoters = [
    { label: 'RRR #1 (Rajamouli Masterclass)', cuts: { 'dir-147021': 80, 'actor-148037': 25, 'actor-124314': 25, 'music-225318': 10, 'exp-579974': 10 } },
    { label: 'RRR #2 (Rajamouli Vision)', cuts: { 'dir-147021': 75, 'actor-148037': 30, 'actor-124314': 25, 'music-225318': 10, 'exp-579974': 10 } },
    { label: 'RRR #3 (Rajamouli Heavy)', cuts: { 'dir-147021': 85, 'actor-148037': 20, 'actor-124314': 25, 'music-225318': 10, 'exp-579974': 10 } },
    { label: 'RRR #4 (Action Hero Led)', cuts: { 'dir-147021': 35, 'actor-148037': 55, 'actor-124314': 40, 'music-225318': 10, 'exp-579974': 10 } },
    { label: 'RRR #5 (Action Hero Led)', cuts: { 'dir-147021': 35, 'actor-148037': 40, 'actor-124314': 55, 'music-225318': 10, 'exp-579974': 10 } },
    { label: 'RRR #6 (Music & Dance Focus)', cuts: { 'dir-147021': 35, 'actor-148037': 30, 'actor-124314': 30, 'music-225318': 45, 'exp-579974': 10 } }
  ];

  const rrrSubs: TicketSplitSubmission[] = rrrVoters.map((v, i) => ({
    id: `sim-multi-rrr-${i + 1}-${Date.now()}`,
    userKey: `sim_user_rrr_${i + 1}`,
    movieId: 579974,
    movieTitle: 'RRR',
    moviePoster: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0ye2fq0SZ.jpg',
    ticketPrice,
    currency: 'INR',
    allocations: [
      { id: 'dir-147021', tmdbId: 147021, name: 'S. S. Rajamouli', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/qPskSZxvoYflC8Bye4tGNBSroy5.jpg', amount: v.cuts['dir-147021'], percentage: Number(((v.cuts['dir-147021'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'actor-148037', tmdbId: 148037, name: 'N.T. Rama Rao Jr. (Komaram Bheem)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/5ycQgZ3SPUa12bq0yn1jpToBq9X.jpg', amount: v.cuts['actor-148037'], percentage: Number(((v.cuts['actor-148037'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'actor-124314', tmdbId: 124314, name: 'Ram Charan (Alluri Sitarama Raju)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg', amount: v.cuts['actor-124314'], percentage: Number(((v.cuts['actor-124314'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'music-225318', tmdbId: 225318, name: 'M. M. Keeravani', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/r0f7RTGIkG0ZBaQViIKrE1g82Ec.jpg', amount: v.cuts['music-225318'], percentage: Number(((v.cuts['music-225318'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'exp-579974', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: v.cuts['exp-579974'], percentage: Number(((v.cuts['exp-579974'] / ticketPrice) * 100).toFixed(1)) }
    ],
    verdict: v.label,
    createdAt: new Date(Date.now() - (18 - i) * 60000).toISOString()
  }));

  // 3. Dune: Part Two Ballots (Denis + Hans Zimmer Heavy)
  const duneVoters = [
    { label: 'Dune #1 (Audiovisual Wonder)', cuts: { 'dir-137427': 55, 'actor-1190668': 35, 'music-947': 40, 'exp-693134': 20 } },
    { label: 'Dune #2 (Denis Direction)', cuts: { 'dir-137427': 60, 'actor-1190668': 35, 'music-947': 35, 'exp-693134': 20 } },
    { label: 'Dune #3 (Zimmer Score)', cuts: { 'dir-137427': 45, 'actor-1190668': 35, 'music-947': 50, 'exp-693134': 20 } },
    { label: 'Dune #4 (Audiovisual Wonder)', cuts: { 'dir-137427': 55, 'actor-1190668': 35, 'music-947': 40, 'exp-693134': 20 } },
    { label: 'Dune #5 (Denis Direction)', cuts: { 'dir-137427': 60, 'actor-1190668': 30, 'music-947': 40, 'exp-693134': 20 } },
    { label: 'Dune #6 (Zimmer Score)', cuts: { 'dir-137427': 45, 'actor-1190668': 35, 'music-947': 50, 'exp-693134': 20 } }
  ];

  const duneSubs: TicketSplitSubmission[] = duneVoters.map((v, i) => ({
    id: `sim-multi-dune-${i + 1}-${Date.now()}`,
    userKey: `sim_user_dune_${i + 1}`,
    movieId: 693134,
    movieTitle: 'Dune: Part Two',
    moviePoster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    ticketPrice,
    currency: 'INR',
    allocations: [
      { id: 'dir-137427', tmdbId: 137427, name: 'Denis Villeneuve', role: 'Director', profilePath: 'https://image.tmdb.org/t/p/w185/xzQYqb4nR8xT7Zdw5itbEL9K3fd.jpg', amount: v.cuts['dir-137427'], percentage: Number(((v.cuts['dir-137427'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'actor-1190668', tmdbId: 1190668, name: 'Timothée Chalamet (Paul Atreides)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg', amount: v.cuts['actor-1190668'], percentage: Number(((v.cuts['actor-1190668'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'music-947', tmdbId: 947, name: 'Hans Zimmer', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/tpQnDeHY15szIXvpnhlprufz4d.jpg', amount: v.cuts['music-947'], percentage: Number(((v.cuts['music-947'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'exp-693134', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: v.cuts['exp-693134'], percentage: Number(((v.cuts['exp-693134'] / ticketPrice) * 100).toFixed(1)) }
    ],
    verdict: v.label,
    createdAt: new Date(Date.now() - (12 - i) * 60000).toISOString()
  }));

  // 4. Jawan Ballots (Shah Rukh Khan Star Dominance)
  const jawanVoters = [
    { label: 'Jawan #1 (King Khan Supremacy)', cuts: { 'actor-35742': 85, 'dir-1259367': 25, 'music-1081464': 30, 'exp-872906': 10 } },
    { label: 'Jawan #2 (SRK Stardom)', cuts: { 'actor-35742': 80, 'dir-1259367': 30, 'music-1081464': 30, 'exp-872906': 10 } },
    { label: 'Jawan #3 (King Khan Supremacy)', cuts: { 'actor-35742': 85, 'dir-1259367': 25, 'music-1081464': 30, 'exp-872906': 10 } },
    { label: 'Jawan #4 (SRK Stardom)', cuts: { 'actor-35742': 80, 'dir-1259367': 30, 'music-1081464': 30, 'exp-872906': 10 } },
    { label: 'Jawan #5 (King Khan Supremacy)', cuts: { 'actor-35742': 85, 'dir-1259367': 25, 'music-1081464': 30, 'exp-872906': 10 } },
    { label: 'Jawan #6 (Anirudh BGM + SRK)', cuts: { 'actor-35742': 75, 'dir-1259367': 25, 'music-1081464': 40, 'exp-872906': 10 } }
  ];

  const jawanSubs: TicketSplitSubmission[] = jawanVoters.map((v, i) => ({
    id: `sim-multi-jawan-${i + 1}-${Date.now()}`,
    userKey: `sim_user_jawan_${i + 1}`,
    movieId: 872906,
    movieTitle: 'Jawan',
    moviePoster: 'https://image.tmdb.org/t/p/w500/jFt1g94utjj2YKQioVJTYWzOuvZ.jpg',
    ticketPrice,
    currency: 'INR',
    allocations: [
      { id: 'actor-35742', tmdbId: 35742, name: 'Shah Rukh Khan (Vikram Rathore / Azad)', role: 'Actor', profilePath: 'https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg', amount: v.cuts['actor-35742'], percentage: Number(((v.cuts['actor-35742'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'dir-1259367', tmdbId: 1259367, name: 'Atlee', role: 'Director', profilePath: null, amount: v.cuts['dir-1259367'], percentage: Number(((v.cuts['dir-1259367'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'music-1081464', tmdbId: 1081464, name: 'Anirudh Ravichander', role: 'Music', profilePath: 'https://image.tmdb.org/t/p/w185/xKvlrZpRaXkm2K2ZiXpqgrEedUU.jpg', amount: v.cuts['music-1081464'], percentage: Number(((v.cuts['music-1081464'] / ticketPrice) * 100).toFixed(1)) },
      { id: 'exp-872906', name: 'Popcorn & Audience Experience', role: 'Audience / Experience', profilePath: null, amount: v.cuts['exp-872906'], percentage: Number(((v.cuts['exp-872906'] / ticketPrice) * 100).toFixed(1)) }
    ],
    verdict: v.label,
    createdAt: new Date(Date.now() - (6 - i) * 60000).toISOString()
  }));

  const allSims = [...oppSubs, ...rrrSubs, ...duneSubs, ...jawanSubs];
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(allSims));
  updateGlobalLeaderboard();
}

/**
 * Resets all ballots and leaderboards across all movies to clean initial baseline
 */
export function resetAllSubmissionsAndLeaderboards(): void {
  if (typeof window === 'undefined') return;
  const seed = generateStarterSeedSubmissions();
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(seed));
  updateGlobalLeaderboard();
}
