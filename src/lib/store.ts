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
    updateGlobalLeaderboard(submission, isUpdate);

    return { isUpdate };
  } catch (err) {
    console.error("Failed to save split:", err);
    return { isUpdate: false };
  }
}

/**
 * Updates Global Multi-Movie Leaderboard
 */
function updateGlobalLeaderboard(submission: TicketSplitSubmission, isUpdate: boolean) {
  const leaderboard = getStoredLeaderboard();
  
  submission.allocations.forEach((alloc) => {
    if (alloc.role === 'Audience / Experience' || alloc.role === 'Custom') return;

    const talentRole = (['Director', 'Actor', 'Music', 'Producer'].includes(alloc.role) 
      ? alloc.role 
      : 'Actor') as 'Director' | 'Actor' | 'Music' | 'Producer';
      
    const cleanName = normalizeName(alloc.name);
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
  newSubmissions.forEach((sub) => {
    updateGlobalLeaderboard(sub, false);
  });
}

/**
 * Resets all votes for a specific movie
 */
export function resetMovieBallots(movieId: number): void {
  if (typeof window === 'undefined') return;
  const remaining = getStoredSubmissions().filter((s) => s.movieId !== movieId);
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(remaining));
}
