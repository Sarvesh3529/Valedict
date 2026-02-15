'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { subjects, chapters } from '@/lib/data';
import * as Icons from 'lucide-react';
import { BrainCircuit, NotebookText, ArrowRight } from 'lucide-react';

// This is needed because of the dynamic icon loading
const iconComponents: { [key: string]: React.ElementType } = {
  Calculator: Icons.Calculator,
  Zap: Icons.Zap,
  FlaskConical: Icons.FlaskConical,
  Leaf: Icons.Leaf,
};

export default function HomePage() {
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <header className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-2">
          Welcome, Student!
        </h1>
        <p className="text-muted-foreground">Let's make today a productive day.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div>
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
                         <Card className="h-full bg-secondary hover:bg-secondary/80 transition-colors flex flex-col justify-between p-4 md:p-6">
                            <div>
                                <NotebookText className="h-8 w-8 md:h-10 md:w-10 text-foreground/80 mb-4"/>
                                <h3 className="text-lg md:text-xl font-bold font-headline mb-1">Custom Quiz</h3>
                                <p className="text-muted-foreground">Test your knowledge on any chapter.</p>
                            </div>
                            <div className="text-foreground/90 font-semibold flex items-center mt-4">
                                Create a quiz <ArrowRight className="ml-2 h-5 w-5"/>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
             {/* Practice by Subject Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4 font-headline">Practice by Subject</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {subjects.map((subject) => {
                    const Icon = iconComponents[subject.iconName] || Icons.GraduationCap;
                    return (
                    <Card key={subject.id} className="flex flex-col">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                        <Icon className="h-7 w-7 text-primary" />
                        <CardTitle className="font-headline">{subject.name}</CardTitle>
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
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Welcome to Valedict AI</CardTitle>
                    <CardDescription>Your personal AI-powered learning assistant.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Use the tools on this page to solve doubts, practice subjects, and test your knowledge with custom quizzes.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>

    </div>
  );
}
