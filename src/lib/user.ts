import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export async function setupNewUser(user: any) {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        const displayName = user.displayName || user.email?.split('@')[0] || 'Student';
        const profileData = {
            uid: user.uid,
            email: user.email,
            displayName: displayName,
            photoURL: user.photoURL,
            currentStreak: 0,
            highestStreak: 0,
            lastActivityDate: null,
            totalXp: 0,
            weeklyXp: 0,
            lastXpReset: new Date().toISOString(),
            onboardingComplete: false,
        };
        
        await setDoc(userRef, profileData)
          .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'create',
              requestResourceData: profileData,
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
          });
    }
}

export function markOnboardingComplete(userId: string) {
    if (!userId) return;
    const userRef = doc(db, 'users', userId);
    const data = { onboardingComplete: true };
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
