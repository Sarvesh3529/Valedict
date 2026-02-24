
'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';

// UI components
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { BrainCircuit, ArrowRight, Medal, Compass } from 'lucide-react';
import StreakDisplay from '@/components/StreakDisplay';
import { subjects, chapters } from '@/lib/data';
import WeeklyProgressChart from '@/components/home/WeeklyProgressChart';
import ContinueLearning from '@/components/home/ContinueLearning';
import { ensureWeeklyXPReset } from '@/app/quiz/actions';

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

  // Check and Reset Weekly XP if a new Monday has passed
  const wasReset = await ensureWeeklyXPReset(decodedToken.uid, profile);
  if (wasReset) {
    profile.weeklyxp = 0;
  }
  
  const lastActiveDate = profile.lastactive?.toDate().toISOString();
  const lastPracticedChapter = chapters.find(c => c.id === profile.lastPracticedChapterId);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 max-w-5xl">
      {/* Row 1: Welcome message */}
      <div className="text-center md:text-left mb-2">
        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight font-sans">
          Welcome back, <span className="text-primary">{profile.username}</span>!
        </h1>
      </div>

      {/* Row 2: Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="col-span-1 h-full">
          <StreakDisplay 
              currentStreak={profile?.streak || 0}
              highestStreak={profile?.highestStreak || 0}
              lastActivityDate={lastActiveDate}
          />
        </div>
        <div className="col-span-1 h-full">
          <Link href="/rank-progress" className="block h-full">
            <WeeklyProgressChart weeklyXp={profile.weeklyxp || 0} />
          </Link>
        </div>
        
        <Link href="/leaderboard" className="group h-full col-span-2 md:col-span-1">
            <Card className="h-full w-full glass-card glow-border border-2 bouncy-hover flex flex-col justify-between p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Ranking</h3>
                        <CardTitle className="font-black text-lg md:text-2xl text-foreground">Leaderboard</CardTitle>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                        <Medal className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
                    </div>
                </div>

                <div className="mt-4 text-primary font-black flex items-center text-[10px] md:text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                    <span>View Ranks</span>
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 md:h-4 md:w-4"/>
                </div>
            </Card>
        </Link>
      </div>

      {/* Row 3: Action Row (Continue Learning & AI Doubt Solver) */}
      <section>
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 pl-1">Study Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
            {/* Continue Learning Slot */}
            <div className="h-full">
                {lastPracticedChapter ? (
                    <ContinueLearning chapter={lastPracticedChapter} />
                ) : (
                    <Link href="/quiz" className="group h-full block">
                        <Card className="h-full bg-secondary/50 border-4 border-dashed border-muted-foreground/20 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 hover:border-primary/20 transition-colors">
                            <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center">
                                <Compass className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-muted-foreground">Pick a Subject</h3>
                        </Card>
                    </Link>
                )}
            </div>

            {/* AI Doubt Solver */}
            <Link href="/doubt-solver" className="group h-full">
                <Card className="h-full bg-primary text-primary-foreground border-b-8 border-black/20 hover:border-b-4 hover:translate-y-[4px] active:border-b-0 active:translate-y-[8px] transition-all p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4">
                    <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <BrainCircuit className="h-10 w-10 text-white"/>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">AI Doubt Solver</h3>
                </Card>
            </Link>
        </div>
      </section>
      
      {/* Row 4: Subjects Section */}
      <section>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 pl-1">Learning Path</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {subjects.map((subject) => {
              const Icon = iconComponents[subject.iconName] || Icons.Book;
              const count = subject.chapters.filter(c => c.grade === profile.grade).length;
              if (count === 0) return null;
              
              return (
              <Card key={subject.id} className="glass-card border-2 border-border glow-border bouncy-hover overflow-hidden group">
                  <div className="p-2 md:p-4 flex items-center gap-3 md:gap-4">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors">
                          <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <CardTitle className="font-black text-sm md:text-lg mb-0.5 uppercase tracking-tight text-foreground truncate">{subject.name}</CardTitle>
                        <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                            {count} Chapters
                        </p>
                      </div>
                  </div>
                  <div className="px-2 pb-2 md:px-4 md:pb-4">
                    <Button asChild variant="outline" className="w-full border-2 h-8 md:h-10 text-[10px] md:text-xs">
                        <Link href={`/quiz?subject=${subject.id}`}>Practice</Link>
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
