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
  updateStreak: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true, updateStreak: async () => {} });

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

  const updateStreak = async () => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const userData = userDoc.data() as UserProfile;
    const lastQuizDateStr = userData.lastQuizDate;
    const currentStreak = userData.streak || 0;
    const today = new Date();
    
    let newStreak = currentStreak;

    if (lastQuizDateStr) {
      const lastQuizDate = new Date(lastQuizDateStr);
      const diff = differenceInCalendarDays(today, lastQuizDate);

      if (diff === 1) {
        newStreak = currentStreak + 1;
      } else if (diff > 1) {
        newStreak = 1;
      }
      // If diff is 0, do nothing
    } else {
      newStreak = 1;
    }

    // Only update if something changed
    if (newStreak !== currentStreak || !lastQuizDateStr) {
        await updateDoc(userRef, {
            streak: newStreak,
            lastQuizDate: today.toISOString(),
        });
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, profile, loading, updateStreak }}>
      {loading ? (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
