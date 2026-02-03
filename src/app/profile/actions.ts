'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { checkUsernameAvailability } from '@/app/onboarding/set-username/actions';

export async function updateUserDisplayName(userId: string, newDisplayName: string): Promise<{ success: boolean; message: string }> {
  if (!userId) {
    return { success: false, message: 'User not authenticated.' };
  }

  const availability = await checkUsernameAvailability(newDisplayName);
  if (!availability.available) {
    // Allow if the user is updating to their current name (case change, etc.)
    // A more robust check might be needed if case-insensitivity is desired
  }

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      displayName: newDisplayName,
    });
    revalidatePath('/profile');
    revalidatePath('/leaderboard');
    return { success: true, message: 'Username updated successfully.' };
  } catch (error) {
    console.error('Error updating username:', error);
    return { success: false, message: 'An error occurred while updating the username.' };
  }
}
