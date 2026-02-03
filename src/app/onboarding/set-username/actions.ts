'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean, message: string }> {
  if (!username || username.length < 3) {
    return { available: false, message: 'Username must be at least 3 characters.' };
  }
  if (username.length > 20) {
      return { available: false, message: 'Username must be 20 characters or less.' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { available: false, message: 'Only letters, numbers, and underscores.' };
  }

  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('displayName', '==', username));
  
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { available: false, message: 'This username is already taken.' };
    }
    return { available: true, message: 'Username is available!' };
  } catch (error) {
    console.error('Error checking username:', error);
    return { available: false, message: 'Error checking username.' };
  }
}

export async function setUsername(userId: string, username: string): Promise<{ success: boolean, message: string }> {
    if (!userId) {
        return { success: false, message: 'User not found.' };
    }
    const availability = await checkUsernameAvailability(username);
    if (!availability.available) {
        return { success: false, message: availability.message };
    }

    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { displayName: username, usernameIsSet: true });
        
        revalidatePath('/home');
        revalidatePath('/profile');

        return { success: true, message: 'Username set!' };

    } catch (error) {
        return { success: false, message: 'An error occurred. Please try again.' };
    }
}
