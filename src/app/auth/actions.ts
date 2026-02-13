'use server';

import { auth, db } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { doc, getDoc } from 'firebase/firestore';

async function setSessionCookie(idToken: string) {
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days
    cookies().set('firebase_token', idToken, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
}

export async function signupWithUsername(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const usernameLower = username.toLowerCase();

  // Basic server-side validation
  if (!username || !password) return { message: 'Username and password are required.' };
  if (password.length < 6) return { message: 'Password must be at least 6 characters long.' };
  if (username.length < 3) return { message: 'Username must be at least 3 characters.' };
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return { message: 'Username can only contain letters, numbers, and underscores.'};

  try {
    // 1. Check if username is already taken in 'usernames' collection (using client SDK is fine for public read)
    const usernameDocRef = doc(db, 'usernames', usernameLower);
    const usernameDoc = await getDoc(usernameDocRef);
    if (usernameDoc.exists()) {
      return { message: 'This username is already taken. Please choose another.' };
    }

    // 2. Create user in Firebase Auth with a dummy email
    const dummyEmail = `${usernameLower}@myapp.local`;
    const userCredential = await createUserWithEmailAndPassword(auth, dummyEmail, password);
    const user = userCredential.user;
    
    // 3. Update the Auth profile's displayName
    await updateProfile(user, { displayName: username });
    
    // 4. Create the user profile document in 'users' using the Admin SDK
    const userDocRefAdmin = adminDb.collection('users').doc(user.uid);
    const profileData = {
        uid: user.uid,
        email: user.email, // The dummy email
        displayName: username,
        photoURL: null,
        currentStreak: 0,
        highestStreak: 0,
        lastActivityDate: null,
        totalXp: 0,
        weeklyXp: 0,
        lastXpReset: new Date().toISOString(),
        onboardingComplete: false,
        achievements: [],
        lastPracticedChapterId: null,
        createdAt: FieldValue.serverTimestamp(),
    };
    await userDocRefAdmin.set(profileData);

    // 5. Create the username lock document in 'usernames' using the Admin SDK
    const usernameLockDocRefAdmin = adminDb.collection('usernames').doc(usernameLower);
    await usernameLockDocRefAdmin.set({ uid: user.uid });

    // 6. Set the session cookie and redirect
    const token = await user.getIdToken();
    await setSessionCookie(token);

  } catch (error: any) {
    console.error("SIGNUP ERROR:", error);
    if (error.code === 'auth/email-already-in-use') {
        // This case handles the race condition where the username check passed but auth creation failed.
        return { message: 'This username is already in use. Please choose another.' };
    }
    return {
      message: `Signup failed: ${error.message}`,
    };
  }
  redirect('/home');
}

export async function loginWithUsername(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  
  if (!username || !password) {
    return { message: 'Username and password are required.' };
  }
  
  const dummyEmail = `${username.toLowerCase()}@myapp.local`;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, dummyEmail, password);
    const token = await userCredential.user.getIdToken();
    await setSessionCookie(token);
  } catch (error: any) {
    console.error('Login Error Code:', error.code);
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return { message: 'Invalid username or password.' };
      default:
        return { message: `Login failed: An unexpected error occurred.` };
    }
  }
  redirect('/home');
}

export async function logout() {
    cookies().delete('firebase_token');
    redirect('/');
}
