import { subjects } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import * as Icons from 'lucide-react';

const iconComponents: { [key: string]: React.ElementType } = {
  Calculator: Icons.Calculator,
  Zap: Icons.Zap,
  FlaskConical: Icons.FlaskConical,
  Leaf: Icons.Leaf,
  GraduationCap: Icons.GraduationCap
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
          ExamPrep AI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Your personal AI-powered study partner.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="flex flex-col md:col-span-2 lg:col-span-3 bg-primary/10 border-primary">
            <CardHeader>
                <div className='flex items-center gap-4'>
                    <Icons.GraduationCap className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-white">New here? Get started!</CardTitle>
                </div>
                <CardDescription>
                    Answer a few questions to personalize your study plan. It only takes a minute.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/onboarding">Personalize Your Plan</Link>
                </Button>
            </CardContent>
        </Card>

        {subjects.map((subject) => {
          const Icon = iconComponents[subject.iconName];
          return (
            <Card key={subject.id} className="flex flex-col">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                {Icon && <Icon className="h-8 w-8 text-primary" />}
                <CardTitle className="font-headline">{subject.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <h4 className="font-semibold mb-2 text-muted-foreground">Chapters</h4>
                <ul className="space-y-2">
                  {subject.chapters.map((chapter) => (
                    <li key={chapter.id} className="text-sm">
                      {chapter.name}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/quiz">Start Quiz</Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
