
'use client';

import React, { useState, useEffect } from 'react';
import type { QuizResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, RotateCcw, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import Link from 'next/link';
import { Home } from 'lucide-react';
import XpAnimation from '@/components/XpAnimation';
import StreakAnimation from '@/components/StreakAnimation';
import { updateUserStatsAfterQuiz } from '@/app/quiz/actions';

interface QuizResultsProps {
  results: QuizResult[];
  onRestart: () => void;
  restartButtonText?: string;
  RestartButtonIcon?: React.ElementType;
  fixedXpGained?: number;
}

const chartConfig: ChartConfig = {
  correct: {
    label: "Correct",
    color: "hsl(var(--accent))",
  },
  incorrect: {
    label: "Incorrect",
    color: "hsl(var(--destructive))",
  },
};

type AnimationState = {
  xp: number,
  streak: number,
  streakIncreased: boolean,
  stage: 'xp' | 'streak' | 'done';
}

export default function QuizResults({
  results,
  onRestart,
  restartButtonText = "Take Another Quiz",
  RestartButtonIcon = RotateCcw,
  fixedXpGained,
}: QuizResultsProps) {
  const [isUpdating, setIsUpdating] = useState(true);
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);

  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const totalQuestions = results.length;
  const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  // --- New Sensible XP Logic ---
  // If fixedXpGained is provided (e.g., from revision session), it acts as the Max XP.
  // Otherwise, default to 2 XP per correct answer.
  const maxPossibleXp = fixedXpGained !== undefined ? fixedXpGained : (totalQuestions * 2);
  const xpGained = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * maxPossibleXp) : 0;
  
  useEffect(() => {
    if (results.length === 0) {
        setIsUpdating(false);
        return;
    };
    
    // This effect runs once when the component mounts with the results
    const lastChapterId = results[results.length - 1].question.chapterId;
    updateUserStatsAfterQuiz(xpGained, lastChapterId)
      .then(({ streakIncreased, newStreak }) => {
        if (streakIncreased) {
          setAnimationState({ xp: xpGained, streak: newStreak, streakIncreased, stage: 'streak' });
        } else if (xpGained > 0) {
          setAnimationState({ xp: xpGained, streak: newStreak, streakIncreased, stage: 'xp' });
        } else {
          setIsUpdating(false);
        }
      })
      .catch(error => {
        console.error("Failed to update stats:", error);
        setIsUpdating(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, xpGained]);


  const chartData = [
    { name: 'correct', value: correctAnswers, fill: 'var(--color-correct)' },
    { name: 'incorrect', value: totalQuestions - correctAnswers, fill: 'var(--color-incorrect)' },
  ];

  const handleStreakComplete = () => {
    if (animationState && animationState.xp > 0) {
        setAnimationState(prev => prev ? { ...prev, stage: 'xp' } : null);
    } else {
        setAnimationState(prev => prev ? { ...prev, stage: 'done' } : null);
        setIsUpdating(false);
    }
  };

  const handleXpComplete = () => {
    setAnimationState(prev => prev ? { ...prev, stage: 'done' } : null);
    setIsUpdating(false);
  };
  
  if (isUpdating && !animationState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-bold">Calculating your results and updating stats...</p>
      </div>
    );
  }

  return (
    <>
      {animationState?.stage === 'streak' && (
        <StreakAnimation count={animationState.streak} onComplete={handleStreakComplete} />
      )}
      {animationState?.stage === 'xp' && animationState.xp > 0 && (
        <XpAnimation xp={animationState.xp} onComplete={handleXpComplete} />
      )}

      <div className={cn("space-y-6 md:space-y-8", isUpdating ? 'opacity-0' : 'opacity-100 transition-opacity duration-500')}>
        <Card className="text-center border-2 shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-black uppercase tracking-tight">Your Score</CardTitle>
            <CardDescription className="font-bold text-base">
              You answered {correctAnswers} out of {totalQuestions} correctly and earned <span className="text-primary">{xpGained} XP</span>!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[150px] md:h-[200px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  strokeWidth={5}
                  paddingAngle={5}
                >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <p className="text-5xl md:text-6xl font-black mt-4 tabular-nums">{score.toFixed(0)}%</p>
          </CardContent>
        </Card>
        
        <div>
          <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground mb-4 text-center">Review Your Answers</h3>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {results.map((result, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-2 rounded-2xl overflow-hidden">
                <AccordionTrigger 
                  className={cn(
                    'flex p-4 hover:no-underline font-bold text-left',
                    result.isCorrect 
                      ? 'bg-accent/10 hover:bg-accent/20' 
                      : 'bg-destructive/10 hover:bg-destructive/20'
                  )}
                >
                  <div className="flex flex-1 items-center space-x-3">
                    {result.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                    <span className="flex-1">Question {index + 1}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 md:p-6 border-t-2 bg-card">
                  <div className="text-foreground font-bold text-lg mb-4 leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html' }]]}>
                          {result.question.question}
                      </ReactMarkdown>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-secondary/50 border-2">
                      <span className="text-xs font-black uppercase text-muted-foreground block mb-1">Your answer</span>
                      <span className={cn('font-bold', result.isCorrect ? 'text-accent' : 'text-destructive')}>
                          {result.userAnswer !== null ? result.question.options[result.userAnswer] : 'Not answered'}
                      </span>
                    </div>
                    {!result.isCorrect && (
                      <div className="p-3 rounded-xl bg-accent/10 border-2 border-accent/20">
                          <span className="text-xs font-black uppercase text-accent block mb-1">Correct answer</span>
                          <span className="font-bold text-foreground">
                              {result.question.options[result.question.correctAnswer]}
                          </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 p-4 rounded-2xl bg-primary/5 border-2 border-primary/10">
                    <h4 className="text-xs font-black uppercase text-primary mb-2">Explanation</h4>
                    <div className="text-sm font-medium leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html' }]]}>
                          {result.question.explanation}
                      </ReactMarkdown>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onRestart} size="lg" className="w-full sm:w-auto h-14 rounded-full px-10">
              <RestartButtonIcon className="mr-2 h-5 w-5" />
              {restartButtonText}
          </Button>
          {RestartButtonIcon !== Home && (
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 rounded-full px-10">
                <Link href="/home">
                    <Home className="mr-2 h-5 w-5" />
                    Go to Home
                </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
