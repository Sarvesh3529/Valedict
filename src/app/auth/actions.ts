'use server';

import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';

async function handleUserSetup(user: any) {
    const userRef = doc(db, 'users', user.uid);
    // Use the provider data for display name if available (e.g., from Google)
    const displayName = user.displayName || user.email?.split('@')[0];
    
    await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL,
    }, { merge: true });
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Email and password are required.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await handleUserSetup(userCredential.user);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
        return { message: 'This email is already in use. Please sign in.' };
    }
    return {
      message: error.message,
    };
  }
  redirect('/onboarding/start');
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { message: 'Email and password are required.' };
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
     if (error.code === 'auth/invalid-credential') {
        return { message: 'Invalid email or password. Please try again.' };
    }
    return {
      message: 'An unknown error occurred. Please try again later.',
    };
  }
  redirect('/home');
}

export async function logout() {
    await auth.signOut();
    redirect('/');
}
