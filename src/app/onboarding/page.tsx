'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, Check, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { useFirebaseApp } from '@/firebase';
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
  const app = useFirebaseApp();
  const [anonUser, setAnonUser] = useState<User | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [date, setDate] = useState<Date>();
  
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAnonUser(user);
        localStorage.setItem('anonymousUserId', user.uid);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
        });
      }
    });
    return () => unsubscribe();
  }, [app]);
  
  const handleAnswer = useCallback(async (question: OnboardingQuestion, answer: any) => {
    if (isAnimating || !anonUser) return;
    setIsAnimating(true);
    
    const newResponses = { ...responses, [question.firestoreField]: answer };
    setResponses(newResponses);

    await saveOnboardingResponse(anonUser.uid, { [question.firestoreField]: answer });

    setTimeout(() => {
      if (currentQuestionIndex < onboardingQuestions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      setIsAnimating(false);
    }, 400); // Animation duration
  }, [isAnimating, anonUser, responses, currentQuestionIndex]);

  useEffect(() => {
    if (currentQuestionIndex >= onboardingQuestions.length) {
        localStorage.setItem('onboardingComplete', 'true');

        const determineNextStep = () => {
            const grade = responses.grade;
            const troublingSubjects = (responses.troublingSubjects || []) as string[];

            if (troublingSubjects.length > 0 && grade) {
                const subjectsParam = troublingSubjects.join(',');
                router.push(`/revision/start?subjects=${subjectsParam}&grade=${grade}`);
            } else {
                router.push('/home');
            }
        };

        const timer = setTimeout(determineNextStep, 2000);
        return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, responses, router]);

  if (currentQuestionIndex >= onboardingQuestions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full"
        >
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">You're all set!</h1>
          <p className="text-slate-400 mb-6">We’re personalizing your study plan... 🎯</p>
        </motion.div>
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
