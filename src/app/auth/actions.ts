'use server';

import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { redirect } from 'next/navigation';
import { setupNewUser } from '@/lib/user';

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Email and password are required.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setupNewUser(userCredential.user);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
        return { message: 'This email is already in use. Please sign in.' };
    }
    return {
      message: error.message,
    };
  }
  redirect('/home');
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { message: 'Email and password are required.' };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await setupNewUser(userCredential.user);
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
