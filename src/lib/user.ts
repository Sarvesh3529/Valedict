import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { type User } from 'firebase/auth';

export async function setupNewUser(user: User) {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        // For both email and Google signups, displayName is initially null
        // to force the user to the set-username page.
        // The user's real name from Google is stored for potential future use.
        const profileData = {
            uid: user.uid,
            email: user.email,
            displayName: null,
            realName: user.displayName || null,
            photoURL: user.photoURL,
            currentStreak: 0,
            highestStreak: 0,
            lastActivityDate: null,
            totalXp: 0,
            weeklyXp: 0,
            lastXpReset: new Date().toISOString(),
            onboardingComplete: false,
            achievements: [],
            lastPracticedChapterId: null,
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
