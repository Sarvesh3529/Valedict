'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean, message: string }> {
  const trimmedUsername = username.trim();
  const lowercaseUsername = trimmedUsername.toLowerCase();
  
  if (!trimmedUsername || trimmedUsername.length < 3) {
    return { available: false, message: 'Username must be at least 3 characters.' };
  }
  if (trimmedUsername.length > 20) {
      return { available: false, message: 'Username must be 20 characters or less.' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return { available: false, message: 'Only letters, numbers, and underscores.' };
  }

  const usernameDocRef = doc(db, 'usernames', lowercaseUsername);

  try {
    const docSnap = await getDoc(usernameDocRef);
    
    if (docSnap.exists()) {
      return { available: false, message: 'This username is already taken.' };
    }
    
    return { available: true, message: 'Username is available!' };
  } catch (error: any) {
    if (error.code === 'permission-denied') {
        console.error("--- PERMISSION DENIED ---");
        console.error(`Firestore rules denied read access to the path: "${usernameDocRef.path}"`);
        console.error("Please ensure your 'firestore.rules' allow public reads on the 'usernames' collection for availability checks, like so: match /usernames/{username} { allow get: if true; }");
        return { available: false, message: `Permission denied checking username. Please see server logs.` };
    }

    console.error("--- UNEXPECTED USERNAME CHECK ERROR ---");
    console.error("Message:", error.message);
    if(error.code) {
      console.error("Firebase Error Code:", error.code);
    }
    return { available: false, message: 'Error checking username. Please check server logs for details.' };
  }
}
