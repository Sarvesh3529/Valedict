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
    
    // --- Streak Logic ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    const lastActiveDate = profile.lastactive?.toDate();
    lastActiveDate?.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let newStreak = profile.streak || 0;
    let streakIncreased = false;

    if (!lastActiveDate || lastActiveDate.getTime() < yesterday.getTime()) {
      // If last active was before yesterday, reset streak to 1
      newStreak = 1;
      streakIncreased = true;
    } else if (lastActiveDate.getTime() === yesterday.getTime()) {
      // If last active was yesterday, increment streak
      newStreak++;
      streakIncreased = true;
    }
    // If last active was today, do nothing to the streak.

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
