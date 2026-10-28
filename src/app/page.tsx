'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { TicketSplitter } from '@/components/TicketSplitter';
import { MovieCensusHub } from '@/components/MovieCensusHub';
import { ReceiptCard } from '@/components/ReceiptCard';
import { LeaderboardView } from '@/components/LeaderboardView';
import { MyReceiptsView } from '@/components/MyReceiptsView';
import { AuthModal } from '@/components/AuthModal';
import { Movie, TicketSplitSubmission } from '@/types';
import { MOCK_MOVIES } from '@/lib/mockData';
import { getMovieCommunityStats } from '@/lib/store';
import { getStoredVoter, logoutVoter, VoterProfile } from '@/lib/auth';
import { Sparkles, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'split' | 'census' | 'leaderboard' | 'receipts'>('split');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(MOCK_MOVIES[872585].movie); // Default to Oppenheimer
  const [completedSubmission, setCompletedSubmission] = useState<TicketSplitSubmission | null>(null);
  const [censusKey, setCensusKey] = useState<number>(0);
  const [voter, setVoter] = useState<VoterProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    setVoter(getStoredVoter());
  }, []);

  const handleLogout = () => {
    logoutVoter();
    setVoter(null);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setCompletedSubmission(null);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Sticky Header with Voter Pass */}
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        voter={voter}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Zero-Cost Voter Verification Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onVerified={(verifiedVoter) => {
          setVoter(verifiedVoter);
          setShowAuthModal(false);
        }}
        actionReason={selectedMovie ? `to cast your ballot for ${selectedMovie.title}` : undefined}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* TAB 1: VALUATE & SPLIT (Clean, Direct Home View) */}
        {activeTab === 'split' && (
          <div className="space-y-8">
            {/* Hero Header */}
            {!completedSubmission && (
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CROWDSOURCED CINEMA VALUATION</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  Split The Ticket.
                  <span className="block bg-gradient-to-r from-amber-400 via-rose-400 to-amber-200 bg-clip-text text-transparent">
                    Rate The Real Value.
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  If your ticket cost ₹150, how much went to the <strong>Director</strong>, 
                  the <strong>Hero</strong>, the <strong>BGM Composer</strong>, or <strong>Your Own Popcorn</strong>?
                </p>
              </div>
            )}

            {/* Search Input */}
            {!completedSubmission && (
              <SearchBar 
                onSelectMovie={handleMovieSelect} 
                selectedMovie={selectedMovie} 
              />
            )}

            {/* Interactive Area: Splitter OR Receipt */}
            {completedSubmission ? (
              <div className="pt-2">
                <ReceiptCard 
                  submission={completedSubmission} 
                  onReset={() => setCompletedSubmission(null)} 
                />
              </div>
            ) : selectedMovie ? (
              <TicketSplitter 
                key={selectedMovie.id} 
                movie={selectedMovie} 
                onSplitCompleted={(sub) => setCompletedSubmission(sub)} 
                onViewCensus={() => setActiveTab('census')}
                onRequireAuth={() => setShowAuthModal(true)}
              />
            ) : (
              /* Fallback Movie Grid if no movie selected */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                {Object.values(MOCK_MOVIES).map((item) => (
                  <div
                    key={item.movie.id}
                    onClick={() => handleMovieSelect(item.movie)}
                    className="group bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-3 cursor-pointer transition-all hover:scale-[1.02] shadow-xl"
                  >
                    <img
                      src={item.movie.poster_path || ''}
                      alt={item.movie.title}
                      className="w-full aspect-[2/3] object-cover rounded-xl mb-2"
                    />
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-amber-400">
                      {item.movie.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Click to Split Ticket →</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FILM CENSUS (Dedicated Tab for Single-Movie Audience Census & In-Movie Leaderboard) */}
        {activeTab === 'census' && (
          <div className="space-y-6 pt-2">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>FILM AUDIENCE CENSUS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Crowd Ticket Consensus Hub</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Inspect crowdsourced ticket allocations, Value-for-Money ratings, and the in-movie leaderboard for any film.
              </p>
            </div>

            {/* Movie Switcher */}
            <SearchBar 
              onSelectMovie={handleMovieSelect} 
              selectedMovie={selectedMovie} 
            />

            {/* Dedicated Film Census Hub */}
            {selectedMovie && (
              <div className="pt-2">
                <MovieCensusHub 
                  key={`${selectedMovie.id}-${censusKey}`}
                  stats={getMovieCommunityStats(selectedMovie.id)} 
                  movieTitle={selectedMovie.title} 
                  userAllocations={completedSubmission?.movieId === selectedMovie.id ? completedSubmission.allocations : undefined} 
                  onRefresh={() => setCensusKey((k) => k + 1)}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GLOBAL MULTI-MOVIE LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="pt-2">
            <LeaderboardView />
          </div>
        )}

        {/* TAB 4: MY RECEIPTS */}
        {activeTab === 'receipts' && (
          <div className="pt-2">
            <MyReceiptsView onStartValuating={() => setActiveTab('split')} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <p>
          Powered by <strong>TMDB API</strong> • TicketSplit Audience Valuation Engine
        </p>
      </footer>
    </main>
  );
}
