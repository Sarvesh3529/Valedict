'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { differenceInCalendarDays } from 'date-fns';
import StreakAnimation from '@/components/StreakAnimation';

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  updateUserStreak: () => Promise<void>;
  showStreakAnimation: boolean;
  hideStreakAnimation: () => void;
  animationStreakCount: number;
};

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    profile: null, 
    loading: true, 
    updateUserStreak: async () => {},
    showStreakAnimation: false,
    hideStreakAnimation: () => {},
    animationStreakCount: 0,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [animationStreakCount, setAnimationStreakCount] = useState(0);

  const hideStreakAnimation = () => setShowStreakAnimation(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile);
          }
          setLoading(false);
        });
        return () => unsubscribeProfile();
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUserStreak = async () => {
    if (!user || !profile) return;
    
    const userRef = doc(db, 'users', user.uid);
    
    const { lastActivityDate, currentStreak = 0, highestStreak = 0 } = profile;
    const today = new Date();
    
    let newStreak = currentStreak;
    let newHighestStreak = highestStreak;
    
    const lastDate = lastActivityDate ? new Date(lastActivityDate) : null;
    const diff = lastDate ? differenceInCalendarDays(today, lastDate) : -1;

    let shouldUpdateDb = false;

    if (diff !== 0) { // Only run if last activity wasn't today
      if (diff === 1) { // Consecutive day
        newStreak = currentStreak + 1;
      } else { // First time or broken streak
        newStreak = 1;
      }
      
      if (newStreak > highestStreak) {
        newHighestStreak = newStreak;
      }

      shouldUpdateDb = true;
    }

    if (shouldUpdateDb) {
      // Trigger animation if the streak has genuinely increased
      if (newStreak > currentStreak || (newStreak === 1 && currentStreak === 0)) {
        setAnimationStreakCount(newStreak);
        setShowStreakAnimation(true);
      }

      // Update Firestore
      await updateDoc(userRef, {
        currentStreak: newStreak,
        highestStreak: newHighestStreak,
        lastActivityDate: today.toISOString(),
      });
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, profile, loading, updateUserStreak, showStreakAnimation, hideStreakAnimation, animationStreakCount }}>
      {loading ? (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      ) : (
        <>
          {children}
          {showStreakAnimation && <StreakAnimation count={animationStreakCount} onComplete={hideStreakAnimation} />}
        </>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
