
'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { UserProfile } from '@/lib/types';

type StreakUpdateResult = {
  streakIncreased: boolean;
  newStreak: number;
};

/**
 * Resets a broken streak to 0 in the database.
 * Triggered when the app detects a missed day.
 */
export async function resetBrokenStreak() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('firebase_token')?.value;
  if (!token) return;

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const userRef = adminDb.collection('users').doc(uid);
    
    await userRef.update({
      streak: 0,
    });
  } catch (error) {
    console.error("Error resetting streak:", error);
  }
}

/**
 * Checks if the weekly XP should be reset (if it's a new Monday since the last reset).
 * Returns true if reset was performed.
 */
export async function ensureWeeklyXPReset(uid: string): Promise<boolean> {
  try {
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return false;

    const profile = userDoc.data() as UserProfile;
    const now = new Date();
    
    // Start of current week (Monday 0:00)
    const currentMonday = new Date(now);
    const day = currentMonday.getDay();
    // Adjust to previous Monday. getDay(): 0=Sun, 1=Mon, ..., 6=Sat
    const diff = currentMonday.getDate() - day + (day === 0 ? -6 : 1);
    currentMonday.setDate(diff);
    currentMonday.setHours(0, 0, 0, 0);

    // Helper to safely get Date from Timestamp (handles server-side Timestamp objects)
    const getSafeDate = (ts: any) => {
      if (!ts) return new Date(0);
      if (typeof ts.toDate === 'function') return ts.toDate();
      if (ts.seconds) return new Date(ts.seconds * 1000);
      return new Date(ts);
    };

    const lastResetDate = getSafeDate(profile.lastWeeklyReset || profile.joinedat);

    if (lastResetDate < currentMonday) {
      await userRef.update({
        weeklyxp: 0,
        lastWeeklyReset: FieldValue.serverTimestamp(),
      });
      return true;
    }
  } catch (error) {
    console.error("Error in ensureWeeklyXPReset:", error);
  }

  return false;
}

/**
 * Updates user stats after a quiz following strict streak rules.
 */
export async function updateUserStatsAfterQuiz(
  xpGained: number,
  lastPracticedChapterId: string
): Promise<StreakUpdateResult> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('firebase_token')?.value;

  if (!token) {
    throw new Error('User not authenticated');
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userRef = adminDb.collection('users').doc(uid);
    
    // 1. Weekly Reset JIT Check
    await ensureWeeklyXPReset(uid);
    
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new Error('User profile not found.');
    }

    let profile = userDoc.data() as UserProfile;
    
    // 2. Strict Streak Logic
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const lastActiveDate = profile.lastactive?.toDate();
    let lastActiveDayStart: Date | null = null;
    if (lastActiveDate) {
      lastActiveDayStart = new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate());
    }

    let currentStreak = profile.streak || 0;
    let newStreak = currentStreak;
    let streakIncreased = false;

    if (!lastActiveDayStart || currentStreak === 0) {
        newStreak = 1;
        streakIncreased = true;
    } else {
        const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
        const differenceInMs = today.getTime() - lastActiveDayStart.getTime();
        const differenceInDays = Math.round(differenceInMs / ONE_DAY_IN_MS);

        if (differenceInDays === 1) {
            newStreak = currentStreak + 1;
            streakIncreased = true;
        } else if (differenceInDays > 1) {
            newStreak = 1;
            streakIncreased = true;
        } 
    }
    
    const newHighestStreak = Math.max(profile.highestStreak || 0, newStreak);

    // --- Update Firestore ---
    await userRef.update({
      totalxp: FieldValue.increment(xpGained),
      weeklyxp: FieldValue.increment(xpGained),
      streak: newStreak,
      highestStreak: newHighestStreak,
      lastactive: FieldValue.serverTimestamp(),
      lastPracticedChapterId: lastPracticedChapterId,
    });
    
    return { streakIncreased, newStreak };

  } catch (error: any) {
    console.error("Error updating user stats:", error);
    return { streakIncreased: false, newStreak: 0 };
  }
}
