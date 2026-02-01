'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Flame, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StreakAnimationProps {
  count: number;
  onComplete: () => void;
}

export default function StreakAnimation({ count, onComplete }: StreakAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // Animation lasts 3.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onComplete} // Allow user to click away
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            },
          }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          className="relative"
        >
          <Card className="w-80 border-primary bg-background/90 shadow-2xl shadow-primary/20">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 10,
                  delay: 0.5,
                  duration: 0.5,
                }}
                className="relative mb-4"
              >
                <BrainCircuit className="h-24 w-24 text-primary" />
                 <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-pulse" />
                 <Sparkles className="absolute -bottom-2 -left-2 h-6 w-6 text-yellow-300 animate-pulse delay-200" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="font-headline text-3xl font-bold"
              >
                Streak Increased!
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-4 flex items-center gap-3 text-5xl font-bold text-orange-500"
              >
                <Flame className="h-12 w-12" />
                <span className="font-headline">{count}</span>
              </motion.div>
               <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-2 text-muted-foreground"
              >
                Keep up the great work!
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
