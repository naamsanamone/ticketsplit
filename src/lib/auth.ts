'use client';

export interface VoterProfile {
  uid: string;
  displayName: string;
  contactType: 'phone' | 'email' | 'google';
  contactValue: string;
  isVerified: boolean;
  verifiedAt: string;
}

const STORAGE_KEYS = {
  VOTER_PROFILE: 'ticketsplit_voter_profile',
  PENDING_OTP: 'ticketsplit_pending_otp'
};

interface PendingOtp {
  contact: string;
  type: 'phone' | 'email';
  code: string;
  expiresAt: number;
}

export function getStoredVoter(): VoterProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOTER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isVoterVerified(): boolean {
  const voter = getStoredVoter();
  return Boolean(voter && voter.isVerified && voter.uid);
}

/**
 * Generates an instant, zero-cost 6-digit verification code.
 * Stores pending OTP in localStorage with a 5-minute expiry.
 */
export function requestOtp(
  contact: string, 
  type: 'phone' | 'email'
): { code: string; message: string } {
  if (typeof window === 'undefined') return { code: '123456', message: '' };

  const cleanContact = contact.trim().toLowerCase();
  // 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  const pending: PendingOtp = {
    contact: cleanContact,
    type,
    code,
    expiresAt
  };

  localStorage.setItem(STORAGE_KEYS.PENDING_OTP, JSON.stringify(pending));

  const message = type === 'phone'
    ? `💬 [SMS to ${contact}]: Your TicketSplit verification code is ${code} (Expires in 5 min)`
    : `✉️ [Email to ${contact}]: Your TicketSplit voter pass code is ${code}`;

  return { code, message };
}

/**
 * Validates the 6-digit OTP code entered by the user.
 */
export function verifyOtp(
  contact: string, 
  code: string, 
  type: 'phone' | 'email'
): { success: boolean; voter?: VoterProfile; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Window not available' };
  }

  const cleanContact = contact.trim().toLowerCase();
  const rawPending = localStorage.getItem(STORAGE_KEYS.PENDING_OTP);

  if (!rawPending) {
    return { success: false, error: 'No OTP requested or code expired. Please request a new code.' };
  }

  try {
    const pending: PendingOtp = JSON.parse(rawPending);

    if (Date.now() > pending.expiresAt) {
      localStorage.removeItem(STORAGE_KEYS.PENDING_OTP);
      return { success: false, error: 'Code expired. Please request a new one.' };
    }

    if (pending.contact !== cleanContact) {
      return { success: false, error: 'Contact does not match the requested OTP.' };
    }

    if (pending.code !== code.trim()) {
      return { success: false, error: 'Incorrect code. Please check and try again.' };
    }

    // Correct OTP! Create or load verified profile
    const uid = `${type}_${cleanContact.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const displayName = type === 'phone' 
      ? (contact.startsWith('+') ? contact : `+91 ${contact}`)
      : contact.split('@')[0];

    const voter: VoterProfile = {
      uid,
      displayName,
      contactType: type,
      contactValue: contact.trim(),
      isVerified: true,
      verifiedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.VOTER_PROFILE, JSON.stringify(voter));
    localStorage.removeItem(STORAGE_KEYS.PENDING_OTP);

    return { success: true, voter };
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return { success: false, error: 'Verification failed. Try again.' };
  }
}

/**
 * 1-Tap Google Sign-In (Zero cost, instant)
 */
export function signInWithGoogle(
  email: string = 'moviegoer@gmail.com', 
  name: string = 'Movie Enthusiast'
): VoterProfile {
  const uid = `google_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const voter: VoterProfile = {
    uid,
    displayName: name,
    contactType: 'google',
    contactValue: email,
    isVerified: true,
    verifiedAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.VOTER_PROFILE, JSON.stringify(voter));
  }
  return voter;
}

export function logoutVoter(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.VOTER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.PENDING_OTP);
}
