export interface Movie {
  id: number;
  title: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Contributor {
  id: string; // unique key (e.g. "dir-123", "actor-456", "custom-self")
  tmdbId?: number;
  name: string;
  role: string;
  profilePath: string | null;
  amount: number;
  percentage: number;
  isCustom?: boolean;
  canRemove?: boolean;
}

export interface TicketSplitSubmission {
  id: string;
  userKey: string; // Unique voter ID to enforce 1-user-1-ticket-split
  movieId: number;
  movieTitle: string;
  moviePoster: string | null;
  ticketPrice: number;
  currency: string;
  allocations: Contributor[];
  verdict: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FilmographyCredit {
  movieTitle: string;
  movieId?: number;
  avgPercentage: number;
  voteCount: number;
}

export interface LeaderboardEntry {
  id: string;
  tmdbPersonId?: number;
  name: string;
  role: 'Director' | 'Actor' | 'Music' | 'Producer';
  profilePath: string | null;
  totalVotes: number;
  avgPercentage: number;
  avgAmountRupees: number;
  topMovieTitle: string;
  filmsCount: number;
  filmography?: FilmographyCredit[];
}

export interface MovieROIEntry {
  movieId: number;
  title: string;
  posterPath: string | null;
  totalVotes: number;
  avgAudienceSatisfaction: number; // % given to Audience/Experience
  dominantRole: string;
  valueScore: number; // 0-10
}

export interface CommunityAllocationItem {
  id: string;
  name: string;
  role: string;
  profilePath: string | null;
  avgPercentage: number;
  avgAmountRupees: number;
  voterCount: number;
  rank: number; // In-movie rank #1, #2, #3...
}

export interface ComparisonDelta {
  contributorName: string;
  role: string;
  userPercentage: number;
  communityPercentage: number;
  difference: number; // e.g. +8.5 or -5.2
  insight: string;
}

export interface RecentSplitPreview {
  id: string;
  voterLabel: string;
  ticketPrice: number;
  topRecipient: string;
  topPercentage: number;
  verdict: string;
  timeAgo: string;
}

export interface MovieCommunityStats {
  movieId: number;
  totalVoters: number;
  avgTicketPrice: number;
  valueScore: number; // e.g. 8.4 / 10
  dominantVerdict: string;
  avgAllocations: CommunityAllocationItem[];
  recentSplits: RecentSplitPreview[];
}
