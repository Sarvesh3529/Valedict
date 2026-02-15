'use client';

import { useState, useEffect } from 'react';
import type { QuizQuestion, QuizResult } from '@/lib/types';
import QuizSetup from '@/components/quiz/quiz-setup';
import QuizView from '@/components/quiz/quiz-view';
import QuizResults from '@/components/quiz/quiz-results';
import { generateQuiz } from '@/lib/quiz-logic';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type QuizState = 'setup' | 'active' | 'results';

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const userGrade = '9'; // Hardcoded grade since auth is removed
  const [loading, setLoading] = useState(false);

  // Auto-start quiz if chapterId is in URL
  useEffect(() => {
    const chapterId = searchParams.get('chapter');
    if (chapterId && userGrade) {
        setLoading(true);
        const generatedQuestions = generateQuiz([chapterId], 7, userGrade, 'all');
        if (generatedQuestions.length > 0) {
            setQuestions(generatedQuestions);
            setQuizState('active');
        }
        setLoading(false);
    }
  }, [searchParams, userGrade]);


  const handleStartQuiz = (
    chapterIds: string[],
    count: number,
    difficulty: 'all' | 'easy' | 'medium' | 'hard'
  ) => {
    if (!userGrade) return;

    const generatedQuestions = generateQuiz(chapterIds, count, userGrade, difficulty);
    
    if (generatedQuestions.length > 0) {
      setQuestions(generatedQuestions);
      setQuizState('active');
    } else {
      alert(
        'No questions available for the selected chapters and difficulty. Please select different chapters.'
      );
    }
  };

  const handleFinishQuiz = (finalResults: QuizResult[]) => {
    setResults(finalResults);
    setQuizState('results');
  };

  const handleRestart = () => {
    setQuizState('setup');
    setQuestions([]);
    setResults([]);
    router.push('/quiz');
  };

  const getTitle = () => {
    switch (quizState) {
      case 'setup':
        return 'Create Your Quiz';
      case 'active':
        return 'Quiz in Progress';
      case 'results':
        return 'Quiz Results';
    }
  };
  
  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading Quiz...</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 md:py-12">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-xl md:text-2xl text-primary text-center">
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <div className="p-4 md:p-8">
          {quizState === 'setup' && userGrade && <QuizSetup onStart={handleStartQuiz} userGrade={userGrade} />}
          {quizState === 'active' && questions.length > 0 && (
            <QuizView questions={questions} onFinish={handleFinishQuiz} />
          )}
          {quizState === 'results' && (
            <QuizResults results={results} onRestart={handleRestart} />
          )}
        </div>
      </Card>
    </div>
  );
}
