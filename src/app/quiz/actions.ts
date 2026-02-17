'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { UserProfile } from '@/lib/types';

type StreakUpdateResult = {
  streakIncreased: boolean;
  newStreak: number;
};

export async function updateUserStatsAfterQuiz(
  xpGained: number,
  lastPracticedChapterId: string
): Promise<StreakUpdateResult> {
  const cookieStore = cookies();
  const token = cookieStore.get('firebase_token')?.value;

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
    
    // --- Robust Streak Logic ---
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const lastActiveDate = profile.lastactive?.toDate();
    
    let lastActiveDayStart: Date | null = null;
    if (lastActiveDate) {
      lastActiveDayStart = new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate());
    }

    let newStreak = profile.streak || 0;
    let streakIncreased = false;

    if (!lastActiveDayStart) {
        // First ever lesson
        newStreak = 1;
        streakIncreased = true;
    } else {
        const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
        const differenceInMs = today.getTime() - lastActiveDayStart.getTime();
        const differenceInDays = Math.round(differenceInMs / ONE_DAY_IN_MS);

        if (differenceInDays === 1) {
            // Consecutive day
            newStreak++;
            streakIncreased = true;
        } else if (differenceInDays > 1) {
            // Missed one or more days, so reset streak to 0.
            newStreak = 0;
            streakIncreased = false;
        }
        // if differenceInDays is 0 (same day), do nothing to streak value
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
    // In case of error, we can't confirm streak increase
    return { streakIncreased: false, newStreak: 0 };
  }
}
