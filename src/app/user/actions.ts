'use server';

import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { differenceInCalendarDays } from 'date-fns';
import { revalidatePath } from 'next/cache';

export async function updateUserStreak() {
  // This is a placeholder for a secure way to get the user's ID on the server.
  // In a real app, this would come from a session.
  // For now, we'll assume a secure way to get the user.
  // This requires a more complex setup with session management (e.g., Next-Auth.js)
  // which is beyond the scope of a single request.
  // The logic below is what would run inside a secure server context.

  // NOTE: The following code will NOT work as-is because `auth.currentUser` is null
  // in Server Actions without a proper session bridge.
  // This is a conceptual implementation.

  const getUserId = async () => {
    // In a real app, you'd get this from a decoded session token.
    // For this demonstration, we're returning null.
    // A full solution would involve Next-Auth.js or custom middleware.
    return null; 
  }
  
  const userId = await getUserId();
  
  if (!userId) {
    console.log("Streak update skipped: User not authenticated on the server.");
    // We cannot securely get the user on the server with this basic setup.
    // The streak logic will be handled on the client for now. This is not ideal for production.
    return;
  }

  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return;
  }

  const userData = userDoc.data();
  const lastQuizDateStr = userData.lastQuizDate;
  const currentStreak = userData.streak || 0;
  const today = new Date();
  
  let newStreak = currentStreak;

  if (lastQuizDateStr) {
    const lastQuizDate = new Date(lastQuizDateStr);
    const diff = differenceInCalendarDays(today, lastQuizDate);

    if (diff === 1) {
      // It's the next day, increment streak
      newStreak = currentStreak + 1;
    } else if (diff > 1) {
      // Missed one or more days, reset streak to 1 for today's session
      newStreak = 1;
    } 
    // if diff is 0, they already did a quiz today, do nothing to the streak.
  } else {
    // First quiz ever
    newStreak = 1;
  }

  await updateDoc(userRef, {
    streak: newStreak,
    lastQuizDate: today.toISOString(),
  });

  revalidatePath('/home');
}
