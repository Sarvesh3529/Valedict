'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { differenceInCalendarDays } from 'date-fns';

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  updateUserStreak: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true, updateUserStreak: async () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const userData = userDoc.data() as UserProfile;
    const lastActivityDateStr = userData.lastActivityDate;
    const currentStreak = userData.currentStreak || 0;
    const highestStreak = userData.highestStreak || 0;
    const today = new Date();
    
    let newStreak = currentStreak;
    let newHighestStreak = highestStreak;

    // Case 1: First activity ever
    if (!lastActivityDateStr) {
      newStreak = 1;
    } else {
      const lastActivityDate = new Date(lastActivityDateStr);
      const diff = differenceInCalendarDays(today, lastActivityDate);
      
      // Case 2 (Consecutive Day): last activity was yesterday
      if (diff === 1) {
        newStreak = currentStreak + 1;
      } 
      // Case 3 (Broken Streak): last activity was more than 1 day ago
      else if (diff > 1) {
        newStreak = 1; // Reset to 1 for today's activity
      }
      // Case 4 (Same Day): diff is 0, do nothing to streak
    }

    // Update highest streak if current streak surpasses it
    if (newStreak > newHighestStreak) {
      newHighestStreak = newStreak;
    }
    
    const lastDate = lastActivityDateStr ? new Date(lastActivityDateStr) : null;
    const hasDateChanged = !lastDate || differenceInCalendarDays(today, lastDate) !== 0;

    // Only update if the user hasn't already done an activity today
    if (hasDateChanged) {
        await updateDoc(userRef, {
            currentStreak: newStreak,
            highestStreak: newHighestStreak,
            lastActivityDate: today.toISOString(),
        });
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, profile, loading, updateUserStreak }}>
      {loading ? (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
