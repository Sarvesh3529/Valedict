'use server';

import { initializeFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { redirect } from 'next/navigation';

async function handleUserSetup(user: any) {
    const { firestore } = initializeFirebase();
    const userRef = doc(firestore, 'users', user.uid);
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
  const { auth } = initializeFirebase();
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
  const { auth } = initializeFirebase();
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

export async function signInWithGoogle() {
    const { auth } = initializeFirebase();
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await handleUserSetup(result.user);
    } catch (error: any) {
        console.error("Google Sign-In Error:", error);
        // This is a server action, returning a message won't work well on redirect.
        // For now, we redirect to login with an error, a better implementation
        // would handle this more gracefully on the client.
        return redirect('/?error=google-signin-failed');
    }
    redirect('/home');
}

export async function logout() {
    const { auth } = initializeFirebase();
    await auth.signOut();
    redirect('/');
}
