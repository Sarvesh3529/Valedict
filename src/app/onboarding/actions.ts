'use server';

import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function saveOnboardingData(data: Record<string, any>) {
  const cookieStore = cookies();
  const token = cookieStore.get('firebase_token')?.value;

  if (!token) {
    // This shouldn't happen if middleware is working, but good to check.
    return { success: false, message: 'User not authenticated.' };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userRef = adminDb.collection('users').doc(uid);
    // Use update instead of set with merge to avoid overwriting the whole doc if it exists.
    await userRef.update(data);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error saving onboarding data:", error);
    // Don't expose internal errors to client.
    return { success: false, message: 'Could not save onboarding data.' };
  }
}


export async function completeOnboarding() {
  const cookieStore = cookies();
  const token = cookieStore.get('firebase_token')?.value;

  if (!token) {
    return { success: false, message: 'User not authenticated.' };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userRef = adminDb.collection('users').doc(uid);
    await userRef.update({ onboardingComplete: true });
    
    return { success: true };
  } catch (error: any) {
    console.error("Error completing onboarding:", error);
    return { success: false, message: 'Could not complete onboarding.' };
  }
}
