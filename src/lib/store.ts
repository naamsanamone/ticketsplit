import { 
  TicketSplitSubmission, 
  LeaderboardEntry, 
  MovieROIEntry, 
  Contributor, 
  MovieCommunityStats,
  CommunityAllocationItem,
  RecentSplitPreview,
  ComparisonDelta
} from '../types';
import { INITIAL_LEADERBOARD, INITIAL_MOVIE_ROIS } from './mockData';

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

export function getStoredSubmissions(): TicketSplitSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getUserSubmissionForMovie(movieId: number): TicketSplitSubmission | null {
  const userKey = getUserKey();
  const all = getStoredSubmissions();
  return all.find((s) => s.movieId === movieId && s.userKey === userKey) || null;
}

export function getStoredLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return INITIAL_LEADERBOARD;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    return raw ? JSON.parse(raw) : INITIAL_LEADERBOARD;
  } catch {
    return INITIAL_LEADERBOARD;
  }
}

export function getStoredMovieROIs(): MovieROIEntry[] {
  if (typeof window === 'undefined') return INITIAL_MOVIE_ROIS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOVIE_ROIS);
    return raw ? JSON.parse(raw) : INITIAL_MOVIE_ROIS;
  } catch {
    return INITIAL_MOVIE_ROIS;
  }
}

/**
 * Calculates the exact Delta between a User's split and the Crowd Consensus
 */
export function calculateComparisonDeltas(
  userAllocations: Contributor[],
  communityAllocations: CommunityAllocationItem[]
): ComparisonDelta[] {
  return userAllocations.map((userAlloc) => {
    const cleanName = userAlloc.name.split('(')[0].trim().toLowerCase();
    const match = communityAllocations.find(
      (c) => c.name.toLowerCase().includes(cleanName) || cleanName.includes(c.name.toLowerCase())
    );

    const communityPct = match ? match.avgPercentage : 15.0;
    const diff = Number((userAlloc.percentage - communityPct).toFixed(1));

    let insight = "Aligned with crowd consensus";
    if (diff >= 10) {
      insight = `+${diff}% higher than crowd (You strongly valued ${userAlloc.role})`;
    } else if (diff <= -10) {
      insight = `${diff}% lower than crowd average`;
    }

    return {
      contributorName: userAlloc.name.split('(')[0].trim(),
      role: userAlloc.role,
      userPercentage: userAlloc.percentage,
      communityPercentage: communityPct,
      difference: diff,
      insight
    };
  });
}

/**
 * Calculates comprehensive, detailed crowd consensus stats for a movie:
 * Includes in-movie rankings (Rank #1, #2, #3...) for the single-movie leaderboard.
 */
