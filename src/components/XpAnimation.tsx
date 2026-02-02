'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface XpAnimationProps {
  xp: number;
  onComplete: () => void;
}

export default function XpAnimation({ xp, onComplete }: XpAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Animation lasts 2.5 seconds

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
          <Card className="w-60 border-yellow-400 bg-background/90 shadow-2xl shadow-yellow-500/20">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                initial={{ scale: 0, y: -50 }}
                animate={{ scale: 1, y: 0, rotate: [0, 20, -20, 0] }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 10,
                  delay: 0.5,
                  duration: 0.8,
                }}
                className="relative mb-4"
              >
                <Star className="h-20 w-20 text-yellow-400 fill-yellow-400" />
                 <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300 animate-pulse" />
                 <Sparkles className="absolute bottom-1 -left-2 h-5 w-5 text-yellow-200 animate-pulse delay-200" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="font-headline text-4xl font-bold text-yellow-400"
              >
                +{xp} XP
              </motion.h2>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
