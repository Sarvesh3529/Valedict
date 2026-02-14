'use server';

import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

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
    // 1. Create user in Firebase Auth with a dummy email
    const dummyEmail = `${usernameLower}@myapp.local`;
    const userCredential = await createUserWithEmailAndPassword(auth, dummyEmail, password);
    const user = userCredential.user;
    
    // 2. Update the Auth profile's displayName
    await updateProfile(user, { displayName: username });
    
    // 3. Set the session cookie and redirect
    const token = await user.getIdToken();
    await setSessionCookie(token);

  } catch (error: any) {
    console.error("SIGNUP ERROR:", error);
    // auth/email-already-in-use is the error code for a duplicate username in our setup
    if (error.code === 'auth/email-already-in-use') {
        return { message: 'This username is already taken. Please choose another.' };
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
