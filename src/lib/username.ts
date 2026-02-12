'use server';

import { adminDb } from '@/lib/firebase-admin';

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

  const usernameDocRef = adminDb.collection('usernames').doc(lowercaseUsername);

  try {
    const doc = await usernameDocRef.get();
    
    if (doc.exists) {
      return { available: false, message: 'This username is already taken.' };
    }
    
    return { available: true, message: 'Username is available!' };
  } catch (error: any) {
    // Handle permission denied errors specifically
    if (error.code === 'permission-denied' || error.code === 7) { // gRPC code for permission denied
        console.error("--- PERMISSION DENIED ---");
        console.error(`The server failed to read the document at path: "${usernameDocRef.path}"`);
        console.error("This check uses the Admin SDK, which should bypass security rules. A 'permission-denied' error strongly suggests a problem with your service account credentials in the .env file or IAM permissions in your Google Cloud project.");
        console.error("Please verify that FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID are correct and that the service account has the 'Cloud Datastore User' role.");
        return { available: false, message: `Permission denied checking path: ${usernameDocRef.path}. See server logs.` };
    }

    console.error("--- DETAILED USERNAME CHECK ERROR ---");
    console.error("Message:", error.message);
    if(error.code) {
      console.error("Firebase Error Code:", error.code);
    }
    return { available: false, message: 'Error checking username. Please check server logs for details.' };
  }
}
