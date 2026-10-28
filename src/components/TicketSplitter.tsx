'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Scale, 
  Trash2, 
  Plus, 
  Film, 
  Info, 
  Sliders, 
  X,
  ShieldCheck
} from 'lucide-react';
import { Movie, Contributor, TicketSplitSubmission, CastMember, CrewMember } from '../types';
import { buildInitialContributors } from '../lib/tmdb';
import { 
  generateVerdict, 
  saveTicketSplit, 
  getUserKey, 
  getUserSubmissionForMovie 
} from '../lib/store';
import { isVoterVerified } from '../lib/auth';
import { Avatar } from './Avatar';

interface TicketSplitterProps {
  movie: Movie;
  onSplitCompleted: (submission: TicketSplitSubmission) => void;
  onViewCensus?: () => void;
  onRequireAuth?: (onSuccess?: () => void) => void;
}

const PRESET_PRICES = [100, 150, 200, 300, 500];

export const TicketSplitter: React.FC<TicketSplitterProps> = ({ 
  movie, 
  onSplitCompleted,
  onViewCensus,
  onRequireAuth
}) => {
  const [ticketPrice, setTicketPrice] = useState<number>(150);
  const [customPriceInput, setCustomPriceInput] = useState<string>('150');
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [availableCast, setAvailableCast] = useState<CastMember[]>([]);
  const [availableCrew, setAvailableCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Community & user validation state
  const [existingUserSubmission, setExistingUserSubmission] = useState<TicketSplitSubmission | null>(null);

  // Modals / Drawers for adding people
  const [showAddCreditModal, setShowAddCreditModal] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customRole, setCustomRole] = useState<string>('Custom');

  // Load movie data, full cast & crew from API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/movie/${movie.id}`);
        const data = await res.json();
        if (data.success && isMounted) {
          // Initialize with 0 values so user enters manually from scratch!
          const initial = buildInitialContributors(data.data);
          setContributors(initial);
          setAvailableCast(data.data.cast || []);
          setAvailableCrew(data.data.crew || []);

          // Check if this user already split a ticket for this movie
          const prevSub = getUserSubmissionForMovie(movie.id);
          setExistingUserSubmission(prevSub);
        }
      } catch (err) {
        console.error("Error loading movie:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [movie.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Preset Price Selection
  const handlePresetSelect = (price: number) => {
    setTicketPrice(price);
    setCustomPriceInput(String(price));
    // Clear all contributor values to 0 for a clean manual slate
    setContributors((prev) =>
      prev.map((c) => ({
        ...c,
        amount: 0,
        percentage: 0
      }))
    );
  };

  // Handle typing custom price
  const handleCustomPriceChange = (val: string) => {
    setCustomPriceInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setTicketPrice(num);
      // Recalculate percentage based on current amounts
      setContributors((prev) =>
        prev.map((c) => ({
          ...c,
          percentage: Number(((c.amount / num) * 100).toFixed(1))
        }))
      );
    }
  };

  // Update specific contributor amount
  const handleAmountChange = (id: string, newAmount: number) => {
    const safeAmount = Math.max(0, newAmount);
    setContributors((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            amount: safeAmount,
            percentage: ticketPrice > 0 ? Number(((safeAmount / ticketPrice) * 100).toFixed(1)) : 0
          };
        }
        return c;
      })
    );
  };

  // Remove a contributor row
  const handleRemoveContributor = (id: string) => {
    setContributors((prev) => prev.filter((c) => c.id !== id));
  };

  // Add a person from TMDB Cast or Crew
  const handleAddFromCredits = (person: CastMember | CrewMember, roleType: string) => {
    const uniqueId = `credit-${person.id}-${roleType.toLowerCase()}`;
    if (contributors.some((c) => c.id === uniqueId)) {
      setShowAddCreditModal(false);
      return;
    }

    const newContributor: Contributor = {
      id: uniqueId,
      tmdbId: person.id,
      name: 'character' in person ? `${person.name} (${person.character})` : person.name,
      role: roleType,
      profilePath: person.profile_path,
      amount: 0,
      percentage: 0,
      canRemove: true
    };

    setContributors((prev) => [...prev, newContributor]);
    setShowAddCreditModal(false);
  };

  // Add Custom Box for User's choice (e.g. VFX, Stunt, Samosa)
  const handleAddCustomBox = () => {
    if (!customName.trim()) return;
    const newContributor: Contributor = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      role: customRole || 'Custom',
      profilePath: null,
      amount: 0,
      percentage: 0,
      isCustom: true,
      canRemove: true
    };

    setContributors((prev) => [...prev, newContributor]);
    setCustomName('');
    setShowCustomModal(false);
  };

  // Math summary
  const totalAllocated = contributors.reduce((sum, c) => sum + c.amount, 0);
  const balance = ticketPrice - totalAllocated;
  const isPerfect = balance === 0;
  const isOver = balance < 0;

  // Optional: Auto-fill remaining funds evenly if user wants
  const handleAutoBalance = () => {
    if (contributors.length === 0 || ticketPrice <= 0) return;
    const base = Math.floor(ticketPrice / contributors.length);
    const rem = ticketPrice - base * contributors.length;

    setContributors((prev) =>
      prev.map((c, i) => {
        const amt = base + (i === 0 ? rem : 0);
        return {
          ...c,
          amount: amt,
          percentage: Number(((amt / ticketPrice) * 100).toFixed(1))
        };
      })
    );
  };

  // Reset all to 0
  const handleResetToZero = () => {
    setContributors((prev) =>
      prev.map((c) => ({
        ...c,
        amount: 0,
        percentage: 0
      }))
    );
  };

  const executeSubmit = () => {
    const verdict = generateVerdict(contributors);
    const userKey = getUserKey();

    const submission: TicketSplitSubmission = {
      id: existingUserSubmission ? existingUserSubmission.id : `split-${Date.now()}`,
      userKey,
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster_path,
      ticketPrice,
      currency: 'INR',
      allocations: contributors,
      verdict,
      createdAt: existingUserSubmission ? existingUserSubmission.createdAt : new Date().toISOString()
    };

    saveTicketSplit(submission);
    onSplitCompleted(submission);
  };

  // Submit split validating 1-user-1-ticket
  const handleSubmit = () => {
    if (!isPerfect) return;

    if (!isVoterVerified()) {
      if (onRequireAuth) {
        onRequireAuth(() => executeSubmit());
        return;
      }
    }

    executeSubmit();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-400">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Fetching full cast & crew for {movie.title}...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* 1. Voter Validation Notice (1-User-1-Ticket) */}
      {existingUserSubmission && (
        <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-blue-200">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>You previously valued this film:</strong> Submitting will update your community vote to prevent duplicate ratings.
          </span>
        </div>
      )}

      {/* 2. Movie Header & Ticket Price Input */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
        {movie.poster_path ? (
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="w-20 h-28 sm:w-24 sm:h-36 object-cover rounded-xl sm:rounded-2xl shadow-lg shrink-0 border border-zinc-700/50"
          />
        ) : (
          <div className="w-20 h-28 sm:w-24 sm:h-36 bg-zinc-800 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
            <Film className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-600" />
          </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap mb-1">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] sm:text-[11px] font-semibold border border-amber-500/20">
              VALUATE TICKET
            </div>
            {onViewCensus && (
              <button
                onClick={onViewCensus}
                className="text-[10px] sm:text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold transition-colors"
              >
                View Film Census & Leaderboard →
              </button>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{movie.title}</h2>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-1 line-clamp-2">{movie.overview}</p>

          {/* Ticket Price Selection - Custom Manual Input */}
          <div className="mt-3 sm:mt-4 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <span className="text-xs text-zinc-400 font-semibold mr-1">Ticket Price:</span>
              {PRESET_PRICES.map((price) => (
                <button
                  key={price}
                  onClick={() => handlePresetSelect(price)}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    ticketPrice === price && customPriceInput === String(price)
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  ₹{price}
                </button>
              ))}

              {/* Custom Editable Price Box */}
              <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 sm:px-3 py-1 rounded-xl border border-zinc-700 focus-within:border-amber-500 transition-colors">
                <span className="text-xs text-amber-400 font-bold">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customPriceInput}
                  onChange={(e) => handleCustomPriceChange(e.target.value)}
                  placeholder="Custom"
                  className="w-14 sm:w-16 bg-transparent text-xs font-bold text-white focus:outline-none placeholder-zinc-500"
                />
              </div>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500">
              *All slider values start at <strong>₹0</strong>. Move sliders or type amounts manually.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Real-time Balance Status Bar */}
      <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
        isPerfect 
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
          : isOver 
          ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' 
          : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 text-center sm:text-left">
            {isPerfect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
            )}
            <div>
              <p className="font-bold text-xs sm:text-sm">
                {isPerfect
                  ? '✨ Ticket Value 100% Balanced!'
                  : isOver
                  ? `Overallocated by ₹${Math.abs(balance)}`
                  : `₹${balance} remaining to allocate`}
              </p>
              <p className="text-[10px] sm:text-[11px] opacity-80">
                Allocated: ₹{totalAllocated} of ₹{ticketPrice}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={handleAutoBalance}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
              title="Automatically distribute remaining rupees evenly"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Fill Remaining</span>
            </button>

            <button
              onClick={handleResetToZero}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors shrink-0"
            >
              Clear 0
            </button>
          </div>
        </div>
      </div>

      {/* 5. Contributor Sliders List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-400" />
            Cast & Crew Valuations (₹{ticketPrice}):
          </h3>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Button to add from movie cast & crew */}
            <button
              onClick={() => setShowAddCreditModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add From Cast/Crew</span>
            </button>

            {/* Button to add user custom box */}
            <button
              onClick={() => setShowCustomModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-zinc-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Box</span>
            </button>
          </div>
        </div>

        {contributors.map((c) => (
          <div
            key={c.id}
            className={`p-4 rounded-2xl border transition-all ${
              c.isCustom
                ? 'bg-gradient-to-r from-emerald-950/30 to-zinc-900 border-emerald-500/30'
                : 'bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  src={c.profilePath}
                  alt={c.name}
                  role={c.role}
                  className="w-10 h-10"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-zinc-100 truncate">{c.name}</h4>
                    {c.canRemove && (
                      <button
                        onClick={() => handleRemoveContributor(c.id)}
                        className="text-zinc-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                        title="Remove from split"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] text-zinc-300 border border-zinc-700">
                      {c.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount & Percentage */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end font-mono">
                  <span className="text-xs text-zinc-500">₹</span>
                  <input
                    type="number"
                    min="0"
                    max={ticketPrice}
                    value={c.amount}
                    onChange={(e) => handleAmountChange(c.id, Number(e.target.value))}
                    className="w-16 text-right bg-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-700 text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">{c.percentage}% cut</span>
              </div>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="0"
              max={ticketPrice}
              step="1"
              value={c.amount}
              onChange={(e) => handleAmountChange(c.id, Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        ))}
      </div>

      {/* 6. Modal: Add from Full Cast & Crew */}
      {showAddCreditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Add From Cast & Crew</h3>
                <p className="text-xs text-zinc-400">Select any actor, writer, cinematographer, or editor</p>
              </div>
              <button
                onClick={() => setShowAddCreditModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Cast Members:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {availableCast.map((actor) => (
                    <div
                      key={`cast-${actor.id}`}
                      onClick={() => handleAddFromCredits(actor, 'Actor')}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 cursor-pointer border border-zinc-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar src={actor.profile_path} alt={actor.name} role="Actor" className="w-8 h-8" />
                        <div className="truncate text-xs">
                          <p className="font-bold text-white truncate">{actor.name}</p>
                          <p className="text-zinc-400 truncate">{actor.character || 'Cast'}</p>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-semibold shrink-0">+ Add</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Crew Members:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {availableCrew.map((crew) => (
                    <div
                      key={`crew-${crew.id}-${crew.job}`}
                      onClick={() => handleAddFromCredits(crew, crew.job)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 cursor-pointer border border-zinc-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar src={crew.profile_path} alt={crew.name} role={crew.job} className="w-8 h-8" />
                        <div className="truncate text-xs">
                          <p className="font-bold text-white truncate">{crew.name}</p>
                          <p className="text-zinc-400 truncate">{crew.job}</p>
                        </div>
                      </div>
                      <span className="text-xs text-rose-400 font-semibold shrink-0">+ Add</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: Add Custom Box */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Add Custom Contributor</h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Name / Category:</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., VFX Team, Stunt Choreography, Theater Sound"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Role / Tag:</label>
                <select
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Custom">Custom</option>
                  <option value="VFX / CGI">VFX / CGI</option>
                  <option value="Action / Stunt">Action / Stunt</option>
                  <option value="Screenplay">Screenplay / Story</option>
                  <option value="Cinematography">Cinematography</option>
                  <option value="Experience">Audience Experience</option>
                  <option value="Wasted Money">Wasted Money / Regret</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleAddCustomBox}
                className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs transition-colors"
              >
                Add Box
              </button>
              <button
                onClick={() => setShowCustomModal(false)}
                className="py-2 px-4 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Submit Vote Button */}
      <button
        onClick={handleSubmit}
        disabled={!isPerfect}
        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
          isPerfect
            ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-white shadow-rose-500/25 hover:opacity-95 hover:scale-[1.01]'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
        }`}
      >
        {!isVoterVerified() ? (
          <>
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <span>Verify Voter Pass & Cast Ballot</span>
          </>
        ) : existingUserSubmission ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>Update My Verified Ballot (₹{ticketPrice})</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Cast Verified Ballot & Get Receipt</span>
          </>
        )}
      </button>
    </div>
  );
};
