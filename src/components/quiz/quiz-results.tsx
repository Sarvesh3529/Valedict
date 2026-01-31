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
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
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

interface QuizResultsProps {
  results: QuizResult[];
  onRestart: () => void;
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

export default function QuizResults({ results, onRestart }: QuizResultsProps) {
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const totalQuestions = results.length;
  const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  const chartData = [
    { name: 'correct', value: correctAnswers, fill: 'var(--color-correct)' },
    { name: 'incorrect', value: totalQuestions - correctAnswers, fill: 'var(--color-incorrect)' },
  ];

  return (
    <div className="space-y-8">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Your Score</CardTitle>
          <CardDescription>
            You answered {correctAnswers} out of {totalQuestions} questions correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
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
                strokeWidth={5}
              >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
              </Pie>
            </PieChart>
          </ChartContainer>
           <p className="text-5xl font-bold mt-4">{score.toFixed(0)}%</p>
        </CardContent>
      </Card>
      

      <div>
        <h3 className="text-xl font-semibold mb-4">Review Your Answers</h3>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {results.map((result, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
              <AccordionTrigger 
                className={cn(
                  'flex p-3 rounded-lg hover:no-underline',
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
                  <span className="flex-1 text-foreground">Question {index + 1}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 border border-border border-t-0 rounded-b-lg bg-card">
                <div className="prose dark:prose-invert max-w-none text-foreground font-semibold mb-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {result.question.question}
                    </ReactMarkdown>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    Your answer:{' '}
                    <span className={cn('prose prose-sm dark:prose-invert inline', result.isCorrect ? 'text-accent' : 'text-destructive')}>
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {result.userAnswer !== null ? result.question.options[result.userAnswer] : 'Not answered'}
                      </ReactMarkdown>
                    </span>
                  </p>
                  <p>
                    Correct answer:{' '}
                    <span className="font-medium text-muted-foreground prose prose-sm dark:prose-invert inline">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {result.question.options[result.question.correctAnswer]}
                        </ReactMarkdown>
                    </span>
                  </p>
                </div>
                <Alert className="mt-4 bg-secondary border-none">
                  <AlertTitle>Explanation</AlertTitle>
                  <AlertDescription className="text-secondary-foreground/80">
                    <div className="prose prose-sm max-w-none dark:prose-invert text-secondary-foreground/80">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
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
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Another Quiz
        </Button>
      </div>
    </div>
  );
}
