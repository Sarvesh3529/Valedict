'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';

// UI components
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import * as Icons from 'lucide-react';
import { BrainCircuit, NotebookText, ArrowRight, Medal } from 'lucide-react';
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
  
  // Fetch top 3 for the leaderboard card preview
  const topUsersSnapshot = await adminDb.collection('users')
    .orderBy('weeklyxp', 'desc')
    .limit(3)
    .get();
  
  const topUsers = topUsersSnapshot.docs.map(doc => ({
    uid: doc.id,
    username: doc.data().username,
  }));

  const lastActiveDate = profile.lastactive?.toDate().toISOString();
  const lastPracticedChapter = chapters.find(c => c.id === profile.lastPracticedChapterId);
  const avatarColor = generateAvatarColor(profile.uid);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 max-w-5xl">
      {/* Row 1: Hero Unit (Lesson & Profile) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ContinueLearning chapter={lastPracticedChapter} />
        </div>
        
        {/* Profile Card - Hidden on Mobile (where footer is visible) */}
        <Link href="/profile" className="hidden md:flex group">
          <Card className="h-full w-full glass-card glow-border border-2 flex items-center p-6 bouncy-hover overflow-hidden">
            <Avatar className="h-16 w-16 border-4 border-white dark:border-slate-800 shadow-xl">
                <AvatarFallback className="text-2xl font-black text-white" style={{backgroundColor: avatarColor}}>
                    {profile.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            <div className="ml-4 overflow-hidden">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">My Dashboard</h3>
                 <h3 className="font-black text-xl truncate">{profile.username}</h3>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Card>
        </Link>
      </div>

      {/* Row 2: Main Stats Grid - Updated to stay 3 columns on small screens */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        <div className="col-span-1 h-full">
          <StreakDisplay 
              currentStreak={profile?.streak || 0}
              highestStreak={profile?.highestStreak || 0}
              lastActivityDate={lastActiveDate}
          />
        </div>
        <div className="col-span-1 h-full">
          <WeeklyProgressChart weeklyXp={profile.weeklyxp || 0} />
        </div>
        
        {/* Leaderboard Link - Simplified on devices with footer visible */}
        <Link href="/leaderboard" className="group h-full col-span-1">
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

                <div className="space-y-4">
                    {/* Hidden on mobile/landscape where footer is visible */}
                    <div className="hidden md:flex items-center gap-4 py-2 border-t border-white/5">
                        <div className="flex-1">
                            <p className="text-xs font-black uppercase text-muted-foreground">Top Students</p>
                            <p className="text-sm font-bold flex items-center gap-1">
                                Join the competition!
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-foreground">{profile.totalxp} XP</p>
                        </div>
                    </div>

                    {/* Avatars hidden on mobile/landscape where footer is visible */}
                    <div className="hidden md:flex -space-x-3">
                        {topUsers.map((user, i) => (
                            <Avatar key={user.uid} className="h-8 w-8 border-2 border-background shadow-lg">
                                <AvatarFallback style={{backgroundColor: generateAvatarColor(user.uid)}} className="text-[10px] font-black text-white">
                                    {user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-black border-2 border-background">
                            +{topUsers.length > 0 ? '47' : '0'}
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-primary font-black flex items-center text-[10px] md:text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                    <span className="hidden sm:inline">View Ranks</span>
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 md:h-4 md:w-4"/>
                </div>
            </Card>
        </Link>
      </div>

      {/* Row 3: Quick Actions */}
      <section>
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 pl-1">Power Tools</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <Link href="/doubt-solver" className="group col-span-2 md:col-span-1">
                <Card className="h-full bg-primary text-primary-foreground border-b-8 border-black/20 hover:border-b-4 hover:translate-y-[4px] active:border-b-0 active:translate-y-[8px] transition-all p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
                    <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <BrainCircuit className="h-10 w-10 text-white"/>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">AI Doubt Solver</h3>
                </Card>
            </Link>
            
            {/* Custom Quiz Link - Hidden on Mobile (where footer is visible) */}
            <Link href="/quiz" className="hidden md:flex group h-full">
                 <Card className="h-full w-full bg-accent text-accent-foreground border-b-8 border-black/20 hover:border-b-4 hover:translate-y-[4px] active:border-b-0 active:translate-y-[8px] transition-all p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
                    <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <NotebookText className="h-10 w-10 text-white"/>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Custom Quiz</h3>
                </Card>
            </Link>
        </div>
      </section>
      
      {/* Row 4: Subjects Section */}
      <section>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 pl-1">Learning Path</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {subjects.map((subject) => {
              const Icon = iconComponents[subject.iconName] || Icons.Book;
              const count = subject.chapters.filter(c => c.grade === profile.grade).length;
              if (count === 0) return null;
              
              return (
              <Card key={subject.id} className="glass-card border-2 border-border glow-border bouncy-hover overflow-hidden group">
                  <div className="p-6 flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary group-hover:bg-primary/10 transition-colors">
                          <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="font-black text-xl mb-1 uppercase tracking-tight text-foreground">{subject.name}</CardTitle>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                            {count} Chapters
                        </p>
                      </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Button asChild variant="outline" className="w-full border-2">
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
