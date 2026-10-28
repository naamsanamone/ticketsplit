'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Music, 
  Clapperboard, 
  User, 
  Flame, 
  Users, 
  Film,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LeaderboardEntry, MovieROIEntry } from '../types';
import { getStoredLeaderboard, getStoredMovieROIs } from '../lib/store';
import { Avatar } from './Avatar';

export const LeaderboardView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'Director' | 'Actor' | 'Music' | 'Movies'>('Director');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [movieROIs, setMovieROIs] = useState<MovieROIEntry[]>([]);
  const [expandedTalentId, setExpandedTalentId] = useState<string | null>(null);

  useEffect(() => {
    setLeaderboard(getStoredLeaderboard());
    setMovieROIs(getStoredMovieROIs());
  }, []);

  const filteredTalent = leaderboard
    .filter((entry) => entry.role === activeCategory)
    .sort((a, b) => b.avgPercentage - a.avgPercentage);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-400 text-zinc-950 font-black flex items-center justify-center text-sm shadow-lg shadow-amber-400/40">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-300 text-zinc-950 font-black flex items-center justify-center text-sm shadow-md">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black flex items-center justify-center text-sm shadow-md">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 font-bold flex items-center justify-center text-xs">
            #{rank}
          </div>
        );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTalentId(expandedTalentId === id ? null : id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Global Leaderboard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>GLOBAL MULTI-MOVIE VALUATION LEADERBOARD</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">Cinema Stock & Talent Index</h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          Aggregated cuts across multiple films and thousands of verified ticket ballots. Who consistently captures the highest audience valuation?
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-1 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md mx-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveCategory('Director')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
            activeCategory === 'Director'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Clapperboard className="w-4 h-4" />
          <span>Directors</span>
        </button>

        <button
          onClick={() => setActiveCategory('Actor')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
            activeCategory === 'Actor'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Actors</span>
        </button>

        <button
          onClick={() => setActiveCategory('Music')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
            activeCategory === 'Music'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Music</span>
        </button>

        <button
          onClick={() => setActiveCategory('Movies')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
            activeCategory === 'Movies'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Movie ROI</span>
        </button>
      </div>

      {/* Talent Rankings View */}
      {activeCategory !== 'Movies' ? (
        <div className="space-y-4">
          {/* Top 3 Podium Cards - Mobile Responsive */}
          {filteredTalent.length >= 3 && (
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 pt-3 sm:pt-6 pb-2 items-end">
              {/* 2nd Place */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl sm:rounded-3xl p-2 sm:p-4 text-center space-y-1.5 sm:space-y-2 flex flex-col items-center">
                <div className="text-base sm:text-xl">🥈</div>
                <Avatar
                  src={filteredTalent[1].profilePath}
                  alt={filteredTalent[1].name}
                  role={filteredTalent[1].role}
                  className="w-10 h-10 sm:w-14 sm:h-14"
                />
                <div className="w-full">
                  <h4 className="font-bold text-[11px] sm:text-sm text-white truncate">
                    {filteredTalent[1].name}
                  </h4>
                  <p className="text-[9px] sm:text-[11px] text-zinc-400 truncate">
                    {filteredTalent[1].filmsCount || 1} Films
                  </p>
                </div>
                <div className="bg-zinc-800 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-300">
                  {filteredTalent[1].avgPercentage}% Cut
                </div>
              </div>

              {/* 1st Place */}
              <div className="bg-gradient-to-b from-amber-500/20 to-zinc-900 border-2 border-amber-500/50 rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 text-center space-y-1.5 sm:space-y-2 flex flex-col items-center shadow-xl shadow-amber-500/10 -translate-y-2 sm:-translate-y-3">
                <div className="text-lg sm:text-2xl animate-bounce">👑</div>
                <Avatar
                  src={filteredTalent[0].profilePath}
                  alt={filteredTalent[0].name}
                  role={filteredTalent[0].role}
                  className="w-13 h-13 sm:w-18 sm:h-18 border-2 border-amber-400"
                />
                <div className="w-full">
                  <h4 className="font-black text-xs sm:text-base text-amber-300 truncate">
                    {filteredTalent[0].name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-zinc-400 truncate">
                    {filteredTalent[0].filmsCount || 1} Films
                  </p>
                </div>
                <div className="bg-amber-500 text-zinc-950 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black shadow">
                  {filteredTalent[0].avgPercentage}% Cut
                </div>
                <span className="text-[9px] sm:text-[10px] text-amber-400 font-semibold hidden sm:inline">
                  Avg: ₹{filteredTalent[0].avgAmountRupees} / ticket
                </span>
              </div>

              {/* 3rd Place */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl sm:rounded-3xl p-2 sm:p-4 text-center space-y-1.5 sm:space-y-2 flex flex-col items-center">
                <div className="text-base sm:text-xl">🥉</div>
                <Avatar
                  src={filteredTalent[2].profilePath}
                  alt={filteredTalent[2].name}
                  role={filteredTalent[2].role}
                  className="w-10 h-10 sm:w-14 sm:h-14"
                />
                <div className="w-full">
                  <h4 className="font-bold text-[11px] sm:text-sm text-white truncate">
                    {filteredTalent[2].name}
                  </h4>
                  <p className="text-[9px] sm:text-[11px] text-zinc-400 truncate">
                    {filteredTalent[2].filmsCount || 1} Films
                  </p>
                </div>
                <div className="bg-zinc-800 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-amber-500">
                  {filteredTalent[2].avgPercentage}% Cut
                </div>
              </div>
            </div>
          )}

          {/* Detailed Full List with Multi-Movie Filmography Expanders */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden divide-y divide-zinc-800/80 shadow-xl">
            {filteredTalent.map((entry, index) => {
              const isExpanded = expandedTalentId === entry.id;

              return (
                <div key={entry.id} className="transition-colors">
                  <div
                    onClick={() => toggleExpand(entry.id)}
                    className="flex items-center justify-between p-4 hover:bg-zinc-800/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {getRankBadge(index + 1)}
                      <Avatar
                        src={entry.profilePath}
                        alt={entry.name}
                        role={entry.role}
                        className="w-11 h-11"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white truncate">{entry.name}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-semibold border border-zinc-700">
                            {entry.filmsCount || 1} {entry.filmsCount === 1 ? 'Film' : 'Films'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span>Top Film: <strong className="text-zinc-300">{entry.topMovieTitle}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-zinc-500" />
                            {entry.totalVotes.toLocaleString()} votes
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-black text-amber-400 text-base">
                          {entry.avgPercentage}%
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          ~₹{entry.avgAmountRupees} cut
                        </div>
                      </div>

                      <div className="text-zinc-500">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Multi-Movie Filmography Drawer */}
                  {isExpanded && entry.filmography && entry.filmography.length > 0 && (
                    <div className="px-5 pb-4 pt-1 bg-zinc-950/60 border-t border-zinc-800/50 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        Filmography Ticket Valuation Breakdown:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {entry.filmography.map((film, fIdx) => (
                          <div
                            key={`film-${film.movieTitle}-${fIdx}`}
                            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs flex justify-between items-center"
                          >
                            <span className="font-semibold text-zinc-200 truncate pr-2">
                              {film.movieTitle}
                            </span>
                            <div className="text-right shrink-0">
                              <span className="font-black text-amber-400">{film.avgPercentage}%</span>
                              <span className="text-[10px] text-zinc-500 block">{film.voteCount.toLocaleString()} votes</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Multi-Movie "Worth-It" ROI Rankings */
        <div className="space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden divide-y divide-zinc-800/80 shadow-xl">
            {movieROIs.map((movie, index) => (
              <div
                key={movie.movieId}
                className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {getRankBadge(index + 1)}
                  <Avatar
                    src={movie.posterPath}
                    alt={movie.title}
                    className="w-11 h-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white truncate">{movie.title}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        ★ {movie.valueScore || 8.5}/10 ROI
                      </span>
                    </div>
                    <p className="text-xs text-rose-300 font-medium mt-0.5">{movie.dominantRole}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {movie.totalVotes.toLocaleString()} verified community splits
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                    AUDIENCE SATISFACTION
                  </span>
                  <div className="font-black text-emerald-400 text-lg">
                    {movie.avgAudienceSatisfaction}%
                  </div>
                  <span className="text-[11px] text-zinc-400">Pure Entertainment</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
