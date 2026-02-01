'use client';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Note: We're not using the global error emitter here to avoid complexity
// in the onboarding flow. A simple console.error is sufficient.

export async function saveOnboardingResponse(userId: string, data: Record<string, any>) {
  if (!userId) {
    console.error("User ID is missing. Cannot save onboarding response.");
    return;
  }
  
  try {
    const responseRef = doc(db, 'onboardingResponses', userId);
    
    await setDoc(responseRef, {
      ...data,
      userId: userId,
      createdAt: serverTimestamp(), // Use server timestamp for creation
      updatedAt: serverTimestamp(),
    }, { merge: true });

  } catch (error) {
    console.error("Error saving onboarding response to Firestore:", error);
  }
}
