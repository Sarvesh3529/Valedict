'use server';

import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { checkUsernameAvailability } from '@/lib/username';
import { doc, setDoc } from 'firebase/firestore';

async function setSessionCookie(idToken: string) {
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds
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

  if (!username || !password) {
    return { message: 'Username and password are required.' };
  }
  if (password.length < 6) {
    return { message: 'Password must be at least 6 characters long.' };
  }

  // Server-side check for username availability
  const availability = await checkUsernameAvailability(username);
  if (!availability.available) {
    return { message: availability.message };
  }
  
  const email = `${username.toLowerCase()}@valedict.ai`;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update auth profile and create firestore document
    await updateProfile(user, { displayName: username });
    
    const userRef = doc(db, 'users', user.uid);
    const profileData = {
        uid: user.uid,
        email: user.email,
        displayName: username,
        photoURL: user.photoURL,
        currentStreak: 0,
        highestStreak: 0,
        lastActivityDate: null,
        totalXp: 0,
        weeklyXp: 0,
        lastXpReset: new Date().toISOString(),
        onboardingComplete: false,
        achievements: [],
        lastPracticedChapterId: null,
    };
    await setDoc(userRef, profileData);

    const token = await user.getIdToken();
    await setSessionCookie(token);

  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
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
  
  const email = `${username.toLowerCase()}@valedict.ai`;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
        return { message: `Login failed: ${error.message}` };
    }
  }
  redirect('/home');
}

export async function logout() {
    cookies().delete('firebase_token');
    redirect('/');
}
