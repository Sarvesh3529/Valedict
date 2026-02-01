'use client';

import { useState, useEffect } from 'react';
import type { QuizQuestion, QuizResult } from '@/lib/types';
import QuizSetup from '@/components/quiz/quiz-setup';
import QuizView from '@/components/quiz/quiz-view';
import QuizResults from '@/components/quiz/quiz-results';
import { generateQuiz } from '@/lib/quiz-logic';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type QuizState = 'setup' | 'active' | 'results';

export default function QuizPage() {
  const { user, loading: userLoading, updateUserStreak } = useAuth();
  const router = useRouter();

  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [userGrade, setUserGrade] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.replace('/');
      return;
    }
    
    const fetchGrade = async () => {
      const docRef = doc(db, 'onboardingResponses', user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().grade) {
          setUserGrade(docSnap.data().grade);
        } else {
          // If no grade, maybe redirect to onboarding? For now, default.
          setUserGrade('9');
        }
      } catch (error) {
        console.error("Error fetching user grade:", error);
        setUserGrade('9'); // Default on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchGrade();
  }, [user, userLoading, router]);

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
    updateUserStreak();
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
  
  if (userLoading || loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading Quiz...</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary text-center">
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <div className="p-6 md:p-8">
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
