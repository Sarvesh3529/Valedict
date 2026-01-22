'use client';

import { useState } from 'react';
import type { QuizQuestion, QuizResult } from '@/lib/types';
import QuizSetup from '@/components/quiz/quiz-setup';
import QuizView from '@/components/quiz/quiz-view';
import QuizResults from '@/components/quiz/quiz-results';
import { generateQuiz } from '@/lib/quiz-logic';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

type QuizState = 'setup' | 'active' | 'results';

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);

  const handleStartQuiz = (chapterIds: string[], count: number) => {
    const generatedQuestions = generateQuiz(chapterIds, count);
    if (generatedQuestions.length > 0) {
      setQuestions(generatedQuestions);
      setQuizState('active');
    } else {
      // Handle case where no questions are available for selected chapters
      alert("No questions available for the selected chapters. Please select different chapters.");
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
  };
  
  const getTitle = () => {
    switch(quizState) {
      case 'setup':
        return 'Create Your Quiz';
      case 'active':
        return 'Quiz in Progress';
      case 'results':
        return 'Quiz Results';
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
       <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="font-headline text-2xl text-primary text-center">
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <div className="p-6 md:p-8">
            {quizState === 'setup' && <QuizSetup onStart={handleStartQuiz} />}
            {quizState === 'active' && questions.length > 0 && <QuizView questions={questions} onFinish={handleFinishQuiz} />}
            {quizState === 'results' && <QuizResults results={results} onRestart={handleRestart} />}
        </div>
      </Card>
    </div>
  );
}
