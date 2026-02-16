'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';

// UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { BrainCircuit, NotebookText, ArrowRight, BookOpen } from 'lucide-react';
import StreakDisplay from '@/components/StreakDisplay';
import { subjects, chapters } from '@/lib/data';
import WeeklyProgressChart from '@/components/home/WeeklyProgressChart';

const iconComponents: { [key: string]: React.ElementType } = {
  Calculator: Icons.Calculator,
  Zap: Icons.Zap,
  FlaskConical: Icons.FlaskConical,
  Leaf: Icons.Leaf,
};

function ContinueLearningCard({ chapterId }: { chapterId: string }) {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return null;

    return (
         <Card className="h-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 flex flex-col justify-between p-6">
            <div>
                <div className="mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                    <BookOpen className="h-7 w-7 text-accent"/>
                  </div>
                </div>
                <p className="text-sm text-accent font-semibold mb-1">Continue Learning</p>
                <h3 className="text-xl font-bold font-headline mb-1">{chapter.name}</h3>
            </div>
            <div className="text-accent font-semibold flex items-center mt-4 group-hover:translate-x-1 transition-transform">
                Jump back in <ArrowRight className="ml-2 h-5 w-5"/>
            </div>
        </Card>
    )
}

export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('firebase_token')?.value;

  if (!token) {
    redirect('/');
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    // Invalid token, delete cookie and redirect
    cookieStore.delete('firebase_token');
    redirect('/');
  }

  const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();

  if (!userDoc.exists) {
    // This can happen if signup fails after auth user creation but before DB write.
    // Or if user is deleted from DB but not Auth.
    cookieStore.delete('firebase_token');
    redirect('/');
  }

  const profile = { uid: userDoc.id, ...userDoc.data() } as UserProfile;

  if (profile.onboardingComplete === false) {
    redirect('/onboarding/start');
  }
  
  const lastActiveDate = profile.lastactive?.toDate().toISOString();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-foreground mb-2">
          Welcome Back, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{profile?.username || 'Student'}</span>!
        </h1>
        <p className="text-lg text-muted-foreground">What will you learn today?</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-10">
            {/* Quick Actions */}
            <div>
                <h2 className="text-3xl font-bold mb-6 font-headline text-primary/90">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/doubt-solver" className="h-full group">
                        <Card className="h-full bg-primary/10 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col justify-between p-6">
                            <div>
                                <BrainCircuit className="h-10 w-10 text-primary mb-4"/>
                                <h3 className="text-xl font-bold font-headline mb-1">AI Doubt Solver</h3>
                                <p className="text-muted-foreground">Stuck? Get an instant explanation.</p>
                            </div>
                            <div className="text-primary font-semibold flex items-center mt-4 group-hover:translate-x-1 transition-transform">
                                Ask a question <ArrowRight className="ml-2 h-5 w-5"/>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/quiz" className="h-full group">
                         <Card className="h-full bg-secondary/70 border-border hover:border-foreground/20 transition-all duration-300 hover:shadow-lg flex flex-col justify-between p-6">
                            <div>
                                <NotebookText className="h-10 w-10 text-foreground/80 mb-4"/>
                                <h3 className="text-xl font-bold font-headline mb-1">Custom Quiz</h3>
                                <p className="text-muted-foreground">Test your knowledge on any chapter.</p>
                            </div>
                            <div className="text-foreground/90 font-semibold flex items-center mt-4 group-hover:translate-x-1 transition-transform">
                                Create a quiz <ArrowRight className="ml-2 h-5 w-5"/>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
             {/* Practice by Subject Section */}
            <div>
                <h2 className="text-3xl font-bold mb-6 font-headline text-primary/90">Practice by Subject</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {subjects.map((subject) => {
                    const Icon = iconComponents[subject.iconName] || Icons.Book;
                    return (
                    <Card key={subject.id} className="flex flex-col group hover:border-primary/40 transition-all duration-300">
                        <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <Icon className="h-7 w-7 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-lg">{subject.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">Practice {subject.chapters.length} chapters and master {subject.name}.</p>
                        </CardContent>
                        <div className="p-6 pt-0">
                        <Button asChild className="w-full">
                            <Link href="/quiz">Start Practice</Link>
                        </Button>
                        </div>
                    </Card>
                    );
                })}
                </div>
            </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8">
            {profile.lastPracticedChapterId && (
                <Link href={`/quiz?chapter=${profile.lastPracticedChapterId}`} className="group">
                    <ContinueLearningCard chapterId={profile.lastPracticedChapterId} />
                </Link>
            )}
            <StreakDisplay 
                currentStreak={profile?.streak || 0}
                highestStreak={profile?.highestStreak || 0}
                lastActivityDate={lastActiveDate}
            />
            <WeeklyProgressChart weeklyXp={profile.weeklyxp || 0} />
        </div>
      </div>
    </div>
  );
}
