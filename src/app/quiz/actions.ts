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
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let lastActiveDayStart: Date | null = null;
    if (lastActiveDate) {
        lastActiveDayStart = new Date(lastActiveDate);
        lastActiveDayStart.setHours(0, 0, 0, 0);
    }

    console.log("--- Streak Calculation ---");
    console.log("Last Active Timestamp:", profile.lastactive);
    console.log("Last Active Date:", lastActiveDate);
    console.log("Today (start of day):", today);
    console.log("Yesterday (start of day):", yesterday);
    console.log("Current Streak:", profile.streak);


    let newStreak = profile.streak || 0;
    let streakIncreased = false;

    if (!lastActiveDayStart || lastActiveDayStart.getTime() < yesterday.getTime()) {
      // If last active was before yesterday, reset streak to 1
      console.log("Condition: Last active was before yesterday. Resetting streak to 1.");
      newStreak = 1;
      streakIncreased = true;
    } else if (lastActiveDayStart.getTime() === yesterday.getTime()) {
      // If last active was yesterday, increment streak
      console.log("Condition: Last active was yesterday. Incrementing streak.");
      newStreak++;
      streakIncreased = true;
    } else {
        // If last active was today, do nothing to the streak.
        console.log("Condition: Last active was today. Streak remains unchanged.");
    }
    
    console.log("New Calculated Streak:", newStreak);
    console.log("------------------------");


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
