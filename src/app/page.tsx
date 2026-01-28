'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BrainCircuit, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <BrainCircuit className="h-20 w-20 text-primary" />
        <h1 className="text-5xl md:text-6xl font-bold font-headline text-white">
          ExamPrep AI
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-xl">
          Your personal AI-powered study partner. Let's get you ready for your exams.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
        className="mt-12"
      >
        <Button asChild size="lg" className="rounded-full px-10 py-6 text-lg">
          <Link href="/onboarding/start">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
