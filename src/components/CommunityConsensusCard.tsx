'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Clock, 
  Ticket,
  TrendingUp
} from 'lucide-react';
import { MovieCommunityStats } from '../types';
import { Avatar } from './Avatar';

interface CommunityConsensusCardProps {
  stats: MovieCommunityStats;
  movieTitle: string;
}

export const CommunityConsensusCard: React.FC<CommunityConsensusCardProps> = ({ stats, movieTitle }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Palette for progress bars
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

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4">
      {/* 1. Header Bar with Score & High-level Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white tracking-tight">
                Crowd Ticket Consensus
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                VERIFIED CROWD
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Based on <strong>{stats.totalVoters.toLocaleString()}</strong> ticket splits for <em>{movieTitle}</em>
            </p>
          </div>
        </div>

        {/* Highlight Score Badges */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">VALUE RATING</span>
            <div className="flex items-center justify-center gap-1 text-sm font-black text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{stats.valueScore} / 10</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">AVG TICKET</span>
            <div className="text-sm font-black text-white">
              ₹{stats.avgTicketPrice}
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title={isExpanded ? "Collapse breakdown" : "Expand breakdown"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Dominant Crowd Verdict Pill */}
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold">{stats.dominantVerdict}</span>
      </div>

      {isExpanded && (
        <div className="space-y-5 pt-1">
          {/* 3. Multi-Segment Visual Master Split Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <span>Audience Ticket Distribution (100%)</span>
              <span>Crowd Average</span>
            </div>
            <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden flex shadow-inner p-0.5 gap-0.5">
              {stats.avgAllocations.map((item, idx) => {
                const color = getColor(item.role);
                return (
                  <div
                    key={`bar-${item.name}-${idx}`}
                    style={{ width: `${Math.max(4, item.avgPercentage)}%` }}
                    className={`${color.bar} h-full rounded-sm transition-all hover:opacity-90`}
                    title={`${item.name} (${item.role}): ${item.avgPercentage}%`}
                  />
                );
              })}
            </div>
          </div>

          {/* 4. Detailed Breakdown Per Contributor with Progress Bars */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Itemized Crowd Valuations:
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {stats.avgAllocations.map((item) => {
                const color = getColor(item.role);
                return (
                  <div
                    key={`${item.name}-${item.role}`}
                    className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar
                          src={item.profilePath}
                          alt={item.name}
                          role={item.role}
                          className="w-8 h-8"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-white truncate">
                            {item.name}
                          </p>
                          <span className={`text-[10px] font-semibold ${color.text}`}>
                            {item.role}
                          </span>
                        </div>
                      </div>

                      {/* Cut & Rupee stats */}
                      <div className="text-right shrink-0">
                        <div className="font-black text-sm text-amber-400">
                          {item.avgPercentage}% Cut
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          ~₹{item.avgAmountRupees} / ticket
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
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

          {/* 5. Live Recent Audience Split Feeds */}
          {stats.recentSplits && stats.recentSplits.length > 0 && (
            <div className="pt-2 border-t border-zinc-800/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Recent Community Ballots:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stats.recentSplits.map((split) => (
                  <div
                    key={split.id}
                    className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/70 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                      <span className="flex items-center gap-1 font-semibold text-zinc-300">
                        <Ticket className="w-3 h-3 text-amber-400" />
                        {split.voterLabel} (₹{split.ticketPrice})
                      </span>
                      <span className="flex items-center gap-1 text-zinc-500 text-[10px]">
                        <Clock className="w-3 h-3" />
                        {split.timeAgo}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 truncate">
                      Gave top cut to: <strong className="text-amber-400">{split.topRecipient}</strong> ({split.topPercentage}%)
                    </p>
                    <p className="text-[10px] text-rose-300/80 italic truncate font-mono">
                      &ldquo;{split.verdict}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
