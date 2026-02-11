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
    
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days in ms
    cookies().set('firebase_token', token, { 
        maxAge: expiresIn / 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
     });

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

  const trimmedEmail = email.trim();
  console.log('Attempting login with:', trimmedEmail);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
    const token = await userCredential.user.getIdToken();
    
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days in ms
    cookies().set('firebase_token', token, { 
        maxAge: expiresIn / 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    await setupNewUser(userCredential.user);
  } catch (error: any) {
    console.error('Login Error Code:', error.code);
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return { message: 'Invalid email or password. Please check your credentials and try again.' };
      case 'auth/invalid-email':
        return { message: 'The email address is not formatted correctly.' };
      case 'auth/internal-error':
        return { message: 'An internal error occurred on the server. Please try again later.' };
      default:
        return { message: `Login failed: ${error.message} (Code: ${error.code})` };
    }
  }
  redirect('/home');
}
