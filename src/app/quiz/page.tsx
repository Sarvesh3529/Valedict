'use client';

import { useState, useEffect } from 'react';
import type { QuizQuestion, QuizResult } from '@/lib/types';
import QuizSetup from '@/components/quiz/quiz-setup';
import QuizView from '@/components/quiz/quiz-view';
import QuizResults from '@/components/quiz/quiz-results';
import { generateQuiz } from '@/lib/quiz-logic';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

type QuizState = 'setup' | 'active' | 'results';

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [userGrade, setUserGrade] = useState<string | null>(null);

  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    if (!auth || !firestore) return;
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(firestore, 'onboardingResponses', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().grade) {
          setUserGrade(docSnap.data().grade);
        } else {
          setUserGrade('9'); // Default to Grade 9 if not specified in profile
        }
      } else {
        // If there's no user for some reason, default to Grade 9
        setUserGrade('9');
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const handleStartQuiz = (
    chapterIds: string[],
    count: number,
    difficulty: 'all' | 'easy' | 'medium' | 'hard'
  ) => {
    if (!userGrade) return; // Should not happen due to UI gating

    const generatedQuestions = generateQuiz(chapterIds, count, userGrade, difficulty);
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
          {!userGrade ? (
             <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading your profile...</p>
            </div>
          ) : (
            <>
              {quizState === 'setup' && <QuizSetup onStart={handleStartQuiz} userGrade={userGrade} />}
              {quizState === 'active' && questions.length > 0 && (
                <QuizView questions={questions} onFinish={handleFinishQuiz} />
              )}
              {quizState === 'results' && (
                <QuizResults results={results} onRestart={handleRestart} />
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
