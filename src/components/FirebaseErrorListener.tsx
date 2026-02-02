'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error: FirestorePermissionError) => {
      // Throw the error so Next.js's development overlay can catch it
      throw error;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null; // This component doesn't render anything
}
