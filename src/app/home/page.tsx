'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';

// UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import * as Icons from 'lucide-react';
import { BrainCircuit, NotebookText, ArrowRight, Trophy } from 'lucide-react';
import StreakDisplay from '@/components/StreakDisplay';
import { subjects, chapters } from '@/lib/data';
import WeeklyProgressChart from '@/components/home/WeeklyProgressChart';
import ContinueLearning from '@/components/home/ContinueLearning';
import { generateAvatarColor } from '@/lib/utils';

const iconComponents: { [key: string]: React.ElementType } = {
  Calculator: Icons.Calculator,
  Zap: Icons.Zap,
  FlaskConical: Icons.FlaskConical,
  Leaf: Icons.Leaf,
};

export default async function HomePage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('firebase_token')?.value;

  if (!token) {
    redirect('/');
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    (await cookieStore).delete('firebase_token');
    redirect('/');
  }

  const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();

  if (!userDoc.exists) {
    (await cookieStore).delete('firebase_token');
    redirect('/');
  }

  const profile = { uid: userDoc.id, ...userDoc.data() } as UserProfile;

  if (profile.onboardingComplete === false) {
    redirect('/onboarding/start');
  }
  
  const lastActiveDate = profile.lastactive?.toDate().toISOString();
  const lastPracticedChapter = chapters.find(c => c.id === profile.lastPracticedChapterId);
  const avatarColor = generateAvatarColor(profile.uid);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-10 max-w-5xl">
      {/* Row 1: Welcome Header */}
      <header className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Welcome back, {profile?.username || 'Student'}!
        </h2>
      </header>

      {/* Row 2: Hero Unit (Lesson & Profile) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ContinueLearning chapter={lastPracticedChapter} />
        </div>
        <Link href="/profile" className="group">
          <Card className="h-full flex items-center p-4 border-2 border-border shadow-[0_4px_0_0_rgba(0,0,0,0.05)] hover:border-primary/40 transition-all active:translate-y-[2px] active:shadow-none">
            <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                <AvatarFallback className="text-xl font-black text-white" style={{backgroundColor: avatarColor}}>
                    {profile.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            <div className="ml-4 overflow-hidden">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">My Profile</h3>
                 <h3 className="font-black text-lg truncate">{profile.username}</h3>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Card>
        </Link>
      </div>

      {/* Row 3: Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StreakDisplay 
            currentStreak={profile?.streak || 0}
            highestStreak={profile?.highestStreak || 0}
            lastActivityDate={lastActiveDate}
        />
        <WeeklyProgressChart weeklyXp={profile.weeklyxp || 0} />
        
        <Link href="/leaderboard" className="group sm:col-span-2 lg:col-span-1">
            <Card className="h-full border-2 border-border shadow-[0_4px_0_0_rgba(0,0,0,0.05)] hover:border-primary/40 transition-all active:translate-y-[2px] active:shadow-none flex flex-col justify-between p-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-yellow-400/20 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ranking</h3>
                        <CardTitle className="font-black text-xl">Leaderboard</CardTitle>
                    </div>
                </div>
                <div className="mt-4 text-primary font-bold flex items-center text-sm">
                    VIEW RANKS <ArrowRight className="ml-2 h-4 w-4"/>
                </div>
            </Card>
        </Link>
      </div>

      {/* Row 4: Quick Actions */}
      <section>
        <h2 className="text-xl font-black uppercase tracking-widest text-muted-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <Link href="/doubt-solver" className="group">
                <Card className="h-full bg-primary text-primary-foreground border-b-4 border-primary-foreground/20 hover:bg-primary/95 transition-all p-6 rounded-3xl flex flex-col items-center text-center gap-3 active:translate-y-[4px] active:border-b-0">
                    <BrainCircuit className="h-10 w-10 sm:h-12 sm:w-12 mb-2"/>
                    <h3 className="text-lg sm:text-xl font-black">Doubt Solver</h3>
                </Card>
            </Link>
            <Link href="/quiz" className="group">
                 <Card className="h-full bg-accent text-accent-foreground border-b-4 border-accent-foreground/20 hover:bg-accent/95 transition-all p-6 rounded-3xl flex flex-col items-center text-center gap-3 active:translate-y-[4px] active:border-b-0">
                    <NotebookText className="h-10 w-10 sm:h-12 sm:w-12 mb-2"/>
                    <h3 className="text-lg sm:text-xl font-black">Custom Quiz</h3>
                </Card>
            </Link>
        </div>
      </section>
      
      {/* Row 5: Subjects Section */}
      <section>
          <h2 className="text-xl font-black uppercase tracking-widest text-muted-foreground mb-6">Learn by Subject</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {subjects.map((subject) => {
              const Icon = iconComponents[subject.iconName] || Icons.Book;
              return (
              <Card key={subject.id} className="border-2 border-border shadow-[0_4px_0_0_rgba(0,0,0,0.05)] overflow-hidden group">
                  <div className="p-6 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary group-hover:bg-primary/10 transition-colors">
                          <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="font-black text-xl mb-1">{subject.name}</CardTitle>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {subject.chapters.filter(c => c.grade === profile.grade).length} Chapters
                        </p>
                      </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/quiz">Start Practice</Link>
                    </Button>
                  </div>
              </Card>
              );
          })}
          </div>
      </section>
    </div>
  );
}
