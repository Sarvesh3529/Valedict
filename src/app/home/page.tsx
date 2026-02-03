'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { subjects } from '@/lib/data';
import * as Icons from 'lucide-react';
import { BrainCircuit, NotebookText, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import StreakDisplay from '@/components/StreakDisplay';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This is needed because of the dynamic icon loading
const iconComponents: { [key: string]: React.ElementType } = {
  Calculator: Icons.Calculator,
  Zap: Icons.Zap,
  FlaskConical: Icons.FlaskConical,
  Leaf: Icons.Leaf,
};

export default function HomePage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && profile && profile.usernameIsSet !== true) {
      router.replace('/onboarding/set-username');
    }
  }, [profile, loading, router]);


  if (loading || (profile && profile.usernameIsSet !== true)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <header className="mb-8">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-2">
          Welcome Back, {profile?.displayName?.split(' ')[0] || 'Student'}!
        </h1>
      </header>

      {/* Stats Section */}
      <div className="mb-12">
        <StreakDisplay 
            currentStreak={profile?.currentStreak || 0}
            highestStreak={profile?.highestStreak || 0}
            lastActivityDate={profile?.lastActivityDate}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 font-headline">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/doubt-solver" className="h-full">
                <Card className="h-full bg-primary/10 hover:bg-primary/20 transition-colors flex flex-col justify-between p-4 md:p-6">
                    <div>
                        <BrainCircuit className="h-8 w-8 md:h-10 md:w-10 text-primary mb-4"/>
                        <h3 className="text-lg md:text-xl font-bold font-headline mb-1">AI Doubt Solver</h3>
                        <p className="text-muted-foreground">Stuck? Get an instant explanation.</p>
                    </div>
                    <div className="text-primary font-semibold flex items-center mt-4">
                        Ask a question <ArrowRight className="ml-2 h-5 w-5"/>
                    </div>
                </Card>
            </Link>
            <Link href="/quiz" className="h-full">
                 <Card className="h-full bg-accent/10 hover:bg-accent/20 transition-colors flex flex-col justify-between p-4 md:p-6">
                    <div>
                        <NotebookText className="h-8 w-8 md:h-10 md:w-10 text-accent mb-4"/>
                        <h3 className="text-lg md:text-xl font-bold font-headline mb-1">Custom Quiz</h3>
                        <p className="text-muted-foreground">Test your knowledge on any chapter.</p>
                    </div>
                    <div className="text-accent font-semibold flex items-center mt-4">
                        Create a quiz <ArrowRight className="ml-2 h-5 w-5"/>
                    </div>
                </Card>
            </Link>
        </div>
      </div>

      {/* Practice by Subject Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 font-headline">Practice by Subject</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const Icon = iconComponents[subject.iconName] || Icons.GraduationCap;
            return (
              <Card key={subject.id} className="flex flex-col">
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  <Icon className="h-7 w-7 text-primary" />
                  <CardTitle className="font-headline">{subject.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                </CardContent>
                <div className="p-4 md:p-6 pt-0">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
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
