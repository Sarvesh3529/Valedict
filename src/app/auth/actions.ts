'use server';

import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { cookies } from 'next/headers';

const signupSchema = z.object({
    username: z.string().min(3, "Username must be 3-15 characters.").max(15, "Username must be 3-15 characters.").regex(/^[a-zA-Z0-9_]+$/, "No spaces or special characters."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function signupWithUsername(prevState: any, formData: FormData): Promise<{message: string, success: boolean, redirectTo?: string | null, customToken?: string | null}> {
  const result = signupSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { message: errors.username?.[0] || errors.password?.[0] || 'Invalid input.', success: false };
  }

  const { username, password } = result.data;
  const usernameLower = username.toLowerCase();
  const syntheticEmail = `${usernameLower}@myapp.internal`;

  try {
    // 1. Check if username is taken in Firestore
    const usernameDoc = await adminDb.collection('usernames').doc(usernameLower).get();
    if (usernameDoc.exists) {
      return { message: 'This username is already taken.', success: false };
    }

    // 2. Create Firebase Auth user via REST API
    const signupResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: syntheticEmail, password, returnSecureToken: false }),
    });

    const signupData = await signupResponse.json();

    if (!signupResponse.ok) {
        const error = signupData.error?.message;
        if (error === 'EMAIL_EXISTS') {
            return { message: 'This username is already taken.', success: false };
        }
        console.error("SIGNUP API ERROR:", error);
        return { message: `Signup failed: ${error || 'An unknown error occurred.'}`, success: false };
    }

    const { localId: uid } = signupData;

    // 3. Create user profile and username registry docs in a batch
    const batch = adminDb.batch();

    const userProfileRef = adminDb.collection('users').doc(uid);
    batch.set(userProfileRef, {
      username: username,
      totalxp: 0,
      weeklyxp: 0,
      streak: 0,
      highestStreak: 0,
      joinedat: FieldValue.serverTimestamp(),
      onboardingComplete: false,
      lastactive: null,
    });

    const usernameRef = adminDb.collection('usernames').doc(usernameLower);
    batch.set(usernameRef, { uid });

    await batch.commit();

    // 4. Create custom token to return to the client
    const customToken = await adminAuth.createCustomToken(uid);
    
    return { message: 'Signup successful!', success: true, redirectTo: '/onboarding/start', customToken };

  } catch (error: any) {
    console.error("SIGNUP ACTION UNEXPECTED ERROR:", error);
    return { message: `Signup failed: ${error.message || 'An unexpected error occurred.'}`, success: false };
  }
}

export async function loginWithUsername(prevState: any, formData: FormData): Promise<{message: string, success: boolean, redirectTo?: string | null, customToken?: string | null}> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  
  if (!username || !password) {
    return { message: 'Username and password are required.', success: false };
  }
  
  const syntheticEmail = `${username.toLowerCase()}@myapp.internal`;

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: syntheticEmail, password, returnSecureToken: true }),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = data.error?.message;
        if (error === 'INVALID_LOGIN_CREDENTIALS') {
          return { message: 'Incorrect username or password.', success: false };
        }
         if (error === 'NETWORK_REQUEST_FAILED') {
          return { message: 'Network error. Please check your connection.', success: false };
        }
        return { message: 'Login failed. Please try again.', success: false };
    }
    
    const { localId: uid } = data;
    const customToken = await adminAuth.createCustomToken(uid);

    return { message: 'Login successful!', success: true, redirectTo: '/home', customToken };

  } catch (error: any) {
    console.error('Login Error:', error);
    return { message: `Login failed: An unexpected error occurred.`, success: false };
  }
}

export async function logout() {
    // Session is cleared by clearing the cookie in the route handler.
}

export async function updateUsername(newUsername: string) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('firebase_token')?.value;

  if (!token) throw new Error('Not authenticated');

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) throw new Error('Profile not found');
    
    const oldUsername = userDoc.data()?.username;
    if (!oldUsername) throw new Error('Old username not found');

    if (oldUsername.toLowerCase() === newUsername.toLowerCase()) {
      // Just update casing if it's the same name
      await userRef.update({ username: newUsername });
      return { success: true };
    }

    // 1. Check availability
    const newUsernameLower = newUsername.toLowerCase();
    const oldUsernameLower = oldUsername.toLowerCase();
    const availabilityDoc = await adminDb.collection('usernames').doc(newUsernameLower).get();
    if (availabilityDoc.exists) throw new Error('Username taken');

    // 2. Atomic Batch Update
    const batch = adminDb.batch();
    
    // Delete old registry
    batch.delete(adminDb.collection('usernames').doc(oldUsernameLower));
    
    // Create new registry
    batch.set(adminDb.collection('usernames').doc(newUsernameLower), { uid });
    
    // Update user profile
    batch.update(userRef, { username: newUsername });

    await batch.commit();
    return { success: true };

  } catch (error: any) {
    console.error("Update Username Error:", error);
    return { success: false, message: error.message || 'Update failed' };
  }
}
