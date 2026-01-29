'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { generateRevisionSet } from '@/lib/revision-logic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRight, PartyPopper } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function RevisionSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectIdsParam = searchParams.get('subjects');
  const grade = searchParams.get('grade');

  const revisionItems = useMemo(() => {
    if (!subjectIdsParam || !grade) return [];
    const subjectIds = subjectIdsParam.split(',');
    return generateRevisionSet(subjectIds, grade, 7);
  }, [subjectIdsParam, grade]);

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  useEffect(() => {
    if (revisionItems.length > 0) {
      setStartTime(Date.now());
      setUserAnswers(Array(revisionItems.length).fill(null));
    }
  }, [revisionItems.length]);
  
  const commitAnswer = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentItemIndex] = selectedOption;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    commitAnswer();
    if (currentItemIndex < revisionItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setSelectedOption(userAnswers[currentItemIndex + 1] ?? null);
    }
  };

  const handleFinish = () => {
    commitAnswer();
    setEndTime(Date.now());
    setCurrentItemIndex(revisionItems.length);
  }

  if (revisionItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <Card className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <CardHeader>
                <CardTitle>Content Loading...</CardTitle>
                <CardDescription>We're preparing your lesson. If this takes too long, please go to the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (currentItemIndex >= revisionItems.length) {
    const correctAnswersCount = userAnswers.filter((answer, index) => answer !== null && answer === revisionItems[index].correctAnswer).length;
    const totalQuestions = revisionItems.length;
    const accuracy = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 100 : 0;
    const timeTaken = endTime > 0 && startTime > 0 ? Math.round((endTime - startTime) / 1000) : 0;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full"
            >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <PartyPopper className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Revision Complete!</h1>
                <p className="text-slate-400 mb-6">Here's how you did in your first session.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center my-8">
                    <div>
                        <p className="text-3xl font-bold text-primary">{accuracy.toFixed(0)}%</p>
                        <p className="text-sm text-slate-400">Accuracy</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-primary">{correctAnswersCount}/{totalQuestions}</p>
                        <p className="text-sm text-slate-400">Score</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-primary">{timeTaken}<span className="text-lg">s</span></p>
                        <p className="text-sm text-slate-400">Time Taken</p>
                    </div>
                </div>

                <Button onClick={() => router.push('/dashboard')} size="lg" className="w-full">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </motion.div>
        </div>
    )
  }
  
  const currentItem = revisionItems[currentItemIndex];
  const progress = ((currentItemIndex + 1) / revisionItems.length) * 100;
  const isLastItem = currentItemIndex === revisionItems.length - 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
            <p className="text-sm text-slate-400 text-center">
                Item {currentItemIndex + 1} of {revisionItems.length}
            </p>
            <Progress value={progress} className="h-2 bg-slate-700" />
        </div>
        <AnimatePresence mode="wait">
            <motion.div
                key={currentItemIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="bg-slate-800/50 rounded-2xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-primary">{currentItem.topic}</CardTitle>
                        <CardDescription>{currentItem.content}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="font-semibold text-lg">{currentItem.question}</p>
                        <RadioGroup
                            value={selectedOption?.toString()}
                            onValueChange={(val) => setSelectedOption(parseInt(val))}
                            className="space-y-3"
                        >
                            {currentItem.options.map((option, index) => (
                                <div
                                key={index}
                                className="flex items-center space-x-3 p-4 border border-slate-700 rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors"
                                >
                                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`} className="text-base font-normal cursor-pointer flex-1">
                                    {option}
                                </Label>
                                </div>
                            ))}
                        </RadioGroup>
                         <div className="text-right">
                            {isLastItem ? (
                                <Button onClick={handleFinish} disabled={selectedOption === null}>
                                    Finish
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ): (
                                <Button onClick={handleNext} disabled={selectedOption === null}>
                                    Next
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                         </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function RevisionSessionPage() {
    return (
        <Suspense fallback={<div>Loading Lesson...</div>}>
            <RevisionSessionContent />
        </Suspense>
    )
}
