'use client';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';


export async function checkUsernameAvailability(username: string): Promise<{ available: boolean, message: string }> {
  if (!username || username.length < 3) {
    return { available: false, message: 'Username must be at least 3 characters.' };
  }
  if (username.length > 20) {
      return { available: false, message: 'Username must be 20 characters or less.' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { available: false, message: 'Only letters, numbers, and underscores.' };
  }

  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('displayName', '==', username));
  
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { available: false, message: 'This username is already taken.' };
    }
    return { available: true, message: 'Username is available!' };
  } catch (error) {
    // This is a read operation. If it fails due to permissions, let's report it.
    const permissionError = new FirestorePermissionError({
        path: usersRef.path,
        operation: 'list',
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', permissionError);
    return { available: false, message: 'Error checking username.' };
  }
}

export function updateUserDisplayName(userId: string, newDisplayName: string): void {
  if (!userId) {
    console.error('User not authenticated for updateUserDisplayName.');
    return;
  }

  const userRef = doc(db, 'users', userId);
  const data = { displayName: newDisplayName };

  // Fire-and-forget, with error handling chained via .catch()
  updateDoc(userRef, data)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'update',
        requestResourceData: data,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
}
