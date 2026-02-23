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
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User profile not found.');
    }

    const profile = userDoc.data() as UserProfile;
    
    // --- Strict Streak Logic ---
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
        // 1. If streak is 0 or no previous record: Set to 1
        newStreak = 1;
        streakIncreased = true;
    } else {
        const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
        const differenceInMs = today.getTime() - lastActiveDayStart.getTime();
        const differenceInDays = Math.round(differenceInMs / ONE_DAY_IN_MS);

        if (differenceInDays === 1) {
            // 2. If lastactive was Yesterday: Increment
            newStreak = currentStreak + 1;
            streakIncreased = true;
        } else if (differenceInDays > 1) {
            // 3. If missed a day: Reset to 1 (starting fresh today)
            newStreak = 1;
            streakIncreased = true;
        } 
        // 4. If differenceInDays is 0 (Today): Do nothing (streak stays same)
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
