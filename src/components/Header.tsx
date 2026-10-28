'use client';

import React from 'react';
import { Ticket, Trophy, Sparkles, Film, BarChart3, ShieldCheck } from 'lucide-react';
import { VoterProfile } from '../lib/auth';

interface HeaderProps {
  activeTab: 'split' | 'census' | 'leaderboard' | 'receipts';
  onTabChange: (tab: 'split' | 'census' | 'leaderboard' | 'receipts') => void;
  voter?: VoterProfile | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange,
  voter,
  onOpenAuth,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-zinc-950/85 border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand Logo & Voter Pass Badge */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div 
            onClick={() => onTabChange('split')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 -rotate-12 group-hover:rotate-0 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-400 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                  TicketSplit
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  TMDB
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 hidden sm:block">Who really earned your ticket money?</p>
            </div>
          </div>

          {/* Voter Verification Badge on Mobile */}
          <div className="sm:hidden">
            {voter && voter.isVerified ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900 border border-emerald-500/40 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-zinc-200 truncate max-w-[90px]">{voter.displayName}</span>
                <button onClick={onLogout} className="text-zinc-500 hover:text-rose-400 ml-1">✕</button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold"
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Verify</span>
              </button>
            )}
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="w-full sm:w-auto flex items-center justify-center gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs sm:text-sm">
          <button
            onClick={() => onTabChange('split')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'split'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/20 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Valuate</span>
          </button>

          <button
            onClick={() => onTabChange('census')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'census'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/20 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Film Census</span>
          </button>

          <button
            onClick={() => onTabChange('leaderboard')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/20 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => onTabChange('receipts')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'receipts'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/20 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Receipts</span>
          </button>
        </nav>

        {/* Right: Desktop Voter Verification Badge */}
        <div className="hidden sm:flex items-center gap-2">
          {voter && voter.isVerified ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-emerald-500/40 text-xs shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-zinc-200">{voter.displayName}</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-wider uppercase">
                VERIFIED
              </span>
              <button
                onClick={onLogout}
                className="text-zinc-500 hover:text-rose-400 ml-1 text-[11px] transition-colors"
                title="Sign out of voter pass"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 hover:from-amber-500/20 hover:to-rose-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify Voter Pass</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
