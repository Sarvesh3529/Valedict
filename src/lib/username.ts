'use server';

import { adminDb } from '@/lib/firebase-admin';

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean, message: string }> {
  const trimmedUsername = username.trim();
  if (!trimmedUsername || trimmedUsername.length < 3) {
    return { available: false, message: 'Username must be at least 3 characters.' };
  }
  if (trimmedUsername.length > 20) {
      return { available: false, message: 'Username must be 20 characters or less.' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return { available: false, message: 'Only letters, numbers, and underscores.' };
  }

  const usersRef = adminDb.collection('users');
  // We query by displayName, which is indexed.
  const q = usersRef.where('displayName', '==', trimmedUsername);
  
  try {
    const querySnapshot = await q.get();
    if (!querySnapshot.empty) {
      return { available: false, message: 'This username is already taken.' };
    }
    return { available: true, message: 'Username is available!' };
  } catch (error: any) {
    console.error("--- DETAILED USERNAME CHECK ERROR ---");
    console.error("Message:", error.message);
    if(error.code) {
      console.error("Firebase Error Code:", error.code);
    }
    console.error("This error likely means the server cannot connect to Firebase. Check your .env file's FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY variables. Also ensure Firestore is enabled in your Firebase project and you have created the required index.");
    console.error("--- END DETAILED ERROR ---");

    return { available: false, message: 'Error checking username. Please check server logs for details.' };
  }
}

// This function is for updating the username after signup, if needed.
// It uses a transaction to ensure the old username lock is released and the new one is acquired atomically.
export async function updateUserDisplayName(userId: string, newUsername: string) {
    const userRef = adminDb.collection('users').doc(userId);
    
    // This is a simplified version. A real implementation would use a transaction
    // to also update a separate 'usernames' collection for locking.
    // For this app, we'll just update the display name directly.
    return userRef.update({ displayName: newUsername });
}
