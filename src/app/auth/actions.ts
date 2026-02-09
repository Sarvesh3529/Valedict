'use server';

import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { redirect } from 'next/navigation';
import { setupNewUser } from '@/lib/user';
import { cookies } from 'next/headers';

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Email and password are required.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    cookies().set('firebase_token', token, { secure: true, sameSite: 'lax', httpOnly: true });
    await setupNewUser(userCredential.user);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
        return { message: 'This email is already in use. Please sign in.' };
    }
    return {
      message: `Signup failed: ${error.message} (Code: ${error.code})`,
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
    const token = await userCredential.user.getIdToken();
    cookies().set('firebase_token', token, { secure: true, sameSite: 'lax', httpOnly: true });
    await setupNewUser(userCredential.user);
  } catch (error: any) {
     if (error.code === 'auth/invalid-credential') {
        return { message: 'Invalid email or password. Please try again.' };
    }
    return {
      message: `Login failed: ${error.message} (Code: ${error.code})`,
    };
  }
  redirect('/home');
}

export async function logout() {
    await auth.signOut();
    cookies().delete('firebase_token');
    redirect('/');
}