export function getMovieCommunityStats(
  movieId: number, 
  currentContributors?: Contributor[]
): MovieCommunityStats {
  const submissions = getStoredSubmissions().filter((s) => s.movieId === movieId);
  const liveCount = submissions.length;
  const baseVoters = 1240; // Historical baseline
  const totalVoters = baseVoters + liveCount;

  let avgTicketPrice = 160;
  if (liveCount > 0) {
    const totalSpent = submissions.reduce((sum, s) => sum + s.ticketPrice, 0) + (baseVoters * 160);
    avgTicketPrice = Math.round(totalSpent / totalVoters);
  }

  const allocMap: Record<string, { 
    id: string;
    name: string; 
    role: string; 
    profilePath: string | null; 
    totalPct: number; 
    totalAmt: number; 
    count: number;
  }> = {};

  // Baseline from current contributors if provided
  if (currentContributors && currentContributors.length > 0) {
    currentContributors.forEach((c) => {
      let baselinePct = 12.0;
      if (c.role === 'Director') baselinePct = 34.5;
      else if (c.role === 'Actor') baselinePct = 38.0;
      else if (c.role === 'Music') baselinePct = 16.5;
      else if (c.role === 'Producer') baselinePct = 10.0;
      else if (c.role === 'Audience / Experience') baselinePct = 15.0;

      const key = `${c.name}_${c.role}`;
      allocMap[key] = {
        id: c.id,
        name: c.name.split('(')[0].trim(),
        role: c.role,
        profilePath: c.profilePath,
        totalPct: baselinePct * baseVoters,
        totalAmt: Math.round((baselinePct / 100) * avgTicketPrice) * baseVoters,
        count: baseVoters
      };
    });
  }

  // Blend in actual submissions
  submissions.forEach((sub) => {
    sub.allocations.forEach((alloc) => {
      const key = `${alloc.name}_${alloc.role}`;
      const cleanName = alloc.name.split('(')[0].trim();
      if (!allocMap[key]) {
        allocMap[key] = {
          id: alloc.id,
          name: cleanName,
          role: alloc.role,
          profilePath: alloc.profilePath,
          totalPct: 0,
          totalAmt: 0,
          count: 0
        };
      }
      allocMap[key].totalPct += alloc.percentage;
      allocMap[key].totalAmt += alloc.amount;
      allocMap[key].count += 1;
    });
  });

  const avgAllocations: CommunityAllocationItem[] = Object.values(allocMap)
    .map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      profilePath: item.profilePath,
      avgPercentage: Number((item.totalPct / item.count).toFixed(1)),
      avgAmountRupees: Math.round(item.totalAmt / item.count),
      voterCount: item.count,
      rank: 0
    }))
    .sort((a, b) => b.avgPercentage - a.avgPercentage)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  let dominantVerdict = "Well-Balanced Cinematic Collaboration";
  if (avgAllocations.length > 0) {
    const top = avgAllocations[0];
    if (top.avgPercentage >= 35) {
      dominantVerdict = `${top.role} Heavy Showcase (${top.name} captured ${top.avgPercentage}% of audience valuation)`;
    }
  }

  const audienceCut = avgAllocations.find((a) => a.role.includes('Audience') || a.role.includes('Experience'))?.avgPercentage || 15;
  const valueScore = Number(Math.min(9.8, Math.max(6.5, 7.2 + (audienceCut / 15))).toFixed(1));

  const recentSplits: RecentSplitPreview[] = [
    ...submissions.slice(0, 3).map((s, i) => {
      const topAlloc = [...s.allocations].sort((a, b) => b.amount - a.amount)[0];
      return {
        id: s.id,
        voterLabel: `Moviegoer #${totalVoters - i}`,
        ticketPrice: s.ticketPrice,
        topRecipient: topAlloc?.name.split('(')[0].trim() || 'Cast',
        topPercentage: topAlloc?.percentage || 0,
        verdict: s.verdict,
        timeAgo: 'Just now'
      };
    }),
    {
      id: 'demo-1',
      voterLabel: `Moviegoer #${totalVoters - 4}`,
      ticketPrice: 150,
      topRecipient: avgAllocations[0]?.name || 'Director',
      topPercentage: avgAllocations[0]?.avgPercentage || 38,
      verdict: '🎬 Storytelling and craft carried the show!',
      timeAgo: '2 hrs ago'
    },
    {
      id: 'demo-2',
      voterLabel: `Moviegoer #${totalVoters - 12}`,
      ticketPrice: 200,
      topRecipient: avgAllocations[1]?.name || 'Lead Actor',
      topPercentage: avgAllocations[1]?.avgPercentage || 32,
      verdict: '🌟 Star presence was worth the admission!',
      timeAgo: '5 hrs ago'
    }
  ];

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
      return `🌟 Star-Powered Domination! (${highest.name.split('(')[0].trim()} Carried)`;
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

    // Update Global Multi-Movie Leaderboard Aggregates
    const leaderboard = getStoredLeaderboard();
    submission.allocations.forEach((alloc) => {
      if (alloc.role === 'Audience / Experience' || alloc.role === 'Custom') return;

      const talentRole = (['Director', 'Actor', 'Music', 'Producer'].includes(alloc.role) 
        ? alloc.role 
        : 'Actor') as 'Director' | 'Actor' | 'Music' | 'Producer';
        
      const cleanName = alloc.name.split('(')[0].trim();
      const existingEntry = leaderboard.find((l) => l.name.toLowerCase() === cleanName.toLowerCase());

      if (existingEntry) {
        if (!isUpdate) {
          const newTotal = existingEntry.totalVotes + 1;
          existingEntry.avgPercentage = Number(
            ((existingEntry.avgPercentage * existingEntry.totalVotes + alloc.percentage) / newTotal).toFixed(1)
          );
          existingEntry.avgAmountRupees = Number(
            ((existingEntry.avgAmountRupees * existingEntry.totalVotes + alloc.amount) / newTotal).toFixed(1)
          );
          existingEntry.totalVotes = newTotal;

          // Update multi-movie filmography list
          if (!existingEntry.filmography) existingEntry.filmography = [];
          const filmCredit = existingEntry.filmography.find(
            (f) => f.movieTitle.toLowerCase() === submission.movieTitle.toLowerCase()
          );
          if (filmCredit) {
            filmCredit.voteCount += 1;
            filmCredit.avgPercentage = Number(((filmCredit.avgPercentage + alloc.percentage) / 2).toFixed(1));
          } else {
            existingEntry.filmography.push({
              movieTitle: submission.movieTitle,
              movieId: submission.movieId,
              avgPercentage: alloc.percentage,
              voteCount: 1
            });
            existingEntry.filmsCount = existingEntry.filmography.length;
          }
        }
      } else {
        leaderboard.push({
          id: `talent-${Date.now()}-${Math.random()}`,
          tmdbPersonId: alloc.tmdbId,
          name: cleanName,
          role: talentRole,
          profilePath: alloc.profilePath,
          totalVotes: 1,
          avgPercentage: alloc.percentage,
          avgAmountRupees: alloc.amount,
          topMovieTitle: submission.movieTitle,
          filmsCount: 1,
          filmography: [
            {
              movieTitle: submission.movieTitle,
              movieId: submission.movieId,
              avgPercentage: alloc.percentage,
              voteCount: 1
            }
          ]
        });
      }
    });

    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    return { isUpdate };
  } catch (err) {
    console.error("Failed to save split:", err);
    return { isUpdate: false };
  }
}
