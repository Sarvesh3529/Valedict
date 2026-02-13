'use client';
import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { doc, onSnapshot, updateDoc, increment, getDoc, Timestamp } from 'firebase/firestore';
import { differenceInCalendarDays, isSameWeek } from 'date-fns';
import StreakAnimation from '@/components/StreakAnimation';
import XpAnimation from '@/components/XpAnimation';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateUserStreak: () => Promise<void>;
  awardXp: (questionCount: number) => Promise<void>;
  showStreakAnimation: boolean;
  hideStreakAnimation: () => void;
  animationStreakCount: number;
  showXpAnimation: boolean;
  hideXpAnimation: () => void;
  animationXpCount: number;
};

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    profile: null, 
    loading: true, 
    signOut: async () => {},
    updateUserStreak: async () => {},
    awardXp: async () => {},
    showStreakAnimation: false,
    hideStreakAnimation: () => {},
    animationStreakCount: 0,
    showXpAnimation: false,
    hideXpAnimation: () => {},
    animationXpCount: 0,
});

function getXpForQuestions(count: number): number {
  if (count >= 15) return 30;
  if (count >= 10) return 30;
  if (count >= 5) return 10;
  // For revision quizzes with 7 questions
  if (count === 7) return 10; 
  return 0;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Streak Animation State
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [animationStreakCount, setAnimationStreakCount] = useState(0);

  // XP Animation State
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [animationXpCount, setAnimationXpCount] = useState(0);

  const hideStreakAnimation = () => setShowStreakAnimation(false);
  const hideXpAnimation = () => setShowXpAnimation(false);

  const signOut = useCallback(async () => {
    try {
      await auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' }); // Clear server cookie
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, [router]);

  // Handle user authentication state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Handle profile fetching via a realtime listener
  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const unsubscribeProfile = onSnapshot(userRef, 
        (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // This handles new users whose doc hasn't been created yet.
            // It prevents the app from getting stuck on "Waiting for profile data".
            console.warn("User document not found for UID:", user.uid, ". Using temporary profile.");
            const tempProfile: UserProfile = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                onboardingComplete: false,
                currentStreak: 0,
                highestStreak: 0,
                totalXp: 0,
                weeklyXp: 0,
            };
            setProfile(tempProfile);
          }
        },
        (error) => {
          console.error("Profile snapshot error:", error);
          if (error.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'get',
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
          }
          setProfile(null);
        }
      );
      return () => unsubscribeProfile();
    } else {
      // If there is no user, there's no profile.
      setProfile(null);
    }
  }, [user]);

  const updateUserStreak = useCallback(async () => {
    if (!user || !profile) return;
    
    const userRef = doc(db, 'users', user.uid);
    
    const { lastActivityDate, currentStreak = 0, highestStreak = 0 } = profile;
    const today = new Date();
    
    const lastDate = lastActivityDate ? new Date(lastActivityDate) : null;
    const diff = lastDate ? differenceInCalendarDays(today, lastDate) : -1;

    let newStreak = currentStreak;
    let newHighestStreak = highestStreak;
    let shouldUpdateDb = false;

    if (diff !== 0) { 
      if (diff === 1) { 
        newStreak = currentStreak + 1;
      } else { 
        newStreak = 1;
      }
      
      if (newStreak > highestStreak) {
        newHighestStreak = newStreak;
      }

      shouldUpdateDb = true;
    }

    if (shouldUpdateDb) {
      if (newStreak > currentStreak || (newStreak === 1 && currentStreak === 0)) {
        setAnimationStreakCount(newStreak);
        setShowStreakAnimation(true);
      }

      const updateData = {
        currentStreak: newStreak,
        highestStreak: newHighestStreak,
        lastActivityDate: today.toISOString(),
      };
      
      // Optimistically update local state
      // setProfile(p => p ? { ...p, ...updateData } : null);

      updateDoc(userRef, updateData)
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: updateData,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });
    }
  }, [user, profile]);
  
  const awardXp = useCallback(async (questionCount: number) => {
    if (!user || !profile) return;
    const xpToAward = getXpForQuestions(questionCount);
    if (xpToAward === 0) return;

    setAnimationXpCount(xpToAward);
    setShowXpAnimation(true);

    const userRef = doc(db, 'users', user.uid);
    const today = new Date();
    const lastReset = profile.lastXpReset ? new Date(profile.lastXpReset) : new Date(0);

    const needsWeeklyReset = !isSameWeek(today, lastReset, { weekStartsOn: 1 });

    let updateData: Record<string, any>;
    let updateDataForError: Record<string, any>;

    if (needsWeeklyReset) {
      updateData = {
        weeklyXp: xpToAward,
        totalXp: increment(xpToAward),
        lastXpReset: today.toISOString(),
      };
       updateDataForError = {
        weeklyXp: xpToAward,
        totalXp: `increment(${xpToAward})`,
        lastXpReset: today.toISOString(),
      };
    } else {
      updateData = {
        weeklyXp: increment(xpToAward),
        totalXp: increment(xpToAward),
      };
       updateDataForError = {
        weeklyXp: `increment(${xpToAward})`,
        totalXp: `increment(${xpToAward})`,
      };
    }

    updateDoc(userRef, updateData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: updateDataForError,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  }, [user, profile]);
  
  const value = { 
        user, 
        profile, 
        loading, 
        signOut,
        updateUserStreak, 
        awardXp, 
        showStreakAnimation, 
        hideStreakAnimation, 
        animationStreakCount,
        showXpAnimation,
        hideXpAnimation,
        animationXpCount
    };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      ) : (
        <>
          <FirebaseErrorListener />
          {children}
          {showStreakAnimation && <StreakAnimation count={animationStreakCount} onComplete={hideStreakAnimation} />}
          {showXpAnimation && <XpAnimation xp={animationXpCount} onComplete={hideXpAnimation} />}
        </>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
