'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Smartphone
} from 'lucide-react';
import { requestOtp, verifyOtp, signInWithGoogle, VoterProfile } from '../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (voter: VoterProfile) => void;
  actionReason?: string; // e.g. "to cast your verified ballot for Oppenheimer"
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  actionReason = 'to cast your verified ballot to the Film Census'
}) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [contactInput, setContactInput] = useState<string>('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  
  // 6-digit OTP boxes
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpNotification, setOtpNotification] = useState<{ code: string; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setContactInput('');
      setOtpDigits(['', '', '', '', '', '']);
      setOtpNotification(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  // Countdown timer for resend
  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const val = contactInput.trim();
    if (!val) {
      setErrorMsg(authMethod === 'phone' ? 'Please enter a valid mobile number' : 'Please enter a valid email address');
      return;
    }

    if (authMethod === 'phone' && val.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    if (authMethod === 'email' && !val.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    const { code, message } = requestOtp(val, authMethod);
    setOtpNotification({ code, message });
    setStep('otp');
    setCountdown(30);

    // Focus first OTP box
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1); // Only take last typed character
    setOtpDigits(newDigits);
    setErrorMsg(null);

    // Auto-advance to next box
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (value && index === 5 && newDigits.every((d) => d !== '')) {
      submitVerification(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFill = () => {
    if (otpNotification?.code) {
      const codeDigits = otpNotification.code.split('');
      setOtpDigits(codeDigits);
      submitVerification(otpNotification.code);
    }
  };

  const submitVerification = (fullCode?: string) => {
    const codeToVerify = fullCode || otpDigits.join('');
    if (codeToVerify.length !== 6) {
      setErrorMsg('Please enter all 6 digits');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      const res = verifyOtp(contactInput, codeToVerify, authMethod);
      setIsSubmitting(false);

      if (res.success && res.voter) {
        onVerified(res.voter);
        onClose();
      } else {
        setErrorMsg(res.error || 'Verification failed. Try again.');
      }
    }, 400);
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const voter = signInWithGoogle('cinephile.voter@gmail.com', 'Verified Moviegoer');
      setIsSubmitting(false);
      onVerified(voter);
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Verify Voter Identity
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            1-User-1-Ticket integrity check {actionReason}.
          </p>
        </div>

        {/* STEP 1: Enter Phone / Email */}
        {step === 'input' && (
          <div className="space-y-4">
            {/* Method Tabs */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAuthMethod('phone'); setErrorMsg(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  authMethod === 'phone'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Mobile OTP</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setErrorMsg(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  authMethod === 'email'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Pass</span>
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendCode} className="space-y-3">
              {authMethod === 'phone' ? (
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 shrink-0">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={contactInput}
                      onChange={(e) => setContactInput(e.target.value.replace(/[^\d\s]/g, ''))}
                      placeholder="98765 43210"
                      maxLength={12}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500 text-white text-sm outline-none transition-colors"
                      autoFocus
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    placeholder="moviegoer@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500 text-white text-sm outline-none transition-colors"
                    autoFocus
                  />
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
              >
                <span>Send 6-Digit Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative py-1 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <span className="relative px-3 bg-zinc-950 text-[10px] uppercase font-bold text-zinc-500">
                OR 1-TAP VERIFY (FREE)
              </span>
            </div>

            {/* 1-Tap Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-200 flex items-center justify-center gap-2.5 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* STEP 2: Enter 6-Digit OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            {/* Realistic Zero-Cost In-App Notification Toast */}
            {otpNotification && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Instant In-App Voter OTP</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    ZERO COST
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  {otpNotification.message}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-amber-500/20">
                  <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                    CODE: {otpNotification.code}
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-black transition-colors"
                  >
                    Quick Auto-Fill
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <span className="text-xs text-zinc-400 block mb-3">
                Enter 6-digit code sent to <strong>{contactInput}</strong>
              </span>

              {/* 6 OTP Input Boxes */}
              <div className="flex items-center justify-center gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={`otp-${idx}`}
                    ref={(el) => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-black rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={() => submitVerification()}
              disabled={isSubmitting || otpDigits.some((d) => !d)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:opacity-50 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span>Verifying pass...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Cast Ballot</span>
                </>
              )}
            </button>

            {/* Back / Resend */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="hover:text-white transition-colors"
              >
                ← Change number
              </button>

              <button
                type="button"
                disabled={countdown > 0}
                onClick={() => handleSendCode()}
                className="text-amber-400 hover:text-amber-300 disabled:text-zinc-600 font-semibold transition-colors"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
