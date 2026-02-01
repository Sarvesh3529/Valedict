'use client';

import { useState } from 'react';
import type { QuizQuestion, QuizResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';

interface QuizViewProps {
  questions: QuizQuestion[];
  onFinish: (results: QuizResult[]) => void;
}

export default function QuizView({ questions, onFinish }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // The currently selected option is derived directly from the answers array for this question
  const selectedOption = userAnswers[currentQuestionIndex];

  const handleOptionChange = (value: string) => {
    const answerIndex = parseInt(value, 10);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const results: QuizResult[] = questions.map((question, index) => ({
      question,
      userAnswer: userAnswers[index],
      isCorrect: userAnswers[index] === question.correctAnswer,
    }));
    onFinish(results);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
            </p>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <div className="space-y-4">
        <div className="text-lg md:text-xl font-semibold leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html' }]]}>
            {currentQuestion.question}
          </ReactMarkdown>
        </div>
        <RadioGroup
          key={currentQuestionIndex}
          value={selectedOption?.toString()}
          onValueChange={handleOptionChange}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 md:p-4 border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors"
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-sm md:text-base font-normal cursor-pointer flex-1">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html' }]]}>
                    {option}
                </ReactMarkdown>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleBack} disabled={currentQuestionIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>
        {isLastQuestion ? (
          <Button onClick={handleSubmit} disabled={selectedOption === null} className="bg-accent hover:bg-accent/90">
            Submit Quiz
            <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={selectedOption === null}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
