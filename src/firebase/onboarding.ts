'use client';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Note: We're not using the global error emitter here to avoid complexity
// in the onboarding flow. A simple console.error is sufficient.

export async function saveOnboardingResponse(anonId: string, data: Record<string, any>) {
  if (!anonId) {
    console.error("Anonymous user ID is missing. Cannot save onboarding response.");
    return;
  }
  
  try {
    const db = getFirestore();
    const responseRef = doc(db, 'onboardingResponses', anonId);
    
    await setDoc(responseRef, {
      ...data,
      anonId: anonId,
      updatedAt: serverTimestamp(),
    }, { merge: true });

  } catch (error) {
    console.error("Error saving onboarding response to Firestore:", error);
  }
}
