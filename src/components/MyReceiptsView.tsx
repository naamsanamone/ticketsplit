'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Film, Sparkles, ArrowRight } from 'lucide-react';
import { TicketSplitSubmission } from '../types';
import { getStoredSubmissions } from '../lib/store';
import { ReceiptCard } from './ReceiptCard';

interface MyReceiptsViewProps {
  onStartValuating: () => void;
}

export const MyReceiptsView: React.FC<MyReceiptsViewProps> = ({ onStartValuating }) => {
  const [submissions, setSubmissions] = useState<TicketSplitSubmission[]>([]);
  const [activeSubmission, setActiveSubmission] = useState<TicketSplitSubmission | null>(null);

  useEffect(() => {
    const data = getStoredSubmissions();
    setSubmissions(data);
  }, []);

  if (activeSubmission) {
    return (
      <ReceiptCard 
        submission={activeSubmission} 
        onReset={() => setActiveSubmission(null)} 
      />
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-10 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Ticket className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-black text-white">No Receipts Yet</h3>
        <p className="text-xs text-zinc-400">
          You haven&apos;t split any tickets yet. Search for a movie you recently watched and allocate your ticket price!
        </p>
        <button
          onClick={onStartValuating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:opacity-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Valuate Your First Film</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl font-black text-white">Your Past Cinema Receipts</h2>
          <p className="text-xs text-zinc-400">Saved locally on your device</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700">
          {submissions.length} {submissions.length === 1 ? 'Receipt' : 'Receipts'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            onClick={() => setActiveSubmission(sub)}
            className="group p-4 bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center gap-3">
              {sub.moviePoster ? (
                <img
                  src={sub.moviePoster}
                  alt={sub.movieTitle}
                  className="w-12 h-16 object-cover rounded-xl border border-zinc-700 shrink-0"
                />
              ) : (
                <div className="w-12 h-16 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                  <Film className="w-6 h-6 text-zinc-600" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-white truncate group-hover:text-amber-400 transition-colors">
                  {sub.movieTitle}
                </h4>
                <div className="text-xs font-semibold text-amber-400 mt-0.5">
                  ₹{sub.ticketPrice} Ticket
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 text-xs flex items-center justify-between text-zinc-400">
              <span className="truncate pr-2 italic font-mono text-[11px]">
                {sub.verdict}
              </span>
              <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
