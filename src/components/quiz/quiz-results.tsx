'use client';

import type { QuizResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, RotateCcw, BookCheck } from 'lucide-react';
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
import { chapters } from '@/lib/data';
import { useMemo } from 'react';
import { Progress } from '../ui/progress';

interface QuizResultsProps {
  results: QuizResult[];
  onRestart: () => void;
  restartButtonText?: string;
  RestartButtonIcon?: React.ElementType;
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

const TopicBreakdown = ({ results }: { results: QuizResult[] }) => {
    const breakdown = useMemo(() => {
        const chapterResults: Record<string, { correct: number, total: number, name: string }> = {};

        results.forEach(result => {
            const { chapterId } = result.question;
            if (!chapterResults[chapterId]) {
                const chapterInfo = chapters.find(c => c.id === chapterId);
                chapterResults[chapterId] = { correct: 0, total: 0, name: chapterInfo?.name || 'Unknown Chapter' };
            }
            chapterResults[chapterId].total++;
            if (result.isCorrect) {
                chapterResults[chapterId].correct++;
            }
        });

        return Object.values(chapterResults);
    }, [results]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookCheck className="h-6 w-6 text-primary" />
                    Topic Breakdown
                </CardTitle>
                <CardDescription>Your performance in each chapter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {breakdown.map(topic => {
                    const percentage = (topic.correct / topic.total) * 100;
                    return (
                        <div key={topic.name}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <p className="font-medium">{topic.name}</p>
                                <p className="font-semibold">{topic.correct}/{topic.total}</p>
                            </div>
                             <Progress value={percentage} />
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
};

export default function QuizResults({ results, onRestart, restartButtonText, RestartButtonIcon }: QuizResultsProps) {
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const totalQuestions = results.length;
  const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  const chartData = [
    { name: 'correct', value: correctAnswers, fill: 'var(--color-correct)' },
    { name: 'incorrect', value: totalQuestions - correctAnswers, fill: 'var(--color-incorrect)' },
  ];

  const ButtonIcon = RestartButtonIcon || RotateCcw;

  return (
    <div className="space-y-6 md:space-y-8">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold">Your Score</CardTitle>
          <CardDescription>
            You answered {correctAnswers} out of {totalQuestions} questions correctly.
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
           <p className="text-5xl md:text-6xl font-bold mt-4">{score.toFixed(0)}%</p>
        </CardContent>
      </Card>
      
      <TopicBreakdown results={results} />

      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center">Review Your Answers</h3>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {results.map((result, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border-0 bg-card rounded-lg overflow-hidden">
              <AccordionTrigger 
                className={cn(
                  'flex p-3 hover:no-underline text-sm md:text-base',
                  result.isCorrect 
                    ? 'bg-accent/10 hover:bg-accent/20' 
                    : 'bg-destructive/10 hover:bg-destructive/20'
                )}
              >
                <div className="flex flex-1 items-center space-x-3 text-left">
                  {result.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  )}
                  <span className="flex-1 text-foreground font-medium">Question {index + 1}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 md:p-6 border-t border-border">
                <div className="text-foreground font-semibold mb-3 prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html' }]]}>
                        {result.question.question}
                    </ReactMarkdown>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    Your answer:{' '}
                    <span className={cn('font-medium inline', result.isCorrect ? 'text-accent' : 'text-destructive')}>
                        {result.userAnswer !== null ? result.question.options[result.userAnswer] : 'Not answered'}
                    </span>
                  </div>
                  {!result.isCorrect && (
                    <div>
                        Correct answer:{' '}
                        <span className="font-medium text-muted-foreground inline">
                            {result.question.options[result.question.correctAnswer]}
                        </span>
                    </div>
                  )}
                </div>
                <Alert className="mt-4 bg-secondary border-none">
                  <AlertTitle className="font-semibold">Explanation</AlertTitle>
                  <AlertDescription className="text-secondary-foreground/80">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html' }]]}>
                            {result.question.explanation}
                        </ReactMarkdown>
                    </div>
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center mt-8">
        <Button onClick={onRestart} size="lg">
            <ButtonIcon className="mr-2 h-4 w-4" />
            {restartButtonText || 'Take Another Quiz'}
        </Button>
      </div>
    </div>
  );
}
