'use client';

import React from 'react';
import { Ticket, Trophy, Sparkles, Film } from 'lucide-react';

interface HeaderProps {
  activeTab: 'split' | 'leaderboard' | 'receipts';
  onTabChange: (tab: 'split' | 'leaderboard' | 'receipts') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Logo */}
        <div 
          onClick={() => onTabChange('split')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Ticket className="w-5 h-5 text-amber-400 -rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-400 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                TicketSplit
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                TMDB
              </span>
            </div>
            <p className="text-xs text-zinc-400">Who really earned your ticket money?</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 text-sm">
          <button
            onClick={() => onTabChange('split')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'split'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Valuate Movie</span>
          </button>

          <button
            onClick={() => onTabChange('leaderboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => onTabChange('receipts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'receipts'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>My Receipts</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
