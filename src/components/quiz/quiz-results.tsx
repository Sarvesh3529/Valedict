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

interface QuizResultsProps {
  results: QuizResult[];
  onRestart: () => void;
}

const chartConfig: ChartConfig = {
  correct: {
    label: "Correct",
    color: "hsl(var(--primary))",
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
              <AccordionTrigger className={`flex p-3 rounded-lg ${result.isCorrect ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'}`}>
                <div className="flex items-center space-x-3 text-left">
                  {result.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                  <span className="flex-1">Question {index + 1}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 border border-t-0 rounded-b-lg">
                <p className="font-semibold mb-2">{result.question.question}</p>
                <div className="space-y-2 text-sm">
                  <p>
                    Your answer:{' '}
                    <span className={result.isCorrect ? 'text-green-700' : 'text-red-700'}>
                      {result.userAnswer !== null ? result.question.options[result.userAnswer] : 'Not answered'}
                    </span>
                  </p>
                  <p>
                    Correct answer:{' '}
                    <span className="font-medium">
                      {result.question.options[result.question.correctAnswer]}
                    </span>
                  </p>
                </div>
                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <AlertTitle className="text-blue-800">Explanation</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    {result.question.explanation}
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
