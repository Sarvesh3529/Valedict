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

  const handleStartQuiz = (
    chapterIds: string[],
    count: number,
    grade: string,
    difficulty: 'all' | 'easy' | 'medium' | 'hard'
  ) => {
    const generatedQuestions = generateQuiz(chapterIds, count, grade, difficulty);
    if (generatedQuestions.length > 0) {
      if (generatedQuestions.length < count) {
        alert(
          `Only ${generatedQuestions.length} questions were available for the selected chapters and difficulty. The quiz has been adjusted.`
        );
      }
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

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary text-center">
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <div className="p-6 md:p-8">
          {quizState === 'setup' && <QuizSetup onStart={handleStartQuiz} />}
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
