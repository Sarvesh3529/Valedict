'use client';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';


export async function saveOnboardingResponse(userId: string, data: Record<string, any>) {
  if (!userId) {
    console.error("User ID is missing. Cannot save onboarding response.");
    return;
  }
  
  const responseRef = doc(db, 'onboardingResponses', userId);
  
  const dataToSave = {
    ...data,
    userId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const dataForError = {
    ...data,
    userId: userId,
    createdAt: 'serverTimestamp()',
    updatedAt: 'serverTimestamp()',
  };
    
  setDoc(responseRef, dataToSave, { merge: true })
    .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: responseRef.path,
          operation: 'update',
          requestResourceData: dataForError,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
}
