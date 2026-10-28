'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Film, Star, Loader2, Sparkles } from 'lucide-react';
import { Movie } from '../types';

interface SearchBarProps {
  onSelectMovie: (movie: Movie) => void;
  selectedMovie: Movie | null;
}

const POPULAR_SHORTCUTS = [
  { id: 872585, title: "Oppenheimer" },
  { id: 579974, title: "RRR" },
  { id: 693134, title: "Dune: Part Two" },
  { id: 872906, title: "Jawan" }
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectMovie, selectedMovie }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search API fetch with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.movies || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (movie: Movie) => {
    onSelectMovie(movie);
    setQuery('');
    setIsOpen(false);
  };

  const handleShortcutClick = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/movie/${id}`);
      const data = await res.json();
      if (data.success && data.data?.movie) {
        onSelectMovie(data.data.movie);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3" ref={dropdownRef}>
      {/* Search Bar Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search any movie to split its ticket (e.g., Oppenheimer, RRR, Jawan)..."
          className="w-full pl-11 pr-4 py-3 bg-zinc-900/90 border border-zinc-700/80 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm shadow-xl transition-all"
        />
      </div>

      {/* Quick Picks / Suggestions */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-zinc-500 flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Try:
        </span>
        {POPULAR_SHORTCUTS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleShortcutClick(item.id)}
            className={`px-2.5 py-1 rounded-full border transition-all ${
              selectedMovie?.id === item.id
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="relative">
          <div className="absolute top-1 left-0 right-0 z-50 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
            {results.map((m) => (
              <div
                key={m.id}
                onClick={() => handleSelect(m)}
                className="flex items-center gap-3 p-3 hover:bg-zinc-800/80 cursor-pointer border-b border-zinc-800/50 transition-colors"
              >
                {m.poster_path ? (
                  <img
                    src={m.poster_path}
                    alt={m.title}
                    className="w-10 h-14 object-cover rounded-lg shadow shrink-0"
                  />
                ) : (
                  <div className="w-10 h-14 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                    <Film className="w-5 h-5 text-zinc-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-zinc-100 truncate">{m.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                    {m.release_date && (
                      <span>{new Date(m.release_date).getFullYear()}</span>
                    )}
                    {m.vote_average && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {m.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
