'use client';

import React, { useRef, useState } from 'react';
import { Download, Share2, Ticket, Check, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { TicketSplitSubmission } from '../types';

interface ReceiptCardProps {
  submission: TicketSplitSubmission;
  onReset?: () => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ submission, onReset }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#09090b'
      });
      const link = document.createElement('a');
      link.download = `${submission.movieTitle.replace(/\s+/g, '_')}_TicketSplit_Receipt.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${submission.movieTitle} Ticket Valuation`,
        text: `I just split my ₹${submission.ticketPrice} ticket for ${submission.movieTitle}! Verdict: ${submission.verdict}`
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `I split my ₹${submission.ticketPrice} ticket for ${submission.movieTitle}! Verdict: ${submission.verdict} - Check it on TicketSplit!`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* The Printable Ticket Card */}
      <div
        ref={receiptRef}
        className="relative bg-zinc-900 border-2 border-zinc-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-zinc-100 shadow-2xl overflow-hidden font-mono"
      >
        {/* Ticket Header Graphic */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-zinc-700 pb-3 sm:pb-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 -rotate-12 shrink-0" />
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm tracking-wider uppercase text-amber-400">
                CINEMA AUDIENCE VALUATION
              </h3>
              <p className="text-[9px] sm:text-[10px] text-zinc-400">OFFICIAL BOX OFFICE SPLIT RECEIPT</p>
            </div>
          </div>
          <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0">
            TMDB VERIFIED
          </span>
        </div>

        {/* Movie Title & Ticket Price */}
        <div className="mb-3 sm:mb-4 text-center">
          <span className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest">FILM TITLE</span>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
            {submission.movieTitle}
          </h2>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <span>TICKET PRICE:</span>
            <span className="font-bold text-xs sm:text-sm">₹{submission.ticketPrice}</span>
          </div>
        </div>

        {/* Itemized Allocations Table */}
        <div className="space-y-2 border-y border-zinc-800 py-3 mb-4 text-xs">
          <div className="flex justify-between font-bold text-zinc-400 text-[11px] pb-1 border-b border-zinc-800/80">
            <span>CONTRIBUTOR / ROLE</span>
            <div className="flex gap-4">
              <span>% CUT</span>
              <span className="w-12 text-right">VALUATION</span>
            </div>
          </div>

          {submission.allocations.map((alloc) => (
            <div key={alloc.id} className="flex justify-between items-center text-zinc-200">
              <div className="truncate pr-2">
                <span className="font-medium text-zinc-100">{alloc.name.split('(')[0].trim()}</span>
                <span className="text-[10px] text-zinc-500 block">[{alloc.role}]</span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-zinc-400 text-[11px]">{alloc.percentage}%</span>
                <span className="w-12 text-right font-bold text-amber-400">
                  ₹{alloc.amount}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Verdict Badge */}
        <div className="p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800 text-center mb-4">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">
            AUDIENCE VERDICT
          </span>
          <p className="text-xs font-semibold text-rose-300 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {submission.verdict}
          </p>
        </div>

        {/* Verified Voter & Simulated Barcode */}
        <div className="pt-2 border-t-2 border-dashed border-zinc-700 text-center space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 px-2 pb-1 border-b border-zinc-800">
            <span className="text-zinc-500 font-bold uppercase">OFFICIAL VOTER:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {submission.userKey.startsWith('phone_') 
                ? `+91 ${submission.userKey.replace('phone_', '')}` 
                : submission.userKey.startsWith('email_') 
                ? submission.userKey.replace('email_', '') 
                : submission.userKey.startsWith('google_')
                ? 'Google Verified'
                : 'Verified Cinema Pass'}
            </span>
          </div>

          <div className="h-7 w-4/5 mx-auto flex items-center justify-center gap-0.5 opacity-60">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className={`bg-zinc-300 h-full ${
                  i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-0.5'
                }`}
              />
            ))}
          </div>
          <p className="text-[9px] text-zinc-500 tracking-widest uppercase">
            BALLOT: {submission.id.slice(0, 16)} • {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-95 shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Generating PNG...' : 'Download Ticket PNG'}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Copied Link!' : 'Share'}</span>
        </button>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="w-full text-center text-xs text-zinc-400 hover:text-zinc-200 py-2 transition-colors"
        >
          ← Rate another film or re-split
        </button>
      )}
    </div>
  );
};
