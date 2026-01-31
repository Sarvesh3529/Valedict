'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateQuiz } from '@/lib/quiz-logic';
import type { QuizQuestion, QuizResult } from '@/lib/types';
import { subjects } from '@/lib/data';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import QuizView from '@/components/quiz/quiz-view';
import QuizResults from '@/components/quiz/quiz-results';

function RevisionSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectIdsParam = searchParams.get('subjects');
  const grade = searchParams.get('grade');

  const [results, setResults] = useState<QuizResult[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const revisionQuestions: QuizQuestion[] = useMemo(() => {
    if (!subjectIdsParam || !grade) return [];
    
    const subjectIds = subjectIdsParam.split(',');
    
    const chapterIds = subjects
      .filter(s => subjectIds.includes(s.id))
      .flatMap(s => s.chapters.filter(c => c.grade === grade))
      .map(c => c.id);

    if (chapterIds.length === 0) return [];
      
    // Generate a quick revision quiz of 7 questions from all relevant chapters
    return generateQuiz(chapterIds, 7, grade, 'all');
  }, [subjectIdsParam, grade]);

  const handleFinishQuiz = (finalResults: QuizResult[]) => {
    setResults(finalResults);
    setIsFinished(true);
  };

  const handleRestart = () => {
    // For a revision session, restarting should take you to the main dashboard
    router.push('/home');
  };

  if (!subjectIdsParam || !grade) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <Card className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <CardHeader>
                <CardTitle>Invalid Session</CardTitle>
                <CardDescription>Required subject or grade information is missing.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.push('/home')}>Go to Dashboard</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (revisionQuestions.length === 0) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <Card className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Loader2 className="animate-spin"/>
                  Preparing Your Lesson...
                </CardTitle>
                <CardDescription>We're finding the best questions for you. If this takes too long, please go to the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.push('/home')}>Go to Dashboard</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Card className="overflow-hidden bg-slate-800/50 rounded-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary text-center">
                {isFinished ? 'Revision Results' : 'Quick Revision Session'}
            </CardTitle>
          </CardHeader>
          <div className="p-6 md:p-8">
            {!isFinished ? (
              <QuizView questions={revisionQuestions} onFinish={handleFinishQuiz} />
            ) : (
              <QuizResults results={results} onRestart={handleRestart} />
            )}
          </div>
        </Card>
      </div>
  );
}

export default function RevisionSessionPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading Lesson...</div>}>
            <RevisionSessionContent />
        </Suspense>
    )
}
