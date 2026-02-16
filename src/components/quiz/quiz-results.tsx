'use client';

import type { QuizResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, RotateCcw, Home } from 'lucide-react';
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
      
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center">Review Your Answers</h3>
        <Accordion type="single" collapsible className="w-full">
          {results.map((result, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger 
                className={cn(
                  'flex p-3 hover:no-underline',
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
              <AccordionContent className="p-4 md:p-6 border-t">
                <div className="text-foreground font-semibold mb-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html' }]]}>
                        {result.question.question}
                    </ReactMarkdown>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    Your answer:{' '}
                    <span className={cn('font-medium', result.isCorrect ? 'text-accent' : 'text-destructive')}>
                        {result.userAnswer !== null ? result.question.options[result.userAnswer] : 'Not answered'}
                    </span>
                  </div>
                  {!result.isCorrect && (
                    <div>
                        Correct answer:{' '}
                        <span className="font-medium text-muted-foreground">
                            {result.question.options[result.question.correctAnswer]}
                        </span>
                    </div>
                  )}
                </div>
                <Alert className="mt-4">
                  <AlertTitle>Explanation</AlertTitle>
                  <AlertDescription>
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html' }]]}>
                        {result.question.explanation}
                    </ReactMarkdown>
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onRestart} size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Another Quiz
        </Button>
         <Button asChild size="lg" variant="outline">
            <Link href="/home">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
            </Link>
        </Button>
      </div>
    </div>
  );
}
