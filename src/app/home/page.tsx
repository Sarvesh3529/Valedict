'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';

// UI components
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Row 1: Welcome Header */}
      <header>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome Back, {profile?.username || 'Student'}!
        </h2>
      </header>

      {/* Row 2: Continue Learning & Profile - Responsive Side-by-Side */}
       <div className={`grid gap-4 ${lastPracticedChapter ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {lastPracticedChapter && <ContinueLearning chapter={lastPracticedChapter} />}

        <Link href="/profile" className="group">
          <Card className="h-full flex items-center p-3 sm:p-4 hover:border-primary/40 transition-colors">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarFallback className="text-lg sm:text-xl font-semibold text-white" style={{backgroundColor: avatarColor}}>
                    {profile.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            <div className="ml-3 sm:ml-4 hidden xs:block overflow-hidden">
                 <h3 className="font-bold text-sm sm:text-base truncate">{profile.username}</h3>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Card>
        </Link>
      </div>

      {/* Row 3: Stats - Grid Logic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StreakDisplay 
            currentStreak={profile?.streak || 0}
            highestStreak={profile?.highestStreak || 0}
            lastActivityDate={lastActiveDate}
        />
        <WeeklyProgressChart weeklyXp={profile.weeklyxp || 0} />
        
        {/* Leaderboard takes full width row on tablet, but joins 3-col grid on desktop */}
        <Link href="/leaderboard" className="h-full group sm:col-span-2 lg:col-span-1">
            <Card className="h-full flex flex-col justify-between hover:border-primary/40 transition-colors">
                <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2 flex-grow">
                    <Trophy className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline text-primary/90">Leaderboard</CardTitle>
                </CardHeader>
                <CardFooter className="pt-4">
                    <div className="text-primary font-semibold flex items-center group-hover:translate-x-1 transition-transform text-sm">
                        View Ranks <ArrowRight className="ml-2 h-4 w-4"/>
                    </div>
                </CardFooter>
            </Card>
        </Link>
      </div>

      {/* Row 4: Quick Actions */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-headline text-primary/90">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <Link href="/doubt-solver" className="h-full group">
                <Card className="h-full bg-primary/10 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col justify-between p-4 sm:p-6">
                    <div>
                        <BrainCircuit className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3 sm:mb-4"/>
                        <h3 className="text-base sm:text-xl font-bold font-headline mb-1">Doubt Solver</h3>
                    </div>
                    <div className="text-primary font-semibold flex items-center mt-4 group-hover:translate-x-1 transition-transform text-xs sm:text-sm">
                        Ask <ArrowRight className="ml-1 sm:ml-2 h-4 w-4"/>
                    </div>
                </Card>
            </Link>
            <Link href="/quiz" className="h-full group">
                 <Card className="h-full bg-secondary/70 border-border hover:border-foreground/20 transition-all duration-300 hover:shadow-lg flex flex-col justify-between p-4 sm:p-6">
                    <div>
                        <NotebookText className="h-8 w-8 sm:h-10 sm:w-10 text-foreground/80 mb-3 sm:mb-4"/>
                        <h3 className="text-base sm:text-xl font-bold font-headline mb-1">Custom Quiz</h3>
                    </div>
                    <div className="text-foreground/90 font-semibold flex items-center mt-4 group-hover:translate-x-1 transition-transform text-xs sm:text-sm">
                        Create <ArrowRight className="ml-1 sm:ml-2 h-4 w-4"/>
                    </div>
                </Card>
            </Link>
        </div>
      </div>
      
      {/* Row 5: Practice by Subject Section */}
      <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-headline text-primary/90">Practice</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {subjects.map((subject) => {
              const Icon = iconComponents[subject.iconName] || Icons.Book;
              return (
              <Card key={subject.id} className="flex flex-col group hover:border-primary/40 transition-all duration-300 justify-between">
                  <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                      </div>
                      <CardTitle className="font-headline text-base sm:text-lg">{subject.name}</CardTitle>
                  </CardHeader>
                  <div className="p-4 sm:p-6 pt-0">
                  <Button asChild className="w-full" size="sm">
                      <Link href="/quiz">Start Practice</Link>
                  </Button>
                  </div>
              </Card>
              );
          })}
          </div>
      </div>

    </div>
  );
}
