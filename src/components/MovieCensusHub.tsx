'use client';

import React, { useState } from 'react';
import { 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Clock, 
  Ticket,
  Trophy,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  Equal
} from 'lucide-react';
import { MovieCommunityStats, Contributor } from '../types';
import { calculateComparisonDeltas } from '../lib/store';
import { Avatar } from './Avatar';

interface MovieCensusHubProps {
  stats: MovieCommunityStats;
  movieTitle: string;
  userAllocations?: Contributor[];
}

export const MovieCensusHub: React.FC<MovieCensusHubProps> = ({ 
  stats, 
  movieTitle,
  userAllocations 
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'comparison' | 'ballots'>('leaderboard');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const ROLE_COLORS: Record<string, { bg: string; bar: string; text: string }> = {
    'Director': { bg: 'bg-amber-500/10', bar: 'bg-amber-400', text: 'text-amber-400' },
    'Actor': { bg: 'bg-rose-500/10', bar: 'bg-rose-400', text: 'text-rose-400' },
    'Music': { bg: 'bg-cyan-500/10', bar: 'bg-cyan-400', text: 'text-cyan-400' },
    'Producer': { bg: 'bg-purple-500/10', bar: 'bg-purple-400', text: 'text-purple-400' },
    'Audience / Experience': { bg: 'bg-emerald-500/10', bar: 'bg-emerald-400', text: 'text-emerald-400' }
  };

  const getColor = (role: string) => {
    return ROLE_COLORS[role] || { bg: 'bg-zinc-800', bar: 'bg-amber-500', text: 'text-zinc-300' };
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-base font-black">🥇</span>;
      case 2:
        return <span className="text-base font-black">🥈</span>;
      case 3:
        return <span className="text-base font-black">🥉</span>;
      default:
        return <span className="text-xs font-bold text-zinc-500">#{rank}</span>;
    }
  };

  const userHasAllocated = userAllocations && userAllocations.some((c) => c.amount > 0);
  const comparisonDeltas = userHasAllocated 
    ? calculateComparisonDeltas(userAllocations!, stats.avgAllocations)
    : [];

  return (
    <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4">
      {/* 1. Header with Audience Census Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white tracking-tight">
                {movieTitle} Census & Leaderboard
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                FILM LEADERBOARD
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Audience consensus across <strong>{stats.totalVoters.toLocaleString()}</strong> verified ticket splits
            </p>
          </div>
        </div>

        {/* Highlight Score Badges */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">VALUE RATING</span>
            <div className="flex items-center justify-center gap-1 text-sm font-black text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{stats.valueScore} / 10</span>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">AVG TICKET</span>
            <div className="text-sm font-black text-white">
              ₹{stats.avgTicketPrice}
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title={isExpanded ? "Collapse census" : "Expand census"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Dominant Crowd Verdict Banner */}
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-amber-500/5 border border-amber-500/20 text-xs text-amber-200">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold">{stats.dominantVerdict}</span>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          {/* 3. Sub-Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold max-w-md">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Film Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg transition-all ${
                activeTab === 'comparison'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>You vs Crowd</span>
              {userHasAllocated && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('ballots')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg transition-all ${
                activeTab === 'ballots'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Recent Ballots</span>
            </button>
          </div>

          {/* TAB A: IN-MOVIE LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              {/* Multi-Segment Master Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  <span>Audience Ticket Share (100%)</span>
                  <span>Crowd Consensus</span>
                </div>
                <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden flex shadow-inner p-0.5 gap-0.5">
                  {stats.avgAllocations.map((item, idx) => {
                    const color = getColor(item.role);
                    return (
                      <div
                        key={`bar-${item.name}-${idx}`}
                        style={{ width: `${Math.max(4, item.avgPercentage)}%` }}
                        className={`${color.bar} h-full rounded-sm transition-all hover:opacity-90`}
                        title={`#${item.rank} ${item.name} (${item.role}): ${item.avgPercentage}%`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Single-Movie Leaderboard Ranked Cards */}
              <div className="grid grid-cols-1 gap-2.5">
                {stats.avgAllocations.map((item) => {
                  const color = getColor(item.role);
                  return (
                    <div
                      key={`item-${item.name}-${item.role}`}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        item.rank === 1
                          ? 'bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                          : 'bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-6 text-center shrink-0">
                            {getRankBadge(item.rank)}
                          </div>
                          <Avatar
                            src={item.profilePath}
                            alt={item.name}
                            role={item.role}
                            className="w-10 h-10"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                              {item.rank === 1 && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase">
                                  #1 Value Driver
                                </span>
                              )}
                            </div>
                            <span className={`text-[11px] font-semibold ${color.text}`}>
                              {item.role}
                            </span>
                          </div>
                        </div>

                        {/* Cut & Rupee stats */}
                        <div className="text-right shrink-0">
                          <div className="font-black text-base text-amber-400">
                            {item.avgPercentage}%
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            ~₹{item.avgAmountRupees} / ticket
                          </div>
                        </div>
                      </div>

                      {/* Visual Fill Bar */}
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`${color.bar} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(100, item.avgPercentage * 2.2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB B: YOU VS. CROWD COMPARISON */}
          {activeTab === 'comparison' && (
            <div className="space-y-3">
              {!userHasAllocated ? (
                <div className="p-8 text-center bg-zinc-950/60 rounded-2xl border border-zinc-800 space-y-2">
                  <Scale className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
                  <h4 className="font-bold text-sm text-white">No Split Entered Yet</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Adjust the sliders below for this movie, and we will instantly compare your valuation with the <strong>{stats.totalVoters.toLocaleString()}</strong> community moviegoers!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs text-zinc-400 px-1">
                    <span>Contributor</span>
                    <div className="flex gap-6 font-semibold">
                      <span className="text-amber-400">You</span>
                      <span className="text-zinc-400">Crowd</span>
                      <span className="w-14 text-right">Delta</span>
                    </div>
                  </div>

                  {comparisonDeltas.map((delta) => {
                    const isHigher = delta.difference > 0;
                    const isZero = delta.difference === 0;

                    return (
                      <div
                        key={`delta-${delta.contributorName}`}
                        className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{delta.contributorName}</p>
                          <p className="text-[10px] text-zinc-400">{delta.insight}</p>
                        </div>

                        <div className="flex items-center gap-6 shrink-0 font-mono">
                          <span className="font-bold text-amber-400">{delta.userPercentage}%</span>
                          <span className="text-zinc-400">{delta.communityPercentage}%</span>
                          <span className={`w-14 text-right font-black flex items-center justify-end gap-0.5 ${
                            isHigher ? 'text-emerald-400' : isZero ? 'text-zinc-400' : 'text-rose-400'
                          }`}>
                            {isHigher ? <ArrowUpRight className="w-3.5 h-3.5" /> : isZero ? <Equal className="w-3 h-3" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            {isHigher ? `+${delta.difference}%` : `${delta.difference}%`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB C: RECENT COMMUNITY BALLOTS */}
          {activeTab === 'ballots' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stats.recentSplits.map((split) => (
                <div
                  key={split.id}
                  className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                    <span className="flex items-center gap-1 font-semibold text-zinc-200">
                      <Ticket className="w-3.5 h-3.5 text-amber-400" />
                      {split.voterLabel} (₹{split.ticketPrice})
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500 text-[10px]">
                      <Clock className="w-3 h-3" />
                      {split.timeAgo}
                    </span>
                  </div>
                  <p className="text-zinc-300">
                    Gave top cut to: <strong className="text-amber-400">{split.topRecipient}</strong> ({split.topPercentage}%)
                  </p>
                  <p className="text-[11px] text-rose-300/90 italic truncate font-mono">
                    &ldquo;{split.verdict}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
