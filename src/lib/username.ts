'use server';

import { adminDb } from '@/lib/firebase-admin';

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean, message: string }> {
  const trimmedUsername = username.trim();
  const lowercaseUsername = trimmedUsername.toLowerCase();
  
  if (!trimmedUsername || trimmedUsername.length < 3) {
    return { available: false, message: 'Username must be at least 3 characters.' };
  }
  if (trimmedUsername.length > 15) {
      return { available: false, message: 'Username must be 15 characters or less.' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return { available: false, message: 'Only letters, numbers, and underscores allowed.' };
  }

  try {
    const usernameDoc = await adminDb.collection('usernames').doc(lowercaseUsername).get();
    
    if (usernameDoc.exists) {
      return { available: false, message: 'This username is already taken.' };
    }
    
    return { available: true, message: 'Username is available!' };
  } catch (error: any) {
    console.error("Error checking username availability:", error);
    return { available: false, message: 'Error checking availability.' };
  }
}
