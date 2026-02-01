'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, Check, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { onboardingQuestions, type OnboardingQuestion } from '@/lib/onboarding-questions';
import { saveOnboardingResponse } from '@/firebase/onboarding';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100;
  return (
    <div className="w-full bg-slate-700 rounded-full h-2.5">
      <div
        className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [date, setDate] = useState<Date>();
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);
  
  const handleAnswer = useCallback(async (question: OnboardingQuestion, answer: any) => {
    if (isAnimating || !user) return;
    setIsAnimating(true);
    
    const newResponses = { ...responses, [question.firestoreField]: answer };
    setResponses(newResponses);

    await saveOnboardingResponse(user.uid, { [question.firestoreField]: answer });

    setTimeout(() => {
      if (currentQuestionIndex < onboardingQuestions.length -1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnimating(false);
      } else {
        // This is the last question, handle completion
        localStorage.setItem('onboardingComplete', 'true');
        const grade = newResponses.grade;
        const troublingSubjects = (newResponses.troublingSubjects || []) as string[];

        if (troublingSubjects.length > 0 && grade) {
            const subjectsParam = troublingSubjects.join(',');
            router.push(`/revision/start?subjects=${subjectsParam}&grade=${grade}`);
        } else {
            router.push('/home');
        }
      }
    }, 400);
  }, [isAnimating, user, responses, currentQuestionIndex, router]);


  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  const question = onboardingQuestions[currentQuestionIndex];

  const renderQuestionType = () => {
    switch (question.type) {
      case 'single-choice':
        return (
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleAnswer(question, option.value)}
                className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-left w-full hover:bg-slate-700 hover:border-primary transition-all duration-200"
                whileTap={{ scale: 0.98 }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        );
      case 'multi-select':
        const selectedOptions = responses[question.firestoreField] || [];
        const toggleOption = (optionValue: string) => {
          const newSelection = selectedOptions.includes(optionValue)
            ? selectedOptions.filter((v: string) => v !== optionValue)
            : [...selectedOptions, optionValue];
          setResponses({ ...responses, [question.firestoreField]: newSelection });
        };
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options?.map((option) => {
                const isSelected = selectedOptions.includes(option.value);
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "p-4 bg-slate-800 rounded-xl border text-left w-full transition-all duration-200 flex items-center justify-between",
                      isSelected ? 'border-primary ring-2 ring-primary' : 'border-slate-700'
                    )}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{option.label}</span>
                     {isSelected && <Check className="w-5 h-5 text-primary" />}
                  </motion.button>
                );
              })}
            </div>
            <Button 
              onClick={() => handleAnswer(question, selectedOptions)} 
              disabled={selectedOptions.length === 0}
              size="lg"
              className="w-full mt-6"
            >
              Continue <ChevronRight className="w-5 h-5 ml-1"/>
            </Button>
          </>
        );
      case 'slider':
        return (
          <div className="pt-4">
             <Slider
                defaultValue={[3]}
                min={1}
                max={5}
                step={1}
                onValueCommit={(value) => handleAnswer(question, value[0])}
            />
            <div className="flex justify-between text-sm text-slate-400 mt-2">
                <span>Not difficult</span>
                <span>Very difficult</span>
            </div>
          </div>
        );
      case 'date':
        return (
            <div className="flex flex-col items-center gap-4 pt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white",
                    !date && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700 text-white">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate)
                        handleAnswer(question, format(selectedDate, "PPP"))
                      }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
             <Button variant="link" onClick={() => handleAnswer(question, 'Not Sure Yet')} className="text-primary hover:text-primary/80">
                Not Sure Yet
            </Button>
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900 text-white">
        <div className="w-full max-w-md mx-auto space-y-8">
          <ProgressBar current={currentQuestionIndex} total={onboardingQuestions.length} />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-slate-800/50 p-6 rounded-2xl shadow-2xl"
            >
              <h1 className="text-2xl font-bold mb-6 text-center">{question.text}</h1>
              {renderQuestionType()}
            </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
}
